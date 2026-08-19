import Image from 'next/image'

type Props = {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  eager?: boolean
}

export function CleanProductImage({ src, alt, sizes, priority = false, eager = false }: Props) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} loading={priority || eager ? 'eager' : 'lazy'} />
}
