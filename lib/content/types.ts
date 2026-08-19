export type CatalogCategory = {
  id: string
  name: string
  count: number
  slug: string
}

export type CatalogProduct = {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  categoryName: string
  image: string
  sourceUrl: string
  inquiryHref: string
}

export type Catalog = {
  categories: CatalogCategory[]
  products: CatalogProduct[]
}
