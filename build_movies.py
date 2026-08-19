import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add the tab button
new_tab_btn = """<button class="sub-tab-btn" onclick="switchSubTab('movies')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid var(--primary); background: transparent; color: var(--primary); cursor: pointer; white-space: nowrap; font-weight: 600; font-size: 0.95rem; transition: all 0.3s;">MOVIES</button>
                            <!-- Thêm các chủ đề khác ở đây -->"""
content = content.replace("<!-- Thêm các chủ đề khác ở đây -->", new_tab_btn)

# 2. Build the html
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
    ("action movie", "phim hành động"),
    ("horror movie", "phim kinh dị"),
    ("comedy", "phim hài"),
    ("romantic movie", "phim lãng mạn / tình cảm"),
    ("thriller", "phim ly kỳ / giật gân"),
    ("science fiction (sci-fi)", "phim khoa học viễn tưởng"),
    ("animated movie / cartoon", "phim hoạt hình"),
    ("documentary", "phim tài liệu"),
    ("drama", "phim tâm lý / chính kịch"),
    ("fantasy movie", "phim giả tưởng / kỳ ảo"),
    ("adventure movie", "phim phiêu lưu"),
    ("mystery movie", "phim trinh thám / bí ẩn"),
    ("musical", "phim ca nhạc"),
    ("historical movie", "phim lịch sử"),
    ("blockbuster", "phim bom tấn")
]

adjs = [
    ("funny", "hài hước"),
    ("scary", "đáng sợ"),
    ("romantic", "lãng mạn"),
    ("exciting", "hào hứng / kịch tính"),
    ("boring", "nhàm chán"),
    ("touching", "cảm động"),
    ("realistic", "chân thực"),
    ("imaginative", "giàu trí tưởng tượng"),
    ("well-acted", "diễn xuất tốt"),
    ("fast-paced", "nhịp độ nhanh"),
    ("thought-provoking", "gợi nhiều suy ngẫm"),
    ("visually stunning", "hình ảnh mãn nhãn / tuyệt đẹp"),
    ("gripping", "hấp dẫn / cuốn hút"),
    ("heart-warming", "ấm áp / cảm động"),
    ("predictable", "dễ đoán")
]

activities = [
    ("watch movies at the cinema", "xem phim ở rạp"),
    ("stream movies at home", "xem phim trực tuyến tại nhà"),
    ("eat popcorn and drink soda", "ăn bắp rang và uống nước ngọt"),
    ("binge-watch a series", "cày phim bộ liên tục"),
    ("enjoy the plot twist", "thưởng thức tình tiết bất ngờ"),
    ("watch with subtitles", "xem phim có phụ đề"),
    ("recommend a good movie", "giới thiệu một bộ phim hay"),
    ("read movie reviews", "đọc đánh giá phim"),
    ("discuss the movie ending", "bàn luận về cái kết của phim"),
    ("wait for the post-credit scene", "đợi xem đoạn phim sau phần ghi công (after-credit)")
]

people = [
    ("actor", "nam diễn viên"),
    ("actress", "nữ diễn viên"),
    ("director", "đạo diễn"),
    ("producer", "nhà sản xuất"),
    ("screenwriter", "nhà biên kịch"),
    ("cameraman", "người quay phim"),
    ("main character / protagonist", "nhân vật chính"),
    ("movie critic", "nhà phê bình phim"),
    ("stuntman", "diễn viên đóng thế"),
    ("cast", "dàn diễn viên"),
    ("audience / moviegoer", "khán giả xem phim")
]

elements = [
    ("plot / storyline", "cốt truyện"),
    ("special effects", "hiệu ứng kỹ xảo đặc biệt"),
    ("soundtrack / theme song", "nhạc phim"),
    ("trailer", "đoạn giới thiệu phim"),
    ("ending", "kết thúc (happy ending / sad ending)"),
    ("climax", "cao trào của phim"),
    ("subtitle", "phụ đề"),
    ("premiere", "buổi công chiếu đầu tiên"),
    ("box office", "phòng vé / doanh thu phòng vé"),
    ("cinema ticket", "vé xem phim")
]

types_html = "\n".join([make_card(en, vn, "#3b82f6") for en, vn in types])
adjs_html = "\n".join([make_card(en, vn, "#f59e0b") for en, vn in adjs])
act_html = "\n".join([make_card(en, vn, "#10b981") for en, vn in activities])
people_html = "\n".join([make_card(en, vn, "#8b5cf6") for en, vn in people])
elements_html = "\n".join([make_card(en, vn, "#06b6d4") for en, vn in elements])

movies_html = f"""
                        <!-- Sub-tab content cho Movies -->
                        <div id="subtab-movies" class="subtab-pane hidden fade-in" style="display: none;">
                            
                            <!-- TYPES OF MOVIES -->
                            <div class="benefits-grid" id="movies-types">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; display: inline-block;">🎬 TYPES OF MOVIES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{types_html}
                                </div>
                            </div>

                            <!-- ADJECTIVES TO DESCRIBE MOVIES -->
                            <div class="benefits-grid" id="movies-adjectives">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 0.5rem; display: inline-block;">✨ ADJECTIVES TO DESCRIBE MOVIES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{adjs_html}
                                </div>
                            </div>

                            <!-- MOVIE ACTIVITIES & PREFERENCES -->
                            <div class="benefits-grid" id="movies-activities">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 0.5rem; display: inline-block;">🍿 MOVIE ACTIVITIES & PREFERENCES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{act_html}
                                </div>
                            </div>

                            <!-- PEOPLE IN THE FILM INDUSTRY -->
                            <div class="benefits-grid" id="movies-people">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; display: inline-block;">👥 PEOPLE IN THE FILM INDUSTRY</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{people_html}
                                </div>
                            </div>

                            <!-- FILM ELEMENTS & TERMS -->
                            <div class="benefits-grid" id="movies-elements">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 0.5rem; display: inline-block;">🎞️ FILM ELEMENTS & TERMS</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{elements_html}
                                </div>
                            </div>
                            
                            <div style="margin-top: 3rem;">
                                <div class="f-title" style="text-align: center; margin-bottom: 1.5rem; color: var(--primary);">
                                    <i class="fa-solid fa-gamepad"></i> Góc Ôn Tập Từ Vựng
                                </div>
                                
                                <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;">
                                    <button class="btn" onclick="startReviewGame('flashcards', 'subtab-movies')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border:none; box-shadow: 0 4px 10px rgba(16,185,129,0.3);"><i class="fa-solid fa-layer-group"></i> Lật Thẻ</button>
                                    <button class="btn" onclick="startReviewGame('matching', 'subtab-movies')" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; border:none; box-shadow: 0 4px 10px rgba(139,92,246,0.3);"><i class="fa-solid fa-link"></i> Nối Từ</button>
                                    <button class="btn" onclick="startReviewGame('quiz', 'subtab-movies')" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border:none; box-shadow: 0 4px 10px rgba(245,158,11,0.3);"><i class="fa-solid fa-list-check"></i> Trắc Nghiệm</button>
                                    <button class="btn" onclick="startReviewGame('spelling', 'subtab-movies')" style="background: linear-gradient(135deg, #ec4899, #be185d); color: white; border:none; box-shadow: 0 4px 10px rgba(236,72,153,0.3);"><i class="fa-solid fa-keyboard"></i> Gõ Từ</button>
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
    content = content[:idx+len(end_str)] + movies_html + content[idx+len(end_str):]
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated MOVIES successfully.")
else:
    print("Could not find the end marker.")
