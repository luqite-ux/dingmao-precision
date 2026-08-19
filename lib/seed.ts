import { company } from './site.ts'

export function buildTenantPayload(baseUrl: string) {
  const base = baseUrl.replace(/\/$/, '')
  return {
    display_name: '嘉兴鼎茂精密科技有限公司',
    name: company.name,
    domain: base.replace(/^https?:\/\//, ''),
    admin_group: 2,
    brand_color: '#b9c400',
    logo_url: `${base}/brand/logo.png`,
    favicon_url: `${base}/brand/logo.png`,
    default_language: 'en',
    supported_languages: ['en'],
    site_title_i18n: { en: 'Dingmao Precision | Custom CNC Components' },
    site_tagline_i18n: { en: 'Small parts. Exact outcomes.' },
    site_description_i18n: { en: 'Drawing-based Swiss turning, CNC turning, and precision component manufacturing in Jiaxing, China.' },
    contact_email: company.email,
    contact_phone: company.phones.join(' / '),
    contact_whatsapp: '',
    contact_address_short: 'Jiaxing, Zhejiang, China',
    contact_address_i18n: { en: company.address },
    social_links: {},
    seo_title_i18n: { en: 'Custom Precision CNC Components | Dingmao Precision' },
    seo_description_i18n: { en: 'Jiaxing precision manufacturer for drawing-based CNC, Swiss-turned, fastener, pneumatic, sensor, medical, and industrial components.' },
    seo_keywords_i18n: { en: ['precision CNC components', 'Swiss turning China', 'custom fasteners', 'Jiaxing machining manufacturer'] },
    google_analytics_id: '',
    google_tag_manager_id: '',
    extra_settings: {
      source: 'Customer workbook and 1688 member b2b-2212842386990a416f',
      initialized_at: new Date().toISOString(),
      manually_maintained_fields: [],
    },
  }
}
