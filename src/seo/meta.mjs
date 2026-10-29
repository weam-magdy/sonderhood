// Site facts, page titles/descriptions, URL slugs and structured data.
// Shared by the React app and by scripts/prerender.mjs (which runs in plain Node),
// so this file holds only data and pure functions: no imports, no browser globals.

export const SITE = {
    name: 'The Sonderhood',
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
        display: '3Sixty by LMD, New Cairo, Cairo, Egypt',
    },
    geo: { latitude: 30.0277362, longitude: 31.5510843 },
    mapsUrl: 'https://maps.app.goo.gl/UBNXujaUDyvCnvf26',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=3sixty%20By%20LMD%2C%20New%20Cairo&ll=30.0277362,31.5510843&z=16&output=embed',
    image: '/og-image.jpg',
    logo: '/logo512.png',
    socials: {
        facebook: 'https://www.facebook.com/profile.php?id=100092881591617',
        instagram: 'https://www.instagram.com/thesonderhood/',
        linkedin: 'https://www.linkedin.com/company/94863370/',
    },
}

export const DEFAULT_WHATSAPP_TEXT = 'Hello The Sonderhood, I would like to book a therapy session.'

export function whatsappUrl(text = DEFAULT_WHATSAPP_TEXT) {
    return `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export function absoluteUrl(path = '/') {
    if (/^https?:\/\//.test(path)) return path
    return SITE.url + (path.startsWith('/') ? path : `/${path}`)
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
        metaDescription: 'Online therapy by secure video with The Sonderhood\'s therapists, for individuals, couples and teenagers anywhere in Egypt or abroad. Book on WhatsApp.',
        intro: 'Online sessions are run by the same team of therapists who see clients at our center in New Cairo, so you can start therapy from anywhere in Egypt or abroad.',
    },
    ee4ZPo01CGhm2vK1Li4C: {
        slug: 'group-therapy',
        name: 'Group Therapy',
        metaTitle: 'Group Therapy in New Cairo',
        metaDescription: 'Small, therapist-led groups for anxiety, grief and loss, codependency and family issues. Connect with others and grow, with The Sonderhood in New Cairo.',
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

export function decorateService(service) {
    const seo = SERVICE_SEO[service.id] || {}
    return {
        ...service,
        legacySlug: legacySlug(service.title),
        slug: seo.slug || slugify(service.title),
        title: seo.name || service.title,
        seo,
    }
}

// Firestore services plus EXTRA_SERVICES, decorated and in display order.
export function mergeServices(services = [], therapists = []) {
    const titles = new Set(services.map(s => String(s.title || '').trim().toLowerCase()))
    const merged = services.map(decorateService)
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
        id: 'narcissistic-parent',
        slug: 'narcissistic-parent',
        title: 'Growing Up with a Narcissistic Parent: Signs, Effects and Healing',
        topic: 'Family Relationships',
        duration: '3 mins read',
        therapist: 'Weaam Elaidy',
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
            `At The Sonderhood, our therapists work with adults who grew up with narcissistic or emotionally immature parents, face to face at our therapy center in New Cairo or online from anywhere in Egypt. When you are ready to talk, you can <a href="/book">request a session</a> or message us on <a href="${whatsappUrl()}">WhatsApp at ${SITE.phoneDisplay}</a>.`,
        ].join(''),
    },
]

// Firestore articles plus EXTRA_BLOGS, newest (the code-published ones) first.
export function mergeBlogs(blogs = []) {
    const titles = new Set(blogs.map(b => String(b.title || '').trim().toLowerCase()))
    return [...EXTRA_BLOGS.filter(b => !titles.has(b.title.toLowerCase())), ...blogs]
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
        answer: 'During a psychotherapy session, you can expect to engage in open and confidential conversations with your therapist. You\'ll discuss your thoughts, feelings, and concerns, and your therapist will provide guidance, support, and strategies to help you address and manage your specific issues and goals. At The Sonderhood, sessions can take place face to face at our therapy center in New Cairo or online, so you can choose the setting that feels most comfortable.',
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
        answer: 'A psychotherapist is a mental health professional trained in various therapeutic techniques to provide talk therapy and emotional support. They do not prescribe medication. In contrast, a psychiatrist is a medical doctor who can provide therapy but also has the authority to diagnose mental illnesses and prescribe medication when necessary. The choice between them often depends on whether you need therapy, medication, or a combination of both for your specific mental health needs. The Sonderhood\'s team are psychologists and psychotherapists who provide talk therapy, such as cognitive behavioral therapy (CBT).',
    },
    {
        question: 'What types of therapy do you offer, and are sessions online or face to face?',
        answer: 'We offer individual therapy for adults, couples therapy, family therapy, child and adolescent therapy, behavioral therapy such as CBT and DBT, group therapy and psychological assessments. Sessions are available face to face at our therapy center in New Cairo or online by secure video call from anywhere in Egypt or abroad, so you can choose what suits you best.',
    },
    {
        question: 'How do I book a session with a therapist?',
        answer: `The quickest way is to message us on WhatsApp at ${SITE.phoneDisplay}, or send a booking request through our website. Let us know whether you prefer an in-person or online session and any preferred days, and we will help you choose a therapist and find the nearest available slot.`,
    },
]

// ---------------------------------------------------------------- page copy shared with the prerendered HTML

export const HOME_HEADLINE = 'Therapy & psychotherapy in New Cairo, face to face or online'

export const INTROS = {
    services: 'The Sonderhood offers psychotherapy for adults, couples, families, teenagers and children, face to face at our therapy center in New Cairo or online by secure video call from anywhere in Egypt. Choose a service to see how it works, which of our therapists offer it and answers to common questions.',
    therapists: [
        'The Sonderhood\'s psychologists and psychotherapists work with adults, couples, families, teenagers and children, face to face at our therapy center in New Cairo and online across Egypt. Between them they offer individual therapy, couples and family therapy, cognitive behavioral therapy (CBT), DBT and psychological assessments.',
        'Filter by service to find the right therapist for you, open a profile to read their credentials, then request a booking or message us on WhatsApp.',
    ],
    contact: [
        'Visit The Sonderhood at our therapy center in New Cairo for face-to-face sessions, or start online therapy from anywhere in Egypt or abroad.',
        'The quickest way to reach us is WhatsApp. Send us a message and we will help you choose a therapist and find the nearest available time.',
    ],
    book: 'Choose a session online or at our center in New Cairo. Your request opens in WhatsApp, ready to send to us, or message us directly at',
}

// ---------------------------------------------------------------- page titles and descriptions

const BRAND = ` | ${SITE.name}`

export const PAGES = {
    home: {
        path: '/',
        title: `Therapists in New Cairo & Online Therapy in Egypt${BRAND}`,
        description: 'Psychotherapy for adults, couples, families and teens, face to face in New Cairo or online across Egypt. CBT, assessments and more. Book on WhatsApp.',
    },
    about: {
        path: '/about',
        title: `About Us: A Therapy Center in New Cairo${BRAND}`,
        description: 'The story behind The Sonderhood, a safe haven for therapy in New Cairo, and the team of psychologists and psychotherapists who work here.',
    },
    therapists: {
        path: '/therapists',
        title: `Our Therapists in New Cairo & Online${BRAND}`,
        description: 'Meet our psychologists and psychotherapists in New Cairo. Find a therapist for anxiety, depression, relationships, couples or family issues, in person or online.',
    },
    services: {
        path: '/services',
        title: `Therapy Services: Adults, Couples, Families & CBT${BRAND}`,
        description: 'Individual adult therapy, couples therapy, family therapy, child and teen therapy, CBT, group therapy, assessments and online therapy in New Cairo.',
    },
    blog: {
        path: '/blog',
        title: `Mental Health Blog by Our Therapists${BRAND}`,
        description: 'Articles by The Sonderhood\'s therapists on anxiety, boundaries, codependency, anger, mindfulness, parenting and therapy itself.',
    },
    contact: {
        path: '/contact',
        title: `Contact Us: Therapy Center in New Cairo${BRAND}`,
        description: `Reach The Sonderhood on WhatsApp or by phone at ${SITE.phoneDisplay}, by email, or visit our therapy center in New Cairo, Cairo, Egypt.`,
    },
    book: {
        path: '/book',
        title: `Book a Therapy Session in Cairo or Online${BRAND}`,
        description: 'Request a therapy session at our center in New Cairo or online. Send your request straight to our WhatsApp and we will find you the nearest available slot.',
    },
    notFound: {
        path: '/404',
        title: `Page Not Found${BRAND}`,
        description: 'This page does not exist. Explore our therapy services, therapists and articles, or message us on WhatsApp.',
    },
}

function sentenceList(items) {
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
        title: `${seo.metaTitle || `${service.title} in New Cairo & Online`}${BRAND}`,
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
    const article = /^founder/i.test(position) ? 'the' : /^[aeiou]/i.test(position) ? 'an' : 'a'
    let description = `${therapist.name} is ${article} ${lowerWords(position)} at The Sonderhood in New Cairo`
    if (clientele.length) description += `, working with ${sentenceList(clientele)}`
    if (focus.length) description += ` on ${sentenceList(focus)}`
    description += '. Sessions in person or online.'
    return {
        path: `/therapists/${therapistSlug(therapist)}`,
        title: `${therapist.name}, ${cleanPosition(position)} in New Cairo${BRAND}`,
        description,
        image: therapist.image || SITE.image,
        type: 'profile',
    }
}

export function blogMeta(blog) {
    return {
        path: `/blog/${blogSlug(blog)}`,
        title: `${blog.title}${BRAND}`,
        description: blog.description || PAGES.blog.description,
        image: blog.image || SITE.image,
        type: 'article',
    }
}

// ---------------------------------------------------------------- structured data (JSON-LD)

const ORG_ID = `${SITE.url}/#organization`

export function organizationLd() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'MedicalClinic',
                '@id': ORG_ID,
                name: SITE.name,
                alternateName: ['The Sonder Hood', 'Sonderhood'],
                url: `${SITE.url}/`,
                logo: absoluteUrl(SITE.logo),
                image: absoluteUrl(SITE.image),
                description: 'Psychotherapy center in New Cairo offering individual adult therapy, couples therapy, family therapy, child and adolescent therapy, CBT and DBT, group therapy, psychological assessments and online therapy across Egypt.',
                telephone: SITE.phone,
                email: SITE.email,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: SITE.address.street,
                    addressLocality: SITE.address.locality,
                    addressRegion: SITE.address.region,
                    addressCountry: SITE.address.country,
                },
                geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
                hasMap: SITE.mapsUrl,
                areaServed: [
                    { '@type': 'City', name: 'Cairo' },
                    { '@type': 'Country', name: 'Egypt' },
                ],
                knowsAbout: ['Psychotherapy', 'Individual therapy', 'Couples therapy', 'Marriage counseling', 'Family therapy', 'Child and adolescent therapy', 'Cognitive behavioral therapy', 'Dialectical behavior therapy', 'Group therapy', 'Psychological assessment', 'Online therapy'],
                availableService: SERVICE_LINKS.map(s => ({ '@type': 'MedicalTherapy', name: s.name, url: absoluteUrl(s.path) })),
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: SITE.phone,
                    email: SITE.email,
                    contactType: 'customer service',
                    availableLanguage: ['English', 'Arabic'],
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

export function pageLd(page) {
    return graph(breadcrumbLd([{ name: page.name, path: page.path }]))
}

export function serviceLd(service) {
    const meta = serviceMeta(service)
    return graph(
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
            name: therapist.name,
            jobTitle: String(therapist.position || '').trim(),
            url: absoluteUrl(meta.path),
            image: therapist.image || undefined,
            worksFor: { '@id': ORG_ID },
            knowsAbout: (therapist.search || []).length ? therapist.search : undefined,
            hasCredential: (therapist.certificates || []).filter(c => c && c.title).map(c => ({
                '@type': 'EducationalOccupationalCredential',
                name: c.title,
            })),
        },
        breadcrumbLd([{ name: 'Our Therapists', path: '/therapists' }, { name: therapist.name, path: meta.path }]),
    )
}

export function blogLd(blog, author) {
    const meta = blogMeta(blog)
    return graph(
        {
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.description || undefined,
            url: absoluteUrl(meta.path),
            mainEntityOfPage: absoluteUrl(meta.path),
            image: blog.image ? absoluteUrl(blog.image) : undefined,
            datePublished: blog.createTime || undefined,
            dateModified: blog.updateTime || blog.createTime || undefined,
            author: author
                ? { '@type': 'Person', name: author.name, url: absoluteUrl(`/therapists/${therapistSlug(author)}`) }
                : { '@type': 'Person', name: blog.therapist },
            publisher: { '@id': ORG_ID },
        },
        breadcrumbLd([{ name: 'Blog', path: '/blog' }, { name: blog.title, path: meta.path }]),
    )
}
