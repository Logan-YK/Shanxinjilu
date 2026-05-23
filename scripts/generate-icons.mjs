import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const iconSvg = readFileSync(join(publicDir, 'pwa-icon.svg'))
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#7c4a2d"/>
  <text x="256" y="320" text-anchor="middle" font-size="220" fill="#faf8f5" font-family="PingFang SC, Microsoft YaHei, sans-serif">善</text>
</svg>`

const sizes = [
  { name: 'pwa-48.png', size: 48 },
  { name: 'pwa-72.png', size: 72 },
  { name: 'pwa-96.png', size: 96 },
  { name: 'pwa-144.png', size: 144 },
  { name: 'pwa-192.png', size: 192 },
  { name: 'pwa-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-maskable-512.png', size: 512, svg: maskableSvg },
  { name: 'favicon.ico', size: 48, ico: true },
]

for (const { name, size, svg, ico } of sizes) {
  let pipeline = sharp(Buffer.from(svg ?? iconSvg)).resize(size, size)
  if (ico) {
    const pngBuf = await pipeline.png().toBuffer()
    // 48x48 PNG header works as favicon.ico for most mobile browsers
    writeFileSync(join(publicDir, name), pngBuf)
  } else {
    const buf = await pipeline.png().toBuffer()
    writeFileSync(join(publicDir, name), buf)
  }
  console.log(`Wrote public/${name}`)
}
