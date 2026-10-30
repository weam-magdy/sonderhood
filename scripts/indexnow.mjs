// Tells Bing and the other IndexNow engines which pages changed. Copilot answers from
// Bing's index, and Bing did not show this site even for its own name (October 2026).
// Run after an upload: `node scripts/indexnow.mjs` sends every page in the built
// sitemap, or pass paths: `node scripts/indexnow.mjs /services/couples-therapy`.
// The key is public by design: it is the file of the same name at the site root.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KEY = 'cb78a544f4a623857a5f954cd5bf949b'
const HOST = 'www.the-sonderhood.com'
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const paths = process.argv.slice(2)
const urls = paths.length
    ? paths.map(p => `https://${HOST}${p}`)
    : [...fs.readFileSync(path.join(ROOT, 'build', 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])

const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
})
// 200 and 202 both mean accepted; 403 means the key file is not live yet.
console.log(`IndexNow: ${response.status} for ${urls.length} URLs`)
if (!response.ok) process.exitCode = 1
