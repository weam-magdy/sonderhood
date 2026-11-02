// Google Analytics 4, property "The Sonder Hood". Nothing loads and no cookie is set
// until the visitor accepts the notice (ConsentBanner); the choice is kept for 12
// months in localStorage (in memory when storage is blocked) and can be changed from
// the footer or /privacy. Page views are sent by useSeo once a page has its title,
// and WhatsApp, phone and form opens are counted as leads by channel only. No form
// or finder answers are ever sent, and page addresses keep only campaign tags.
export const MEASUREMENT_ID = 'G-542B109XJK'
const CONSENT_KEY = 'sonderhood-analytics'
const CONSENT_DAYS = 365
const CAMPAIGN_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'gclid', 'gbraid', 'wbraid']

const SITE_HOST = 'www.the-sonderhood.com'
const NOT_COUNTED_KEY = 'sonderhood-not-counted'

let loaded = false
let lastPath = null
let countedPath = null
let sessionChoice = null
const disableKey = `ga-disable-${MEASUREMENT_ID}`

// 'granted', 'denied', or null when the visitor has not chosen (or chose over a year ago).
export function getConsent()
{
    try
    {
        const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null')
        if (saved && saved.choice && Date.now() - saved.date < CONSENT_DAYS * 864e5) return saved.choice
    }
    catch
    {
        // Storage blocked, or an older plain-text value: fall back to this visit's choice,
        // which may have been made on the prerendered notice before the app loaded.
    }
    return sessionChoice || window.sonderhoodChoice || null
}

function load()
{
    if (loaded) return
    loaded = true
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' })
    window.gtag('js', new Date())
    window.gtag('config', MEASUREMENT_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: 395 * 24 * 60 * 60,
    })
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(script)
}

// Google Analytics cookies are _ga and _ga_<id>, set on the site's root domain.
function clearCookies()
{
    const root = window.location.hostname.replace(/^www\./, '')
    const names = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]).filter(name => /^_ga/.test(name))
    for (const name of names)
    {
        for (const domain of ['', `; domain=${window.location.hostname}`, `; domain=.${root}`])
        {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`
        }
    }
}

export function setConsent(choice)
{
    sessionChoice = choice
    try
    {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, date: Date.now() }))
    }
    catch
    {
        // Storage blocked: the choice lasts for this visit only.
    }
    if (choice === 'granted')
    {
        const wasActive = loaded && !window[disableKey]
        window[disableKey] = false
        load()
        if (!wasActive)
        {
            lastPath = null
            trackPageView()
        }
    }
    else
    {
        window[disableKey] = true
        clearCookies()
    }
}

function active()
{
    return loaded && !window[disableKey]
}

// Once per page address, after the page has set its title. The address keeps only
// campaign tags (utm_*, gclid), so nothing else in a query string reaches Google.
export function trackPageView()
{
    if (!active()) return
    const path = window.location.pathname
    if (path === lastPath) return
    lastPath = path
    const all = new URLSearchParams(window.location.search)
    const kept = new URLSearchParams()
    for (const name of CAMPAIGN_PARAMS) if (all.has(name)) kept.set(name, all.get(name))
    const query = kept.toString()
    window.gtag('event', 'page_view', { page_location: `${window.location.origin}${path}${query ? `?${query}` : ''}`, page_title: document.title })
}

// The site's own daily totals (public/visit.php, read on the private stats.php). It sets
// no cookie, so it needs no consent: only this page's address, the host that sent the
// visitor and whether this page starts a visit are sent, and visit.php keeps totals only.
export function countPageView()
{
    const path = window.location.pathname
    if (path === countedPath) return
    const firstPage = countedPath === null
    countedPath = path
    if (window.location.hostname !== SITE_HOST || navigator.webdriver) return
    try
    {
        if (localStorage.getItem(NOT_COUNTED_KEY)) return
    }
    catch
    {
        // Storage blocked: this browser can't have been marked, so it is counted.
    }
    let referrer = ''
    try
    {
        referrer = new URL(document.referrer).hostname
    }
    catch
    {
        // No referrer, the usual case for a typed address or a link from an app.
    }
    const navigation = performance.getEntriesByType?.('navigation')[0]
    const returning = navigation && navigation.type !== 'navigate'
    const body = JSON.stringify({ path, visit: firstPage && !returning && referrer !== SITE_HOST, ref: referrer })
    if (navigator.sendBeacon) navigator.sendBeacon('/visit.php', body)
    else fetch('/visit.php', { method: 'POST', body, keepalive: true }).catch(() => {})
}

export function trackLead(method)
{
    if (!active()) return
    window.gtag('event', 'generate_lead', { method })
}

// Called once before the app renders.
export function startAnalytics()
{
    if (getConsent() === 'granted') load()
    // The cookie notice drawn into the page (public/index.html) stays on screen until the
    // app replaces it; from now on its buttons go through setConsent, so an Accept tapped
    // in that moment still starts Analytics.
    window.sonderhoodChoose = (choice) =>
    {
        setConsent(choice)
        document.documentElement.classList.add('consent-chosen')
    }
    document.addEventListener('click', (event) =>
    {
        const link = event.target && event.target.closest ? event.target.closest('a[href]') : null
        if (!link) return
        const href = link.getAttribute('href') || ''
        if (/wa\.me\//.test(href)) trackLead('whatsapp_link')
        else if (href.startsWith('tel:')) trackLead('phone_call')
    }, true)
}
