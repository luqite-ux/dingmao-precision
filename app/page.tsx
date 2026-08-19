import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, CircuitBoard, Cog, Gauge, ScanLine, Stethoscope, Wind } from 'lucide-react'

import { PrecisionHero } from '@/components/home/PrecisionHero'
import { faqs } from '@/lib/site'
import { getPublishedArticles } from '@/lib/supabase/articles'
import { getProducts } from '@/lib/supabase/products'

export default async function HomePage() {
  const [products, articles] = await Promise.all([getProducts('en'), getPublishedArticles('en')])
  const featured = products.slice(0, 6)
  const categories = [...new Map(products.map((product) => [product.categoryId, product.categoryName])).entries()]
  return <>
    <PrecisionHero />
    <section className="ticker" id="proof"><span>SWISS TURNING</span><i /> <span>CNC TURNING</span><i /> <span>MILL-TURN</span><i /> <span>INSPECTION</span><i /> <span>GLOBAL RFQ SUPPORT</span></section>
    <section className="section categories" id="categories">
      <div className="section-heading"><span className="eyebrow">PRODUCT ARCHITECTURE</span><h2>One machining platform.<br />A wide component matrix.</h2><p>Browse representative parts sourced from our current manufacturing catalog. Every production discussion starts from your drawing.</p></div>
      <div className="category-list">{categories.map(([id, name], index) => <Link href={`/products?category=${id}`} key={id}><span>{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3><ArrowRight size={20} /></Link>)}</div>
    </section>
    <section className="section product-showcase" id="products">
      <div className="section-heading row"><div><span className="eyebrow">SELECTED COMPONENTS</span><h2>Built around geometry,<br />material, and function.</h2></div><Link className="text-link" href="/products">View all 86 products <ArrowRight size={17} /></Link></div>
      <div className="product-grid">{featured.map((product, index) => <Link className="product-card" href={`/products/${product.slug}`} key={product.id}>
        <div className="product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
        <span>{String(index + 1).padStart(2, '0')} · {product.categoryName}</span><h3>{product.name}</h3><p>{product.description}</p><b>View component <ArrowRight size={15} /></b>
      </Link>)}</div>
    </section>
    <section className="capability-band" id="capabilities">
      <div><span className="eyebrow">CAPABILITY STACK</span><h2>Precision is a sequence,<br />not a single operation.</h2><p>We align machining route, material, secondary processes, and inspection around the part requirement.</p><Link className="button light" href="/capabilities">Explore capabilities <ArrowRight size={17} /></Link></div>
      <div className="capability-steps">{[[Cog, 'Swiss turning', 'Efficient production for small-diameter precision geometry.'], [Gauge, 'Mill-turn machining', 'Multi-feature parts completed through coordinated operations.'], [ScanLine, 'Process inspection', 'Dimensions and appearance checked against order requirements.'], [Check, 'Batch readiness', 'Sampling approval provides a clear route into repeat production.']].map(([Icon, title, text], index) => <article key={String(title)}><span>{String(index + 1).padStart(2, '0')}</span><Icon size={22} /><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div>
    </section>
    <section className="section industries" id="industries"><div className="section-heading"><span className="eyebrow">WHERE PARTS PERFORM</span><h2>Engineered for the assembly around them.</h2></div><div className="industry-grid">{[[Cog, 'Automotive', 'Fittings, shafts, sleeves, and custom mechanical interfaces.'], [CircuitBoard, 'Communications', 'Compact conductive and structural parts for connected equipment.'], [Wind, 'Pneumatic & Air Tool', 'Nozzles, connectors, valve parts, and threaded components.'], [Gauge, 'Sensors', 'Precision housings and interfaces for measurement assemblies.'], [Stethoscope, 'Medical', 'Drawing-based components with inspection requirements confirmed per order.']].map(([Icon, title, text]) => <article key={String(title)}><Icon size={26} /><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div></section>
    <section className="equipment" id="equipment"><div className="equipment-photo"><Image src="/products/771930555427.jpg" alt="Precision metal component produced by Dingmao" fill sizes="(max-width: 900px) 100vw, 52vw" /></div><div className="equipment-copy"><span className="eyebrow">PRODUCTION PLATFORM</span><h2>Approximately 200 machines. One focused purpose.</h2><p>Our listed equipment includes Tsugami 385C, Tsugami 325, Tsugami S205A, Tsugami BO205, Citizen 20G, and Star 20-class machines.</p><dl><div><dt>0.5–38 mm</dt><dd>Outside diameter range</dd></div><div><dt>Sampling</dt><dd>3–15 day reference window</dd></div><div><dt>OEM / ODM</dt><dd>Custom process support</dd></div></dl><Link className="text-link" href="/about">Meet Dingmao Precision <ArrowRight size={17} /></Link></div></section>
    <section className="section process" id="process"><div className="section-heading row"><div><span className="eyebrow">FROM RFQ TO PRODUCTION</span><h2>A direct path through complexity.</h2></div><p>Clear checkpoints keep technical, commercial, and production decisions aligned.</p></div><div className="process-line">{['Drawing review', 'Process & quotation', 'Sampling', 'Production', 'Inspection & dispatch'].map((item, index) => <article key={item}><b>{String(index + 1).padStart(2, '0')}</b><span /><h3>{item}</h3></article>)}</div></section>
    <section className="section faq-home" id="faq"><div className="section-heading row"><div><span className="eyebrow">BUYER QUESTIONS</span><h2>Useful answers before your RFQ.</h2></div><Link className="text-link" href="/faq">All questions <ArrowRight size={17} /></Link></div><div>{faqs.slice(0, 4).map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
    <section className="section news-home" id="news"><div className="section-heading row"><div><span className="eyebrow">COMPANY UPDATES</span><h2>From the production floor.</h2></div><Link className="text-link" href="/news">Newsroom <ArrowRight size={17} /></Link></div>{articles.length ? <div className="news-list">{articles.slice(0, 3).map((article) => <Link href={`/news/${article.slug}`} key={article.slug}><time>{new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</time><h3>{article.title}</h3></Link>)}</div> : <p className="empty-state">Company updates will appear here when published.</p>}</section>
    <section className="inquiry-band" id="inquiry"><span className="eyebrow">HAVE A DRAWING READY?</span><h2>Let’s identify the right production path.</h2><p>Share your geometry, material, quantity, and application. Our team will review the requirement and respond with the next technical step.</p><Link className="button primary" href="/contact">Start your RFQ <ArrowRight size={18} /></Link></section>
  </>
}
