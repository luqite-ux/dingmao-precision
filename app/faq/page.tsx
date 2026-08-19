import { PageHero } from '@/components/PageHero'
import { faqs } from '@/lib/site'

export default function FaqPage(){return <><PageHero eyebrow="FAQ" title="Practical answers for sourcing teams." intro="These answers summarize current working references. Product-specific terms are confirmed after drawing review." action={{label:'Ask a project question',href:'/contact'}}/><section className="faq-home section"><div>{faqs.map(([question,answer])=><details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section></>}
