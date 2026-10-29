// Reads public Firestore collections through the REST API and returns plain
// objects shaped like the browser SDK's doc.data(), plus id, createTime and
// updateTime. Shared by scripts/prerender.mjs (Node) and src/app/content.js,
// so this file holds no imports and no browser globals.

export const FIRESTORE_PROJECT = 'the-sonder-hood'

// Firestore REST values to plain JS; document references become { id } like a DocumentReference.
export function plain(value) {
    if ('stringValue' in value) return value.stringValue
    if ('integerValue' in value) return Number(value.integerValue)
    if ('doubleValue' in value) return value.doubleValue
    if ('booleanValue' in value) return value.booleanValue
    if ('nullValue' in value) return null
    if ('timestampValue' in value) return value.timestampValue
    if ('referenceValue' in value) return { id: value.referenceValue.split('/').pop() }
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(plain)
    if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([k, v]) => [k, plain(v)]))
    return null
}

export async function fetchCollection(name, { project = FIRESTORE_PROJECT, signal } = {}) {
    const docs = []
    let pageToken = ''
    do {
        const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${name}?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`
        const response = await fetch(url, { signal })
        if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
        const json = await response.json()
        for (const doc of json.documents || []) {
            docs.push({ ...plain({ mapValue: { fields: doc.fields || {} } }), id: doc.name.split('/').pop(), createTime: doc.createTime, updateTime: doc.updateTime })
        }
        pageToken = json.nextPageToken || ''
    } while (pageToken)
    return docs
}
