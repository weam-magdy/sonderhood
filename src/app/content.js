import { fetchCollection } from '../seo/firestore.mjs'

// Services, therapists, articles and testimonials are written to /content.json by
// scripts/prerender.mjs at build time, so pages never wait on a slow or blocked
// connection to Firestore. Without that file (npm start), the same collections
// are read from Firestore's REST API instead.
let content

function loadContent() {
    if (!content) {
        content = fetch('/content.json', { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) throw new Error(`content.json: HTTP ${response.status}`)
                return response.json()
            })
            .catch(() => null)
    }
    return content
}

export async function loadCollection(name) {
    const data = await loadContent()
    if (data && Array.isArray(data[name])) return data[name]
    return fetchCollection(name, { project: process.env.REACT_APP_projectId || undefined })
}
