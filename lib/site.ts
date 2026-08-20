export const company = {
  name: 'Dingmao Precision',
  legalName: 'Jiaxing Dingmao Precision Technology Co., Ltd.',
  email: 'info@dingmaoprecision.com',
  phones: ['+86 181 5736 1399', '+86 199 5733 9580'],
  address: 'Room 102, Building 1, No. 1228 Jiachuang Road, Xiuzhou District, Jiaxing, Zhejiang, China',
}

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Industries', href: '/industries' },
  { label: 'Quality', href: '/quality' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
] as const

export const requiredRoutes = ['/', '/products', '/capabilities', '/industries', '/quality', '/about', '/faq', '/news', '/contact'] as const

export const homeSections = ['hero', 'proof', 'categories', 'products', 'capabilities', 'industries', 'equipment', 'process', 'faq', 'news', 'inquiry'] as const

export const faqs = [
  ['What part sizes can you manufacture?', 'Our current machining range covers outside diameters from 0.5 mm to 38 mm. Final feasibility is confirmed against the drawing and tolerance requirements.'],
  ['Can you work with custom drawings?', 'Yes. We support custom dimensions, materials, finishes, and processes for drawing-based OEM and ODM projects.'],
  ['Can samples be produced before volume production?', 'Yes. Sampling can be arranged after the drawing, material, tooling, and sampling charge are confirmed.'],
  ['What is the usual minimum order quantity?', 'Order quantity depends on part complexity. A typical reference is 10,000 pieces for simpler parts and 3,000 pieces for more complex parts.'],
  ['Which industries do you serve?', 'Applications include automotive, communications, air-tool, sensor, medical, lighting, pneumatic, filtration, and industrial equipment components.'],
  ['Can inspection documents be provided?', 'Technical data and inspection reports can be discussed and confirmed as part of the order requirements.'],
] as const
