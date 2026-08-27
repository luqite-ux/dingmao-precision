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

export function getIconGridLayout(itemCount: number) {
  if (itemCount === 5) return 'icon-page-grid--industries'
  if (itemCount === 6) return 'icon-page-grid--capabilities'
  return ''
}

export const visualPages = {
  industries: {
    heroImages: [
      { src: '/products-ai/911919047728.jpg', alt: 'Automotive precision component manufactured by Dingmao', label: 'Automotive interface' },
      { src: '/products-ai/851736252645.jpg', alt: 'Communication connector manufactured by Dingmao', label: '5G connector' },
      { src: '/products-ai/827354457551.jpg', alt: 'Medical connector manufactured by Dingmao', label: 'Medical connector' },
    ],
    metrics: [['5 application groups', 'Current representative scope'], ['Drawing-based', 'Application review'], ['Order-specific', 'Inspection requirements']],
    items: [
      { title: 'Automotive components', eyebrow: 'AUTOMOTIVE', text: 'Interfaces, fittings, sleeves, shafts, and custom mechanical parts reviewed around the mating assembly.', image: '/products-ai/911919047728.jpg' },
      { title: 'Communication equipment', eyebrow: 'COMMUNICATIONS', text: 'Compact structural and conductive components, including connector and optical-interface geometries.', image: '/products-ai/851736252645.jpg' },
      { title: 'Air-tool & pneumatic', eyebrow: 'PNEUMATIC', text: 'Nozzles, threaded bodies, connectors, and valve-related components for controlled air paths.', image: '/products-ai/827323925194.jpg' },
      { title: 'Sensor assemblies', eyebrow: 'SENSORS', text: 'Small turned housings, pins, and precision interfaces for measurement and connected assemblies.', image: '/products-ai/771952089765.jpg' },
      { title: 'Medical equipment', eyebrow: 'MEDICAL', text: 'Drawing-based precision components with material and inspection requirements confirmed per order.', image: '/products-ai/827354457551.jpg' },
    ],
  },
  capabilities: {
    heroImages: [
      { src: '/products-ai/771945202977.jpg', alt: 'Stainless steel precision connector manufactured by Dingmao', label: 'Turned stainless part' },
      { src: '/products-ai/851736252645.jpg', alt: 'Precision communication connector manufactured by Dingmao', label: 'Multi-feature connector' },
      { src: '/products-ai/771930555427.jpg', alt: 'Precision machined component manufactured by Dingmao', label: 'Machined detail' },
    ],
    metrics: [['0.5–38 mm', 'Outside diameter range'], ['~200', 'Machines listed'], ['3–15 days', 'Sampling reference']],
  },
} as const

export const faqs = [
  ['What part sizes can you manufacture?', 'Our current machining range covers outside diameters from 0.5 mm to 38 mm. Final feasibility is confirmed against the drawing and tolerance requirements.'],
  ['Can you work with custom drawings?', 'Yes. We support custom dimensions, materials, finishes, and processes for drawing-based OEM and ODM projects.'],
  ['Can samples be produced before volume production?', 'Yes. Sampling can be arranged after the drawing, material, tooling, and sampling charge are confirmed.'],
  ['What is the usual minimum order quantity?', 'Order quantity depends on part complexity. A typical reference is 10,000 pieces for simpler parts and 3,000 pieces for more complex parts.'],
  ['Which industries do you serve?', 'Applications include automotive, communications, air-tool, sensor, medical, lighting, pneumatic, filtration, and industrial equipment components.'],
  ['Can inspection documents be provided?', 'Technical data and inspection reports can be discussed and confirmed as part of the order requirements.'],
] as const
