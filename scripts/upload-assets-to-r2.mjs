import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const envRoots = [root, 'D:/Cursor/Grand/huanqiu-admin']

for (const envRoot of envRoots) {
  for (const name of ['.env.local', '.env', '_migrate-batch/.env']) {
    const file = path.join(envRoot, name)
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }
}

for (const key of ['R2_S3_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME']) {
  if (!process.env[key]) throw new Error(`Missing ${key}`)
}
const publicBase = (process.env.R2_PUBLIC_URL_PREFIX || process.env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX || '').replace(/\/$/, '')
if (!publicBase) throw new Error('Missing R2 public URL prefix')

const client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const files = [
  { source: path.join(root, 'public/brand/logo.png'), key: 'tenants/dingmao-precision/branding/logo.png' },
  ...fs.readdirSync(path.join(root, 'public/products')).filter((name) => /\.(png|jpe?g|webp)$/i.test(name)).sort().map((name) => ({
    source: path.join(root, 'public/products', name),
    key: `tenants/dingmao-precision/products/${name}`,
  })),
]

const contentType = (file) => file.endsWith('.png') ? 'image/png' : file.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
for (const file of files) {
  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: file.key,
    Body: fs.readFileSync(file.source),
    ContentType: contentType(file.source),
    CacheControl: 'public, max-age=31536000, immutable',
  }))
  const head = await client.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: file.key }))
  if (head.ContentLength !== fs.statSync(file.source).size) throw new Error(`R2 read-back mismatch: ${file.key}`)
}

console.log(JSON.stringify({ uploaded: files.length, publicBase, prefix: 'tenants/dingmao-precision' }))
