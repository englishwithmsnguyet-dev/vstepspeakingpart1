import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add the tab button
new_tab_btn = """<button class="sub-tab-btn" onclick="switchSubTab('sports', this)" style="padding: 0.6rem 1.4rem; border-radius: 50px; border: 1.5px solid var(--primary); background: transparent; color: var(--primary); cursor: pointer; white-space: nowrap; font-weight: 700; font-size: 0.95rem; transition: all 0.25s ease;">SPORTS & EXERCISE</button>
                            <!-- Thêm các chủ đề khác ở đây -->"""
content = content.replace("<!-- Thêm các chủ đề khác ở đây -->", new_tab_btn)

# 2. Build the html
def make_card(en, vn, color="#3b82f6"):
    speak_term = en.split("/")[0].strip().replace("'", "\\'")
    speak_term = re.sub(r'\(.*?\)', '', speak_term).strip()
    return f'''    <div style="background: var(--bg-card); padding: 1.2rem; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
        <div>
            <strong style="font-size: 1.1rem; color: {color}; font-weight: 800;">{en}</strong>
            <div style="color: var(--text-muted); margin-top: 0.4rem; font-size: 0.95rem;">{vn}</div>
        </div>
        <button class="icon-btn" style="background: var(--bg-body); border: 1px solid var(--border); margin-left: 10px; flex-shrink: 0;" onclick="speakText('{speak_term}')" title="Nghe phát âm">
            <i class="fa-solid fa-volume-high"></i>
        </button>
    </div>'''

categories = [
    ("team sports", "thể thao đồng đội"),
    ("individual sports", "thể thao cá nhân"),
    ("indoor sports", "thể thao trong nhà"),
    ("outdoor sports", "thể thao ngoài trời"),
    ("water sports", "thể thao dưới nước"),
    ("extreme sports", "thể thao mạo hiểm"),
    ("competitive sports", "thể thao thi đấu / cạnh tranh"),
    ("recreational sports", "thể thao giải trí")
]

popular_sports = [
    ("football", "bóng đá"),
    ("basketball", "bóng rổ"),
    ("volleyball", "bóng chuyền"),
    ("badminton", "cầu lông"),
    ("tennis", "quần vợt"),
    ("table tennis", "bóng bàn"),
    ("swimming", "bơi lội"),
    ("hiking", "đi bộ đường dài / leo núi"),
    ("cycling", "đạp xe"),
    ("boxing", "đấm bốc / quyền anh"),
    ("golf", "chơi gôn"),
    ("skateboarding", "trượt ván"),
    ("sailing", "chèo thuyền buồm"),
    ("skiing", "trượt tuyết"),
    ("running / jogging", "chạy bộ")
]

exercise_activities = [
    ("yoga", "yoga"),
    ("workout", "tập thể dục / tập thể hình"),
    ("weightlifting", "cử tạ / tập tạ"),
    ("aerobics", "thể dục nhịp điệu"),
    ("stretching", "bài tập giãn cơ"),
    ("jogging", "chạy bộ"),
    ("cardio exercises", "bài tập tim mạch (cardio)"),
    ("pilates", "bộ môn pilates")
]

activities_habits = [
    ("do / play a sport", "chơi một môn thể thao"),
    ("take up a sport", "bắt đầu chơi một môn thể thao"),
    ("go to the gym", "đi tập gym"),
    ("take regular exercise", "tập thể dục thường xuyên"),
    ("be physically active", "năng động về mặt thể chất"),
    ("warm up before exercising", "khởi động trước khi tập thể dục")
]

benefits = [
    ("build muscles", "phát triển / xây dựng cơ bắp"),
    ("burn calories", "đốt cháy calo"),
    ("boost metabolism", "thúc đẩy quá trình trao đổi chất"),
    ("increase stamina", "tăng sức bền thể lực"),
    ("keep in shape", "giữ vóc dáng cân đối"),
    ("reduce stress and fatigue", "giảm căng thẳng và mệt mỏi")
]

terms = [
    ("team spirit", "tinh thần đồng đội"),
    ("sports facilities", "cơ sở vật chất thể thao"),
    ("sports equipment", "dụng cụ thể thao"),
    ("sports injuries", "chấn thương thể thao"),
    ("sports tournament", "giải đấu thể thao"),
    ("gym membership", "thẻ thành viên phòng gym")
]

categories_html = "\n".join([make_card(en, vn, "#3b82f6") for en, vn in categories])
popular_html = "\n".join([make_card(en, vn, "#10b981") for en, vn in popular_sports])
exercise_html = "\n".join([make_card(en, vn, "#f59e0b") for en, vn in exercise_activities])
habits_html = "\n".join([make_card(en, vn, "#8b5cf6") for en, vn in activities_habits])
benefits_html = "\n".join([make_card(en, vn, "#06b6d4") for en, vn in benefits])
terms_html = "\n".join([make_card(en, vn, "#ec4899") for en, vn in terms])

sports_html = f"""
                        <!-- Sub-tab content cho Sports & Exercise -->
                        <div id="subtab-sports" class="subtab-pane fade-in" style="display: none;">
                            
                            <!-- CATEGORIES OF SPORTS -->
                            <div class="benefits-grid" id="sports-categories">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; display: inline-block;">🏅 CATEGORIES OF SPORTS</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{categories_html}
                                </div>
                            </div>

                            <!-- POPULAR SPORTS -->
                            <div class="benefits-grid" id="sports-popular">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 0.5rem; display: inline-block;">⚽ POPULAR SPORTS</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{popular_html}
                                </div>
                            </div>

                            <!-- EXERCISE & FITNESS ACTIVITIES -->
                            <div class="benefits-grid" id="sports-exercise">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 0.5rem; display: inline-block;">🧘 EXERCISE & FITNESS ACTIVITIES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{exercise_html}
                                </div>
                            </div>

                            <!-- SPORTS ACTIVITIES & HABITS -->
                            <div class="benefits-grid" id="sports-habits">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; display: inline-block;">🏃 SPORTS ACTIVITIES & HABITS</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{habits_html}
                                </div>
                            </div>

                            <!-- HEALTH & FITNESS BENEFITS -->
                            <div class="benefits-grid" id="sports-benefits">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 0.5rem; display: inline-block;">💪 HEALTH & FITNESS BENEFITS</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{benefits_html}
                                </div>
                            </div>

                            <!-- SPORTS TERMS & EQUIPMENT -->
                            <div class="benefits-grid" id="sports-terms">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #ec4899; border-bottom: 2px solid #ec4899; padding-bottom: 0.5rem; display: inline-block;">🏆 SPORTS TERMS & EQUIPMENT</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{terms_html}
                                </div>
                            </div>
                            
                            <div style="margin-top: 3rem;">
                                <div class="f-title" style="text-align: center; margin-bottom: 1.5rem; color: var(--primary);">
                                    <i class="fa-solid fa-gamepad"></i> Góc Ôn Tập Từ Vựng
                                </div>
                                
                                <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;">
                                    <button class="btn" onclick="startReviewGame('flashcards', 'subtab-sports')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border:none; box-shadow: 0 4px 10px rgba(16,185,129,0.3);"><i class="fa-solid fa-layer-group"></i> Lật Thẻ</button>
                                    <button class="btn" onclick="startReviewGame('matching', 'subtab-sports')" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; border:none; box-shadow: 0 4px 10px rgba(139,92,246,0.3);"><i class="fa-solid fa-link"></i> Nối Từ</button>
                                    <button class="btn" onclick="startReviewGame('quiz', 'subtab-sports')" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border:none; box-shadow: 0 4px 10px rgba(245,158,11,0.3);"><i class="fa-solid fa-list-check"></i> Trắc Nghiệm</button>
                                    <button class="btn" onclick="startReviewGame('spelling', 'subtab-sports')" style="background: linear-gradient(135deg, #ec4899, #be185d); color: white; border:none; box-shadow: 0 4px 10px rgba(236,72,153,0.3);"><i class="fa-solid fa-keyboard"></i> Gõ Từ</button>
                                </div>

                                <div class="game-stage" style="background: var(--bg-card); border: 2px solid var(--border); border-radius: 20px; padding: 2rem; min-height: 400px; position: relative; overflow: hidden; box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);">
                                    <div class="game-placeholder" style="color: var(--text-muted); font-size: 1.1rem; text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%;">
                                        <i class="fa-solid fa-ghost" style="font-size: 3.5rem; margin-bottom: 1rem; color: var(--border);"></i><br>
                                        Hãy chọn một trò chơi để bắt đầu ôn tập
                                    </div>
                                    <div class="game-content" style="display: none; height: 100%; width: 100%;"></div>
                                </div>
                            </div>
                        </div>"""

end_str = """                                    <div class="game-content" style="display: none; height: 100%; width: 100%;"></div>
                                </div>
                            </div>
                        </div>"""

idx = content.rfind(end_str)
if idx != -1:
    content = content[:idx+len(end_str)] + sports_html + content[idx+len(end_str):]
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated SPORTS & EXERCISE successfully.")
else:
    print("Could not find the end marker.")
