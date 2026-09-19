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
        'activities': 'COMMON ACTIVITIES',
        'topics': 'VOCABULARY BY TOPIC',
        'practice-topics': 'LUYỆN TẬP THEO CHỦ ĐỀ'
    };

    // Thuật toán tìm giọng đọc AI tự nhiên nhất (High Quality / Neural / Natural / Siri)
    const getBestNaturalVoice = (voices) => {
        if (!voices || voices.length === 0) return null;
        const enVoices = voices.filter(v => v.lang && (v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().startsWith('us')));
        if (enVoices.length === 0) return null;

        // 1. Ưu tiên cao nhất: Các giọng Neural / Natural / Premium / Enhanced / Siri (Chất lượng phòng thu / người thật)
        const premiumKeywords = ['natural', 'premium', 'enhanced', 'neural', 'siri'];
        for (const kw of premiumKeywords) {
            const match = enVoices.find(v => (v.name && v.name.toLowerCase().includes(kw)) || (v.voiceURI && v.voiceURI.toLowerCase().includes(kw)));
            if (match) return match;
        }

        // 2. Trên iOS (iPhone/iPad): Ưu tiên các giọng hiện đại chất lượng cao của Apple
        const appleModernNames = ['ava', 'evan', 'allison', 'zoe', 'nathan', 'oliver', 'tom', 'nicky', 'daniel', 'serena'];
        for (const name of appleModernNames) {
            const match = enVoices.find(v => v.name && v.name.toLowerCase().includes(name));
            if (match) return match;
        }

        // 3. Trên PC (Microsoft Edge, Windows, Chrome Desktop)
        const pcModernNames = ['guy', 'jenny', 'aria', 'google us english', 'google uk english female'];
        for (const name of pcModernNames) {
            const match = enVoices.find(v => v.name && v.name.toLowerCase().includes(name));
            if (match) return match;
        }

        // 4. Trên Android (Google Speech Services): Ưu tiên giọng network (WaveNet)
        const networkVoice = enVoices.find(v => (v.voiceURI && v.voiceURI.includes('network')) || (v.name && v.name.toLowerCase().includes('network')));
        if (networkVoice) return networkVoice;

        // 5. Lọc bỏ các giọng tổng hợp máy móc cổ điển (Alex, Samantha standard) nếu có giọng khác
        const nonRobotic = enVoices.filter(v => {
            const n = (v.name || '').toLowerCase();
            return !n.includes('alex') && !n.includes('samantha') && !n.includes('fred') && !n.includes('victoria');
        });
        if (nonRobotic.length > 0) {
            return nonRobotic.find(v => v.lang.includes('US') || v.lang.includes('en-US')) || nonRobotic[0];
        }

        return enVoices[0];
    };

    // Quản lý danh sách giọng đọc AI
    const populateVoices = () => {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices() || [];
        const enVoices = voices.filter(v => v.lang && (v.lang.startsWith('en') || v.lang.startsWith('EN')));
        if (enVoices.length === 0) return;
        
        const defaultVoice = getBestNaturalVoice(voices);
        if (defaultVoice && !state.selectedVoiceURI) {
            state.selectedVoiceURI = defaultVoice.voiceURI;
        }

        if (voiceSelect) {
            const currentSelection = state.selectedVoiceURI || voiceSelect.value;
            voiceSelect.innerHTML = '';
            enVoices.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.voiceURI;
                opt.textContent = `${v.name.replace('Microsoft ', '').replace('Online (Natural) - English (United States)', 'US').replace(' - English (United States)', ' US')} (${v.lang})`;
                voiceSelect.appendChild(opt);
            });

            if (currentSelection && voices.some(v => v.voiceURI === currentSelection)) {
                voiceSelect.value = currentSelection;
            } else if (defaultVoice) {
                voiceSelect.value = defaultVoice.voiceURI;
            }
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
        window.addEventListener('touchstart', () => {
            if (window.speechSynthesis && (!window.speechSynthesis.getVoices() || window.speechSynthesis.getVoices().length === 0)) {
                window.speechSynthesis.getVoices();
                populateVoices();
            }
        }, { once: true });
    }

    // Studio Audio Manifest (Real Human Studio Recordings)
    let studioAudioManifest = window.studioAudioManifest || {};
    if (!window.studioAudioManifest) {
        fetch('audio/manifest.json')
            .then(r => r.json())
            .then(data => {
                studioAudioManifest = data;
                window.studioAudioManifest = data;
            })
            .catch(() => {});
    }

    // Classic Computer Browser Speech (Original Pitch 1.25, Rate 1.0, Energetic & Smooth)
    window._activeUtterance = null;
    const speakClassicTTS = (cleanTxt) => {
        if (!('speechSynthesis' in window)) return;
        try {
            if (window._currentAudio) {
                window._currentAudio.pause();
                window._currentAudio.currentTime = 0;
            }
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
            window.speechSynthesis.cancel();
            
            const utt = new SpeechSynthesisUtterance(cleanTxt);
            window._activeUtterance = utt;
            const voices = window.speechSynthesis.getVoices() || [];
            
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
                    bestVoice = voices.find(v => v.name && v.name.includes(name));
                    if (bestVoice) break;
                }
                if (!bestVoice) {
                    bestVoice = voices.find(v => v.lang && (v.lang.startsWith("en-US") || v.lang.startsWith("en-GB")) && v.name && v.name.includes("Male"));
                }
                if (!bestVoice) {
                    bestVoice = voices.find(v => v.lang && (v.lang.startsWith("en-US") || v.lang.startsWith("en-GB")));
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
            utt.rate = 1.0; // Tốc độ chuẩn ban đầu
            utt.pitch = 1.25; // Cao độ sáng, trẻ trung, năng động gốc trên máy tính
            
            utt.onend = () => { window._activeUtterance = null; };
            utt.onerror = () => { window._activeUtterance = null; };

            setTimeout(() => {
                window.speechSynthesis.speak(utt);
                if (window.speechSynthesis.paused) window.speechSynthesis.resume();
            }, 10);
        } catch (e) {
            console.error("Error in classic TTS:", e);
        }
    };

    // Global AI Speech - Hỗ trợ cả 2 chế độ (Giọng Gốc Máy Tính & Giọng Phòng Thu Studio)
    window._currentAudio = null;
    window.speakText = (txt, forcedMode) => {
        if (!state.isAudio) return;

        const mode = forcedMode || state.voiceMode;
        let cleanTxt = (txt || '').replace(/<[^>]*>/g, '').replace(/^→\s*/, '').replace(/[\r\n]+/g, ' ').trim();
        if (!cleanTxt) return;

        if (mode === 'studio') {
            const manifest = window.studioAudioManifest || studioAudioManifest || {};
            const audioPath = manifest[cleanTxt] || manifest[cleanTxt.toLowerCase()];
            if (audioPath) {
                try {
                    if (window._currentAudio) {
                        window._currentAudio.pause();
                        window._currentAudio.currentTime = 0;
                    }
                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                    }
                    const audio = new Audio(audioPath);
                    window._currentAudio = audio;
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(err => {
                            console.warn("Studio audio play blocked, fallback to classic:", err);
                            speakClassicTTS(cleanTxt);
                        });
                    }
                    return;
                } catch (e) {
                    console.warn("Audio tag error:", e);
                }
            }
        }

        // Chế độ 'classic' (Mặc định) hoặc fallback
        speakClassicTTS(cleanTxt);
    };

    // Hàm Nghe Thử & Chọn Chế Độ Giọng
    window.previewVoice = (mode) => {
        const sampleSentence = "Sure. I often play sports in the afternoon whenever I have free time. It allows me to relax after a busy day and stay healthy.";
        window.speakText(sampleSentence, mode);
    };

    window.setVoiceMode = (mode) => {
        state.voiceMode = mode;
        localStorage.setItem('vstep_voice_mode', mode);
        updateVoiceUI();
        window.previewVoice(mode);
    };

    const voiceModeToggle = document.getElementById('voice-mode-toggle');
    const voiceModeLabel = document.getElementById('voice-mode-label');
    const currentVoiceBadge = document.getElementById('current-voice-badge');

    const updateVoiceUI = () => {
        const mode = state.voiceMode;
        if (voiceModeLabel) {
            voiceModeLabel.textContent = mode === 'studio' ? 'Giọng Studio' : 'Giọng Gốc';
        }
        if (currentVoiceBadge) {
            currentVoiceBadge.textContent = mode === 'studio' ? 'Đang dùng: Giọng Phòng Thu Studio' : 'Đang dùng: Giọng Gốc Máy Tính';
            currentVoiceBadge.style.background = mode === 'studio' ? '#8b5cf6' : '#4361ee';
        }
    };

    if (voiceModeToggle) {
        voiceModeToggle.addEventListener('click', () => {
            const nextMode = state.voiceMode === 'studio' ? 'classic' : 'studio';
            window.setVoiceMode(nextMode);
        });
    }
    updateVoiceUI();

    // 1. WELCOME MODAL & STUDENT AUTHENTICATION
    const validStudentsB212 = [
        "Nguyễn Duy Hồng Anh",
        "Nguyễn Ngọc Minh Anh",
        "Nguyễn Lê Mỹ Hân",
        "Nguyễn Hồng Minh Huy",
        "Nguyễn Quốc Khải",
        "Đoàn Nguyễn Đình Khang",
        "Lê Nguyễn Gia Khánh",
        "Nguyễn Hữu Khánh",
        "Hồ Thị Ngọc Lan",
        "Trần Thị Hồng Lỉnh",
        "Võ Thị Triệu Minh",
        "Hứa Đình Nghi",
        "Võ Thị Bảo Ngọc",
        "Lê Tiến Phát",
        "Nguyễn Hoàng Thông",
        "Nguyễn Kim Tiền",
        "Lê Thị Bảo Trân",
        "Võ Thị Diễm Trinh",
        "Nguyễn Tiến Trung",
        "Trần Thị Ánh Tuyết",
        "Đặng Nguyễn Khánh Uyên",
        "Nguyễn Thị Chúc Yến"
    ];

    const normalizeStr = (str) => {
        return (str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
    };

    window.finishLogin = () => {
        const val = state.studentName || studentInput.value.trim();
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
        const partialClasses = ['CB213'];
        const formattedClass = classVal.toUpperCase().replace(/\s+/g, '');
        const normName = normalizeStr(nameVal);

        // Check Teacher access
        const isTeacher = (formattedClass === 'GV' || formattedClass === 'GV2026') && 
                          (normName === 'ptmn' || normName === 'pham thi minh nguyet' || normName === 'minh nguyet');

        if (isTeacher) {
            state.studentName = 'Cô Nguyệt';
            state.accessLevel = 'FULL';
        } else if (formattedClass === 'B212') {
            // Check student list for class B212
            const matchedStudent = validStudentsB212.find(s => {
                return normalizeStr(s) === normName;
            });

            if (!matchedStudent) {
                loginError.textContent = 'Họ và Tên không thuộc danh sách lớp B212. Vui lòng kiểm tra lại!';
                loginError.style.display = 'block';
                return;
            }
            state.studentName = matchedStudent;
            state.accessLevel = 'FULL';
        } else if (validClasses.includes(formattedClass)) {
            state.accessLevel = partialClasses.includes(formattedClass) ? 'PARTIAL' : 'FULL';
        } else {
            loginError.textContent = 'Mã lớp không hợp lệ. Vui lòng nhập lại!';
            loginError.style.display = 'block';
            return;
        }

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
    mobileToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    // Tap outside sidebar to close on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !mobileToggle?.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

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
        if (target === 'topics') {
            const activeBtn = document.querySelector('.sub-tab-btn.active') || document.querySelector('.sub-tab-btn');
            if (activeBtn) {
                const match = activeBtn.getAttribute('onclick')?.match(/switchSubTab\('([^']+)'/);
                const subId = match ? match[1] : 'books';
                window.switchSubTab(subId, activeBtn);
            }
        }
        if (target === 'practice-topics') {
            if (typeof renderPracticeTopic === 'function') {
                const sel = document.getElementById('practice-topic-select');
                const tId = sel ? parseInt(sel.value) : 1;
                renderPracticeTopic(tId);
            }
        }
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.switchTab = function(target) {
        const item = document.querySelector(`.nav-item[data-target="${target}"]`);
        if (item) activateTab(target, item);
    };

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
        "title": "1. Do you often [hoạt động – Vo]?",
        "formula": "→ Sure. I often <strong>[hoạt động – Vo]</strong> <strong>[thời gian]</strong> when I have free time because it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
        "examples": [
            {
                "q": "Do you often <span class='sub-hl'>play sports</span>?",
                "a": "→ Sure. I often play sports in the afternoon when I have free time because it helps me relax after a busy day and stay healthy.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>play sports</strong> <strong>in the afternoon</strong> when I have free time because it helps me <strong>relax after a busy day</strong> and <strong>stay healthy</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>read books</span>?",
                "a": "→ Sure. I often read books in the evening when I have free time because it helps me widen my knowledge and develop my imagination.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>read books</strong> <strong>in the evening</strong> when I have free time because it helps me <strong>widen my knowledge</strong> and <strong>develop my imagination</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>listen to music</span>?",
                "a": "→ Sure. I often listen to music before going to bed when I have free time because it helps me relax after a busy day and sleep better.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>listen to music</strong> <strong>before going to bed</strong> when I have free time because it helps me <strong>relax after a busy day</strong> and <strong>sleep better</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>watch movies</span>?",
                "a": "→ Sure. I often watch movies at weekends when I have free time because it helps me have fun and improve my mood.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>watch movies</strong> <strong>at weekends</strong> when I have free time because it helps me <strong>have fun</strong> and <strong>improve my mood</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>go for a walk</span>?",
                "a": "→ Sure. I often go for a walk in the early morning when I have free time because it helps me stay in good shape and clear my mind.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>go for a walk</strong> <strong>in the early morning</strong> when I have free time because it helps me <strong>stay in good shape</strong> and <strong>clear my mind</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>go shopping</span>?",
                "a": "→ Sure. I often go shopping at weekends when I have free time because it helps me enjoy my free time and forget about my worries.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Sure. I often <strong>go shopping</strong> <strong>at weekends</strong> when I have free time because it helps me <strong>enjoy my free time</strong> and <strong>forget about my worries</strong>.</div>"
            }
        ],
        "exQ": "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>play sports</span>?",
        "exA": "→ Sure. I often play sports in the afternoon when I have free time because it helps me relax after a busy day and stay healthy.",
        "exAFormatted": "→ Sure. I often <span class=\"sub-hl\">play sports</span> <span class=\"sub-hl\">in the afternoon</span> when I have free time because it helps me <span class=\"sub-hl\">relax after a busy day</span> and <span class=\"sub-hl\">stay healthy</span>.",
        "vocab": [
            {
                "type": "time",
                "title": "Cụm Thời gian:",
                "items": [
                    {
                        "en": "in the morning",
                        "vn": "vào buổi sáng"
                    },
                    {
                        "en": "in the afternoon",
                        "vn": "vào buổi chiều"
                    },
                    {
                        "en": "in the evening",
                        "vn": "vào buổi tối"
                    },
                    {
                        "en": "at night",
                        "vn": "vào ban đêm"
                    },
                    {
                        "en": "at weekends",
                        "vn": "vào cuối tuần"
                    },
                    {
                        "en": "on weekdays",
                        "vn": "vào các ngày trong tuần"
                    },
                    {
                        "en": "on my days off",
                        "vn": "vào những ngày nghỉ"
                    },
                    {
                        "en": "in my free time",
                        "vn": "vào thời gian rảnh rỗi"
                    },
                    {
                        "en": "after school / work",
                        "vn": "sau giờ học / làm"
                    }
                ]
            },
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            }
        ]
    },
    {
        "title": "2. Do you often [hoạt động – Vo] while [hoạt động – Ving]?",
        "formula": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>[hoạt động – Vo]</strong> while <strong>[hoạt động – Ving]</strong> because it doesn't affect my concentration. Instead, it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>[hoạt động – Vo]</strong> while <strong>[hoạt động – Ving]</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>[to focus better / do it better / do it more carefully]</strong>.</div>",
        "examples": [
            {
                "q": "Do you often <span class='sub-hl'>listen to music</span> while <span class='sub-hl'>doing homework</span>?",
                "a": "→ Yes, I do. I often listen to music while doing homework because it doesn't affect my concentration. Instead, it helps me focus better and study more effectively.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>listen to music</strong> while <strong>doing homework</strong> because it doesn't affect my concentration. Instead, it helps me <strong>focus better</strong> and <strong>study more effectively</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>listen to music</strong> while <strong>doing homework</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to focus better</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>listen to the radio</span> while <span class='sub-hl'>cooking</span>?",
                "a": "→ Yes, I do. I often listen to the radio while cooking because it doesn't affect my concentration. Instead, it helps me have fun and improve my mood.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>listen to the radio</strong> while <strong>cooking</strong> because it doesn't affect my concentration. Instead, it helps me <strong>have fun</strong> and <strong>improve my mood</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>listen to the radio</strong> while <strong>cooking</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to do it more carefully</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>listen to podcasts</span> while <span class='sub-hl'>exercising</span>?",
                "a": "→ Yes, I do. I often listen to podcasts while exercising because it doesn't affect my concentration. Instead, it helps me learn new things and broaden my knowledge.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>listen to podcasts</strong> while <strong>exercising</strong> because it doesn't affect my concentration. Instead, it helps me <strong>learn new things</strong> and <strong>broaden my knowledge</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>listen to podcasts</strong> while <strong>exercising</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to focus better</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>watch videos</span> while <span class='sub-hl'>eating</span>?",
                "a": "→ Yes, I do. I often watch videos while eating because it doesn't affect my concentration. Instead, it helps me enjoy my free time and relax after a busy day.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>watch videos</strong> while <strong>eating</strong> because it doesn't affect my concentration. Instead, it helps me <strong>enjoy my free time</strong> and <strong>relax after a busy day</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>watch videos</strong> while <strong>eating</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to do it better</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>check social media</span> while <span class='sub-hl'>working</span>?",
                "a": "→ Yes, I do. I often check social media while working because it doesn't affect my concentration. Instead, it helps me reduce stress and refresh my mind.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>check social media</strong> while <strong>working</strong> because it doesn't affect my concentration. Instead, it helps me <strong>reduce stress</strong> and <strong>refresh my mind</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>check social media</strong> while <strong>working</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to focus better</strong>.</div>"
            },
            {
                "q": "Do you often <span class='sub-hl'>chat with friends</span> while <span class='sub-hl'>studying</span>?",
                "a": "→ Yes, I do. I often chat with friends while studying because it doesn't affect my concentration. Instead, it helps me solve problems effectively and study more effectively.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <strong>chat with friends</strong> while <strong>studying</strong> because it doesn't affect my concentration. Instead, it helps me <strong>solve problems effectively</strong> and <strong>study more effectively</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <strong>chat with friends</strong> while <strong>studying</strong> because it’s hard for me to focus. I prefer to do one thing at a time <strong>to focus better</strong>.</div>"
            }
        ],
        "exQ": "Do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>listen to music</span> while <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>doing homework</span>?",
        "exA": "→ Not really. I don’t often listen to music while doing homework because it’s hard for me to focus. I prefer to do one thing at a time to do it better.",
        "exAFormatted": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I do. I often <span class=\"sub-hl\">listen to music</span> while <span class=\"sub-hl\">doing homework</span> because it doesn't affect my concentration. Instead, it helps me <span class=\"sub-hl\">relax</span> and <span class=\"sub-hl\">reduce stress</span>.</div><div><strong>- Trả lời không:</strong> → Not really. I don’t often <span class=\"sub-hl\">listen to music</span> while <span class=\"sub-hl\">doing homework</span> because it’s hard for me to focus. I prefer to do one thing at a time <span class=\"sub-hl\">to do it better</span>.</div>",
        "vocab": [
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            },
            {
                "type": "note",
                "title": "Ghi chú từ vựng trong câu:",
                "items": [
                    {
                        "en": "affect my concentration",
                        "vn": "ảnh hưởng đến sự tập trung của tôi"
                    },
                    {
                        "en": "hard",
                        "vn": "khó khăn"
                    },
                    {
                        "en": "prefer",
                        "vn": "thích hơn / ưu tiên hơn"
                    },
                    {
                        "en": "focus better",
                        "vn": "tập trung tốt hơn"
                    },
                    {
                        "en": "do it better",
                        "vn": "làm tốt hơn"
                    },
                    {
                        "en": "do it more carefully",
                        "vn": "làm cẩn thận hơn"
                    }
                ]
            }
        ]
    },
    {
        "title": "3. Do you like/love/enjoy [hoạt động – Ving]?",
        "formula": "→ Yes, I do. I’m really into <strong>[hoạt động – Ving]</strong> because it’s very <strong>[tính từ mô tả hoạt động]</strong>. It helps me <strong>[lợi ích]</strong> and makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
        "examples": [
            {
                "q": "Do you like <span class='sub-hl'>reading books</span>?",
                "a": "→ Yes, I do. I’m really into listening to music because it’s very relaxing. It helps me reduce stress and makes me feel comfortable.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>listening to music</strong> because it’s very <strong>relaxing</strong>. It helps me <strong>reduce stress</strong> and makes me feel <strong>comfortable</strong>.</div>"
            },
            {
                "q": "Do you like <span class='sub-hl'>traveling</span>?",
                "a": "→ Yes, I do. I’m really into reading books because it’s very interesting. It helps me widen my knowledge and makes me feel inspired.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>reading books</strong> because it’s very <strong>interesting</strong>. It helps me <strong>widen my knowledge</strong> and makes me feel <strong>inspired</strong>.</div>"
            },
            {
                "q": "Do you love <span class='sub-hl'>playing musical instruments</span>?",
                "a": "→ Yes, I do. I’m really into playing sports because it’s very beneficial. It helps me stay in good shape and makes me feel energized.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>playing sports</strong> because it’s very <strong>beneficial</strong>. It helps me <strong>stay in good shape</strong> and makes me feel <strong>energized</strong>.</div>"
            },
            {
                "q": "Do you enjoy <span class='sub-hl'>cooking</span>?",
                "a": "→ Yes, I do. I’m really into traveling because it’s very exciting. It helps me have new experiences and makes me feel refreshed.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>traveling</strong> because it’s very <strong>exciting</strong>. It helps me <strong>have new experiences</strong> and makes me feel <strong>refreshed</strong>.</div>"
            },
            {
                "q": "Do you like <span class='sub-hl'>hanging out with your friends</span>?",
                "a": "→ Yes, I do. I’m really into cooking because it’s very creative. It helps me learn new skills and makes me feel satisfied.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>cooking</strong> because it’s very <strong>creative</strong>. It helps me <strong>learn new skills</strong> and makes me feel <strong>satisfied</strong>.</div>"
            },
            {
                "q": "Do you love <span class='sub-hl'>doing volunteer work</span>?",
                "a": "→ Yes, I do. I’m really into swimming because it’s very refreshing. It helps me stay healthy and makes me feel energetic.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I do. I’m really into <strong>swimming</strong> because it’s very <strong>refreshing</strong>. It helps me <strong>stay healthy</strong> and makes me feel <strong>energetic</strong>.</div>"
            }
        ],
        "exQ": "Do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>reading books</span>?",
        "exA": "→ Yes, I do. I’m really into reading books because it’s very interesting. It helps me reduce stress and makes me feel relaxed.",
        "exAFormatted": "→ Yes, I do. I’m really into <span class=\"sub-hl\">reading books</span> because it’s very <span class=\"sub-hl\">interesting</span>. It helps me <span class=\"sub-hl\">reduce stress</span> and makes me feel <span class=\"sub-hl\">relaxed</span>.",
        "vocab": [
            {
                "type": "note",
                "title": "Ghi chú từ vựng trong câu:",
                "items": [
                    {
                        "en": "really into",
                        "vn": "rất thích / đam mê"
                    }
                ]
            },
            {
                "type": "activity",
                "title": "Tính từ mô tả hoạt động:",
                "items": [
                    {
                        "en": "interesting",
                        "vn": "thú vị"
                    },
                    {
                        "en": "exciting",
                        "vn": "hào hứng / tuyệt vời"
                    },
                    {
                        "en": "relaxing",
                        "vn": "mang lại cảm giác thư giãn"
                    },
                    {
                        "en": "fun / enjoyable",
                        "vn": "vui vẻ / thích thú"
                    },
                    {
                        "en": "useful / beneficial",
                        "vn": "hữu ích / có ích"
                    },
                    {
                        "en": "meaningful",
                        "vn": "có ý nghĩa"
                    },
                    {
                        "en": "challenging",
                        "vn": "đầy thử thách"
                    },
                    {
                        "en": "fascinating",
                        "vn": "hấp dẫn / lôi cuốn"
                    },
                    {
                        "en": "great / wonderful",
                        "vn": "tuyệt vời"
                    }
                ]
            },
            {
                "type": "emotion",
                "title": "Tính từ mô tả cảm xúc:",
                "items": [
                    {
                        "en": "excited",
                        "vn": "hào hứng / phấn khích"
                    },
                    {
                        "en": "happy",
                        "vn": "vui vẻ / hạnh phúc"
                    },
                    {
                        "en": "relaxed",
                        "vn": "thư thái / thoải mái"
                    },
                    {
                        "en": "confident",
                        "vn": "tự tin"
                    },
                    {
                        "en": "refreshed",
                        "vn": "sảng khoái"
                    },
                    {
                        "en": "motivated",
                        "vn": "có động lực"
                    },
                    {
                        "en": "comfortable",
                        "vn": "dễ chịu"
                    },
                    {
                        "en": "energetic",
                        "vn": "tràn đầy năng lượng"
                    }
                ]
            },
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            }
        ]
    },
    {
        "title": "4. Did you often [hoạt động – Vo] when you were a child?",
        "formula": "→ Yes, I did. I used to <strong>[hoạt động – Vo]</strong> every day when I was a child because it was <strong>[tính từ mô tả hoạt động]</strong>. It was a good way for me to <strong>[lợi ích]</strong>.",
        "examples": [
            {
                "q": "Did you often <span class='sub-hl'>watch cartoons</span> when you were a child?",
                "a": "→ Yes, I did. I used to watch cartoons every day when I was a child because it was entertaining. It was a good way for me to enjoy my free time.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>watch cartoons</strong> every day when I was a child because it was <strong>entertaining</strong>. It was a good way for me to <strong>enjoy my free time</strong>.</div>"
            },
            {
                "q": "Did you often <span class='sub-hl'>play outside</span> when you were a child?",
                "a": "→ Yes, I did. I used to play outside every day when I was a child because it was exciting. It was a good way for me to make new friends.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>play outside</strong> every day when I was a child because it was <strong>exciting</strong>. It was a good way for me to <strong>make new friends</strong>.</div>"
            },
            {
                "q": "Did you often <span class='sub-hl'>read books</span> when you were a child?",
                "a": "→ Yes, I did. I used to read comic books every day when I was a child because it was interesting. It was a good way for me to develop my imagination.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>read comic books</strong> every day when I was a child because it was <strong>interesting</strong>. It was a good way for me to <strong>develop my imagination</strong>.</div>"
            },
            {
                "q": "Did you often <span class='sub-hl'>ride a bike</span> when you were a child?",
                "a": "→ Yes, I did. I used to ride a bicycle every day when I was a child because it was fun. It was a good way for me to stay healthy.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>ride a bicycle</strong> every day when I was a child because it was <strong>fun</strong>. It was a good way for me to <strong>stay healthy</strong>.</div>"
            },
            {
                "q": "Did you often <span class='sub-hl'>play video games</span> when you were a child?",
                "a": "→ Yes, I did. I used to play video games every day when I was a child because it was thrilling. It was a good way for me to relax after school.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>play video games</strong> every day when I was a child because it was <strong>thrilling</strong>. It was a good way for me to <strong>relax after school</strong>.</div>"
            },
            {
                "q": "Did you often <span class='sub-hl'>visit your grandparents</span> when you were a child?",
                "a": "→ Yes, I did. I used to visit my grandparents every weekend when I was a child because it was meaningful. It was a good way for me to spend time with family.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Yes, I did. I used to <strong>visit my grandparents</strong> every weekend when I was a child because it was <strong>meaningful</strong>. It was a good way for me to <strong>spend time with family</strong>.</div>"
            }
        ],
        "exQ": "Did you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>watch cartoons</span> when you were a child?",
        "exA": "→ Yes, I did. I used to watch cartoons every day when I was a child because it was very entertaining. It was a good way for me to enjoy my free time.",
        "exAFormatted": "→ Yes, I did. I used to <span class=\"sub-hl\">watch cartoons</span> every day when I was a child because it was <span class=\"sub-hl\">very entertaining</span>. It was a good way for me to <span class=\"sub-hl\">enjoy my free time</span>.",
        "vocab": [
            {
                "type": "note",
                "title": "Ghi chú từ vựng trong câu:",
                "items": [
                    {
                        "en": "used to",
                        "vn": "đã từng / thường làm trong quá khứ"
                    }
                ]
            },
            {
                "type": "activity",
                "title": "Tính từ mô tả hoạt động:",
                "items": [
                    {
                        "en": "interesting",
                        "vn": "thú vị"
                    },
                    {
                        "en": "exciting",
                        "vn": "hào hứng / tuyệt vời"
                    },
                    {
                        "en": "relaxing",
                        "vn": "mang lại cảm giác thư giãn"
                    },
                    {
                        "en": "fun / enjoyable",
                        "vn": "vui vẻ / thích thú"
                    },
                    {
                        "en": "useful / beneficial",
                        "vn": "hữu ích / có ích"
                    },
                    {
                        "en": "meaningful",
                        "vn": "có ý nghĩa"
                    },
                    {
                        "en": "challenging",
                        "vn": "đầy thử thách"
                    },
                    {
                        "en": "fascinating",
                        "vn": "hấp dẫn / lôi cuốn"
                    },
                    {
                        "en": "great / wonderful",
                        "vn": "tuyệt vời"
                    }
                ]
            },
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            }
        ]
    },
    {
        "title": "5. Are you good at [hoạt động – Ving]?",
        "formula": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>[hoạt động – Ving]</strong> because I practice it a lot. It helps me <strong>[lợi ích]</strong>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <strong>[hoạt động – Ving]</strong> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <strong>[hoạt động – Ving]</strong> because I don't practice it much. However, I would like to try it in the future because I think it's <strong>[tính từ mô tả hoạt động]</strong>.</div>",
        "examples": [
            {
                "q": "Are you good at <span class='sub-hl'>cooking</span>?",
                "a": "→ Yes, I am. I’m quite good at cooking because I practice it regularly. It helps me prepare healthy meals and save money.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>cooking</strong> because I practice it regularly. It helps me <strong>prepare healthy meals</strong> and <strong>save money</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I’m not very good at <strong>cooking</strong> because I don’t have much experience with it. However, I’m trying to improve by <strong>cooking at home more often</strong>.</div>"
            },
            {
                "q": "Are you good at <span class='sub-hl'>speaking English</span>?",
                "a": "→ Yes, I am. I’m quite good at playing sports because I practice it regularly. It helps me stay in good shape and reduce stress.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>playing sports</strong> because I practice it regularly. It helps me <strong>stay in good shape</strong> and <strong>reduce stress</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I’m not very good at <strong>playing sports</strong> because I don’t have much experience with it. However, I’m trying to improve by <strong>practicing every week</strong>.</div>"
            },
            {
                "q": "Are you good at <span class='sub-hl'>playing sports</span>?",
                "a": "→ Yes, I am. I’m quite good at drawing because I practice it regularly. It helps me enhance my creativity and relax after a busy day.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>drawing</strong> because I practice it regularly. It helps me <strong>enhance my creativity</strong> and <strong>relax after a busy day</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I’m not very good at <strong>drawing</strong> because I don’t have much experience with it. However, I’m trying to improve by <strong>taking an online drawing class</strong>.</div>"
            },
            {
                "q": "Are you good at <span class='sub-hl'>using computers</span>?",
                "a": "→ Yes, I am. I’m quite good at singing because I practice it regularly. It helps me improve my mood and feel confident.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>singing</strong> because I practice it regularly. It helps me <strong>improve my mood</strong> and <strong>feel confident</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I’m not very good at <strong>singing</strong> because I don’t have much experience with it. However, I’m trying to improve by <strong>singing along to my favorite songs</strong>.</div>"
            },
            {
                "q": "Are you good at <span class='sub-hl'>singing</span>?",
                "a": "→ Yes, I am. I’m quite good at swimming because I practice it regularly. It helps me stay healthy and build my stamina.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>swimming</strong> because I practice it regularly. It helps me <strong>stay healthy</strong> and <strong>build my stamina</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I’m not very good at <strong>swimming</strong> because I don’t have much experience with it. However, I’m trying to improve by <strong>going to the pool every weekend</strong>.</div>"
            },
            {
                "q": "Are you good at <span class='sub-hl'>drawing or painting</span>?",
                "a": "→ Yes, I am. I’m quite good at public speaking because I practice it regularly. It helps me express my ideas clearly and build my confidence.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <strong>public speaking</strong> because I practice it regularly. It helps me <strong>express my ideas clearly</strong> and <strong>build my confidence</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. I’m not very good at <strong>public speaking</strong> because I don’t have much experience with it. However, I’m trying to improve by <strong>practicing speaking in front of a mirror</strong>.</div>"
            }
        ],
        "exQ": "Are you good at <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>cooking</span>?",
        "exA": "→ Yes, I am. I’m quite good at cooking because I practice it a lot. It helps me save money and stay healthy.",
        "exAFormatted": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, I am. I’m quite good at <span class=\"sub-hl\">cooking</span> because I practice it a lot. It helps me <span class=\"sub-hl\">save money</span> and <span class=\"sub-hl\">stay healthy</span>.</div><div style='margin-bottom: 4px;'><strong>- Trả lời không:</strong></div><div style='margin-left: 15px; margin-bottom: 8px;'><strong>+ Cách 1:</strong> → No, I’m not. I’m not very good at <span class=\"sub-hl\">cooking</span> because I rarely do it. I prefer to spend time on other things.</div><div style='margin-left: 15px;'><strong>+ Cách 2:</strong> → Not really. I’m not very good at <span class=\"sub-hl\">cooking</span> because I don't practice it much. However, I would like to try it in the future because I think it's <span class=\"sub-hl\">interesting</span>.</div>",
        "vocab": [
            {
                "type": "note",
                "title": "Cụm từ hay:",
                "items": [
                    {
                        "en": "quite good at",
                        "vn": "khá giỏi về..."
                    },
                    {
                        "en": "practice a lot",
                        "vn": "luyện tập rất nhiều"
                    },
                    {
                        "en": "rarely do it",
                        "vn": "hiếm khi làm"
                    },
                    {
                        "en": "spend time on other things",
                        "vn": "dành thời gian cho việc khác"
                    }
                ]
            },
            {
                "type": "activity",
                "title": "Tính từ mô tả hoạt động:",
                "items": [
                    {
                        "en": "interesting",
                        "vn": "thú vị"
                    },
                    {
                        "en": "exciting",
                        "vn": "hào hứng / tuyệt vời"
                    },
                    {
                        "en": "relaxing",
                        "vn": "mang lại cảm giác thư giãn"
                    },
                    {
                        "en": "fun / enjoyable",
                        "vn": "vui vẻ / thích thú"
                    },
                    {
                        "en": "useful / beneficial",
                        "vn": "hữu ích / có ích"
                    },
                    {
                        "en": "meaningful",
                        "vn": "có ý nghĩa"
                    },
                    {
                        "en": "challenging",
                        "vn": "đầy thử thách"
                    },
                    {
                        "en": "fascinating",
                        "vn": "hấp dẫn / lôi cuốn"
                    },
                    {
                        "en": "great / wonderful",
                        "vn": "tuyệt vời"
                    }
                ]
            },
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            }
        ]
    },
    {
        "title": "6. Are/Is [...] important to you?",
        "formula": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <strong>[chủ đề]</strong> is very important to me because it helps me <strong>[lợi ích 1]</strong>. It’s also a good way to <strong>[lợi ích 2]</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>[chủ đề]</strong> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>",
        "examples": [
            {
                "q": "Is <span class='sub-hl'>family</span> important to you?",
                "a": "→ Sure. Family is very important to me because it helps me feel safe and happy. It also gives me great support.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. <strong>Family</strong> is very important to me because it helps me <strong>feel safe and happy</strong>. It also <strong>gives me great support</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>Family</strong> isn’t very important to me right now because I’m focusing on other priorities. Instead, I prefer to spend my time on <strong>my career</strong>.</div>"
            },
            {
                "q": "Is <span class='sub-hl'>music</span> important to you?",
                "a": "→ Sure. Money is very important to me because it helps me pay for daily expenses and prepare for the future.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. <strong>Money</strong> is very important to me because it helps me <strong>pay for daily expenses</strong> and <strong>prepare for the future</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>Money</strong> isn’t very important to me right now because happiness matters more. Instead, I prefer to spend my time on <strong>my hobbies</strong>.</div>"
            },
            {
                "q": "Are <span class='sub-hl'>hobbies</span> important to you?",
                "a": "→ Sure. Friends are very important to me because they help me share life experiences and reduce stress.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. <strong>Friends</strong> are very important to me because they help me <strong>share life experiences</strong> and <strong>reduce stress</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>Friends</strong> aren’t very important to me right now because I prefer spending time alone. Instead, I prefer to spend my time on <strong>reading books</strong>.</div>"
            },
            {
                "q": "Are <span class='sub-hl'>soft skills</span> important to you?",
                "a": "→ Sure. Health is very important to me because it helps me stay active and enjoy my daily life.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. <strong>Health</strong> is very important to me because it helps me <strong>stay active</strong> and <strong>enjoy my daily life</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>Health</strong> isn’t something I worry about too much yet. Instead, I prefer to spend my time on <strong>studying</strong>.</div>"
            },
            {
                "q": "Is <span class='sub-hl'>health</span> important to you?",
                "a": "→ Sure. English is very important to me because it helps me widen my knowledge and find better job opportunities.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. <strong>English</strong> is very important to me because it helps me <strong>widen my knowledge</strong> and <strong>find better job opportunities</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>English</strong> isn’t very important for my current job. Instead, I prefer to spend my time on <strong>other skills</strong>.</div>"
            },
            {
                "q": "Is <span class='sub-hl'>friendship</span> important to you?",
                "a": "→ Sure. Free time is very important to me because it helps me relax after a busy day and spend time with my loved ones.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. <strong>Free time</strong> is very important to me because it helps me <strong>relax after a busy day</strong> and <strong>spend time with my loved ones</strong>.</div><div><strong>- Trả lời không:</strong> → Not really. <strong>Free time</strong> isn’t very important right now because I prefer staying busy with work. Instead, I prefer to spend my time on <strong>my projects</strong>.</div>"
            }
        ],
        "exQ": "Is <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>eating healthy</span> important to you?",
        "exA": "→ Yes, it is. Eating healthy is very important to me because it helps me improve my health. It is also a good way to have a better life.",
        "exAFormatted": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Yes, it is. <span class=\"sub-hl\">Eating healthy</span> is very important to me because it helps me <span class=\"sub-hl\">improve my health</span>. It is also a good way to <span class=\"sub-hl\">have a better life</span>.</div><div><strong>- Trả lời không:</strong> → Not really. <span class=\"sub-hl\">Eating healthy</span> is not very important to me because it doesn't affect my daily life much. I prefer to focus on other things.</div>",
        "vocab": [
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            },
            {
                "type": "note",
                "title": "Ghi chú từ vựng:",
                "items": [
                    {
                        "en": "important to me",
                        "vn": "quan trọng đối với tôi"
                    },
                    {
                        "en": "doesn't affect my daily life much",
                        "vn": "không ảnh hưởng nhiều đến cuộc sống hàng ngày"
                    },
                    {
                        "en": "prefer to focus on other things",
                        "vn": "thích tập trung vào những thứ khác hơn"
                    },
                    {
                        "en": "improve my health",
                        "vn": "cải thiện sức khỏe"
                    },
                    {
                        "en": "have a better life",
                        "vn": "có cuộc sống tốt đẹp hơn"
                    }
                ]
            }
        ]
    },
    {
        "title": "7. Have you ever [hoạt động – V3/ed]?",
        "formula": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <strong>[hoạt động – V3/ed]</strong> before, and it was a/an <strong>[tính từ]</strong> experience. It helped me <strong>[lợi ích]</strong>.</div><div><strong>- Trả lời không:</strong> → No, I have never <strong>[hoạt động – V3/ed]</strong> before because I don't have the chance. But I would like to try it in the future if possible.</div>",
        "examples": [
            {
                "q": "Have you ever <span class='sub-hl'>attended a live concert</span>?",
                "a": "→ Yes, I have. I attended a live concert a few months ago, and it was very exciting. It helped me have fun and enjoy my free time.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời rồi:</strong> → Yes, I have. I <strong>attended a live concert</strong> a few months ago, and it was very <strong>exciting</strong>. It helped me <strong>have fun</strong> and <strong>enjoy my free time</strong>.</div><div><strong>- Trả lời chưa:</strong> → Not yet. I haven’t had the chance to <strong>attend a live concert</strong> yet. However, I’d love to try it in the future because I think it would be a <strong>wonderful</strong> experience.</div>"
            },
            {
                "q": "Have you ever <span class='sub-hl'>traveled abroad</span>?",
                "a": "→ Yes, I have. I traveled abroad last summer, and it was very memorable. It helped me explore new cultures and widen my knowledge.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời rồi:</strong> → Yes, I have. I <strong>traveled abroad</strong> last summer, and it was very <strong>memorable</strong>. It helped me <strong>explore new cultures</strong> and <strong>widen my knowledge</strong>.</div><div><strong>- Trả lời chưa:</strong> → Not yet. I haven’t had the chance to <strong>travel abroad</strong> yet. However, I’d love to try it in the future because I think it would be an <strong>unforgettable</strong> experience.</div>"
            },
            {
                "q": "Have you ever <span class='sub-hl'>tried Vietnamese food</span>?",
                "a": "→ Yes, I have. I tried extreme sports a while ago, and it was very thrilling. It helped me overcome my fear and build my confidence.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời rồi:</strong> → Yes, I have. I <strong>tried extreme sports</strong> a while ago, and it was very <strong>thrilling</strong>. It helped me <strong>overcome my fear</strong> and <strong>build my confidence</strong>.</div><div><strong>- Trả lời chưa:</strong> → Not yet. I haven’t had the chance to <strong>try extreme sports</strong> yet. However, I’d love to try it in the future because I think it would be an <strong>exciting</strong> experience.</div>"
            },
            {
                "q": "Have you ever <span class='sub-hl'>learned to play a musical instrument</span>?",
                "a": "→ Yes, I have. I joined a volunteer program last year, and it was very meaningful. It helped me help people in need and learn useful life lessons.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời rồi:</strong> → Yes, I have. I <strong>joined a volunteer program</strong> last year, and it was very <strong>meaningful</strong>. It helped me <strong>help people in need</strong> and <strong>learn useful life lessons</strong>.</div><div><strong>- Trả lời chưa:</strong> → Not yet. I haven’t had the chance to <strong>join a volunteer program</strong> yet. However, I’d love to try it in the future because I think it would be a <strong>rewarding</strong> experience.</div>"
            },
            {
                "q": "Have you ever <span class='sub-hl'>done volunteer work</span>?",
                "a": "→ Yes, I have. I spoke in public at school a few weeks ago, and it was very challenging. It helped me improve my presentation skills and become more confident.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời rồi:</strong> → Yes, I have. I <strong>spoke in public</strong> at school a few weeks ago, and it was very <strong>challenging</strong>. It helped me <strong>improve my presentation skills</strong> and <strong>become more confident</strong>.</div><div><strong>- Trả lời chưa:</strong> → Not yet. I haven’t had the chance to <strong>speak in public</strong> yet. However, I’d love to try it in the future because I think it would be a <strong>valuable</strong> experience.</div>"
            },
            {
                "q": "Have you ever <span class='sub-hl'>given a public speech</span>?",
                "a": "→ Yes, I have. I cooked for a large group during a family reunion, and it was very rewarding. It helped me improve my cooking skills and bring happiness to others.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời rồi:</strong> → Yes, I have. I <strong>cooked for a large group</strong> during a family reunion, and it was very <strong>rewarding</strong>. It helped me <strong>improve my cooking skills</strong> and <strong>bring happiness to others</strong>.</div><div><strong>- Trả lời chưa:</strong> → Not yet. I haven’t had the chance to <strong>cook for a large group</strong> yet. However, I’d love to try it in the future because I think it would be an <strong>interesting</strong> experience.</div>"
            }
        ],
        "exQ": "Have you ever <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>traveled abroad</span>?",
        "exA": "→ Sure. I have traveled abroad before, and it was an exciting experience. It helped me learn new things.",
        "exAFormatted": "<div style='margin-bottom: 8px;'><strong>- Trả lời có:</strong> → Sure. I have <span class=\"sub-hl\">traveled abroad</span> before, and it was an <span class=\"sub-hl\">exciting</span> experience. It helped me <span class=\"sub-hl\">learn new things</span>.</div><div><strong>- Trả lời không:</strong> → No, I have never <span class=\"sub-hl\">traveled abroad</span> before because I don't have the chance. But I would like to try it in the future if possible.</div>",
        "vocab": [
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            },
            {
                "type": "activity",
                "title": "Tính từ mô tả trải nghiệm:",
                "items": [
                    {
                        "en": "exciting",
                        "vn": "hào hứng / thú vị"
                    },
                    {
                        "en": "amazing",
                        "vn": "tuyệt vời"
                    },
                    {
                        "en": "unforgettable",
                        "vn": "không thể nào quên"
                    },
                    {
                        "en": "interesting",
                        "vn": "thú vị"
                    },
                    {
                        "en": "memorable",
                        "vn": "đáng nhớ"
                    },
                    {
                        "en": "wonderful",
                        "vn": "tuyệt vời"
                    },
                    {
                        "en": "incredible",
                        "vn": "đáng kinh ngạc / tuyệt vời"
                    }
                ]
            }
        ]
    }
];

    window.formatTitleHighlight = (title) => {
        if (!title) return '';
        return title
            .replace(/\s+\?/g, '?')
            .replace(/\[(.*?)\]/g, '<span class="title-bracket-hl">[$1]</span>');
    };

    window.formatFormulaHighlight = (formHtml) => {
        if (!formHtml) return '';
        let res = formHtml.replace(/<strong>\s*\[(.*?)\]\s*<\/strong>/g, "[$1]");
        return res.replace(/\[(.*?)\]/g, '<span class="formula-bracket-hl">[$1]</span>');
    };

    window.getExamplesBlockHTML = (item) => {
        if (!item || !item.examples || !item.examples.length) return '';
        
        return `
            <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #f59e0b; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px -2px rgba(245, 158, 11, 0.15);">
                <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(245, 158, 11, 0.08);">
                    <div class="acc-title" style="color:#d97706; font-size:1.05rem; font-weight: 700;">
                        <i class="fa-solid fa-list-ul"></i> CÁC CÂU HỎI VÍ DỤ (${item.examples.length} câu)
                    </div>
                    <div class="acc-toggle" style="background:#d97706;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem ví dụ ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                </div>
                <div class="accordion-content" onclick="event.stopPropagation()" style="padding: 1rem 1.25rem;">
                    <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                        ${item.examples.map((ex, idx) => `
                            <div class="example-q-item" style="background: var(--bg-card, #ffffff); border: 1px solid rgba(245, 158, 11, 0.25); border-left: 4px solid #f59e0b; padding: 0.85rem 1rem; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; gap: 0.85rem; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: all 0.2s ease;">
                                <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #fef3c7; color: #b45309; font-weight: 800; font-size: 0.85rem; flex-shrink: 0; border: 1px solid rgba(245, 158, 11, 0.3);">${idx + 1}</span>
                                    <span style="font-size: 1.05rem; color: var(--text-main); font-weight: 500; line-height: 1.5;">${ex.q}</span>
                                </div>
                                <button class="icon-btn" style="width: 34px; height: 34px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); color: #d97706; font-size: 0.95rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(245, 158, 11, 0.25); transition: all 0.2s;" onclick="event.stopPropagation(); speakText('${ex.q.replace(/<[^>]+>/g, '').replace(/'/g, "\\'")}')" title="Nghe phát âm câu hỏi">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
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
                <div class="f-title" style="margin-bottom:1.5rem;">${formatTitleHighlight(d.title)}</div>
                ${getExamplesBlockHTML(d)}
                
                <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);">
                    <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(59, 130, 246, 0.08);">
                        <div class="acc-title" style="color:#2563eb; font-size:1.05rem;"><i class="fa-solid fa-lightbulb"></i> GỢI Ý CÂU TRẢ LỜI</div>
                        <div class="acc-toggle" style="background:#2563eb;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem gợi ý câu trả lời ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                    </div>
                    <div class="accordion-content" onclick="event.stopPropagation()">
                        <div class="f-formula-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">${formatFormulaHighlight(d.formula)}</div>
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
    "opt1": {
        "title": "✅ PHƯƠNG ÁN 1 – CHỌN 1 TRONG 2",
        "form": "→ I prefer <strong>[lựa chọn – noun/Ving]</strong> because it’s more <strong>[tính từ mô tả lựa chọn]</strong> and helps me <strong>[lợi ích]</strong>. It also makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span>",
        "examples": [
            {
                "q": "Do you prefer <span class='sub-hl'>studying at home</span> or <span class='sub-hl'>in the library</span>?",
                "a": "→ I prefer studying at home because it’s more comfortable and helps me save time. It also makes me feel relaxed.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>studying at home</strong> because it’s more <strong>comfortable</strong> and helps me <strong>save time</strong>. It also makes me feel <strong>relaxed</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
            },
            {
                "q": "Do you prefer <span class='sub-hl'>paper books</span> or <span class='sub-hl'>e-books</span>?",
                "a": "→ I prefer paper books because they are more convenient and help me protect my eyesight. They also make me feel focused.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>paper books</strong> because they are more <strong>convenient</strong> and help me <strong>protect my eyesight</strong>. They also make me feel <strong>focused</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
            },
            {
                "q": "Do you prefer <span class='sub-hl'>traveling alone</span> or <span class='sub-hl'>with friends</span>?",
                "a": "→ I prefer traveling with friends because it’s more exciting and helps me share good memories. It also makes me feel joyful.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>traveling with friends</strong> because it’s more <strong>exciting</strong> and helps me <strong>share good memories</strong>. It also makes me feel <strong>joyful</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
            },
            {
                "q": "Do you prefer <span class='sub-hl'>watching movies at home</span> or <span class='sub-hl'>at the cinema</span>?",
                "a": "→ I prefer watching movies at the cinema because it’s more thrilling and helps me enjoy great sound effects. It also makes me feel impressed.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>watching movies at the cinema</strong> because it’s more <strong>thrilling</strong> and helps me <strong>enjoy great sound effects</strong>. It also makes me feel <strong>impressed</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
            },
            {
                "q": "Do you prefer <span class='sub-hl'>shopping online</span> or <span class='sub-hl'>in traditional stores</span>?",
                "a": "→ I prefer online shopping because it’s more convenient and helps me save time. It also makes me feel satisfied.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>online shopping</strong> because it’s more <strong>convenient</strong> and helps me <strong>save time</strong>. It also makes me feel <strong>satisfied</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
            },
            {
                "q": "Do you prefer <span class='sub-hl'>living in a big city</span> or <span class='sub-hl'>in the countryside</span>?",
                "a": "→ I prefer cooking at home because it’s more healthy and helps me save money. It also makes me feel safe.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I prefer <strong>cooking at home</strong> because it’s more <strong>healthy</strong> and helps me <strong>save money</strong>. It also makes me feel <strong>safe</strong>.<br/><br/><span style='color: #ef4444; font-size: 0.95em;'><i class='fa-solid fa-circle-exclamation'></i> <strong>LƯU Ý:</strong> Nếu không kịp nói câu mô tả cảm xúc thì tăng lợi ích.</span></div>"
            }
        ],
        "exQ": "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying at home</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying in the library</span>?",
        "exA": "→ I prefer studying at home because it’s more convenient and helps me save time. It also makes me feel comfortable.",
        "exAFormatted": "→ I prefer <span class=\"sub-hl\">studying at home</span> because it’s more <span class=\"sub-hl\">convenient</span> and helps me <span class=\"sub-hl\">save time</span>. It also makes me feel <span class=\"sub-hl\">comfortable</span>.",
        "audio": "I prefer studying at home because it’s more convenient and helps me save time. It also makes me feel comfortable.",
        "vocab": [
            {
                "type": "benefit",
                "title": "Tính từ mô tả lựa chọn:",
                "items": [
                    {
                        "en": "convenient",
                        "vn": "tiện lợi, thuận tiện"
                    },
                    {
                        "en": "comfortable",
                        "vn": "thoải mái"
                    },
                    {
                        "en": "interesting",
                        "vn": "thú vị"
                    },
                    {
                        "en": "relaxing",
                        "vn": "thư giãn"
                    },
                    {
                        "en": "useful",
                        "vn": "hữu ích"
                    }
                ]
            },
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
                ]
            },
            {
                "type": "emotion",
                "title": "Tính từ mô tả cảm xúc:",
                "items": [
                    {
                        "en": "excited",
                        "vn": "hào hứng / phấn khích"
                    },
                    {
                        "en": "happy",
                        "vn": "vui vẻ / hạnh phúc"
                    },
                    {
                        "en": "relaxed",
                        "vn": "thư thái / thoải mái"
                    },
                    {
                        "en": "confident",
                        "vn": "tự tin"
                    },
                    {
                        "en": "refreshed",
                        "vn": "sảng khoái"
                    },
                    {
                        "en": "motivated",
                        "vn": "có động lực"
                    },
                    {
                        "en": "comfortable",
                        "vn": "dễ chịu"
                    },
                    {
                        "en": "energetic",
                        "vn": "tràn đầy năng lượng"
                    }
                ]
            }
        ]
    },
    "opt2": {
        "title": "✅ PHƯƠNG ÁN 2 – CÂN NHẮC CẢ 2 PHƯƠNG ÁN (Nâng cao)",
        "form": "→ It’s hard to choose because both are important. <strong>[A]</strong> helps me <strong>[lợi ích A]</strong>, while <strong>[B]</strong> allows me to <strong>[lợi ích B]</strong>.",
        "examples": [
            {
                "q": "Which is more important, <span class='sub-hl'>money</span> or <span class='sub-hl'>happiness</span>?",
                "a": "→ It’s hard to choose because both are important. Family helps me escape from daily stress, while money allows me to prepare for the future.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Family</strong> helps me <strong>escape from daily stress</strong>, while <strong>money</strong> allows me to <strong>prepare for the future</strong>.</div>"
            },
            {
                "q": "Which is more important, <span class='sub-hl'>family</span> or <span class='sub-hl'>work</span>?",
                "a": "→ It’s hard to choose because both are important. Career helps me develop useful skills, while family allows me to escape from daily stress.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Career</strong> helps me <strong>develop useful skills</strong>, while <strong>family</strong> allows me to <strong>escape from daily stress</strong>.</div>"
            },
            {
                "q": "Which is more important, <span class='sub-hl'>practical skills</span> or <span class='sub-hl'>academic knowledge</span>?",
                "a": "→ It’s hard to choose because both are important. Health helps me stay healthy, while wealth allows me to prepare for the future.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Health</strong> helps me <strong>stay healthy</strong>, while <strong>wealth</strong> allows me to <strong>prepare for the future</strong>.</div>"
            },
            {
                "q": "Which is more important, <span class='sub-hl'>physical health</span> or <span class='sub-hl'>mental health</span>?",
                "a": "→ It’s hard to choose because both are important. Time helps me enjoy my free time, while money allows me to prepare for the future.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Time</strong> helps me <strong>enjoy my free time</strong>, while <strong>money</strong> allows me to <strong>prepare for the future</strong>.</div>"
            },
            {
                "q": "Which is more important, <span class='sub-hl'>talent</span> or <span class='sub-hl'>hard work</span>?",
                "a": "→ It’s hard to choose because both are important. Knowledge helps me widen my knowledge, while experience allows me to learn to solve problems.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Knowledge</strong> helps me <strong>widen my knowledge</strong>, while <strong>experience</strong> allows me to <strong>learn to solve problems</strong>.</div>"
            },
            {
                "q": "Which is more important, <span class='sub-hl'>individual study</span> or <span class='sub-hl'>group study</span>?",
                "a": "→ It’s hard to choose because both are important. Individual study helps me focus better, while group study allows me to learn from others.",
                "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Individual study</strong> helps me <strong>focus better</strong>, while <strong>group study</strong> allows me to <strong>learn from others</strong>.</div>"
            }
        ],
        "exQ": "Do you prefer <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying at home</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying in the library</span>?",
        "exA": "→ It’s hard to choose because both are important. Studying at home helps me save time, while studying in the library allows me to focus better.",
        "exAFormatted": "→ It’s hard to choose because both are important. <span class=\"sub-hl\">Studying at home</span> helps me <span class=\"sub-hl\">save time</span>, while <span class=\"sub-hl\">studying in the library</span> allows me to <span class=\"sub-hl\">focus better</span>.",
        "audio": "It’s hard to choose because both are important. Studying at home helps me save time, while studying in the library allows me to focus better.",
        "vocab": [
            {
                "type": "note",
                "title": "Cụm từ cố định:",
                "items": [
                    {
                        "en": "hard to choose",
                        "vn": "khó để lựa chọn"
                    },
                    {
                        "en": "both are important",
                        "vn": "cả hai đều quan trọng"
                    },
                    {
                        "en": "allow me to",
                        "vn": "cho phép tôi / giúp tôi"
                    },
                    {
                        "q": "Which is more important, <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>money</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>happiness</span>?",
                        "a": "→ It’s hard to choose because both are important. Money helps me prepare for the future, while happiness allows me to create a balanced lifestyle.",
                        "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Money</strong> helps me <strong>prepare for the future</strong>, while <strong>happiness</strong> allows me to <strong>create a balanced lifestyle</strong>.</div>"
                    },
                    {
                        "q": "Which is more important, <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>family</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>money</span>?",
                        "a": "→ It’s hard to choose because both are important. Family helps me escape from daily stress, while money allows me to prepare for the future.",
                        "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Family</strong> helps me <strong>escape from daily stress</strong>, while <strong>money</strong> allows me to <strong>prepare for the future</strong>.</div>"
                    },
                    {
                        "q": "Which is more important, <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>career</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>family</span>?",
                        "a": "→ It’s hard to choose because both are important. Career helps me develop useful skills, while family allows me to escape from daily stress.",
                        "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Career</strong> helps me <strong>develop useful skills</strong>, while <strong>family</strong> allows me to <strong>escape from daily stress</strong>.</div>"
                    },
                    {
                        "q": "Which is more important, <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>health</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>wealth</span>?",
                        "a": "→ It’s hard to choose because both are important. Health helps me stay healthy, while wealth allows me to prepare for the future.",
                        "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Health</strong> helps me <strong>stay healthy</strong>, while <strong>wealth</strong> allows me to <strong>prepare for the future</strong>.</div>"
                    },
                    {
                        "q": "Which is more important, <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>time</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>money</span>?",
                        "a": "→ It’s hard to choose because both are important. Time helps me enjoy my free time, while money allows me to prepare for the future.",
                        "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Time</strong> helps me <strong>enjoy my free time</strong>, while <strong>money</strong> allows me to <strong>prepare for the future</strong>.</div>"
                    },
                    {
                        "q": "Which is more important, <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>knowledge</span> or <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>experience</span>?",
                        "a": "→ It’s hard to choose because both are important. Knowledge helps me widen my knowledge, while experience allows me to learn to solve problems.",
                        "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → It’s hard to choose because both are important. <strong>Knowledge</strong> helps me <strong>widen my knowledge</strong>, while <strong>experience</strong> allows me to <strong>learn to solve problems</strong>.</div>"
                    }
                ]
            },
            {
                "type": "benefit",
                "title": "Cụm Lợi ích:",
                "items": [
                    {
                        "isNote": true,
                        "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                    }
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
                <div class="f-title" style="margin-bottom:1.5rem;">${formatTitleHighlight(d.title)}</div>
                ${getExamplesBlockHTML(d)}
                
                <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);">
                    <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(59, 130, 246, 0.08);">
                        <div class="acc-title" style="color:#2563eb; font-size:1.05rem;"><i class="fa-solid fa-lightbulb"></i> GỢI Ý CÂU TRẢ LỜI</div>
                        <div class="acc-toggle" style="background:#2563eb;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem gợi ý câu trả lời ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                    </div>
                    <div class="accordion-content" onclick="event.stopPropagation()">
                        <div class="f-formula-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">${formatFormulaHighlight(d.form)}</div>
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
    "what": [
        {
            "title": "1. What do you often do [thời gian]?",
            "formula": "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <strong>[hoạt động 1 – Vo]</strong> <strong>[thời gian]</strong> because it helps me <strong>[lợi ích 1]</strong>. Sometimes, I also <strong>[hoạt động 2 – Vo]</strong> to <strong>[lợi ích 2]</strong>.</div><div><strong>- Cách 2:</strong> → I usually <strong>[hoạt động – Vo]</strong> <strong>[thời gian]</strong> because it helps me <strong>[lợi ích]</strong>. It also makes me feel <strong>[cảm xúc]</strong>.</div>",
            "examples": [
                {
                    "q": "What do you often do <span class='sub-hl'>in the evening</span>?",
                    "a": "→ I usually watch movies in the evening because it helps me relax after a busy day and reduce stress.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>watch movies</strong> <strong>in the evening</strong> because it helps me <strong>relax after a busy day</strong> and <strong>reduce stress</strong>.</div>"
                },
                {
                    "q": "What do you often do <span class='sub-hl'>in the afternoon</span>?",
                    "a": "→ I usually read books in the afternoon because it helps me widen my knowledge and enjoy my free time.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>read books</strong> <strong>in the afternoon</strong> because it helps me <strong>widen my knowledge</strong> and <strong>enjoy my free time</strong>.</div>"
                },
                {
                    "q": "What do you often do <span class='sub-hl'>in your free time</span>?",
                    "a": "→ I usually listen to music in my free time because it helps me have fun and improve my mood.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>listen to music</strong> <strong>in my free time</strong> because it helps me <strong>have fun</strong> and <strong>improve my mood</strong>.</div>"
                },
                {
                    "q": "What do you often do <span class='sub-hl'>at weekends</span>?",
                    "a": "→ I usually hang out with friends at weekends because it helps me create good memories and feel happy.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>hang out with friends</strong> <strong>at weekends</strong> because it helps me <strong>create good memories</strong> and <strong>feel happy</strong>.</div>"
                },
                {
                    "q": "What do you often do <span class='sub-hl'>after school</span>?",
                    "a": "→ I usually play sports after school because it helps me stay in good shape and clear my mind.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>play sports</strong> <strong>after school</strong> because it helps me <strong>stay in good shape</strong> and <strong>clear my mind</strong>.</div>"
                },
                {
                    "q": "What do you often do <span class='sub-hl'>in the morning</span>?",
                    "a": "→ I usually go for a walk in the morning because it helps me stay healthy and feel energized.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go for a walk</strong> <strong>in the morning</strong> because it helps me <strong>stay healthy</strong> and <strong>feel energized</strong>.</div>"
                }
            ],
            "exQ": "What do you often do <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>in the evening</span>?",
            "exA": "→ I usually watch movies in the evening because it helps me reduce stress. Sometimes, I also listen to music to clear my mind.",
            "exAFormatted": "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → I usually <span class=\"sub-hl\">watch movies</span> <span class=\"sub-hl\">in the evening</span> because it helps me <span class=\"sub-hl\">reduce stress</span>. Sometimes, I also <span class=\"sub-hl\">listen to music</span> to <span class=\"sub-hl\">clear my mind</span>.</div><div><strong>- Cách 2:</strong> → I usually <span class=\"sub-hl\">read books</span> <span class=\"sub-hl\">in the evening</span> because it helps me <span class=\"sub-hl\">relax after a long day</span>. It also makes me feel <span class=\"sub-hl\">happy</span>.</div>",
            "vocab": [
                {
                    "type": "time",
                    "title": "Cụm Thời gian:",
                    "items": [
                        {
                            "en": "in the morning",
                            "vn": "vào buổi sáng"
                        },
                        {
                            "en": "in the afternoon",
                            "vn": "vào buổi chiều"
                        },
                        {
                            "en": "in the evening",
                            "vn": "vào buổi tối"
                        },
                        {
                            "en": "at night",
                            "vn": "vào ban đêm"
                        },
                        {
                            "en": "at weekends",
                            "vn": "vào cuối tuần"
                        },
                        {
                            "en": "on weekdays",
                            "vn": "vào các ngày trong tuần"
                        },
                        {
                            "en": "on my days off",
                            "vn": "vào những ngày nghỉ"
                        },
                        {
                            "en": "in my free time",
                            "vn": "vào thời gian rảnh rỗi"
                        },
                        {
                            "en": "after school / work",
                            "vn": "sau giờ học / làm"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                },
                {
                    "type": "emotion",
                    "title": "Tính từ mô tả cảm xúc:",
                    "items": [
                        {
                            "en": "excited",
                            "vn": "hào hứng / phấn khích"
                        },
                        {
                            "en": "happy",
                            "vn": "vui vẻ / hạnh phúc"
                        },
                        {
                            "en": "relaxed",
                            "vn": "thư thái / thoải mái"
                        },
                        {
                            "en": "confident",
                            "vn": "tự tin"
                        },
                        {
                            "en": "refreshed",
                            "vn": "sảng khoái"
                        },
                        {
                            "en": "motivated",
                            "vn": "có động lực"
                        },
                        {
                            "en": "comfortable",
                            "vn": "dễ chịu"
                        },
                        {
                            "en": "energetic",
                            "vn": "tràn đầy năng lượng"
                        }
                    ]
                }
            ]
        },
        {
            "title": "2. What do you often do to [mục đích]?",
            "formula": "→ I often <strong>[hoạt động 1 – Vo]</strong> to <strong>[mục đích]</strong> because it helps me <strong>[lợi ích]</strong>. I also <strong>[hoạt động 2 – Vo]</strong> because it’s simple and easy to do.",
            "examples": [
                {
                    "q": "What do you often do to <span class='sub-hl'>keep in shape</span>?",
                    "a": "→ I often exercise every day to keep in shape because it helps me burn calories. I also eat healthy food because it’s simple and easy to do.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>exercise every day</strong> to <strong>keep in shape</strong> because it helps me <strong>burn calories</strong>. I also <strong>eat healthy food</strong> because it’s simple and easy to do.</div>"
                },
                {
                    "q": "What do you often do to <span class='sub-hl'>stay healthy</span>?",
                    "a": "→ I often drink plenty of water to stay healthy because it helps me boost my metabolism. I also get enough sleep because it’s simple and easy to do.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>drink plenty of water</strong> to <strong>stay healthy</strong> because it helps me <strong>boost my metabolism</strong>. I also <strong>get enough sleep</strong> because it’s simple and easy to do.</div>"
                },
                {
                    "q": "What do you often do to <span class='sub-hl'>improve your English skills</span>?",
                    "a": "→ I often watch English videos to improve my English skills because it helps me expand my vocabulary. I also practice speaking every day because it’s simple and easy to do.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>watch English videos</strong> to <strong>improve my English skills</strong> because it helps me <strong>expand my vocabulary</strong>. I also <strong>practice speaking every day</strong> because it’s simple and easy to do.</div>"
                },
                {
                    "q": "What do you often do to <span class='sub-hl'>reduce stress</span>?",
                    "a": "→ I often listen to relaxing music to reduce stress because it helps me clear my mind. I also take a walk outside because it’s simple and easy to do.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>listen to relaxing music</strong> to <strong>reduce stress</strong> because it helps me <strong>clear my mind</strong>. I also <strong>take a walk outside</strong> because it’s simple and easy to do.</div>"
                },
                {
                    "q": "What do you often do to <span class='sub-hl'>widen your knowledge</span>?",
                    "a": "→ I often read non-fiction books to widen my knowledge because it helps me learn new things. I also read news online because it’s simple and easy to do.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>read non-fiction books</strong> to <strong>widen my knowledge</strong> because it helps me <strong>learn new things</strong>. I also <strong>read news online</strong> because it’s simple and easy to do.</div>"
                },
                {
                    "q": "What do you often do to <span class='sub-hl'>save money</span>?",
                    "a": "→ I often cook meals at home to save money because it helps me reduce dining costs. I also avoid impulse shopping because it’s simple and easy to do.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>cook meals at home</strong> to <strong>save money</strong> because it helps me <strong>reduce dining costs</strong>. I also <strong>avoid impulse shopping</strong> because it’s simple and easy to do.</div>"
                }
            ],
            "exQ": "What do you often do to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>keep in shape</span>?",
            "exA": "→ I often exercise to keep in shape because it helps me burn calories. I also go for a walk because it is simple and easy to do.",
            "exAFormatted": "→ I often <span class=\"sub-hl\">exercise</span> to <span class=\"sub-hl\">keep in shape</span> because it helps me <span class=\"sub-hl\">burn calories</span>. I also <span class=\"sub-hl\">go for a walk</span> because it is simple and easy to do.",
            "vocab": [
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "Cụm Hoạt động:",
                    "items": [
                        {
                            "en": "exercise",
                            "vn": "tập thể dục"
                        },
                        {
                            "en": "go for a walk",
                            "vn": "đi dạo"
                        },
                        {
                            "en": "play sports",
                            "vn": "chơi thể thao"
                        },
                        {
                            "en": "eat healthy food",
                            "vn": "ăn uống lành mạnh"
                        },
                        {
                            "en": "read books",
                            "vn": "đọc sách"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "Cụm Mục đích / Lợi ích:",
                    "items": [
                        {
                            "en": "keep in shape",
                            "vn": "giữ vóc dáng cân đối"
                        },
                        {
                            "en": "burn calories",
                            "vn": "đốt cháy calo"
                        },
                        {
                            "en": "relax",
                            "vn": "thư giãn"
                        },
                        {
                            "en": "improve my English",
                            "vn": "cải thiện tiếng Anh"
                        },
                        {
                            "en": "stay healthy",
                            "vn": "giữ gìn sức khỏe"
                        },
                        {
                            "en": "save money",
                            "vn": "tiết kiệm tiền"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "Cụm từ cố định trong công thức:",
                    "items": [
                        {
                            "en": "simple and easy to do",
                            "vn": "đơn giản và dễ thực hiện"
                        }
                    ]
                }
            ]
        },
        {
            "title": "3. What do you often do when [tình huống – mệnh đề]?",
            "formula": "→ I often <strong>[hoạt động – Vo]</strong> when <strong>[tình huống]</strong> because it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>. It also makes me feel <strong>[tính từ cảm xúc]</strong>.",
            "note": "LƯU Ý: Nếu không kịp thời gian thì chỉ cần 1 lợi ích hoặc lược bỏ câu mô tả cảm xúc.",
            "examples": [
                {
                    "q": "What do you often do when you <span class='sub-hl'>feel sad</span>?",
                    "a": "→ I often listen to music when I feel sad because it helps me improve my mood and forget about my worries. It also makes me feel more positive.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>listen to music</strong> when <strong>I feel sad</strong> because it helps me <strong>improve my mood</strong> and <strong>forget about my worries</strong>. It also makes me feel <strong>more positive</strong>.</div>"
                },
                {
                    "q": "What do you often do when you <span class='sub-hl'>feel stressed</span>?",
                    "a": "→ I often go for a walk when I feel stressed because it helps me relax after a busy day and clear my mind. It also makes me feel peaceful.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>go for a walk</strong> when <strong>I feel stressed</strong> because it helps me <strong>relax after a busy day</strong> and <strong>clear my mind</strong>. It also makes me feel <strong>peaceful</strong>.</div>"
                },
                {
                    "q": "What do you often do when you <span class='sub-hl'>are free</span>?",
                    "a": "→ I often read books when I am free because it helps me widen my knowledge and enjoy my free time. It also makes me feel inspired.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>read books</strong> when <strong>I am free</strong> because it helps me <strong>widen my knowledge</strong> and <strong>enjoy my free time</strong>. It also makes me feel <strong>inspired</strong>.</div>"
                },
                {
                    "q": "What do you often do when you <span class='sub-hl'>feel bored</span>?",
                    "a": "→ I often watch funny movies when I feel bored because it helps me have fun and have a good laugh. It also makes me feel cheerful.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>watch funny movies</strong> when <strong>I feel bored</strong> because it helps me <strong>have fun</strong> and <strong>have a good laugh</strong>. It also makes me feel <strong>cheerful</strong>.</div>"
                },
                {
                    "q": "What do you often do when you <span class='sub-hl'>are tired</span>?",
                    "a": "→ I often take a short nap when I am tired because it helps me recharge my energy and rest my eyes. It also makes me feel refreshed.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>take a short nap</strong> when <strong>I am tired</strong> because it helps me <strong>recharge my energy</strong> and <strong>rest my eyes</strong>. It also makes me feel <strong>refreshed</strong>.</div>"
                },
                {
                    "q": "What do you often do when you <span class='sub-hl'>feel anxious</span>?",
                    "a": "→ I often talk to my close friends when I feel anxious because it helps me get emotional support and calm down. It also makes me feel relieved.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>talk to my close friends</strong> when <strong>I feel anxious</strong> because it helps me <strong>get emotional support</strong> and <strong>calm down</strong>. It also makes me feel <strong>relieved</strong>.</div>"
                }
            ],
            "exQ": "What do you often do when <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>you feel sad</span>?",
            "exA": "→ I often listen to music when I feel sad because it helps me clear my mind and improve my mood. It also makes me feel relaxed.",
            "exAFormatted": "→ I often <span class=\"sub-hl\">listen to music</span> when <span class=\"sub-hl\">I feel sad</span> because it helps me <span class=\"sub-hl\">clear my mind</span> and <span class=\"sub-hl\">improve my mood</span>. It also makes me feel <span class=\"sub-hl\">relaxed</span>.",
            "vocab": [
                {
                    "type": "note",
                    "title": "Cụm Tình huống:",
                    "items": [
                        {
                            "en": "I feel sad",
                            "vn": "tôi cảm thấy buồn"
                        },
                        {
                            "en": "I am stressed",
                            "vn": "tôi bị căng thẳng"
                        },
                        {
                            "en": "I feel bored",
                            "vn": "tôi cảm thấy nhàm chán"
                        },
                        {
                            "en": "I have free time",
                            "vn": "tôi có thời gian rảnh"
                        },
                        {
                            "en": "I am tired",
                            "vn": "tôi thấy mệt"
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "Cụm Hoạt động:",
                    "items": [
                        {
                            "en": "listen to music",
                            "vn": "nghe nhạc"
                        },
                        {
                            "en": "read books",
                            "vn": "đọc sách"
                        },
                        {
                            "en": "go for a walk",
                            "vn": "đi dạo"
                        },
                        {
                            "en": "play games",
                            "vn": "chơi game"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                },
                {
                    "type": "emotion",
                    "title": "Tính từ cảm xúc (cuối câu):",
                    "items": [
                        {
                            "en": "excited",
                            "vn": "hào hứng / phấn khích"
                        },
                        {
                            "en": "happy",
                            "vn": "vui vẻ / hạnh phúc"
                        },
                        {
                            "en": "relaxed",
                            "vn": "thư thái / thoải mái"
                        },
                        {
                            "en": "confident",
                            "vn": "tự tin"
                        },
                        {
                            "en": "refreshed",
                            "vn": "sảng khoái"
                        },
                        {
                            "en": "motivated",
                            "vn": "có động lực"
                        },
                        {
                            "en": "comfortable",
                            "vn": "dễ chịu"
                        },
                        {
                            "en": "energetic",
                            "vn": "tràn đầy năng lượng"
                        }
                    ]
                }
            ]
        },
        {
            "title": "4. What kinds of [danh từ] do you like?",
            "formula": "→ I’m a big fan of <strong>[1 hoặc 2 thể loại]</strong> because they are very <strong>[tính từ mô tả]</strong>. They also allow me to <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
            "note": "LƯU Ý: Nếu không kịp thời gian thì chỉ cần 1 lợi ích.",
            "examples": [
                {
                    "q": "What kinds of <span class='sub-hl'>movies</span> do you like?",
                    "a": "→ I’m a big fan of comedy and action movies because they are very interesting. They also allow me to relax after a busy day and have fun.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>comedy and action movies</strong> because they are very <strong>interesting</strong>. They also allow me to <strong>relax after a busy day</strong> and <strong>have fun</strong>.</div>"
                },
                {
                    "q": "What kinds of <span class='sub-hl'>music</span> do you like?",
                    "a": "→ I’m a big fan of pop and acoustic music because they are very soothing. They also allow me to reduce stress and improve my mood.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>pop and acoustic music</strong> because they are very <strong>soothing</strong>. They also allow me to <strong>reduce stress</strong> and <strong>improve my mood</strong>.</div>"
                },
                {
                    "q": "What kinds of <span class='sub-hl'>books</span> do you like?",
                    "a": "→ I’m a big fan of detective and science fiction books because they are very exciting. They also allow me to develop my imagination and widen my knowledge.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>detective and science fiction books</strong> because they are very <strong>exciting</strong>. They also allow me to <strong>develop my imagination</strong> and <strong>widen my knowledge</strong>.</div>"
                },
                {
                    "q": "What kinds of <span class='sub-hl'>sports</span> do you like?",
                    "a": "→ I’m a big fan of badminton and swimming because they are very healthy. They also allow me to stay in good shape and build my stamina.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>badminton and swimming</strong> because they are very <strong>healthy</strong>. They also allow me to <strong>stay in good shape</strong> and <strong>build my stamina</strong>.</div>"
                },
                {
                    "q": "What kinds of <span class='sub-hl'>food</span> do you like?",
                    "a": "→ I’m a big fan of traditional Vietnamese food and fresh fruits because they are very delicious. They also allow me to stay healthy and enjoy nutritious meals.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>traditional Vietnamese food and fresh fruits</strong> because they are very <strong>delicious</strong>. They also allow me to <strong>stay healthy</strong> and <strong>enjoy nutritious meals</strong>.</div>"
                },
                {
                    "q": "What kinds of <span class='sub-hl'>hobbies</span> do you like?",
                    "a": "→ I’m a big fan of photography and gardening because they are very creative. They also allow me to explore nature and relax after a busy day.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m a big fan of <strong>photography and gardening</strong> because they are very <strong>creative</strong>. They also allow me to <strong>explore nature</strong> and <strong>relax after a busy day</strong>.</div>"
                }
            ],
            "exQ": "What kinds of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>movies</span> do you like?",
            "exA": "→ I’m a big fan of action and comedy movies because they are very interesting. They also allow me to relax and reduce stress.",
            "exAFormatted": "→ I’m a big fan of <span class=\"sub-hl\">action and comedy movies</span> because they are very <span class=\"sub-hl\">interesting</span>. They also allow me to <span class=\"sub-hl\">relax</span> and <span class=\"sub-hl\">reduce stress</span>.",
            "vocab": [
                {
                    "type": "note",
                    "title": "🎬 Thể loại Phim (Movies):",
                    "items": [
                        {
                            "en": "action movies",
                            "vn": "phim hành động"
                        },
                        {
                            "en": "comedy movies",
                            "vn": "phim hài"
                        },
                        {
                            "en": "romantic movies",
                            "vn": "phim tình cảm"
                        },
                        {
                            "en": "sci-fi movies",
                            "vn": "phim khoa học viễn tưởng"
                        },
                        {
                            "en": "horror movies",
                            "vn": "phim kinh dị"
                        },
                        {
                            "en": "animated movies",
                            "vn": "phim hoạt hình"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "🎵 Thể loại Nhạc (Music):",
                    "items": [
                        {
                            "en": "pop music",
                            "vn": "nhạc pop"
                        },
                        {
                            "en": "classical music",
                            "vn": "nhạc cổ điển"
                        },
                        {
                            "en": "EDM",
                            "vn": "nhạc điện tử"
                        },
                        {
                            "en": "hip hop / rap",
                            "vn": "nhạc hip hop / rap"
                        },
                        {
                            "en": "country music",
                            "vn": "nhạc đồng quê"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "📚 Thể loại Sách (Books):",
                    "items": [
                        {
                            "en": "comic books",
                            "vn": "truyện tranh"
                        },
                        {
                            "en": "novels",
                            "vn": "tiểu thuyết"
                        },
                        {
                            "en": "self-help books",
                            "vn": "sách kỹ năng"
                        },
                        {
                            "en": "detective books",
                            "vn": "truyện trinh thám"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "🏃 Loại hình Thể thao (Sports):",
                    "items": [
                        {
                            "en": "team sports",
                            "vn": "thể thao đồng đội"
                        },
                        {
                            "en": "individual sports",
                            "vn": "thể thao cá nhân"
                        },
                        {
                            "en": "water sports",
                            "vn": "thể thao dưới nước"
                        },
                        {
                            "en": "indoor sports",
                            "vn": "thể thao trong nhà"
                        },
                        {
                            "en": "outdoor sports",
                            "vn": "thể thao ngoài trời"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "🍔 Loại Đồ ăn (Food):",
                    "items": [
                        {
                            "en": "fast food",
                            "vn": "thức ăn nhanh"
                        },
                        {
                            "en": "seafood",
                            "vn": "hải sản"
                        },
                        {
                            "en": "street food",
                            "vn": "thức ăn đường phố"
                        },
                        {
                            "en": "traditional food",
                            "vn": "thức ăn truyền thống"
                        },
                        {
                            "en": "healthy food",
                            "vn": "thực phẩm tốt cho sức khỏe"
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "✨ Tính từ mô tả:",
                    "items": [
                        {
                            "en": "interesting",
                            "vn": "thú vị"
                        },
                        {
                            "en": "exciting",
                            "vn": "sôi động / hào hứng"
                        },
                        {
                            "en": "entertaining",
                            "vn": "mang tính giải trí"
                        },
                        {
                            "en": "relaxing",
                            "vn": "giúp thư giãn"
                        },
                        {
                            "en": "fascinating",
                            "vn": "lôi cuốn / hấp dẫn"
                        },
                        {
                            "en": "informative",
                            "vn": "nhiều thông tin bổ ích (dùng cho sách, báo)"
                        },
                        {
                            "en": "delicious / tasty",
                            "vn": "ngon miệng (dùng cho đồ ăn)"
                        },
                        {
                            "en": "useful",
                            "vn": "hữu ích"
                        },
                        {
                            "en": "gentle / light",
                            "vn": "nhẹ nhàng"
                        },
                        {
                            "en": "touching / moving",
                            "vn": "cảm động"
                        },
                        {
                            "en": "soothing / mellow",
                            "vn": "dịu êm"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                }
            ]
        },
        {
            "title": "5. What is your favorite [danh từ]?",
            "formula": "→ My favorite <strong>[danh từ]</strong> is <strong>[thứ cụ thể]</strong> because it’s <strong>[tính từ mô tả phù hợp]</strong>. It helps me <strong>[lợi ích]</strong> and makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
            "examples": [
                {
                    "q": "What is your favorite <span class='sub-hl'>food</span>?",
                    "a": "→ My favorite food is pho because it’s delicious and flavorful. It helps me enjoy authentic Vietnamese cuisine and makes me feel satisfied.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>food</strong> is <strong>pho</strong> because it’s <strong>delicious and flavorful</strong>. It helps me <strong>enjoy authentic Vietnamese cuisine</strong> and makes me feel <strong>satisfied</strong>.</div>"
                },
                {
                    "q": "What is your favorite <span class='sub-hl'>movie</span>?",
                    "a": "→ My favorite movie is Harry Potter because it’s fascinating and magical. It helps me develop my imagination and makes me feel inspired.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>movie</strong> is <strong>Harry Potter</strong> because it’s <strong>fascinating and magical</strong>. It helps me <strong>develop my imagination</strong> and makes me feel <strong>inspired</strong>.</div>"
                },
                {
                    "q": "What is your favorite <span class='sub-hl'>color</span>?",
                    "a": "→ My favorite color is blue because it’s peaceful and calm. It helps me clear my mind and makes me feel relaxed.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>color</strong> is <strong>blue</strong> because it’s <strong>peaceful and calm</strong>. It helps me <strong>clear my mind</strong> and makes me feel <strong>relaxed</strong>.</div>"
                },
                {
                    "q": "What is your favorite <span class='sub-hl'>sport</span>?",
                    "a": "→ My favorite sport is badminton because it’s fun and fast-paced. It helps me stay in good shape and makes me feel energetic.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>sport</strong> is <strong>badminton</strong> because it’s <strong>fun and fast-paced</strong>. It helps me <strong>stay in good shape</strong> and <strong>makes me feel energetic</strong>.</div>"
                },
                {
                    "q": "What is your favorite <span class='sub-hl'>season</span>?",
                    "a": "→ My favorite season is autumn because it’s cool and pleasant. It helps me enjoy outdoor activities and makes me feel comfortable.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>season</strong> is <strong>autumn</strong> because it’s <strong>cool and pleasant</strong>. It helps me <strong>enjoy outdoor activities</strong> and makes me feel <strong>comfortable</strong>.</div>"
                },
                {
                    "q": "What is your favorite <span class='sub-hl'>subject</span>?",
                    "a": "→ My favorite subject is English because it’s useful and globally spoken. It helps me communicate with international friends and makes me feel confident.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>subject</strong> is <strong>English</strong> because it’s <strong>useful and globally spoken</strong>. It helps me <strong>communicate with international friends</strong> and makes me feel <strong>confident</strong>.</div>"
                }
            ],
            "exQ": "What is your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>food</span>?",
            "exA": "→ My favorite food is fried chicken because it’s delicious. It helps me reduce stress and makes me feel happy whenever I eat it.",
            "exAFormatted": "→ My favorite food is <span class=\"sub-hl\">fried chicken</span> because it’s <span class=\"sub-hl\">delicious</span>. It helps me <span class=\"sub-hl\">reduce stress</span> and makes me feel <span class=\"sub-hl\">happy</span> whenever I eat it.",
            "vocab": [
                {
                    "type": "note",
                    "title": "💡 Gợi ý cho các chủ đề thường gặp (Favorite...):",
                    "items": [
                        {
                            "en": "Color: blue, red, white...",
                            "vn": "Màu sắc: xanh dương, đỏ, trắng..."
                        },
                        {
                            "en": "Animal: dog, cat, rabbit...",
                            "vn": "Con vật: chó, mèo, thỏ..."
                        },
                        {
                            "en": "Number: seven, nine...",
                            "vn": "Con số: số 7, số 9..."
                        },
                        {
                            "en": "Day of the week: Sunday, Saturday...",
                            "vn": "Ngày trong tuần: Chủ nhật, Thứ bảy..."
                        },
                        {
                            "en": "Day of the year: my birthday, Tet holiday...",
                            "vn": "Ngày trong năm: sinh nhật tôi, Tết..."
                        },
                        {
                            "en": "Weather: rainy weather, sunny weather...",
                            "vn": "Thời tiết: thời tiết mưa, thời tiết nắng..."
                        },
                        {
                            "en": "Season: summer, autumn...",
                            "vn": "Mùa: mùa hè, mùa thu..."
                        },
                        {
                            "en": "Food: fried chicken, pho, pizza...",
                            "vn": "Đồ ăn: gà rán, phở, pizza..."
                        },
                        {
                            "en": "Sport: swimming, football...",
                            "vn": "Thể thao: bơi lội, bóng đá..."
                        },
                        {
                            "en": "Subject: English, Math...",
                            "vn": "Môn học: Tiếng Anh, Toán..."
                        },
                        {
                            "en": "Place: the beach, coffee shop...",
                            "vn": "Địa điểm: bãi biển, quán cà phê..."
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "✨ Tính từ mô tả:",
                    "items": [
                        {
                            "en": "delicious / tasty",
                            "vn": "ngon miệng (Food)"
                        },
                        {
                            "en": "interesting / useful",
                            "vn": "thú vị / hữu ích (Subject, Book)"
                        },
                        {
                            "en": "cute and loyal",
                            "vn": "đáng yêu và trung thành (Animal)"
                        },
                        {
                            "en": "calming / peaceful",
                            "vn": "yên bình / nhẹ nhàng (Color, Weather, Place)"
                        },
                        {
                            "en": "meaningful",
                            "vn": "có ý nghĩa (Day, Number)"
                        },
                        {
                            "en": "beautiful",
                            "vn": "đẹp (Season, Place)"
                        }
                    ]
                },
                {
                    "type": "emotion",
                    "title": "Tính từ mô tả cảm xúc:",
                    "items": [
                        {
                            "en": "excited",
                            "vn": "hào hứng / phấn khích"
                        },
                        {
                            "en": "happy",
                            "vn": "vui vẻ / hạnh phúc"
                        },
                        {
                            "en": "relaxed",
                            "vn": "thư thái / thoải mái"
                        },
                        {
                            "en": "confident",
                            "vn": "tự tin"
                        },
                        {
                            "en": "refreshed",
                            "vn": "sảng khoái"
                        },
                        {
                            "en": "motivated",
                            "vn": "có động lực"
                        },
                        {
                            "en": "comfortable",
                            "vn": "dễ chịu"
                        },
                        {
                            "en": "energetic",
                            "vn": "tràn đầy năng lượng"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                }
            ]
        },
        {
            "title": "6. What are the benefits of [noun/Ving]?",
            "formula": "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of <strong>[noun/Ving]</strong> is that it helps us <strong>[lợi ích 1]</strong>. It’s also a good way to <strong>[lợi ích 2]</strong> and <strong>[lợi ích 3]</strong>.</div><div><strong>- Cách 2:</strong> → There are many benefits of <strong>[noun/Ving]</strong>. First, it helps us <strong>[lợi ích 1]</strong>. Second, it allows us to <strong>[lợi ích 2]</strong>.</div>",
            "note": "LƯU Ý: Nếu không kịp thời gian thì chỉ cần nói 2 lợi ích.",
            "examples": [
                {
                    "q": "What are the benefits of <span class='sub-hl'>exercise</span>?",
                    "a": "→ Exercise helps us stay healthy and reduce stress. Besides, it is also good for our physical fitness.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → <strong>Exercise</strong> helps us <strong>stay healthy</strong> and <strong>reduce stress</strong>. Besides, it is also good for our <strong>physical fitness</strong>.</div>"
                },
                {
                    "q": "What are the benefits of <span class='sub-hl'>reading books</span>?",
                    "a": "→ Reading books helps us widen our knowledge and improve our vocabulary. Besides, it is also good for developing our imagination.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → <strong>Reading books</strong> helps us <strong>widen our knowledge</strong> and <strong>improve our vocabulary</strong>. Besides, it is also good for <strong>developing our imagination</strong>.</div>"
                },
                {
                    "q": "What are the benefits of <span class='sub-hl'>using public transport</span>?",
                    "a": "→ Using public transport helps us save money and reduce traffic congestion. Besides, it is also good for protecting the environment.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → <strong>Using public transport</strong> helps us <strong>save money</strong> and <strong>reduce traffic congestion</strong>. Besides, it is also good for <strong>protecting the environment</strong>.</div>"
                },
                {
                    "q": "What are the benefits of <span class='sub-hl'>soft skills</span>?",
                    "a": "→ Soft skills help us communicate effectively and resolve conflicts. Besides, they are also good for our career advancement.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → <strong>Soft skills</strong> help us <strong>communicate effectively</strong> and <strong>resolve conflicts</strong>. Besides, they are also good for our <strong>career advancement</strong>.</div>"
                },
                {
                    "q": "What are the benefits of <span class='sub-hl'>learning a foreign language</span>?",
                    "a": "→ Learning a foreign language helps us talk with foreigners and understand new cultures. Besides, it is also good for finding better job opportunities.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → <strong>Learning a foreign language</strong> helps us <strong>talk with foreigners</strong> and <strong>understand new cultures</strong>. Besides, it is also good for <strong>finding better job opportunities</strong>.</div>"
                },
                {
                    "q": "What are the benefits of <span class='sub-hl'>teamwork</span>?",
                    "a": "→ Teamwork helps us share heavy tasks and find creative solutions. Besides, it is also good for making stronger friendships.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → <strong>Teamwork</strong> helps us <strong>share heavy tasks</strong> and <strong>find creative solutions</strong>. Besides, it is also good for <strong>making stronger friendships</strong>.</div>"
                }
            ],
            "exQ": "What are the benefits of <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>exercise</span>?",
            "exA": "One benefit of exercise is that it helps us stay healthy. It’s also a good way to improve our fitness and reduce stress.",
            "exAFormatted": "<div style='margin-bottom: 8px;'><strong>- Cách 1:</strong> → One benefit of exercise is that it helps us <span class=\"sub-hl\">stay healthy</span>. It’s also a good way to <span class=\"sub-hl\">improve our fitness</span> and <span class=\"sub-hl\">reduce stress</span>.</div><div><strong>- Cách 2:</strong> → There are many benefits of exercise. First, it helps us <span class=\"sub-hl\">stay healthy</span>. Second, it allows us to <span class=\"sub-hl\">improve our fitness</span>.</div>",
            "vocab": [
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                }
            ]
        }
    ],
    "who": [
        {
            "title": "1. Who’s your favorite [noun – danh từ chỉ người]?",
            "formula": "→ My favorite <strong>[noun – danh từ chỉ người]</strong> is <strong>[tên]</strong>. I like him/her because <strong>[lý do chính]</strong>. Moreover, he/she is very <strong>[tính từ mô tả tính cách]</strong>.",
            "examples": [
                {
                    "q": "Who’s your favorite <span class='sub-hl'>singer</span>?",
                    "a": "→ My favorite singer is Justin Bieber. I like him because he has a beautiful voice. Moreover, he is very talented.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>singer</strong> is <strong>Justin Bieber</strong>. I like him because <strong>he has a beautiful voice</strong>. Moreover, he is very <strong>talented</strong>.</div>"
                },
                {
                    "q": "Who’s your favorite <span class='sub-hl'>actor</span>?",
                    "a": "→ My favorite actor is Tom Hanks. I like him because he acts very well in many famous movies. Moreover, he is very dedicated.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>actor</strong> is <strong>Tom Hanks</strong>. I like him because <strong>he acts very well in many famous movies</strong>. Moreover, he is very <strong>dedicated</strong>.</div>"
                },
                {
                    "q": "Who’s your favorite <span class='sub-hl'>teacher</span>?",
                    "a": "→ My favorite teacher is my high school English teacher. I like her because she explains lessons clearly and patiently. Moreover, she is very supportive.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>teacher</strong> is <strong>my high school English teacher</strong>. I like her because <strong>she explains lessons clearly and patiently</strong>. Moreover, she is very <strong>supportive</strong>.</div>"
                },
                {
                    "q": "Who’s your favorite <span class='sub-hl'>football player</span>?",
                    "a": "→ My favorite football player is Lionel Messi. I like him because he plays with incredible skills and teamwork. Moreover, he is very humble.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>football player</strong> is <strong>Lionel Messi</strong>. I like him because <strong>he plays with incredible skills and teamwork</strong>. Moreover, he is very <strong>humble</strong>.</div>"
                },
                {
                    "q": "Who’s your favorite <span class='sub-hl'>writer / author</span>?",
                    "a": "→ My favorite writer is J.K. Rowling. I like her because she created the magical world of Harry Potter. Moreover, she is very imaginative.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>writer</strong> is <strong>J.K. Rowling</strong>. I like her because <strong>she created the magical world of Harry Potter</strong>. Moreover, she is very <strong>imaginative</strong>.</div>"
                },
                {
                    "q": "Who’s your favorite <span class='sub-hl'>family member</span>?",
                    "a": "→ My favorite family member is my mother. I like her because she always cares for me and gives great advice. Moreover, she is very loving and kind.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → My favorite <strong>family member</strong> is <strong>my mother</strong>. I like her because <strong>she always cares for me and gives great advice</strong>. Moreover, she is very <strong>loving and kind</strong>.</div>"
                }
            ],
            "exQ": "Who’s your favorite <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>singer</span>?",
            "exA": "→ My favorite singer is Justin Bieber. I like him because he has a beautiful voice. Moreover, he is very talented.",
            "exAFormatted": "→ My favorite singer is <span class=\"sub-hl\">Justin Bieber</span>. I like him because <span class=\"sub-hl\">he has a beautiful voice</span>. Moreover, he is very <span class=\"sub-hl\">talented</span>.",
            "vocab": [
                {
                    "type": "note",
                    "title": "💡 Gợi ý [Lý do chính] (Reasons):",
                    "items": [
                        {
                            "en": "he / she has a beautiful voice",
                            "vn": "có giọng hát hay (singer)"
                        },
                        {
                            "en": "he / she acts very well",
                            "vn": "diễn xuất rất giỏi (actor)"
                        },
                        {
                            "en": "he / she teaches very well",
                            "vn": "dạy rất hay (teacher)"
                        },
                        {
                            "en": "he / she writes great books",
                            "vn": "viết sách rất hay (author)"
                        },
                        {
                            "en": "he / she plays sports excellently",
                            "vn": "chơi thể thao xuất sắc (athlete)"
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "✨ [Tính từ mô tả tính cách / đặc điểm]:",
                    "items": [
                        {
                            "en": "talented",
                            "vn": "tài năng"
                        },
                        {
                            "en": "handsome / beautiful",
                            "vn": "đẹp trai / xinh gái"
                        },
                        {
                            "en": "friendly and kind",
                            "vn": "thân thiện và tốt bụng"
                        },
                        {
                            "en": "humorous",
                            "vn": "hài hước / vui tính"
                        },
                        {
                            "en": "inspiring",
                            "vn": "truyền cảm hứng"
                        }
                    ]
                }
            ]
        },
        {
            "title": "2. Who do you often [hoạt động – Vo] with?",
            "formula": "→ I often <strong>[hoạt động – Vo]</strong> with my <strong>[đối tượng phù hợp]</strong> because <strong>[lý do]</strong>. It's more <strong>[tính từ phù hợp]</strong> when we spend time together.",
            "examples": [
                {
                    "q": "Who do you often <span class='sub-hl'>go shopping</span> with?",
                    "a": "→ I often go shopping with my best friend because we have similar tastes in fashion. It helps me choose suitable clothes and makes me feel happy.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>go shopping</strong> with my <strong>best friend</strong> because <strong>we have similar tastes in fashion</strong>. It helps me <strong>choose suitable clothes</strong> and makes me feel <strong>happy</strong>.</div>"
                },
                {
                    "q": "Who do you often <span class='sub-hl'>study</span> with?",
                    "a": "→ I often study with my classmates because we can discuss difficult exercises together. It helps me understand lessons better and makes me feel motivated.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>study</strong> with my <strong>classmates</strong> because <strong>we can discuss difficult exercises together</strong>. It helps me <strong>understand lessons better</strong> and makes me feel <strong>motivated</strong>.</div>"
                },
                {
                    "q": "Who do you often <span class='sub-hl'>play sports</span> with?",
                    "a": "→ I often play sports with my neighborhood friends because we all love playing badminton. It helps me stay in good shape and makes me feel energetic.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>play sports</strong> with my <strong>neighborhood friends</strong> because <strong>we all love playing badminton</strong>. It helps me <strong>stay in good shape</strong> and <strong>makes me feel energetic</strong>.</div>"
                },
                {
                    "q": "Who do you often <span class='sub-hl'>go out</span> with?",
                    "a": "→ I often go out with my close friends because we enjoy chatting and drinking coffee. It helps me relax after a busy day and makes me feel cheerful.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>go out</strong> with my <strong>close friends</strong> because <strong>we enjoy chatting and drinking coffee</strong>. It helps me <strong>relax after a busy day</strong> and <strong>makes me feel cheerful</strong>.</div>"
                },
                {
                    "q": "Who do you often <span class='sub-hl'>travel</span> with?",
                    "a": "→ I often travel with my family because we want to spend quality time together during vacations. It helps me build strong family bonds and makes me feel joyful.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>travel</strong> with my <strong>family</strong> because <strong>we want to spend quality time together during vacations</strong>. It helps me <strong>build strong family bonds</strong> and <strong>makes me feel joyful</strong>.</div>"
                },
                {
                    "q": "Who do you often <span class='sub-hl'>cook</span> with?",
                    "a": "→ I often cook with my mother because she teaches me many delicious traditional recipes. It helps me improve my cooking skills and makes me feel warm and happy.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I often <strong>cook</strong> with my <strong>mother</strong> because <strong>she teaches me many delicious traditional recipes</strong>. It helps me <strong>improve my cooking skills</strong> and <strong>makes me feel warm and happy</strong>.</div>"
                }
            ],
            "exQ": "Who do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go shopping</span> with?",
            "exA": "→ I often go shopping with my mother because we have the same hobbies. It’s more fun when we spend time together.",
            "exAFormatted": "→ I often go shopping with <span class=\"sub-hl\">my mother</span> because <span class=\"sub-hl\">we have the same hobbies</span>. It’s more <span class=\"sub-hl\">fun</span> when we spend time together.",
            "vocab": [
                {
                    "type": "note",
                    "title": "💡 Gợi ý [Lý do] (Reasons):",
                    "items": [
                        {
                            "en": "we have the same hobbies",
                            "vn": "chúng tôi có cùng sở thích"
                        },
                        {
                            "en": "we are very close",
                            "vn": "chúng tôi rất thân thiết"
                        },
                        {
                            "en": "we understand each other well",
                            "vn": "chúng tôi rất hiểu ý nhau"
                        },
                        {
                            "en": "we both like this activity",
                            "vn": "cả hai chúng tôi đều thích hoạt động này"
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "✨ [Tính từ phù hợp]:",
                    "items": [
                        {
                            "en": "fun / enjoyable",
                            "vn": "vui vẻ / thú vị"
                        },
                        {
                            "en": "interesting",
                            "vn": "thú vị"
                        },
                        {
                            "en": "exciting",
                            "vn": "sôi nổi / hào hứng"
                        },
                        {
                            "en": "comfortable",
                            "vn": "thoải mái"
                        },
                        {
                            "en": "meaningful",
                            "vn": "có ý nghĩa"
                        },
                        {
                            "en": "memorable",
                            "vn": "đáng nhớ"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "Ghi chú khác:",
                    "items": [
                        {
                            "en": "spend time together",
                            "vn": "dành thời gian cùng nhau"
                        }
                    ]
                }
            ]
        }
    ],
    "when": [
        {
            "title": "1. When do you often [hoạt động – Vo]?",
            "formula": "→ I usually <strong>[hoạt động – Vo]</strong> <strong>[thời gian]</strong> because that’s when I have free time. It helps me <strong>[lợi ích]</strong> and makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
            "examples": [
                {
                    "q": "When do you often <span class='sub-hl'>listen to music</span>?",
                    "a": "→ I usually listen to music in the evening because that’s when I have free time. It helps me relax after a busy day and makes me feel comfortable.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>listen to music</strong> <strong>in the evening</strong> because that’s when I have free time. It helps me <strong>relax after a busy day</strong> and makes me feel <strong>comfortable</strong>.</div>"
                },
                {
                    "q": "When do you often <span class='sub-hl'>read books</span>?",
                    "a": "→ I usually read books before going to bed because that’s when everything is quiet. It helps me widen my knowledge and makes me feel relaxed.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>read books</strong> <strong>before going to bed</strong> because that’s when everything is quiet. It helps me <strong>widen my knowledge</strong> and makes me feel <strong>relaxed</strong>.</div>"
                },
                {
                    "q": "When do you often <span class='sub-hl'>meet your friends</span>?",
                    "a": "→ I usually meet my friends at weekends because that’s when we are off from school and work. It helps me share life stories and makes me feel cheerful.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>meet my friends</strong> <strong>at weekends</strong> because that’s when we are off from school and work. It helps me <strong>share life stories</strong> and <strong>makes me feel cheerful</strong>.</div>"
                },
                {
                    "q": "When do you often <span class='sub-hl'>do your homework</span>?",
                    "a": "→ I usually do my homework in the late afternoon because that’s right after school finishes. It helps me finish assignments on time and makes me feel productive.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>do my homework</strong> <strong>in the late afternoon</strong> because that’s right after school finishes. It helps me <strong>finish assignments on time</strong> and <strong>makes me feel productive</strong>.</div>"
                },
                {
                    "q": "When do you often <span class='sub-hl'>exercise</span>?",
                    "a": "→ I usually exercise in the early morning because the air is very fresh and cool. It helps me stay healthy and makes me feel energized.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>exercise</strong> <strong>in the early morning</strong> because the air is very fresh and cool. It helps me <strong>stay healthy</strong> and <strong>makes me feel energized</strong>.</div>"
                },
                {
                    "q": "When do you often <span class='sub-hl'>go for a walk</span>?",
                    "a": "→ I usually go for a walk after dinner because it helps me digest food better. It helps me clear my mind and makes me feel refreshed.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go for a walk</strong> <strong>after dinner</strong> because it helps me digest food better. It helps me <strong>clear my mind</strong> and <strong>makes me feel refreshed</strong>.</div>"
                }
            ],
            "exQ": "When do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>listen to music</span>?",
            "exA": "→ I often listen to music in the evening because that’s when I have free time. It helps me reduce stress and makes me feel relaxed.",
            "exAFormatted": "→ I often listen to music <span class=\"sub-hl\">in the evening</span> because that’s when I have free time. It helps me <span class=\"sub-hl\">reduce stress</span> and makes me feel <span class=\"sub-hl\">relaxed</span>.",
            "vocab": [
                {
                    "type": "time",
                    "title": "Cụm Thời gian:",
                    "items": [
                        {
                            "en": "in the morning",
                            "vn": "vào buổi sáng"
                        },
                        {
                            "en": "in the afternoon",
                            "vn": "vào buổi chiều"
                        },
                        {
                            "en": "in the evening",
                            "vn": "vào buổi tối"
                        },
                        {
                            "en": "at night",
                            "vn": "vào ban đêm"
                        },
                        {
                            "en": "at weekends",
                            "vn": "vào cuối tuần"
                        },
                        {
                            "en": "on weekdays",
                            "vn": "vào các ngày trong tuần"
                        },
                        {
                            "en": "on my days off",
                            "vn": "vào những ngày nghỉ"
                        },
                        {
                            "en": "in my free time",
                            "vn": "vào thời gian rảnh rỗi"
                        },
                        {
                            "en": "after school / work",
                            "vn": "sau giờ học / làm"
                        }
                    ]
                },
                {
                    "type": "emotion",
                    "title": "Tính từ mô tả cảm xúc:",
                    "items": [
                        {
                            "en": "excited",
                            "vn": "hào hứng / phấn khích"
                        },
                        {
                            "en": "happy",
                            "vn": "vui vẻ / hạnh phúc"
                        },
                        {
                            "en": "relaxed",
                            "vn": "thư thái / thoải mái"
                        },
                        {
                            "en": "confident",
                            "vn": "tự tin"
                        },
                        {
                            "en": "refreshed",
                            "vn": "sảng khoái"
                        },
                        {
                            "en": "motivated",
                            "vn": "có động lực"
                        },
                        {
                            "en": "comfortable",
                            "vn": "dễ chịu"
                        },
                        {
                            "en": "energetic",
                            "vn": "tràn đầy năng lượng"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                }
            ]
        }
    ],
    "where": [
        {
            "title": "1. Where do you often [hoạt động – Vo]?",
            "formula": "→ I usually <strong>[hoạt động – Vo]</strong> <strong>[cụm địa điểm]</strong> because it’s very <strong>[tính từ mô tả địa điểm]</strong>. It helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
            "examples": [
                {
                    "q": "Where do you often <span class='sub-hl'>read books</span>?",
                    "a": "→ I usually read books in the school library because it’s very quiet and comfortable. It helps me focus better and study more effectively.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>read books</strong> <strong>in the school library</strong> because it’s very <strong>quiet and comfortable</strong>. It helps me <strong>focus better</strong> and <strong>study more effectively</strong>.</div>"
                },
                {
                    "q": "Where do you often <span class='sub-hl'>go shopping</span>?",
                    "a": "→ I usually go shopping at the local supermarket because it’s very convenient and well-stocked. It helps me buy necessary daily items and save time.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go shopping</strong> <strong>at the local supermarket</strong> because it’s very <strong>convenient and well-stocked</strong>. It helps me <strong>buy necessary daily items</strong> and <strong>save time</strong>.</div>"
                },
                {
                    "q": "Where do you often <span class='sub-hl'>exercise</span>?",
                    "a": "→ I usually exercise in the nearby public park because it’s very spacious and fresh. It helps me stay in good shape and reduce stress.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>exercise</strong> <strong>in the nearby public park</strong> because it’s very <strong>spacious and fresh</strong>. It helps me <strong>stay in good shape</strong> and <strong>reduce stress</strong>.</div>"
                },
                {
                    "q": "Where do you often <span class='sub-hl'>hang out with your friends</span>?",
                    "a": "→ I usually hang out with my friends at cozy coffee shops because they are very peaceful and pleasant. It helps me relax after a busy day and enjoy great conversations.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>hang out with my friends</strong> <strong>at cozy coffee shops</strong> because they are very <strong>peaceful and pleasant</strong>. It helps me <strong>relax after a busy day</strong> and <strong>enjoy great conversations</strong>.</div>"
                },
                {
                    "q": "Where do you often <span class='sub-hl'>study English</span>?",
                    "a": "→ I usually study English in my private study room because it’s very quiet and free of distractions. It helps me concentrate better and improve my pronunciation.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>study English</strong> <strong>in my private study room</strong> because it’s very <strong>quiet and free of distractions</strong>. It helps me <strong>concentrate better</strong> and <strong>improve my pronunciation</strong>.</div>"
                },
                {
                    "q": "Where do you often <span class='sub-hl'>relax</span>?",
                    "a": "→ I usually relax in my comfortable living room because it’s very cozy and peaceful. It helps me recharge my energy and clear my mind.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>relax</strong> <strong>in my comfortable living room</strong> because it’s very <strong>cozy and peaceful</strong>. It helps me <strong>recharge my energy</strong> and <strong>clear my mind</strong>.</div>"
                }
            ],
            "exQ": "Where do you often <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>read books</span>?",
            "exA": "→ I often read books in the school library because it’s very quiet. It helps me focus better and stay motivated.",
            "exAFormatted": "→ I often read books <span class=\"sub-hl\">in the school library</span> because it’s very <span class=\"sub-hl\">quiet</span>. It helps me <span class=\"sub-hl\">focus better</span> and <span class=\"sub-hl\">stay motivated</span>.",
            "vocab": [
                {
                    "type": "note",
                    "title": "📍 Cụm địa điểm:",
                    "items": [
                        {
                            "en": "in my room",
                            "vn": "ở trong phòng của tôi"
                        },
                        {
                            "en": "in the living room",
                            "vn": "ở phòng khách"
                        },
                        {
                            "en": "at a coffee shop",
                            "vn": "ở quán cà phê"
                        },
                        {
                            "en": "in the school library",
                            "vn": "trong thư viện trường"
                        },
                        {
                            "en": "at the park",
                            "vn": "ở công viên"
                        },
                        {
                            "en": "at a shopping mall",
                            "vn": "ở trung tâm thương mại"
                        },
                        {
                            "en": "in the city center",
                            "vn": "ở trung tâm thành phố"
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "Tính từ mô tả địa điểm:",
                    "items": [
                        {
                            "en": "quiet",
                            "vn": "yên tĩnh"
                        },
                        {
                            "en": "peaceful",
                            "vn": "thanh bình / yên ả"
                        },
                        {
                            "en": "spacious",
                            "vn": "rộng rãi"
                        },
                        {
                            "en": "beautiful",
                            "vn": "đẹp"
                        },
                        {
                            "en": "relaxing",
                            "vn": "thư giãn"
                        },
                        {
                            "en": "convenient",
                            "vn": "thuận tiện"
                        },
                        {
                            "en": "modern",
                            "vn": "hiện đại"
                        },
                        {
                            "en": "comfortable",
                            "vn": "thoải mái"
                        },
                        {
                            "en": "lively / bustling",
                            "vn": "sôi động / nhộn nhịp"
                        },
                        {
                            "en": "airy",
                            "vn": "thoáng mát"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                }
            ]
        }
    ],
    "why": [
        {
            "title": "1. Why do you like [hoạt động – Ving]?",
            "formula": "→ I enjoy <strong>[hoạt động – Ving]</strong> because it’s very <strong>[tính từ mô tả hoạt động]</strong>. It helps me <strong>[lợi ích 1]</strong> and makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
            "note": "LƯU Ý: Nếu không muốn mô tả cảm xúc thì có thể thay bằng 1 lợi ích khác.",
            "examples": [
                {
                    "q": "Why do you like <span class='sub-hl'>swimming</span>?",
                    "a": "→ I enjoy swimming because it’s very refreshing. It helps me stay healthy and stay in good shape, and makes me feel energetic.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>swimming</strong> because it’s very <strong>refreshing</strong>. It helps me <strong>stay healthy</strong> and <strong>stay in good shape</strong>, and makes me feel <strong>energetic</strong>.</div>"
                },
                {
                    "q": "Why do you like <span class='sub-hl'>listening to music</span>?",
                    "a": "→ I enjoy listening to music because it’s very soothing. It helps me relax after a busy day and reduce stress, and makes me feel comfortable.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>listening to music</strong> because it’s very <strong>soothing</strong>. It helps me <strong>relax after a busy day</strong> and <strong>reduce stress</strong>, and makes me feel <strong>comfortable</strong>.</div>"
                },
                {
                    "q": "Why do you like <span class='sub-hl'>reading books</span>?",
                    "a": "→ I enjoy reading books because it’s very informative. It helps me widen my knowledge and develop my imagination, and makes me feel inspired.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>reading books</strong> because it’s very <strong>informative</strong>. It helps me <strong>widen my knowledge</strong> and <strong>develop my imagination</strong>, and makes me feel <strong>inspired</strong>.</div>"
                },
                {
                    "q": "Why do you like <span class='sub-hl'>playing sports</span>?",
                    "a": "→ I enjoy playing sports because it’s very exciting. It helps me build my stamina and stay in good shape, and makes me feel motivated.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>playing sports</strong> because it’s very <strong>exciting</strong>. It helps me <strong>build my stamina</strong> and <strong>stay in good shape</strong>, and makes me feel <strong>motivated</strong>.</div>"
                },
                {
                    "q": "Why do you like <span class='sub-hl'>learning English</span>?",
                    "a": "→ I enjoy learning English because it’s very useful. It helps me explore new cultures and expand my career prospects, and makes me feel confident.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>learning English</strong> because it’s very <strong>useful</strong>. It helps me <strong>explore new cultures</strong> and <strong>expand my career prospects</strong>, and makes me feel <strong>confident</strong>.</div>"
                },
                {
                    "q": "Why do you like <span class='sub-hl'>traveling</span>?",
                    "a": "→ I enjoy traveling because it’s very memorable. It helps me have new experiences and see beautiful places, and makes me feel refreshed.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I enjoy <strong>traveling</strong> because it’s very <strong>memorable</strong>. It helps me <strong>have new experiences</strong> and <strong>see beautiful places</strong>, and makes me feel <strong>refreshed</strong>.</div>"
                }
            ],
            "exQ": "Why do you like <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>swimming</span>?",
            "exA": "→ I enjoy swimming because it’s very interesting. It helps me stay healthy and makes me feel relaxed.",
            "exAFormatted": "→ I enjoy swimming because it’s very <span class=\"sub-hl\">interesting</span>. It helps me <span class=\"sub-hl\">stay healthy</span> and makes me feel <span class=\"sub-hl\">relaxed</span>.",
            "vocab": [
                {
                    "type": "activity",
                    "title": "Tính từ mô tả hoạt động:",
                    "items": [
                        {
                            "en": "interesting",
                            "vn": "thú vị"
                        },
                        {
                            "en": "exciting",
                            "vn": "hào hứng / tuyệt vời"
                        },
                        {
                            "en": "relaxing",
                            "vn": "mang lại cảm giác thư giãn"
                        },
                        {
                            "en": "fun / enjoyable",
                            "vn": "vui vẻ / thích thú"
                        },
                        {
                            "en": "useful / beneficial",
                            "vn": "hữu ích / có ích"
                        },
                        {
                            "en": "meaningful",
                            "vn": "có ý nghĩa"
                        },
                        {
                            "en": "challenging",
                            "vn": "đầy thử thách"
                        },
                        {
                            "en": "fascinating",
                            "vn": "hấp dẫn / lôi cuốn"
                        },
                        {
                            "en": "great / wonderful",
                            "vn": "tuyệt vời"
                        }
                    ]
                },
                {
                    "type": "emotion",
                    "title": "Tính từ mô tả cảm xúc:",
                    "items": [
                        {
                            "en": "excited",
                            "vn": "hào hứng / phấn khích"
                        },
                        {
                            "en": "happy",
                            "vn": "vui vẻ / hạnh phúc"
                        },
                        {
                            "en": "relaxed",
                            "vn": "thư thái / thoải mái"
                        },
                        {
                            "en": "confident",
                            "vn": "tự tin"
                        },
                        {
                            "en": "refreshed",
                            "vn": "sảng khoái"
                        },
                        {
                            "en": "motivated",
                            "vn": "có động lực"
                        },
                        {
                            "en": "comfortable",
                            "vn": "dễ chịu"
                        },
                        {
                            "en": "energetic",
                            "vn": "tràn đầy năng lượng"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                }
            ]
        }
    ],
    "how": [
        {
            "title": "1. How do you [go/get/commute/travel] to [địa điểm]?",
            "formula": "→ I usually <strong>[go/get/commute/travel]</strong> there by <strong>[phương tiện]</strong> because it’s very <strong>[tính từ mô tả phương tiện]</strong>. It also helps me <strong>[lợi ích]</strong>.",
            "examples": [
                {
                    "q": "How do you go to school <span class='sub-hl'>every day</span>?",
                    "a": "→ I usually go to school by bus because it’s very cheap and safe. It also helps me save money.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go to school</strong> by <strong>bus</strong> because it’s very <strong>cheap and safe</strong>. It also helps me <strong>save money</strong>.</div>"
                },
                {
                    "q": "How do you <span class='sub-hl'>travel to work</span>?",
                    "a": "→ I usually travel to work by motorbike because it’s very fast and flexible. It also helps me avoid heavy traffic jams.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>travel to work</strong> by <strong>motorbike</strong> because it’s very <strong>fast and flexible</strong>. It also helps me <strong>avoid heavy traffic jams</strong>.</div>"
                },
                {
                    "q": "How do you <span class='sub-hl'>commute to university</span>?",
                    "a": "→ I usually commute to university by bicycle because it’s very economical and healthy. It also helps me do light daily exercise.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>commute to university</strong> by <strong>bicycle</strong> because it’s very <strong>economical and healthy</strong>. It also helps me <strong>do light daily exercise</strong>.</div>"
                },
                {
                    "q": "How do you <span class='sub-hl'>go to the supermarket</span>?",
                    "a": "→ I usually go to the supermarket on foot because it’s located very close to my home. It also helps me stay active and save petrol.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go to the supermarket</strong> <strong>on foot</strong> because it’s located very <strong>close to my home</strong>. It also helps me <strong>stay active and save petrol</strong>.</div>"
                },
                {
                    "q": "How do you <span class='sub-hl'>travel to other cities</span>?",
                    "a": "→ I usually travel to other cities by train because it’s very comfortable and safe. It also helps me enjoy scenic views along the journey.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>travel to other cities</strong> by <strong>train</strong> because it’s very <strong>comfortable and safe</strong>. It also helps me <strong>enjoy scenic views along the journey</strong>.</div>"
                },
                {
                    "q": "How do you <span class='sub-hl'>go around your neighborhood</span>?",
                    "a": "→ I usually go around my neighborhood by bicycle because it’s very convenient and eco-friendly. It also helps me breathe fresh air.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I usually <strong>go around my neighborhood</strong> by <strong>bicycle</strong> because it’s very <strong>convenient and eco-friendly</strong>. It also helps me <strong>breathe fresh air</strong>.</div>"
                }
            ],
            "exQ": "How do you go to <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>school</span> every day?",
            "exA": "→ I usually go to school by motorbike because it’s very fast and convenient. It also helps me save time.",
            "exAFormatted": "→ I usually go to school by <span class=\"sub-hl\">motorbike</span> because it’s very <span class=\"sub-hl\">fast and convenient</span>. It also helps me <span class=\"sub-hl\">save time</span>.",
            "vocab": [
                {
                    "type": "note",
                    "title": "🚗 [Phương tiện]:",
                    "items": [
                        {
                            "en": "motorbike",
                            "vn": "xe máy"
                        },
                        {
                            "en": "bus",
                            "vn": "xe buýt"
                        },
                        {
                            "en": "car",
                            "vn": "ô tô"
                        },
                        {
                            "en": "bicycle",
                            "vn": "xe đạp"
                        },
                        {
                            "en": "train",
                            "vn": "tàu hỏa / tàu điện"
                        }
                    ]
                },
                {
                    "type": "activity",
                    "title": "✨ [Tính từ mô tả phương tiện]:",
                    "items": [
                        {
                            "en": "fast and convenient",
                            "vn": "nhanh chóng và tiện lợi"
                        },
                        {
                            "en": "cheap and safe",
                            "vn": "rẻ và an toàn"
                        },
                        {
                            "en": "comfortable",
                            "vn": "thoải mái"
                        },
                        {
                            "en": "eco-friendly",
                            "vn": "thân thiện với môi trường"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "💡 Gợi ý [Lợi ích] (Benefits):",
                    "items": [
                        {
                            "en": "save time",
                            "vn": "tiết kiệm thời gian"
                        },
                        {
                            "en": "save money",
                            "vn": "tiết kiệm tiền"
                        },
                        {
                            "en": "avoid traffic jams",
                            "vn": "tránh kẹt xe"
                        },
                        {
                            "en": "avoid being late",
                            "vn": "tránh bị trễ giờ"
                        },
                        {
                            "en": "protect the environment",
                            "vn": "bảo vệ môi trường"
                        },
                        {
                            "en": "reduce air pollution",
                            "vn": "giảm thiểu ô nhiễm không khí"
                        },
                        {
                            "en": "feel safe from bad weather",
                            "vn": "cảm thấy an toàn trước thời tiết xấu"
                        },
                        {
                            "en": "carry a lot of things",
                            "vn": "mang theo được nhiều đồ đạc"
                        },
                        {
                            "en": "travel with my family easily",
                            "vn": "đi lại cùng gia đình dễ dàng"
                        }
                    ]
                }
            ]
        },
        {
            "title": "2. How often do you [hoạt động – Vo]?",
            "formula": "→ Although I'm busy, I try to <strong>[hoạt động – Vo]</strong> <strong>[tần suất]</strong> because it helps me <strong>[lợi ích 1]</strong> and <strong>[lợi ích 2]</strong>.",
            "examples": [
                {
                    "q": "How often do you go to the library <span class='sub-hl'>every week</span>?",
                    "a": "→ Although I have a busy schedule, I still try to go to the library twice a week because it helps me focus better and study more effectively. It also makes me feel productive.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still try to <strong>go to the library</strong> <strong>twice a week</strong> because it helps me <strong>focus better</strong> and <strong>study more effectively</strong>. It also makes me feel <strong>productive</strong>.</div>"
                },
                {
                    "q": "How often do you <span class='sub-hl'>exercise</span>?",
                    "a": "→ Although I have a busy schedule, I still try to exercise three times a week because it helps me stay in good shape and reduce stress. It also makes me feel energized.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still try to <strong>exercise</strong> <strong>three times a week</strong> because it helps me <strong>stay in good shape</strong> and <strong>reduce stress</strong>. It also makes me feel <strong>energized</strong>.</div>"
                },
                {
                    "q": "How often do you <span class='sub-hl'>read books</span>?",
                    "a": "→ Although I have a busy schedule, I still try to read books every evening because it helps me widen my knowledge and sleep better. It also makes me feel relaxed.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still try to <strong>read books</strong> <strong>every evening</strong> because it helps me <strong>widen my knowledge</strong> and <strong>sleep better</strong>. It also makes me feel <strong>relaxed</strong>.</div>"
                },
                {
                    "q": "How often do you <span class='sub-hl'>go shopping</span>?",
                    "a": "→ Although I have a busy schedule, I still try to go shopping once a week because it helps me buy necessary daily groceries. It also makes me feel comfortable.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still try to <strong>go shopping</strong> <strong>once a week</strong> because it helps me <strong>buy necessary daily groceries</strong>. It also makes me feel <strong>comfortable</strong>.</div>"
                },
                {
                    "q": "How often do you <span class='sub-hl'>watch movies</span>?",
                    "a": "→ Although I have a busy schedule, I still try to watch movies at weekends because it helps me have fun and relax after a busy day. It also makes me feel cheerful.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still try to <strong>watch movies</strong> <strong>at weekends</strong> because it helps me <strong>have fun</strong> and <strong>relax after a busy day</strong>. It also makes me feel <strong>cheerful</strong>.</div>"
                },
                {
                    "q": "How often do you <span class='sub-hl'>hang out with your friends</span>?",
                    "a": "→ Although I have a busy schedule, I still try to hang out with my friends once a month because it helps me strengthen our friendships and share life stories. It also makes me feel joyful.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still try to <strong>hang out with my friends</strong> <strong>once a month</strong> because it helps me <strong>strengthen our friendships</strong> and <strong>share life stories</strong>. It also makes me feel <strong>joyful</strong>.</div>"
                }
            ],
            "exQ": "How often do you <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>go to the library</span> every week?",
            "exA": "→ Although I’m busy, I still try to go to the library twice a week because it helps me focus better and study more effectively.",
            "exAFormatted": "→ Although I’m busy, I still try to go to the library <span class=\"sub-hl\">twice a week</span> because it helps me <span class=\"sub-hl\">focus better</span> and <span class=\"sub-hl\">study more effectively</span>.",
            "vocab": [
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                },
                {
                    "type": "time",
                    "title": "⏳ Trạng từ chỉ tần suất:",
                    "items": [
                        {
                            "en": "every day / daily",
                            "vn": "mỗi ngày"
                        },
                        {
                            "en": "once a week",
                            "vn": "một lần một tuần"
                        },
                        {
                            "en": "twice a week",
                            "vn": "hai lần một tuần"
                        },
                        {
                            "en": "three times a week",
                            "vn": "ba lần một tuần"
                        },
                        {
                            "en": "whenever I have free time",
                            "vn": "bất cứ khi nào có thời gian rảnh"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "Ghi chú từ vựng (Có trong template):",
                    "items": [
                        {
                            "en": "Although I'm busy",
                            "vn": "Mặc dù tôi bận rộn"
                        },
                        {
                            "en": "I try to",
                            "vn": "Tôi cố gắng"
                        }
                    ]
                }
            ]
        },
        {
            "title": "3. How much time do you spend [hoạt động – Ving]?",
            "formula": "→ Although I have a busy schedule, I still spend about <strong>[lượng thời gian]</strong> <strong>[hoạt động – Ving]</strong> every day because it helps me <strong>[lợi ích]</strong>. It also makes me feel <strong>[tính từ mô tả cảm xúc]</strong>.",
            "examples": [
                {
                    "q": "How much time do you spend <span class='sub-hl'>studying English</span>?",
                    "a": "→ Although I have a busy schedule, I still spend about two hours studying English every day because it helps me enrich my vocabulary and practice pronunciation. It also makes me feel confident.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>two hours</strong> <strong>studying English</strong> every day because it helps me <strong>enrich my vocabulary</strong> and <strong>practice pronunciation</strong>. It also makes me feel <strong>confident</strong>.</div>"
                },
                {
                    "q": "How much time do you spend <span class='sub-hl'>reading books</span>?",
                    "a": "→ Although I have a busy schedule, I still spend about thirty minutes reading books every day because it helps me widen my knowledge and develop my imagination. It also makes me feel inspired.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>thirty minutes</strong> <strong>reading books</strong> every day because it helps me <strong>widen my knowledge</strong> and <strong>develop my imagination</strong>. It also makes me feel <strong>inspired</strong>.</div>"
                },
                {
                    "q": "How much time do you spend <span class='sub-hl'>using social media</span>?",
                    "a": "→ Although I have a busy schedule, I still spend about one hour using social media every day because it helps me connect with friends and read daily news. It also makes me feel updated.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>one hour</strong> <strong>using social media</strong> every day because it helps me <strong>connect with friends</strong> and <strong>read daily news</strong>. It also makes me feel <strong>updated</strong>.</div>"
                },
                {
                    "q": "How much time do you spend <span class='sub-hl'>exercising</span>?",
                    "a": "→ Although I have a busy schedule, I still spend about forty-five minutes exercising every day because it helps me stay in good shape and boost my stamina. It also makes me feel energized.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>forty-five minutes</strong> <strong>exercising</strong> every day because it helps me <strong>stay in good shape</strong> and <strong>boost my stamina</strong>. It also makes me feel <strong>energized</strong>.</div>"
                },
                {
                    "q": "How much time do you spend <span class='sub-hl'>sleeping</span>?",
                    "a": "→ Although I have a busy schedule, I still spend about seven hours sleeping every day because it helps me recharge my energy and rest my brain. It also makes me feel refreshed.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>seven hours</strong> <strong>sleeping</strong> every day because it helps me <strong>recharge my energy</strong> and <strong>rest my brain</strong>. It also makes me feel <strong>refreshed</strong>.</div>"
                },
                {
                    "q": "How much time do you spend <span class='sub-hl'>doing homework</span>?",
                    "a": "→ Although I have a busy schedule, I still spend about one and a half hours doing homework every day because it helps me master lesson concepts and prepare for exams. It also makes me feel satisfied.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → Although I have a busy schedule, I still spend about <strong>one and a half hours</strong> <strong>doing homework</strong> every day because it helps me <strong>master lesson concepts</strong> and <strong>prepare for exams</strong>. It also makes me feel <strong>satisfied</strong>.</div>"
                }
            ],
            "exQ": "How much time do you spend <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>studying English</span>?",
            "exA": "→ Although I have a busy schedule, I still spend about two hours studying English every day because it helps me improve my vocabulary. It also makes me feel confident.",
            "exAFormatted": "→ Although I have a busy schedule, I still spend about <span class=\"sub-hl\">two hours</span> studying English every day because it helps me <span class=\"sub-hl\">improve my vocabulary</span>. It also makes me feel <span class=\"sub-hl\">confident</span>.",
            "vocab": [
                {
                    "type": "time",
                    "title": "⏳ Lượng thời gian:",
                    "items": [
                        {
                            "en": "about 30 minutes",
                            "vn": "khoảng 30 phút"
                        },
                        {
                            "en": "an hour",
                            "vn": "1 tiếng"
                        },
                        {
                            "en": "a couple of hours",
                            "vn": "vài tiếng"
                        },
                        {
                            "en": "two hours",
                            "vn": "hai tiếng"
                        }
                    ]
                },
                {
                    "type": "note",
                    "title": "Ghi chú từ vựng (Có trong template):",
                    "items": [
                        {
                            "en": "busy schedule",
                            "vn": "lịch trình bận rộn"
                        }
                    ]
                },
                {
                    "type": "emotion",
                    "title": "Tính từ mô tả cảm xúc:",
                    "items": [
                        {
                            "en": "excited",
                            "vn": "hào hứng / phấn khích"
                        },
                        {
                            "en": "happy",
                            "vn": "vui vẻ / hạnh phúc"
                        },
                        {
                            "en": "relaxed",
                            "vn": "thư thái / thoải mái"
                        },
                        {
                            "en": "confident",
                            "vn": "tự tin"
                        },
                        {
                            "en": "refreshed",
                            "vn": "sảng khoái"
                        },
                        {
                            "en": "motivated",
                            "vn": "có động lực"
                        },
                        {
                            "en": "comfortable",
                            "vn": "dễ chịu"
                        },
                        {
                            "en": "energetic",
                            "vn": "tràn đầy năng lượng"
                        }
                    ]
                },
                {
                    "type": "benefit",
                    "title": "Cụm Lợi ích:",
                    "items": [
                        {
                            "isNote": true,
                            "vn": "👉 (Sử dụng các cụm trong BẢNG LỢI ÍCH)"
                        }
                    ]
                }
            ]
        },
        {
            "title": "4. How much money do you spend on [thứ gì đó – noun] every month?",
            "formula": "→ I’m still a student, so I need to save money. I only spend about <strong>[số tiền]</strong> on <strong>[thứ gì đó]</strong> every month because I think it’s reasonable for me.",
            "examples": [
                {
                    "q": "How much money do you spend on <span class='sub-hl'>clothes</span> every month?",
                    "a": "→ I’m still a student, so I need to save money. I only spend about 20 dollars on clothes every month because I think it’s reasonable for me.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>20 dollars</strong> on <strong>clothes</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    "q": "How much money do you spend on <span class='sub-hl'>books</span> every month?",
                    "a": "→ I’m still a student, so I need to save money. I only spend about 15 dollars on books every month because I think it’s reasonable for me.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>15 dollars</strong> on <strong>books</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    "q": "How much money do you spend on <span class='sub-hl'>food</span> every month?",
                    "a": "→ I’m still a student, so I need to save money. I only spend about 100 dollars on food every month because I think it’s reasonable for me.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>100 dollars</strong> on <strong>food</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    "q": "How much money do you spend on <span class='sub-hl'>entertainment</span> every month?",
                    "a": "→ I’m still a student, so I need to save money. I only spend about 30 dollars on entertainment every month because I think it’s reasonable for me.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>30 dollars</strong> on <strong>entertainment</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    "q": "How much money do you spend on <span class='sub-hl'>transportation / petrol</span> every month?",
                    "a": "→ I’m still a student, so I need to save money. I only spend about 25 dollars on transportation every month because I think it’s reasonable for me.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>25 dollars</strong> on <strong>transportation</strong> every month because I think it’s reasonable for me.</div>"
                },
                {
                    "q": "How much money do you spend on <span class='sub-hl'>hobbies</span> every month?",
                    "a": "→ I’m still a student, so I need to save money. I only spend about 20 dollars on hobbies every month because I think it’s reasonable for me.",
                    "f": "<div style='margin-bottom: 8px;'><strong>- Trả lời:</strong> → I’m still a student, so I need to save money. I only spend about <strong>20 dollars</strong> on <strong>hobbies</strong> every month because I think it’s reasonable for me.</div>"
                }
            ],
            "exQ": "How much money do you spend on <span class='sub-hl' style='font-style: italic; padding: 0.05rem 0.35rem; border-radius: 4px;'>clothes</span> every month?",
            "exA": "→ I’m still a student, so I need to save money. I only spend about 20 dollars on clothes every month because I think it’s reasonable for me.",
            "exAFormatted": "→ I’m still a student, so I need to save money. I only spend about <span class=\"sub-hl\">20 dollars</span> on <span class=\"sub-hl\">clothes</span> every month because I think it’s reasonable for me.",
            "vocab": [
                {
                    "type": "note",
                    "title": "Ghi chú từ vựng:",
                    "items": [
                        {
                            "en": "save money",
                            "vn": "tiết kiệm tiền"
                        },
                        {
                            "en": "reasonable for me",
                            "vn": "hợp lý đối với tôi"
                        },
                        {
                            "en": "dollars",
                            "vn": "đô la (đơn vị tiền tệ)"
                        }
                    ]
                }
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
                        <div class="f-title" style="margin-bottom:1.5rem;">${formatTitleHighlight(item.title)}</div>
                        ${getExamplesBlockHTML(item)}
                        
                        <div class="accordion-box" onclick="this.classList.toggle('open')" style="margin-bottom: 1.25rem; border: 2px solid #3b82f6; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);">
                            <div class="accordion-header" style="padding: 1rem 1.25rem; background: rgba(59, 130, 246, 0.08);">
                                <div class="acc-title" style="color:#2563eb; font-size:1.05rem;"><i class="fa-solid fa-lightbulb"></i> GỢI Ý CÂU TRẢ LỜI</div>
                                <div class="acc-toggle" style="background:#2563eb;"><span class="txt-close"><i class="fa-solid fa-hand-pointer"></i> Nhấn để xem gợi ý câu trả lời ▼</span><span class="txt-open"><i class="fa-solid fa-chevron-up"></i> Thu gọn ▲</span></div>
                            </div>
                            <div class="accordion-content" onclick="event.stopPropagation()">
                                <div class="f-formula-box" style="margin: 0; border: none; background: transparent; padding: 0.5rem 0;">${formatFormulaHighlight(item.formula)}</div>
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
        let choiceMap = {};

        pool.forEach(item => {
            if (item.examples && item.examples.length > 0) {
                item.examples.forEach(ex => {
                    let cleanQ = ex.q.replace(/<[^>]*>/g, '').trim();
                    
                    if (type === 'choice') {
                        if (choiceMap[cleanQ]) {
                            // Combine Cách 1 and Cách 2
                            let existing = choiceMap[cleanQ];
                            let f1 = existing.exAFormatted;
                            let f2 = ex.f;
                            
                            existing.exAFormatted = `<div style="margin-bottom: 12px;"><div style="color:#2563eb; font-weight:bold; margin-bottom:4px;">🎯 CÁCH 1 (Chọn 1 trong 2):</div>${f1}</div><div><div style="color:#16a34a; font-weight:bold; margin-bottom:4px;">🎯 CÁCH 2 (Cả 2 đều quan trọng):</div>${f2}</div>`;
                            existing.exA = existing.exA + " OR " + ex.a;
                            // Clear formula since it varies by Cách
                            existing.formula = "Hãy tham khảo 2 cách trả lời mẫu bên dưới.";
                        } else {
                            let newEx = { 
                                ...item, 
                                exQ: ex.q, 
                                originalQ: item.exQ || item.title,
                                exAFormatted: ex.f, 
                                exA: ex.a 
                            };
                            choiceMap[cleanQ] = newEx;
                            flattenedPool.push(newEx);
                        }
                    } else {
                        flattenedPool.push({ 
                            ...item, 
                            exQ: ex.q, 
                            originalQ: item.exQ || item.title,
                            exAFormatted: ex.f, 
                            exA: ex.a 
                        });
                    }
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
    
    const sfx = window.sfx = {
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

    window.flipFlashcard = (containerEl, wordEn) => {
        if (!containerEl) return;
        const card = containerEl.querySelector('.flashcard');
        if (!card) return;
        if (!card.classList.contains('flipped')) {
            try { if (window.sfx && window.sfx.flip) window.sfx.flip(); } catch(e) {}
            card.classList.add('flipped');
            if (typeof window.speakText === 'function' && wordEn) {
                window.speakText(wordEn);
            }
        } else {
            card.classList.remove('flipped');
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
            const enEl = container.querySelector('.vocab-en') || container.querySelector('strong');
            const vnEl = container.querySelector('.vocab-vn') || (enEl ? enEl.nextElementSibling : null);
            if (enEl && vnEl) {
                currentWords.push({
                    en: enEl.textContent.trim(),
                    vn: vnEl.textContent.trim()
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
        
        if (type === 'flashcards' || type === 'flashcard') {
            initFlashcards(words, content, tabId);
        } else if (type === 'matching' || type === 'match') {
            initMatchingGame(words, content, tabId);
        } else if (type === 'quiz') {
            initQuizGame(words, content, tabId);
        } else if (type === 'spelling') {
            initSpellingGame(words, content, tabId);
        }
    };

    function initFlashcards(allWords, container, tabId) {
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
                    <div class="flashcard-container" onclick="flipFlashcard(this, '${word.en.replace(/'/g, "\\'")}')">
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

    function initMatchingGame(allWords, container, tabId) {
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

    function initQuizGame(allWords, container, tabId) {
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

    function initSpellingGame(allWords, container, tabId) {
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
        console.error('JS Error: ', e);
    }
});




window.switchSubTab = function(tabId, btnElement) {
    document.querySelectorAll('.subtab-pane').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('active');
        el.style.display = 'none';
    });
    const target = document.getElementById('subtab-' + tabId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
        target.style.display = 'block';
    }
    
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'var(--primary)';
        btn.style.boxShadow = 'none';
    });
    
    const activeBtn = btnElement || (window.event && window.event.currentTarget) || document.querySelector(`.sub-tab-btn[onclick*="${tabId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = 'var(--primary)';
        activeBtn.style.color = '#ffffff';
        activeBtn.style.boxShadow = '0 4px 12px rgba(67, 97, 238, 0.3)';
    }
};

// =========================================================
// 8. PRACTICE BY TOPIC (60 TOPICS - PART 1)
// =========================================================
const practiceTopicsData = [
    {
        id: 1,
        title: "Topic 01: Let's talk about hobbies",
        topicName: "Hobbies",
        introText: "Now, in Part 1, I'd like to ask you some questions about yourself. Let's talk about hobbies.",
        questions: [
            {
                qNum: 1,
                question: "What hobbies do you have?",
                qType: "Wh-question: What [noun] do you like / have?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Nói về 1 sở thích yêu thích nhất):</div>
                    <div class="topic-formula-text">
                        → My favorite hobby is <span class="formula-bracket-hl">[hoạt động – Ving]</span> because it’s <span class="formula-bracket-hl">[tính từ mô tả hoạt động]</span>. It helps me <span class="formula-bracket-hl">[lợi ích]</span> and makes me feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Nói về hoạt động thường làm lúc rảnh rỗi):</div>
                    <div class="topic-formula-text">
                        → In my free time, I usually <span class="formula-bracket-hl">[hoạt động 1 – Vo]</span> because it helps me <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>. I also <span class="formula-bracket-hl">[hoạt động 2 – Vo]</span> to <span class="formula-bracket-hl">[lợi ích 3]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        type: "note",
                        title: "🎯 [Sở thích / Hoạt động]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('activities')" style="background: none; border: none; padding: 0; color: #3b82f6; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Hoạt Động</button> <em>(Lưu ý: Cách 1 dùng dạng V-ing, Cách 2 dùng dạng Vo)</em>.`
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em>.`
                    },
                    {
                        title: "✨ [Tính từ mô tả hoạt động]:",
                        items: [
                            { en: "interesting", vn: "thú vị" },
                            { en: "exciting", vn: "hào hứng / tuyệt vời" },
                            { en: "relaxing", vn: "mang lại cảm giác thư giãn" },
                            { en: "fun / enjoyable", vn: "vui vẻ / thích thú" },
                            { en: "useful / beneficial", vn: "hữu ích / có ích" },
                            { en: "meaningful", vn: "có ý nghĩa" },
                            { en: "challenging", vn: "đầy thử thách" },
                            { en: "fascinating", vn: "hấp dẫn / lôi cuốn" },
                            { en: "great / wonderful", vn: "tuyệt vời" }
                        ]
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc]:",
                        items: [
                            { en: "excited", vn: "hào hứng / phấn khích" },
                            { en: "happy", vn: "vui vẻ / hạnh phúc" },
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "confident", vn: "tự tin" },
                            { en: "refreshed", vn: "sảng khoái" },
                            { en: "motivated", vn: "có động lực" },
                            { en: "comfortable", vn: "dễ chịu" },
                            { en: "energetic", vn: "tràn đầy năng lượng" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Theo sở thích yêu thích)",
                        text: "My favorite hobby is listening to music because it’s relaxing. It helps me reduce stress and makes me feel happy.",
                        formatted: `→ My favorite hobby is <span class="sub-hl">listening to music</span> because it’s <span class="sub-hl">relaxing</span>. It helps me <span class="sub-hl">reduce stress</span> and makes me feel <span class="sub-hl">happy</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Theo thói quen lúc rảnh)",
                        text: "In my free time, I usually read books because it helps me relax after a busy day and widen my knowledge. I also listen to music to clear my mind.",
                        formatted: `→ In my free time, I usually <span class="sub-hl">read books</span> because it helps me <span class="sub-hl">relax after a busy day</span> and <span class="sub-hl">widen my knowledge</span>. I also <span class="sub-hl">listen to music</span> to <span class="sub-hl">clear my mind</span>.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "Who do you usually do your hobbies with?",
                qType: "Wh-question: Who do you often [hoạt động – Vo] with?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Làm cùng bạn bè / người thân):</div>
                    <div class="topic-formula-text">
                        → I often do my hobbies with my <span class="formula-bracket-hl">[đối tượng]</span> because <span class="formula-bracket-hl">[lý do]</span>. It’s more <span class="formula-bracket-hl">[tính từ mô tả trải nghiệm]</span> when we spend time together.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Làm một mình khi cần yên tĩnh):</div>
                    <div class="topic-formula-text">
                        → Actually, I prefer doing my hobbies alone because it’s <span class="formula-bracket-hl">[tính từ mô tả không gian]</span>. It helps me <span class="formula-bracket-hl">[lợi ích]</span> and makes me feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "👥 [Người cùng làm] (Cách 1):",
                        items: [
                            { en: "my best friend", vn: "bạn thân nhất của tôi" },
                            { en: "my close friend", vn: "bạn thân của tôi" },
                            { en: "my brother / sister", vn: "anh/chị/em của tôi" },
                            { en: "my family", vn: "gia đình tôi" }
                        ]
                    },
                    {
                        title: "💡 [Lý do] (Cách 1):",
                        items: [
                            { en: "we have the same hobbies", vn: "chúng tôi có cùng sở thích" },
                            { en: "we are very close", vn: "chúng tôi rất thân thiết" },
                            { en: "we understand each other well", vn: "chúng tôi rất hiểu nhau" },
                            { en: "we both like this activity", vn: "cả hai chúng tôi đều thích hoạt động này" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả trải nghiệm cùng nhau] (Cách 1):",
                        items: [
                            { en: "fun / enjoyable", vn: "vui vẻ / thích thú" },
                            { en: "exciting", vn: "hào hứng / sôi nổi" },
                            { en: "meaningful", vn: "có ý nghĩa" },
                            { en: "memorable", vn: "đáng nhớ" },
                            { en: "interesting", vn: "thú vị" },
                            { en: "great / wonderful", vn: "tuyệt vời" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả không gian] (Cách 2):",
                        items: [
                            { en: "quiet", vn: "yên tĩnh" },
                            { en: "peaceful", vn: "bình yên / thanh bình" },
                            { en: "comfortable", vn: "thoải mái / dễ chịu" },
                            { en: "cozy", vn: "ấm cúng" },
                            { en: "spacious", vn: "rộng rãi" },
                            { en: "airy", vn: "thoáng đãng / thoáng mát" },
                            { en: "private", vn: "riêng tư" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Lợi ích khi làm một mình] (Cách 2):",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> <em>(Ví dụ: clear my mind, focus better...)</em>.`
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc] (Cách 2):",
                        items: [
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "comfortable", vn: "dễ chịu" },
                            { en: "peaceful", vn: "bình yên / thanh thản" },
                            { en: "refreshed", vn: "sảng khoái" },
                            { en: "happy", vn: "vui vẻ / hạnh phúc" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Làm cùng bạn bè / người thân)",
                        text: "I often do my hobbies with my best friend because we have the same hobbies. It’s more fun when we spend time together.",
                        formatted: `→ I often do my hobbies with <span class="sub-hl">my best friend</span> because <span class="sub-hl">we have the same hobbies</span>. It’s more <span class="sub-hl">fun</span> when we spend time together.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Làm một mình)",
                        text: "Actually, I prefer doing my hobbies alone because it’s quiet. It helps me clear my mind and makes me feel relaxed.",
                        formatted: `→ Actually, I prefer doing my hobbies <span class="sub-hl">alone</span> because it’s <span class="sub-hl">quiet</span>. It helps me <span class="sub-hl">clear my mind</span> and makes me feel <span class="sub-hl">relaxed</span>.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "How much time do you spend on your hobbies?",
                qType: "Wh-question: How much time do you spend on [noun] / [V-ing]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Đơn giản, trực tiếp nhất):</div>
                    <div class="topic-formula-text">
                        → I usually spend about <span class="formula-bracket-hl">[khoảng thời gian]</span> <span class="formula-bracket-hl">[thời điểm]</span> on my hobbies because it helps me <span class="formula-bracket-hl">[lợi ích]</span>. It also makes me feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc có Although - chuẩn bài học):</div>
                    <div class="topic-formula-text">
                        → Although I have a busy schedule, I still spend about <span class="formula-bracket-hl">[khoảng thời gian]</span> on my hobbies every day because it helps me <span class="formula-bracket-hl">[lợi ích]</span>. It also makes me feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "⏰ [Khoảng thời gian]:",
                        items: [
                            { en: "thirty minutes", vn: "30 phút" },
                            { en: "half an hour", vn: "nửa tiếng / 30 phút" },
                            { en: "one hour", vn: "1 tiếng" },
                            { en: "two hours", vn: "2 tiếng" }
                        ]
                    },
                    {
                        title: "📅 [Thời điểm]:",
                        items: [
                            { en: "every day", vn: "mỗi ngày" },
                            { en: "in the evening", vn: "vào buổi tối" },
                            { en: "at weekends", vn: "vào cuối tuần" },
                            { en: "in my free time", vn: "vào thời gian rảnh" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> <em>(Ví dụ: relax after a long day, relax after a busy day, reduce stress, clear my mind, recharge my energy...)</em>.`
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc]:",
                        items: [
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "refreshed", vn: "sảng khoái" },
                            { en: "happy", vn: "vui vẻ / hạnh phúc" },
                            { en: "energetic", vn: "tràn đầy năng lượng" },
                            { en: "comfortable", vn: "dễ chịu" },
                            { en: "excited", vn: "hào hứng / phấn khích" },
                            { en: "confident", vn: "tự tin" },
                            { en: "motivated", vn: "có động lực" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Đơn giản)",
                        text: "I usually spend about one hour in the evening on my hobbies because it helps me reduce stress. It also makes me feel relaxed.",
                        formatted: `→ I usually spend about <span class="sub-hl">one hour</span> <span class="sub-hl">in the evening</span> on my hobbies because it helps me <span class="sub-hl">reduce stress</span>. It also makes me feel <span class="sub-hl">relaxed</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Mẫu có Although)",
                        text: "Although I have a busy schedule, I still spend about one hour on my hobbies every day because it helps me relax after a busy day. It also makes me feel refreshed.",
                        formatted: `→ Although I have a busy schedule, I still spend about <span class="sub-hl">one hour</span> on my hobbies <span class="sub-hl">every day</span> because it helps me <span class="sub-hl">relax after a busy day</span>. It also makes me feel <span class="sub-hl">refreshed</span>.`
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Chủ đề 02: Let's talk about video games",
        introText: "Let’s talk about video games.",
        questions: [
            {
                qNum: 1,
                question: "What video game do you often play?",
                qType: "Wh-question: What [noun] do you often [Vo]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Nêu trực tiếp tên trò chơi yêu thích & tính chất):</div>
                    <div class="topic-formula-text">
                        → I’m a big fan of <span class="formula-bracket-hl">[tên trò chơi điện tử]</span> because it’s very <span class="formula-bracket-hl">[tính từ mô tả trò chơi]</span>. I often play it in my free time, especially <span class="formula-bracket-hl">[thời điểm cụ thể]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Nêu thiết bị chơi & người chơi cùng để giải trí):</div>
                    <div class="topic-formula-text">
                        → Whenever I have free time, I love playing <span class="formula-bracket-hl">[tên trò chơi điện tử]</span> on my <span class="formula-bracket-hl">[thiết bị]</span> with <span class="formula-bracket-hl">[người chơi cùng]</span>. It’s a wonderful way to <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🎮 [Tên trò chơi điện tử phổ biến]:",
                        items: [
                            { en: "FIFA", vn: "trò chơi bóng đá FIFA" },
                            { en: "Minecraft", vn: "trò chơi xây dựng thế giới Minecraft" },
                            { en: "League of Legends", vn: "Liên Minh Huyền Thoại (LOL)" },
                            { en: "PUBG", vn: "trò chơi bắn súng sinh tồn PUBG" },
                            { en: "Candy Crush", vn: "trò chơi giải đố xếp kẹo Candy Crush" },
                            { en: "online chess", vn: "cờ vua trực tuyến" }
                        ]
                    },
                    {
                        title: "📱 [Thiết bị chơi game] (Dành cho Cách 2):",
                        items: [
                            { en: "smartphone", vn: "điện thoại thông minh" },
                            { en: "laptop / computer", vn: "máy tính xách tay / máy vi tính" },
                            { en: "iPad / tablet", vn: "máy tính bảng" }
                        ]
                    },
                    {
                        title: "👥 [Người chơi cùng] (Dành cho Cách 2):",
                        items: [
                            { en: "my close friends", vn: "bạn thân của tôi" },
                            { en: "my brother / sister", vn: "anh/chị/em của tôi" },
                            { en: "other online players", vn: "những người chơi khác trên mạng" },
                            { en: "by myself / alone", vn: "chơi một mình" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả trò chơi] (Cách 1):",
                        items: [
                            { en: "exciting", vn: "hào hứng / sôi nổi" },
                            { en: "relaxing", vn: "mang lại cảm giác thư giãn" },
                            { en: "interesting", vn: "thú vị" },
                            { en: "fun / enjoyable", vn: "vui vẻ / thích thú" },
                            { en: "entertaining", vn: "mang tính giải trí cao" },
                            { en: "challenging", vn: "đầy thử thách" }
                        ]
                    },
                    {
                        title: "📅 [Thời điểm cụ thể] (Cách 1):",
                        items: [
                            { en: "at the weekend", vn: "vào cuối tuần" },
                            { en: "in the evening", vn: "vào buổi tối" },
                            { en: "after school", vn: "sau giờ học" },
                            { en: "in my free time", vn: "vào thời gian rảnh" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (FIFA - Trò chơi bóng đá sôi nổi vào cuối tuần)",
                        text: "I’m a big fan of FIFA because it’s very exciting. I often play it in my free time, especially at the weekend.",
                        formatted: `→ I’m a big fan of <span class="sub-hl">FIFA</span> because it’s very <span class="sub-hl">exciting</span>. I often play it in my free time, especially <span class="sub-hl">at the weekend</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cờ vua trực tuyến trên điện thoại cùng bạn bè)",
                        text: "Whenever I have free time, I love playing online chess on my smartphone with my close friends. It’s a wonderful way to relax after a busy day.",
                        formatted: `→ Whenever I have free time, I love playing <span class="sub-hl">online chess</span> on my <span class="sub-hl">smartphone</span> with <span class="sub-hl">my close friends</span>. It’s a wonderful way to <span class="sub-hl">relax after a busy day</span>.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "Why do you often play that game?",
                qType: "Wh-question: Why do you often [Vo]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Dùng cấu trúc it helps me... and makes me feel...):</div>
                    <div class="topic-formula-text">
                        → I often play that game because it helps me <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>. It also makes me feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Dùng cấu trúc The main reason is that it's a great way to...):</div>
                    <div class="topic-formula-text">
                        → The main reason is that it’s a great way to <span class="formula-bracket-hl">[lợi ích 1]</span>. Besides, playing that game also helps me <span class="formula-bracket-hl">[lợi ích 2]</span> and feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>relax after a busy day, reduce stress, clear my mind, pass the time, have fun, boost my concentration...</em>).`
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc]:",
                        items: [
                            { en: "comfortable", vn: "dễ chịu / thoải mái" },
                            { en: "happy", vn: "vui vẻ / hạnh phúc" },
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "excited", vn: "hào hứng / phấn khích" },
                            { en: "refreshed", vn: "sảng khoái" },
                            { en: "energetic", vn: "tràn đầy năng lượng" },
                            { en: "motivated", vn: "có động lực" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Giúp thư giãn & vui vẻ)",
                        text: "I often play that game because it helps me relax after a busy day and have fun. It also makes me feel comfortable.",
                        formatted: `→ I often play that game because it helps me <span class="sub-hl">relax after a busy day</span> and <span class="sub-hl">have fun</span>. It also makes me feel <span class="sub-hl">comfortable</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Giảm stress & giết thời gian)",
                        text: "The main reason is that it’s a great way to reduce stress. Besides, playing that game also helps me pass the time and feel happy.",
                        formatted: `→ The main reason is that it’s a great way to <span class="sub-hl">reduce stress</span>. Besides, playing that game also helps me <span class="sub-hl">pass the time</span> and feel <span class="sub-hl">happy</span>.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "Do you prefer playing video games alone or with friends? Why?",
                qType: "Choice question: Do you prefer [option 1] or [option 2]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Cấu trúc chọn trực tiếp & dứt khoát):</div>
                    <div class="topic-formula-text">
                        → I prefer playing video games <span class="formula-bracket-hl">[alone / with friends]</span> because it’s more <span class="formula-bracket-hl">[tính từ so sánh hơn]</span>. It allows <span class="formula-bracket-hl">[me / us]</span> to <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc so sánh nhượng bộ có Although - Điểm cao hơn):</div>
                    <div class="topic-formula-text">
                        → Although playing <span class="formula-bracket-hl">[with friends / alone]</span> is <span class="formula-bracket-hl">[tính từ]</span>, I still prefer playing <span class="formula-bracket-hl">[alone / with friends]</span> because it’s much more <span class="formula-bracket-hl">[tính từ so sánh hơn]</span>. It helps <span class="formula-bracket-hl">[me / us]</span> <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "✨ [Tính từ so sánh hơn (more + tính từ)]:",
                        items: [
                            { en: "more relaxing", vn: "thư giãn hơn" },
                            { en: "more exciting", vn: "hào hứng / sôi nổi hơn" },
                            { en: "more fun / enjoyable", vn: "vui vẻ / thích thú hơn" },
                            { en: "more comfortable", vn: "thoải mái hơn" },
                            { en: "more challenging", vn: "thử thách hơn" },
                            { en: "more competitive", vn: "mang tính cạnh tranh hơn" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Lợi ích khi chơi một mình]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> (Ví dụ: <em>focus better on the game, relax more, clear my mind, play at my own pace...</em>).`
                    },
                    {
                        type: "note",
                        title: "👥 [Lợi ích khi chơi cùng bạn bè]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> (Ví dụ: <em>talk and laugh together, have more fun, connect with friends, learn to work with others...</em>).`
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Cấu trúc trực tiếp - Chọn chơi cùng bạn bè)",
                        text: "I prefer playing video games with friends because it’s more exciting. It allows us to talk and laugh together and have more fun.",
                        formatted: `→ I prefer <span class="sub-hl">playing video games with friends</span> because it’s more <span class="sub-hl">exciting</span>. It allows us to <span class="sub-hl">talk and laugh together</span> and <span class="sub-hl">have more fun</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cấu trúc nhượng bộ Although - Chọn chơi một mình)",
                        text: "Although playing with friends is quite fun, I still prefer playing video games alone because it’s much more relaxing. It helps me focus better on the game and clear my mind.",
                        formatted: `→ Although <span class="sub-hl">playing with friends is quite fun</span>, I still prefer <span class="sub-hl">playing video games alone</span> because it’s much more <span class="sub-hl">relaxing</span>. It helps me <span class="sub-hl">focus better on the game</span> and <span class="sub-hl">clear my mind</span>.`
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Chủ đề 03: Let's talk about books",
        introText: "Let’s talk about books.",
        questions: [
            {
                qNum: 1,
                question: "What is your favorite book?",
                qType: "Wh-question: What is your favorite [noun]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Nêu trực tiếp tên cuốn sách yêu thích & lý do):</div>
                    <div class="topic-formula-text">
                        → I’m a big fan of <span class="formula-bracket-hl">[tên quyển sách]</span>. I like it because it’s very <span class="formula-bracket-hl">[tính từ mô tả quyển sách]</span>. It always helps me <span class="formula-bracket-hl">[lợi ích]</span> and makes me feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span> whenever I read it.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Nêu thể loại sách yêu thích trước, rồi dẫn tới cuốn sách tâm đắc nhất):</div>
                    <div class="topic-formula-text">
                        → To be honest, I really enjoy reading <span class="formula-bracket-hl">[thể loại sách]</span>, and my all-time favorite is <span class="formula-bracket-hl">[tên quyển sách]</span>. The main reason is that it provides a lot of valuable lessons and helps me <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "📖 [Tên quyển sách phổ biến]:",
                        items: [
                            { en: "Harry Potter", vn: "truyện ma thuật Harry Potter" },
                            { en: "Sherlock Holmes", vn: "truyện trinh thám Sherlock Holmes" },
                            { en: "Doraemon", vn: "truyện tranh Doraemon" },
                            { en: "The Little Prince", vn: "Hoàng tử bé" },
                            { en: "How to Win Friends and Influence People", vn: "sách Đắc Nhân Tâm" }
                        ]
                    },
                    {
                        title: "📚 [Thể loại sách] (Dành cho Cách 2):",
                        items: [
                            { en: "self-help books", vn: "sách kỹ năng sống / phát triển bản thân" },
                            { en: "detective stories", vn: "truyện trinh thám" },
                            { en: "comic books", vn: "truyện tranh" },
                            { en: "science fiction novels", vn: "tiểu thuyết khoa học viễn tưởng" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả quyển sách] (Cách 1):",
                        items: [
                            { en: "exciting", vn: "hào hứng / lôi cuốn" },
                            { en: "interesting", vn: "thú vị" },
                            { en: "meaningful", vn: "ý nghĩa / sâu sắc" },
                            { en: "fascinating", vn: "hấp dẫn / cuốn hút" },
                            { en: "inspiring", vn: "truyền cảm hứng" },
                            { en: "relaxing", vn: "mang lại cảm giác thư giãn" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>reduce stress, widen my knowledge, clear my mind, learn new things, develop my imagination...</em>).`
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc] (Cách 1):",
                        items: [
                            { en: "happy", vn: "vui vẻ / hạnh phúc" },
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "comfortable", vn: "dễ chịu" },
                            { en: "motivated", vn: "có thêm động lực" },
                            { en: "refreshed", vn: "sảng khoái / tươi mới" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Nêu sách Harry Potter - Lôi cuốn & Giảm stress)",
                        text: "I’m a big fan of Harry Potter. I like it because it’s very exciting. It always helps me reduce stress and makes me feel happy whenever I read it.",
                        formatted: `→ I’m a big fan of <span class="sub-hl">Harry Potter</span>. I like it because it’s very <span class="sub-hl">exciting</span>. It always helps me <span class="sub-hl">reduce stress</span> and makes me feel <span class="sub-hl">happy</span> whenever I read it.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Nêu thể loại kỹ năng sống & Đắc Nhân Tâm)",
                        text: "To be honest, I really enjoy reading self-help books, and my all-time favorite is How to Win Friends and Influence People. The main reason is that it provides a lot of valuable lessons and helps me widen my knowledge.",
                        formatted: `→ To be honest, I really enjoy reading <span class="sub-hl">self-help books</span>, and my all-time favorite is <span class="sub-hl">How to Win Friends and Influence People</span>. The main reason is that it provides a lot of <span class="sub-hl">valuable lessons</span> and helps me <span class="sub-hl">widen my knowledge</span>.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "Do you prefer reading paper books or electronic books?",
                qType: "Choice question: Do you prefer [option 1] or [option 2]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Cấu trúc chọn trực tiếp & dứt khoát):</div>
                    <div class="topic-formula-text">
                        → I prefer <span class="formula-bracket-hl">[lựa chọn: reading electronic books / reading paper books]</span>. It’s more <span class="formula-bracket-hl">[tính từ so sánh hơn]</span>, so I can <span class="formula-bracket-hl">[lợi ích 1]</span>. It’s also a good way to <span class="formula-bracket-hl">[lợi ích 2]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc so sánh nhượng bộ có Although - Điểm cao hơn):</div>
                    <div class="topic-formula-text">
                        → Although <span class="formula-bracket-hl">[đối tượng kia: paper books / electronic books]</span> are <span class="formula-bracket-hl">[tính từ]</span>, I still prefer <span class="formula-bracket-hl">[đối tượng mình chọn]</span> because it is much more <span class="formula-bracket-hl">[tính từ so sánh hơn]</span>. It helps me <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "✨ [Tính từ so sánh hơn (more + tính từ)]:",
                        items: [
                            { en: "more convenient", vn: "tiện lợi hơn" },
                            { en: "more comfortable", vn: "thoải mái / dễ chịu hơn" },
                            { en: "more interesting", vn: "thú vị hơn" },
                            { en: "more relaxing", vn: "thư giãn hơn" },
                            { en: "more economical", vn: "tiết kiệm hơn" }
                        ]
                    },
                    {
                        title: "📱 [Lợi ích khi đọc sách điện tử - E-books]:",
                        items: [
                            { en: "read anywhere", vn: "đọc ở bất cứ đâu" },
                            { en: "save time", vn: "tiết kiệm thời gian" },
                            { en: "carry many books easily", vn: "mang theo nhiều sách dễ dàng" },
                            { en: "save money", vn: "tiết kiệm tiền mua sách" }
                        ]
                    },
                    {
                        title: "📖 [Lợi ích khi đọc sách giấy - Paper books]:",
                        items: [
                            { en: "focus better", vn: "tập trung tốt hơn" },
                            { en: "protect my eyes", vn: "bảo vệ mắt" },
                            { en: "avoid distractions", vn: "tránh bị phân tâm / xao nhãng" },
                            { en: "feel the real pages", vn: "cảm nhận mùi giấy và trang sách thật" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Cấu trúc trực tiếp - Chọn sách điện tử)",
                        text: "I prefer reading electronic books. It’s more convenient, so I can read anywhere. It’s also a good way to save time.",
                        formatted: `→ I prefer <span class="sub-hl">reading electronic books</span>. It’s more <span class="sub-hl">convenient</span>, so I can <span class="sub-hl">read anywhere</span>. It’s also a good way to <span class="sub-hl">save time</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cấu trúc nhượng bộ Although - Chọn sách giấy)",
                        text: "Although electronic books are very convenient, I still prefer reading paper books because they are more comfortable for my eyes. They help me focus better and avoid distractions.",
                        formatted: `→ Although <span class="sub-hl">electronic books are very convenient</span>, I still prefer <span class="sub-hl">reading paper books</span> because they are more <span class="sub-hl">comfortable for my eyes</span>. They help me <span class="sub-hl">focus better</span> and <span class="sub-hl">avoid distractions</span>.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "What kinds of books do teenagers in your country enjoy reading?",
                qType: "Wh-question: What kinds of [noun] do [people] enjoy [Ving]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Nêu thể loại sách giải trí - truyện tranh / tiểu thuyết):</div>
                    <div class="topic-formula-text">
                        → Teenagers in my country often read <span class="formula-bracket-hl">[thể loại sách]</span>. These books are <span class="formula-bracket-hl">[tính từ mô tả]</span>, so they’re very popular. They help young people <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Nêu thể loại sách phát triển bản thân / kỹ năng):</div>
                    <div class="topic-formula-text">
                        → Most teenagers in my country love reading <span class="formula-bracket-hl">[thể loại sách]</span> because they are very <span class="formula-bracket-hl">[tính từ mô tả]</span>. Reading them is a great way to <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "📚 [Thể loại sách thanh thiếu niên yêu thích]:",
                        items: [
                            { en: "comic books", vn: "truyện tranh" },
                            { en: "novel / fiction books", vn: "tiểu thuyết / truyện viễn tưởng" },
                            { en: "self-help books", vn: "sách kỹ năng / phát triển bản thân" },
                            { en: "detective stories", vn: "truyện trinh thám" },
                            { en: "science books", vn: "sách khoa học khám phá" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả sách]:",
                        items: [
                            { en: "interesting", vn: "thú vị" },
                            { en: "exciting", vn: "hấp dẫn / kịch tính" },
                            { en: "useful / helpful", vn: "hữu ích" },
                            { en: "entertaining", vn: "mang tính giải trí cao" },
                            { en: "inspiring", vn: "truyền cảm hứng" }
                        ]
                    },
                    {
                        title: "⭐ [Lợi ích mang lại cho giới trẻ]:",
                        items: [
                            { en: "relax after studying hard", vn: "thư giãn sau khi học tập vất vả" },
                            { en: "reduce study pressure", vn: "giảm bớt áp lực học tập" },
                            { en: "widen their knowledge", vn: "mở rộng hiểu biết" },
                            { en: "develop their imagination", vn: "phát triển trí tưởng tượng" },
                            { en: "learn useful skills", vn: "học thêm các kỹ năng hữu ích" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Truyện tranh - Thú vị & Thư giãn sau giờ học)",
                        text: "Teenagers in my country often read comic books. These books are interesting, so they’re very popular. They help young people relax after studying hard.",
                        formatted: `→ Teenagers in my country often read <span class="sub-hl">comic books</span>. These books are <span class="sub-hl">interesting</span>, so they’re very popular. They help young people <span class="sub-hl">relax after studying hard</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Sách kỹ năng - Hữu ích & Mở rộng kiến thức)",
                        text: "Most teenagers in my country love reading self-help books because they are very useful. Reading them is a great way to widen their knowledge and learn useful skills.",
                        formatted: `→ Most teenagers in my country love reading <span class="sub-hl">self-help books</span>. These books are <span class="sub-hl">useful</span>, so they’re very popular. They help young people <span class="sub-hl">widen their knowledge</span> and <span class="sub-hl">learn useful skills</span>.`
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "Chủ đề 04: Let's talk about listening to the radio",
        introText: "Let’s talk about listening to the radio.",
        questions: [
            {
                qNum: 1,
                question: "Do you often listen to the radio?",
                qType: "Yes/No question: Do you often [Vo]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Trả lời CÓ - Thường xuyên nghe đài để cập nhật tin tức & thư giãn):</div>
                    <div class="topic-formula-text">
                        → Yes, I do. I often listen to the radio <span class="formula-bracket-hl">[thời điểm]</span> because it helps me <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>. It also makes me feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Trả lời KHÔNG / HIẾM KHI - Thích dùng điện thoại / podcast hơn):</div>
                    <div class="topic-formula-text">
                        → To be honest, not really. I rarely listen to the radio because I prefer <span class="formula-bracket-hl">[hoạt động thay thế trên điện thoại]</span>. It’s much more <span class="formula-bracket-hl">[tính từ so sánh hơn]</span> for me.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "📅 [Thời điểm nghe đài] (Cách 1):",
                        items: [
                            { en: "in the morning", vn: "vào buổi sáng" },
                            { en: "in the evening", vn: "vào buổi tối" },
                            { en: "when driving to work", vn: "khi lái xe đi làm" },
                            { en: "in my free time", vn: "vào thời gian rảnh" },
                            { en: "before going to bed", vn: "trước khi đi ngủ" }
                        ]
                    },
                    {
                        title: "⭐ [Cụm Lợi ích khi nghe đài] (Cách 1):",
                        items: [
                            { en: "get the news", vn: "nắm bắt tin tức thời sự" },
                            { en: "relax after a busy day", vn: "thư giãn sau ngày bận rộn" },
                            { en: "reduce stress", vn: "giảm bớt căng thẳng" },
                            { en: "clear my mind", vn: "giải tỏa tâm trí" },
                            { en: "pass the time", vn: "giải trí / giết thời gian" }
                        ]
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc] (Cách 1):",
                        items: [
                            { en: "refreshed", vn: "sảng khoái / tươi mới" },
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "comfortable", vn: "dễ chịu" },
                            { en: "informed", vn: "am hiểu / nắm bắt thông tin" }
                        ]
                    },
                    {
                        title: "📱 [Hoạt động thay thế trên điện thoại] (Cách 2):",
                        items: [
                            { en: "listening to music on my smartphone", vn: "nghe nhạc trên điện thoại thông minh" },
                            { en: "listening to podcasts on Spotify", vn: "nghe podcast trên Spotify" },
                            { en: "watching videos on YouTube", vn: "xem video trên YouTube" },
                            { en: "reading online news", vn: "đọc báo mạng / lướt tin tức trực tuyến" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ so sánh hơn - Lý do chọn điện thoại] (Cách 2):",
                        items: [
                            { en: "more convenient", vn: "tiện lợi hơn" },
                            { en: "more modern", vn: "hiện đại hơn" },
                            { en: "more interesting", vn: "thú vị hơn" },
                            { en: "much easier to access", vn: "dễ dàng tiếp cận hơn nhiều" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Trả lời CÓ - Buổi sáng & Cập nhật tin tức)",
                        text: "Yes, I do. I often listen to the radio in the morning because it helps me get the news and relax after a busy day. It also makes me feel refreshed.",
                        formatted: `→ Yes, I do. I often listen to the radio <span class="sub-hl">in the morning</span> because it helps me <span class="sub-hl">get the news</span> and <span class="sub-hl">relax after a busy day</span>. It also makes me feel <span class="sub-hl">refreshed</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Trả lời KHÔNG - Thích nghe podcast trên điện thoại)",
                        text: "To be honest, not really. I rarely listen to the radio because I prefer listening to podcasts on my smartphone. It’s much more convenient for me.",
                        formatted: `→ To be honest, not really. I rarely listen to the radio because I prefer <span class="sub-hl">listening to podcasts on my smartphone</span>. It’s much more <span class="sub-hl">convenient</span> for me.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "What radio station do you usually listen to?",
                qType: "Wh-question: What [radio station] do you usually [Vo]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Kênh phát thanh âm nhạc / giải trí - Cấu trúc trực tiếp):</div>
                    <div class="topic-formula-text">
                        → I usually listen to <span class="formula-bracket-hl">[kênh phát thanh]</span>. It provides a lot of <span class="formula-bracket-hl">[nội dung kênh]</span>. I like it because it’s very <span class="formula-bracket-hl">[tính từ mô tả]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Kênh học tiếng Anh / tin tức - Cấu trúc theo mục đích):</div>
                    <div class="topic-formula-text">
                        → Whenever I want to <span class="formula-bracket-hl">[mục đích]</span>, I usually tune in to <span class="formula-bracket-hl">[kênh phát thanh]</span> because it is extremely <span class="formula-bracket-hl">[tính từ mô tả]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "📻 [Kênh phát thanh & Nội dung kênh]:",
                        items: [
                            { en: "VOV3", vn: "kênh VOV3 → music and entertainment programs (chương trình âm nhạc & giải trí)" },
                            { en: "VOV Traffic", vn: "kênh VOV Giao thông → traffic updates and news (cập nhật giao thông & tin tức)" },
                            { en: "VOV1", vn: "kênh VOV1 → news and information (tin tức & thông tin xã hội)" },
                            { en: "BBC Learning English", vn: "kênh BBC → English lessons and listening practice (bài học tiếng Anh & luyện nghe)" },
                            { en: "VOA Learning English", vn: "kênh VOA → slow news and English lessons (tin tức đọc chậm & bài học)" }
                        ]
                    },
                    {
                        title: "🎯 [Mục đích nghe đài] (Dành cho Cách 2):",
                        items: [
                            { en: "improve my English listening skills", vn: "nâng cao kỹ năng nghe tiếng Anh" },
                            { en: "learn new English vocabulary", vn: "học thêm từ vựng tiếng Anh" },
                            { en: "catch up on daily news", vn: "nắm bắt tin tức hàng ngày" },
                            { en: "check traffic updates", vn: "kiểm tra tình hình giao thông" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả kênh]:",
                        items: [
                            { en: "relaxing", vn: "thư giãn" },
                            { en: "useful / helpful", vn: "hữu ích" },
                            { en: "informative", vn: "nhiều thông tin bổ ích" },
                            { en: "easy to understand", vn: "dễ hiểu" },
                            { en: "interesting", vn: "thú vị" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (VOV3 - Âm nhạc & Thư giãn)",
                        text: "I usually listen to VOV3. It provides a lot of music and entertainment programs. I like it because it’s very relaxing.",
                        formatted: `→ I usually listen to <span class="sub-hl">VOV3</span>. It provides a lot of <span class="sub-hl">music and entertainment programs</span>. I like it because it’s very <span class="sub-hl">relaxing</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (BBC Learning English - Cấu trúc theo mục đích học tiếng Anh)",
                        text: "Whenever I want to improve my English listening skills, I usually tune in to BBC Learning English because it is extremely useful.",
                        formatted: `→ Whenever I want to <span class="sub-hl">improve my English listening skills</span>, I usually tune in to <span class="sub-hl">BBC Learning English</span> because it is extremely <span class="sub-hl">useful</span>.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "What are the benefits of listening to the radio?",
                qType: "Wh-question: What are the benefits of [Ving]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Cấu trúc trực tiếp: Giúp ích & Cảm xúc mang lại):</div>
                    <div class="topic-formula-text">
                        → Listening to the radio helps us <span class="formula-bracket-hl">[lợi ích 1]</span>. It’s also a good way to <span class="formula-bracket-hl">[lợi ích 2]</span>. Besides, it makes us feel <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc liệt kê: First, ... Second, ...):</div>
                    <div class="topic-formula-text">
                        → There are many benefits of listening to the radio. First, it helps us <span class="formula-bracket-hl">[lợi ích 1]</span>. Second, it’s a wonderful way to <span class="formula-bracket-hl">[lợi ích 2]</span> and stay <span class="formula-bracket-hl">[tính từ mô tả cảm xúc]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "⭐ [Lợi ích khi nghe đài phát thanh]:",
                        items: [
                            { en: "reduce stress", vn: "giảm bớt căng thẳng" },
                            { en: "pass the time", vn: "giải trí / giết thời gian" },
                            { en: "get the news", vn: "nắm bắt tin tức thời sự" },
                            { en: "learn new things", vn: "học hỏi những điều mới" },
                            { en: "relax after a busy day", vn: "thư giãn sau ngày bận rộn" },
                            { en: "improve listening skills", vn: "nâng cao kỹ năng nghe tiếng Anh" }
                        ]
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc]:",
                        items: [
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "informed", vn: "am hiểu / nắm bắt thông tin" },
                            { en: "happy", vn: "vui vẻ" },
                            { en: "comfortable", vn: "dễ chịu" },
                            { en: "refreshed", vn: "tươi mới / sảng khoái" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Giảm stress & Giết thời gian - Thư giãn)",
                        text: "Listening to the radio helps us reduce stress. It’s also a good way to pass the time. Besides, it makes us feel relaxed.",
                        formatted: `→ Listening to the radio helps us <span class="sub-hl">reduce stress</span>. It’s also a good way to <span class="sub-hl">pass the time</span>. Besides, it makes us feel <span class="sub-hl">relaxed</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Nắm bắt tin tức & Học điều mới - Am hiểu)",
                        text: "There are many benefits of listening to the radio. First, it helps us get the news. Second, it’s a wonderful way to learn new things and stay informed.",
                        formatted: `→ There are many benefits of listening to the radio. First, it helps us <span class="sub-hl">get the news</span>. Second, it’s a wonderful way to <span class="sub-hl">learn new things</span> and stay <span class="sub-hl">informed</span>.`
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        title: "Chủ đề 05: Let's talk about music",
        introText: "Let’s talk about music.",
        questions: [
            {
                qNum: 1,
                question: "What kind of music do you like?",
                qType: "Wh-question: What kind of [noun] do you like?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Nêu trực tiếp thể loại yêu thích & lý do/cảm xúc mang lại):</div>
                    <div class="topic-formula-text">
                        → I’m a big fan of <span class="formula-bracket-hl">[thể loại âm nhạc]</span> because it’s very <span class="formula-bracket-hl">[tính từ mô tả âm nhạc]</span>. Listening to it helps me <span class="formula-bracket-hl">[lợi ích]</span> and makes me feel <span class="formula-bracket-hl">[tính từ cảm xúc]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc phụ thuộc theo tâm trạng - It depends on my mood):</div>
                    <div class="topic-formula-text">
                        → Actually, it depends on my mood. When I want to relax, I love listening to <span class="formula-bracket-hl">[thể loại nhẹ nhàng]</span>, but when I need energy, I prefer <span class="formula-bracket-hl">[thể loại sôi động]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🎵 [Thể loại âm nhạc]:",
                        items: [
                            { en: "pop music", vn: "nhạc pop (vui tươi, bắt tai)" },
                            { en: "acoustic music", vn: "nhạc acoustic (nhẹ nhàng, mộc mạc)" },
                            { en: "classical music", vn: "nhạc cổ điển (êm dịu, sâu lắng)" },
                            { en: "EDM / dance music", vn: "nhạc điện tử sôi động" },
                            { en: "ballads / slow songs", vn: "nhạc trữ tình, tình ca nhẹ nhàng" },
                            { en: "jazz", vn: "nhạc jazz" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả âm nhạc]:",
                        items: [
                            { en: "catchy and cheerful", vn: "bắt tai và vui vẻ" },
                            { en: "soft and peaceful", vn: "êm dịu và yên bình" },
                            { en: "energetic / lively", vn: "tràn đầy năng lượng / sống động" },
                            { en: "soothing and gentle", vn: "nhẹ nhàng và xoa dịu tâm trí" },
                            { en: "relaxing", vn: "thư giãn" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>reduce stress, clear my mind, improve my mood, regain my energy...</em>).`
                    },
                    {
                        title: "😊 [Tính từ mô tả cảm xúc]:",
                        items: [
                            { en: "happy", vn: "vui tươi / hạnh phúc" },
                            { en: "relaxed", vn: "thư thái / thoải mái" },
                            { en: "refreshed", vn: "sảng khoái / tươi mới" },
                            { en: "comfortable", vn: "dễ chịu" },
                            { en: "peaceful", vn: "thanh thản / bình yên" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Nhạc pop - Vui tươi, bắt tai & Giảm stress)",
                        text: "I’m a big fan of pop music because it’s very catchy and cheerful. Listening to it helps me reduce stress and makes me feel happy.",
                        formatted: `→ I’m a big fan of <span class="sub-hl">pop music</span> because it’s very <span class="sub-hl">catchy and cheerful</span>. Listening to it helps me <span class="sub-hl">reduce stress</span> and makes me feel <span class="sub-hl">happy</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cấu trúc phụ thuộc tâm trạng: It depends on my mood)",
                        text: "Actually, it depends on my mood. When I want to relax, I love listening to acoustic music, but when I need energy, I prefer cheerful pop songs.",
                        formatted: `→ Actually, it <span class="sub-hl">depends on my mood</span>. When I want to relax, I love listening to <span class="sub-hl">acoustic music</span>, but when I need energy, I prefer <span class="sub-hl">cheerful pop songs</span>.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "When do you often listen to music?",
                qType: "Wh-question: When do you often [Vo]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Khẳng định thời điểm cụ thể & thói quen cố định):</div>
                    <div class="topic-formula-text">
                        → I often listen to music <span class="formula-bracket-hl">[thời điểm cụ thể trong ngày]</span> when I have free time because it helps me <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc kết hợp trong khi làm hoạt động khác - While + V-ing):</div>
                    <div class="topic-formula-text">
                        → I usually listen to music while <span class="formula-bracket-hl">[hoạt động: doing housework / studying / traveling]</span>. It is a wonderful way to <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "⏰ [Thời điểm trong ngày] (Dành cho Cách 1):",
                        items: [
                            { en: "before going to bed", vn: "trước khi đi ngủ" },
                            { en: "in the evening", vn: "vào buổi tối" },
                            { en: "after a long day at work / school", vn: "sau một ngày dài học tập / làm việc" },
                            { en: "in my free time on weekends", vn: "trong thời gian rảnh rỗi vào cuối tuần" }
                        ]
                    },
                    {
                        title: "🎧 [Hoạt động kết hợp: While + V-ing] (Dành cho Cách 2):",
                        items: [
                            { en: "doing housework", vn: "làm việc nhà (lau dọn, giặt đồ)" },
                            { en: "studying or working", vn: "học tập hoặc làm việc" },
                            { en: "traveling on the bus", vn: "đi xe buýt / tàu điện" },
                            { en: "cooking dinner", vn: "nấu bữa tối" },
                            { en: "exercising or jogging", vn: "tập thể dục hoặc chạy bộ" }
                        ]
                    },
                    {
                        title: "⭐ [Lợi ích khi nghe nhạc]:",
                        items: [
                            { en: "clear my mind", vn: "làm cho đầu óc minh mẫn, nhẹ nhàng" },
                            { en: "sleep better", vn: "ngủ ngon hơn" },
                            { en: "pass the time", vn: "giải trí / giết thời gian" },
                            { en: "boost my concentration", vn: "tăng cường khả năng tập trung" },
                            { en: "improve my mood", vn: "cải thiện tâm trạng" },
                            { en: "relax after a busy day", vn: "thư giãn sau ngày bận rộn" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Thời điểm: Trước khi đi ngủ - Đầu óc thư thái & Ngủ ngon hơn)",
                        text: "I often listen to music before going to bed when I have free time because it helps me clear my mind and sleep better.",
                        formatted: `→ I often listen to music <span class="sub-hl">before going to bed</span> when I have free time because it helps me <span class="sub-hl">clear my mind</span> and <span class="sub-hl">sleep better</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cấu trúc kết hợp: Vừa làm việc nhà vừa nghe nhạc)",
                        text: "I usually listen to music while doing housework. It is a wonderful way to pass the time and boost my concentration.",
                        formatted: `→ I usually listen to music while <span class="sub-hl">doing housework</span>. It is a wonderful way to <span class="sub-hl">pass the time</span> and <span class="sub-hl">boost my concentration</span>.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "Is music important to you? Why?",
                qType: "Yes/No Question: Is [noun] important to you? Why?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Khẳng định trực tiếp vai trò thiết yếu - plays an essential part):</div>
                    <div class="topic-formula-text">
                        → Yes, absolutely. Music plays an essential part in my life because it helps me <span class="formula-bracket-hl">[lợi ích]</span> and makes my life more <span class="formula-bracket-hl">[tính từ mô tả cuộc sống]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc giả định / cảm xúc - I cannot imagine my life without...):</div>
                    <div class="topic-formula-text">
                        → Yes, of course. I cannot imagine my life without music because it is the best way for me to <span class="formula-bracket-hl">[lợi ích]</span> whenever I feel <span class="formula-bracket-hl">[tâm trạng / tình huống]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🌟 [Tính từ mô tả cuộc sống] (Cách 1):",
                        items: [
                            { en: "colorful", vn: "muôn màu muôn vẻ / phong phú" },
                            { en: "enjoyable", vn: "thú vị / tràn đầy niềm vui" },
                            { en: "meaningful", vn: "ý nghĩa / sâu sắc" },
                            { en: "peaceful", vn: "bình yên / thanh thản" }
                        ]
                    },
                    {
                        title: "🌧️ [Tâm trạng / Tình huống khi cần âm nhạc] (Cách 2):",
                        items: [
                            { en: "stressed or tired", vn: "căng thẳng hoặc mệt mỏi" },
                            { en: "under pressure", vn: "chịu áp lực học tập/công việc" },
                            { en: "lonely", vn: "cô đơn / trống trải" },
                            { en: "sad or upset", vn: "buồn bã hoặc thất vọng" }
                        ]
                    },
                    {
                        title: "⭐ [Lợi ích thiết yếu của âm nhạc]:",
                        items: [
                            { en: "escape from daily stress", vn: "thoát khỏi căng thẳng thường nhật" },
                            { en: "improve my mood", vn: "cải thiện tâm trạng" },
                            { en: "regain my energy", vn: "lấy lại nguồn năng lượng tích cực" },
                            { en: "forget about my worries", vn: "tạm quên đi những lo toan" },
                            { en: "take a mental break", vn: "cho tâm trí được nghỉ ngơi" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Vai trò thiết yếu - Giúp xua tan căng thẳng & Cuộc sống thêm muôn màu)",
                        text: "Yes, absolutely. Music plays an essential part in my life because it helps me escape from daily stress and makes my life more colorful.",
                        formatted: `→ Yes, absolutely. Music <span class="sub-hl">plays an essential part in my life</span> because it helps me <span class="sub-hl">escape from daily stress</span> and makes my life more <span class="sub-hl">colorful</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cấu trúc giả định: I cannot imagine my life without music)",
                        text: "Yes, of course. I cannot imagine my life without music because it is the best way for me to improve my mood whenever I feel stressed or tired.",
                        formatted: `→ Yes, of course. I <span class="sub-hl">cannot imagine my life without music</span> because it is the best way for me to <span class="sub-hl">improve my mood</span> whenever I feel <span class="sub-hl">stressed or tired</span>.`
                    }
                ]
            }
        ]
    },
    {
        id: 6,
        title: "Chủ đề 06: Let's talk about musical instruments",
        introText: "Let’s talk about musical instruments.",
        questions: [
            {
                qNum: 1,
                question: "Can you play any musical instruments?",
                qType: "Can you [Vo]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Trả lời CÓ - Nêu nhạc cụ biết chơi & thời điểm học / lợi ích):</div>
                    <div class="topic-formula-text">
                        → Yes, I can. I can play the <span class="formula-bracket-hl">[tên nhạc cụ]</span>. I learned it <span class="formula-bracket-hl">[thời điểm học]</span>, and playing it helps me <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Trả lời KHÔNG - Thừa nhận không biết chơi nhưng muốn học):</div>
                    <div class="topic-formula-text">
                        → To be honest, no, I cannot play any instruments. However, I really want to learn how to play the <span class="formula-bracket-hl">[tên nhạc cụ muốn học]</span> because it sounds very <span class="formula-bracket-hl">[tính từ mô tả âm thanh]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🎸 [Tên các nhạc cụ phổ biến]:",
                        items: [
                            { en: "the guitar", vn: "đàn ghi-ta" },
                            { en: "the piano", vn: "đàn piano / dương cầm" },
                            { en: "the violin", vn: "đàn vĩ cầm" },
                            { en: "the drums", vn: "bộ trống" },
                            { en: "the flute", vn: "ống sáo" },
                            { en: "the ukulele", vn: "đàn ukulele" }
                        ]
                    },
                    {
                        title: "🏫 [Thời điểm học nhạc cụ] (Cách 1):",
                        items: [
                            { en: "when I was at university", vn: "khi tôi còn học đại học" },
                            { en: "when I was in high school", vn: "hồi tôi còn học cấp ba" },
                            { en: "since I was a child", vn: "từ khi tôi còn là một đứa trẻ" },
                            { en: "a few years ago", vn: "cách đây vài năm" }
                        ]
                    },
                    {
                        title: "🎶 [Tính từ mô tả âm thanh nhạc cụ] (Cách 2):",
                        items: [
                            { en: "peaceful", vn: "thanh bình / êm ả" },
                            { en: "soothing", vn: "xoa dịu tâm hồn / dịu dàng" },
                            { en: "melodious", vn: "du dương / êm tai" },
                            { en: "lively", vn: "sống động / rộn rã" },
                            { en: "beautiful", vn: "ngọt ngào / tuyệt đẹp" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>relax after a busy day, reduce stress, develop my imagination, enhance my creativity...</em>).`
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Trả lời CÓ - Biết chơi đàn guitar từ hồi sinh viên)",
                        text: "Yes, I can. I can play the guitar. I learned it when I was at university, and playing it helps me relax after a busy day.",
                        formatted: `→ Yes, I can. I can play the <span class="sub-hl">guitar</span>. I learned it <span class="sub-hl">when I was at university</span>, and playing it helps me <span class="sub-hl">relax after a busy day</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Trả lời KHÔNG - Chưa biết chơi nhưng muốn học piano)",
                        text: "To be honest, no, I cannot play any instruments. However, I really want to learn how to play the piano because it sounds very peaceful.",
                        formatted: `→ To be honest, no, <span class="sub-hl">I cannot play any instruments</span>. However, I really want to learn how to play the <span class="sub-hl">piano</span> because it sounds very <span class="sub-hl">peaceful</span>.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "Which musical instrument do you like the most?",
                qType: "Wh-question: Which [noun] do you like the most?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Cấu trúc cảm nhận âm thanh du dương - Đàn Piano):</div>
                    <div class="topic-formula-text">
                        → My favorite musical instrument is the <span class="formula-bracket-hl">[tên nhạc cụ]</span> because its sound is very <span class="formula-bracket-hl">[tính từ mô tả âm thanh]</span>. Listening to it always helps me <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc tính tiện dụng, dễ mang theo tụ họp - Đàn Guitar):</div>
                    <div class="topic-formula-text">
                        → I like the <span class="formula-bracket-hl">[tên nhạc cụ]</span> the most because it is very <span class="formula-bracket-hl">[tính từ đặc điểm]</span>. People can carry it easily to <span class="formula-bracket-hl">[dịp gặp gỡ / dã ngoại]</span> and sing along with friends.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🎵 [Tính từ mô tả âm thanh & đặc điểm]:",
                        items: [
                            { en: "soothing and gentle", vn: "êm dịu và nhẹ nhàng" },
                            { en: "sweet and relaxing", vn: "ngọt ngào và thư thái" },
                            { en: "melodious", vn: "du dương / êm tai" },
                            { en: "convenient", vn: "tiện lợi / tiện dụng" },
                            { en: "versatile", vn: "đa năng / linh hoạt" },
                            { en: "portable", vn: "dễ dàng mang theo" }
                        ]
                    },
                    {
                        title: "🏕️ [Dịp tụ họp & hoạt động ngoài trời] (Cách 2):",
                        items: [
                            { en: "picnics and outdoor gatherings", vn: "các buổi dã ngoại và tụ tập ngoài trời" },
                            { en: "camping trips", vn: "các chuyến đi cắm trại" },
                            { en: "birthday parties", vn: "các bữa tiệc sinh nhật" },
                            { en: "friendly meetups", vn: "các buổi gặp mặt bạn bè" }
                        ]
                    },
                    {
                        title: "⭐ [Lợi ích khi nghe hoặc chơi nhạc cụ]:",
                        items: [
                            { en: "calm my mind", vn: "làm tâm trí bình yên, tĩnh lặng" },
                            { en: "reduce stress", vn: "giảm bớt căng thẳng" },
                            { en: "clear my mind", vn: "giải tỏa áp lực đầu óc" },
                            { en: "enjoy my free time", vn: "tận hưởng thời gian rảnh" },
                            { en: "pass the time", vn: "giải trí vui vẻ" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Đàn Piano - Âm thanh êm dịu, giúp bình yên tâm trí)",
                        text: "My favorite musical instrument is the piano because its sound is very soothing and gentle. Listening to it always helps me calm my mind.",
                        formatted: `→ My favorite musical instrument is the <span class="sub-hl">piano</span> because its sound is very <span class="sub-hl">soothing and gentle</span>. Listening to it always helps me <span class="sub-hl">calm my mind</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Đàn Guitar - Tiện lợi mang theo khi đi dã ngoại, hát cùng bạn bè)",
                        text: "I like the guitar the most because it is very convenient. People can carry it easily to picnics and outdoor gatherings and sing along with friends.",
                        formatted: `→ I like the <span class="sub-hl">guitar</span> the most because it is very <span class="sub-hl">convenient</span>. People can carry it easily to <span class="sub-hl">picnics and outdoor gatherings</span> and <span class="sub-hl">sing along with friends</span>.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "Do you think children should learn to play a musical instrument?",
                qType: "Yes/No Question: Do you think [clause]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Đồng ý trực tiếp - Tốt cho phát triển trí não & tính kiên nhẫn):</div>
                    <div class="topic-formula-text">
                        → Yes, I think so. Learning an instrument helps children <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>. It is also very good for their brain development.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc nhượng bộ Although - Dù tốn thời gian nhưng xây dựng tính kỷ luật):</div>
                    <div class="topic-formula-text">
                        → Although learning an instrument takes a lot of time and effort, I believe children should learn one because it helps them <span class="formula-bracket-hl">[lợi ích 1]</span> and build <span class="formula-bracket-hl">[lợi ích 2]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "👶 [Lợi ích cho trẻ em khi học nhạc cụ]:",
                        items: [
                            { en: "develop their creativity", vn: "phát triển tư duy sáng tạo" },
                            { en: "become more patient", vn: "rèn luyện tính kiên nhẫn" },
                            { en: "improve their concentration", vn: "nâng cao khả năng tập trung" },
                            { en: "boost their memory", vn: "tăng cường trí nhớ" },
                            { en: "discover their musical talent", vn: "khám phá năng khiếu âm nhạc" },
                            { en: "build good discipline", vn: "xây dựng tính kỷ luật bản thân" },
                            { en: "become more confident", vn: "trở nên tự tin hơn" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>develop useful skills, study more effectively, widen their knowledge...</em>).`
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Đồng ý trực tiếp - Phát triển trí sáng tạo & Tính kiên nhẫn)",
                        text: "Yes, I think so. Learning an instrument helps children develop their creativity and become more patient. It is also very good for their brain development.",
                        formatted: `→ Yes, I think so. Learning an instrument helps children <span class="sub-hl">develop their creativity</span> and <span class="sub-hl">become more patient</span>. It is also very good for their <span class="sub-hl">brain development</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cấu trúc nhượng bộ Although: Dù tốn thời gian nhưng rèn luyện tính kỷ luật)",
                        text: "Although learning an instrument takes a lot of time and effort, I believe children should learn one because it helps them improve their concentration and build good discipline.",
                        formatted: `→ Although learning an instrument <span class="sub-hl">takes a lot of time and effort</span>, I believe children should learn one because it helps them <span class="sub-hl">improve their concentration</span> and build <span class="sub-hl">good discipline</span>.`
                    }
                ]
            }
        ]
    },
    {
        id: 7,
        title: "Chủ đề 07: Let's talk about restaurants",
        introText: "Let’s talk about restaurants.",
        questions: [
            {
                qNum: 1,
                question: "What restaurant do you often go to? Why do you go there?",
                qType: "Wh-question: What restaurant do you often go to? Why do you go there?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Nhà hàng truyền thống / gia đình - Đồ ăn tươi ngon & Giá cả hợp lý):</div>
                    <div class="topic-formula-text">
                        → I often go to a <span class="formula-bracket-hl">[loại nhà hàng]</span> near my house. I love eating there because the food is always <span class="formula-bracket-hl">[tính từ mô tả đồ ăn]</span> and the prices are very <span class="formula-bracket-hl">[tính từ giá cả]</span>. Moreover, it is a great place to <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Quán lẩu nướng / buffet cùng bạn bè - Không khí sôi nổi & Thực đơn phong phú):</div>
                    <div class="topic-formula-text">
                        → I usually go to a <span class="formula-bracket-hl">[loại nhà hàng]</span> with my close friends on weekends. We choose this restaurant because they serve many <span class="formula-bracket-hl">[tính từ]</span> dishes and the atmosphere is very <span class="formula-bracket-hl">[tính từ không khí]</span>. Eating there helps me <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🍽️ [Loại nhà hàng & Phong cách quán]:",
                        items: [
                            { en: "a traditional Vietnamese restaurant", vn: "nhà hàng món ăn truyền thống Việt Nam" },
                            { en: "a small family restaurant", vn: "quán ăn gia đình ấm cúng" },
                            { en: "a hotpot and BBQ restaurant", vn: "quán lẩu và nướng" },
                            { en: "a seafood restaurant", vn: "nhà hàng hải sản tươi sống" },
                            { en: "a buffet restaurant", vn: "nhà hàng tiệc đứng buffet" },
                            { en: "a local noodle shop", vn: "quán bún / phở quen thuộc gần nhà" }
                        ]
                    },
                    {
                        title: "✨ [Tính từ mô tả món ăn, giá cả & không khí]:",
                        items: [
                            { en: "fresh and tasty", vn: "tươi ngon và đậm vị" },
                            { en: "reasonable / affordable", vn: "hợp túi tiền / giá cả phải chăng" },
                            { en: "cozy and quiet", vn: "ấm cúng và yên tĩnh" },
                            { en: "lively and crowded", vn: "náo nhiệt và đông vui" },
                            { en: "clean and hygienic", vn: "sạch sẽ và hợp vệ sinh" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>relax after a long day, enjoy my free time, have fun, taste delicious food, maintain close relationships...</em>).`
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Nhà hàng gia đình gần nhà - Tươi ngon, giá hợp lý, thư giãn cùng gia đình)",
                        text: "I often go to a small family restaurant near my house. I love eating there because the food is always fresh and the prices are very reasonable. It is also a wonderful place for my family to relax after a long day and enjoy our dinner together.",
                        formatted: `→ I often go to a <span class="sub-hl">small family restaurant near my house</span>. I love eating there because the food is always <span class="sub-hl">fresh</span> and the prices are very <span class="sub-hl">reasonable</span>. It is also a wonderful place for my family to <span class="sub-hl">relax after a long day</span> and <span class="sub-hl">enjoy our dinner together</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Quán lẩu nướng cuối tuần cùng bạn bè - Không khí sôi động, giải tỏa âu lo)",
                        text: "I usually go to a hotpot and BBQ restaurant with my close friends on weekends. We choose this restaurant because they serve many tasty dishes and the atmosphere is very lively. Eating there helps me forget about my worries and have fun.",
                        formatted: `→ I usually go to a <span class="sub-hl">hotpot and BBQ restaurant</span> with my close friends on weekends. We choose this restaurant because they serve many <span class="sub-hl">tasty dishes</span> and the atmosphere is very <span class="sub-hl">lively</span>. Eating there helps me <span class="sub-hl">forget about my worries</span> and <span class="sub-hl">have fun</span>.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "What types of food are served at that restaurant?",
                qType: "Wh-question: What types of food are served at that restaurant?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Món ăn truyền thống Việt Nam chuẩn vị - Phở, nem rán, cơm tấm):</div>
                    <div class="topic-formula-text">
                        → That restaurant mainly serves <span class="formula-bracket-hl">[loại món ăn]</span>, such as <span class="formula-bracket-hl">[kể tên 2-3 món cụ thể]</span>. All the dishes are made from <span class="formula-bracket-hl">[nguyên liệu / cách chế biến]</span>, so they are very <span class="formula-bracket-hl">[tính từ món ăn]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Món lẩu nướng & hải sản phong phú - Tôm cua nướng, lẩu cay, tráng miệng):</div>
                    <div class="topic-formula-text">
                        → They serve a wide range of <span class="formula-bracket-hl">[ẩm thực / loại món ăn]</span>, including <span class="formula-bracket-hl">[kể tên 2-3 món]</span>. They also offer <span class="formula-bracket-hl">[món tráng miệng / thức uống]</span>, which makes every meal enjoyable.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🍲 [Món ăn Việt Nam truyền thống]:",
                        items: [
                            { en: "beef noodle soup (Pho)", vn: "phở bò truyền thống" },
                            { en: "crispy spring rolls", vn: "nem rán / chả giò giòn rụm" },
                            { en: "broken rice with grilled pork", vn: "cơm tấm sườn nướng" },
                            { en: "Vietnamese savory pancake (Banh xeo)", vn: "bánh xèo giòn thơm" },
                            { en: "clay pot fish", vn: "cá kho tộ đậm đà" }
                        ]
                    },
                    {
                        title: "🦐 [Món hải sản & lẩu nướng]:",
                        items: [
                            { en: "grilled seafood like prawns and squid", vn: "hải sản nướng như tôm và mực" },
                            { en: "spicy beef hotpot", vn: "nồi lẩu bò cay nồng" },
                            { en: "fried chicken and French fries", vn: "gà rán và khoai tây chiên" },
                            { en: "fresh seasonal salads", vn: "salad rau củ tươi theo mùa" },
                            { en: "sweet desserts and cold drinks", vn: "món tráng miệng ngọt và đồ uống mát lạnh" }
                        ]
                    },
                    {
                        title: "🌿 [Nguyên liệu & Hương vị]:",
                        items: [
                            { en: "fresh local ingredients", vn: "nguyên liệu tươi sạch của địa phương" },
                            { en: "rich flavors", vn: "hương vị đậm đà thơm ngon" },
                            { en: "healthy and nutritious", vn: "lành mạnh và giàu dinh dưỡng" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Món ăn truyền thống Việt Nam - Nguyên liệu tươi, vị đậm đà)",
                        text: "That restaurant mainly serves traditional Vietnamese dishes, such as beef noodle soup, spring rolls, and grilled pork. All the ingredients are fresh and cooked with rich flavors, which makes the food very delicious and healthy.",
                        formatted: `→ That restaurant mainly serves <span class="sub-hl">traditional Vietnamese dishes</span>, such as <span class="sub-hl">beef noodle soup</span>, <span class="sub-hl">spring rolls</span>, and grilled pork. All the ingredients are fresh and cooked with <span class="sub-hl">rich flavors</span>, which makes the food very delicious and healthy.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Hải sản nướng và lẩu nướng phong phú kèm tráng miệng)",
                        text: "They serve a wide range of seafood and hotpot dishes, including grilled prawns, crabs, and spicy fish hotpot. They also offer fresh seasonal fruits and desserts, which makes every meal enjoyable.",
                        formatted: `→ They serve a wide range of <span class="sub-hl">seafood and hotpot dishes</span>, including <span class="sub-hl">grilled prawns</span>, crabs, and <span class="sub-hl">spicy fish hotpot</span>. They also offer fresh seasonal fruits and desserts, which makes every meal enjoyable.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "Do you like all the dishes there?",
                qType: "Do you like [noun]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Trả lời CÓ - Thích hầu hết các món vì rất hợp khẩu vị):</div>
                    <div class="topic-formula-text">
                        → Yes, I do. I like almost all the dishes on their menu because they suit my taste very well. In particular, <span class="formula-bracket-hl">[tên món khoái khẩu nhất]</span> is my favorite dish because it is extremely <span class="formula-bracket-hl">[tính từ khen ngợi]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Trả lời KHÔNG HẲN - Thích đồ ăn nhưng không thích món cay nóng):</div>
                    <div class="topic-formula-text">
                        → Not really. Although most of the dishes are very good, I do not like <span class="formula-bracket-hl">[loại món không thích]</span> because they are <span class="formula-bracket-hl">[lý do: quá cay / nhiều dầu mỡ]</span>. Therefore, I usually choose <span class="formula-bracket-hl">[món ăn thay thế thanh đạm]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "👌 [Cụm từ biểu đạt sự hài lòng]:",
                        items: [
                            { en: "suit my taste very well", vn: "rất hợp với khẩu vị của tôi" },
                            { en: "almost all the dishes", vn: "gần như tất cả các món ăn" },
                            { en: "well-seasoned and flavorful", vn: "được nêm nếm vừa vặn và đậm đà" },
                            { en: "rich and sweet broth", vn: "nước dùng ngọt thanh và đậm đà" }
                        ]
                    },
                    {
                        title: "⚠️ [Lý do không thích một vài món]:",
                        items: [
                            { en: "too spicy for me", vn: "quá cay đối với tôi" },
                            { en: "quite greasy and oily", vn: "khá nhiều dầu mỡ ngấy" },
                            { en: "a bit too salty", vn: "hơi mặn một chút" },
                            { en: "hard to digest", vn: "khó tiêu hóa" }
                        ]
                    },
                    {
                        title: "🥗 [Món ăn thanh đạm thay thế]:",
                        items: [
                            { en: "milder dishes like chicken soup", vn: "các món nhẹ vị hơn như súp gà" },
                            { en: "steamed vegetables and rice", vn: "cơm và rau củ hấp thanh đạm" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Trả lời CÓ - Thích hầu hết các món, mê nhất món phở bò nước ngọt thanh)",
                        text: "Yes, I do. I like almost all the dishes there because they suit my taste very well. In particular, the beef noodle soup is my favorite because the broth is very rich and sweet.",
                        formatted: `→ Yes, I do. I like <span class="sub-hl">almost all the dishes</span> there because they <span class="sub-hl">suit my taste</span> very well. In particular, the <span class="sub-hl">beef noodle soup</span> is my favorite because the broth is very rich and sweet.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Trả lời KHÔNG HẲN - Tránh các món quá cay, ưu tiên món thanh đạm)",
                        text: "Not really. Although most of the food is delicious, I don’t like the spicy dishes because I cannot eat hot food. Therefore, I always choose milder dishes like chicken soup or steamed rice.",
                        formatted: `→ Not really. Although <span class="sub-hl">most of the food is delicious</span>, I don’t like the <span class="sub-hl">spicy dishes</span> because I cannot eat hot food. Therefore, I always choose milder dishes like chicken soup or steamed rice.`
                    }
                ]
            }
        ]
    },
    {
        id: 8,
        title: "Chủ đề 08: Let's talk about fast food restaurants",
        introText: "Let’s talk about fast food restaurants.",
        questions: [
            {
                qNum: 1,
                question: "Have you ever been to a fast food restaurant?",
                qType: "Have you ever [V3/ed]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Trả lời ĐÃ TỪNG - Thỉnh thoảng đi ăn cùng bạn bè khi bận rộn vì tiện lợi):</div>
                    <div class="topic-formula-text">
                        → Yes, I have. I have been to <span class="formula-bracket-hl">[tên chuỗi quán fast food]</span> several times. I usually go there with my friends when I am <span class="formula-bracket-hl">[tình huống bận rộn]</span> because the food is served very <span class="formula-bracket-hl">[tính từ]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Trả lời HIẾM KHI - Chỉ đi hồi nhỏ, giờ ưu tiên cơm nhà để giữ sức khỏe):</div>
                    <div class="topic-formula-text">
                        → Yes, I have, but very rarely. I only went to a fast food restaurant a few times <span class="formula-bracket-hl">[thời điểm quá khứ]</span>. Nowadays, I prefer eating <span class="formula-bracket-hl">[loại đồ ăn: home-cooked food]</span> to <span class="formula-bracket-hl">[lợi ích 1]</span> and <span class="formula-bracket-hl">[lợi ích 2]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🍟 [Chuỗi nhà hàng thức ăn nhanh quen thuộc]:",
                        items: [
                            { en: "KFC and Lotteria", vn: "KFC và Lotteria" },
                            { en: "McDonald's", vn: "chuỗi thức ăn nhanh McDonald's" },
                            { en: "Jollibee", vn: "Jollibee" },
                            { en: "Pizza Hut", vn: "Pizza Hut" }
                        ]
                    },
                    {
                        title: "⏰ [Tình huống & Thời điểm]:",
                        items: [
                            { en: "busy with my studies", vn: "bận rộn với lịch học tập" },
                            { en: "in a hurry after work", vn: "đang vội sau giờ làm việc" },
                            { en: "hanging out with my classmates", vn: "đi chơi tụ tập với bạn cùng lớp" },
                            { en: "when I was younger", vn: "hồi tôi còn nhỏ" }
                        ]
                    },
                    {
                        title: "⚡ [Ưu điểm phục vụ]:",
                        items: [
                            { en: "quickly and conveniently", vn: "nhanh chóng và thuận tiện" },
                            { en: "fast and friendly", vn: "nhanh gọn và thân thiện" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>stay healthy, maintain a healthy lifestyle, save money, avoid getting sick...</em>).`
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Trả lời ĐÃ TỪNG - Ghé KFC/Lotteria cùng bạn khi bận rộn vì nhanh gọn)",
                        text: "Yes, I have. I have been to KFC and Lotteria several times. I usually go there with my friends when I am busy with my studies because the food is prepared very quickly and conveniently.",
                        formatted: `→ Yes, I have. I have been to <span class="sub-hl">KFC and Lotteria</span> several times. I usually go there with my friends <span class="sub-hl">when I am busy with my studies</span> because the food is prepared very <span class="sub-hl">quickly and conveniently</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Trả lời HIẾM KHI - Chỉ đi hồi nhỏ, giờ chuộng cơm nhà để giữ dáng và tiết kiệm)",
                        text: "Yes, I have, but very rarely. I only went to a fast food restaurant a few times when I was younger. Nowadays, I prefer eating home-cooked food with my family to stay healthy and save money.",
                        formatted: `→ Yes, I have, but <span class="sub-hl">very rarely</span>. I only went to a fast food restaurant a few times when I was younger. Nowadays, I prefer eating <span class="sub-hl">home-cooked food</span> with my family to <span class="sub-hl">stay healthy</span> and <span class="sub-hl">save money</span>.`
                    }
                ]
            },
            {
                qNum: 2,
                question: "What is your favorite fast food?",
                qType: "Wh-question: What is your favorite fast food?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Món gà rán giòn rụm & khoai tây chiên - Giòn tan, mọng nước):</div>
                    <div class="topic-formula-text">
                        → My favorite fast food is <span class="formula-bracket-hl">[món ăn: crispy fried chicken]</span>. I love it because the outside is <span class="formula-bracket-hl">[tính từ]</span> and the inside is very <span class="formula-bracket-hl">[tính từ]</span>. Eating it always makes me feel <span class="formula-bracket-hl">[cảm xúc vui vẻ]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Món bánh pizza phô mai hải sản - Phô mai béo ngậy, chia sẻ cùng bạn bè):</div>
                    <div class="topic-formula-text">
                        → I am really into <span class="formula-bracket-hl">[món ăn: cheese pizza]</span>. It is my top choice because the <span class="formula-bracket-hl">[thành phần: melted cheese]</span> tastes wonderful and the crust is very soft. I often share it with my friends to <span class="formula-bracket-hl">[lợi ích]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "🍗 [Các món thức ăn nhanh khoái khẩu]:",
                        items: [
                            { en: "crispy fried chicken", vn: "gà rán giòn rụm" },
                            { en: "French fries", vn: "khoai tây chiên vàng giòn" },
                            { en: "cheese pizza with seafood toppings", vn: "bánh pizza phô mai nhân hải sản" },
                            { en: "beef hamburger", vn: "bánh kẹp thịt bò nướng" },
                            { en: "hot dog with mustard and sauce", vn: "bánh mì kẹp xúc xích sốt mù tạt" }
                        ]
                    },
                    {
                        title: "😋 [Từ ngữ miêu tả hương vị & độ ngon]:",
                        items: [
                            { en: "crunchy and crispy", vn: "giòn tan rôm rốp" },
                            { en: "tender and juicy", vn: "mềm thơm và mọng nước" },
                            { en: "melted cheese", vn: "lớp phô mai tan chảy béo ngậy" },
                            { en: "rich and savory", vn: "đậm đà, bùi ngậy" }
                        ]
                    },
                    {
                        title: "😊 [Cảm xúc & Lợi ích]:",
                        items: [
                            { en: "happy and energetic", vn: "vui vẻ và tràn đầy năng lượng" },
                            { en: "enjoy our free time", vn: "tận hưởng thời gian rảnh rỗi" },
                            { en: "have fun together", vn: "vui vẻ gắn kết bên nhau" }
                        ]
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Món gà rán giòn rụm chấm tương cà - Vỏ giòn, thịt mềm mọng nước)",
                        text: "My favorite fast food is crispy fried chicken. I love it because the skin is crunchy and the meat inside is very tender and juicy. Eating it with some tomato sauce makes me feel happy and energetic.",
                        formatted: `→ My favorite fast food is <span class="sub-hl">crispy fried chicken</span>. I love it because the skin is crunchy and the meat inside is very <span class="sub-hl">tender and juicy</span>. Eating it with some tomato sauce makes me feel <span class="sub-hl">happy and energetic</span>.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Món bánh pizza phô mai hải sản - Phô mai kéo sợi thơm lừng, cùng ăn với bạn bè)",
                        text: "I am really into cheese pizza with seafood toppings. It is my top choice because the melted cheese tastes fantastic and the crust is very soft. I often share a large pizza with my classmates to enjoy our free time.",
                        formatted: `→ I am really into <span class="sub-hl">cheese pizza with seafood toppings</span>. It is my top choice because the <span class="sub-hl">melted cheese</span> tastes fantastic and the crust is very soft. I often share a large pizza with my classmates to <span class="sub-hl">enjoy our free time</span>.`
                    }
                ]
            },
            {
                qNum: 3,
                question: "Is it healthy to eat fast food?",
                qType: "Is it [adj] to [Vo]?",
                formula: `<div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 1 (Khẳng định KHÔNG TỐT - Nhiều dầu mỡ, calo, dễ gây tăng cân và bệnh lý):</div>
                    <div class="topic-formula-text">
                        → In my opinion, no, it is not healthy at all. Fast food contains too much <span class="formula-bracket-hl">[chất béo / calo: oil, salt, and calories]</span>. If people eat it frequently, it can easily lead to <span class="formula-bracket-hl">[vấn đề: weight gain]</span> and <span class="formula-bracket-hl">[vấn đề sức khỏe]</span>.
                    </div>
                </div>
                <div class="topic-formula-row">
                    <div class="topic-formula-title">- Cách 2 (Cấu trúc nhượng bộ Although: Tiện nhưng có hại, chỉ nên ăn thỉnh thoảng & ăn nhiều rau):</div>
                    <div class="topic-formula-text">
                        → Although fast food is <span class="formula-bracket-hl">[tính từ: very convenient]</span> for busy people, eating it regularly is harmful to our body. I believe we should only eat it <span class="formula-bracket-hl">[tần suất: once in a while]</span> and consume more <span class="formula-bracket-hl">[đồ ăn tốt: fresh vegetables]</span> to <span class="formula-bracket-hl">[lợi ích: maintain a healthy lifestyle]</span>.
                    </div>
                </div>`,
                vocabGroups: [
                    {
                        title: "⚠️ [Tác hại của thức ăn nhanh]:",
                        items: [
                            { en: "not healthy at all", vn: "hoàn toàn không có lợi cho sức khỏe" },
                            { en: "too much oil, salt, and calories", vn: "quá nhiều dầu mỡ, muối và lượng calo dư thừa" },
                            { en: "lead to weight gain", vn: "dẫn tới tăng cân không kiểm soát" },
                            { en: "cause some health problems", vn: "gây ra một số vấn đề sức khỏe" },
                            { en: "harmful to our body", vn: "có hại cho cơ thể của chúng ta" }
                        ]
                    },
                    {
                        title: "🥗 [Thói quen cân bằng lành mạnh]:",
                        items: [
                            { en: "once in a while / occasionally", vn: "thỉnh thoảng / lâu lâu một lần" },
                            { en: "consume more fresh vegetables", vn: "ăn nhiều rau xanh củ quả tươi" },
                            { en: "drink plenty of water", vn: "uống nhiều nước lọc" }
                        ]
                    },
                    {
                        type: "note",
                        title: "⭐ [Cụm Lợi ích]:",
                        note: `Sử dụng các cụm từ trong <button type="button" onclick="switchTab('benefits')" style="background: none; border: none; padding: 0; color: #d946ef; font-weight: 800; text-decoration: underline; cursor: pointer; font-size: 0.95rem; font-family: inherit;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Bảng Lợi Ích</button> để điền vào vị trí <em>[lợi ích]</em> (Ví dụ: <em>maintain a healthy lifestyle, stay in good shape, avoid getting sick, improve my physical health...</em>).`
                    }
                ],
                samples: [
                    {
                        label: "Bài mẫu Cách 1 (Khẳng định KHÔNG TỐT - Nhiều dầu mỡ và calo, dễ gây tăng cân)",
                        text: "In my opinion, no, it is not healthy at all. Fast food contains too much oil, salt, and calories. If people eat it frequently, it can easily lead to weight gain and cause some health problems.",
                        formatted: `→ In my opinion, no, <span class="sub-hl">it is not healthy at all</span>. Fast food contains too much <span class="sub-hl">oil, salt, and calories</span>. If people eat it frequently, it can easily lead to <span class="sub-hl">weight gain</span> and cause some health problems.`
                    },
                    {
                        label: "Bài mẫu Cách 2 (Cấu trúc nhượng bộ Although: Tiện lợi nhưng có hại, chỉ ăn thỉnh thoảng & ăn nhiều rau)",
                        text: "Although fast food is very convenient for busy people, eating it regularly is harmful to our body. I believe we should only eat it once in a while and consume more fresh vegetables to maintain a healthy lifestyle.",
                        formatted: `→ Although fast food is <span class="sub-hl">very convenient</span> for busy people, eating it regularly is <span class="sub-hl">harmful to our body</span>. I believe we should only eat it <span class="sub-hl">once in a while</span> and consume more fresh vegetables to <span class="sub-hl">maintain a healthy lifestyle</span>.`
                    }
                ]
            }
        ]
    }
];

window.switchPracticeTopic = (topicId) => {
    const id = parseInt(topicId);
    renderPracticeTopic(id);
};

window.setTopicSelectionMode = (mode) => {
    const manualBtn = document.getElementById('topic-mode-manual-btn');
    const randomBtn = document.getElementById('topic-mode-random-btn');
    const manualPanel = document.getElementById('topic-manual-panel');
    const randomPanel = document.getElementById('topic-random-panel');

    if (mode === 'manual') {
        if (manualBtn) manualBtn.classList.add('active');
        if (randomBtn) randomBtn.classList.remove('active');
        if (manualPanel) manualPanel.style.display = 'block';
        if (randomPanel) randomPanel.style.display = 'none';
    } else {
        if (manualBtn) manualBtn.classList.remove('active');
        if (randomBtn) randomBtn.classList.add('active');
        if (manualPanel) manualPanel.style.display = 'none';
        if (randomPanel) randomPanel.style.display = 'block';
        pickRandomPracticeTopic();
    }
};

window.pickRandomPracticeTopic = () => {
    const available = practiceTopicsData.map(t => t.id);
    if (!available || available.length === 0) return;

    const selectEl = document.getElementById('practice-topic-select');
    const currentId = selectEl ? parseInt(selectEl.value) : 1;

    let nextId = currentId;
    if (available.length > 1) {
        const pool = available.filter(id => id !== currentId);
        nextId = pool[Math.floor(Math.random() * pool.length)];
    } else {
        nextId = available[0];
    }

    renderPracticeTopic(nextId);

    // Confetti celebration
    if (typeof confetti === 'function') {
        try {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.3 }
            });
        } catch (e) {}
    }
};

function renderPracticeTopic(topicId) {
    const container = document.getElementById('practice-topic-content');
    if (!container) return;
    
    const topic = practiceTopicsData.find(t => t.id === topicId) || practiceTopicsData[0];
    if (!topic) return;

    const labelEl = document.getElementById('current-topic-label');
    if (labelEl) labelEl.textContent = `Topic ${String(topic.id).padStart(2, '0')} / 60`;

    const selectEl = document.getElementById('practice-topic-select');
    if (selectEl) selectEl.value = String(topic.id);

    const randomDisplayEl = document.getElementById('random-topic-title-display');
    if (randomDisplayEl) randomDisplayEl.textContent = topic.title;

    let html = `
        <div class="f-card-clean fade-in" style="margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, rgba(67, 97, 238, 0.08), rgba(58, 12, 163, 0.05)); border: 2px solid rgba(67, 97, 238, 0.2); border-radius: 20px; padding: 1.5rem 1.75rem; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;">
                    <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 0.6rem;">
                        <i class="fa-solid fa-comments"></i> ${topic.title}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                        <button class="btn-audio-sample" onclick="speakText('${(topic.introText || topic.intro || '').replace(/'/g, "\\'")}')" style="background: var(--primary);">
                            <i class="fa-solid fa-volume-high"></i> Nghe Giới Thiệu
                        </button>
                        <button class="btn-audio-sample" onclick="openFullTopicExamModal(${topic.id})" style="background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);">
                            <i class="fa-solid fa-stopwatch"></i> Thi Thử Cả Chủ Đề (90s)
                        </button>
                    </div>
                </div>
                <div style="font-size: 1.05rem; color: var(--text-main); line-height: 1.7; font-style: italic; background: var(--bg-card); padding: 0.85rem 1.25rem; border-radius: 12px; border: 1px dashed var(--border);">
                    🎙️ Giám khảo: <strong>"${topic.introText || topic.intro || ''}"</strong>
                </div>
            </div>
    `;

    topic.questions.forEach((q) => {
        // Build suggestions HTML
        let vocabHtml = '';
        q.vocabGroups.forEach(vg => {
            if (vg.type === 'note' || vg.note) {
                vocabHtml += `
                    <div style="margin-bottom: 1.25rem; background: rgba(67, 97, 238, 0.05); border-left: 4px solid var(--primary); padding: 0.85rem 1.15rem; border-radius: 12px; border: 1px solid rgba(67, 97, 238, 0.15); border-left-width: 4px;">
                        <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
                            ${vg.title}
                        </div>
                        <div style="font-size: 0.95rem; line-height: 1.65; color: var(--text-main);">
                            ${vg.note}
                        </div>
                    </div>
                `;
            } else if (vg.items && vg.items.length > 0) {
                let itemsHtml = vg.items.map(it => `
                    <div class="topic-vocab-list-item" onclick="speakText('${it.en.replace(/'/g, "\\'")}')" title="Nhấn để nghe phát âm">
                        <i class="fa-solid fa-volume-high vocab-audio-icon"></i>
                        <strong class="vocab-en">${it.en}</strong>
                        <span class="vocab-colon">:</span>
                        <span class="vocab-vn">${it.vn}</span>
                    </div>
                `).join('');

                vocabHtml += `
                    <div style="margin-bottom: 1.25rem;">
                        <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.4rem;">${vg.title}</div>
                        <div class="topic-vocab-list">${itemsHtml}</div>
                    </div>
                `;
            }
        });

        // Build samples HTML
        let samplesHtml = q.samples.map((s) => `
            <div style="background: var(--bg-body); border-radius: 14px; padding: 1.25rem; border: 1px solid var(--border); margin-bottom: 1rem;">
                <div style="font-weight: 800; color: #7c3aed; font-size: 0.95rem; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-star"></i> ${s.label}:
                </div>
                <div class="ex-text" style="font-size: 1.05rem; line-height: 1.85; color: var(--text-main); font-weight: 500; margin-bottom: 0.85rem; text-align: justify; text-justify: inter-word;">
                    ${s.formatted}
                </div>
                <button class="btn-audio-sample" onclick="speakText('${s.text.replace(/'/g, "\\'")}')" style="background: #8b5cf6;">
                    <i class="fa-solid fa-volume-high"></i> Nghe Audio bài mẫu
                </button>
            </div>
        `).join('');

        html += `
            <div class="topic-q-card fade-in">
                <!-- Question Header -->
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
                    <div>
                        <div class="topic-q-badge">
                            <i class="fa-solid fa-circle-question"></i> CÂU HỎI ${q.qNum} / 3
                        </div>
                        <span class="topic-q-type-badge">
                            <i class="fa-solid fa-tag"></i> ${q.qType}
                        </span>
                        <div style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-top: 0.5rem; line-height: 1.5;">
                            ${q.question}
                        </div>
                    </div>
                    <button class="icon-btn" onclick="speakText('${q.question.replace(/'/g, "\\'")}')" title="Nghe phát âm câu hỏi" style="flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; background: rgba(67, 97, 238, 0.1); color: var(--primary); border: 1.5px solid rgba(67, 97, 238, 0.25);">
                        <i class="fa-solid fa-volume-high" style="font-size: 1.1rem;"></i>
                    </button>
                </div>

                <!-- 1. GỢI Ý CÁCH TRẢ LỜI -->
                <div class="topic-section-box" style="border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.08);">
                    <div class="topic-section-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'" style="background: rgba(59, 130, 246, 0.08); color: #2563eb;">
                        <span><i class="fa-solid fa-lightbulb" style="color: #2563eb;"></i> 💡 GỢI Ý CÁCH TRẢ LỜI</span>
                        <span style="font-size: 0.85rem; font-weight: 600;"><i class="fa-solid fa-chevron-down"></i></span>
                    </div>
                    <div class="topic-section-content" style="background: rgba(59, 130, 246, 0.02);">
                        <div class="f-formula-box" style="margin: 0; padding: 0.5rem 0; background: transparent; border: none;">
                            ${q.formula}
                        </div>
                    </div>
                </div>

                <!-- 2. GỢI Ý TỪ VỰNG -->
                <div class="topic-section-box" style="border-color: rgba(245, 158, 11, 0.4); box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.08);">
                    <div class="topic-section-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'" style="background: rgba(245, 158, 11, 0.08); color: #d97706;">
                        <span><i class="fa-solid fa-pen-to-square" style="color: #d97706;"></i> 📝 GỢI Ý TỪ VỰNG</span>
                        <span style="font-size: 0.85rem; font-weight: 600;"><i class="fa-solid fa-chevron-down"></i></span>
                    </div>
                    <div class="topic-section-content">
                        ${vocabHtml}
                    </div>
                </div>

                <!-- 3. GỢI Ý ĐÁP ÁN MẪU THAM KHẢO -->
                <div class="topic-section-box" style="border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.08);">
                    <div class="topic-section-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'" style="background: rgba(139, 92, 246, 0.08); color: #7c3aed;">
                        <span><i class="fa-solid fa-star" style="color: #7c3aed;"></i> ⭐ GỢI Ý ĐÁP ÁN MẪU THAM KHẢO</span>
                        <span style="font-size: 0.85rem; font-weight: 600;"><i class="fa-solid fa-chevron-down"></i></span>
                    </div>
                    <div class="topic-section-content">
                        ${samplesHtml}
                    </div>
                </div>

                <!-- 4. THỰC HÀNH NÓI & GHI ÂM TÍNH GIỜ (NHƯ LÚC THI) -->
                <div class="topic-section-box" style="border-color: rgba(239, 68, 68, 0.45); box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.08);">
                    <div class="topic-section-header" style="background: rgba(239, 68, 68, 0.08); color: #dc2626; cursor: default;">
                        <span><i class="fa-solid fa-microphone-lines" style="color: #dc2626;"></i> 🎙️ 4. THỰC HÀNH NÓI & GHI ÂM TÍNH GIỜ (NHƯ LÚC THI)</span>
                        <span id="topic-q-phase-badge-${q.qNum}" class="topic-exam-phase-badge">⏱️ Sẵn sàng trả lời</span>
                    </div>
                    <div class="topic-section-content" style="background: var(--bg-card); padding: 1.25rem 1.35rem;">
                        <div class="topic-exam-recorder" style="margin-top: 0; border: none; box-shadow: none; padding: 0;">
                            <div class="topic-exam-top">
                                <div class="topic-exam-time-options">
                                    <span><i class="fa-regular fa-clock"></i> Thời gian nói:</span>
                                    <span style="font-weight: 800; color: #ef4444; font-size: 0.95rem; background: rgba(239, 68, 68, 0.08); padding: 0.25rem 0.75rem; border-radius: 50px; border: 1px solid rgba(239, 68, 68, 0.25);"><i class="fa-solid fa-stopwatch"></i> 25 giây / câu</span>
                                </div>
                                <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
                                    💡 Máy tính sẽ phát tiếng <strong>Beep</strong> khi bắt đầu và <strong>Chuông</strong> khi hết giờ.
                                </div>
                            </div>

                            <div class="topic-exam-body">
                                <div class="topic-exam-timer-wrap">
                                    <div id="topic-q-digits-${q.qNum}" class="topic-exam-digits">00:25</div>
                                    <div id="topic-q-wave-${q.qNum}" class="topic-mic-wave">
                                        <div class="topic-mic-bar"></div>
                                        <div class="topic-mic-bar"></div>
                                        <div class="topic-mic-bar"></div>
                                        <div class="topic-mic-bar"></div>
                                        <div class="topic-mic-bar"></div>
                                        <div class="topic-mic-bar"></div>
                                        <div class="topic-mic-bar"></div>
                                        <div class="topic-mic-bar"></div>
                                        <span style="font-size: 0.78rem; font-weight: 700; color: #ef4444; margin-left: 0.25rem;">
                                            <span class="topic-recording-dot"></span> ĐANG THU ÂM
                                        </span>
                                    </div>
                                </div>

                                <div class="topic-exam-actions">
                                    <button type="button" id="btn-topic-start-${q.qNum}" class="btn-exam-rec start" onclick="startTopicQuestionRecording(${q.qNum})">
                                        <i class="fa-solid fa-microphone"></i> Bắt đầu nói & Ghi âm
                                    </button>
                                    <button type="button" id="btn-topic-stop-${q.qNum}" class="btn-exam-rec stop" onclick="stopTopicQuestionRecording(${q.qNum})" style="display: none;">
                                        <i class="fa-solid fa-square"></i> Dừng & Nộp bài
                                    </button>
                                    <button type="button" id="btn-topic-reset-${q.qNum}" class="btn-exam-rec reset" onclick="resetTopicQuestionRecording(${q.qNum})" style="display: none;">
                                        <i class="fa-solid fa-rotate-left"></i> Ghi âm lại
                                    </button>
                                </div>
                            </div>

                            <!-- Playback Box -->
                            <div id="topic-playback-box-${q.qNum}" class="topic-exam-playback" style="display: none;">
                                <audio id="topic-audio-player-${q.qNum}" controls class="topic-exam-audio-player"></audio>
                                <a id="btn-download-topic-q-${q.qNum}" class="btn-exam-download" download="VSTEP_Speaking_P1_Q${q.qNum}.webm">
                                    <i class="fa-solid fa-download"></i> Tải bài nói (.webm)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// ==========================================================================
// EXAM AUDIO SYNTHESIZER & SOUND EFFECTS (Web Audio API)
// ==========================================================================
function playExamTone(freq, duration, type = 'sine') {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!window._examAudioCtx) {
            window._examAudioCtx = new AudioContext();
        }
        if (window._examAudioCtx.state === 'suspended') {
            window._examAudioCtx.resume();
        }
        const ctx = window._examAudioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.warn('Exam audio synth notice:', e);
    }
}

function playExamDoubleBeep() {
    playExamTone(880, 0.15);
    setTimeout(() => playExamTone(880, 0.15), 200);
}

function playExamTimeUpChime() {
    playExamTone(523.25, 0.15); // C5
    setTimeout(() => {
        playExamTone(659.25, 0.15); // E5
        setTimeout(() => {
            playExamTone(783.99, 0.35); // G5
        }, 120);
    }, 120);
}

function stopAllActiveRecordings() {
    if (window._topicTimers) {
        Object.keys(window._topicTimers).forEach(qNum => {
            if (window._topicTimers[qNum] && window._topicTimers[qNum].isRecording) {
                stopTopicQuestionRecording(qNum);
            }
        });
    }
    if (window._fullExamTimer && window._fullExamTimer.isRecording) {
        stopFullTopicRecording();
    }
}

// ==========================================================================
// TOPIC PRACTICE - TIMED AUDIO RECORDER ENGINE (PER-QUESTION: 25s)
// ==========================================================================
window._topicTimers = {};

window.setTopicQuestionTime = (qNum, seconds, btnEl) => {
    if (window._topicTimers[qNum] && window._topicTimers[qNum].isRecording) return;
    
    if (!window._topicTimers[qNum]) {
        window._topicTimers[qNum] = {};
    }
    window._topicTimers[qNum].totalTime = seconds;
    window._topicTimers[qNum].timeLeft = seconds;

    const digitsEl = document.getElementById(`topic-q-digits-${qNum}`);
    if (digitsEl) {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        digitsEl.textContent = `${mm}:${ss}`;
        digitsEl.classList.remove('warning', 'danger');
    }
};

window.startTopicQuestionRecording = async (qNum) => {
    stopAllActiveRecordings();

    const timerObj = window._topicTimers[qNum] || { totalTime: 25, timeLeft: 25 };
    window._topicTimers[qNum] = timerObj;
    timerObj.totalTime = 25;
    timerObj.timeLeft = 25;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        timerObj.stream = stream;

        let options = { mimeType: 'audio/webm' };
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
            if (!MediaRecorder.isTypeSupported('audio/webm') && MediaRecorder.isTypeSupported('audio/mp4')) {
                options = { mimeType: 'audio/mp4' };
            }
        }

        const recorder = new MediaRecorder(stream, options);
        timerObj.recorder = recorder;
        timerObj.chunks = [];

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                timerObj.chunks.push(e.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(timerObj.chunks, { type: recorder.mimeType || 'audio/webm' });
            if (timerObj.blobUrl) URL.revokeObjectURL(timerObj.blobUrl);
            timerObj.blobUrl = URL.createObjectURL(blob);

            const player = document.getElementById(`topic-audio-player-${qNum}`);
            const downloadBtn = document.getElementById(`btn-download-topic-q-${qNum}`);
            const playbackBox = document.getElementById(`topic-playback-box-${qNum}`);

            if (player) player.src = timerObj.blobUrl;
            if (downloadBtn) {
                downloadBtn.href = timerObj.blobUrl;
                const student = (document.getElementById('display-name')?.textContent || 'HocVien').trim().replace(/\s+/g, '_');
                downloadBtn.download = `VSTEP_Speaking_P1_Q${qNum}_${student}.webm`;
            }
            if (playbackBox) playbackBox.style.display = 'flex';

            const badge = document.getElementById(`topic-q-phase-badge-${qNum}`);
            if (badge) {
                badge.className = 'topic-exam-phase-badge done';
                badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đã hoàn thành bài nói';
            }

            const startBtn = document.getElementById(`btn-topic-start-${qNum}`);
            const stopBtn = document.getElementById(`btn-topic-stop-${qNum}`);
            const resetBtn = document.getElementById(`btn-topic-reset-${qNum}`);
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'none';
            if (resetBtn) resetBtn.style.display = 'inline-flex';

            const waveEl = document.getElementById(`topic-q-wave-${qNum}`);
            if (waveEl) waveEl.classList.remove('active');
        };

        playExamDoubleBeep();
        recorder.start(1000);
        timerObj.isRecording = true;

        const badge = document.getElementById(`topic-q-phase-badge-${qNum}`);
        if (badge) {
            badge.className = 'topic-exam-phase-badge recording';
            badge.innerHTML = '<span class="topic-recording-dot"></span> Đang ghi âm bài nói';
        }

        const waveEl = document.getElementById(`topic-q-wave-${qNum}`);
        if (waveEl) waveEl.classList.add('active');

        const startBtn = document.getElementById(`btn-topic-start-${qNum}`);
        const stopBtn = document.getElementById(`btn-topic-stop-${qNum}`);
        const resetBtn = document.getElementById(`btn-topic-reset-${qNum}`);
        const playbackBox = document.getElementById(`topic-playback-box-${qNum}`);
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'inline-flex';
        if (resetBtn) resetBtn.style.display = 'none';
        if (playbackBox) playbackBox.style.display = 'none';

        const digitsEl = document.getElementById(`topic-q-digits-${qNum}`);
        if (digitsEl) {
            digitsEl.textContent = '00:25';
            digitsEl.classList.remove('warning', 'danger');
        }

        timerObj.timerInterval = setInterval(() => {
            timerObj.timeLeft--;
            const cur = timerObj.timeLeft;
            if (digitsEl) {
                const mm = String(Math.floor(cur / 60)).padStart(2, '0');
                const ss = String(cur % 60).padStart(2, '0');
                digitsEl.textContent = `${mm}:${ss}`;

                if (cur <= 8 && cur > 3) {
                    digitsEl.classList.add('warning');
                } else if (cur <= 3) {
                    digitsEl.classList.remove('warning');
                    digitsEl.classList.add('danger');
                }
            }

            if (cur <= 0) {
                playExamTimeUpChime();
                stopTopicQuestionRecording(qNum);
            }
        }, 1000);

    } catch (err) {
        console.warn('Microphone permission error:', err);
        alert('⚠️ Không thể truy cập Microphone! Vui lòng cho phép trình duyệt truy cập micro để ghi âm bài nói.');
    }
};

window.stopTopicQuestionRecording = (qNum) => {
    const timerObj = window._topicTimers[qNum];
    if (!timerObj || !timerObj.isRecording) return;

    timerObj.isRecording = false;
    if (timerObj.timerInterval) {
        clearInterval(timerObj.timerInterval);
        timerObj.timerInterval = null;
    }

    if (timerObj.recorder && timerObj.recorder.state !== 'inactive') {
        try { timerObj.recorder.stop(); } catch(e) {}
    }

    if (timerObj.stream) {
        try { timerObj.stream.getTracks().forEach(t => t.stop()); } catch(e) {}
        timerObj.stream = null;
    }
};

window.resetTopicQuestionRecording = (qNum) => {
    const timerObj = window._topicTimers[qNum] || {};
    if (timerObj.isRecording) {
        stopTopicQuestionRecording(qNum);
    }
    timerObj.totalTime = 25;
    timerObj.timeLeft = 25;

    const digitsEl = document.getElementById(`topic-q-digits-${qNum}`);
    if (digitsEl) {
        digitsEl.textContent = '00:25';
        digitsEl.classList.remove('warning', 'danger');
    }

    const badge = document.getElementById(`topic-q-phase-badge-${qNum}`);
    if (badge) {
        badge.className = 'topic-exam-phase-badge';
        badge.innerHTML = '⏱️ Sẵn sàng trả lời';
    }

    const startBtn = document.getElementById(`btn-topic-start-${qNum}`);
    const stopBtn = document.getElementById(`btn-topic-stop-${qNum}`);
    const resetBtn = document.getElementById(`btn-topic-reset-${qNum}`);
    const playbackBox = document.getElementById(`topic-playback-box-${qNum}`);
    const waveEl = document.getElementById(`topic-q-wave-${qNum}`);

    if (startBtn) startBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    if (playbackBox) playbackBox.style.display = 'none';
    if (waveEl) waveEl.classList.remove('active');
};

// ==========================================================================
// FULL TOPIC EXAM SIMULATION MODAL (3 Questions Continuous - 90s)
// ==========================================================================
window._fullExamTimer = {
    totalTime: 90,
    timeLeft: 90,
    isRecording: false,
    interval: null,
    recorder: null,
    chunks: [],
    stream: null,
    blobUrl: null
};

window.openFullTopicExamModal = (topicId) => {
    stopAllActiveRecordings();
    const topic = practiceTopicsData.find(t => t.id === topicId) || practiceTopicsData[0];
    if (!topic) return;

    let overlay = document.getElementById('topic-full-exam-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'topic-full-exam-overlay';
        overlay.className = 'topic-full-exam-overlay';
        document.body.appendChild(overlay);
    }

    const qListHtml = topic.questions.map(q => `
        <div style="background: var(--bg-body); border-radius: 12px; padding: 1rem 1.25rem; border: 1px solid var(--border); margin-bottom: 0.85rem;">
            <div style="font-weight: 800; color: var(--primary); font-size: 0.92rem; margin-bottom: 0.35rem;">
                CÂU HỎI ${q.qNum}:
            </div>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); line-height: 1.5;">
                ${q.question}
            </div>
        </div>
    `).join('');

    overlay.innerHTML = `
        <div class="topic-full-exam-modal fade-in">
            <div class="topic-full-exam-header">
                <div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: #ef4444; letter-spacing: 0.5px; text-transform: uppercase;">
                        <i class="fa-solid fa-microphone-lines"></i> VSTEP EXAM SIMULATION • SPEAKING PART 01
                    </div>
                    <div class="topic-full-exam-title">
                        ${topic.title}
                    </div>
                </div>
                <button class="topic-full-exam-close" onclick="closeFullTopicExamModal()" title="Đóng phòng thi">&times;</button>
            </div>

            <div style="margin-bottom: 1.25rem;">
                <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.75rem;">
                    📋 NỘI DUNG 3 CÂU HỎI BẠN CẦN TRẢ LỜI LIÊN TỤC:
                </div>
                ${qListHtml}
            </div>

            <!-- Exam Console -->
            <div style="background: var(--bg-body); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 16px; padding: 1.5rem; text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-muted);">Thời gian thi:</span>
                    <button type="button" class="btn-time-opt" onclick="setFullExamTime(60, this)">60s</button>
                    <button type="button" class="btn-time-opt active" onclick="setFullExamTime(90, this)">90s (Chuẩn 1 Chủ Đề)</button>
                    <button type="button" class="btn-time-opt" onclick="setFullExamTime(180, this)">180s (3 Phút - Cả Part 1)</button>
                </div>

                <div id="full-exam-badge" class="topic-exam-phase-badge" style="margin-bottom: 1rem;">
                    ⏱️ SẴN SÀNG VÀO THI
                </div>

                <div style="display: flex; align-items: center; justify-content: center; gap: 1.25rem; margin-bottom: 1.25rem;">
                    <div id="full-exam-digits" class="topic-exam-digits" style="font-size: 3.5rem;">01:30</div>
                    <div id="full-exam-wave" class="topic-mic-wave">
                        <div class="topic-mic-bar"></div>
                        <div class="topic-mic-bar"></div>
                        <div class="topic-mic-bar"></div>
                        <div class="topic-mic-bar"></div>
                        <div class="topic-mic-bar"></div>
                        <div class="topic-mic-bar"></div>
                        <div class="topic-mic-bar"></div>
                        <div class="topic-mic-bar"></div>
                        <span style="font-size: 0.8rem; font-weight: 700; color: #ef4444; margin-left: 0.3rem;">
                            <span class="topic-recording-dot"></span> ĐANG THU ÂM
                        </span>
                    </div>
                </div>

                <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
                    <button type="button" id="btn-full-start" class="btn-exam-rec start" onclick="startFullTopicRecording(${topic.id})">
                        <i class="fa-solid fa-play"></i> Bắt đầu thi thử & Ghi âm
                    </button>
                    <button type="button" id="btn-full-stop" class="btn-exam-rec stop" onclick="stopFullTopicRecording()" style="display: none;">
                        <i class="fa-solid fa-square"></i> Nộp bài & Dừng thi
                    </button>
                    <button type="button" id="btn-full-reset" class="btn-exam-rec reset" onclick="resetFullTopicRecording()" style="display: none;">
                        <i class="fa-solid fa-rotate-left"></i> Thi lại
                    </button>
                </div>

                <div id="full-exam-playback" class="topic-exam-playback" style="display: none; justify-content: center;">
                    <audio id="full-exam-player" controls class="topic-exam-audio-player"></audio>
                    <a id="full-exam-download" class="btn-exam-download" download="VSTEP_Speaking_P1_Topic_${topic.id}.webm">
                        <i class="fa-solid fa-download"></i> Tải bài thi của bạn (.webm)
                    </a>
                </div>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
};

window.closeFullTopicExamModal = () => {
    if (window._fullExamTimer && window._fullExamTimer.isRecording) {
        stopFullTopicRecording();
    }
    const overlay = document.getElementById('topic-full-exam-overlay');
    if (overlay) overlay.style.display = 'none';
};

window.setFullExamTime = (seconds, btnEl) => {
    if (window._fullExamTimer.isRecording) return;
    window._fullExamTimer.totalTime = seconds;
    window._fullExamTimer.timeLeft = seconds;
    if (btnEl && btnEl.parentElement) {
        btnEl.parentElement.querySelectorAll('.btn-time-opt').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
    const digitsEl = document.getElementById('full-exam-digits');
    if (digitsEl) {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        digitsEl.textContent = `${mm}:${ss}`;
        digitsEl.classList.remove('warning', 'danger');
    }
};

window.startFullTopicRecording = async (topicId) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        window._fullExamTimer.stream = stream;

        let options = { mimeType: 'audio/webm' };
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
            if (!MediaRecorder.isTypeSupported('audio/webm') && MediaRecorder.isTypeSupported('audio/mp4')) {
                options = { mimeType: 'audio/mp4' };
            }
        }

        const recorder = new MediaRecorder(stream, options);
        window._fullExamTimer.recorder = recorder;
        window._fullExamTimer.chunks = [];

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                window._fullExamTimer.chunks.push(e.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(window._fullExamTimer.chunks, { type: recorder.mimeType || 'audio/webm' });
            if (window._fullExamTimer.blobUrl) URL.revokeObjectURL(window._fullExamTimer.blobUrl);
            window._fullExamTimer.blobUrl = URL.createObjectURL(blob);

            const player = document.getElementById('full-exam-player');
            const downloadBtn = document.getElementById('full-exam-download');
            const playbackBox = document.getElementById('full-exam-playback');

            if (player) player.src = window._fullExamTimer.blobUrl;
            if (downloadBtn) {
                downloadBtn.href = window._fullExamTimer.blobUrl;
                const student = (document.getElementById('display-name')?.textContent || 'HocVien').trim().replace(/\s+/g, '_');
                downloadBtn.download = `VSTEP_Speaking_P1_Topic${topicId}_${student}.webm`;
            }
            if (playbackBox) playbackBox.style.display = 'flex';

            const badge = document.getElementById('full-exam-badge');
            if (badge) {
                badge.className = 'topic-exam-phase-badge done';
                badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> ĐÃ HOÀN THÀNH BÀI THI 🎉';
            }

            const startBtn = document.getElementById('btn-full-start');
            const stopBtn = document.getElementById('btn-full-stop');
            const resetBtn = document.getElementById('btn-full-reset');
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'none';
            if (resetBtn) resetBtn.style.display = 'inline-flex';

            const wave = document.getElementById('full-exam-wave');
            if (wave) wave.classList.remove('active');
        };

        playExamDoubleBeep();
        recorder.start(1000);
        window._fullExamTimer.isRecording = true;

        const badge = document.getElementById('full-exam-badge');
        if (badge) {
            badge.className = 'topic-exam-phase-badge recording';
            badge.innerHTML = '<span class="topic-recording-dot"></span> HỆ THỐNG ĐANG GHI ÂM BÀI NÓI CỦA BẠN';
        }

        const wave = document.getElementById('full-exam-wave');
        if (wave) wave.classList.add('active');

        const startBtn = document.getElementById('btn-full-start');
        const stopBtn = document.getElementById('btn-full-stop');
        const resetBtn = document.getElementById('btn-full-reset');
        const playback = document.getElementById('full-exam-playback');
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'inline-flex';
        if (resetBtn) resetBtn.style.display = 'none';
        if (playback) playback.style.display = 'none';

        const digitsEl = document.getElementById('full-exam-digits');
        window._fullExamTimer.timeLeft = window._fullExamTimer.totalTime || 90;

        window._fullExamTimer.interval = setInterval(() => {
            window._fullExamTimer.timeLeft--;
            const cur = window._fullExamTimer.timeLeft;
            if (digitsEl) {
                const mm = String(Math.floor(cur / 60)).padStart(2, '0');
                const ss = String(cur % 60).padStart(2, '0');
                digitsEl.textContent = `${mm}:${ss}`;

                if (cur <= 20 && cur > 5) {
                    digitsEl.classList.add('warning');
                } else if (cur <= 5) {
                    digitsEl.classList.remove('warning');
                    digitsEl.classList.add('danger');
                }
            }

            if (cur <= 0) {
                playExamTimeUpChime();
                stopFullTopicRecording();
            }
        }, 1000);

    } catch (err) {
        console.warn('Full exam mic error:', err);
        alert('⚠️ Không thể truy cập Microphone! Vui lòng cho phép quyền truy cập micro.');
    }
};

window.stopFullTopicRecording = () => {
    if (!window._fullExamTimer.isRecording) return;
    window._fullExamTimer.isRecording = false;
    if (window._fullExamTimer.interval) {
        clearInterval(window._fullExamTimer.interval);
        window._fullExamTimer.interval = null;
    }
    if (window._fullExamTimer.recorder && window._fullExamTimer.recorder.state !== 'inactive') {
        try { window._fullExamTimer.recorder.stop(); } catch(e) {}
    }
    if (window._fullExamTimer.stream) {
        try { window._fullExamTimer.stream.getTracks().forEach(t => t.stop()); } catch(e) {}
        window._fullExamTimer.stream = null;
    }
};

window.resetFullTopicRecording = () => {
    if (window._fullExamTimer.isRecording) {
        stopFullTopicRecording();
    }
    window._fullExamTimer.timeLeft = window._fullExamTimer.totalTime || 90;
    const digitsEl = document.getElementById('full-exam-digits');
    if (digitsEl) {
        const mm = String(Math.floor(window._fullExamTimer.timeLeft / 60)).padStart(2, '0');
        const ss = String(window._fullExamTimer.timeLeft % 60).padStart(2, '0');
        digitsEl.textContent = `${mm}:${ss}`;
        digitsEl.classList.remove('warning', 'danger');
    }

    const badge = document.getElementById('full-exam-badge');
    if (badge) {
        badge.className = 'topic-exam-phase-badge';
        badge.innerHTML = '⏱️ SẴN SÀNG VÀO THI';
    }

    const startBtn = document.getElementById('btn-full-start');
    const stopBtn = document.getElementById('btn-full-stop');
    const resetBtn = document.getElementById('btn-full-reset');
    const playback = document.getElementById('full-exam-playback');
    const wave = document.getElementById('full-exam-wave');

    if (startBtn) startBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    if (playback) playback.style.display = 'none';
    if (wave) wave.classList.remove('active');
};

// Auto-initialize topic 1 on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof renderPracticeTopic === 'function') renderPracticeTopic(1);
    });
} else {
    if (typeof renderPracticeTopic === 'function') renderPracticeTopic(1);
}

