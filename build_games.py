import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add the tab button
new_tab_btn = """<button class="sub-tab-btn" onclick="switchSubTab('games')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid var(--primary); background: transparent; color: var(--primary); cursor: pointer; white-space: nowrap; font-weight: 600; font-size: 0.95rem; transition: all 0.3s;">GAMES</button>
                            <!-- Thêm các chủ đề khác ở đây -->"""
content = content.replace("<!-- Thêm các chủ đề khác ở đây -->", new_tab_btn)

# 2. Build the games html
def make_card(en, vn, color="#3b82f6"):
    en_escaped = en.replace("'", "\\'")
    return f'''    <div style="background: var(--bg-card); padding: 1.2rem; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
        <div>
            <strong style="font-size: 1.1rem; color: {color}; font-weight: 800;">{en}</strong>
            <div style="color: var(--text-muted); margin-top: 0.4rem; font-size: 0.95rem;">{vn}</div>
        </div>
        <button class="icon-btn" style="background: var(--bg-body); border: 1px solid var(--border); margin-left: 10px; flex-shrink: 0;" onclick="speakText('{en_escaped}')" title="Nghe phát âm">
            <i class="fa-solid fa-volume-high"></i>
        </button>
    </div>'''

types = [
    ("action game", "trò chơi hành động"),
    ("adventure game", "trò chơi phiêu lưu"),
    ("role-playing game (RPG)", "trò chơi nhập vai"),
    ("simulation game", "trò chơi mô phỏng"),
    ("sports game", "trò chơi thể thao"),
    ("puzzle game", "trò chơi giải đố"),
    ("strategy game", "trò chơi chiến thuật"),
    ("fighting game", "trò chơi đối kháng"),
    ("shooting game", "trò chơi bắn súng"),
    ("racing game", "trò chơi đua xe"),
    ("survival game", "trò chơi sinh tồn"),
    ("horror game", "trò chơi kinh dị"),
    ("idle game", "trò chơi nhàn rỗi (treo máy)"),
    ("board game", "trò chơi cờ bàn"),
    ("card game", "trò chơi thẻ bài"),
    ("educational game", "trò chơi giáo dục")
]

adjs = [
    ("exciting", "thú vị, hào hứng"),
    ("fast-paced", "nhịp độ nhanh"),
    ("challenging", "đầy thử thách"),
    ("addictive", "gây nghiện"),
    ("immersive", "nhập vai, đắm chìm"),
    ("fun", "vui nhộn"),
    ("strategic", "mang tính chiến thuật"),
    ("interactive", "có tính tương tác"),
    ("competitive", "có tính cạnh tranh"),
    ("visually appealing", "bắt mắt"),
    ("innovative", "mang tính đổi mới"),
    ("engaging", "lôi cuốn, hấp dẫn"),
    ("entertaining", "mang tính giải trí"),
    ("social", "mang tính xã hội"),
    ("rewarding", "bổ ích, đáng giá"),
    ("realistic", "chân thực"),
    ("customizable", "có thể tùy chỉnh"),
    ("educational", "mang tính giáo dục")
]

features = [
    ("high-quality graphics", "đồ họa chất lượng cao"),
    ("realistic sound effects", "hiệu ứng âm thanh chân thực"),
    ("immersive gameplay", "lối chơi nhập vai"),
    ("interactive storyline", "cốt truyện tương tác"),
    ("customizable characters", "nhân vật có thể tùy chỉnh"),
    ("multiplayer mode", "chế độ nhiều người chơi"),
    ("open world environment", "môi trường thế giới mở"),
    ("challenging missions", "nhiệm vụ thử thách"),
    ("daily rewards", "phần thưởng hàng ngày"),
    ("level-up system", "hệ thống thăng cấp")
]

activities = [
    ("explore different worlds", "khám phá các thế giới khác nhau"),
    ("explore endless possibilities", "khám phá những khả năng vô tận"),
    ("complete exciting missions", "hoàn thành các nhiệm vụ thú vị"),
    ("customize my character", "tùy chỉnh nhân vật của tôi"),
    ("interact with other players", "tương tác với những người chơi khác"),
    ("build my own world", "xây dựng thế giới của riêng tôi"),
    ("solve puzzles and challenges", "giải quyết các câu đố và thử thách"),
    ("unlock new levels", "mở khóa các cấp độ mới"),
    ("improve my strategy skills", "cải thiện kỹ năng chiến thuật của tôi"),
    ("enjoy the storyline", "thưởng thức cốt truyện"),
    ("test my reflexes", "kiểm tra phản xạ của tôi"),
    ("experience realistic combat", "trải nghiệm chiến đấu chân thực"),
    ("take part in events or tournaments", "tham gia các sự kiện hoặc giải đấu"),
    ("solve mysteries or uncover secrets", "giải quyết những bí ẩn hoặc khám phá bí mật")
]

adv = [
    ("improve problem-solving skills", "cải thiện kỹ năng giải quyết vấn đề"),
    ("develop strategic thinking", "phát triển tư duy chiến thuật"),
    ("boost creativity and imagination", "thúc đẩy sự sáng tạo và trí tưởng tượng"),
    ("enhance hand-eye coordination", "tăng cường sự phối hợp tay mắt"),
    ("strengthen teamwork and communication", "củng cố tinh thần đồng đội và giao tiếp"),
    ("reduce stress and relax after studying", "giảm căng thẳng và thư giãn sau khi học"),
    ("learn English and other skills through educational games", "học tiếng Anh và các kỹ năng khác thông qua các trò chơi giáo dục"),
    ("improve memory and concentration", "cải thiện trí nhớ và sự tập trung"),
    ("increase quick decision-making ability", "tăng cường khả năng ra quyết định nhanh chóng"),
    ("enjoy entertainment in a fun and engaging way", "tận hưởng giải trí một cách vui vẻ và lôi cuốn")
]

dis = [
    ("lead to game addiction and time-wasting", "dẫn đến nghiện game và lãng phí thời gian"),
    ("reduce physical activity, causing a sedentary lifestyle", "giảm hoạt động thể chất, gây ra lối sống ít vận động"),
    ("affect academic performance if overplayed", "ảnh hưởng đến kết quả học tập nếu chơi quá mức"),
    ("expose players to violent or harmful content", "khiến người chơi tiếp xúc với nội dung bạo lực hoặc độc hại"),
    ("create social isolation and limit face-to-face communication", "tạo ra sự cô lập xã hội và hạn chế giao tiếp trực tiếp"),
    ("harm eyesight due to long screen time", "gây hại cho thị lực do thời gian nhìn màn hình lâu"),
    ("waste money on in-game items", "lãng phí tiền bạc vào các vật phẩm trong game"),
    ("disturb sleep schedule when playing late at night", "làm xáo trộn lịch trình giấc ngủ khi chơi khuya"),
    ("cause frustration or anger after losing", "gây bực bội hoặc tức giận sau khi thua"),
    ("lower productivity in daily tasks and responsibilities", "làm giảm năng suất trong các công việc và trách nhiệm hàng ngày")
]

types_html = "\n".join([make_card(en, vn, "#3b82f6") for en, vn in types])
adjs_html = "\n".join([make_card(en, vn, "#f59e0b") for en, vn in adjs])
features_html = "\n".join([make_card(en, vn, "#10b981") for en, vn in features])
activities_html = "\n".join([make_card(en, vn, "#8b5cf6") for en, vn in activities])
adv_html = "\n".join([make_card(en, vn, "#06b6d4") for en, vn in adv])
dis_html = "\n".join([make_card(en, vn, "#ef4444") for en, vn in dis])

games_html = f"""
                        <!-- Sub-tab content cho Games -->
                        <div id="subtab-games" class="subtab-pane hidden fade-in" style="display: none;">
                            
                            <!-- TYPES OF GAMES -->
                            <div class="benefits-grid" id="games-types">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; display: inline-block;">🎮 TYPES OF GAMES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{types_html}
                                </div>
                            </div>

                            <!-- ADJECTIVES TO DESCRIBE A GAME -->
                            <div class="benefits-grid" id="games-adj">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 0.5rem; display: inline-block;">✨ ADJECTIVES TO DESCRIBE A GAME</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{adjs_html}
                                </div>
                            </div>

                            <!-- FEATURES OF A GAME -->
                            <div class="benefits-grid" id="games-features">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 0.5rem; display: inline-block;">🌟 FEATURES OF A GAME</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{features_html}
                                </div>
                            </div>

                            <!-- GAME-RELATED ACTIVITIES -->
                            <div class="benefits-grid" id="games-activities">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; display: inline-block;">🕹️ GAME-RELATED ACTIVITIES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{activities_html}
                                </div>
                            </div>

                            <!-- ADVANTAGES OF PLAYING GAMES -->
                            <div class="benefits-grid" id="games-advantages">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 0.5rem; display: inline-block;">👍 ADVANTAGES OF PLAYING GAMES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{adv_html}
                                </div>
                            </div>

                            <!-- DISADVANTAGES OF PLAYING GAMES -->
                            <div class="benefits-grid" id="games-disadvantages">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 0.5rem; display: inline-block;">👎 DISADVANTAGES OF PLAYING GAMES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{dis_html}
                                </div>
                            </div>
                            
                            <div style="margin-top: 3rem;">
                                <div class="f-title" style="text-align: center; margin-bottom: 1.5rem; color: var(--primary);">
                                    <i class="fa-solid fa-gamepad"></i> Góc Ôn Tập Từ Vựng
                                </div>
                                
                                <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;">
                                    <button class="btn" onclick="startReviewGame('flashcards', 'subtab-games')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border:none; box-shadow: 0 4px 10px rgba(16,185,129,0.3);"><i class="fa-solid fa-layer-group"></i> Lật Thẻ</button>
                                    <button class="btn" onclick="startReviewGame('matching', 'subtab-games')" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; border:none; box-shadow: 0 4px 10px rgba(139,92,246,0.3);"><i class="fa-solid fa-link"></i> Nối Từ</button>
                                    <button class="btn" onclick="startReviewGame('quiz', 'subtab-games')" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border:none; box-shadow: 0 4px 10px rgba(245,158,11,0.3);"><i class="fa-solid fa-list-check"></i> Trắc Nghiệm</button>
                                    <button class="btn" onclick="startReviewGame('spelling', 'subtab-games')" style="background: linear-gradient(135deg, #ec4899, #be185d); color: white; border:none; box-shadow: 0 4px 10px rgba(236,72,153,0.3);"><i class="fa-solid fa-keyboard"></i> Gõ Từ</button>
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

# Find the end of subtab-books by finding the exact lines:
end_str = """                                    <div class="game-content" style="display: none; height: 100%; width: 100%;"></div>
                                </div>
                            </div>
                        </div>"""

idx = content.rfind(end_str)
if idx != -1:
    content = content[:idx+len(end_str)] + games_html + content[idx+len(end_str):]
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated successfully.")
else:
    print("Could not find the end of subtab-books.")
