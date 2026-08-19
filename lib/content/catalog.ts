import type { Catalog, CatalogProduct } from './types.ts'

type SourceCategory = { id: string; name: string; count: number }
type SourceProduct = {
  offerId: string
  sourceTitle: string
  sourceImage: string
  sourceUrl: string
  sourceCategoryId: string
  sourceCategoryName: string
  localImage: string
}
type SourceSnapshot = {
  categories: SourceCategory[]
  products: SourceProduct[]
}

const categoryNames: Record<string, string> = {
  '1045498': 'Precision Machined Components',
  '10353': 'General Hardware Components',
  '141906': 'Fasteners & Connectors',
  '10227': 'Lighting Components',
  '141903': 'Bearing Components',
  '1032471': 'Pneumatic Components',
  '10347': 'Filtration Components',
  '1032438': 'Mold Standard Components',
  '141907': 'Valve Components',
  '1032077': 'Material Handling Components',
}

const materialMatchers = [
  ['不锈钢', 'Stainless Steel'],
  ['黄铜', 'Brass'],
  ['紫铜', 'Copper'],
  ['铜', 'Copper'],
  ['铝', 'Aluminum'],
] as const

const componentMatchers = [
  ['喷嘴', 'Nozzle'],
  ['喷头', 'Nozzle'],
  ['螺帽', 'Nut'],
  ['螺母', 'Nut'],
  ['螺栓', 'Bolt'],
  ['螺丝', 'Screw'],
  ['接头', 'Connector'],
  ['连接件', 'Connector'],
  ['转接头', 'Adapter'],
  ['套筒', 'Sleeve'],
  ['套管', 'Sleeve'],
  ['轴', 'Shaft'],
  ['销', 'Pin'],
  ['阀', 'Valve Component'],
  ['过滤', 'Filter Component'],
  ['灯', 'Lighting Component'],
  ['紧固', 'Fastener'],
] as const

const applicationMatchers = [
  ['医疗', 'Medical'],
  ['气动', 'Pneumatic'],
  ['气压', 'Pneumatic'],
  ['传感器', 'Sensor'],
  ['汽车', 'Automotive'],
  ['通讯', 'Communication'],
  ['通信', 'Communication'],
  ['机械', 'Industrial'],
] as const

function firstMatch(title: string, matchers: readonly (readonly [string, string])[]) {
  return matchers.find(([source]) => title.includes(source))?.[1]
}

function normalizedName(product: SourceProduct) {
  const material = firstMatch(product.sourceTitle, materialMatchers)
  const application = firstMatch(product.sourceTitle, applicationMatchers)
  const component = firstMatch(product.sourceTitle, componentMatchers) ?? 'Precision Component'
  return [...new Set([material, application, component].filter(Boolean))].join(' ')
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeProduct(product: SourceProduct): CatalogProduct {
  const name = normalizedName(product)
  const categoryName = categoryNames[product.sourceCategoryId] ?? 'Custom Precision Components'
  const slug = `${slugify(name)}-${product.offerId}`
  return {
    id: product.offerId,
    slug,
    name,
    description: `${name} manufactured to customer drawings for ${categoryName.toLowerCase()}. Dimensions, material, finish, tolerances, and production quantities are confirmed through the RFQ review.`,
    categoryId: product.sourceCategoryId,
    categoryName,
    image: product.localImage,
    sourceUrl: product.sourceUrl,
    inquiryHref: `/contact?product=${encodeURIComponent(product.offerId)}`,
  }
}

export function buildFallbackCatalog(snapshot: SourceSnapshot, locale = 'en'): Catalog {
  if (locale !== 'en') {
    return buildFallbackCatalog(snapshot, 'en')
  }

  return {
    categories: snapshot.categories.map((category) => ({
      id: category.id,
      name: categoryNames[category.id] ?? category.name,
      count: category.count,
      slug: slugify(categoryNames[category.id] ?? category.name),
    })),
    products: snapshot.products.map(normalizeProduct),
  }
}
