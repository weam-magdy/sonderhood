// "Find your therapist": the questions, how the answers match the team's profiles,
// and the WhatsApp message that carries the answers to the practice, so whoever
// replies on WhatsApp can pick up from there. Pure data and functions, shared by
// the app and scripts/prerender.mjs.

import { SITE, therapistLanguages, writesArabic } from './meta.mjs'

export const FINDER_PATH = '/find-a-therapist'

// The therapists' focus tags are typed by hand ("Self Esteem", "Self esteem issues",
// "Self-esteem"), so each topic matches them with a pattern. `short` labels the
// home page's buttons, and `ar` is how each answer reads in an Arabic message.
export const FINDER_TOPICS = [
    { id: 'anxiety', short: 'Anxiety', label: 'Anxiety and worry', ar: 'القلق', match: /anxiety|worry/i },
    { id: 'depression', short: 'Depression', label: 'Depression or low mood', ar: 'الاكتئاب أو الحزن المستمر', match: /depress|low mood|mood disorder/i },
    { id: 'stress', short: 'Stress', label: 'Stress and feeling overwhelmed', ar: 'الضغط النفسي والإرهاق', match: /stress|overwhelm/i },
    { id: 'relationships', short: 'Relationships', label: 'Relationships', ar: 'العلاقات', match: /relationship|interpersonal|attachment|repeated pattern/i },
    { id: 'marriage', short: 'Marriage', label: 'Marriage or couple problems', ar: 'مشكلات الزواج أو الارتباط', match: /marriage|couple/i },
    { id: 'family', short: 'Family Problems', label: 'Family problems', ar: 'مشكلات أسرية', match: /family/i },
    { id: 'parents', short: 'Abusive Parents', label: 'Difficult or abusive parents', ar: 'علاقة صعبة أو مؤذية مع الوالدين', match: /abusive parent|childhood emotional neglect/i },
    { id: 'self-esteem', short: 'Self Esteem', label: 'Self-esteem and confidence', ar: 'تقدير الذات والثقة بالنفس', match: /self.?esteem|confidence|identity|personal growth/i },
    { id: 'trauma', short: 'Trauma', label: 'Trauma', ar: 'الصدمات النفسية', match: /trauma|neglect/i },
    { id: 'social-anxiety', short: 'Social Anxiety', label: 'Social anxiety', ar: 'القلق الاجتماعي', match: /social anxiety|social pressure/i },
    { id: 'ocd', short: 'OCD', label: 'OCD', ar: 'الوسواس القهري (OCD)', match: /\bocd\b/i },
    { id: 'emotions', short: 'Anger', label: 'Anger and strong emotions', ar: 'الغضب والانفعالات الشديدة', match: /emotional regulation|anger/i },
    { id: 'grief', short: 'Grief', label: 'Grief and loss', ar: 'الحزن والفقد', match: /grief|loss/i },
    { id: 'life-changes', short: 'Life Changes', label: 'Life changes', ar: 'التغيرات الكبيرة في الحياة', match: /transition/i },
    { id: 'codependency', short: 'Codependency', label: 'Codependency', ar: 'الاعتمادية في العلاقات', match: /codependen/i },
    { id: 'eating', short: 'Eating Disorder', label: 'Eating and body image', ar: 'اضطرابات الأكل وصورة الجسد', match: /eating|body dysmorph/i },
    { id: 'addiction', short: 'Addiction', label: 'Addiction', ar: 'الإدمان', match: /addiction|substance/i },
    { id: 'personality', short: 'Personality Disorder', label: 'Personality difficulties', ar: 'صعوبات تتعلق بالشخصية', match: /personality/i },
    { id: 'psychosis', short: 'Psychosis', label: 'Psychosis', ar: 'الذهان', match: /psychosis|delusion/i },
]

const clientele = (therapist) => (therapist.clientele || []).join(' | ')

export const FINDER_FOR = [
    { id: 'adult', label: 'Me (an adult)', message: 'Myself (adult)', ar: 'لي (شخص بالغ)', fits: t => /adult/i.test(clientele(t)) },
    { id: 'couple', label: 'Us as a couple', message: 'A couple', ar: 'لنا كزوجين', fits: t => /couple/i.test(clientele(t)) },
    { id: 'family', label: 'Our family', message: 'Our family', ar: 'لأسرتنا', fits: t => /adult/i.test(clientele(t)) },
    { id: 'teen', label: 'A teenager (13 to 17)', message: 'A teenager (13 to 17)', ar: 'لمراهق (من 13 إلى 17 سنة)', fits: t => /adolescent/i.test(clientele(t)) },
    { id: 'child', label: 'A child (under 13)', message: 'A child (under 13)', ar: 'لطفل (أقل من 13 سنة)', fits: t => /child/i.test(clientele(t)) },
]

export const FINDER_MODES = [
    { id: 'center', label: 'At the center in New Cairo', ar: 'في المركز بالقاهرة الجديدة' },
    { id: 'online', label: 'Online by video call', ar: 'أونلاين بمكالمة فيديو' },
    { id: 'either', label: 'Either is fine', ar: 'في المركز أو أونلاين' },
]

export const FINDER_LANGUAGES = [
    { id: 'arabic', label: 'Arabic', ar: 'العربية' },
    { id: 'english', label: 'English', ar: 'الإنجليزية' },
    { id: 'french', label: 'French', ar: 'الفرنسية' },
    { id: 'either', label: 'Either is fine', ar: 'لا يهم' },
]

const labelOf = (options, id, arabic = false) => {
    const option = options.find(o => o.id === id)
    if (!option) return ''
    return arabic ? option.ar : option.message || option.label
}

// Up to three therapists who work with the person the therapy is for, in the chosen
// language, ranked by how many of the chosen topics their profile covers. Qualified psychologists rank
// above those still under supervision when the fit is otherwise equal.
export function matchTherapists(therapists = [], { topics = [], who, language } = {}) {
    const forOption = FINDER_FOR.find(o => o.id === who)
    const speaks = FINDER_LANGUAGES.find(o => o.id === language && o.id !== 'either')
    const chosen = FINDER_TOPICS.filter(topic => topics.includes(topic.id))
    return therapists
        .filter(t => !forOption || forOption.fits(t))
        .filter(t => !speaks || therapistLanguages(t).includes(speaks.label))
        .map(t => {
            const tags = (t.search || []).join(' | ')
            const hits = chosen.filter(topic => topic.match.test(tags))
            let score = hits.length * 2
            if (who === 'family' && /family/i.test(tags)) score += 3
            if (!/training/i.test(t.position || '')) score += 1
            return { therapist: t, score, hits }
        })
        .filter(result => !chosen.length || result.hits.length > 0)
        .sort((a, b) => b.score - a.score
            || (b.therapist.search || []).length - (a.therapist.search || []).length
            || String(a.therapist.name).localeCompare(String(b.therapist.name)))
        .slice(0, 3)
}

// The first WhatsApp message: every answer on its own line, so the reply can
// start from them. `therapist` is set when the person picked one to book with.
// It is in Arabic when they chose Arabic sessions or typed their name in Arabic;
// `arabicFallback` (the browser's language) decides when neither says.
export function finderMessage({ name, topics = [], who, mode, language, suggested = [], therapist, arabicFallback = false } = {}) {
    const typedName = String(name || '').trim()
    const arabic = language === 'arabic' || writesArabic([typedName], language === 'english' || language === 'french' ? false : arabicFallback)
    if (arabic) {
        const help = FINDER_TOPICS.filter(topic => topics.includes(topic.id)).map(topic => topic.ar)
        const lines = ['مرحبًا، استخدمت «ابحث عن معالجك» على موقعكم.', '']
        if (typedName) lines.push(`الاسم: ${typedName}`)
        lines.push(`أحتاج مساعدة في: ${help.length ? help.join('، ') : 'لم أحدد بعد'}`)
        if (who) lines.push(`لمن العلاج: ${labelOf(FINDER_FOR, who, true)}`)
        if (mode) lines.push(`الجلسات: ${labelOf(FINDER_MODES, mode, true)}`)
        if (language) lines.push(`اللغة: ${labelOf(FINDER_LANGUAGES, language, true)}`)
        if (therapist) {
            lines.push('', `أود الحجز مع ${therapist}.`)
        } else {
            if (suggested.length) lines.push(`اقترح الموقع: ${suggested.join('، ')}`)
            lines.push('', 'أرجو مساعدتي في حجز أول جلسة.')
        }
        return lines.join('\n')
    }
    const help = FINDER_TOPICS.filter(topic => topics.includes(topic.id)).map(topic => topic.label)
    const lines = [`Hello ${SITE.name}, I used "Find your therapist" on your website.`, '']
    if (String(name || '').trim()) lines.push(`Name: ${String(name).trim()}`)
    lines.push(`Help with: ${help.length ? help.join(', ') : 'Not sure yet'}`)
    if (who) lines.push(`Therapy for: ${labelOf(FINDER_FOR, who)}`)
    if (mode) lines.push(`Sessions: ${labelOf(FINDER_MODES, mode)}`)
    if (language) lines.push(`Language: ${labelOf(FINDER_LANGUAGES, language)}`)
    if (therapist) {
        lines.push('', `I would like to book with ${therapist}.`)
    } else {
        if (suggested.length) lines.push(`Suggested on the website: ${suggested.join(', ')}`)
        lines.push('', 'Please help me book a first session.')
    }
    return lines.join('\n')
}

// The one therapist who offers a language the rest of the team does not
// ("french" → "Inji Farid"), or ''.
export function soleTherapistFor(language) {
    const option = FINDER_LANGUAGES.find(o => o.id === language)
    return (option && SITE.otherLanguages[option.label]) || ''
}

// Topic ids handed over by the home page's "I am looking for..." chips, which pass
// them as navigation state so they never appear in the address or browser history.
export function knownTopics(ids = []) {
    return (Array.isArray(ids) ? ids : []).filter(id => FINDER_TOPICS.some(topic => topic.id === id))
}

// "Works with: anxiety and worry, OCD": lower-case a label's first letter unless it
// starts an acronym.
export function inSentence(label) {
    return /^[A-Z][a-z]/.test(label) ? label[0].toLowerCase() + label.slice(1) : label
}
