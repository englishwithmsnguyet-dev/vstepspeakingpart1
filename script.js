/**
 * VSTEP SPEAKING PART 01 - ACADEMIC SCRIPT
 * Handles slide navigation, interactive formula presentation, speech synthesis, and random practice.
 */

document.addEventListener('DOMContentLoaded', () => {
    try {
    // App State
    const state = {
        studentName: 'Khách',
        isAudio: true,
        isDark: false,
        ynIndex: 0,
        selectedVoiceURI: null,
        unlockedTabs: {}
    };

    // DOM References
    const welcomeModal = document.getElementById('welcome-modal');
    const studentInput = document.getElementById('student-name');
    const studentClassInput = document.getElementById('student-class');
    const loginError = document.getElementById('login-error');
    const trackingForm = document.getElementById('tracking-form');
    const entryInput = document.getElementById('entry_388968236');
    const startBtn = document.getElementById('start-btn');
    const userProfile = document.getElementById('user-profile');
    const displayName = document.getElementById('display-name');
    
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const topTitle = document.getElementById('top-title');
    const themeToggle = document.getElementById('theme-toggle');
    const audioToggle = document.getElementById('audio-toggle');
    const voiceSelect = document.getElementById('voice-select');

    // Tab Titles Mapping
    const titles = {
        'overview': 'OVERVIEW',
        'yes-no': 'YES/NO QUESTIONS',
        'choice': 'CHOICE QUESTIONS',
        'wh-questions': 'WH- QUESTIONS',
        'benefits': 'COMMON BENEFITS',
        'activities': 'COMMON ACTIVITIES'
    };

    // Quản lý danh sách giọng đọc AI
    const populateVoices = () => {
        if (!voiceSelect || !('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        const enVoices = voices.filter(v => v.lang.startsWith('en'));
        if (enVoices.length === 0) return;
        
        const currentSelection = state.selectedVoiceURI || voiceSelect.value;
        
        voiceSelect.innerHTML = '';
        enVoices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.voiceURI;
            opt.textContent = `${v.name.replace('Microsoft ', '').replace('Online (Natural) - English (United States)', 'US').replace(' - English (United States)', ' US')} (${v.lang})`;
            voiceSelect.appendChild(opt);
        });

        const usVoices = enVoices.filter(v => v.lang === 'en-US' || v.lang.replace('_', '-') === 'en-US' || v.lang.startsWith('en-US'));
        const defaultVoice = voices.find(v => v.name.includes('Guy'))
                          || usVoices.find(v => v.name.includes('Evan') || v.name.includes('Eric') || v.name.includes('Alex') || v.name.includes('Jenny') || v.name.includes('Aria') || v.name.includes('Ava'))
                          || usVoices.find(v => v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Premium') || v.name.includes('Enhanced') || v.name.includes('Siri'))
                          || usVoices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'))
                          || usVoices[0] || enVoices[0];

        if (currentSelection && voices.some(v => v.voiceURI === currentSelection)) {
            voiceSelect.value = currentSelection;
            state.selectedVoiceURI = currentSelection;
        } else if (defaultVoice) {
            voiceSelect.value = defaultVoice.voiceURI;
            state.selectedVoiceURI = defaultVoice.voiceURI;
        }
    };

    if (voiceSelect) {
        voiceSelect.addEventListener('change', (e) => {
            state.selectedVoiceURI = e.target.value;
            window.speakText("Hello! I am your AI speaking partner.");
        });
    }

    if ('speechSynthesis' in window) {
        populateVoices();
        window.speechSynthesis.onvoiceschanged = () => populateVoices();
    }

    // Global AI Speech
    window.speakText = (txt) => {
        if (!state.isAudio) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(txt);
            
            const voices = window.speechSynthesis.getVoices();
            
            let bestVoice = null;
            if (state.selectedVoiceURI) {
                bestVoice = voices.find(v => v.voiceURI === state.selectedVoiceURI);
            }
            if (!bestVoice) {
                const preferredNames = [
                    "Microsoft Guy",
                    "Google UK English Male",
                    "Google US English Male",
                    "Alex",
                    "Daniel",
                    "Google US English",
                    "Samantha"
                ];
                for (let name of preferredNames) {
                    bestVoice = voices.find(v => v.name.includes(name));
                    if (bestVoice) break;
                }
                if (!bestVoice) {
                    bestVoice = voices.find(v => (v.lang.startsWith("en-US") || v.lang.startsWith("en-GB")) && v.name.includes("Male"));
                }
                if (!bestVoice) {
                    bestVoice = voices.find(v => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB"));
                }
                if (!bestVoice) {
                    bestVoice = voices[0];
                }
            }
            
            if (bestVoice) {
                utt.voice = bestVoice;
                utt.lang = bestVoice.lang;
            } else {
                utt.lang = 'en-US';
            }
            utt.rate = 1.0; // Normal speed
            utt.pitch = 1.25; // Slightly higher pitch for energetic Gen-Z vibe
            
            window.speechSynthesis.speak(utt);
        }
    };

    // 1. WELCOME MODAL
    window.finishLogin = () => {
        const val = studentInput.value.trim();
        state.studentName = val;
        displayName.textContent = val;
        userProfile.classList.remove('hidden');
        welcomeModal.style.opacity = '0';
        setTimeout(() => welcomeModal.classList.add('hidden'), 300);

        // Apply access control restrictions
        if (state.accessLevel === 'PARTIAL') {
            const whPills = document.querySelectorAll('.w-pill');
            whPills.forEach(pill => {
                const text = pill.textContent.trim().toUpperCase();
                if (text.startsWith('WHEN') || text.startsWith('WHERE') || text.startsWith('WHY') || text.startsWith('HOW')) {
                    pill.style.display = 'none';
                }
            });
        }
    };

    const enterRoom = () => {
        const nameVal = studentInput.value.trim();
        const classVal = studentClassInput.value.trim();
        
        if (!nameVal || !classVal) {
            loginError.textContent = 'Vui lòng nhập đầy đủ Họ tên và Lớp!';
            loginError.style.display = 'block';
            return;
        }

        const validClasses = ['2026', 'CB210', 'CB206', 'CB211', 'B212', 'CB213', 'ONB103'];
        const partialClasses = ['CB213', 'ONB103'];
        const formattedClass = classVal.toUpperCase().replace(/\s+/g, '');
        
        if (!validClasses.includes(formattedClass)) {
            loginError.textContent = 'Mã lớp không hợp lệ. Vui lòng nhập lại!';
            loginError.style.display = 'block';
            return;
        }
        
        state.accessLevel = partialClasses.includes(formattedClass) ? 'PARTIAL' : 'FULL';

        loginError.style.display = 'none';
        startBtn.disabled = true;
        startBtn.innerHTML = `<span>Đang vào lớp...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        
        entryInput.value = `${nameVal} - ${classVal}`;
        window.submitted = true;
        trackingForm.submit();
        
        // Fallback timeout in case iframe block prevents onload
        setTimeout(() => {
            if (!welcomeModal.classList.contains('hidden')) {
                window.finishLogin();
            }
        }, 1500);
    };

    startBtn?.addEventListener('click', enterRoom);
    studentInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') enterRoom(); });
    studentClassInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') enterRoom(); });

    // Sidebar & Navigation
    mobileToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));

    let currentTargetTab = null;
    let currentTargetItem = null;

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            


            activateTab(target, item);
        });
    });

    function activateTab(target, item) {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        tabPanes.forEach(pane => {
            if (pane.id === target) {
                pane.classList.remove('hidden');
                pane.classList.remove('fade-in');
                void pane.offsetWidth;
                pane.classList.add('fade-in');
            } else {
                pane.classList.add('hidden');
            }
        });

        if (topTitle) topTitle.textContent = titles[target] || target.toUpperCase();
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    // Theme & Audio toggles
    themeToggle?.addEventListener('click', () => {
        state.isDark = !state.isDark;
        document.body.classList.toggle('dark-theme', state.isDark);
        themeToggle.innerHTML = state.isDark ? '<i class="fa-solid fa-sun" style="color:#f59e0b"></i>' : '<i class="fa-solid fa-moon"></i>';
    });

    audioToggle?.addEventListener('click', () => {
        state.isAudio = !state.isAudio;
        audioToggle.innerHTML = state.isAudio ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark" style="color:var(--danger)"></i>';
        audioToggle.classList.toggle('active', state.isAudio);
        if (!state.isAudio && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    });
    // 3. YES/NO PRACTICE ROOM SLIDER (7 Formulas)
    // 3. YES/NO PRACTICE ROOM SLIDER (7 Formulas from PowerPoint)
    window.toggleSampleAnswer = (btn) => {
        const ansEl = btn.nextElementSibling;
        if (ansEl.style.display === 'none') {
            ansEl.style.display = 'block';
            btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ẩn câu trả lời mẫu';
        } else {
            ansEl.style.display = 'none';
            btn.innerHTML = '<i class="fa-solid fa-eye"></i> Nhấn xem câu trả lời mẫu';
        }
    };

    const ynFormulas = [
        {
            title: "1. Do you often [hoạt động – Vo]?",
            formula: "→ Sure. I often <strong>[hoạt động – Vo]</strong> <strong>[thời gian]</strong> when I have free time because it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
                examples: [
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>read books</span>?",
                    a: "→ Sure. I often read books in the evening when I have free time because it helps me widen my knowledge and develop my imagination.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>read books</strong> <strong>in the evening</strong> when I have free time because it helps me <strong>widen my knowledge</strong> and <strong>develop my imagination</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watch movies</span>?",
                    a: "→ Sure. I often watch movies at weekends when I have free time because it helps me have fun and improve my mood.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>watch movies</strong> <strong>at weekends</strong> when I have free time because it helps me <strong>have fun</strong> and <strong>improve my mood</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>listen to music</span>?",
                    a: "→ Sure. I often listen to music before going to bed when I have free time because it helps me relax after a busy day and sleep better.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>listen to music</strong> <strong>before going to bed</strong> when I have free time because it helps me <strong>relax after a busy day</strong> and <strong>sleep better</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go shopping</span>?",
                    a: "→ Sure. I often go shopping at weekends when I have free time because it helps me enjoy my free time and forget about my worries.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>go shopping</strong> <strong>at weekends</strong> when I have free time because it helps me <strong>enjoy my free time</strong> and <strong>forget about my worries</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go for a walk</span>?",
                    a: "→ Sure. I often go for a walk in the early morning when I have free time because it helps me stay in good shape and clear my mind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>go for a walk</strong> <strong>in the early morning</strong> when I have free time because it helps me <strong>stay in good shape</strong> and <strong>clear my mind</strong>.</div>"
                }
                ]},
                {
                    type: 'benefit',
                    title: 'Cụm Lợi ích:',
                    items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                }
            ]
        },
        {
            title: "2. Do you often [hoạt động – Vo] while [hoạt động – Ving]?",
            formula: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>[hoạt động – Vo]</strong> while <strong>[hoạt động – Ving]</strong> because it doesn't affect my concentration. Instead, it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>[hoạt động – Vo]</strong> while <strong>[hoạt động – Ving]</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>[to focus better / do it better / do it more carefully]</strong>.</div>",
                examples: [
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>listen to music</span> while <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>doing homework</span>?",
                    a: "→ Yes, I do. I often listen to music while doing homework because it doesn't affect my concentration. Instead, it helps me focus better and boost my concentration.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>listen to music</strong> while <strong>doing homework</strong> because it doesn't affect my concentration. Instead, it helps me <strong>focus better</strong> and <strong>boost my concentration</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>listen to music</strong> while <strong>doing homework</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to focus better</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eat snacks</span> while <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watching TV</span>?",
                    a: "→ Yes, I do. I often eat snacks while watching TV because it doesn't affect my concentration. Instead, it helps me reduce stress and clear my mind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>eat snacks</strong> while <strong>watching TV</strong> because it doesn't affect my concentration. Instead, it helps me <strong>reduce stress</strong> and <strong>clear my mind</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>eat snacks</strong> while <strong>watching TV</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to focus better</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>talk</span> while <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eating</span>?",
                    a: "→ Yes, I do. I often talk while eating because it doesn't affect my concentration. Instead, it helps me make new friends and learn to communicate.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>talk</strong> while <strong>eating</strong> because it doesn't affect my concentration. Instead, it helps me <strong>make new friends</strong> and <strong>learn to communicate</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>talk</strong> while <strong>eating</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to maintain a healthy lifestyle</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>sing</span> while <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>taking a shower</span>?",
                    a: "→ Yes, I do. I often sing while taking a shower because it doesn't affect my concentration. Instead, it helps me improve my mood and regain my energy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>sing</strong> while <strong>taking a shower</strong> because it doesn't affect my concentration. Instead, it helps me <strong>improve my mood</strong> and <strong>regain my energy</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>sing</strong> while <strong>taking a shower</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to relax after a long day</strong>.</div>"
                },
                {
                    q: "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>use your phone</span> while <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>walking</span>?",
                    a: "→ Yes, I do. I often use your phone while walking because it doesn't affect my concentration. Instead, it helps me pass the time and learn new things.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>use your phone</strong> while <strong>walking</strong> because it doesn't affect my concentration. Instead, it helps me <strong>pass the time</strong> and <strong>learn new things</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>use your phone</strong> while <strong>walking</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to prevent some health problems</strong>.</div>"
                }
                ]},
                {
                    type: 'note',
                    title: 'Ghi chú từ vựng trong câu:',
                    items: [
                        { en: 'affect my concentration', vn: 'ảnh hưởng đến sự tập trung của tôi' },
                        { en: 'hard', vn: 'khó khăn' },
                        { en: 'prefer', vn: 'thích hơn / ưu tiên hơn' },
                        { en: 'focus better', vn: 'tập trung tốt hơn' },
                        { en: 'do it better', vn: 'làm tốt hơn' },
                        { en: 'do it more carefully', vn: 'làm cẩn thận hơn' }
                    ]
                }
            ]
        },
        {
            title: "3. Do you like/love/enjoy [hoạt động – Ving]?",
            formula: "→ Yes, I do. I’m really into <strong>[hoạt động – Ving]</strong> because it’s very <strong>[tính từ mô tả hoạt động]</strong>. It helps me <strong>[lợi ích]</strong> and makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
                examples: [
                {
                    q: "Do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>reading books</span>?",
                    a: "→ Yes, I do. I’m really into reading books because it’s very reading books. It helps me widen my knowledge and makes me feel relaxed.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>reading books</strong> because it’s very <strong>reading books</strong>. It helps me <strong>widen my knowledge</strong> and makes me feel <strong>relaxed</strong>.</div>"
                },
                {
                    q: "Do you enjoy <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>playing sports</span>?",
                    a: "→ Yes, I do. I’m really into playing sports because it’s very playing sports. It helps me stay in good shape and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>playing sports</strong> because it’s very <strong>playing sports</strong>. It helps me <strong>stay in good shape</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "Do you love <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>listening to music</span>?",
                    a: "→ Yes, I do. I’m really into listening to music because it’s very listening to music. It helps me reduce stress and makes me feel comfortable.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>listening to music</strong> because it’s very <strong>listening to music</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>comfortable</strong>.</div>"
                },
                {
                    q: "Do you enjoy <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>learning English</span>?",
                    a: "→ Yes, I do. I’m really into learning English because it’s very learning English. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>learning English</strong> because it’s very <strong>learning English</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "Do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>cooking</span>?",
                    a: "→ Yes, I do. I’m really into cooking because it’s very cooking. It helps me create a balanced lifestyle and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>cooking</strong> because it’s very <strong>cooking</strong>. It helps me <strong>create a balanced lifestyle</strong> and makes me feel <strong>happy</strong>.</div>"
                }
                ]},
                {
                    type: 'activity',
                    title: 'Tính từ mô tả hoạt động:',
                    items: [
                            { en: 'interesting', vn: 'thú vị' },
                            { en: 'exciting', vn: 'hào hứng / tuyệt vời' },
                            { en: 'relaxing', vn: 'mang lại cảm giác thư giãn' },
                            { en: 'fun / enjoyable', vn: 'vui vẻ / thích thú' },
                            { en: 'useful / beneficial', vn: 'hữu ích / có ích' },
                            { en: 'meaningful', vn: 'có ý nghĩa' },
                            { en: 'challenging', vn: 'đầy thử thách' },
                            { en: 'fascinating', vn: 'hấp dẫn / lôi cuốn' },
                            { en: 'great / wonderful', vn: 'tuyệt vời' }
                        ]
                },
                {
                    type: 'emotion',
                    title: 'Tính từ mô tả cảm xúc:',
                    items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                },
                {
                    type: 'benefit',
                    title: 'Cụm Lợi ích:',
                    items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                }
            ]
        },
        {
            title: "4. Did you often [hoạt động – Vo] when you were a child?",
            formula: "→ Yes, I did. I used to <strong>[hoạt động – Vo]</strong> every day when I was a child because it was <strong>[tính từ mô tả hoạt động]</strong>. It was a good way for me to <strong>[lợi ích]</strong>.",
                examples: [
                {
                    q: "Did you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watch cartoons</span> when you were a child?",
                    a: "→ Yes, I did. I used to watch cartoons every day when I was a child because it was watch cartoons. It was a good way for me to develop my imagination.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>watch cartoons</strong> every day when I was a child because it was <strong>watch cartoons</strong>. It was a good way for me to <strong>develop my imagination</strong>.</div>"
                },
                {
                    q: "Did you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>play outside</span> when you were a child?",
                    a: "→ Yes, I did. I used to play outside every day when I was a child because it was play outside. It was a good way for me to stay healthy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>play outside</strong> every day when I was a child because it was <strong>play outside</strong>. It was a good way for me to <strong>stay healthy</strong>.</div>"
                },
                {
                    q: "Did you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eat candy</span> when you were a child?",
                    a: "→ Yes, I did. I used to eat candy every day when I was a child because it was eat candy. It was a good way for me to have fun.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>eat candy</strong> every day when I was a child because it was <strong>eat candy</strong>. It was a good way for me to <strong>have fun</strong>.</div>"
                },
                {
                    q: "Did you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>read comic books</span> when you were a child?",
                    a: "→ Yes, I did. I used to read comic books every day when I was a child because it was read comic books. It was a good way for me to learn new words.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>read comic books</strong> every day when I was a child because it was <strong>read comic books</strong>. It was a good way for me to <strong>learn new words</strong>.</div>"
                },
                {
                    q: "Did you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>play video games</span> when you were a child?",
                    a: "→ Yes, I did. I used to play video games every day when I was a child because it was play video games. It was a good way for me to pass the time.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>play video games</strong> every day when I was a child because it was <strong>play video games</strong>. It was a good way for me to <strong>pass the time</strong>.</div>"
                }
                ]},
                {
                    type: 'activity',
                    title: 'Tính từ mô tả hoạt động:',
                    items: [
                            { en: 'interesting', vn: 'thú vị' },
                            { en: 'exciting', vn: 'hào hứng / tuyệt vời' },
                            { en: 'relaxing', vn: 'mang lại cảm giác thư giãn' },
                            { en: 'fun / enjoyable', vn: 'vui vẻ / thích thú' },
                            { en: 'useful / beneficial', vn: 'hữu ích / có ích' },
                            { en: 'meaningful', vn: 'có ý nghĩa' },
                            { en: 'challenging', vn: 'đầy thử thách' },
                            { en: 'fascinating', vn: 'hấp dẫn / lôi cuốn' },
                            { en: 'great / wonderful', vn: 'tuyệt vời' }
                        ]
                },
                {
                    type: 'benefit',
                    title: 'Cụm Lợi ích:',
                    items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                }
            ]
        },
        {
            title: "5. Are you good at [hoạt động – Ving]?",
            formula: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>[hoạt động – Ving]</strong> because I practice it a lot. It helps me <strong>[lợi ích]</strong>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <strong>[hoạt động – Ving]</strong> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <strong>[hoạt động – Ving]</strong> because I don't practice it much. However, I would like to try it in the future because I think it's <strong>[tính từ mô tả hoạt động]</strong>.</div>",
                examples: [
                {
                    q: "Are you good at <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>cooking</span>?",
                    a: "→ No, I’m not. I’m not very good at cooking because I rarely do it. I prefer to spend time on other things.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>cooking</strong> because I practice it a lot. It helps me <strong>create a balanced lifestyle</strong>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <strong>cooking</strong> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <strong>cooking</strong> because I don't practice it much. However, I would like to try it in the future because I think it's <strong>cooking</strong>.</div>"
                },
                {
                    q: "Are you good at <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>playing sports</span>?",
                    a: "→ No, I’m not. I’m not very good at playing sports because I rarely do it. I prefer to spend time on other things.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>playing sports</strong> because I practice it a lot. It helps me <strong>stay in good shape</strong>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <strong>playing sports</strong> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <strong>playing sports</strong> because I don't practice it much. However, I would like to try it in the future because I think it's <strong>playing sports</strong>.</div>"
                },
                {
                    q: "Are you good at <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>learning languages</span>?",
                    a: "→ No, I’m not. I’m not very good at learning languages because I rarely do it. I prefer to spend time on other things.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>learning languages</strong> because I practice it a lot. It helps me <strong>discover new places</strong>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <strong>learning languages</strong> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <strong>learning languages</strong> because I don't practice it much. However, I would like to try it in the future because I think it's <strong>learning languages</strong>.</div>"
                },
                {
                    q: "Are you good at <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>drawing</span>?",
                    a: "→ No, I’m not. I’m not very good at drawing because I rarely do it. I prefer to spend time on other things.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>drawing</strong> because I practice it a lot. It helps me <strong>enhance my creativity</strong>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <strong>drawing</strong> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <strong>drawing</strong> because I don't practice it much. However, I would like to try it in the future because I think it's <strong>drawing</strong>.</div>"
                },
                {
                    q: "Are you good at <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>swimming</span>?",
                    a: "→ No, I’m not. I’m not very good at swimming because I rarely do it. I prefer to spend time on other things.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>swimming</strong> because I practice it a lot. It helps me <strong>improve my physical health</strong>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <strong>swimming</strong> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <strong>swimming</strong> because I don't practice it much. However, I would like to try it in the future because I think it's <strong>swimming</strong>.</div>"
                }
                ]},
                {
                    type: 'activity',
                    title: 'Tính từ mô tả hoạt động:',
                    items: [
                            { en: 'interesting', vn: 'thú vị' },
                            { en: 'exciting', vn: 'hào hứng / tuyệt vời' },
                            { en: 'relaxing', vn: 'mang lại cảm giác thư giãn' },
                            { en: 'fun / enjoyable', vn: 'vui vẻ / thích thú' },
                            { en: 'useful / beneficial', vn: 'hữu ích / có ích' },
                            { en: 'meaningful', vn: 'có ý nghĩa' },
                            { en: 'challenging', vn: 'đầy thử thách' },
                            { en: 'fascinating', vn: 'hấp dẫn / lôi cuốn' },
                            { en: 'great / wonderful', vn: 'tuyệt vời' }
                        ]
                },
                {
                    type: 'benefit',
                    title: 'Cụm Lợi ích:',
                    items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                }
            ]
        },
        {
            title: "6. Are/Is [...] important to you?",
            formula: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <strong>[chủ đề]</strong> is very important to me because it helps me <strong>[lợi ích 1]</strong>. It’s also a good way to <strong>[lợi ích 2]</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>[chủ đề]</strong> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>",
                examples: [
                {
                    q: "Is <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eating healthy</span> important to you?",
                    a: "→ Yes, it is. eating healthy is very important to me because it helps me stay healthy. It’s also a good way to avoid getting sick.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <strong>eating healthy</strong> is very important to me because it helps me <strong>stay healthy</strong>. It’s also a good way to <strong>avoid getting sick</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>eating healthy</strong> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>"
                },
                {
                    q: "Are <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>friends</span> important to you?",
                    a: "→ Yes, it is. friends is very important to me because it helps me make new friends. It’s also a good way to learn to work with others.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <strong>friends</strong> is very important to me because it helps me <strong>make new friends</strong>. It’s also a good way to <strong>learn to work with others</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>friends</strong> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>"
                },
                {
                    q: "Is <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>family</span> important to you?",
                    a: "→ Yes, it is. family is very important to me because it helps me build my confidence. It’s also a good way to escape from daily stress.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <strong>family</strong> is very important to me because it helps me <strong>build my confidence</strong>. It’s also a good way to <strong>escape from daily stress</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>family</strong> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>"
                },
                {
                    q: "Is <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>money</span> important to you?",
                    a: "→ Yes, it is. money is very important to me because it helps me prepare for the future. It’s also a good way to build good habits.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <strong>money</strong> is very important to me because it helps me <strong>prepare for the future</strong>. It’s also a good way to <strong>build good habits</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>money</strong> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>"
                },
                {
                    q: "Is <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>education</span> important to you?",
                    a: "→ Yes, it is. education is very important to me because it helps me widen my knowledge. It’s also a good way to develop useful skills.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <strong>education</strong> is very important to me because it helps me <strong>widen my knowledge</strong>. It’s also a good way to <strong>develop useful skills</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>education</strong> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>"
                }
                ]},
                {
                    type: 'note',
                    title: 'Ghi chú từ vựng:',
                    items: [
                        { en: 'important to me', vn: 'quan trọng đối với tôi' },
                        { en: 'doesn\'t affect my daily life much', vn: 'không ảnh hưởng nhiều đến cuộc sống hàng ngày' },
                        { en: 'prefer to focus on other things', vn: 'thích tập trung vào những thứ khác hơn' },
                        { en: 'improve my health', vn: 'cải thiện sức khỏe' },
                        { en: 'have a better life', vn: 'có cuộc sống tốt đẹp hơn' }
                    ]
                }
            ]
        },
        {
            title: "7. Have you ever [hoạt động – V3/ed]?",
            formula: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <strong>[hoạt động – V3/ed]</strong> before, and it was a/an <strong>[tính từ]</strong> experience. It helped me <strong>[lợi ích]</strong>.</div><div><strong>- Trả lời không:</strong> → No, I have never <strong>[hoạt động – V3/ed]</strong> before because I don't have the chance. But I would like to try it in the future if possible.</div>",
                examples: [
                {
                    q: "Have you ever <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>traveled abroad</span>?",
                    a: "→ Sure. I have traveled abroad before, and it was a/an wonderful experience. It helped me discover new places.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <strong>traveled abroad</strong> before, and it was a/an <strong>wonderful</strong> experience. It helped me <strong>discover new places</strong>.</div><div><strong>- Trả lời không:</strong> → No, I have never <strong>traveled abroad</strong> before because I don't have the chance. But I would like to try it in the future if possible.</div>"
                },
                {
                    q: "Have you ever <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eaten traditional food</span>?",
                    a: "→ Sure. I have eaten traditional food before, and it was a/an great experience. It helped me explore different cultures.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <strong>eaten traditional food</strong> before, and it was a/an <strong>great</strong> experience. It helped me <strong>explore different cultures</strong>.</div><div><strong>- Trả lời không:</strong> → No, I have never <strong>eaten traditional food</strong> before because I don't have the chance. But I would like to try it in the future if possible.</div>"
                },
                {
                    q: "Have you ever <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>met a famous person</span>?",
                    a: "→ Sure. I have met a famous person before, and it was a/an memorable experience. It helped me have new experiences.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <strong>met a famous person</strong> before, and it was a/an <strong>memorable</strong> experience. It helped me <strong>have new experiences</strong>.</div><div><strong>- Trả lời không:</strong> → No, I have never <strong>met a famous person</strong> before because I don't have the chance. But I would like to try it in the future if possible.</div>"
                },
                {
                    q: "Have you ever <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>lost your wallet</span>?",
                    a: "→ Sure. I have lost your wallet before, and it was a/an terrible experience. It helped me learn to solve problems.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <strong>lost your wallet</strong> before, and it was a/an <strong>terrible</strong> experience. It helped me <strong>learn to solve problems</strong>.</div><div><strong>- Trả lời không:</strong> → No, I have never <strong>lost your wallet</strong> before because I don't have the chance. But I would like to try it in the future if possible.</div>"
                },
                {
                    q: "Have you ever <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>won a competition</span>?",
                    a: "→ Sure. I have won a competition before, and it was a/an fantastic experience. It helped me build my confidence.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <strong>won a competition</strong> before, and it was a/an <strong>fantastic</strong> experience. It helped me <strong>build my confidence</strong>.</div><div><strong>- Trả lời không:</strong> → No, I have never <strong>won a competition</strong> before because I don't have the chance. But I would like to try it in the future if possible.</div>"
                }
                ]},
                {
                    type: 'activity',
                    title: 'Tính từ mô tả trải nghiệm:',
                    items: [
                        { en: 'exciting', vn: 'hào hứng / thú vị' },
                        { en: 'amazing', vn: 'tuyệt vời' },
                        { en: 'unforgettable', vn: 'không thể nào quên' },
                        { en: 'interesting', vn: 'thú vị' },
                        { en: 'memorable', vn: 'đáng nhớ' },
                        { en: 'wonderful', vn: 'tuyệt vời' },
                        { en: 'incredible', vn: 'đáng kinh ngạc / tuyệt vời' }
                    ]
                }
            ]
        }
    ];

    window.getExamplesBlockHTML = (item) => {
        if (!item || !item.examples || !item.examples.length) return '';
        
        return `
            <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #f59e0b; box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.1);">
                <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(245, 158, 11, 0.08);">
                    <div class="acc-title" style="color:#d97706; font-size:1.05rem;"><i class="fa-solid fa-list-ul"></i> CÁC CÂU HỎI VÍ DỤ</div>
                    <div class="acc-toggle" style="background:#d97706;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem ví dụ ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                </div>
                <div class="accordion-content" onclick="event.stopPropagation()">
                    <ul style="margin: 0; padding-left: 1.5rem; color: var(--text-main); font-size: 1.05rem; line-height: 1.8;">
                        ${item.examples.map(ex => `<li style="margin-bottom: 0.5rem;">${ex.q}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    };

    window.getSuggestionsHTML = (item) => {
        if (!item || !item.vocab || !item.vocab.length) return '';

        let html = `
            <div class="sugg-container mt-3 pt-3 fade-in" style="border-top: 1px dashed var(--border); text-align: left;">
                <div style="font-weight: 700; color: #059669; font-size: 0.95rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-list-check"></i> GỢI Ý TỪ VỰNG:
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.92rem; line-height: 1.6;">`;

        item.vocab.forEach(group => {
            const isBlue = group.type === 'benefit';
            const col = isBlue ? '#2563eb' : '#059669';
            const bg = isBlue ? 'rgba(59, 130, 246, 0.06)' : 'rgba(16, 185, 129, 0.06)';
            const border = isBlue ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.25)';
            let icon = 'fa-solid fa-lightbulb';
            if (group.type === 'benefit') icon = 'fa-solid fa-star';
            else if (group.type === 'time') icon = 'fa-regular fa-clock';
            else if (group.type === 'emotion') icon = 'fa-solid fa-face-smile';
            else if (group.type === 'activity') icon = 'fa-solid fa-wand-magic-sparkles';
            if (group.icon) icon = group.icon;

            html += `
                    <div style="background: ${bg}; padding: 0.85rem 1rem; border-radius: 10px; border: 1px solid ${border};">
                        <div style="color: ${col}; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.95rem;"><i class="${icon}"></i> ${group.title}</div>
                        <div style="color: var(--text-main); display: flex; flex-direction: column; gap: 0.5rem;">`;
            group.items.forEach(pair => {
                if (pair.isNote) {
                    html += `
                            <div style="font-style: italic; color: #64748b; font-weight: 500; display: flex; align-items: center; padding: 0.25rem 0;">
                                ${pair.vn}
                            </div>`;
                } else {
                    html += `
                            <div>
                                <button type="button" onclick="event.stopPropagation(); speakText('${pair.en}')" title="Nghe phát âm" style="background: none; border: none; color: ${col}; cursor: pointer; padding: 0 0.4rem 0 0; font-size: 1rem;"><i class="fa-solid fa-volume-high"></i></button>
                                <strong>${pair.en}</strong>: ${pair.vn}
                            </div>`;
                }
            });
            html += `
                        </div>
                    </div>`;
        });

        html += `
                </div>
            </div>`;
        return html;
    };

    const ynStage = document.getElementById('yn-stage');
    const ynNumEl = document.getElementById('yn-current-num');

    const renderYnSlide = () => {
        if (!ynStage) return;
        const d = ynFormulas[state.ynIndex];
        if (ynNumEl) ynNumEl.textContent = state.ynIndex + 1;
        ynStage.innerHTML = `
            <div class="f-card-clean fade-in">
                <div class="f-title" style="margin-bottom:1.5rem;">${d.title}</div>
                ${getExamplesBlockHTML(d)}
                
                <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);">
                    <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(59, 130, 246, 0.08);">
                        <div class="acc-title" style="color:#2563eb; font-size:1.05rem;"><i class="fa-solid fa-lightbulb"></i> GỢI Ý CÂU TRẢ LỜI</div>
                        <div class="acc-toggle" style="background:#2563eb;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem gợi ý câu trả lời ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                    </div>
                    <div class="accordion-content" onclick="event.stopPropagation()">
                        <div class="f-formula-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">${d.formula}</div>
                        ${getSuggestionsHTML(d)}
                    </div>
                </div>

                <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 0; border: 2px solid #8b5cf6; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.1);">
                    <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(139, 92, 246, 0.08);">
                        <div class="acc-title" style="color:#7c3aed; font-size:1.05rem;"><i class="fa-solid fa-desktop"></i> VÍ DỤ THỰC HÀNH</div>
                        <div class="acc-toggle" style="background:#7c3aed;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn vào hiện câu hỏi ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                    </div>
                    <div class="accordion-content" onclick="event.stopPropagation()">
                        <div class="f-example-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">
                            <div class="ex-label" style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.75rem; text-transform:none;">
                                ❓ Câu hỏi: <strong>${d.exQ}</strong>
                            </div>
                            <div style="margin-top:0.75rem;">
                                <button class="btn-audio-sample" style="background:#8b5cf6; margin-bottom:0.5rem; cursor:pointer;" onclick="toggleSampleAnswer(this)">
                                    <i class="fa-solid fa-eye"></i> Nhấn xem câu trả lời mẫu
                                </button>
                                <div class="fade-in" style="display:none; margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed var(--border);">
                                    <div class="ex-text" style="color:var(--secondary); font-weight:500; font-size:1.05rem; line-height:1.8;">${d.exAFormatted || d.exA}</div>
                                    <button class="btn-audio-sample mt-2" onclick="speakText('${d.exA.replace(/<[^>]*>/g, '').replace(/→/g, '').replace(/'/g, "\\'").trim()}')">
                                        <i class="fa-solid fa-volume-high"></i> Nghe Audio phát âm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    document.getElementById('yn-prev')?.addEventListener('click', () => {
        state.ynIndex = (state.ynIndex - 1 + ynFormulas.length) % ynFormulas.length;
        renderYnSlide();
    });
    document.getElementById('yn-next')?.addEventListener('click', () => {
        state.ynIndex = (state.ynIndex + 1) % ynFormulas.length;
        renderYnSlide();
    });
    renderYnSlide();

    // 4. CHOICE QUESTIONS TABS
    const cTabs = document.querySelectorAll('.c-tab');
    const choiceBox = document.getElementById('choice-display-box');

    const choiceData = {
        'opt1': {
            title: "✅ PHƯƠNG ÁN 1 – CHỌN 1 TRONG 2",
            form: "→ I prefer <strong>[lựa chọn – noun/Ving]</strong> because it’s more <strong>[tính từ mô tả lựa chọn]</strong> and helps me <strong>[lợi ích]</strong>. It also makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span>",
                examples: [
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying at home</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying in the library</span>?",
                    a: "→ I prefer studying at home because it’s more convenient and helps me reduce stress. It also makes me feel happy. LƯU Ý: Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>studying at home</strong> because it’s more <strong>convenient</strong> and helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>reading books</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watching movies</span>?",
                    a: "→ I prefer reading books because it’s more convenient and helps me reduce stress. It also makes me feel happy. LƯU Ý: Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>reading books</strong> because it’s more <strong>convenient</strong> and helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eating out</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>cooking at home</span>?",
                    a: "→ I prefer eating out because it’s more convenient and helps me reduce stress. It also makes me feel happy. LƯU Ý: Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>eating out</strong> because it’s more <strong>convenient</strong> and helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>traveling alone</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>with friends</span>?",
                    a: "→ I prefer traveling alone because it’s more convenient and helps me reduce stress. It also makes me feel happy. LƯU Ý: Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>traveling alone</strong> because it’s more <strong>convenient</strong> and helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>living in the city</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>the countryside</span>?",
                    a: "→ I prefer living in the city because it’s more convenient and helps me reduce stress. It also makes me feel happy. LƯU Ý: Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>living in the city</strong> because it’s more <strong>convenient</strong> and helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
                }
                ]},
                {
                    type: 'benefit',
                    title: 'Cụm Lợi ích:',
                    items: [
                        { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                    ]
                },
                {
                    type: 'emotion',
                    title: 'Tính từ mô tả cảm xúc:',
                    items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                }
            ]
        },
        'opt2': {
            title: "✅ PHƯƠNG ÁN 2 – CÂN NHẮC CẢ 2 PHƯƠNG ÁN (Nâng cao)",
            form: "→ It’s hard to choose because both are important. <strong>[A]</strong> helps me <strong>[lợi ích A]</strong>, while <strong>[B]</strong> allows me to <strong>[lợi ích B]</strong>.",
                examples: [
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying at home</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying in the library</span>?",
                    a: "→ It’s hard to choose because both are important. studying at home helps me improve my physical health, while studying at home allows me to widen my knowledge.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>studying at home</strong> helps me <strong>improve my physical health</strong>, while <strong>studying at home</strong> allows me to <strong>widen my knowledge</strong>.</div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>reading books</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watching movies</span>?",
                    a: "→ It’s hard to choose because both are important. reading books helps me improve my physical health, while reading books allows me to widen my knowledge.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>reading books</strong> helps me <strong>improve my physical health</strong>, while <strong>reading books</strong> allows me to <strong>widen my knowledge</strong>.</div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eating out</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>cooking at home</span>?",
                    a: "→ It’s hard to choose because both are important. eating out helps me improve my physical health, while eating out allows me to widen my knowledge.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>eating out</strong> helps me <strong>improve my physical health</strong>, while <strong>eating out</strong> allows me to <strong>widen my knowledge</strong>.</div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>traveling alone</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>with friends</span>?",
                    a: "→ It’s hard to choose because both are important. traveling alone helps me improve my physical health, while traveling alone allows me to widen my knowledge.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>traveling alone</strong> helps me <strong>improve my physical health</strong>, while <strong>traveling alone</strong> allows me to <strong>widen my knowledge</strong>.</div>"
                },
                {
                    q: "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>living in the city</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>the countryside</span>?",
                    a: "→ It’s hard to choose because both are important. living in the city helps me improve my physical health, while living in the city allows me to widen my knowledge.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>living in the city</strong> helps me <strong>improve my physical health</strong>, while <strong>living in the city</strong> allows me to <strong>widen my knowledge</strong>.</div>"
                }
                ]},
                {
                    type: 'benefit',
                    title: 'Cụm Lợi ích:',
                    items: [
                        { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                    ]
                }
            ]
        }
    };

    const renderChoice = (o) => {
        if (!choiceBox || !choiceData[o]) return;
        const d = choiceData[o];
        choiceBox.innerHTML = `
            <div class="f-card-clean fade-in" style="max-width:100%;">
                <div class="f-title" style="margin-bottom:1.5rem;">${d.title}</div>
                
                <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);">
                    <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(59, 130, 246, 0.08);">
                        <div class="acc-title" style="color:#2563eb; font-size:1.05rem;"><i class="fa-solid fa-lightbulb"></i> GỢI Ý CÂU TRẢ LỜI</div>
                        <div class="acc-toggle" style="background:#2563eb;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem gợi ý câu trả lời ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                    </div>
                    <div class="accordion-content" onclick="event.stopPropagation()">
                        <div class="f-formula-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">${d.form}</div>
                        ${getSuggestionsHTML(d)}
                    </div>
                </div>

                <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 0; border: 2px solid #8b5cf6; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.1);">
                    <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(139, 92, 246, 0.08);">
                        <div class="acc-title" style="color:#7c3aed; font-size:1.05rem;"><i class="fa-solid fa-desktop"></i> VÍ DỤ THỰC HÀNH</div>
                        <div class="acc-toggle" style="background:#7c3aed;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn vào hiện câu hỏi ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                    </div>
                    <div class="accordion-content" onclick="event.stopPropagation()">
                        <div class="f-example-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">
                            <div class="ex-label" style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.75rem; text-transform:none;">
                                ❓ Câu hỏi: <strong>${d.exQ}</strong>
                            </div>
                            <div style="margin-top:0.75rem;">
                                <button class="btn-audio-sample" style="background:#8b5cf6; margin-bottom:0.5rem; cursor:pointer;" onclick="toggleSampleAnswer(this)">
                                    <i class="fa-solid fa-eye"></i> Nhấn xem câu trả lời mẫu
                                </button>
                                <div class="fade-in" style="display:none; margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed var(--border);">
                                    <div class="ex-text" style="color:var(--secondary); font-weight:500; font-size:1.05rem; line-height:1.8;">${d.exAFormatted || d.exA}</div>
                                    <button class="btn-audio-sample mt-2" onclick="speakText('${d.audio.replace(/<[^>]*>/g, '').replace(/'/g, "\\'")}')">
                                        <i class="fa-solid fa-volume-high"></i> Nghe Audio phát âm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    cTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            cTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderChoice(tab.getAttribute('data-opt'));
        });
    });
    renderChoice('opt1');
    const choiceExamplesBox = document.getElementById('choice-examples-box');
    if (choiceExamplesBox && choiceData['opt1']) {
        choiceExamplesBox.innerHTML = getExamplesBlockHTML(choiceData['opt1']);
    }

    // 5. WH-QUESTIONS SHOWCASE (15 Formulas exactly from PowerPoint)
    const whBank = {
        'what': [
            {
                title: "1. What do you often do [thời gian]?",
                formula: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <strong>[hoạt động 1 – Vo]</strong> <strong>[thời gian]</strong> because it helps me <strong>[lợi ích 1]</strong>. Sometimes, I also <strong>[hoạt động 2 – Vo]</strong> to <strong>[lợi ích 2]</strong>.</div><div><strong>- Cách 2:</strong> → I usually <strong>[hoạt động – Vo]</strong> <strong>[thời gian]</strong> because it helps me <strong>[lợi ích]</strong>. It also makes me feel <strong>[cảm xúc]</strong>.</div>",
                examples: [
                {
                    q: "What do you often do <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>in the evening</span>?",
                    a: "→ I usually in the evening in the evening because it helps me reduce stress. Sometimes, I also in the evening to relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <strong>in the evening</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. Sometimes, I also <strong>in the evening</strong> to <strong>relax after a busy day</strong>.</div><div><strong>- Cách 2:</strong> → I usually <strong>in the evening</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>in the morning</span>?",
                    a: "→ I usually in the morning in the evening because it helps me reduce stress. Sometimes, I also in the morning to relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <strong>in the morning</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. Sometimes, I also <strong>in the morning</strong> to <strong>relax after a busy day</strong>.</div><div><strong>- Cách 2:</strong> → I usually <strong>in the morning</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>at weekends</span>?",
                    a: "→ I usually at weekends in the evening because it helps me reduce stress. Sometimes, I also at weekends to relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <strong>at weekends</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. Sometimes, I also <strong>at weekends</strong> to <strong>relax after a busy day</strong>.</div><div><strong>- Cách 2:</strong> → I usually <strong>at weekends</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>in your free time</span>?",
                    a: "→ I usually in your free time in the evening because it helps me reduce stress. Sometimes, I also in your free time to relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <strong>in your free time</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. Sometimes, I also <strong>in your free time</strong> to <strong>relax after a busy day</strong>.</div><div><strong>- Cách 2:</strong> → I usually <strong>in your free time</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>on Sundays</span>?",
                    a: "→ I usually on Sundays in the evening because it helps me reduce stress. Sometimes, I also on Sundays to relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <strong>on Sundays</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. Sometimes, I also <strong>on Sundays</strong> to <strong>relax after a busy day</strong>.</div><div><strong>- Cách 2:</strong> → I usually <strong>on Sundays</strong> <strong>in the evening</strong> because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                }
                ]},
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    },
                    {
                        type: 'emotion',
                        title: 'Tính từ mô tả cảm xúc:',
                        items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                    }
                ]
            },
            {
                title: "2. What do you often do to [mục đích]?",
                formula: "→ I often <strong>[hoạt động 1 – Vo]</strong> to <strong>[mục đích]</strong> because it helps me <strong>[lợi ích]</strong>. I also <strong>[hoạt động 2 – Vo]</strong> because it’s simple and easy to do.",
                examples: [
                {
                    q: "What do you often do to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>keep in shape</span>?",
                    a: "→ I often keep in shape to keep in shape because it helps me reduce stress. I also keep in shape because it’s simple and easy to do.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>keep in shape</strong> to <strong>keep in shape</strong> because it helps me <strong>reduce stress</strong>. I also <strong>keep in shape</strong> because it’s simple and easy to do.</div>"
                },
                {
                    q: "What do you often do to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>relax</span>?",
                    a: "→ I often relax to relax because it helps me reduce stress. I also relax because it’s simple and easy to do.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>relax</strong> to <strong>relax</strong> because it helps me <strong>reduce stress</strong>. I also <strong>relax</strong> because it’s simple and easy to do.</div>"
                },
                {
                    q: "What do you often do to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>improve your English</span>?",
                    a: "→ I often improve your English to improve your English because it helps me reduce stress. I also improve your English because it’s simple and easy to do.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>improve your English</strong> to <strong>improve your English</strong> because it helps me <strong>reduce stress</strong>. I also <strong>improve your English</strong> because it’s simple and easy to do.</div>"
                },
                {
                    q: "What do you often do to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>stay healthy</span>?",
                    a: "→ I often stay healthy to stay healthy because it helps me reduce stress. I also stay healthy because it’s simple and easy to do.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>stay healthy</strong> to <strong>stay healthy</strong> because it helps me <strong>reduce stress</strong>. I also <strong>stay healthy</strong> because it’s simple and easy to do.</div>"
                },
                {
                    q: "What do you often do to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>save money</span>?",
                    a: "→ I often save money to save money because it helps me reduce stress. I also save money because it’s simple and easy to do.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>save money</strong> to <strong>save money</strong> because it helps me <strong>reduce stress</strong>. I also <strong>save money</strong> because it’s simple and easy to do.</div>"
                }
                ]},
                    {
                        type: 'activity',
                        title: 'Cụm Hoạt động:',
                        items: [
                            { en: 'exercise', vn: 'tập thể dục' },
                            { en: 'go for a walk', vn: 'đi dạo' },
                            { en: 'play sports', vn: 'chơi thể thao' },
                            { en: 'eat healthy food', vn: 'ăn uống lành mạnh' },
                            { en: 'read books', vn: 'đọc sách' }
                        ]
                    },
                    {
                        type: 'note',
                        title: 'Cụm Mục đích / Lợi ích:',
                        items: [
                            { en: 'keep in shape', vn: 'giữ vóc dáng cân đối' },
                            { en: 'burn calories', vn: 'đốt cháy calo' },
                            { en: 'relax', vn: 'thư giãn' },
                            { en: 'improve my English', vn: 'cải thiện tiếng Anh' },
                            { en: 'stay healthy', vn: 'giữ gìn sức khỏe' },
                            { en: 'save money', vn: 'tiết kiệm tiền' }
                        ]
                    },
                    {
                        type: 'note',
                        title: 'Cụm từ cố định trong công thức:',
                        items: [
                            { en: 'simple and easy to do', vn: 'đơn giản và dễ thực hiện' }
                        ]
                    }
                ]
            },
            {
                title: "3. What do you often do when [tình huống – mệnh đề]?",
                formula: "→ I often <strong>[hoạt động – Vo]</strong> when <strong>[tình huống]</strong> because it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>. It also makes me feel <strong>[tính từ cảm xúc]</strong>.",
                examples: [
                {
                    q: "What do you often do when <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>you feel sad</span>?",
                    a: "→ I often you feel sad when you feel sad because it helps me reduce stress and relax after a busy day. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>you feel sad</strong> when <strong>you feel sad</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do when <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>you are stressed</span>?",
                    a: "→ I often you are stressed when you are stressed because it helps me reduce stress and relax after a busy day. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>you are stressed</strong> when <strong>you are stressed</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do when <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>you have free time</span>?",
                    a: "→ I often you have free time when you have free time because it helps me reduce stress and relax after a busy day. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>you have free time</strong> when <strong>you have free time</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do when <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>you are tired</span>?",
                    a: "→ I often you are tired when you are tired because it helps me reduce stress and relax after a busy day. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>you are tired</strong> when <strong>you are tired</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What do you often do when <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>you are happy</span>?",
                    a: "→ I often you are happy when you are happy because it helps me reduce stress and relax after a busy day. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>you are happy</strong> when <strong>you are happy</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>. It also makes me feel <strong>happy</strong>.</div>"
                }
                ]},
                    {
                        type: 'activity',
                        title: 'Cụm Hoạt động:',
                        items: [
                            { en: 'listen to music', vn: 'nghe nhạc' },
                            { en: 'read books', vn: 'đọc sách' },
                            { en: 'go for a walk', vn: 'đi dạo' },
                            { en: 'play games', vn: 'chơi game' }
                        ]
                    },
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    },
                    {
                        type: 'emotion',
                        title: 'Tính từ cảm xúc (cuối câu):',
                        items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                    }
                ]
            },
            {
                title: "4. What kinds of [danh từ] do you like?",
                formula: "→ I’m a big fan of <strong>[1 hoặc 2 thể loại]</strong> because they are very <strong>[tính từ mô tả]</strong>. They also allow me to <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
                examples: [
                {
                    q: "What kinds of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>movies</span> do you like?",
                    a: "→ I’m a big fan of movies because they are very great. They also allow me to reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>movies</strong> because they are very <strong>great</strong>. They also allow me to <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What kinds of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>books</span> do you like?",
                    a: "→ I’m a big fan of books because they are very great. They also allow me to reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>books</strong> because they are very <strong>great</strong>. They also allow me to <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What kinds of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>music</span> do you like?",
                    a: "→ I’m a big fan of music because they are very great. They also allow me to reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>music</strong> because they are very <strong>great</strong>. They also allow me to <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What kinds of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>sports</span> do you like?",
                    a: "→ I’m a big fan of sports because they are very great. They also allow me to reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>sports</strong> because they are very <strong>great</strong>. They also allow me to <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What kinds of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>food</span> do you like?",
                    a: "→ I’m a big fan of food because they are very great. They also allow me to reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>food</strong> because they are very <strong>great</strong>. They also allow me to <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                }
                ]},
                    {
                        type: 'note',
                        title: '🎵 Thể loại Nhạc (Music):',
                        items: [
                            { en: 'pop music', vn: 'nhạc pop' },
                            { en: 'classical music', vn: 'nhạc cổ điển' },
                            { en: 'EDM', vn: 'nhạc điện tử' },
                            { en: 'hip hop / rap', vn: 'nhạc hip hop / rap' },
                            { en: 'country music', vn: 'nhạc đồng quê' }
                        ]
                    },
                    {
                        type: 'note',
                        title: '📚 Thể loại Sách (Books):',
                        items: [
                            { en: 'comic books', vn: 'truyện tranh' },
                            { en: 'novels', vn: 'tiểu thuyết' },
                            { en: 'self-help books', vn: 'sách kỹ năng' },
                            { en: 'detective books', vn: 'truyện trinh thám' }
                        ]
                    },
                    {
                        type: 'note',
                        title: '🏃 Loại hình Thể thao (Sports):',
                        items: [
                            { en: 'team sports', vn: 'thể thao đồng đội' },
                            { en: 'individual sports', vn: 'thể thao cá nhân' },
                            { en: 'water sports', vn: 'thể thao dưới nước' },
                            { en: 'indoor sports', vn: 'thể thao trong nhà' },
                            { en: 'outdoor sports', vn: 'thể thao ngoài trời' }
                        ]
                    },
                    {
                        type: 'note',
                        title: '🍔 Loại Đồ ăn (Food):',
                        items: [
                            { en: 'fast food', vn: 'thức ăn nhanh' },
                            { en: 'seafood', vn: 'hải sản' },
                            { en: 'street food', vn: 'thức ăn đường phố' },
                            { en: 'traditional food', vn: 'thức ăn truyền thống' },
                            { en: 'healthy food', vn: 'thực phẩm tốt cho sức khỏe' }
                        ]
                    },
                    {
                        type: 'activity',
                        title: '✨ Tính từ mô tả:',
                        items: [
                            { en: 'interesting', vn: 'thú vị' },
                            { en: 'exciting', vn: 'sôi động / hào hứng' },
                            { en: 'entertaining', vn: 'mang tính giải trí' },
                            { en: 'relaxing', vn: 'giúp thư giãn' },
                            { en: 'fascinating', vn: 'lôi cuốn / hấp dẫn' },
                            { en: 'informative', vn: 'nhiều thông tin bổ ích (dùng cho sách, báo)' },
                            { en: 'delicious / tasty', vn: 'ngon miệng (dùng cho đồ ăn)' },
                            { en: 'useful', vn: 'hữu ích' },
                            { en: 'gentle / light', vn: 'nhẹ nhàng' },
                            { en: 'touching / moving', vn: 'cảm động' },
                            { en: 'soothing / mellow', vn: 'dịu êm' }
                        ]
                    },
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    }
                ]
            },
            {
                title: "5. What is your favorite [danh từ]?",
                formula: "→ My favorite <strong>[danh từ]</strong> is <strong>[thứ cụ thể]</strong> because it’s <strong>[tính từ mô tả phù hợp]</strong>. It helps me <strong>[lợi ích]</strong> and makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
                examples: [
                {
                    q: "What is your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>food</span>?",
                    a: "→ My favorite food is food because it’s great. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>food</strong> is <strong>food</strong> because it’s <strong>great</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What is your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>color</span>?",
                    a: "→ My favorite color is color because it’s great. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>color</strong> is <strong>color</strong> because it’s <strong>great</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What is your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>animal</span>?",
                    a: "→ My favorite animal is animal because it’s great. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>animal</strong> is <strong>animal</strong> because it’s <strong>great</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What is your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>subject</span>?",
                    a: "→ My favorite subject is subject because it’s great. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>subject</strong> is <strong>subject</strong> because it’s <strong>great</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "What is your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>season</span>?",
                    a: "→ My favorite season is season because it’s great. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>season</strong> is <strong>season</strong> because it’s <strong>great</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                }
                ]},
                    {
                        type: 'activity',
                        title: '✨ Tính từ mô tả:',
                        items: [
                            { en: 'delicious / tasty', vn: 'ngon miệng (Food)' },
                            { en: 'interesting / useful', vn: 'thú vị / hữu ích (Subject, Book)' },
                            { en: 'cute and loyal', vn: 'đáng yêu và trung thành (Animal)' },
                            { en: 'calming / peaceful', vn: 'yên bình / nhẹ nhàng (Color, Weather, Place)' },
                            { en: 'meaningful', vn: 'có ý nghĩa (Day, Number)' },
                            { en: 'beautiful', vn: 'đẹp (Season, Place)' }
                        ]
                    },
                    {
                        type: 'emotion',
                        title: 'Tính từ mô tả cảm xúc:',
                        items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                    },
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    }
                ]
            },
            {
                title: "6. What are the benefits of [noun/Ving]?",
                formula: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of <strong>[noun/Ving]</strong> is that it helps us <strong>[lợi ích 1]</strong>. It’s also a good way to <strong>[lợi ích 2]</strong> and <strong>[lợi ích 3]</strong>.</div><div><strong>- Cách 2:</strong> → There are many benefits of <strong>[noun/Ving]</strong>. First, it helps us <strong>[lợi ích 1]</strong>. Second, it allows us to <strong>[lợi ích 2]</strong>.</div>",
                examples: [
                {
                    q: "What are the benefits of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>exercise</span>?",
                    a: "→ One benefit of exercise is that it helps us reduce stress. It’s also a good way to relax after a busy day and clear my mind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of <strong>exercise</strong> is that it helps us <strong>reduce stress</strong>. It’s also a good way to <strong>relax after a busy day</strong> and <strong>clear my mind</strong>.</div><div><strong>- Cách 2:</strong> → There are many benefits of <strong>exercise</strong>. First, it helps us <strong>reduce stress</strong>. Second, it allows us to <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What are the benefits of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>reading books</span>?",
                    a: "→ One benefit of reading books is that it helps us reduce stress. It’s also a good way to relax after a busy day and clear my mind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of <strong>reading books</strong> is that it helps us <strong>reduce stress</strong>. It’s also a good way to <strong>relax after a busy day</strong> and <strong>clear my mind</strong>.</div><div><strong>- Cách 2:</strong> → There are many benefits of <strong>reading books</strong>. First, it helps us <strong>reduce stress</strong>. Second, it allows us to <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What are the benefits of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>learning English</span>?",
                    a: "→ One benefit of learning English is that it helps us reduce stress. It’s also a good way to relax after a busy day and clear my mind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of <strong>learning English</strong> is that it helps us <strong>reduce stress</strong>. It’s also a good way to <strong>relax after a busy day</strong> and <strong>clear my mind</strong>.</div><div><strong>- Cách 2:</strong> → There are many benefits of <strong>learning English</strong>. First, it helps us <strong>reduce stress</strong>. Second, it allows us to <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What are the benefits of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>playing sports</span>?",
                    a: "→ One benefit of playing sports is that it helps us reduce stress. It’s also a good way to relax after a busy day and clear my mind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of <strong>playing sports</strong> is that it helps us <strong>reduce stress</strong>. It’s also a good way to <strong>relax after a busy day</strong> and <strong>clear my mind</strong>.</div><div><strong>- Cách 2:</strong> → There are many benefits of <strong>playing sports</strong>. First, it helps us <strong>reduce stress</strong>. Second, it allows us to <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "What are the benefits of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>traveling</span>?",
                    a: "→ One benefit of traveling is that it helps us reduce stress. It’s also a good way to relax after a busy day and clear my mind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of <strong>traveling</strong> is that it helps us <strong>reduce stress</strong>. It’s also a good way to <strong>relax after a busy day</strong> and <strong>clear my mind</strong>.</div><div><strong>- Cách 2:</strong> → There are many benefits of <strong>traveling</strong>. First, it helps us <strong>reduce stress</strong>. Second, it allows us to <strong>relax after a busy day</strong>.</div>"
                }
                ]}
                ]
            }
        ],
        'who': [
            {
                title: "1. Who’s your favorite [noun – danh từ chỉ người]?",
                formula: "→ My favorite <strong>[noun – danh từ chỉ người]</strong> is <strong>[tên]</strong>. I like him/her because <strong>[lý do chính]</strong>. Moreover, he/she is very <strong>[tính từ mô tả tính cách]</strong>.",
                examples: [
                {
                    q: "Who’s your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>singer</span>?",
                    a: "→ My favorite singer is my friend. I like him/her because it's fun. Moreover, he/she is very kind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>singer</strong> is <strong>my friend</strong>. I like him/her because <strong>it's fun</strong>. Moreover, he/she is very <strong>kind</strong>.</div>"
                },
                {
                    q: "Who’s your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>actor</span>?",
                    a: "→ My favorite actor is my friend. I like him/her because it's fun. Moreover, he/she is very kind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>actor</strong> is <strong>my friend</strong>. I like him/her because <strong>it's fun</strong>. Moreover, he/she is very <strong>kind</strong>.</div>"
                },
                {
                    q: "Who’s your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>teacher</span>?",
                    a: "→ My favorite teacher is my friend. I like him/her because it's fun. Moreover, he/she is very kind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>teacher</strong> is <strong>my friend</strong>. I like him/her because <strong>it's fun</strong>. Moreover, he/she is very <strong>kind</strong>.</div>"
                },
                {
                    q: "Who’s your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>author</span>?",
                    a: "→ My favorite author is my friend. I like him/her because it's fun. Moreover, he/she is very kind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>author</strong> is <strong>my friend</strong>. I like him/her because <strong>it's fun</strong>. Moreover, he/she is very <strong>kind</strong>.</div>"
                },
                {
                    q: "Who’s your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>athlete</span>?",
                    a: "→ My favorite athlete is my friend. I like him/her because it's fun. Moreover, he/she is very kind.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>athlete</strong> is <strong>my friend</strong>. I like him/her because <strong>it's fun</strong>. Moreover, he/she is very <strong>kind</strong>.</div>"
                }
                ]},
                    {
                        type: 'activity',
                        title: '✨ [Tính từ mô tả tính cách / đặc điểm]:',
                        items: [
                            { en: 'talented', vn: 'tài năng' },
                            { en: 'handsome / beautiful', vn: 'đẹp trai / xinh gái' },
                            { en: 'friendly and kind', vn: 'thân thiện và tốt bụng' },
                            { en: 'humorous', vn: 'hài hước / vui tính' },
                            { en: 'inspiring', vn: 'truyền cảm hứng' }
                        ]
                    }
                ]
            },
            {
                title: "2. Who do you often [hoạt động – Vo] with?",
                formula: "→ I often <strong>[hoạt động – Vo]</strong> with my <strong>[đối tượng phù hợp]</strong> because <strong>[lý do]</strong>. It's more <strong>[tính từ phù hợp]</strong> when we spend time together.",
                examples: [
                {
                    q: "Who do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go shopping</span> with?",
                    a: "→ I often go shopping with my my friends because it's fun. It's more fun when we spend time together.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>go shopping</strong> with my <strong>my friends</strong> because <strong>it's fun</strong>. It's more <strong>fun</strong> when we spend time together.</div>"
                },
                {
                    q: "Who do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>study</span> with?",
                    a: "→ I often study with my my friends because it's fun. It's more fun when we spend time together.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>study</strong> with my <strong>my friends</strong> because <strong>it's fun</strong>. It's more <strong>fun</strong> when we spend time together.</div>"
                },
                {
                    q: "Who do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>travel</span> with?",
                    a: "→ I often travel with my my friends because it's fun. It's more fun when we spend time together.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>travel</strong> with my <strong>my friends</strong> because <strong>it's fun</strong>. It's more <strong>fun</strong> when we spend time together.</div>"
                },
                {
                    q: "Who do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watch movies</span> with?",
                    a: "→ I often watch movies with my my friends because it's fun. It's more fun when we spend time together.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>watch movies</strong> with my <strong>my friends</strong> because <strong>it's fun</strong>. It's more <strong>fun</strong> when we spend time together.</div>"
                },
                {
                    q: "Who do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>play sports</span> with?",
                    a: "→ I often play sports with my my friends because it's fun. It's more fun when we spend time together.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>play sports</strong> with my <strong>my friends</strong> because <strong>it's fun</strong>. It's more <strong>fun</strong> when we spend time together.</div>"
                }
                ]},
                    {
                        type: 'activity',
                        title: '✨ [Tính từ phù hợp]:',
                        items: [
                            { en: 'fun / enjoyable', vn: 'vui vẻ / thú vị' },
                            { en: 'interesting', vn: 'thú vị' },
                            { en: 'exciting', vn: 'sôi nổi / hào hứng' },
                            { en: 'comfortable', vn: 'thoải mái' },
                            { en: 'meaningful', vn: 'có ý nghĩa' },
                            { en: 'memorable', vn: 'đáng nhớ' }
                        ]
                    },
                    {
                        type: 'note',
                        title: 'Ghi chú khác:',
                        items: [
                            { en: 'spend time together', vn: 'dành thời gian cùng nhau' }
                        ]
                    }
                ]
            }
        ],
        'when': [
            {
                title: "1. When do you often [hoạt động – Vo]?",
                formula: "→ I usually <strong>[hoạt động – Vo]</strong> <strong>[thời gian]</strong> because that’s when I have free time. It helps me <strong>[lợi ích]</strong> and makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
                examples: [
                {
                    q: "When do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>listen to music</span>?",
                    a: "→ I usually listen to music in the evening because that’s when I have free time. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>listen to music</strong> <strong>in the evening</strong> because that’s when I have free time. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "When do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>read books</span>?",
                    a: "→ I usually read books in the evening because that’s when I have free time. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>read books</strong> <strong>in the evening</strong> because that’s when I have free time. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "When do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go shopping</span>?",
                    a: "→ I usually go shopping in the evening because that’s when I have free time. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go shopping</strong> <strong>in the evening</strong> because that’s when I have free time. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "When do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>play sports</span>?",
                    a: "→ I usually play sports in the evening because that’s when I have free time. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>play sports</strong> <strong>in the evening</strong> because that’s when I have free time. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "When do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watch movies</span>?",
                    a: "→ I usually watch movies in the evening because that’s when I have free time. It helps me reduce stress and makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>watch movies</strong> <strong>in the evening</strong> because that’s when I have free time. It helps me <strong>reduce stress</strong> and makes me feel <strong>happy</strong>.</div>"
                }
                ]},
                    {
                        type: 'emotion',
                        title: 'Tính từ mô tả cảm xúc:',
                        items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                    },
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    }
                ]
            }
        ],
        'where': [
            {
                title: "1. Where do you often [hoạt động – Vo]?",
                formula: "→ I usually <strong>[hoạt động – Vo]</strong> <strong>[cụm địa điểm]</strong> because it’s very <strong>[tính từ mô tả địa điểm]</strong>. It helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
                examples: [
                {
                    q: "Where do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>read books</span>?",
                    a: "→ I usually read books the park because it’s very beautiful. It helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>read books</strong> <strong>the park</strong> because it’s very <strong>beautiful</strong>. It helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "Where do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>study</span>?",
                    a: "→ I usually study the park because it’s very beautiful. It helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>study</strong> <strong>the park</strong> because it’s very <strong>beautiful</strong>. It helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "Where do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>hang out with friends</span>?",
                    a: "→ I usually hang out with friends the park because it’s very beautiful. It helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>hang out with friends</strong> <strong>the park</strong> because it’s very <strong>beautiful</strong>. It helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "Where do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>buy clothes</span>?",
                    a: "→ I usually buy clothes the park because it’s very beautiful. It helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>buy clothes</strong> <strong>the park</strong> because it’s very <strong>beautiful</strong>. It helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "Where do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go for a walk</span>?",
                    a: "→ I usually go for a walk the park because it’s very beautiful. It helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go for a walk</strong> <strong>the park</strong> because it’s very <strong>beautiful</strong>. It helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                }
                ]},
                    {
                        type: 'activity',
                        title: 'Tính từ mô tả địa điểm:',
                        items: [
                            { en: 'quiet', vn: 'yên tĩnh' },
                            { en: 'peaceful', vn: 'thanh bình / yên ả' },
                            { en: 'spacious', vn: 'rộng rãi' },
                            { en: 'beautiful', vn: 'đẹp' },
                            { en: 'relaxing', vn: 'thư giãn' },
                            { en: 'convenient', vn: 'thuận tiện' },
                            { en: 'modern', vn: 'hiện đại' },
                            { en: 'comfortable', vn: 'thoải mái' },
                            { en: 'lively / bustling', vn: 'sôi động / nhộn nhịp' },
                            { en: 'airy', vn: 'thoáng mát' }
                        ]
                    },
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    }
                ]
            }
        ],
        'why': [
            {
                title: "1. Why do you like [hoạt động – Ving]?",
                formula: "→ I enjoy <strong>[hoạt động – Ving]</strong> because it’s very <strong>[tính từ mô tả hoạt động]</strong>. It helps me <strong>[lợi ích 1]</strong> makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
                examples: [
                {
                    q: "Why do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>swimming</span>?",
                    a: "→ I enjoy swimming because it’s very interesting. It helps me reduce stress makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>swimming</strong> because it’s very <strong>interesting</strong>. It helps me <strong>reduce stress</strong> makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "Why do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>reading books</span>?",
                    a: "→ I enjoy reading books because it’s very interesting. It helps me reduce stress makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>reading books</strong> because it’s very <strong>interesting</strong>. It helps me <strong>reduce stress</strong> makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "Why do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>learning English</span>?",
                    a: "→ I enjoy learning English because it’s very interesting. It helps me reduce stress makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>learning English</strong> because it’s very <strong>interesting</strong>. It helps me <strong>reduce stress</strong> makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "Why do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watching movies</span>?",
                    a: "→ I enjoy watching movies because it’s very interesting. It helps me reduce stress makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>watching movies</strong> because it’s very <strong>interesting</strong>. It helps me <strong>reduce stress</strong> makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "Why do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>traveling</span>?",
                    a: "→ I enjoy traveling because it’s very interesting. It helps me reduce stress makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>traveling</strong> because it’s very <strong>interesting</strong>. It helps me <strong>reduce stress</strong> makes me feel <strong>happy</strong>.</div>"
                }
                ]},
                    {
                        type: 'emotion',
                        title: 'Tính từ mô tả cảm xúc:',
                        items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                    },
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    }
                ]
            }
        ],
        'how': [
            {
                title: "1. How do you [go/get/commute/travel] to [địa điểm]?",
                formula: "→ I usually <strong>[go/get/commute/travel]</strong> there by <strong>[phương tiện]</strong> because it’s very <strong>[tính từ mô tả phương tiện]</strong>. It also helps me <strong>[lợi ích]</strong>.",
                examples: [
                {
                    q: "How do you go to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>school</span> every day?",
                    a: "→ I usually school there by bus because it’s very convenient. It also helps me reduce stress.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>school</strong> there by <strong>bus</strong> because it’s very <strong>convenient</strong>. It also helps me <strong>reduce stress</strong>.</div>"
                },
                {
                    q: "How do you travel to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>work</span>?",
                    a: "→ I usually work there by bus because it’s very convenient. It also helps me reduce stress.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>work</strong> there by <strong>bus</strong> because it’s very <strong>convenient</strong>. It also helps me <strong>reduce stress</strong>.</div>"
                },
                {
                    q: "How do you get to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>the supermarket</span>?",
                    a: "→ I usually the supermarket there by bus because it’s very convenient. It also helps me reduce stress.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>the supermarket</strong> there by <strong>bus</strong> because it’s very <strong>convenient</strong>. It also helps me <strong>reduce stress</strong>.</div>"
                },
                {
                    q: "How do you commute to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>the city center</span>?",
                    a: "→ I usually the city center there by bus because it’s very convenient. It also helps me reduce stress.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>the city center</strong> there by <strong>bus</strong> because it’s very <strong>convenient</strong>. It also helps me <strong>reduce stress</strong>.</div>"
                },
                {
                    q: "How do you travel to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>your hometown</span>?",
                    a: "→ I usually your hometown there by bus because it’s very convenient. It also helps me reduce stress.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>your hometown</strong> there by <strong>bus</strong> because it’s very <strong>convenient</strong>. It also helps me <strong>reduce stress</strong>.</div>"
                }
                ]},
                    {
                        type: 'activity',
                        title: '✨ [Tính từ mô tả phương tiện]:',
                        items: [
                            { en: 'fast and convenient', vn: 'nhanh chóng và tiện lợi' },
                            { en: 'cheap and safe', vn: 'rẻ và an toàn' },
                            { en: 'comfortable', vn: 'thoải mái' },
                            { en: 'eco-friendly', vn: 'thân thiện với môi trường' }
                        ]
                    },
                    {
                        type: 'note',
                        title: '💡 Gợi ý [Lợi ích] (Benefits):',
                        items: [
                            { en: 'save time', vn: 'tiết kiệm thời gian' },
                            { en: 'save money', vn: 'tiết kiệm tiền' },
                            { en: 'avoid traffic jams', vn: 'tránh kẹt xe' },
                            { en: 'avoid being late', vn: 'tránh bị trễ giờ' },
                            { en: 'protect the environment', vn: 'bảo vệ môi trường' },
                            { en: 'reduce air pollution', vn: 'giảm thiểu ô nhiễm không khí' }
                        ]
                    }
                ]
            },
            {
                title: "2. How often do you [hoạt động – Vo]?",
                formula: "→ Although I'm busy, I try to <strong>[hoạt động – Vo]</strong> <strong>[tần suất]</strong> because it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
                examples: [
                {
                    q: "How often do you <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go to the library</span>?",
                    a: "→ Although I'm busy, I try to go to the library every day because it helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I'm busy, I try to <strong>go to the library</strong> <strong>every day</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "How often do you <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>play sports</span>?",
                    a: "→ Although I'm busy, I try to play sports every day because it helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I'm busy, I try to <strong>play sports</strong> <strong>every day</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "How often do you <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watch movies</span>?",
                    a: "→ Although I'm busy, I try to watch movies every day because it helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I'm busy, I try to <strong>watch movies</strong> <strong>every day</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "How often do you <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eat out</span>?",
                    a: "→ Although I'm busy, I try to eat out every day because it helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I'm busy, I try to <strong>eat out</strong> <strong>every day</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                },
                {
                    q: "How often do you <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>travel</span>?",
                    a: "→ Although I'm busy, I try to travel every day because it helps me reduce stress and relax after a busy day.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I'm busy, I try to <strong>travel</strong> <strong>every day</strong> because it helps me <strong>reduce stress</strong> and <strong>relax after a busy day</strong>.</div>"
                }
                ]},
                    {
                        type: 'time',
                        title: '⏳ Trạng từ chỉ tần suất:',
                        items: [
                            { en: 'every day / daily', vn: 'mỗi ngày' },
                            { en: 'once a week', vn: 'một lần một tuần' },
                            { en: 'twice a week', vn: 'hai lần một tuần' },
                            { en: 'three times a week', vn: 'ba lần một tuần' },
                            { en: 'whenever I have free time', vn: 'bất cứ khi nào có thời gian rảnh' }
                        ]
                    },
                    {
                        type: 'note',
                        title: 'Ghi chú từ vựng (Có trong template):',
                        items: [
                            { en: "Although I'm busy", vn: 'Mặc dù tôi bận rộn' },
                            { en: 'I try to', vn: 'Tôi cố gắng' }
                        ]
                    }
                ]
            },
            {
                title: "3. How much time do you spend [hoạt động – Ving]?",
                formula: "→ Although I have a busy schedule, I still spend about <strong>[lượng thời gian]</strong> <strong>[hoạt động – Ving]</strong> every day because it helps me <strong>[lợi ích]</strong>. It also makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
                examples: [
                {
                    q: "How much time do you spend <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying English</span>?",
                    a: "→ Although I have a busy schedule, I still spend about in the evening studying English every day because it helps me reduce stress. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>in the evening</strong> <strong>studying English</strong> every day because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "How much time do you spend <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>using your phone</span>?",
                    a: "→ Although I have a busy schedule, I still spend about in the evening using your phone every day because it helps me reduce stress. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>in the evening</strong> <strong>using your phone</strong> every day because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "How much time do you spend <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watching TV</span>?",
                    a: "→ Although I have a busy schedule, I still spend about in the evening watching TV every day because it helps me reduce stress. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>in the evening</strong> <strong>watching TV</strong> every day because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "How much time do you spend <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>playing games</span>?",
                    a: "→ Although I have a busy schedule, I still spend about in the evening playing games every day because it helps me reduce stress. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>in the evening</strong> <strong>playing games</strong> every day because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                },
                {
                    q: "How much time do you spend <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>reading books</span>?",
                    a: "→ Although I have a busy schedule, I still spend about in the evening reading books every day because it helps me reduce stress. It also makes me feel happy.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>in the evening</strong> <strong>reading books</strong> every day because it helps me <strong>reduce stress</strong>. It also makes me feel <strong>happy</strong>.</div>"
                }
                ]},
                    {
                        type: 'note',
                        title: 'Ghi chú từ vựng (Có trong template):',
                        items: [
                            { en: 'busy schedule', vn: 'lịch trình bận rộn' }
                        ]
                    },
                    {
                        type: 'emotion',
                        title: 'Tính từ mô tả cảm xúc:',
                        items: [
                            { en: 'excited', vn: 'hào hứng / phấn khích' },
                            { en: 'happy', vn: 'vui vẻ / hạnh phúc' },
                            { en: 'relaxed', vn: 'thư thái / thoải mái' },
                            { en: 'confident', vn: 'tự tin' },
                            { en: 'refreshed', vn: 'sảng khoái' },
                            { en: 'motivated', vn: 'có động lực' },
                            { en: 'comfortable', vn: 'dễ chịu' },
                            { en: 'energetic', vn: 'tràn đầy năng lượng' }
                        ]
                    },
                    {
                        type: 'benefit',
                        title: 'Cụm Lợi ích:',
                        items: [
                            { isNote: true, vn: '👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)' }
                        ]
                    }
                ]
            },
            {
                title: "4. How much money do you spend on [thứ gì đó – noun] every month?",
                formula: "→ I’m still a student, so I need to save money. I only spend about <strong>[số tiền]</strong> on <strong>[thứ gì đó]</strong> every month because I think it’s reasonable for me.",
                examples: [
                {
                    q: "How much money do you spend on <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>clothes</span> every month?",
                    a: "→ I’m still a student, so I need to save money. I only spend about 500,000 VND on clothes every month because I think it’s reasonable for me.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>500,000 VND</strong> on <strong>clothes</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    q: "How much money do you spend on <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>food</span> every month?",
                    a: "→ I’m still a student, so I need to save money. I only spend about 500,000 VND on food every month because I think it’s reasonable for me.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>500,000 VND</strong> on <strong>food</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    q: "How much money do you spend on <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>entertainment</span> every month?",
                    a: "→ I’m still a student, so I need to save money. I only spend about 500,000 VND on entertainment every month because I think it’s reasonable for me.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>500,000 VND</strong> on <strong>entertainment</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    q: "How much money do you spend on <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>books</span> every month?",
                    a: "→ I’m still a student, so I need to save money. I only spend about 500,000 VND on books every month because I think it’s reasonable for me.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>500,000 VND</strong> on <strong>books</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    q: "How much money do you spend on <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>transportation</span> every month?",
                    a: "→ I’m still a student, so I need to save money. I only spend about 500,000 VND on transportation every month because I think it’s reasonable for me.",
                    f: "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>500,000 VND</strong> on <strong>transportation</strong> every month because I think it’s reasonable for me.</div>"
                }
                ]}
                ]
            }
        ]
    };

    const whShowcase = document.getElementById('wh-showcase');

    window.filterWh = (cat) => {
        document.querySelectorAll('.w-pill').forEach(p => p.classList.remove('active'));
        if (typeof window !== 'undefined' && window.event && window.event.currentTarget && window.event.currentTarget.classList) {
            window.event.currentTarget.classList.add('active');
        }
        if (!whShowcase) return;
        const list = whBank[cat] || [];
        whShowcase.innerHTML = `
            <div class="wh-grid fade-in" style="grid-template-columns: 1fr; gap: 1.5rem;">
                ${list.map(item => `
                    <div class="f-card-clean" style="max-width:100%; margin:0; background:var(--bg-card); padding:1.5rem; border-radius:20px; border:1px solid var(--border); box-shadow:var(--shadow-sm);">
                        <div class="f-title" style="margin-bottom:1.5rem;">${item.title}</div>
                        ${getExamplesBlockHTML(item)}
                        
                        <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);">
                            <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(59, 130, 246, 0.08);">
                                <div class="acc-title" style="color:#2563eb; font-size:1.05rem;"><i class="fa-solid fa-lightbulb"></i> GỢI Ý CÂU TRẢ LỜI</div>
                                <div class="acc-toggle" style="background:#2563eb;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem gợi ý câu trả lời ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                            </div>
                            <div class="accordion-content" onclick="event.stopPropagation()">
                                <div class="f-formula-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">${item.formula}</div>
                                ${item.note ? `<div class="tpl-note mt-2 mb-2" style="display:block;"><i class="fa-solid fa-circle-exclamation"></i> ${item.note}</div>` : ''}
                                ${getSuggestionsHTML(item)}
                            </div>
                        </div>

                        <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 0; border: 2px solid #8b5cf6; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.1);">
                            <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(139, 92, 246, 0.08);">
                                <div class="acc-title" style="color:#7c3aed; font-size:1.05rem;"><i class="fa-solid fa-desktop"></i> VÍ DỤ THỰC HÀNH</div>
                                <div class="acc-toggle" style="background:#7c3aed;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn vào hiện câu hỏi ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                            </div>
                            <div class="accordion-content" onclick="event.stopPropagation()">
                                <div class="f-example-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">
                                    <div class="ex-label" style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.75rem; text-transform:none;">
                                        ❓ Câu hỏi: <strong>${item.exQ}</strong>
                                    </div>
                                    <div style="margin-top:0.75rem;">
                                        <button class="btn-audio-sample" style="background:#8b5cf6; margin-bottom:0.5rem; cursor:pointer;" onclick="toggleSampleAnswer(this)">
                                            <i class="fa-solid fa-eye"></i> Nhấn xem câu trả lời mẫu
                                        </button>
                                        <div class="fade-in" style="display:none; margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed var(--border);">
                                            <div class="ex-text" style="color:var(--secondary); font-weight:500; font-size:1.05rem; line-height:1.8;">${item.exAFormatted || item.exA}</div>
                                            <button class="btn-audio-sample mt-2" onclick="speakText('${item.exA.replace(/<[^>]*>/g, '').replace(/→/g, '').replace(/'/g, "\\'").trim()}')">
                                                <i class="fa-solid fa-volume-high"></i> Nghe Audio phát âm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };
    filterWh('what');

    // =========================================
    // AUDIO RECORDING LOGIC
    // =========================================
    let mediaRecorder = null;
    let audioChunks = [];
    let currentStream = null;

    window.toggleRecording = async (type) => {
        const btn = document.getElementById(`btn-record-${type}`);
        const status = document.getElementById(`recording-status-${type}`);
        const playback = document.getElementById(`audio-playback-${type}`);
        const submitBtn = document.getElementById(`btn-submit-${type}`);

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Ghi âm lại';
            btn.style.background = '#3b82f6';
            btn.style.boxShadow = '0 4px 10px rgba(59,130,246,0.3)';
            status.style.display = 'none';
            if (currentStream) currentStream.getTracks().forEach(t => t.stop());
            return;
        }

        try {
            playback.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'none';
            audioChunks = [];
            currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(currentStream);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                playback.src = audioUrl;
                playback.style.display = 'block';
                
                // Attach the blob to the submit button
                if (submitBtn) {
                    submitBtn.style.display = 'block';
                    submitBtn.dataset.blobUrl = audioUrl;
                }
            };

            mediaRecorder.start();
            btn.innerHTML = '<i class="fa-solid fa-stop"></i> Dừng ghi âm';
            btn.style.background = '#ef4444';
            btn.style.boxShadow = '0 4px 10px rgba(239,68,68,0.3)';
            status.style.display = 'block';

        } catch (err) {
            alert('Không thể truy cập Micro. Vui lòng cấp quyền Microphone cho trình duyệt (hoặc bạn đang không dùng HTTPS/localhost)!');
        }
    };

    window.submitAudio = (type) => {
        const submitBtn = document.getElementById(`btn-submit-${type}`);
        if (!submitBtn || !submitBtn.dataset.blobUrl) return;

        // 1. Download file automatically
        const a = document.createElement('a');
        a.href = submitBtn.dataset.blobUrl;
        
        // Tạo tên file có ngày giờ để tránh trùng lặp
        const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.download = `VSTEP_Speaking_${type}_${dateStr}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 2. Alert
        alert('Đã tải xuống bản ghi âm của bạn thành công!');
    };

    // Random Practice Selector
    
    window.spinWheel = (type) => {
        let pool = [];
        let qEl, hintEl, btn;

        if (type === 'wh') {
            const safeWhBank = typeof whBank !== 'undefined' ? whBank : {};
            const whValues = Object.values(safeWhBank);
            // Fallback for browsers that don't support .flat()
            pool = whValues.flat ? whValues.flat() : whValues.reduce((acc, val) => acc.concat(val), []);
            qEl = document.getElementById('wheel-q');
            hintEl = document.getElementById('wheel-hint');
            btn = document.getElementById('spin-btn');
        } else if (type === 'yn') {
            pool = typeof ynFormulas !== 'undefined' ? ynFormulas : [];
            qEl = document.getElementById('wheel-q-yn');
            hintEl = document.getElementById('wheel-hint-yn');
            btn = document.getElementById('spin-btn-yn');
        } else if (type === 'choice') {
            const safeChoiceData = typeof choiceData !== 'undefined' ? choiceData : {};
            const choiceValues = Object.values(safeChoiceData);
            pool = choiceValues.flat ? choiceValues.flat() : choiceValues.reduce((acc, val) => acc.concat(val), []);
            qEl = document.getElementById('wheel-q-choice');
            hintEl = document.getElementById('wheel-hint-choice');
            btn = document.getElementById('spin-btn-choice');
        }

        if (!pool || pool.length === 0 || !qEl || !btn) return;

        // Flatten the pool to include ALL examples as individual questions
        let flattenedPool = [];
        pool.forEach(item => {
            if (item.examples && item.examples.length > 0) {
                item.examples.forEach(ex => {
                    flattenedPool.push({ 
                        ...item, 
                        exQ: ex.q, 
                        originalQ: item.exQ || item.title,
                        exAFormatted: ex.f, 
                        exA: ex.a 
                    });
                });
            } else {
                flattenedPool.push(item);
            }
        });
        pool = flattenedPool;

        btn.disabled = true;
        let c = 0;
        const int = setInterval(() => {
            const rand = pool[Math.floor(Math.random() * pool.length)];
            if (rand) {
                qEl.textContent = (rand.exQ || rand.title || "Câu hỏi ngẫu nhiên").replace(/<[^>]*>/g, '');
            }
            c++;
            if (c > 10) {
                clearInterval(int);
                const final = pool[Math.floor(Math.random() * pool.length)];
                if (final) {
                    qEl.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; gap:0.75rem; text-align:left;"><i class="fa-solid fa-microphone" style="color:#f59e0b; flex-shrink:0; font-size:1.5rem;"></i> <span>"${final.exQ || final.title || ''}"</span></div>`;
                    if (hintEl) {
                        hintEl.innerHTML = `
                            <div class="hint-toggle-btn" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.5rem; font-weight:600; color:#d97706; padding:0.25rem 0;" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
                                <i class="fa-solid fa-lightbulb"></i> GỢI Ý (Nhấp để xem)
                            </div>
                            <div class="hint-content fade-in" style="display:none; margin-top:0.5rem; font-size:1.05rem; line-height:1.6; text-align: left;">
                                <div style="margin-bottom: 0.75rem;">
                                    <strong style="color: #059669;">💡 Áp dụng Cấu trúc:</strong><br/> 
                                    <div style="background: rgba(16, 185, 129, 0.05); padding: 0.75rem; border-left: 3px solid #10b981; margin-top: 0.5rem; border-radius: 4px;">
                                        ${final.formula || ''}
                                    </div>
                                </div>
                                <div>
                                    <strong style="color: #64748b; font-size: 0.95em;">📝 Tham khảo câu mẫu:</strong><br/> 
                                    <div style="color: #64748b; font-size: 0.95em; margin-top: 0.25rem; font-style: italic;">
                                        ${final.exAFormatted || `"${final.exA || ''}"`}
                                    </div>
                                </div>
                            </div>
                        `;
                        hintEl.classList.remove('hidden');
                    }
                    speakText((final.exQ || final.title || '').replace(/<[^>]*>/g, ''));
                    
                    const recordBox = document.getElementById('record-box-' + type);
                    if (recordBox) {
                        recordBox.style.display = 'block';
                        const playback = document.getElementById('audio-playback-' + type);
                        if(playback) { playback.style.display = 'none'; playback.src = ''; }
                        const submitBtn = document.getElementById('btn-submit-' + type);
                        if(submitBtn) { submitBtn.style.display = 'none'; }
                        const btnRecord = document.getElementById('btn-record-' + type);
                        if(btnRecord) {
                            btnRecord.innerHTML = '<i class="fa-solid fa-microphone"></i> Bắt đầu Ghi âm';
                            btnRecord.style.background = '#ef4444';
                            btnRecord.style.boxShadow = '0 4px 10px rgba(239,68,68,0.3)';
                        }
                    }
                }
                btn.disabled = false;
            }
        }, 60);
    };

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    // =========================================
    // REVIEW GAMES LOGIC & SFX
    // =========================================
    let audioCtx = null;
    
    function playTone(freq, type, duration) {
        if (!state.isAudio) return;
        if (!audioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            audioCtx = new AC();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }
    
    const sfx = {
        flip: () => playTone(300, 'sine', 0.1),
        correct: () => {
            playTone(600, 'sine', 0.1);
            setTimeout(() => playTone(800, 'sine', 0.15), 100);
        },
        wrong: () => {
            playTone(250, 'sawtooth', 0.2);
            setTimeout(() => playTone(200, 'sawtooth', 0.25), 100);
        },
        win: () => {
            playTone(400, 'sine', 0.1);
            setTimeout(() => playTone(500, 'sine', 0.1), 100);
            setTimeout(() => playTone(600, 'sine', 0.1), 200);
            setTimeout(() => playTone(800, 'sine', 0.4), 300);
        }
    };
    
    function shootConfetti() {
        if (typeof confetti === 'function') {
            const duration = 2500;
            const end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'], zIndex: 9999 });
                confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'], zIndex: 9999 });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    }
    let reviewWords = [];
    
    function extractReviewWords(tabId) {
        let currentWords = [];
        const cards = document.querySelectorAll('#' + tabId + ' .icon-btn');
        cards.forEach(btn => {
            const container = btn.parentElement;
            const enEl = container.querySelector('strong');
            if (enEl && enEl.nextElementSibling) {
                currentWords.push({
                    en: enEl.textContent.trim(),
                    vn: enEl.nextElementSibling.textContent.trim()
                });
            }
        });
        return currentWords;
    }

    window.startReviewGame = (type, tabId) => {
        const words = extractReviewWords(tabId);
        if (words.length === 0) return;
        const tabEl = document.getElementById(tabId);
        const placeholder = tabEl.querySelector('.game-placeholder');
        const content = tabEl.querySelector('.game-content');
        
        if(placeholder) placeholder.style.display = 'none';
        if(content) content.style.display = 'block';
        
        if (type === 'flashcards') {
            initFlashcards(words, content, tabId);
        } else if (type === 'matching') {
            initMatchingGame(words, content, tabId);
        } else if (type === 'quiz') {
            initQuizGame(words, content, tabId);
        } else if (type === 'spelling') {
            initSpellingGame(words, content, tabId);
        }
    };

    function initFlashcards(allWords, container) {
        let words = [...allWords].sort(() => 0.5 - Math.random());
        let currentIndex = 0;
        
        function renderCard() {
            if (currentIndex >= words.length) {
                sfx.win();
                shootConfetti();
                container.innerHTML = `
                    <div class="fade-in" style="text-align:center; padding: 2rem;">
                        <i class="fa-solid fa-trophy" style="font-size:4rem; color:#f59e0b; margin-bottom:1rem;"></i>
                        <h3 style="font-size:1.5rem; margin-bottom:1rem;">Tuyệt vời! Bạn đã ôn xong tất cả các từ.</h3>
                        <button class="btn btn-primary" onclick="startReviewGame('flashcards', '${tabId}')"><i class="fa-solid fa-rotate-right"></i> Ôn tập lại</button>
                    </div>
                `;
                return;
            }
            const word = words[currentIndex];
            container.innerHTML = `
                <div class="fade-in" style="display:flex; flex-direction:column; align-items:center; height:100%; justify-content:center;">
                    <div style="margin-bottom:1rem; font-weight:bold; color:var(--text-muted);">Thẻ ${currentIndex + 1} / ${words.length}</div>
                    <div class="flashcard-container" onclick="if(!this.querySelector('.flashcard').classList.contains('flipped')) { sfx.flip(); this.querySelector('.flashcard').classList.add('flipped'); speakText('${word.en.replace(/'/g, "\\'")}') } else { this.querySelector('.flashcard').classList.remove('flipped'); }">
                        <div class="flashcard">
                            <div class="flashcard-face flashcard-front">
                                <div class="fc-word">${word.en}</div>
                                <div class="fc-hint"><i class="fa-solid fa-hand-pointer"></i> Nhấp để lật xem nghĩa</div>
                            </div>
                            <div class="flashcard-face flashcard-back">
                                <div class="fc-word">${word.vn}</div>
                                <div class="fc-hint"><i class="fa-solid fa-volume-high"></i> Nhấp để lật & nghe lại</div>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex; gap:1rem; margin-top:1.5rem; flex-wrap:wrap; justify-content:center;">
                        <button class="btn" style="background:#fef2f2; color:#991b1b; border:1px solid #fecaca; box-shadow:none;" id="fc-btn-review"><i class="fa-solid fa-xmark"></i> Cần ôn lại</button>
                        <button class="btn" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; box-shadow:none;" id="fc-btn-gotit"><i class="fa-solid fa-check"></i> Đã thuộc</button>
                    </div>
                </div>
            `;
            
            document.getElementById('fc-btn-review').onclick = (e) => {
                e.stopPropagation();
                words.push(word); // move to end
                currentIndex++;
                renderCard();
            };
            document.getElementById('fc-btn-gotit').onclick = (e) => {
                e.stopPropagation();
                currentIndex++;
                renderCard();
            };
        }
        renderCard();
    }

    function initMatchingGame(allWords, container) {
        let pool = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 6);
        let items = [];
        pool.forEach((w, i) => {
            items.push({ id: i, text: w.en, type: 'en', word: w });
            items.push({ id: i, text: w.vn, type: 'vn', word: w });
        });
        items.sort(() => 0.5 - Math.random());
        
        container.innerHTML = `
            <div class="fade-in" style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div style="font-weight:bold; color:var(--text-main); font-size:1.1rem;"><i class="fa-solid fa-link" style="color:var(--primary);"></i> Ghép các cặp từ tương ứng</div>
                <button class="btn btn-secondary" onclick="startReviewGame('matching', '${tabId}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;"><i class="fa-solid fa-rotate-right"></i> Bài mới</button>
            </div>
            <div class="matching-grid fade-in" id="match-grid"></div>
        `;
        
        const grid = document.getElementById('match-grid');
        let selectedItem = null;
        let matchedCount = 0;
        let animating = false;
        
        items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.textContent = item.text;
            card.onclick = () => {
                if (animating || card.classList.contains('matched') || card.classList.contains('selected')) return;
                
                if (!selectedItem) {
                    card.classList.add('selected');
                    selectedItem = { el: card, data: item };
                    if (item.type === 'en') speakText(item.text);
                } else {
                    animating = true;
                    if (selectedItem.data.id === item.id && selectedItem.data.type !== item.type) {
                        card.classList.add('selected');
                        sfx.correct();
                        if (item.type === 'en') speakText(item.text);
                        setTimeout(() => {
                            card.classList.remove('selected');
                            card.classList.add('matched');
                            selectedItem.el.classList.remove('selected');
                            selectedItem.el.classList.add('matched');
                            selectedItem = null;
                            matchedCount++;
                            animating = false;
                            if (matchedCount === 6) {
                                sfx.win();
                                shootConfetti();
                                setTimeout(() => {
                                    container.innerHTML = `
                                        <div class="fade-in" style="text-align:center; padding: 2rem;">
                                            <i class="fa-solid fa-star" style="font-size:4rem; color:#f59e0b; margin-bottom:1rem;"></i>
                                            <h3 style="font-size:1.5rem; margin-bottom:1rem;">Hoàn thành xuất sắc!</h3>
                                            <button class="btn btn-primary" onclick="startReviewGame('matching', '${tabId}')"><i class="fa-solid fa-play"></i> Chơi tiếp</button>
                                        </div>
                                    `;
                                }, 300);
                            }
                        }, 400);
                    } else {
                        card.classList.add('error');
                        selectedItem.el.classList.remove('selected');
                        selectedItem.el.classList.add('error');
                        sfx.wrong();
                        if (item.type === 'en') speakText(item.text);
                        setTimeout(() => {
                            card.classList.remove('error');
                            selectedItem.el.classList.remove('error');
                            selectedItem = null;
                            animating = false;
                        }, 500);
                    }
                }
            };
            grid.appendChild(card);
        });
    }

    function initQuizGame(allWords, container) {
        let words = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 10);
        let currentIndex = 0;
        let score = 0;
        
        function renderQuiz() {
            if (currentIndex >= words.length) {
                sfx.win();
                shootConfetti();
                container.innerHTML = `
                    <div class="fade-in" style="text-align:center; padding: 2rem;">
                        <i class="fa-solid fa-award" style="font-size:4rem; color:#10b981; margin-bottom:1rem;"></i>
                        <h3 style="font-size:1.5rem; margin-bottom:0.5rem;">Hoàn thành Quiz!</h3>
                        <p style="font-size:1.2rem; margin-bottom:1.5rem;">Bạn đạt <strong style="color:var(--primary); font-size:1.5rem;">${score} / ${words.length}</strong> điểm.</p>
                        <button class="btn btn-primary" onclick="startReviewGame('quiz', '${tabId}')"><i class="fa-solid fa-rotate-right"></i> Làm lại</button>
                    </div>
                `;
                return;
            }
            
            const currentWord = words[currentIndex];
            let options = [currentWord];
            let distractors = [...allWords].filter(w => w.en !== currentWord.en).sort(() => 0.5 - Math.random()).slice(0, 3);
            options = [...options, ...distractors].sort(() => 0.5 - Math.random());
            
            container.innerHTML = `
                <div class="quiz-container fade-in">
                    <div style="display:flex; justify-content:space-between; margin-bottom:1.2rem; color:var(--text-muted); font-weight:600;">
                        <div>Câu hỏi: <span style="color:var(--text-main);">${currentIndex + 1} / ${words.length}</span></div>
                        <div>Điểm: <span style="color:var(--primary);">${score}</span></div>
                    </div>
                    <div class="quiz-question">Nghĩa tiếng Anh của:<br><span style="color:var(--text-main); font-size:1.6rem; display:block; margin-top:0.75rem;">"${currentWord.vn}"</span></div>
                    <div class="quiz-options">
                        ${options.map((opt, i) => `
                            <div class="quiz-option" data-ans="${opt.en === currentWord.en}">
                                <div style="background:var(--border); border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${['A', 'B', 'C', 'D'][i]}</div>
                                <div>${opt.en}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            const opts = container.querySelectorAll('.quiz-option');
            let answered = false;
            opts.forEach(opt => {
                opt.onclick = () => {
                    if (answered) return;
                    answered = true;
                    const isCorrect = opt.getAttribute('data-ans') === 'true';
                    speakText(opt.querySelector('div:nth-child(2)').textContent);
                    
                    if (isCorrect) {
                        opt.classList.add('correct');
                        sfx.correct();
                        score++;
                    } else {
                        opt.classList.add('wrong');
                        sfx.wrong();
                        opts.forEach(o => {
                            if (o.getAttribute('data-ans') === 'true') o.classList.add('correct');
                        });
                    }
                    
                    setTimeout(() => {
                        currentIndex++;
                        renderQuiz();
                    }, 1500);
                };
            });
        }
        renderQuiz();
    }

    function initSpellingGame(allWords, container) {
        let words = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 10);
        let currentIndex = 0;
        let score = 0;
        
        function renderSpelling() {
            if (currentIndex >= words.length) {
                sfx.win();
                shootConfetti();
                container.innerHTML = `
                    <div class="fade-in" style="text-align:center; padding: 2rem;">
                        <i class="fa-solid fa-medal" style="font-size:4rem; color:#ec4899; margin-bottom:1rem;"></i>
                        <h3 style="font-size:1.5rem; margin-bottom:0.5rem;">Hoàn thành Thử Thách Gõ Từ!</h3>
                        <p style="font-size:1.2rem; margin-bottom:1.5rem;">Bạn gõ đúng <strong style="color:var(--primary); font-size:1.5rem;">${score} / ${words.length}</strong> từ.</p>
                        <button class="btn btn-primary" onclick="startReviewGame('spelling', '${tabId}')"><i class="fa-solid fa-rotate-right"></i> Làm lại</button>
                    </div>
                `;
                return;
            }
            
            const currentWord = words[currentIndex];
            
            container.innerHTML = `
                <div class="quiz-container fade-in" style="max-width: 500px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:1.2rem; color:var(--text-muted); font-weight:600;">
                        <div>Câu hỏi: <span style="color:var(--text-main);">${currentIndex + 1} / ${words.length}</span></div>
                        <div>Điểm: <span style="color:var(--primary);">${score}</span></div>
                    </div>
                    <div class="quiz-question" style="margin-bottom:1.5rem; position:relative;">
                        <div style="color:var(--text-muted); font-size:1rem; margin-bottom:0.5rem;">Nghĩa tiếng Việt:</div>
                        <div style="color:var(--text-main); font-size:1.6rem; margin-bottom:1.5rem; line-height:1.4;">"${currentWord.vn}"</div>
                        <button class="icon-btn" onclick="speakText('${currentWord.en.replace(/'/g, "\\'")}')" style="margin: 0 auto; background:var(--bg-body); width: 45px; height: 45px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Nghe gợi ý"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:1rem;">
                        <input type="text" id="spell-input" placeholder="Gõ tiếng Anh vào đây..." autocomplete="off" spellcheck="false" style="width:100%; padding:1rem 1.5rem; font-size:1.2rem; border-radius:12px; border:2px solid var(--border); background:var(--bg-card); color:var(--text-main); outline:none; transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
                        <div id="spell-error" style="color:#ef4444; font-size:0.9rem; display:none;">Chưa đúng, thử lại nhé!</div>
                        <button class="btn btn-primary" id="spell-btn" style="width:100%; padding:1rem; font-size:1.1rem; background:linear-gradient(135deg, #ec4899, #be185d); border:none;"><i class="fa-solid fa-paper-plane"></i> Kiểm tra</button>
                    </div>
                </div>
            `;
            
            const input = document.getElementById('spell-input');
            const btn = document.getElementById('spell-btn');
            const errorText = document.getElementById('spell-error');
            setTimeout(() => input.focus(), 100);
            
            let attempts = 0;
            
            function checkAnswer() {
                const val = input.value.trim().toLowerCase();
                const correctVal = currentWord.en.toLowerCase();
                
                if (val === correctVal) {
                    sfx.correct();
                    speakText(currentWord.en);
                    input.style.borderColor = '#22c55e';
                    input.style.backgroundColor = '#dcfce7';
                    input.style.color = '#166534';
                    btn.disabled = true;
                    if (attempts === 0) score++;
                    setTimeout(() => {
                        currentIndex++;
                        renderSpelling();
                    }, 1500);
                } else {
                    sfx.wrong();
                    attempts++;
                    input.style.borderColor = '#ef4444';
                    input.classList.add('error');
                    errorText.style.display = 'block';
                    input.value = '';
                    
                    if (attempts >= 3) {
                        errorText.innerHTML = `Đáp án đúng: <strong style="color:#111;">${currentWord.en}</strong>`;
                    }
                    
                    setTimeout(() => {
                        input.classList.remove('error');
                    }, 500);
                }
            }
            
            btn.onclick = checkAnswer;
            input.onkeypress = (e) => {
                if (e.key === 'Enter') checkAnswer();
            };
        }
        renderSpelling();
    }

    } catch(e) {
        alert('JS Error: ' + e.message + '\\nLine: ' + e.lineNumber);
    }
});




window.switchSubTab = function(tabId) {
    document.querySelectorAll('.subtab-pane').forEach(el => el.style.display = 'none');
    const target = document.getElementById('subtab-' + tabId);
    if (target) target.style.display = 'block';
    
    if (window.event && window.event.currentTarget) {
        document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
        window.event.currentTarget.classList.add('active');
    }
};
