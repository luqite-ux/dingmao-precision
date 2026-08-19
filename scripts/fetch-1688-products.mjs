import { createHash } from 'node:crypto'
import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const MEMBER_ID = 'b2b-2212842386990a416f'
const APP_KEY = '12574478'
const API = 'mtop.mbox.fc.common.gateway'
const ENDPOINT = `https://h5api.m.1688.com/h5/${API}/2.0/`
const outputDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data')
const productImageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public/products',
)

let cookies = ''

function getToken() {
  const match = cookies.match(/(?:^|;\s*)_m_h5_tk=([^;]+)/)
  return match?.[1]?.split('_')[0] ?? ''
}

function mergeCookies(headers) {
  const values = headers.getSetCookie?.() ?? []
  const jar = new Map(
    cookies
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.split(/=(.*)/s).slice(0, 2)),
  )

  for (const value of values) {
    const [pair] = value.split(';')
    const [name, content] = pair.split(/=(.*)/s).slice(0, 2)
    jar.set(name, content)
  }

  cookies = [...jar].map(([name, value]) => `${name}=${value}`).join('; ')
}

function requestData(serviceName, params) {
  return JSON.stringify({
    fcGroup: 'cbu-seller-fc',
    fcName: 'factory-card-common-fn',
    serviceName,
    params: JSON.stringify(params),
  })
}

async function request(serviceName, params, retry = true) {
  const data = requestData(serviceName, params)
  const timestamp = String(Date.now())
  const token = getToken()
  const sign = token
    ? createHash('md5').update(`${token}&${timestamp}&${APP_KEY}&${data}`).digest('hex')
    : ''
  const query = new URLSearchParams({
    jsv: '2.7.4',
    appKey: APP_KEY,
    v: '2.0',
    type: 'json',
    dataType: 'json',
    data,
    t: timestamp,
    sign,
  })
  const response = await fetch(`${ENDPOINT}?${query}`, {
    headers: cookies ? { cookie: cookies } : undefined,
  })
  mergeCookies(response.headers)
  const payload = await response.json()

  if (retry && (!token || payload.ret?.some((entry) => entry.includes('TOKEN')))) {
    return request(serviceName, params, false)
  }
  if (!payload.ret?.some((entry) => entry.startsWith('SUCCESS'))) {
    throw new Error(`1688 request failed: ${payload.ret?.join(', ') ?? 'unknown error'}`)
  }
  return payload.data
}

async function fetchCategories() {
  const data = await request('recommendItemTabV3Service', {
    facMemberId: MEMBER_ID,
    isPC: 'Y',
  })
  return data.result.filter((category) => category.id !== 'all')
}

async function fetchCategoryProducts(category) {
  const products = []
  let pageNo = 1

  while (pageNo) {
    const data = await request('recommendRollingItemV3Service', {
      facMemberId: MEMBER_ID,
      extendParam: {
        tabIds: category.id,
        tabIndex: 0,
        sortType: '',
        pageNo,
        pageSize: 10,
        isPC: 'Y',
      },
    })
    const result = data.result ?? {}
    const items = (result.items ?? []).filter((item) => item.type !== 'sectionTag')
    products.push(...items)

    const next = Number(result.nextPageNo || 0)
    pageNo = items.length === 10 && next > pageNo ? next : 0
  }

  return products.map((item) => ({
    offerId: String(item.offerId ?? item.itemId),
    sourceTitle: item.offerSubject,
    sourceImage: item.imgUrl,
    sourceUrl: `https://detail.1688.com/offer/${item.offerId ?? item.itemId}.html`,
    sourceCategoryId: String(category.id),
    sourceCategoryName: category.name,
    localImage: `/products/${item.offerId ?? item.itemId}.jpg`,
  }))
}

async function downloadProductImage(product) {
  const destination = path.join(productImageDir, `${product.offerId}.jpg`)
  try {
    await access(destination)
    return
  } catch {
    // Download the audited source asset only when it is not already present.
  }

  const response = await fetch(product.sourceImage)
  if (!response.ok) {
    throw new Error(`Image download failed for ${product.offerId}: ${response.status}`)
  }
  await writeFile(destination, Buffer.from(await response.arrayBuffer()))
}

async function downloadProductImages(products) {
  await mkdir(productImageDir, { recursive: true })
  for (let index = 0; index < products.length; index += 8) {
    await Promise.all(products.slice(index, index + 8).map(downloadProductImage))
  }
}

export async function fetchCatalog(memberId = MEMBER_ID) {
  if (memberId !== MEMBER_ID) {
    throw new Error(`Unexpected member ID: ${memberId}`)
  }

  const categories = await fetchCategories()
  const grouped = []
  for (const category of categories) {
    grouped.push(...(await fetchCategoryProducts(category)))
  }

  const products = [...new Map(grouped.map((product) => [product.offerId, product])).values()]
  return {
    memberId,
    sourceUrl: `https://sale.1688.com/factory/l6rr893d.html?memberId=${memberId}`,
    fetchedAt: new Date().toISOString(),
    categories: categories.map(({ id, name, count }) => ({
      id: String(id),
      name,
      count: Number(count),
    })),
    products,
  }
}

const catalog = await fetchCatalog()
await downloadProductImages(catalog.products)
await mkdir(outputDir, { recursive: true })
await writeFile(
  path.join(outputDir, '1688-products.json'),
  `${JSON.stringify(catalog, null, 2)}\n`,
  'utf8',
)
console.log(`Saved ${catalog.products.length} products across ${catalog.categories.length} categories.`)
