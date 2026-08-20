import { CheckCircle2, ClipboardCheck, FileSearch, ScanLine } from 'lucide-react'
import { PageHero } from '@/components/PageHero'

export const metadata = { alternates: { canonical: '/quality' } }

export default function QualityPage(){return <><PageHero eyebrow="PROCESS INSPECTION" title="Requirements made visible at each checkpoint." intro="Inspection planning begins with the drawing and order requirements. Dimensional, appearance, and document needs are confirmed before production." action={{label:'Share inspection needs',href:'/contact'}}/><section className="icon-page-grid section">{[[FileSearch,'Requirement review','Critical dimensions, material, finish, and application notes are identified from the RFQ.'],[ClipboardCheck,'Sample confirmation','Sample checks establish the agreed reference before repeat production.'],[ScanLine,'In-process checks','Production checks are aligned with part geometry and order requirements.'],[CheckCircle2,'Dispatch review','Final scope and requested inspection documents are confirmed for the shipment.']].map(([Icon,title,text])=><article key={String(title)}><Icon size={27}/><h2>{String(title)}</h2><p>{String(text)}</p></article>)}</section></>}
