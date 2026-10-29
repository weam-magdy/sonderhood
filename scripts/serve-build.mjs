// Serves ./build the way Hostinger will, for checking a build before uploading it:
// the 301s from build/.htaccess, clean URLs from build/_pages, the app shell for
// pages added after the build, and real 404s for everything else.
//   node scripts/serve-build.mjs [port]      (default 5055)

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const BUILD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'build')
const PORT = Number(process.argv[2] || process.env.PORT || 5055)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.otf': 'font/otf', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.map': 'application/json' }

// The plain "RewriteRule ^pattern$ /target [R=301...]" lines from the generated .htaccess.
const redirects = fs.readFileSync(path.join(BUILD, '.htaccess'), 'utf8').split(/\r?\n/)
    .map(line => line.match(/^RewriteRule (\^\S+) (\/\S*) \[([^\]]*R=301[^\]]*)\]$/))
    .filter(Boolean)
    .map(([, pattern, target, flags]) => ({ re: new RegExp(pattern, /\bNC\b/.test(flags) ? 'i' : ''), target }))

const isFile = (file) => fs.existsSync(file) && fs.statSync(file).isFile()

// Text files go out gzipped, as Hostinger sends them, so Lighthouse runs against this
// server download what visitors download.
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.svg'])

function send(res, status, file, headers = {})
{
    const gzip = COMPRESSIBLE.has(path.extname(file).toLowerCase()) && /\bgzip\b/.test(res.req.headers['accept-encoding'] || '')
    res.writeHead(status, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', ...(gzip && { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' }), ...headers })
    const stream = fs.createReadStream(file)
    if (gzip) stream.pipe(zlib.createGzip()).pipe(res)
    else stream.pipe(res)
}

http.createServer((req, res) =>
{
    const url = new URL(req.url, `http://localhost:${PORT}`)
    const pathname = decodeURIComponent(url.pathname)
    const rel = pathname.replace(/^\/+/, '')

    if (/(^|\/)\.git(\/|$)/.test(rel)) return res.writeHead(403).end()
    if (pathname === '/index.html') return res.writeHead(301, { Location: '/' }).end()
    if (rel.endsWith('/') && rel.length > 1) return res.writeHead(301, { Location: `/${rel.replace(/\/+$/, '')}${url.search}` }).end()
    for (const { re, target } of redirects) if (re.test(rel)) return res.writeHead(301, { Location: target }).end()
    if (/^_pages(\/|$)/i.test(rel)) return res.writeHead(403).end()

    if (!rel) return send(res, 200, path.join(BUILD, 'index.html'))
    const page = path.join(BUILD, '_pages', `${rel}.html`)
    if (isFile(page)) return send(res, 200, page)
    const file = path.join(BUILD, rel)
    if (file.startsWith(BUILD) && isFile(file)) return send(res, 200, file)
    return send(res, 404, path.join(BUILD, '404.html'))
}).listen(PORT, () => console.log(`Serving build/ like Hostinger at http://localhost:${PORT}`))
