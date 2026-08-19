import Link from 'next/link'
export default function NotFound(){return <section className="not-found"><span>404</span><h1>This page is outside the current drawing.</h1><p>The component or page may have moved.</p><Link className="button primary" href="/">Return home</Link></section>}
