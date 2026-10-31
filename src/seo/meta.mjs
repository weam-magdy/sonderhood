// Site facts, page titles/descriptions, URL slugs and structured data.
// Shared by the React app and by scripts/prerender.mjs (which runs in plain Node),
// so this file holds only data and pure functions: no browser globals, and no imports
// except the page copy in ./pageCopy.mjs, which is plain data too.

import { NEW_CAIRO, SERVICE_DETAILS } from './pageCopy.mjs'

export { NEW_CAIRO, SERVICE_DETAILS }

export const SITE = {
    name: 'The Sonder Hood',
    url: 'https://www.the-sonderhood.com',
    phone: '+201094292553',
    phoneDisplay: '+20 109 429 2553',
    whatsappNumber: '201094292553',
    email: 'inquiries@the-sonderhood.com',
    // The center is at 3Sixty by LMD (confirmed by the owner, October 2026).
    // Keep the address, the pin and the Google Business Profile saying the same thing.
    address: {
        street: '3Sixty by LMD',
        locality: 'New Cairo',
        region: 'Cairo Governorate',
        country: 'EG',
        road: 'Sheikh Mohamed Bin Zayed North Axis',
        postalCode: '11865',
        display: '3Sixty by LMD, New Cairo, Cairo, Egypt',
    },
    geo: { latitude: 30.0277362, longitude: 31.5510843 },
    mapsUrl: 'https://maps.app.goo.gl/UBNXujaUDyvCnvf26',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=3sixty%20By%20LMD%2C%20New%20Cairo&ll=30.0277362,31.5510843&z=16&output=embed',
    image: '/og-image.jpg',
    logo: '/logo512.png',
    // Opening hours and session languages, confirmed by the owner in October 2026.
    // Session prices are deliberately kept off the site, so the structured data has no priceRange.
    hours: { opens: '10:00', closes: '22:00', display: 'every day, 10 am to 10 pm' },
    // Every therapist works in Arabic and English. `otherLanguages` are offered by one
    // therapist only (Inji Farid's French, from the owner on 29 October 2026).
    languages: ['Arabic', 'English'],
    otherLanguages: { French: 'Inji Farid' },
    socials: {
        facebook: 'https://www.facebook.com/profile.php?id=100092881591617',
        instagram: 'https://www.instagram.com/thesonderhood/',
    },
}

export const DEFAULT_WHATSAPP_TEXT = 'Hello The Sonder Hood, I would like to book a therapy session.'
// The same first message for visitors who use Arabic (src/utils/contact.js decides).
export const DEFAULT_WHATSAPP_TEXT_AR = 'مرحبًا، أود حجز جلسة علاج نفسي.'

// Each service as it reads after "جلسة" (a session of …) in an Arabic first message, by slug.
export const SERVICE_NAMES_AR = {
    'individual-adult-therapy': 'علاج نفسي فردي للبالغين',
    'couples-therapy': 'علاج زوجي',
    'family-therapy': 'علاج أسري',
    'child-adolescent-therapy': 'علاج نفسي للأطفال والمراهقين',
    'cbt-behavioral-therapy': 'علاج معرفي سلوكي (CBT)',
    'group-therapy': 'علاج جماعي',
    'online-therapy': 'علاج نفسي أونلاين',
    'psychological-assessments': 'تقييم نفسي',
}

export function whatsappUrl(text = DEFAULT_WHATSAPP_TEXT) {
    return `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

const ARABIC_LETTERS = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/
const LATIN_LETTERS = /[A-Za-zÀ-ɏ]/

// Whether a visitor writes in Arabic: yes if any of `texts` has an Arabic letter,
// no if any has a Latin one, otherwise `fallback` (nothing typed to go by).
export function writesArabic(texts = [], fallback = false) {
    const typed = texts.map(text => String(text || ''))
    if (typed.some(text => ARABIC_LETTERS.test(text))) return true
    if (typed.some(text => LATIN_LETTERS.test(text))) return false
    return fallback
}

// "How did you find us?", optional on the booking forms and the finder. The answer goes
// only into the WhatsApp message, the one way to see what brings people in: Google
// Analytics misses everyone who declines cookies. `ar` is how it reads in an Arabic message.
export const FOUND_US = [
    { id: 'google', label: 'Google search', ar: 'بحث جوجل' },
    { id: 'ai', label: 'ChatGPT or another AI tool', ar: 'ChatGPT أو أداة ذكاء اصطناعي أخرى' },
    { id: 'social', label: 'Instagram or Facebook', ar: 'إنستجرام أو فيسبوك' },
    { id: 'person', label: 'A friend or family member', ar: 'صديق أو أحد أفراد الأسرة' },
    { id: 'professional', label: 'A doctor or another therapist', ar: 'طبيب أو معالج آخر' },
    { id: 'other', label: 'Somewhere else', ar: 'مصدر آخر' },
]

export function foundUsLabel(id, arabic = false) {
    const option = FOUND_US.find(o => o.id === id)
    return option ? (arabic ? option.ar : option.label) : ''
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Our contact details inside plain copy (FAQ answers, page intros, the privacy
// policy, the footer) work as links: "WhatsApp at +20 …" and the number open the
// chat, "3Sixty by LMD" opens the map and the email address opens an email. `links`
// adds a block's own phrases ({ 'couples therapy': '/services/couples-therapy' }), and
// `word` also links a bare "WhatsApp" (left off in the privacy policy, which names
// WhatsApp as a service). `chat` is the WhatsApp link to use. Returns the text in
// pieces, { text } or { text, href }.
export function linkedParts(text, { links = {}, word = false, chat = whatsappUrl() } = {}) {
    const targets = new Map(Object.entries({
        [`WhatsApp at ${SITE.phoneDisplay}`]: chat,
        [SITE.phoneDisplay]: chat,
        [SITE.address.street]: SITE.mapsUrl,
        [SITE.email]: `mailto:${SITE.email}`,
        ...links,
        ...(word ? { WhatsApp: chat } : {}),
    }))
    const phrases = [...targets.keys()].sort((a, b) => b.length - a.length)
    const pattern = new RegExp(`(${phrases.map(escapeRegExp).join('|')})`)
    return String(text ?? '').split(pattern).filter(Boolean).map(piece => (targets.has(piece) ? { text: piece, href: targets.get(piece) } : { text: piece }))
}

export function absoluteUrl(path = '/') {
    if (/^https?:\/\//.test(path)) return path
    return SITE.url + (path.startsWith('/') ? path : `/${path}`)
}

// Every language sessions are offered in: Arabic, English and French.
export function sessionLanguages() {
    return [...SITE.languages, ...Object.keys(SITE.otherLanguages)]
}

// The languages one therapist works in.
export function therapistLanguages(therapist) {
    return [...SITE.languages, ...Object.keys(SITE.otherLanguages).filter(language => SITE.otherLanguages[language] === therapist?.name)]
}

// "Arabic and English, and French with Inji Farid", for the contact details.
export function languagesText() {
    return [sentenceList(SITE.languages), ...Object.entries(SITE.otherLanguages).map(([language, therapist]) => `${language} with ${therapist}`)].join(', and ')
}

export function slugify(text) {
    return String(text || '')
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// The old site built deep links from display text with the spaces removed
// (/Services/CouplesTherapy, /Therapists/WeaamElaidy, /ArticlePage/<Title>).
export function legacySlug(text) {
    return String(text || '').replace(/\s/g, '').toLowerCase()
}

// ---------------------------------------------------------------- services

// Display names, URLs and search copy for the services stored in Firestore,
// keyed by Firestore document id. Services added later fall back to their title.
export const SERVICE_SEO = {
    hhsdmrAXJVOTKq8UT3Yv: {
        slug: 'individual-adult-therapy',
        name: 'Individual Adult Therapy',
        metaTitle: 'Individual Therapy for Adults in New Cairo & Online',
        metaDescription: 'One-to-one psychotherapy for adults dealing with anxiety, depression, stress, relationships or self-esteem. Face to face in New Cairo or online across Egypt.',
        intro: 'Individual therapy for adults is available face to face at our therapy center in New Cairo or online by secure video call, so you can see a therapist wherever you are in Egypt.',
    },
    wkCeZbijHxJw1RhtEpix: {
        slug: 'couples-therapy',
        name: 'Couples Therapy',
        metaTitle: 'Couples Therapy & Marriage Counseling in Cairo',
        metaDescription: 'Couples therapy and marriage counseling in New Cairo or online: communication, trust, infidelity, intimacy and conflict. Book your first session on WhatsApp.',
        intro: 'Couples therapy and marriage counseling sessions take place at our center in New Cairo or online, so both partners can attend even with busy schedules.',
    },
    '5nwmIB32vjsHXknedWyf': {
        slug: 'child-adolescent-therapy',
        name: 'Child & Adolescent Therapy',
        metaTitle: 'Child & Teen Therapy in New Cairo & Online',
        metaDescription: 'Therapy for children and teenagers: behavioral issues, anxiety, school challenges, emotional regulation and family dynamics, in New Cairo or online.',
        intro: 'Sessions for children and teenagers are held at our center in New Cairo, and teenagers can also attend online. Parents and caregivers are involved whenever it helps.',
    },
    '7pRO6dkH0ruCAbYNVQvr': {
        slug: 'psychological-assessments',
        name: 'Psychological Assessments',
        metaTitle: 'Psychological Assessments in New Cairo',
        metaDescription: 'Personality, cognitive, mood, anxiety, relationship and trauma assessments that guide a personalized therapy plan, with our psychologists in New Cairo.',
        intro: 'Assessments are carried out by our psychologists in New Cairo and are used to build a therapy plan that fits your needs.',
    },
    ArjQ4Rm2ff6tkNtAQ6LT: {
        slug: 'online-therapy',
        name: 'Online Therapy',
        metaTitle: 'Online Therapy in Egypt by Video',
        metaDescription: 'Online therapy in Arabic, English or French by secure video, for individuals, couples and teenagers anywhere in Egypt or abroad. Book on WhatsApp.',
        intro: 'Online sessions are run by the same team of therapists who see clients at our center in New Cairo, in Arabic or English, so you can start therapy from anywhere in Egypt or abroad. Inji Farid also offers sessions in French.',
    },
    ee4ZPo01CGhm2vK1Li4C: {
        slug: 'group-therapy',
        name: 'Group Therapy',
        metaTitle: 'Group Therapy in New Cairo',
        metaDescription: 'Small, therapist-led groups for anxiety, grief and loss, codependency and family issues. Connect with others and grow, with The Sonder Hood in New Cairo.',
        intro: 'Groups are led by our therapists in New Cairo. Message us on WhatsApp to hear about upcoming groups and online options.',
    },
    'family-therapy': {
        slug: 'family-therapy',
        name: 'Family Therapy',
        metaTitle: 'Family Therapy in New Cairo & Online',
        metaDescription: 'Family therapy for conflict at home, parenting challenges, divorce and big life changes. Sessions face to face in New Cairo or online across Egypt.',
        intro: 'Family therapy sessions are available face to face at our center in New Cairo or online by secure video call.',
    },
    'behavioral-therapy': {
        slug: 'cbt-behavioral-therapy',
        name: 'Behavioral Therapy (CBT & DBT)',
        metaTitle: 'CBT & Behavioral Therapy in Cairo & Online',
        metaDescription: 'Cognitive behavioral therapy (CBT) and DBT for anxiety, depression, OCD and emotional regulation, with trained therapists in New Cairo or online.',
        intro: 'CBT and DBT sessions are available for adults and teenagers, face to face at our center in New Cairo or online by secure video call.',
    },
}

// Services the practice offers that have no Firestore record yet. If a service
// with the same title is added in Firestore, that record is used instead.
export const EXTRA_SERVICES = [
    {
        id: 'family-therapy',
        order: 2.5,
        title: 'Family Therapy',
        match: 'family',
        description: 'Therapy for families who want to communicate better, resolve conflict and support each other through change, guided by a trained therapist.',
        points: ['Communication Problems', 'Parent-Child Conflict', 'Divorce & Separation', 'Grief & Life Transitions', 'And more…'],
        faqs: [
            {
                question: 'What is family therapy, and how does it work?',
                answer: 'Family therapy is a form of psychotherapy in which a therapist works with two or more family members together. Sessions focus on the patterns between family members, helping everyone understand each other, communicate more clearly and solve problems as a team.',
            },
            {
                question: 'When should a family consider therapy?',
                answer: 'Families often seek therapy during ongoing conflict at home, after a divorce or a loss, when a child or teenager is struggling, or when communication has broken down. You do not need to wait for a crisis; therapy can also help a family adjust to big changes.',
            },
            {
                question: 'Does the whole family need to attend every session?',
                answer: 'Not necessarily. Your therapist will suggest who should attend based on your goals. Some sessions may include the whole family, while others may involve the parents, a couple or one family member.',
            },
            {
                question: 'Can family therapy be done online?',
                answer: 'Yes. Family therapy sessions can take place face to face at our center in New Cairo or online by secure video call.',
            },
        ],
    },
    {
        id: 'behavioral-therapy',
        order: 3.5,
        title: 'Behavioral Therapy (CBT & DBT)',
        match: 'behavioral',
        description: 'Evidence-based behavioral therapies, including cognitive behavioral therapy (CBT) and dialectical behavior therapy (DBT), to change unhelpful patterns and build practical coping skills.',
        points: ['Anxiety & Panic', 'Depression & Low Mood', 'OCD', 'Emotional Regulation', 'Personality Disorders', 'And more…'],
        faqs: [
            {
                question: 'What is cognitive behavioral therapy (CBT)?',
                answer: 'CBT is a structured, goal-focused form of talk therapy. It helps you notice the links between your thoughts, feelings and behaviors, challenge unhelpful thinking patterns and practice new ways of coping between sessions.',
            },
            {
                question: 'What is the difference between CBT and DBT?',
                answer: 'Both are behavioral therapies. CBT focuses on changing unhelpful thoughts and behaviors, while dialectical behavior therapy (DBT) adds skills for managing intense emotions, tolerating distress and improving relationships.',
            },
            {
                question: 'What can behavioral therapy help with?',
                answer: 'Behavioral therapy is widely used for anxiety, depression, obsessive-compulsive disorder (OCD), stress, anger, low self-esteem and difficulties with emotional regulation. Your therapist will tailor the approach to your goals.',
            },
            {
                question: 'Is CBT available online?',
                answer: 'Yes. CBT and DBT sessions are available face to face at our center in New Cairo or online by secure video call from anywhere in Egypt.',
            },
        ],
    },
]

function matchTherapists(match, therapists) {
    if (match === 'family') return therapists.filter(t => (t.search || []).some(tag => /famil/i.test(tag)))
    if (match === 'behavioral') return therapists.filter(t => (t.certificates || []).some(c => /\b(CBT|DBT)\b|cognitive behavio|dialectical behavio/i.test(c.title || '')))
    return []
}

// `details` is the page's longer copy (pageCopy.mjs); its questions follow the service's own.
export function decorateService(service) {
    const seo = SERVICE_SEO[service.id] || {}
    const slug = seo.slug || slugify(service.title)
    const details = SERVICE_DETAILS[slug]
    return {
        ...service,
        legacySlug: legacySlug(service.title),
        slug,
        title: seo.name || service.title,
        seo,
        details,
        faqs: [...(service.faqs || []), ...((details && details.faqs) || [])],
    }
}

// Firestore lists each service's therapists by hand, and those lists date from 2023.
// Therapists whose own profile names the client group join them, so the page shows
// everyone who offers the service, as the therapist finder does. Keyed by Firestore id.
const SERVICE_CLIENTELE = {
    hhsdmrAXJVOTKq8UT3Yv: /adult/i, // Individual adult therapy
    wkCeZbijHxJw1RhtEpix: /couple/i, // Couples therapy
    '5nwmIB32vjsHXknedWyf': /child|adolescent/i, // Child & adolescent therapy
    ee4ZPo01CGhm2vK1Li4C: /group/i, // Group therapy
}

function withProfileTherapists(service, therapists) {
    const clientele = SERVICE_CLIENTELE[service.id]
    if (!clientele) return service
    const listed = service.therapists || []
    const added = therapists
        .filter(t => (t.clientele || []).some(group => clientele.test(group)))
        .filter(t => !listed.some(ref => ref.id === t.id))
        .map(t => ({ id: t.id }))
    return added.length ? { ...service, therapists: [...listed, ...added] } : service
}

// Firestore services plus EXTRA_SERVICES, decorated and in display order.
export function mergeServices(services = [], therapists = []) {
    const titles = new Set(services.map(s => String(s.title || '').trim().toLowerCase()))
    const merged = services.map(s => decorateService(withProfileTherapists(s, therapists)))
    for (const extra of EXTRA_SERVICES) {
        if (titles.has(extra.title.toLowerCase())) continue
        merged.push(decorateService({ ...extra, therapists: matchTherapists(extra.match, therapists).map(t => ({ id: t.id })) }))
    }
    return merged.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
}

// Static links for the footer, so every service page is linked from every page
// even before Firestore answers.
export const SERVICE_LINKS = [
    'hhsdmrAXJVOTKq8UT3Yv', 'wkCeZbijHxJw1RhtEpix', 'family-therapy', '5nwmIB32vjsHXknedWyf',
    'behavioral-therapy', 'ArjQ4Rm2ff6tkNtAQ6LT', 'ee4ZPo01CGhm2vK1Li4C', '7pRO6dkH0ruCAbYNVQvr',
].map(id => ({ name: SERVICE_SEO[id].name, path: `/services/${SERVICE_SEO[id].slug}` }))

// ---------------------------------------------------------------- therapists and blog

export function therapistSlug(therapist) {
    return slugify(therapist?.name)
}

// Team changes made here rather than in Firestore, keyed by Firestore id. On
// 29 October 2026 the owner had Inji Farid take over Yosra Elsewerky's profile and
// Sally Roshdy take over Habiba Youssry's: each keeps that profile's title (Sally's
// was changed since), client
// groups, focus areas and services, with her own name, photo and credentials, and no
// quote yet. `replaces` is the earlier profile's address, which now leads to the team
// page. Habiba's articles keep her name as their author.
export const TEAM_CHANGES = {
    sxxYjLxrm23clMf8QYgY: {
        replaces: 'yosra-elsewerky',
        name: 'Inji Farid',
        image: '/images/team/inji-farid.jpg',
        quote: '',
        certificates: [
            { year: '2026', title: 'MSc in Clinical Psychology', description: 'The British University in Egypt and London South Bank University' },
            { year: '2024', title: 'BA in Clinical Psychology', description: 'Université Toulouse 2 Jean Jaurès, France' },
        ],
        updateTime: '2026-10-29T19:00:00Z',
    },
    F1jzTtRVVh2PMFASVHVe: {
        replaces: 'habiba-youssry',
        name: 'Sally Roshdy',
        position: 'Clinical Psychologist', // The owner, 31 October 2026.
        image: '/images/team/sally-roshdy.jpg',
        quote: '',
        certificates: [
            { year: '2021-2025', title: 'BA in Psychology, minor in Behavioral Neuroscience', description: 'High honors' },
            { year: '2025-2026', title: 'MSc in Applied Clinical Psychology', description: 'Distinction grade' },
            { year: '2025', title: 'Psychodynamic Therapy Training', description: 'Kasr El Maadi Hospital, July to August 2025' },
        ],
        updateTime: '2026-10-29T19:00:00Z',
    },
    // Heidi Fares finished her training and supervision (the owner, 29 October 2026).
    J9Odp0mxyUYUYQWZoNyT: { position: 'Clinical Psychologist' },
}

// Team photos served from this site, by Firestore id, from the practice's photo
// shoot (sent by the owner on 29 October 2026). They replace the Firebase Storage
// photos, which the free Firebase plan no longer serves.
export const TEAM_PHOTOS = {
    HJNGY0HUGgR9hmAbu7OP: '/images/team/weaam-elaidy.jpg',
    X4BxaEE7wk7eX89xknzz: '/images/team/ingie-el-saady.jpg',
    KFxjskC9AHfryZNIeQ92: '/images/team/mirna-mostafa.jpg',
    VvjHvkCbDzu05GDOSqSb: '/images/team/sahar-farid.jpg',
    T9wWRmQihJCyH0VVuQM5: '/images/team/jana-radwan.jpg',
    '34YNM9NMyuXgT9KbZ3DC': '/images/team/shahd-zanaty.jpg',
    iEhvRoHYHNipJ8vCbkuo: '/images/team/nadia-fahmy.jpg',
    pPoI0CEo3PAAKSZfwQ8L: '/images/team/farida-talaat.jpg',
    J9Odp0mxyUYUYQWZoNyT: '/images/team/heidi-fares.jpg',
}

export function applyTeamChanges(therapists = []) {
    return therapists.map(therapist => {
        const photo = TEAM_PHOTOS[therapist.id] ? { image: TEAM_PHOTOS[therapist.id] } : {}
        if (!TEAM_CHANGES[therapist.id]) return { ...therapist, ...photo }
        const { replaces, ...change } = TEAM_CHANGES[therapist.id]
        return { ...therapist, ...photo, ...change }
    })
}

// The last year a credential gives ("2023-2025" counts as 2025), 0 when undated.
function credentialYear(certificate) {
    const years = String(certificate?.year || '').match(/\d{4}/g)
    return years ? Number(years[years.length - 1]) : 0
}

// Credentials newest first, by the last year given; undated ones last.
export function sortCredentials(certificates = []) {
    return [...certificates].sort((a, b) => credentialYear(b) - credentialYear(a))
}

// Credentials someone holds today: a later year ("2028") is a degree still in progress.
function heldCredentials(certificates = []) {
    return sortCredentials(certificates).filter(c => c?.title && credentialYear(c) <= new Date().getFullYear())
}

// A certificate's description is typed by hand: usually the school, but sometimes a grade
// ("High honors"), a country ("USA") or both ("AUC Highest Honors"). Only these bodies are
// published as the one behind a credential, in summaries and structured data, so a grade
// never reads as a university. Add a school here when a profile first names it.
const AWARDING_BODIES = [
    [/\bAUC\b|American University in Cairo/i, 'The American University in Cairo'],
    [/British University in Egypt/i, 'The British University in Egypt'],
    [/Al ?Mashfa Hospital/i, 'Al Mashfa Hospital'],
    [/Cent(re|er) of Excellence/i, 'Centre of Excellence'],
    ...[
        'Ain Shams University', 'Beck Institute', 'Behman Psychiatric Hospital', 'Bournemouth University',
        'Cairo University', 'California Lutheran University', 'Coventry University TKH',
        'Egyptian Association for Psychotherapists', 'Egyptian Psychology Association', 'Heal Counseling Center',
        'Kasr El Maadi Hospital', 'Liverpool John Moores University', 'London South Bank University',
        'Maastricht University', 'Middlesex University London', 'Okasha Institute of Psychiatry',
        'Queen Mary University of London', 'Sheffield Hallam University', 'University of Edinburgh',
        'University of Oxford', 'University of Plymouth', 'University of Southampton',
        'Université Toulouse 2 Jean Jaurès', 'Wesleyan University',
    ].map(name => [new RegExp(name, 'i'), name]),
]

function awardingBodies(certificate) {
    return AWARDING_BODIES.filter(([pattern]) => pattern.test(certificate.description || '')).map(([, name]) => name)
}

// Hand-picked keyword slugs for the existing articles, keyed by Firestore id.
export const BLOG_SLUGS = {
    '6bUES3MKKemrzhuPJavZ': 'embracing-change-self-recovery',
    C0nCs8YWOwdIjAI7p5Xb: 'people-pleaser-struggles',
    ERQnHLdQJHQhuZgYJsiD: 'power-of-mindfulness',
    Hj5wufuLGpB3AwOcriYL: 'supporting-loved-ones-mental-health',
    Kg93YhicGd0ESqGQxx4i: 'managing-anger',
    Rg6LRrcLi8ARD0waiT8v: '10-strategies-to-deal-with-anxiety',
    W0ByGdjEcwhAYxE0yo0G: 'overcoming-anxiety-giving-yourself-permission',
    k2kmW7mHUrT0gJ5AsgpR: 'therapy-takes-time',
    kXcA96yItOsWQXevm6sW: 'setting-healthy-boundaries',
    pV2HTYGvNRD1Vzn7Uojr: 'challenging-your-inner-critic',
    tzHyzlP8upRuRlE6pQQO: 'breaking-free-from-codependency',
    xlXZzbyqyAEixDHKfE6j: 'parenting-styles-child-wellbeing',
}

export function blogSlug(blog) {
    return blog?.slug || BLOG_SLUGS[blog?.id] || slugify(blog?.title)
}

// Articles published from the code rather than Firestore. Same shape as a
// Firestore blog; if an article with the same title is added in Firestore,
// that one is shown instead.
export const EXTRA_BLOGS = [
    {
        id: 'online-or-face-to-face-therapy',
        slug: 'online-or-face-to-face-therapy',
        title: 'Online or Face-to-Face Therapy, in Arabic or English?',
        metaTitle: 'Online or Face-to-Face Therapy in Egypt?',
        metaDescription: 'Is online therapy as effective as face to face? What research says, when each suits you, and how to choose Arabic or English therapy in Egypt or abroad.',
        topic: 'Online Therapy',
        duration: '4 mins read',
        therapist: 'Weaam Elaidy',
        service: 'online-therapy',
        image: '/images/blog/online-or-face-to-face-therapy.jpg',
        createTime: '2026-10-29T19:00:00Z',
        updateTime: '2026-10-30T12:00:00Z',
        sources: [
            { title: 'Telepsychiatry versus face-to-face treatment: systematic review and meta-analysis', from: 'British Journal of Psychiatry, 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/37655816/' },
            { title: 'Comparing video-based and face-to-face psychotherapy: systematic review and meta-analysis', from: 'Journal of Medical Internet Research, 2026', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13440640/' },
            { title: 'Therapeutic alliance in videoconferencing psychotherapy compared to psychotherapy in person', from: 'Journal of Telemedicine and Telecare, 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/36974478/' },
            { title: 'Guidelines for the Practice of Telepsychology', from: 'American Psychological Association, 2024', url: 'https://www.apa.org/practice/guidelines/telepsychology-revision.pdf' },
            { title: 'Best Practices in Synchronous Videoconferencing-Based Telemental Health', from: 'American Psychiatric Association and American Telemedicine Association, 2022', url: 'https://www.psychiatry.org/getmedia/49f487ae-7b83-416a-8812-b2b25c717f6a/Resource-Document-Telemental-Health-Best-Practices.pdf' },
            { title: 'Emotionality differences between a native and foreign language', from: 'Frontiers in Psychology, 2014', url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.01055/full' },
            { title: 'Multilingualism and psychotherapy: exploring multilingual clients\' experiences', from: 'International Journal of Multilingualism, 2017', url: 'https://eprints.bbk.ac.uk/17869/' },
            { title: 'Video consultations', from: 'NHS', url: 'https://www.nhs.uk/using-the-nhs/nhs-services/gps/video-consultations/' },
            { title: 'Egypt prioritizes mental health support, expands services nationwide', from: 'Egypt Independent, 2026', url: 'https://www.egyptindependent.com/egypt-prioritizes-mental-health-support-expands-services-nationwide/' },
            { title: 'Egypt travel advice: Getting help', from: 'GOV.UK', url: 'https://www.gov.uk/foreign-travel-advice/egypt/getting-help' },
        ],
        description: 'On average, video therapy works about as well as face to face. Learn when each suits you and how to choose Arabic or English therapy in Egypt or abroad.',
        body: [
            'If you are starting therapy in New Cairo, or <a href="/services/online-therapy">online therapy in Egypt</a> or from abroad, two choices come up early. Face to face or video call? Arabic, English or both?<br />',
            'On average, video therapy works about as well as meeting face to face, so the choice often comes down to privacy, travel and comfort. For language, choose the one you find easiest for talking about feelings, or tell us if you would like both.<br />',
            '<h2>Is online therapy as effective as face to face?</h2><br />',
            'On average, yes. In a 2023 British Journal of Psychiatry review of 32 randomized trials, video and face-to-face treatment worked about equally well, with similar dropout rates. A 2026 review of 12 therapy trials, in the Journal of Medical Internet Research, also found no clear difference.<br />',
            'Research also suggests your bond with your therapist can be just as strong over video. Still, the evidence is limited. Most trials in the 2026 review were American and tested cognitive behavioral therapy (CBT), and results may differ by condition.<br />',
            '<h2>When might face-to-face therapy suit you better?</h2><br />',
            'Some people feel more at ease starting therapy in person. Face to face may also suit you better if:<br />',
            '<ul><li>You have nowhere private at home to talk without being overheard.</li><li>Someone at home might listen in, check your phone or make you feel unsafe.</li><li>You keep going through crises. Professional guidance suggests therapists then offer other options, such as in-person care.</li></ul><br />',
            '<a href="/services/child-adolescent-therapy">Sessions for children and teenagers</a> are held at our center in New Cairo, and teenagers can also attend online. <a href="/services/psychological-assessments">Psychological assessments</a> are carried out by our psychologists at the center in New Cairo. Many standardized tests were designed to be given face to face.<br />',
            '<h2>When might online therapy suit you better?</h2><br />',
            'Online sessions save travel time and can fit more easily around a busy week. <a href="/services/online-therapy">Online therapy</a> may suit you better if:<br />',
            '<ul><li>You live far from New Cairo, or your work or studies leave little spare time.</li><li>You travel often and want to keep your sessions going.</li><li>You live outside Egypt and want sessions in Arabic or English with a therapist based in Cairo.</li></ul><br />',
            'If you live outside Egypt, or will join sessions while traveling, mention it when you book. Rules on online therapy differ by country, and you and your therapist will need a plan for emergencies where you are.<br />',
            '<h2>Arabic, English or both?</h2><br />',
            'Choose the language you can talk about feelings in most freely. Research on bilingual people often finds that emotional words feel stronger in the language learned first. Childhood memories also tend to come back in more detail, and with more feeling, in that language.<br />',
            'Not everyone feels this way. If you grew up speaking English daily, at school, at home or with friends, it may carry as much feeling as Arabic, or more.<br />',
            'In a small 2025 master\'s thesis at the American University in Cairo, 20 Egyptian bilinguals talked about trauma and loss. They described Arabic as the language of closeness, and English as a buffer that helped them step back.<br />',
            'Some people find painful or embarrassing topics easier to begin in a second language. Others feel they cannot fully express themselves in it.<br />',
            'Switching languages mid-session is common. In a 2017 survey of 109 multilingual therapy clients, nearly two-thirds said they briefly switched languages. Therapists are encouraged to notice these switches with you, since a switch can bring a feeling closer or hold it at a distance.<br />',
            'Whether you want an English-speaking therapist in Cairo or an Arabic-speaking therapist online, tell us your preferred language when you book. We will match you with one of <a href="/therapists">our therapists</a>. <a href="/therapists/inji-farid">Inji Farid</a> also offers sessions in French.<br />',
            '<h2>How to prepare for an online session</h2><br />',
            'The UK\'s NHS and the British Psychological Society suggest these steps:<br />',
            '<ul><li>Choose a quiet, private, well-lit room where no one can overhear you.</li><li>Use headphones or earbuds so others cannot hear your therapist.</li><li>Check your internet, camera and microphone, and log on a few minutes early.</li><li>Keep your phone nearby, and agree with your therapist what to do if the call drops.</li><li>Ask the people at home not to disturb you.</li></ul><br />',
            'Your therapist may ask where you are at the start of each session, a routine safety step that professional guidance recommends.<br />',
            '<h2>What if you need help urgently?</h2><br />',
            'Therapy sessions, online or face to face, are not an emergency service. If you are thinking about ending your life, or you or someone else is in immediate danger, go to the nearest hospital emergency department. In Egypt you can also call 123 for an ambulance or 122 for the police.<br />',
            'For urgent emotional support, call 16328, the 24-hour psychological support hotline run by Egypt\'s Ministry of Health and Population. If you are outside Egypt, call your local emergency number.<br />',
            '<h2>How to start therapy in New Cairo or online</h2><br />',
            'Sessions are held at our center in 3Sixty by LMD, New Cairo, or online by video call.<br />',
            `When you are ready, message us on <a href="${whatsappUrl()}">WhatsApp at ${SITE.phoneDisplay}</a> or <a href="/book">request a session</a>. We are open every day, 10 am to 10 pm Cairo time.<br />`,
            'When you get in touch, tell us whether you prefer online or face to face, and Arabic, English or French. If you are not sure yet, say so, and we will help you choose a therapist.',
        ].join(''),
    },
    {
        id: 'narcissistic-parent',
        slug: 'narcissistic-parent',
        title: 'Growing Up with a Narcissistic Parent: Signs, Effects and Healing',
        metaTitle: 'Growing Up with a Narcissistic Parent: Signs and Healing',
        topic: 'Family Relationships',
        duration: '3 mins read',
        therapist: 'Weaam Elaidy',
        service: 'individual-adult-therapy',
        image: '/images/blog/narcissistic-parent.jpg',
        createTime: '2026-10-29T09:00:00Z',
        description: 'Growing up with a narcissistic parent can shape how you see yourself for years. Learn the common signs, how it shows up in adult life, and how to start healing.',
        body: [
            'Some parents love their children in a way that feels warm and steady. Others love in a way that always seems to come with conditions: you are praised when you make them look good, and ignored or criticized when you don\'t. If that sounds familiar, you may have grown up with a narcissistic parent.<br />',
            'The term "narcissistic parent" is not a diagnosis. Narcissistic personality disorder can only be diagnosed by a qualified professional, and not every self-centered parent has it. What the term describes is a pattern of parenting in which the parent\'s needs, image and feelings consistently come before the child\'s.<br />',
            '<h2>Common signs of a narcissistic parent</h2><br />',
            '<ul><li>Love feels conditional, tied to your grades, looks or achievements.</li><li>Your feelings are dismissed, mocked or turned into a story about them.</li><li>They need to be the center of attention, even on your important days.</li><li>Criticism is constant, while apologies are rare or never come.</li><li>Guilt, comparison or silence is used to control your choices.</li><li>One child is treated as the "golden child" and another as the scapegoat.</li><li>Your memories are denied or rewritten: "That never happened," "You\'re too sensitive."</li></ul><br />',
            'These patterns can be hard to see from the inside. When this is the only family you have known, it simply feels normal, and many people only begin to question it as adults, often when a partner, a friend or a therapist points it out.<br />',
            '<h2>How it can show up in adult life</h2><br />',
            'Children adapt to survive. They learn to read moods, keep the peace and earn approval. Those strategies make sense in childhood, but they often follow us into adulthood. Adult children of narcissistic parents commonly describe:<br />',
            '<ul><li>People-pleasing and difficulty saying no</li><li>Perfectionism and a harsh inner critic</li><li>Doubting their own feelings and memories</li><li>Guilt whenever they set a boundary</li><li>Being drawn to relationships that repeat the same dynamic</li></ul><br />',
            'If you recognize yourself here, it does not mean something is wrong with you. It means you learned to cope in an environment that did not meet your needs. You can read more in our articles on <a href="/blog/people-pleaser-struggles">the hidden struggles of a people-pleaser</a>, <a href="/blog/breaking-free-from-codependency">breaking free from codependency</a> and <a href="/blog/challenging-your-inner-critic">challenging your inner critic</a>.<br />',
            '<h2>First steps toward healing</h2><br />',
            '<ol><li><strong>Name the pattern.</strong> Understanding what happened helps you stop blaming yourself for it.</li><li><strong>Allow yourself to grieve.</strong> Many people grieve the parent they needed but did not have, even while that parent is still alive.</li><li><strong>Set boundaries that protect you.</strong> Boundaries can be small: shorter visits, sharing fewer personal details, or leaving a conversation that turns hurtful. How much contact to keep is a personal decision, and there is no single right answer.</li><li><strong>Practice self-compassion.</strong> Notice when your inner voice sounds like your parent, and answer it the way you would answer a friend.</li><li><strong>Get support.</strong> <a href="/services/individual-adult-therapy">Individual therapy</a> offers a safe place to make sense of your story and build new patterns. Approaches such as <a href="/services/cbt-behavioral-therapy">cognitive behavioral therapy (CBT)</a> can help you challenge long-held beliefs about your worth.</li></ol><br />',
            'Healing is not about blaming your parent or rewriting your whole past. It is about understanding how your story shaped you, so you can choose what you carry forward.<br />',
            '<h2>You do not have to do this alone</h2><br />',
            `At The Sonder Hood, our therapists work with adults who grew up with narcissistic or emotionally immature parents, face to face at our therapy center in New Cairo or online from anywhere in Egypt. When you are ready to talk, you can <a href="/book">request a session</a> or message us on <a href="${whatsappUrl()}">WhatsApp at ${SITE.phoneDisplay}</a>.`,
        ].join(''),
    },
]

// Cover photos served from this site, by Firestore id. They replace the article's
// Firebase Storage photo.
export const BLOG_IMAGES = {
    '6bUES3MKKemrzhuPJavZ': '/images/blog/embracing-change-self-recovery.jpg',
    C0nCs8YWOwdIjAI7p5Xb: '/images/blog/people-pleaser-struggles.jpg',
    ERQnHLdQJHQhuZgYJsiD: '/images/blog/power-of-mindfulness.jpg',
    Hj5wufuLGpB3AwOcriYL: '/images/blog/supporting-loved-ones-mental-health.jpg',
    Kg93YhicGd0ESqGQxx4i: '/images/blog/managing-anger.jpg',
    Rg6LRrcLi8ARD0waiT8v: '/images/blog/10-strategies-to-deal-with-anxiety.jpg',
    W0ByGdjEcwhAYxE0yo0G: '/images/blog/overcoming-anxiety-giving-yourself-permission.jpg',
    k2kmW7mHUrT0gJ5AsgpR: '/images/blog/therapy-takes-time.jpg',
    pV2HTYGvNRD1Vzn7Uojr: '/images/blog/challenging-your-inner-critic.jpg',
    kXcA96yItOsWQXevm6sW: '/images/blog/setting-healthy-boundaries.jpg',
    tzHyzlP8upRuRlE6pQQO: '/images/blog/breaking-free-from-codependency.jpg',
    xlXZzbyqyAEixDHKfE6j: '/images/blog/parenting-styles-child-wellbeing.jpg',
}

// Shorter titles and descriptions for search results, by Firestore id, where the
// article's own headline or summary runs past what Google shows. The article keeps
// both on the site.
export const BLOG_SEARCH = {
    Kg93YhicGd0ESqGQxx4i: {
        metaTitle: 'Managing Anger: Understanding a Powerful Emotion',
        metaDescription: 'Understand anger and how it affects your body, then learn healthy ways to manage it, from assertive communication to relaxation techniques.',
    },
    Rg6LRrcLi8ARD0waiT8v: {
        metaTitle: '10 Effective Strategies to Deal with Anxiety',
        metaDescription: 'Proven ways to manage anxiety, from understanding where it comes from to building a support system, so you can regain control of daily life.',
    },
    W0ByGdjEcwhAYxE0yo0G: { metaTitle: 'Overcoming Anxiety: Giving Yourself Permission' },
    kXcA96yItOsWQXevm6sW: { metaTitle: 'How to Set Healthy Boundaries and Hold Your Ground' },
    pV2HTYGvNRD1Vzn7Uojr: {
        metaTitle: 'How to Challenge Your Inner Critic',
        metaDescription: 'How a harsh inner critic wears down self-worth, and how recognizing it, understanding it and getting support can quiet those negative voices.',
    },
    xlXZzbyqyAEixDHKfE6j: {
        metaDescription: 'How parenting styles shape a child\'s mental health, why quality time matters more than quantity, and how acceptance, autonomy and love help children thrive.',
    },
}

// One spelling per author: the Firestore bylines were typed by hand. Keyed by the
// name without spaces, lowercased (legacySlug). Ingie El Saady as on her profile;
// "Engy Helmy" as "Ingy Helmy", the spelling on her other two articles.
const AUTHOR_SPELLINGS = {
    ingieelsaady: 'Ingie El Saady',
    engyhelmy: 'Ingy Helmy',
}

// The service page each article supports, linked at its end, by Firestore id
// (the articles in EXTRA_BLOGS name theirs).
const BLOG_SERVICES = {
    '6bUES3MKKemrzhuPJavZ': 'individual-adult-therapy',
    C0nCs8YWOwdIjAI7p5Xb: 'individual-adult-therapy',
    ERQnHLdQJHQhuZgYJsiD: 'cbt-behavioral-therapy',
    Hj5wufuLGpB3AwOcriYL: 'family-therapy',
    Kg93YhicGd0ESqGQxx4i: 'cbt-behavioral-therapy',
    Rg6LRrcLi8ARD0waiT8v: 'cbt-behavioral-therapy',
    W0ByGdjEcwhAYxE0yo0G: 'individual-adult-therapy',
    k2kmW7mHUrT0gJ5AsgpR: 'individual-adult-therapy',
    pV2HTYGvNRD1Vzn7Uojr: 'cbt-behavioral-therapy',
    kXcA96yItOsWQXevm6sW: 'individual-adult-therapy',
    tzHyzlP8upRuRlE6pQQO: 'individual-adult-therapy',
    xlXZzbyqyAEixDHKfE6j: 'child-adolescent-therapy',
}

// Firestore articles plus EXTRA_BLOGS, newest (the code-published ones) first.
export function mergeBlogs(blogs = []) {
    const titles = new Set(blogs.map(b => String(b.title || '').trim().toLowerCase()))
    const decorated = blogs.map(b => ({
        ...b,
        therapist: AUTHOR_SPELLINGS[legacySlug(b.therapist)] || b.therapist,
        ...(BLOG_IMAGES[b.id] && { image: BLOG_IMAGES[b.id] }),
        ...(BLOG_SERVICES[b.id] && { service: BLOG_SERVICES[b.id] }),
        ...BLOG_SEARCH[b.id],
    }))
    return [...EXTRA_BLOGS.filter(b => !titles.has(b.title.toLowerCase())), ...decorated]
}

// The service page an article supports, as { name, path }, or undefined.
export function blogServiceLink(blog) {
    return blog?.service ? SERVICE_LINKS.find(link => link.path === `/services/${blog.service}`) : undefined
}

// The articles listed under an article: same topic first, then same service, then newest.
export function relatedBlogs(blogs = [], blog, count = 3) {
    const closeness = (other) => (other.topic === blog.topic ? 2 : 0) + (other.service && other.service === blog.service ? 1 : 0)
    return blogs.filter(other => other.id !== blog.id).sort((a, b) => closeness(b) - closeness(a)).slice(0, count)
}

// Article authors are typed by hand ("Ingie ElSaady", "Ingie El Saady").
export function findTherapistByName(therapists = [], name) {
    const key = legacySlug(name)
    return key ? therapists.find(t => legacySlug(t.name) === key) : undefined
}

// ---------------------------------------------------------------- home page FAQ

export const HOME_FAQS = [
    {
        question: 'What can I expect during a typical psychotherapy session?',
        answer: 'During a psychotherapy session, you can expect to engage in open and confidential conversations with your therapist. You\'ll discuss your thoughts, feelings, and concerns, and your therapist will provide guidance, support, and strategies to help you address and manage your specific issues and goals. At The Sonder Hood, sessions can take place face to face at our therapy center in New Cairo or online, so you can choose the setting that feels most comfortable.',
    },
    {
        question: 'How long does psychotherapy usually take?',
        answer: 'The duration of psychotherapy varies based on individual needs and goals. Some people find relief in a few sessions, while others may engage in therapy for several months or longer. Therapy is a personalized journey, and the length of treatment depends on the complexity of the issues being addressed. Your therapist will track your progress with you along the way, whether you attend individual, couples or family therapy.',
    },
    {
        question: 'Is psychotherapy only for people with mental disorders?',
        answer: 'No, psychotherapy is not solely for those with diagnosed mental disorders. It can benefit anyone facing life challenges, stress, relationship issues, personal growth goals, or seeking support during difficult times. Therapists help clients with a wide range of concerns, from everyday stress to more complex psychological issues. Many adults, couples and families come to therapy simply to understand themselves better, improve their relationships or manage stress.',
    },
    {
        question: 'Is what I share in therapy confidential?',
        answer: 'Yes, therapy is confidential. Therapists are bound by ethical and legal obligations to protect your privacy. They cannot disclose what you share without your explicit consent, except in situations where there is a risk of harm to yourself or others. Trust and confidentiality are essential aspects of the therapeutic relationship, in face-to-face sessions and in online therapy alike.',
    },
    {
        question: 'What is the difference between a psychotherapist and a psychiatrist?',
        answer: 'A psychotherapist is a mental health professional trained in various therapeutic techniques to provide talk therapy and emotional support. They do not prescribe medication. In contrast, a psychiatrist is a medical doctor who can provide therapy but also has the authority to diagnose mental illnesses and prescribe medication when necessary. The choice between them often depends on whether you need therapy, medication, or a combination of both for your specific mental health needs. The Sonder Hood\'s team are psychologists and psychotherapists who provide talk therapy, such as cognitive behavioral therapy (CBT).',
    },
    {
        question: 'What types of therapy do you offer, and are sessions online or face to face?',
        answer: 'We offer individual therapy for adults, couples therapy, family therapy, child and adolescent therapy, behavioral therapy such as CBT and DBT, group therapy and psychological assessments. Sessions are available face to face at our therapy center in New Cairo or online by secure video call from anywhere in Egypt or abroad, so you can choose what suits you best. Sessions are available in Arabic and English, and in French with Inji Farid. Not sure which one is right for you? Answer four quick questions and we will suggest therapists from our team.',
        // Each service opens its page, and the button leads to "Find your therapist".
        links: {
            'individual therapy for adults': '/services/individual-adult-therapy',
            'couples therapy': '/services/couples-therapy',
            'family therapy': '/services/family-therapy',
            'child and adolescent therapy': '/services/child-adolescent-therapy',
            'behavioral therapy such as CBT and DBT': '/services/cbt-behavioral-therapy',
            'group therapy': '/services/group-therapy',
            'psychological assessments': '/services/psychological-assessments',
            'online by secure video call': '/services/online-therapy',
            'Inji Farid': '/therapists/inji-farid',
        },
        cta: { path: '/find-a-therapist', label: 'Find your therapist' },
    },
    {
        question: 'Where is your therapy center in New Cairo, and when are you open?',
        answer: `Our therapy center is at ${SITE.address.street} in ${SITE.address.locality}, Cairo, and we are open ${SITE.hours.display}. You can see a therapist face to face at the center, or online by video call from anywhere in Egypt or abroad, in Arabic or English. For directions, open the map on our Contact page or message us on WhatsApp at ${SITE.phoneDisplay}.`,
        links: { 'Our therapy center': NEW_CAIRO.path, 'Contact page': '/contact' },
    },
    {
        question: 'How do I book a session with a therapist?',
        answer: `The quickest way is to message us on WhatsApp at ${SITE.phoneDisplay}, or send a booking request through our website. Let us know whether you prefer an in-person or online session and any preferred days, and we will help you choose a therapist and find the nearest available slot. We are open ${SITE.hours.display}.`,
        links: { 'booking request': '/book' },
    },
    {
        question: 'Do you have a French-speaking therapist in Cairo?',
        answer: `Yes. Inji Farid, who studied clinical psychology in France, offers therapy in French as well as in Arabic and English, face to face at our center in New Cairo or online by video call from anywhere in Egypt or abroad. To book with her, message us on WhatsApp at ${SITE.phoneDisplay} and say you would like your sessions in French.`,
        links: { 'Inji Farid': '/therapists/inji-farid' },
    },
]

// ---------------------------------------------------------------- page copy shared with the prerendered HTML

export const HOME_HEADLINE = 'Therapy & psychotherapy in New Cairo, face to face or online'

// The cookie notice (src/components/ConsentBanner.js, also drawn into every page by
// scripts/prerender.mjs), followed by a link to the privacy policy.
export const CONSENT_TEXT = 'We would like to use Google Analytics to see which pages help visitors and how many of them contact us, never what anyone writes. It sets cookies, and it stays off unless you accept.'

export const INTROS = {
    services: 'The Sonder Hood offers psychotherapy for adults, couples, families, teenagers and children, face to face at our therapy center in New Cairo or online by secure video call from anywhere in Egypt. Choose a service to see how it works, which of our therapists offer it and answers to common questions.',
    therapists: [
        'The Sonder Hood\'s psychologists and psychotherapists work with adults, couples, families, teenagers and children, face to face at our therapy center in New Cairo and online across Egypt. Between them they offer individual therapy, couples and family therapy, cognitive behavioral therapy (CBT), DBT and psychological assessments. Every therapist works in Arabic and English, and Inji Farid also offers sessions in French.',
        'Filter by service to find the right therapist for you, open a profile to read their credentials, then request a booking or message us on WhatsApp.',
    ],
    contact: [
        'Visit The Sonder Hood at our therapy center in New Cairo for face-to-face sessions, or start online therapy from anywhere in Egypt or abroad.',
        'The quickest way to reach us is WhatsApp. Send us a message and we will help you choose a therapist and find the nearest available time.',
    ],
    // Phrases in the contact intro that open other pages (src/components/LinkedText.js).
    contactLinks: { 'our therapy center in New Cairo': NEW_CAIRO.path, 'online therapy': '/services/online-therapy' },
    book: 'Choose a session online or at our center in New Cairo. Your request opens in WhatsApp, ready to send to us, or message us directly at',
    finder: 'Answer a few quick questions and we will suggest therapists from our team who work with what you are going through. Your answers then open in WhatsApp as your first message to us, so we can reply and help you book.',
}

// /privacy. Keep it true to what the site does: if EmailJS copies of the forms are
// switched on, or another tool is added, say so here.
// What to do in a crisis, on the service, New Cairo, contact and booking pages. The
// numbers were rechecked on 30 October 2026: 123 and 122 on GOV.UK's Egypt travel advice,
// 16328 in a Ministry of Health statement of April 2026. Check them again if this changes.
export const SAFETY_NOTE = {
    heading: 'If you need urgent help',
    text: [
        `${SITE.name} is not an emergency service. If you are thinking about ending your life, or you or someone else is in immediate danger, go to the nearest hospital emergency department. In Egypt you can also call 123 for an ambulance or 122 for the police.`,
        'For urgent emotional support, call 16328, the 24-hour psychological support hotline run by Egypt\'s Ministry of Health and Population. If you are outside Egypt, call your local emergency number.',
    ],
    links: { 123: 'tel:123', 122: 'tel:122', 16328: 'tel:16328' },
}

export const PRIVACY = [
    {
        title: 'Who we are',
        text: [`${SITE.name} is a psychotherapy practice at ${SITE.address.display}. For any question about your information, email ${SITE.email} or message us on WhatsApp at ${SITE.phoneDisplay}.`],
    },
    {
        title: 'Analytics, only if you accept',
        text: [
            'If you accept the notice at the bottom of the page, we use Google Analytics to count visits and see which pages people read, the general area they visit from (city or country), their device and browser, and how they found us. It also records when someone taps WhatsApp, our phone number or a form\'s send button, by channel only. It does not receive your name, your phone number or anything you type into our forms or our therapist finder.',
            'Google Analytics sets two cookies for this, _ga and _ga_542B109XJK, which last up to 13 months. It deletes visit-level data after 14 months; overall totals in its reports are kept longer. Google may process this data outside Egypt.',
            'We use Google Analytics only with your consent. If you decline, it does not load at all. You can change your choice at any time with "Cookie settings" at the bottom of every page or the button at the end of this page, and we ask again after 12 months.',
        ],
    },
    {
        title: 'Services that load with our pages',
        text: ['Our lettering and photos come from this website itself. Two services from other companies load only where they are needed, and they receive your device\'s internet address: Google Maps for the map on our contact page, and Google Firebase when you subscribe to our newsletter (or, rarely, when this website\'s own copy of our services, therapists and articles fails to load and the page reads them from Firebase instead). The Instagram posts at the end of our home page are copies kept on this website (we fetch them through Behold, behold.so), so seeing them sends nothing to Instagram; opening one takes you to Instagram, which has its own privacy policy.'],
    },
    {
        title: 'WhatsApp, phone and email',
        text: ['Our booking form, contact form and therapist finder do not store what you type or choose on this website. They prepare a message in WhatsApp, and it reaches us only when you send it. WhatsApp, run by Meta, handles that message under its own privacy policy. Calls and emails reach us directly.'],
    },
    {
        title: 'Newsletter',
        text: [`If you subscribe to our newsletter, we keep your email address in our database (Google Firebase) to send you news from ${SITE.name}. Ask us at any time and we will delete it.`],
    },
    {
        title: 'Your choices',
        text: ['You can ask us what information we hold about you, and ask us to correct or delete it, by emailing us. What you share in therapy is confidential and is handled separately from this website.'],
    },
    {
        title: 'Updates',
        text: ['We will update this page if anything changes. Last updated 30 October 2026.'],
    },
]

// ---------------------------------------------------------------- page titles and descriptions

const BRAND = ` | ${SITE.name}`

// Google shows about 65 characters of a title, so the brand is left off a title it
// would push past that.
const TITLE_MAX = 65
function titled(main) {
    return `${main}${BRAND}`.length <= TITLE_MAX ? `${main}${BRAND}` : main
}

export const PAGES = {
    home: {
        path: '/',
        title: `Therapists in New Cairo & Online Therapy${BRAND}`,
        description: 'Psychotherapy in Arabic, English or French for adults, couples, families and teens, face to face in New Cairo or online across Egypt. Book on WhatsApp.',
    },
    about: {
        path: '/about',
        title: `About Us: A Therapy Center in New Cairo${BRAND}`,
        description: 'The story behind The Sonder Hood, a safe haven for therapy in New Cairo, and the team of psychologists and psychotherapists who work here.',
        updated: '2026-10-30',
    },
    therapists: {
        path: '/therapists',
        title: `Our Therapists in New Cairo & Online${BRAND}`,
        description: 'Meet our psychologists and psychotherapists in New Cairo and find a therapist for anxiety, depression, relationships or family issues, in person or online.',
    },
    services: {
        path: '/services',
        title: titled('Therapy Services in New Cairo: Adults, Couples, Families & CBT'),
        description: 'Individual adult therapy, couples therapy, family therapy, child and teen therapy, CBT, group therapy, assessments and online therapy in New Cairo.',
    },
    blog: {
        path: '/blog',
        title: `Mental Health Blog by Our Therapists${BRAND}`,
        description: 'Articles by The Sonder Hood\'s therapists on anxiety, boundaries, codependency, anger, mindfulness, parenting and therapy itself.',
    },
    contact: {
        path: '/contact',
        title: `Contact Us: Therapy Center in New Cairo${BRAND}`,
        description: `Reach The Sonder Hood on WhatsApp or by phone at ${SITE.phoneDisplay}, by email, or visit our therapy center in New Cairo, Egypt. Open ${SITE.hours.display}.`,
    },
    book: {
        path: '/book',
        title: `Book a Therapy Session in Cairo or Online${BRAND}`,
        description: 'Request a therapy session at our center in New Cairo or online. Send your request straight to our WhatsApp and we will find you the nearest available slot.',
    },
    finder: {
        path: '/find-a-therapist',
        title: `Find Your Therapist in New Cairo or Online${BRAND}`,
        description: 'Four quick questions show which of our therapists may suit you, in New Cairo or online, in Arabic, English or French. Then send your answers to us on WhatsApp.',
    },
    newCairo: {
        path: NEW_CAIRO.path,
        title: NEW_CAIRO.metaTitle,
        description: NEW_CAIRO.metaDescription,
    },
    privacy: {
        path: '/privacy',
        title: `Privacy Policy${BRAND}`,
        description: 'What The Sonder Hood\'s website collects, why, and how to ask us to see or delete it: analytics only with your consent, WhatsApp messages and newsletter emails.',
    },
    notFound: {
        path: '/404',
        title: `Page Not Found${BRAND}`,
        description: 'This page does not exist. Explore our therapy services, therapists and articles, or message us on WhatsApp.',
    },
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// '2026-10-30' as '30 October 2026'.
export function longDate(iso) {
    const [year, month, day] = String(iso || '').slice(0, 10).split('-').map(Number)
    return year && month && day ? `${day} ${MONTHS[month - 1]} ${year}` : ''
}

export function sentenceList(items) {
    const list = items.filter(Boolean)
    if (list.length <= 1) return list.join('')
    return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
}

function cleanPosition(position) {
    return String(position || '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
}

// Lower-case running text but keep acronyms such as OCD and CBT.
function lowerWords(text) {
    return String(text || '').split(' ').map(w => (w.length > 1 && w === w.toUpperCase() ? w : w.toLowerCase())).join(' ')
}

const CLIENTELE_WORDS = { 'adults +18': 'adults', 'individual adult therapy': 'adults', 'group therapy': 'groups', 'couples therapy': 'couples' }

export function serviceMeta(service) {
    const seo = service.seo || SERVICE_SEO[service.id] || {}
    return {
        path: `/services/${service.slug}`,
        title: titled(seo.metaTitle || `${service.title} in New Cairo & Online`),
        description: seo.metaDescription || service.description,
        image: SITE.image,
    }
}

export function therapistMeta(therapist) {
    const position = String(therapist.position || 'therapist').trim()
    const clientele = [...new Set((therapist.clientele || [])
        .map(c => String(c).trim().toLowerCase())
        .map(c => CLIENTELE_WORDS[c] || c)
        .filter(c => c && c !== 'all services'))]
    const focus = (therapist.search || []).slice(0, 3).map(lowerWords)
    // A language the rest of the team does not offer leads, so search results show it:
    // "Inji Farid is a French-speaking clinical psychologist...".
    const extra = therapistLanguages(therapist).slice(SITE.languages.length)
    const speaking = extra.length ? `${sentenceList(extra)}-speaking ` : ''
    const article = /^founder/i.test(position) ? 'the' : /^[aeiou]/i.test(speaking || position) ? 'an' : 'a'
    const describe = (clients, topics) => `${therapist.name} is ${article} ${speaking}${lowerWords(position)} at The Sonder Hood in New Cairo`
        + (clients.length ? `, working with ${sentenceList(clients)}` : '')
        + (topics.length ? `${clients.length ? '' : ', working'} on ${sentenceList(topics)}` : '')
        + `. Sessions in ${sentenceList(therapistLanguages(therapist))}.`
    // Search results show about 160 characters: fewer focus areas, then no client
    // groups, until the description fits.
    const tries = [[clientele, focus], [clientele, focus.slice(0, 2)], [clientele, focus.slice(0, 1)], [[], focus.slice(0, 2)], [[], focus.slice(0, 1)], [[], []]]
    const description = tries.map(([clients, topics]) => describe(clients, topics)).find(text => text.length <= 160) || describe([], [])
    return {
        path: `/therapists/${therapistSlug(therapist)}`,
        title: titled(`${therapist.name}, ${speaking.replace('-speaking', '-Speaking')}${/under training/i.test(position) ? 'Trainee ' : ''}${cleanPosition(position)} in New Cairo`),
        description,
        image: therapist.image || SITE.image,
        type: 'profile',
    }
}

// When the wording of the profile pages last changed. A later edit to a profile in
// Firestore counts instead.
export const PROFILES_UPDATED = '2026-10-30'

// A profile in plain sentences, from the profile's own fields, so people and AI engines
// can see who someone is, who they work with and where they trained. No pronouns: the
// profiles do not record them.
export function therapistSummary(therapist) {
    const position = String(therapist.position || 'therapist').trim()
    const extra = therapistLanguages(therapist).slice(SITE.languages.length)
    const speaking = extra.length ? `${sentenceList(extra)}-speaking ` : ''
    const article = /^founder/i.test(position) ? 'the' : /^[aeiou]/i.test(speaking || position) ? 'an' : 'a'
    const clients = [...new Set((therapist.clientele || [])
        .map(c => String(c).trim().toLowerCase())
        .map(c => CLIENTELE_WORDS[c] || c)
        .filter(c => c && c !== 'all services'))]
    // Tags are typed by hand, so "Family Problem" and "Family problems" can both appear.
    const tags = (therapist.search || []).map(lowerWords)
    const focus = tags.filter(tag => !tags.includes(`${tag}s`)).filter((tag, index, all) => all.indexOf(tag) === index)
    const degrees = heldCredentials(therapist.certificates)
        .filter(c => /\b(bachelor|master|masters|ba|bsc|ms|msc|phd|doctorate)\b/i.test(c.title))
        .map(c => [String(c.title).trim(), awardingBodies(c).join(' and ')].filter(Boolean).join(', '))
    return [
        `${therapist.name} is ${article} ${speaking}${lowerWords(position)} at ${SITE.name}, a psychotherapy practice at ${SITE.address.street} in New Cairo, Egypt.`,
        `${therapist.name} works ${clients.length ? `with ${sentenceList(clients)} ` : ''}in ${sentenceList(therapistLanguages(therapist))}.`,
        focus.length ? `Areas of focus include ${sentenceList(focus)}.` : '',
        degrees.length ? `Education: ${degrees.join('; ')}.` : '',
    ].filter(Boolean)
}

export function blogMeta(blog) {
    return {
        path: `/blog/${blogSlug(blog)}`,
        // An article may set a shorter title and description for search results;
        // its headline and blog card keep `title` and `description`.
        title: titled(blog.metaTitle || blog.title),
        description: blog.metaDescription || blog.description || PAGES.blog.description,
        image: blog.image || SITE.image,
        type: 'article',
    }
}

// ---------------------------------------------------------------- structured data (JSON-LD)

const ORG_ID = `${SITE.url}/#organization`
const personId = (slug) => `${SITE.url}/therapists/${slug}#person`

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function openingHoursLd() {
    return [{ '@type': 'OpeningHoursSpecification', dayOfWeek: WEEK, opens: SITE.hours.opens, closes: SITE.hours.closes }]
}

export function organizationLd() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'MedicalClinic',
                '@id': ORG_ID,
                name: SITE.name,
                alternateName: ['The Sonderhood', 'Sonderhood'],
                url: `${SITE.url}/`,
                logo: absoluteUrl(SITE.logo),
                image: absoluteUrl(SITE.image),
                description: 'Psychotherapy center in New Cairo offering individual adult therapy, couples therapy, family therapy, child and adolescent therapy, CBT and DBT, group therapy, psychological assessments and online therapy across Egypt.',
                telephone: SITE.phone,
                email: SITE.email,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: `${SITE.address.street}, ${SITE.address.road}`,
                    addressLocality: SITE.address.locality,
                    addressRegion: SITE.address.region,
                    postalCode: SITE.address.postalCode,
                    addressCountry: SITE.address.country,
                },
                geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
                hasMap: SITE.mapsUrl,
                openingHoursSpecification: openingHoursLd(),
                knowsLanguage: sessionLanguages().map(name => ({ '@type': 'Language', name })),
                areaServed: [
                    { '@type': 'City', name: 'New Cairo' },
                    { '@type': 'City', name: 'Cairo' },
                    { '@type': 'Country', name: 'Egypt' },
                ],
                founder: { '@type': 'Person', '@id': personId('weaam-elaidy'), name: 'Weaam Elaidy', url: absoluteUrl('/therapists/weaam-elaidy') },
                knowsAbout: ['Psychotherapy', 'Individual therapy', 'Couples therapy', 'Marriage counseling', 'Family therapy', 'Child and adolescent therapy', 'Cognitive behavioral therapy', 'Dialectical behavior therapy', 'Group therapy', 'Psychological assessment', 'Online therapy'],
                availableService: SERVICE_LINKS.map(s => ({ '@type': 'MedicalTherapy', name: s.name, url: absoluteUrl(s.path) })),
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: SITE.phone,
                    email: SITE.email,
                    contactType: 'customer service',
                    availableLanguage: SITE.languages,
                    hoursAvailable: openingHoursLd(),
                },
                sameAs: Object.values(SITE.socials),
            },
            {
                '@type': 'WebSite',
                '@id': `${SITE.url}/#website`,
                url: `${SITE.url}/`,
                name: SITE.name,
                inLanguage: 'en',
                publisher: { '@id': ORG_ID },
            },
        ],
    }
}

function breadcrumbLd(trail) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    }
}

function faqLd(faqs) {
    const items = (faqs || []).filter(f => f && f.question && f.answer)
    if (!items.length) return null
    return {
        '@type': 'FAQPage',
        mainEntity: items.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
    }
}

function graph(...nodes) {
    return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }
}

export function homeLd() {
    return graph(faqLd(HOME_FAQS))
}

// A page's own node, for pages whose copy has a date (pageCopy.mjs).
function webPageLd({ name, path, updated }) {
    return {
        '@type': 'WebPage',
        '@id': `${absoluteUrl(path)}#webpage`,
        url: absoluteUrl(path),
        name,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': ORG_ID },
        dateModified: updated || undefined,
    }
}

export function pageLd(page) {
    return graph(breadcrumbLd([{ name: page.name, path: page.path }]))
}

// The facts people and AI engines ask for, in one list (the About page).
export function aboutFacts(teamSize) {
    return [
        ['What it is', `${SITE.name} is a psychotherapy practice in New Cairo, Egypt.`],
        ['Founder', 'Weaam Elaidy, counseling psychotherapist'],
        ['Team', `${teamSize ? `${teamSize} ` : ''}psychologists and psychotherapists`],
        ['Services', sentenceList(SERVICE_LINKS.map(s => s.name))],
        ['Languages', languagesText()],
        ['Address', `${SITE.address.street}, ${SITE.address.road}, New Cairo, Egypt`],
        ['Online sessions', 'By secure video call, from anywhere in Egypt or abroad'],
        ['Opening hours', SITE.hours.display],
        ['Contact', `WhatsApp at ${SITE.phoneDisplay} or ${SITE.email}`],
    ]
}

export function newCairoLd() {
    return graph(
        webPageLd({ name: NEW_CAIRO.h1, path: NEW_CAIRO.path, updated: NEW_CAIRO.updated }),
        breadcrumbLd([{ name: 'Therapy in New Cairo', path: NEW_CAIRO.path }]),
        faqLd(NEW_CAIRO.faqs),
    )
}

export function serviceLd(service) {
    const meta = serviceMeta(service)
    return graph(
        webPageLd({ name: service.title, path: meta.path, updated: service.details?.updated }),
        {
            '@type': 'Service',
            name: service.title,
            serviceType: service.title,
            description: service.description,
            url: absoluteUrl(meta.path),
            provider: { '@id': ORG_ID },
            areaServed: [{ '@type': 'City', name: 'Cairo' }, { '@type': 'Country', name: 'Egypt' }],
        },
        breadcrumbLd([{ name: 'Services', path: '/services' }, { name: service.title, path: meta.path }]),
        faqLd(service.faqs),
    )
}

export function therapistLd(therapist) {
    const meta = therapistMeta(therapist)
    return graph(
        {
            '@type': 'Person',
            '@id': personId(therapistSlug(therapist)),
            name: therapist.name,
            jobTitle: String(therapist.position || '').trim(),
            description: therapistSummary(therapist)[0],
            url: absoluteUrl(meta.path),
            image: therapist.image ? absoluteUrl(therapist.image) : undefined,
            worksFor: { '@id': ORG_ID },
            knowsLanguage: therapistLanguages(therapist).map(name => ({ '@type': 'Language', name })),
            knowsAbout: (therapist.search || []).length ? therapist.search : undefined,
            hasCredential: heldCredentials(therapist.certificates).map(c => {
                const bodies = awardingBodies(c).map(name => ({ '@type': 'Organization', name }))
                return {
                    '@type': 'EducationalOccupationalCredential',
                    name: c.title,
                    recognizedBy: bodies.length > 1 ? bodies : bodies[0],
                    dateCreated: /^\d{4}$/.test(String(c.year || '').trim()) ? String(c.year).trim() : undefined,
                }
            }),
        },
        breadcrumbLd([{ name: 'Our Therapists', path: '/therapists' }, { name: therapist.name, path: meta.path }]),
    )
}

export function blogLd(blog, author) {
    const meta = blogMeta(blog)
    return graph(
        {
            '@type': 'BlogPosting',
            inLanguage: 'en',
            headline: blog.title,
            description: blog.description || undefined,
            url: absoluteUrl(meta.path),
            mainEntityOfPage: absoluteUrl(meta.path),
            image: blog.image ? absoluteUrl(blog.image) : undefined,
            datePublished: blog.createTime || undefined,
            dateModified: blog.updateTime || blog.createTime || undefined,
            author: author
                ? { '@type': 'Person', '@id': personId(therapistSlug(author)), name: author.name, jobTitle: String(author.position || '').trim() || undefined, url: absoluteUrl(`/therapists/${therapistSlug(author)}`) }
                : { '@type': 'Person', name: blog.therapist },
            publisher: { '@id': ORG_ID },
        },
        breadcrumbLd([{ name: 'Blog', path: '/blog' }, { name: blog.title, path: meta.path }]),
    )
}
