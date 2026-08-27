import { Cog, Combine, Drill, Gauge, ScanLine, Wrench } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { getIconGridLayout } from '@/lib/site'

export const metadata = { alternates: { canonical: '/capabilities' } }

export default function CapabilitiesPage(){const items=[[Cog,'Swiss turning','Efficient machining of small-diameter, feature-rich parts.'],[Combine,'Mill-turn machining','Turning and milling features coordinated in a focused route.'],[Drill,'Secondary operations','Threads, cross holes, slots, and additional features reviewed per drawing.'],[Wrench,'Material coordination','Stainless steel, aluminum, copper alloys, and other suitable materials.'],[Gauge,'Sampling','Prototype and sample routes aligned with geometry and tooling.'],[ScanLine,'Inspection','Order-specific dimensional and appearance checks.']];return <><PageHero eyebrow="MANUFACTURING CAPABILITIES" title="The route matters as much as the machine." intro="We review the complete component requirement, then align machining, secondary work, sampling, and inspection into one production path." action={{label:'Discuss a component',href:'/contact'}}/><section className={`icon-page-grid ${getIconGridLayout(items.length)} section`}>{items.map(([Icon,title,text])=><article key={String(title)}><Icon size={27}/><h2>{String(title)}</h2><p>{String(text)}</p></article>)}</section></>}
