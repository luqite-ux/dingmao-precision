from pathlib import Path
import subprocess

import cv2
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public" / "products"
MODEL = ROOT / ".tmp" / "models" / "FSRCNN_x2.pb"


def original_image(path: Path) -> np.ndarray:
    relative = path.relative_to(ROOT).as_posix()
    encoded = subprocess.run(
        ["git", "show", f"HEAD:{relative}"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    ).stdout
    return cv2.imdecode(np.frombuffer(encoded, np.uint8), cv2.IMREAD_COLOR)


def remove_template_text(image: np.ndarray, offer_id: int) -> np.ndarray:
    cleaned = image.copy()
    white = (255, 255, 255)
    if offer_id >= 770_000_000_000:
        cleaned[:120, :] = white
        cleaned[610:, :] = white
        cleaned[:, :28] = white
        cleaned[:, 772:] = white
    else:
        cleaned[575:, :] = white
        cleaned[:155, :165] = white
    return cleaned


def detect_product_bounds(image: np.ndarray, offer_id: int) -> tuple[int, int, int, int]:
    detect = remove_template_text(image, offer_id)
    gray = cv2.cvtColor(detect, cv2.COLOR_BGR2GRAY)
    saturation = cv2.cvtColor(detect, cv2.COLOR_BGR2HSV)[:, :, 1]
    mask = ((gray < 225) | (saturation > 42)).astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    count, _, stats, _ = cv2.connectedComponentsWithStats(mask)
    candidates = []
    for index in range(1, count):
        x, y, width, height, area = stats[index]
        intersects_center = x + width > 150 and x < 750 and y + height > 110 and y < 610
        is_not_frame = not (height > 380 and width < 22)
        if area >= 180 and intersects_center and is_not_frame:
            candidates.append((x, y, width, height, area))
    if not candidates:
        return 0, 0, image.shape[1], image.shape[0]
    largest = max(item[4] for item in candidates)
    selected = [item for item in candidates if item[4] >= max(450, largest * 0.075)]
    left = min(item[0] for item in selected)
    top = min(item[1] for item in selected)
    right = max(item[0] + item[2] for item in selected)
    bottom = max(item[1] + item[3] for item in selected)
    margin = 38
    return max(0, left - margin), max(0, top - margin), min(800, right + margin), min(800, bottom + margin)


def isolate_product(image: np.ndarray) -> tuple[np.ndarray, tuple[int, int, int, int]]:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    saturation = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)[:, :, 1]
    mask = ((gray < 238) | (saturation > 32)).astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
    keep = np.zeros_like(mask)
    for index in range(1, count):
        x, y, width, height, area = stats[index]
        is_product_scale = area >= 1200 and width >= 9 and height >= 9
        is_not_frame = not (height > 400 and width < 18)
        if is_product_scale and is_not_frame:
            keep[labels == index] = 255
    keep = cv2.dilate(keep, np.ones((5, 5), np.uint8), iterations=1)
    keep = cv2.GaussianBlur(keep, (7, 7), 0)
    points = cv2.findNonZero(keep)
    if points is None:
        return image, (0, 0, image.shape[1], image.shape[0])
    x, y, width, height = cv2.boundingRect(points)
    margin = 28
    bounds = max(0, x - margin), max(0, y - margin), min(image.shape[1], x + width + margin), min(image.shape[0], y + height + margin)
    white = np.full_like(image, 255)
    alpha = keep.astype(np.float32)[:, :, None] / 255
    isolated = (image * alpha + white * (1 - alpha)).astype(np.uint8)
    return isolated, bounds


def enhance(super_resolution, image: np.ndarray) -> np.ndarray:
    upscaled = super_resolution.upsample(image)
    blurred = cv2.GaussianBlur(upscaled, (0, 0), 1.15)
    return cv2.addWeighted(upscaled, 1.32, blurred, -0.32, 0)


def main() -> None:
    if not MODEL.exists():
        raise FileNotFoundError(f"Missing AI model: {MODEL}")
    super_resolution = cv2.dnn_superres.DnnSuperResImpl_create()
    super_resolution.readModel(str(MODEL))
    super_resolution.setModel("fsrcnn", 2)

    files = sorted(PRODUCTS.glob("*.jpg"))
    if len(files) != 86:
        raise RuntimeError(f"Expected 86 source images, found {len(files)}")

    for path in files:
        offer_id = int(path.stem)
        source = original_image(path)
        left, top, right, bottom = detect_product_bounds(source, offer_id)
        crop = source[top:bottom, left:right]
        crisp = enhance(super_resolution, crop)
        max_side = 1320
        scale = min(max_side / crisp.shape[1], max_side / crisp.shape[0])
        fitted = cv2.resize(crisp, None, fx=scale, fy=scale, interpolation=cv2.INTER_LANCZOS4)
        canvas = np.full((1600, 1600, 3), 255, dtype=np.uint8)
        x = (1600 - fitted.shape[1]) // 2
        y = (1600 - fitted.shape[0]) // 2
        canvas[y:y + fitted.shape[0], x:x + fitted.shape[1]] = fitted
        cv2.imwrite(str(path), canvas, [cv2.IMWRITE_JPEG_QUALITY, 94])

    print(f"AI-cleaned and enhanced {len(files)} product images")


if __name__ == "__main__":
    main()
