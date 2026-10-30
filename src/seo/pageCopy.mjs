// Longer copy for the service pages and the New Cairo page (30 October 2026), written
// from the team's own profiles and fact-checked line by line: no prices, durations,
// statistics, methods outside the team's training, or details about the building.
// Plain data, shared by the app and scripts/prerender.mjs.
//
// SERVICE_DETAILS is keyed by service slug. Each section is drawn as an H2 and its
// paragraphs; `links` maps an exact phrase in the section to a page of this site.
// `faqs` are added after the service's own questions. `updated` is the last time the
// page's copy changed: it goes to the sitemap and the structured data.

export const SERVICE_DETAILS = {
    'individual-adult-therapy': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'What counseling for adults can help with',
                paragraphs: [
                    'People often start by looking for therapy for anxiety and depression. Anxiety can feel like a mind that will not switch off at night, or a tight chest before an ordinary meeting. Low mood can make it hard to get up, enjoy things or reach out to people.',
                    'Other reasons are quieter: stress that has built up for years, low self-esteem, a relationship that keeps hitting the same wall, or the intrusive thoughts and rituals of OCD. Some of it goes further back. Trauma, or growing up with a critical or narcissistic parent, can shape how you see yourself well into adult life. Big life changes, such as a move, a divorce or a loss, can bring old things to the surface too. All of this is part of what our therapists work with.',
                    'If the difficulty sits mainly between you and your partner, couples therapy may suit you better, or you can begin on your own.',
                ],
                links: {
                    'narcissistic parent': '/blog/narcissistic-parent',
                    'couples therapy': '/services/couples-therapy',
                },
            },
            {
                heading: 'What happens in your first session',
                paragraphs: [
                    'Your first session is mostly a conversation. Your therapist will ask what brings you to therapy now, how things are affecting your daily life, and a little about your background. You decide how much to share, and it is fine to say something is too hard to talk about yet.',
                    'Feeling nervous, or not knowing where to begin, is common. Your therapist will guide the conversation, and you are welcome to ask how they work. If a clearer picture would help, your therapist may suggest a psychological assessment and explain what it involves. You do not have to commit to anything on the day.',
                ],
                links: {
                    'psychological assessment': '/services/psychological-assessments',
                },
            },
            {
                heading: 'How therapy develops over time',
                paragraphs: [
                    'Early on, you and your therapist agree on what you want to change. What the work looks like depends on what you bring and on your therapist\'s training.',
                    'CBT looks at the links between thoughts, feelings and behavior, and often includes small exercises to try between sessions. DBT builds skills for handling strong emotions. Psychodynamic therapy explores how earlier experiences shape the patterns you live with now. A trauma-informed approach moves at a pace you can manage.',
                    'Progress is rarely a straight line. Some sessions feel lighter and others stir up more than you expected, and both can be part of change. Your therapist will check in on how things are going, and you can say when something is not helping. Change often comes more slowly than people hope, and that is part of why therapy takes time. When you are ready to finish, you plan the ending together.',
                ],
                links: {
                    CBT: '/services/cbt-behavioral-therapy',
                    'therapy takes time': '/blog/therapy-takes-time',
                },
            },
            {
                heading: 'Choosing a therapist in New Cairo',
                paragraphs: [
                    'Looking for a psychologist in Cairo often starts with a long list of names and no clear way to choose. Our therapists have different training and focus areas, and each profile sets out the therapist\'s training and the clients they see.',
                    'If you would like help deciding, answer the four Find your therapist questions. Your answers open in WhatsApp as your first message, and we will help you choose a therapist. You can also message us on WhatsApp at +20 109 429 2553 or send a booking request.',
                    'If the match does not feel right once you have met, you can ask to change therapist and see someone else on the team. You can say so in a session or in a message to us, whichever is easier for you.',
                ],
                links: {
                    'Our therapists': '/therapists',
                    'Find your therapist questions': '/find-a-therapist',
                    'booking request': '/book',
                },
            },
            {
                heading: 'Individual therapy in New Cairo or online',
                paragraphs: [
                    'The center is at 3Sixty by LMD in New Cairo. Online sessions are with the same therapists who see clients there, and you can join by video from anywhere in Egypt or abroad.',
                    'Every therapist works in Arabic and English. Many people find some things easier to say in one language than the other, so you can use whichever feels closer to what you mean. Inji Farid also offers sessions in French.',
                    'If you are unsure which format suits you, our article on online or face to face therapy compares the two, and our online therapy page explains how video sessions work.',
                ],
                links: {
                    'Inji Farid': '/therapists/inji-farid',
                    'online or face to face therapy': '/blog/online-or-face-to-face-therapy',
                    'online therapy': '/services/online-therapy',
                },
            },
        ],
        faqs: [
            {
                question: 'Is a psychologist the same as a psychiatrist?',
                answer: 'No. A psychiatrist is a medical doctor and can write prescriptions. Our team are psychologists and psychotherapists: they work with you through talking therapy and do not prescribe. If you already see a psychiatrist, you can tell your therapist, and many people have therapy and psychiatric care at the same time.',
            },
            {
                question: 'Do I need a diagnosis to begin therapy?',
                answer: 'No. You can come with a sense that something is not right, even if you cannot name it yet. Describe what has been happening in your own words, and your therapist can help you understand it and decide with you what to focus on. To book, message us on WhatsApp at +20 109 429 2553, send a booking request, or answer the Find your therapist questions.',
            },
            {
                question: 'Can I have sessions in the evening or at the weekend?',
                answer: 'Yes. The Sonder Hood is open every day, 10 am to 10 pm Cairo time, Fridays and Saturdays included, so you can see a therapist in New Cairo or online after work or at the weekend. When you get in touch, tell us which days and times suit you, and we will suggest a session time.',
            },
        ],
    },
    'couples-therapy': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'When couples therapy in Cairo can help',
                paragraphs: [
                    'Many couples come to therapy because the same argument keeps coming back. The subject changes, money one day and in-laws the next, but the steps stay the same: one of you pushes to talk, the other goes quiet or gets defensive, and nothing gets settled.',
                    'Others come after trust has been broken, by an affair or by money kept secret. One of you may need to keep talking about it while the other wants to move on, and both of you can end up feeling alone with it.',
                    'Some couples are not fighting much at all. They have drifted into running a home side by side, with little closeness left, and sex or affection has become hard to raise without hurt. Couples therapy in Cairo gives you a place to talk about any of this with someone who belongs to neither family.',
                ],
                links: {},
            },
            {
                heading: 'How sessions with both partners work',
                paragraphs: [
                    'At the start, your therapist usually listens to each of you in turn, so both versions of the story are heard. They may also ask each of you what you need, and what you tend to do when things get tense.',
                    'A marriage counselor is not there to rule on who was right in the last argument. Your therapist looks at the loop you both get caught in, for example criticism that leads to withdrawal, which leads to more criticism. Once the loop has a name, you can start working against it together, rather than against each other.',
                    'If a conversation heats up during a session, your therapist may slow it down and go back to the moment it turned. Between sessions, you may be asked to practice a new way of talking at home. If you ever feel your therapist is leaning toward your partner, say so: that conversation is part of the work too.',
                ],
                links: {},
            },
            {
                heading: 'Parenting and the wider family',
                paragraphs: [
                    'A marriage often comes with two families attached. Decisions about where to live, how often to visit or how to raise the children can turn into a test of loyalty. Sessions can help the two of you agree on what you want as a couple, and on how to explain it to both sets of parents with respect. Our article on setting healthy boundaries has practical steps.',
                    'When the tension has reached your children, or you are separating and want to support them through it, family therapy can bring more of the family into the room. Your therapist can talk with you about which kind of session fits.',
                ],
                links: {
                    'setting healthy boundaries': '/blog/setting-healthy-boundaries',
                    'family therapy': '/services/family-therapy',
                },
            },
            {
                heading: 'Starting relationship counseling on your own',
                paragraphs: [
                    'Often one partner is ready before the other. You can still begin. Relationship counseling on your own lets you look at your part in the pattern, such as what sets you off and how you might raise things another way. When one person changes how they respond, the conversation between you can start to shift too.',
                    'Sessions without your partner are individual therapy, with the relationship as their focus. You might tell your partner the aim is to understand what happens between you, not to find someone to blame. If they decide to join later, talk with your therapist about how to start couples sessions.',
                    'If you feel afraid of your partner, tell us when you get in touch, in whatever way feels safe for you. Joint sessions may not be the right place to start, and a session on your own may be safer.',
                ],
                links: {
                    'individual therapy': '/services/individual-adult-therapy',
                },
            },
            {
                heading: 'Marriage counseling in New Cairo or online',
                paragraphs: [
                    'With online sessions by secure video call, the two of you do not need to be in the same city, or even the same country. Each of you can join from where you are, in Egypt or abroad, which helps when one of you travels for work. If you are together, join from a room where children or family will not overhear.',
                    'In person, you meet your therapist at our center at 3Sixty by LMD in New Cairo. All our therapists work in Arabic and English, so tell us which language feels easier for each of you. We are open every day, 10 am to 10 pm.',
                    'To book, message us on WhatsApp at +20 109 429 2553, send a booking request, or answer the four Find your therapist questions. Your answers open in WhatsApp as the first message.',
                ],
                links: {
                    'online sessions': '/services/online-therapy',
                    'send a booking request': '/book',
                    'Find your therapist questions': '/find-a-therapist',
                },
            },
        ],
        faqs: [
            {
                question: 'Is what we say in couples sessions confidential?',
                answer: 'Yes. What you share in sessions is kept confidential, including from parents, in-laws and other relatives, except where someone may be at risk of harm. Your therapist can explain the limits of confidentiality at the start. That is also the time to ask how they handle something one of you shares privately, so you both know where you stand.',
            },
            {
                question: 'What if we are not sure we want to stay together?',
                answer: 'You can still come. Couples therapy is not only for couples who have already decided to stay. It can give you room to understand what went wrong and what each of you wants before either of you decides. Your therapist will not push you toward staying or leaving. If you do decide to separate, sessions can help you do it with care, especially when children are involved.',
            },
            {
                question: 'Do we need to agree on the problem before we come?',
                answer: 'No. Partners often describe the same problem in very different ways, and those differences are part of what your therapist listens for. Before you start, it can help for each of you to think about what you would like to be different, and what worries you about coming. You can share both with your therapist.',
            },
        ],
    },
    'family-therapy': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'Family therapy in Cairo after a big change',
                paragraphs: [
                    'A family can feel unsettled after a change that shifts everyone\'s place at home. It might be a separation or divorce, the death of someone close, a new baby, a grandparent moving in, or a move back to Cairo after years away.',
                    'People in the same family often adjust at different speeds. After a loss, one person may want to talk every day while another cannot face it yet. Family sessions can help you understand each other\'s pace and agree on how daily life will work now.',
                    'During a separation, sessions can help parents decide together how to talk to the children and how to share parenting across two homes. If you and your partner are still deciding whether to stay together, couples therapy may be the place to start.',
                ],
                links: {
                    'couples therapy': '/services/couples-therapy',
                },
            },
            {
                heading: 'Looking at patterns, not blame',
                paragraphs: [
                    'When home feels tense, it is easy to decide that one person is the problem, like the teenager who shouts back or the parent who is never home. A family therapist looks at the pattern around that person instead. The same argument about homework or curfews tends to follow the same steps each time, and each person\'s part in it makes sense from where they stand.',
                    'The therapist\'s job is not to decide who is right. Each person gets time to speak, including children and anyone who usually stays quiet. Sometimes the person everyone is worried about is reacting to strain the whole family shares.',
                    'Who comes to which session depends on that pattern. Parents might meet first, so children are not in the room for adult talk about a separation or an illness. Siblings who keep clashing might meet together, and a grandparent or stepparent who is part of daily life can join when that helps.',
                ],
                links: {},
            },
            {
                heading: 'Parenting support as your child grows',
                paragraphs: [
                    'Family therapy can also begin with parenting support. One or both parents meet the therapist to talk through what is happening at home. That might be bedtime battles, screen time, a teenager pushing for more freedom, or two parents who handle discipline differently.',
                    'Sessions can focus on setting limits calmly and staying close to a child who seems to be pulling away. If you like to read first, our article on parenting styles and child well-being looks at why the quality of your time together can matter more than the hours.',
                    'If your child or teenager needs space of their own, child and adolescent therapy can run alongside family sessions.',
                ],
                links: {
                    'child and adolescent therapy': '/services/child-adolescent-therapy',
                    'parenting styles and child well-being': '/blog/parenting-styles-child-wellbeing',
                },
            },
            {
                heading: 'When someone in the family is struggling',
                paragraphs: [
                    'If one person is living with depression, anxiety, an eating disorder or substance use, the whole household can feel it. Family members may swing between worry and frustration, or stop talking about it altogether.',
                    'Family sessions can help everyone understand what your loved one is going through and agree on how to respond. They also make room for your own needs, since caring for someone can wear you down over time. If your loved one is an adult, they may see one of our therapists for individual therapy at the same time.',
                    'Our article on supporting a loved one with psychological challenges has practical ideas for listening well and for looking after yourself while you help.',
                ],
                links: {
                    'individual therapy': '/services/individual-adult-therapy',
                    'supporting a loved one with psychological challenges': '/blog/supporting-loved-ones-mental-health',
                },
            },
            {
                heading: 'Family counseling in New Cairo or online',
                paragraphs: [
                    'Not every family lives in one city. A parent may work in the Gulf, or an older child may study abroad. Online sessions let family members in other cities or countries take part, so you can work with a family therapist in Egypt wherever you each live.',
                    'Younger children come to sessions at our center at 3Sixty by LMD in New Cairo, while teenagers can also join online. Every one of our therapists works in Arabic and English, which helps when family members prefer different languages. We are open every day, 10 am to 10 pm.',
                    'To start, message us on WhatsApp at +20 109 429 2553 or send a booking request, and tell us who would like to take part. For help choosing a therapist, answer the four Find your therapist questions, and your answers open in WhatsApp as your first message.',
                ],
                links: {
                    'Online sessions': '/services/online-therapy',
                    'booking request': '/book',
                    'Find your therapist': '/find-a-therapist',
                },
            },
        ],
        faqs: [
            {
                question: 'What happens in the first family session?',
                answer: 'The first session is mostly about getting to know your family. Your therapist will usually ask each person how they see what is happening at home and what they would like to be different. No one has to share more than they are ready to. Toward the end, you can agree together on what to focus on first.',
            },
            {
                question: 'What if someone at home does not want to come?',
                answer: 'You can still begin with the people who are willing. When some family members change how they respond, the pattern at home can shift too, so these sessions can be useful on their own. Your therapist can help you think about how to invite the others without pressure. Some people who hold back at first decide to join later.',
            },
            {
                question: 'Is family therapy confidential?',
                answer: 'Yes. Your therapist keeps what is said in sessions private, except where someone may be at risk of harm. Within the family, it helps to agree on ground rules early, for example about something one person shares in a separate session. Your therapist can explain how they handle this before you begin, so everyone knows what to expect.',
            },
        ],
    },
    'child-adolescent-therapy': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'How a child therapist in Cairo can help',
                paragraphs: [
                    'Young children often show a feeling before they can name it. Worry can turn into stomach aches on school mornings, and frustration can come out as meltdowns over small things.',
                    'A child therapist can help with behavior at home or in class, struggles at school or over homework, and feelings that are hard to calm down. The same goes for worries, low mood, problems with friends, and family changes such as a new baby or a move.',
                    'Children\'s sessions are always face to face, at our center at 3Sixty by LMD. Alongside talking, the therapist may use drawing and games, so your child does not have to find the right words straight away.',
                ],
                links: {},
            },
            {
                heading: 'What therapy for teenagers looks like',
                paragraphs: [
                    'The teenage years bring their own pressures: exams, university plans, fitting in with friends and life on social media. Therapy for teenagers can help with anxiety and low mood, anger or emotions that feel out of control, stress about school and tension at home.',
                    'With teenagers, sessions are usually more of a conversation. The therapist takes your teenager\'s view seriously and works with them on goals they care about, along with practical ways to handle stress and strong feelings.',
                    'Teenagers can come to the center or meet their therapist online by secure video call. For online sessions, a quiet room where they will not be overheard makes it easier to talk openly. If you are deciding between the two, our article on online or face-to-face therapy may help.',
                ],
                links: {
                    'online by secure video call': '/services/online-therapy',
                    'online or face-to-face therapy': '/blog/online-or-face-to-face-therapy',
                },
            },
            {
                heading: 'Where parents and caregivers come in',
                paragraphs: [
                    'You know your child well, so the work often starts with you. The therapist will want to hear what you have noticed, when it began and what you have already tried.',
                    'With younger children, parents tend to be closely involved, and the therapist may suggest small things to try at home between sessions. As children get older, the balance shifts: teenagers usually spend more of the time alone with the therapist, and you stay involved in ways everyone agrees on.',
                    'When the difficulty sits between family members, such as constant arguments at home, family therapy can bring everyone into the conversation. Our article on parenting styles and child well-being looks at why the quality of time together matters more than the amount. If you want support of your own as a parent, individual adult therapy is there too.',
                ],
                links: {
                    'family therapy': '/services/family-therapy',
                    'parenting styles and child well-being': '/blog/parenting-styles-child-wellbeing',
                    'individual adult therapy': '/services/individual-adult-therapy',
                },
            },
            {
                heading: 'Privacy and safety in teen counseling',
                paragraphs: [
                    'Many teenagers find it easier to talk honestly when they know their words will not be passed straight on to their parents. In teen counseling, what your teenager shares in sessions is kept confidential.',
                    'Confidentiality has limits, and safety comes first. If the therapist believes your teenager or someone else may be at risk of harm, they will take steps to keep everyone safe, and that can include telling you.',
                    'It helps to talk this through at the start, with your teenager there, so everyone knows what stays private and when you would be told. You can still let the therapist know about anything that worries you at home.',
                ],
                links: {},
            },
            {
                heading: 'Contacting a child psychologist in New Cairo',
                paragraphs: [
                    'When you get in touch, start with your child\'s age and what you have noticed, in your own words. A short message is enough. For a teenager, it also helps to mention whether they would rather come to the center or meet online, and whether they know you are contacting us.',
                    'You can message us on WhatsApp at +20 109 429 2553 or send a booking request. If you are not sure who to ask for, answer the four Find your therapist questions. Your answers open in WhatsApp as your first message, so we can suggest a therapist who works with your child\'s age group.',
                    'If you would like to know who you might meet, read about our therapists first. We are open every day from 10 am to 10 pm, so you can ask for a time outside school hours.',
                ],
                links: {
                    'send a booking request': '/book',
                    'Find your therapist questions': '/find-a-therapist',
                    'read about our therapists': '/therapists',
                },
            },
        ],
        faqs: [
            {
                question: 'How do I explain therapy to my child?',
                answer: 'Keep it short and honest. You might tell a younger child that they are going to meet someone whose job is to help children with worries and big feelings. With a teenager, explain why you are suggesting it and give them a say in practical choices, such as when to meet or which language to use. Try not to present therapy as a punishment or a sign that something is wrong with them.',
            },
            {
                question: 'Can my child have sessions in English or Arabic?',
                answer: 'Yes. Every one of our therapists works in both Arabic and English, so your child can use whichever language feels easier. If your child mixes the two, that is fine as well. Let us know their preference when you get in touch. The same choice applies to your own conversations with the therapist.',
            },
            {
                question: 'Can my teenager keep having sessions while we are away?',
                answer: 'Yes. Teenagers can attend online by secure video call from anywhere in Egypt or abroad, so sessions can carry on over a summer on the North Coast or a term away from home. Younger children are seen only at our center in New Cairo, so their sessions are planned around your time in Cairo. Mention any trips ahead of time so you can plan with the therapist.',
            },
        ],
    },
    'cbt-behavioral-therapy': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'How CBT works in practice',
                paragraphs: [
                    'CBT sees a problem as a cycle: thoughts, feelings and behavior feed each other. Take the thought “If this is not perfect, I have failed.” The pressure keeps you up late redoing your work. The next day you are tired, mistakes slip in, and the thought feels truer. Change can start with the thought or with what you do.',
                    'Early on, you and your therapist map out what keeps the problem going, and a psychological assessment can sometimes make that clearer. Then you set concrete goals, such as speaking up in meetings or going to family gatherings without dread.',
                    'Much of the work happens between sessions. You might write down a worrying thought with the facts for and against it, or test a fear with a small experiment. The same skills can help with a harsh inner critic: you practice catching that voice and answering it more fairly.',
                ],
                links: {
                    'psychological assessment': '/services/psychological-assessments',
                    'harsh inner critic': '/blog/challenging-your-inner-critic',
                },
            },
            {
                heading: 'DBT skills for strong emotions',
                paragraphs: [
                    'Dialectical behavior therapy (DBT) grew out of CBT. It was first developed for people whose emotions hit hard and take a long time to settle. Its core idea is balance: accepting yourself and what you feel right now, while working to change patterns that hurt you or your relationships. That mix of acceptance and change is the “dialectical” part.',
                    'DBT teaches skills in four areas. Mindfulness is noticing what is happening inside and around you without judging it. Distress tolerance is for getting through a painful moment without making it worse. Emotion regulation is about understanding your emotions and changing the ones you do not want to keep. Interpersonal effectiveness is asking for what you need, and saying no, while keeping the relationship and your self-respect.',
                    'Several therapists on our team have trained in DBT. If you are looking for DBT in Egypt, mention it when you message us on WhatsApp so we can suggest one of them.',
                ],
                links: {
                    Mindfulness: '/blog/power-of-mindfulness',
                    'therapists on our team': '/therapists',
                },
            },
            {
                heading: 'Inside a CBT or DBT session',
                paragraphs: [
                    'A session often opens with a short check-in on how things have gone, including any practice you tried. Then you agree on what to focus on.',
                    'In the main part, you might slow down a recent hard moment and separate the thought, the feeling, the body sensation and what you did next. From there, you might look for other ways to read it, or rehearse a conversation you have been putting off.',
                    'In DBT, you may also keep a simple daily record of emotions and urges, and trace a difficult moment link by link to see where a skill could help. Sessions tend to end with a short summary and something to practice. You can always say what is not helping.',
                ],
                links: {},
            },
            {
                heading: 'CBT for anxiety, low mood and more',
                paragraphs: [
                    'With anxiety, CBT looks closely at avoidance. Staying away from what scares you brings relief but keeps the fear alive, so therapy can help you face it in small, planned steps. With panic, learning how the body\'s alarm response works can make a racing heart less frightening. Our guide to strategies for dealing with anxiety has ideas to try on your own.',
                    'In depression, it becomes easy to withdraw. CBT may start by planning a few manageable activities, because for many people motivation comes after action, not before. For OCD, the work involves gradually facing what sets off the urge to check, wash or seek reassurance, while practicing not doing the ritual.',
                    'DBT skills are often used when emotions feel hard to manage, and for personality difficulties, where long-standing patterns in relationships and self-image keep causing distress. For eating and body image difficulties, CBT-E, a form of CBT developed for eating disorders, works on regular eating and on worries about shape and weight.',
                ],
                links: {
                    'strategies for dealing with anxiety': '/blog/10-strategies-to-deal-with-anxiety',
                },
            },
            {
                heading: 'Finding a CBT therapist in Cairo',
                paragraphs: [
                    'Several of our therapists have trained in CBT. Between them, their training covers CBT for anxiety, depression, trauma and personality disorders, and CBT-E for eating disorders. You can read each therapist\'s background on their profile.',
                    'For cognitive behavioral therapy in New Cairo, our center at 3Sixty by LMD is open every day from 10 am to 10 pm. Online sessions work from anywhere in Egypt or abroad, with the same therapists.',
                    'To start, message us on WhatsApp at +20 109 429 2553, send a booking request, or answer the four Find your therapist questions. Your answers open in WhatsApp as your first message to us.',
                ],
                links: {
                    'Online sessions': '/services/online-therapy',
                    'booking request': '/book',
                    'Find your therapist questions': '/find-a-therapist',
                },
            },
        ],
        faqs: [
            {
                question: 'Do I need a diagnosis before starting CBT or DBT?',
                answer: 'No. You can get in touch and describe what has been hard lately in your own words. You also do not need to choose between CBT and DBT before you start. Once your therapist understands what is going on, they will talk the options through with you, and may suggest a different approach if it suits you better.',
            },
            {
                question: 'Can I have CBT or DBT sessions in Arabic?',
                answer: 'Yes. Every therapist at The Sonder Hood works in Arabic and English, so you can have your sessions in whichever language feels easier. Some people move between the two in the same session, and that is fine. The same applies online, if you live abroad and would rather speak Arabic.',
            },
            {
                question: 'Does CBT deal with the past, or only the present?',
                answer: 'CBT works mainly with the present, because that is where you can practice doing things differently. The past still has a place: your therapist may look at how earlier experiences shaped the beliefs you hold about yourself and other people. If you would like to explore your history in more depth, some of our therapists also have training in psychodynamic or trauma-informed therapy. You can ask about this when you get in touch.',
            },
        ],
    },
    'psychological-assessments': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'When a psychological assessment can help',
                paragraphs: [
                    'A psychological assessment is a structured way of understanding what you are going through. It brings together a careful conversation and standardized tools, so the picture does not rest on first impressions alone.',
                    'Many people ask for one when something has been hard for a while and they cannot quite name it. Common reasons include low mood that does not lift, worry that keeps growing, trouble concentrating, or the same problems coming back in relationships.',
                    'An assessment can also help before therapy begins, so you and your therapist agree on where to start. If you are already in therapy, it can help when progress feels slow or a new question comes up.',
                ],
                links: {
                    'progress feels slow': '/blog/therapy-takes-time',
                },
            },
            {
                heading: 'Personality assessment and other types we offer',
                paragraphs: [
                    'A personality assessment looks at your lasting patterns: how you relate to others, how you react under stress and how you see yourself. It is not a verdict on who you are. It can show your strengths as well as the patterns that keep getting in your way.',
                    'Cognitive assessments focus on thinking skills such as attention and memory. Mood and anxiety assessments explore sadness, worry and panic, and how much they get in the way of daily life. Trauma and PTSD assessments consider how a frightening or painful event may still affect you today.',
                    'Relationship assessments map how you communicate and handle conflict with a partner or family, and can be a first step toward couples therapy or family therapy. Risk assessments look carefully at any chance of harm to yourself or others, so you and your psychologist can plan for safety together. You do not have to know which type is right for you. Your psychologist will suggest what fits the questions you bring.',
                ],
                links: {
                    'couples therapy': '/services/couples-therapy',
                    'family therapy': '/services/family-therapy',
                },
            },
            {
                heading: 'How psychological testing in New Cairo works',
                paragraphs: [
                    'An assessment usually has three parts. It starts with a conversation about your history, what is troubling you now and what you hope to understand. Your psychologist may ask about sleep, health, family and work, because each can shape how you feel.',
                    'Next, you complete standardized questionnaires or tests. Standardized means everyone gets the same questions in the same way, so your results can be compared with those of many other people. On questionnaires about mood or personality there are no right or wrong answers, and honest answers give a clearer picture. None of it is an exam you pass or fail.',
                    'Last comes a feedback conversation. Your psychologist talks you through the findings in plain language and shares recommendations. You can ask questions at every step.',
                ],
                links: {},
            },
            {
                heading: 'From findings to a therapy plan',
                paragraphs: [
                    'The findings are a starting point, not a final word. They describe how things are for you at the moment. Later in therapy, some questionnaires can be repeated to see what has changed.',
                    'For some people the next step is individual therapy. For others it may be CBT or DBT to work on specific patterns, or sessions with a partner or family.',
                    'You decide what happens next, and there is no pressure to continue with us.',
                ],
                links: {
                    'individual therapy': '/services/individual-adult-therapy',
                    'CBT or DBT': '/services/cbt-behavioral-therapy',
                },
            },
            {
                heading: 'Booking a psychological assessment in Cairo',
                paragraphs: [
                    'Our center is at 3Sixty by LMD in New Cairo and is open every day, 10 am to 10 pm. You can talk with your psychologist in Arabic or English. Your results stay confidential, like everything you share in therapy, except where someone may be at risk of harm.',
                    'To book, message us on WhatsApp at +20 109 429 2553 or send a booking request. If you are unsure an assessment is the right first step, answer the four Find your therapist questions. Your answers open in WhatsApp as your first message, and we can talk it through from there.',
                ],
                links: {
                    'booking request': '/book',
                    'Find your therapist questions': '/find-a-therapist',
                },
            },
        ],
        faqs: [
            {
                question: 'Will an assessment give me a diagnosis?',
                answer: 'Not necessarily. If the findings match a recognized condition, your psychologist will explain what that means for you. If they do not, they can still show patterns and strengths that help you make sense of what has been happening. Either way, you come away with recommendations for what could help next.',
            },
            {
                question: 'Is a psychological assessment the same as a psychiatric assessment?',
                answer: 'No. A psychiatric assessment is carried out by a psychiatrist, a medical doctor who can prescribe medication. A psychological assessment is carried out by a psychologist, using conversation and standardized questionnaires or tests to understand your difficulties and your strengths. Everyone on our team is a psychologist or psychotherapist, so we do not prescribe. If you also see a psychiatrist, you can choose whether to share your findings with them.',
            },
            {
                question: 'How can I prepare for my assessment?',
                answer: 'You do not need to study or rehearse anything. It helps to think about what you would like to understand, and when things started to feel hard. Bring any reports from earlier assessments or treatment, and your reading glasses if you use them. Try to arrive well rested, and tell your psychologist about any treatment you are having now.',
            },
        ],
    },
    'online-therapy': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'Online therapy in Egypt and abroad',
                paragraphs: [
                    'Online sessions often suit people with long working days, and parents who cannot easily leave young children at home. Seeing an online psychologist from home can also make the first step easier if going out feels hard right now.',
                    'You can work with our team from Alexandria, Aswan or any other governorate, without coming to New Cairo. For Egyptians living abroad, it can feel easier to talk about family and home with a therapist in Egypt. And if you move abroad for work or study, your sessions can move with you.',
                    'Couples who spend time apart, for example when one partner works in another city or country, can still attend couples therapy together online.',
                ],
                links: {
                    'couples therapy': '/services/couples-therapy',
                },
            },
            {
                heading: 'An online therapist in Arabic, English or French',
                paragraphs: [
                    'Every therapist on our team works in Arabic and English, so you do not need to settle on one language before you start. Many people in Egypt move between the two when they talk, and you can do the same in your sessions.',
                    'If you would rather not use Arabic at all, you can have therapy online in English or French. French sessions are with Inji Farid, who works with adults. Mention the language you prefer when you book, or read about our therapists first if you would like to choose someone yourself.',
                ],
                links: {
                    'our therapists': '/therapists',
                    'Inji Farid': '/therapists/inji-farid',
                },
            },
            {
                heading: 'Teenagers online, children at the center',
                paragraphs: [
                    'Teenagers can have sessions online as well as at the center. This can help when school and exams fill the week, or when your family lives outside Cairo.',
                    'A teenager may find it hard to talk openly if they think someone at home can hear. Agree as a family that the session time is theirs, and that no one walks in or listens at the door. Parents are involved whenever that helps, and you can ask the therapist how this will work for your family.',
                    'Sessions for children are held at our center in New Cairo only. You can read more on our child and adolescent therapy page.',
                ],
                links: {
                    'our center in New Cairo': '/therapy-in-new-cairo',
                    'child and adolescent therapy': '/services/child-adolescent-therapy',
                },
            },
            {
                heading: 'Getting ready for a video session',
                paragraphs: [
                    'Start with the room. Choose somewhere quiet where you can close the door and talk without being overheard. A cafe or a shared office can make it hard to say what you really think, even when no one seems to be listening.',
                    'If you share your home, let the people you live with know you need the room for a while. Turn off notifications, and keep some water and tissues nearby. If someone walks in, you can pause and carry on once you are alone again.',
                    'Try to leave a little time before and after the session. A quiet moment beforehand can help you settle. A pause afterwards gives you room to take in what came up before you go back to work or family.',
                ],
                links: {},
            },
            {
                heading: 'Switching between online and face to face',
                paragraphs: [
                    'You do not have to choose once and for all. You can start online and come to the center later, or move online for a while when you travel or have a busy month. If you live abroad, you can meet face to face when you visit Cairo. Because the same team works online and at the center, switching does not have to mean starting again with someone new.',
                    'If you are still deciding, our article on online or face-to-face therapy looks at when each one may suit you.',
                    'When you are ready, message us on WhatsApp at +20 109 429 2553 and tell us you would like to meet online, or send a booking request. If you are not sure which therapist to choose, answer the four Find your therapist questions. Your answers open in WhatsApp as your first message.',
                ],
                links: {
                    'online or face-to-face therapy': '/blog/online-or-face-to-face-therapy',
                    'send a booking request': '/book',
                    'Find your therapist questions': '/find-a-therapist',
                },
            },
        ],
        faqs: [
            {
                question: 'What time are online sessions if I live abroad?',
                answer: 'We are open every day from 10 am to 10 pm, Cairo time. If you live in another time zone, work out what those hours are where you are before you suggest a time. Tell us which country you are in when you message us, so the time you agree on is clear on both sides.',
            },
            {
                question: 'What if I feel awkward talking on camera?',
                answer: 'That is a common feeling, especially at the start. You can tell your therapist, and together you can look for what helps, such as sitting a little further back from the screen. Many people find it feels more natural with time. If it still feels hard, sessions at our center in New Cairo are another option.',
            },
            {
                question: 'What happens in a first online session?',
                answer: 'Your therapist will usually start by asking what brings you to therapy and a little about your life. You can ask how they work and what to expect from the sessions ahead. Together you can think about what you would like to change. You share only what you feel ready to share, at your own pace.',
            },
        ],
    },
    'group-therapy': {
        updated: '2026-10-30',
        sections: [
            {
                heading: 'What group therapy in Cairo can help with',
                paragraphs: [
                    'A grief support group is for people living with a loss, such as the death of someone close. Grief does not keep to a timetable. The people around you may expect you to be back to normal long before you feel ready. In the group, you can talk about what you have lost, and about the guilt or anger grief can bring, without anyone hurrying you along.',
                    'A codependency group could help if you tend to put other people first until little is left for yourself. You may find it hard to say no, or feel responsible for everyone else\'s mood. These patterns can start in childhood, as our article on breaking free from codependency explains. In a group, you can practice noticing your own needs and saying them out loud.',
                    'A group for anxiety lets you talk about worry with people who feel it too. Together, you can try ways of calming anxious thoughts. A group on family issues can help when conflict at home, or the way you were raised, still weighs on you. If your whole family wants to work on things together, family therapy may be a better fit.',
                ],
                links: {
                    'our article on breaking free from codependency': '/blog/breaking-free-from-codependency',
                    'ways of calming anxious thoughts': '/blog/10-strategies-to-deal-with-anxiety',
                    'family therapy': '/services/family-therapy',
                },
            },
            {
                heading: 'How a group differs from talking to friends',
                paragraphs: [
                    'Friends and family can be a real comfort, but they are part of your story. They may take sides or rush to fix things, and you may hold back to protect them.',
                    'A therapy group sits apart from your everyday life, so many people find it easier to speak freely there. A trained therapist guides the conversation and makes sure everyone has room to be heard. With time, the group can show you how you relate to others, such as what you do when someone disagrees with you. It is also somewhere to try a different response.',
                    'Groups at The Sonder Hood are led by Ingie El Saady, a clinical psychologist whose work includes anxiety, self-esteem, relationships and family problems.',
                ],
                links: {
                    'Ingie El Saady': '/therapists/ingie-el-saady',
                },
            },
            {
                heading: 'Learning from people who have been there',
                paragraphs: [
                    'Hearing someone put words to a feeling you thought was yours alone can be a relief. Many people find that shame starts to ease when they talk about what they carry with others who understand.',
                    'You also learn from what others have tried. Members share what has helped them and what has not, and you can take what fits your own life. Seeing your situation through someone else\'s eyes can show you a side of it you had missed.',
                    'In a group, you give as well as receive. Offering support to another member can remind you of strengths you had forgotten. Watching others make changes can give you hope for your own.',
                ],
                links: {},
            },
            {
                heading: 'Confidentiality and other ground rules',
                paragraphs: [
                    'Therapy groups usually begin by agreeing on a few ground rules. The central one is confidentiality between members. In most groups, members agree not to repeat anyone\'s name or story outside the group, even to their own family.',
                    'The therapist keeps what you share confidential, except where someone may be at risk of harm. Between members, confidentiality is a promise people make to each other, not a professional rule, so it relies on each member to honor it. Keeping it helps everyone speak honestly.',
                    'Many groups also agree that members listen without interrupting and speak from their own experience instead of judging others. If you have questions about how a group works, ask us when you get in touch.',
                ],
                links: {
                    'get in touch': '/contact',
                },
            },
            {
                heading: 'Joining a support group in New Cairo',
                paragraphs: [
                    'The first step is to message us on WhatsApp at +20 109 429 2553 and tell us which group interests you. Let us know too if you would rather come to the center at 3Sixty by LMD or join online. You do not need to explain everything at this stage. We are open every day, 10 am to 10 pm.',
                    'Group therapy can also sit alongside one-to-one sessions. Some people start with individual therapy and join a group later, and others do both at once. To find a therapist for individual sessions, answer the four Find your therapist questions. Your answers open in WhatsApp as your first message.',
                ],
                links: {
                    'join online': '/services/online-therapy',
                    'individual therapy': '/services/individual-adult-therapy',
                    'Find your therapist questions': '/find-a-therapist',
                },
            },
        ],
        faqs: [
            {
                question: 'How do I know if a group is right for me?',
                answer: 'A group can suit you if you want to feel less alone with something and are curious about how others cope. If you would rather go deep into your own story, or speaking in front of others feels like too much right now, individual therapy may be an easier place to start. You can also ask us on WhatsApp, and we will help you think it through.',
            },
            {
                question: 'If I join a group online, how do I keep it private?',
                answer: 'Online sessions take place by secure video call. Join from a room where no one can walk in or overhear, and use headphones, so the people around you do not hear what other members share. Do not record the session or take screenshots, since the other members have not agreed to that. That way, you keep their words as private as you would want yours kept.',
            },
            {
                question: 'Are the groups held in Arabic or English?',
                answer: 'Ingie El Saady, who leads our groups, works in both Arabic and English, as does every therapist at The Sonder Hood. When you message us about an upcoming group, ask which language it will be held in. Tell us, too, which language feels easier for you when you talk about personal things.',
            },
        ],
    },
}

export const NEW_CAIRO = {
    path: '/therapy-in-new-cairo',
    updated: '2026-10-30',
    metaTitle: 'Therapist in New Cairo, Fifth Settlement | The Sonder Hood',
    metaDescription: 'See a therapist in New Cairo at 3Sixty by LMD in the Fifth Settlement. Psychologists for adults, couples, families and children. Open daily, 10 am to 10 pm.',
    h1: 'Therapy in New Cairo at 3Sixty by LMD',
    intro: [
        'The Sonder Hood is a psychotherapy practice at 3Sixty by LMD in the Fifth Settlement. If you want a therapist in New Cairo for yourself, your relationship, your family or your child, you can see one of our psychologists or psychotherapists here, in Arabic or English.',
        'We are open every day. On days you cannot come in, adults and teenagers can also see the same team online, by secure video call.',
    ],
    sections: [
        {
            heading: 'Finding our therapy center in New Cairo',
            paragraphs: [
                'Our center is at 3Sixty by LMD, on the Sheikh Mohamed Bin Zayed North Axis in the Golden Square area of the Fifth Settlement, New Cairo. Open 3Sixty by LMD in Google Maps to see exactly where we are.',
                'It is a convenient choice if you live or work in and around New Cairo, for example in Mivida, Rehab, Madinaty or Mostakbal City.',
            ],
            links: {},
        },
        {
            heading: 'Therapy for adults, couples and groups',
            paragraphs: [
                'If you are looking for counseling in New Cairo for yourself, individual therapy for adults gives you one-to-one time with a therapist. You might want help with anxiety, low mood, stress, grief, self-esteem or a relationship that keeps going wrong. It can also be something you cannot quite name yet. Many people start therapy without a diagnosis.',
                'Couples therapy is for two partners who want to work on how they talk, argue, trust each other or stay close. You usually come to sessions together, with a therapist who can help you both say what is hard to say at home.',
                'Group therapy brings together people working through similar things, such as grief and loss, anxiety or codependency. Our groups are led by Ingie El Saady, a clinical psychologist. Ask us on WhatsApp about upcoming groups.',
            ],
            links: {
                'individual therapy for adults': '/services/individual-adult-therapy',
                'Couples therapy': '/services/couples-therapy',
                'Group therapy': '/services/group-therapy',
            },
        },
        {
            heading: 'Children, teenagers and families',
            paragraphs: [
                'Sessions for children take place here at the center, not online. Teenagers can come in too, or attend online if that works better for them.',
                'Our therapy for children and teenagers uses ways of working that suit the child\'s age, and parents are involved where that is useful. It can help with behavior, school pressure, strong emotions or tension at home.',
                'Family therapy can bring parents, children or other relatives into the same session to work on communication, conflict, separation or grief. If you are a parent thinking about how your own approach affects your child, our article on parenting styles may be a useful first read.',
            ],
            links: {
                'therapy for children and teenagers': '/services/child-adolescent-therapy',
                'Family therapy': '/services/family-therapy',
                'parenting styles': '/blog/parenting-styles-child-wellbeing',
            },
        },
        {
            heading: 'Your psychologist in the Fifth Settlement',
            paragraphs: [
                'Your sessions are with one of our psychologists or psychotherapists. They are not medical doctors or psychiatrists, and they do not prescribe medication. What they offer is talk therapy: time with someone trained to help you understand what is going on and find new ways to cope.',
                'You can come in for CBT and DBT, and between them the team is also trained in psychodynamic therapy and trauma-informed therapy. Our psychologists carry out psychological assessments too, which can give you and your therapist a clearer picture before you plan your work together.',
                'Every therapist works in Arabic and English, so you can talk in whichever language feels more natural. If you would like sessions in French, Inji Farid offers them to adults.',
            ],
            links: {
                'CBT and DBT': '/services/cbt-behavioral-therapy',
                'psychological assessments': '/services/psychological-assessments',
                'Inji Farid': '/therapists/inji-farid',
            },
        },
        {
            heading: 'Opening hours and how to book',
            paragraphs: [
                'The center is open every day of the week, from 10 am to 10 pm. Evening hours can make it easier to fit a session around work, university or school.',
                'To book, message us on WhatsApp at +20 109 429 2553 or fill in our booking request form. Tell us if you would like to come in or meet online. You can also read about our therapists first and ask for someone by name.',
                'If you are not sure who to ask for, answer the four Find your therapist questions. Your answers open in WhatsApp as your first message to us, so you do not have to start from a blank screen.',
            ],
            links: {
                'booking request': '/book',
                'our therapists': '/therapists',
                'Find your therapist questions': '/find-a-therapist',
            },
        },
        {
            heading: 'Online sessions when you cannot make it',
            paragraphs: [
                'Some days it is hard to get to the center, perhaps because you are unwell or away from Cairo. On those days you can ask to have your session online by secure video call, from anywhere in Egypt or abroad. You will need a private place to talk and a steady internet connection.',
                'Online therapy is with the same team you would see in person, and couples and families can have sessions online too. Sessions for children stay at the center. What you share stays confidential online just as it does at the center, except where someone may be at risk of harm.',
                'If you are deciding between the two, our article on online or face-to-face therapy may help.',
            ],
            links: {
                'Online therapy': '/services/online-therapy',
                'online or face-to-face therapy': '/blog/online-or-face-to-face-therapy',
            },
        },
    ],
    faqs: [
        {
            question: 'Where exactly is the center?',
            answer: 'We are at 3Sixty by LMD on the Sheikh Mohamed Bin Zayed North Axis in New Cairo. In Google Maps you can search for 3Sixty by LMD or for the plus code 2HH2+3C New Cairo. If you need help finding us, message us on WhatsApp at +20 109 429 2553.',
        },
        {
            question: 'Is the center in the Fifth Settlement?',
            answer: 'Yes. 3Sixty by LMD is in the Golden Square area of the Fifth Settlement, which many people call El Tagamo3 El Khames, or just Tagamo3. So if you have been searching for therapy in Tagamo3, this is where we see clients face to face.',
        },
        {
            question: 'Do you see children at the center?',
            answer: 'Yes. Sessions for children are held at our center in New Cairo, and not online. Teenagers can come to the center or attend online. To book, message us on WhatsApp at +20 109 429 2553 with your child\'s age and a few words about what you have noticed.',
        },
        {
            question: 'Can my partner and I come in together?',
            answer: 'Yes. Couples therapy is for both of you, so you usually attend sessions together, at the center or online by secure video call. You can choose Arabic or English, whichever suits you both. When you get in touch, mention that you are booking as a couple.',
        },
        {
            question: 'Can I have sessions in French?',
            answer: 'Yes. Sessions in French are with Inji Farid, a clinical psychologist on our team who works with adults. You can see her at the center in New Cairo or online by secure video call. When you get in touch, just mention that you would like French.',
        },
        {
            question: 'Are you open on Fridays and Saturdays?',
            answer: 'Yes. The center is open every day of the week, Fridays and Saturdays included, from 10 am to 10 pm. If your weekdays are full, a weekend session may be easier to fit in. Tell us which days and times suit you when you message us.',
        },
    ],
}
