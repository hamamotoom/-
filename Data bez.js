// Data bez.js - ملف البيانات التجريبية لكل صف دراسي
// يحتوي على بيانات دروس وامتحانات خاصة بكل صف دراسي.

export const UNIT_NAMES = {
    1: "الوحدة الأولى: أساسيات اللغة",
    2: "الوحدة الثانية: المحادثة اليومية",
    3: "الوحدة الثالثة: القواعد الأساسية"
};

export const GRADE_LESSONS_DATA = {
    '4': {
        1: [
            {
                id: 1,
                title: "مقدمة في اللغة الإنجليزية - الصف الرابع",
                videoUrl: "https://www.youtube.com/embed/CHr7dkZF5y0",
                questions: [
                    { text: "ما هو الحرف الأول في كلمة 'Apple'?", options: ["A", "B", "C"], correct: 0, category: "الحروف" },
                    { text: "ما معنى كلمة 'Hello'?", options: ["وداعاً", "مرحبا", "شكراً"], correct: 1, category: "المفردات" }
                ],
                status: "current"
            },
            {
                id: 2,
                title: "الأرقام والألوان - الصف الرابع",
                videoUrl: "https://www.youtube.com/embed/CBDFlsffIqg",
                questions: [
                    { text: "ما هو الرقم بعد ثلاثة؟", options: ["3", "4", "5"], correct: 1, category: "الأرقام" },
                    { text: "ما لون السماء؟", options: ["أحمر", "أصفر", "أزرق"], correct: 2, category: "المفردات" }
                ],
                status: "locked"
            },
            {
                id: 3,
                title: "حيوانات وأشياء - الصف الرابع",
                videoUrl: "https://www.youtube.com/embed/U-1r5v6gBZ4",
                questions: [
                    { text: "ما هي الكلمة الإنجليزية لـ 'قطة'?", options: ["Cat", "Dog", "Bird"], correct: 0, category: "المفردات" },
                    { text: "ما لون التفاحة؟", options: ["أحمر", "أخضر", "أزرق"], correct: 0, category: "المفردات" }
                ],
                status: "locked"
            }
        ],
        2: [
            {
                id: 1,
                title: "محادثات بسيطة - الصف الرابع",
                videoUrl: "https://www.youtube.com/embed/W01N_5S8vU8",
                questions: [
                    { text: "كيف تقول 'كيف حالك؟' بالإنجليزية؟", options: ["How old are you?", "How are you?", "Where are you?"], correct: 1, category: "المحادثة" },
                    { text: "ما هي الإجابة الصحيحة على 'Thank you'?", options: ["You're welcome", "No problem", "Goodbye"], correct: 0, category: "المحادثة" }
                ],
                status: "locked"
            },
            {
                id: 2,
                title: "التعابير اليومية - الصف الرابع",
                videoUrl: "https://www.youtube.com/embed/LnN8HsF_R5E",
                questions: [
                    { text: "ما معنى 'Good morning'?", options: ["صباح الخير", "مساء الخير", "ليلة سعيدة"], correct: 0, category: "المفردات" },
                    { text: "ما معنى 'Bye'?", options: ["مرحبا", "وداعاً", "شكرا"], correct: 1, category: "المحادثة" }
                ],
                status: "locked"
            }
        ],
        3: [
            {
                id: 1,
                title: "أفعال بسيطة - الصف الرابع",
                videoUrl: "https://www.youtube.com/embed/Obi-gLJ45YY",
                questions: [
                    { text: "ما هو الفعل الصحيح في 'I ___ a book'?", options: ["read", "reads", "reading"], correct: 0, category: "قواعد" },
                    { text: "ما هو المضارع الصحيح لـ 'He ___ to school'?", options: ["go", "goes", "going"], correct: 1, category: "قواعد" }
                ],
                status: "locked"
            }
        ]
    },
    '5': {
        1: [
            {
                id: 1,
                title: "التحية والتعارف - الصف الخامس",
                videoUrl: "https://www.youtube.com/embed/CHr7dkZF5y0",
                questions: [
                    { text: "كيف تقول 'اسمي ...'؟", options: ["I am ...", "You are ...", "He is ..."], correct: 0, category: "المحادثة" },
                    { text: "ما معنى 'Nice to meet you'?", options: ["سعيد بلقائك", "أين تسكن؟", "ماذا تفعل؟"], correct: 0, category: "المحادثة" }
                ],
                status: "current"
            },
            {
                id: 2,
                title: "الأحرف والأصوات - الصف الخامس",
                videoUrl: "https://www.youtube.com/embed/CBDFlsffIqg",
                questions: [
                    { text: "أي الحروف يُسمى حرف متحرك؟", options: ["B", "A", "C"], correct: 1, category: "الحروف" },
                    { text: "ما معنى 'Blue'?", options: ["أخضر", "أزرق", "أحمر"], correct: 1, category: "المفردات" }
                ],
                status: "locked"
            }
        ],
        2: [
            {
                id: 1,
                title: "طلب الطعام - الصف الخامس",
                videoUrl: "https://www.youtube.com/embed/W01N_5S8vU8",
                questions: [
                    { text: "كيف تقول 'أريد طعاماً'؟", options: ["I want food", "I need water", "I like school"], correct: 0, category: "المحادثة" },
                    { text: "ما معنى 'Please'?", options: ["من فضلك", "شكراً", "عفوا"], correct: 0, category: "المحادثة" }
                ],
                status: "locked"
            }
        ],
        3: [
            {
                id: 1,
                title: "الأزمنة البسيطة - الصف الخامس",
                videoUrl: "https://www.youtube.com/embed/Obi-gLJ45YY",
                questions: [
                    { text: "كيف تقول 'أدرس' بالإنجليزية؟", options: ["I study", "I studies", "I studying"], correct: 0, category: "قواعد" },
                    { text: "ما صيغة الماضي لـ 'play'?", options: ["played", "plays", "play"], correct: 0, category: "قواعد" }
                ],
                status: "locked"
            }
        ]
    },
    '6': {
        1: [
            {
                id: 1,
                title: "التعارف والمحادثات - الصف السادس",
                videoUrl: "https://www.youtube.com/embed/CHr7dkZF5y0",
                questions: [
                    { text: "ما هو الرد على 'What is your name'?", options: ["My name is ...", "Thank you", "Goodbye"], correct: 0, category: "المحادثة" },
                    { text: "أي جملة صحيحة؟", options: ["I am fine", "I are fine", "I is fine"], correct: 0, category: "قواعد" }
                ],
                status: "current"
            }
        ],
        2: [
            {
                id: 1,
                title: "كيف تسأل عن السعر - الصف السادس",
                videoUrl: "https://www.youtube.com/embed/LnN8HsF_R5E",
                questions: [
                    { text: "ما معنى 'How much is it'?", options: ["كم سعره؟", "أين هو؟", "ماذا تريد؟"], correct: 0, category: "المفردات" },
                    { text: "ما معنى 'Cheap'?", options: ["رخيص", "غالي", "كبير"], correct: 0, category: "المفردات" }
                ],
                status: "locked"
            }
        ],
        3: [
            {
                id: 1,
                title: "قواعد بسيطة - الصف السادس",
                videoUrl: "https://www.youtube.com/embed/Obi-gLJ45YY",
                questions: [
                    { text: "اختر الفاعل الصحيح في 'She ___ a book'.", options: ["reads", "read", "reading"], correct: 0, category: "قواعد" },
                    { text: "اختر السؤال الصحيح", options: ["Where are you?", "Where you are?", "Are you where?"], correct: 0, category: "قواعد" }
                ],
                status: "locked"
            }
        ]
    },
    '7': {
        1: [
            {
                id: 1,
                title: "التحيات الرسمية - الصف السابع",
                videoUrl: "https://www.youtube.com/embed/CHr7dkZF5y0",
                questions: [
                    { text: "ما معنى 'Good afternoon'?", options: ["مساء الخير", "صباح الخير", "مساء النور"], correct: 0, category: "المفردات" },
                    { text: "كيف تجيب على 'How are you?'", options: ["I am fine", "I am small", "I am here"], correct: 0, category: "المحادثة" }
                ],
                status: "current"
            }
        ],
        2: [
            {
                id: 1,
                title: "الطعام في المطعم - الصف السابع",
                videoUrl: "https://www.youtube.com/embed/W01N_5S8vU8",
                questions: [
                    { text: "كيف تقول 'I would like a sandwich'?", options: ["أريد ساندويتش", "أريد ماء", "أريد كتاب"], correct: 0, category: "المحادثة" },
                    { text: "ما هي الكلمة الصحيحة لـ 'طبق'?", options: ["plate", "plant", "place"], correct: 0, category: "المفردات" }
                ],
                status: "locked"
            }
        ],
        3: [
            {
                id: 1,
                title: "الزمن الماضي - الصف السابع",
                videoUrl: "https://www.youtube.com/embed/Obi-gLJ45YY",
                questions: [
                    { text: "ما هو الماضي الصحيح لـ 'go'?", options: ["went", "goed", "going"], correct: 0, category: "قواعد" },
                    { text: "ما هو الماضي الصحيح لـ 'play'?", options: ["played", "plays", "play"], correct: 0, category: "قواعد" }
                ],
                status: "locked"
            }
        ]
    },
    '8': {
        1: [
            {
                id: 1,
                title: "الطقس والمواسم - الصف الثامن",
                videoUrl: "https://www.youtube.com/embed/CHr7dkZF5y0",
                questions: [
                    { text: "ما معنى 'Sunny'?", options: ["مشمس", "ممطر", "عاصف"], correct: 0, category: "المفردات" },
                    { text: "كيف تقول 'It is cold'?", options: ["إنه بارد", "إنه حار", "إنه جميل"], correct: 0, category: "قواعد" }
                ],
                status: "current"
            }
        ],
        2: [
            {
                id: 1,
                title: "السفر والاتجاهات - الصف الثامن",
                videoUrl: "https://www.youtube.com/embed/LnN8HsF_R5E",
                questions: [
                    { text: "ما معنى 'Where is the station'?", options: ["أين المحطة؟", "أين المدرسة؟", "أين المستشفى؟"], correct: 0, category: "المحادثة" },
                    { text: "ما معنى 'Turn left'?", options: ["إلى اليسار", "إلى اليمين", "مباشرة"], correct: 0, category: "المحادثة" }
                ],
                status: "locked"
            }
        ],
        3: [
            {
                id: 1,
                title: "الأزمنة والماضي البسيط - الصف الثامن",
                videoUrl: "https://www.youtube.com/embed/Obi-gLJ45YY",
                questions: [
                    { text: "ما معنى 'I was at school'?", options: ["كنت في المدرسة", "أكون في المدرسة", "سأكون في المدرسة"], correct: 0, category: "قواعد" },
                    { text: "اختر الفعل الصحيح: 'She ___ happy'.", options: ["is", "are", "am"], correct: 0, category: "قواعد" }
                ],
                status: "locked"
            }
        ]
    },
    '9': {
        1: [
            {
                id: 1,
                title: "التحدث عن العائلة - الصف التاسع",
                videoUrl: "https://www.youtube.com/embed/CHr7dkZF5y0",
                questions: [
                    { text: "كيف تسأل عن الأخت؟", options: ["Where is my sister?", "Who is my sister?", "What is my sister?"], correct: 0, category: "المحادثة" },
                    { text: "ما معنى 'My father is tall'?", options: ["والدي طويل", "والدي قصير", "والدي صغير"], correct: 0, category: "المفردات" }
                ],
                status: "current"
            }
        ],
        2: [
            {
                id: 1,
                title: "المدرسة والمواد - الصف التاسع",
                videoUrl: "https://www.youtube.com/watch?v=eKuZ_a-P458&list=PLKb3fJULbOUbx28-fKN3SXnTPzmK-GT4e",
                questions: [
                    { text: "ما معنى 'I study English'?", options: ["أدرس الإنجليزية", "أدرس الرياضيات", "أدرس العلوم"], correct: 0, category: "المحادثة" },
                    { text: "ما معنى 'Math class'?", options: ["حصة الرياضيات", "حصة اللغة", "حصة التاريخ"], correct: 0, category: "المفردات" }
                ],
                status: "locked"
            }
        ],
        3: [
            {
                id: 1,
                title: "قواعد متقدمة - الصف التاسع",
                videoUrl: "https://www.youtube.com/embed/Obi-gLJ45YY",
                questions: [
                    { text: "اختر الشكل الصحيح: 'They ___ playing'.", options: ["are", "is", "am"], correct: 0, category: "قواعد" },
                    { text: "ما كلمة 'because' بالعربية؟", options: ["لأن", "كما", "لكن"], correct: 0, category: "قواعد" }
                ],
                status: "locked"
            }
        ]
    },
    '10': {
        1: [
            {
                id: 1,
                title: "القراءة والتحليل - الصف العاشر",
                videoUrl: "https://www.youtube.com/embed/CHr7dkZF5y0",
                questions: [
                    { text: "ما معنى 'Summary'؟", options: ["ملخص", "قصة", "سؤال"], correct: 0, category: "المفردات" },
                    { text: "اختر الترجمة الصحيحة لـ 'He studies hard'.", options: ["هو يدرس بجد", "هو يلعب كثيراً", "هو يقرأ بسرعة"], correct: 0, category: "قواعد" }
                ],
                status: "current"
            }
        ],
        2: [
            {
                id: 1,
                title: "المحادثات الرسمية - الصف العاشر",
                videoUrl: "https://www.youtube.com/embed/W01N_5S8vU8",
                questions: [
                    { text: "كيف تقول 'I would like to ask a question'?", options: ["أريد أن أطرح سؤالاً", "أريد أن أذهب إلى المنزل", "أريد أن ألعب"], correct: 0, category: "المحادثة" },
                    { text: "ما معنى 'appointment'?", options: ["موعد", "كتاب", "درس"], correct: 0, category: "المفردات" }
                ],
                status: "locked"
            }
        ],
        3: [
            {
                id: 1,
                title: "القواعد المتقدمة - الصف العاشر",
                videoUrl: "https://www.youtube.com/embed/Obi-gLJ45YY",
                questions: [
                    { text: "ما الصيغة الصحيحة لـ 'I have seen'?", options: ["لقد رأيت", "رأيت", "أرى"], correct: 0, category: "قواعد" },
                    { text: "اختر الجملة الصحيحة: 'She has finished her homework'.", options: ["هي أنهت واجبها", "هي تنهي واجبها", "هي سوف تنهي واجبها"], correct: 0, category: "قواعد" }
                ],
                status: "locked"
            }
        ]
    }
};

export const GRADE_EXAMS_DATA = {
    '4': [
        {
            id: 1,
            unitId: 1,
            title: "اختبار الوحدة الأولى - الصف الرابع",
            questionsCount: 6,
            duration: "15 دقيقة",
            description: "اختبار مبسط لمراجعة الحروف والكلمات الأساسية.",
            status: "available",
            questions: [
                { text: "ما الحرف الأول في 'Ball'?", options: ["B", "A", "L"], correct: 0 },
                { text: "ما معنى 'Good night'?", options: ["مساء الخير", "تصبح على خير", "صباح الخير"], correct: 1 }
            ]
        },
        {
            id: 2,
            unitId: 2,
            title: "اختبار الوحدة الثانية - الصف الرابع",
            questionsCount: 6,
            duration: "18 دقيقة",
            description: "اختبار بسيط على المحادثات اليومية.",
            status: "available",
            questions: [
                { text: "كيف تسأل عن العمر؟", options: ["How old are you?", "How are you?", "Where do you live?"], correct: 0 },
                { text: "ما معنى 'Please'?", options: ["شكراً", "من فضلك", "وداعاً"], correct: 1 }
            ]
        }
    ],
    '5': [
        {
            id: 1,
            unitId: 1,
            title: "اختبار الوحدة الأولى - الصف الخامس",
            questionsCount: 6,
            duration: "15 دقيقة",
            description: "مراجعة مفردات التحية والتعارف.",
            status: "available",
            questions: [
                { text: "اختر الترجمة الصحيحة لـ 'My name is'.", options: ["اسمي", "أنت", "هو"], correct: 0 },
                { text: "ما معنى 'Nice to meet you'?", options: ["سعيد بلقائك", "أراك لاحقاً", "أين تعيش؟"], correct: 0 }
            ]
        }
    ],
    '6': [
        {
            id: 1,
            unitId: 2,
            title: "اختبار الوحدة الثانية - الصف السادس",
            questionsCount: 6,
            duration: "20 دقيقة",
            description: "مراجعة جسور بين المحادثة والأسئلة.",
            status: "available",
            questions: [
                { text: "كيف تقول 'I want water'?", options: ["أريد ماء", "أريد طعام", "أريد كتاب"], correct: 0 },
                { text: "ما معنى 'Cheap'?", options: ["رخيص", "غالي", "سيء"], correct: 0 }
            ]
        }
    ],
    '7': [
        {
            id: 1,
            unitId: 3,
            title: "اختبار الوحدة الثالثة - الصف السابع",
            questionsCount: 6,
            duration: "20 دقيقة",
            description: "مراجعة الأزمنة الأساسية في جمل بسيطة.",
            status: "available",
            questions: [
                { text: "ما الماضي الصحيح لـ 'go'?", options: ["went", "goed", "gone"], correct: 0 },
                { text: "اختر الجملة الصحيحة: 'She ___ happy'.", options: ["is", "are", "am"], correct: 0 }
            ]
        }
    ],
    '8': [
        {
            id: 1,
            unitId: 2,
            title: "اختبار الوحدة الثانية - الصف الثامن",
            questionsCount: 6,
            duration: "20 دقيقة",
            description: "مراجعة السفر والاتجاهات.",
            status: "available",
            questions: [
                { text: "ما معنى 'Turn left'?", options: ["إلى اليسار", "إلى اليمين", "مباشرة"], correct: 0 },
                { text: "كيف تسأل عن المحطة؟", options: ["Where is the station?", "What is the station?", "How is the station?"], correct: 0 }
            ]
        }
    ],
    '9': [
        {
            id: 1,
            unitId: 1,
            title: "اختبار الوحدة الأولى - الصف التاسع",
            questionsCount: 6,
            duration: "20 دقيقة",
            description: "مراجعة العائلة والمفردات الشخصية.",
            status: "available",
            questions: [
                { text: "ما معنى 'My mother'?", options: ["والدتي", "أخي", "صديقي"], correct: 0 },
                { text: "اختر الجملة الصحيحة: 'He is tall'.", options: ["هو طويل", "هو قصير", "هو صغير"], correct: 0 }
            ]
        }
    ],
    '10': [
        {
            id: 1,
            unitId: 3,
            title: "اختبار الوحدة الثالثة - الصف العاشر",
            questionsCount: 6,
            duration: "25 دقيقة",
            description: "مراجعة القواعد والقراءة المتقدمة.",
            status: "available",
            questions: [
                { text: "ما معنى 'Summary'?", options: ["ملخص", "خبر", "رواية"], correct: 0 },
                { text: "اختر الصيغة الصحيحة: 'I have seen'.", options: ["لقد رأيت", "أنا رأيت", "أنا أرى"], correct: 0 }
            ]
        }
    ]
};
