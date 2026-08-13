import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add the tab button
new_tab_btn = """<button class="sub-tab-btn" onclick="switchSubTab('music')" style="padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid var(--primary); background: transparent; color: var(--primary); cursor: pointer; white-space: nowrap; font-weight: 600; font-size: 0.95rem; transition: all 0.3s;">MUSIC</button>
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

kinds = [
    ("classical music", "nhạc cổ điển"),
    ("pop music", "nhạc pop"),
    ("rock music", "nhạc rock"),
    ("jazz", "nhạc jazz"),
    ("hip hop", "nhạc hip hop"),
    ("rap", "nhạc rap"),
    ("folk music", "nhạc dân ca"),
    ("country music", "nhạc đồng quê"),
    ("EDM", "nhạc EDM / nhạc điện tử"),
    ("R&B", "nhạc R&B"),
    ("blues", "nhạc blues"),
    ("ballad", "nhạc ballad"),
    ("indie music", "nhạc indie"),
    ("traditional music", "nhạc truyền thống"),
    ("soundtrack", "nhạc phim"),
    ("instrumental music", "nhạc không lời"),
    ("opera", "nhạc kịch / opera")
]

instruments = [
    ("guitar", "đàn ghi-ta"),
    ("piano", "đàn dương cầm / piano"),
    ("violin", "đàn vĩ cầm / vi-ô-lông"),
    ("drum", "cái trống"),
    ("flute", "cây sáo"),
    ("trumpet", "kèn trumpet"),
    ("saxophone", "kèn saxophone"),
    ("cello", "đàn xen-lô"),
    ("ukulele", "đàn ukulele"),
    ("harmonica", "kèn harmonica")
]

activities = [
    ("listen to music", "nghe nhạc"),
    ("play an instrument", "chơi một nhạc cụ"),
    ("sing a song", "hát một bài hát"),
    ("attend a concert", "tham dự một buổi hòa nhạc"),
    ("download music", "tải nhạc"),
    ("write songs", "viết bài hát"),
    ("hum a tune", "ngân nga một giai điệu"),
    ("have good taste in music", "có gu âm nhạc tốt"),
    ("play music loudly", "bật nhạc lớn"),
    ("listen to music while studying", "nghe nhạc trong khi học"),
    ("sing along", "hát theo"),
    ("go to a live performance", "đi xem biểu diễn trực tiếp"),
    ("stream music online", "phát nhạc trực tuyến"),
    ("enjoy background music", "thưởng thức nhạc nền"),
    ("dance to the beat", "nhảy theo nhịp điệu"),
    ("join a band", "tham gia một ban nhạc")
]

adjs = [
    ("lively", "sống động"),
    ("catchy", "bắt tai"),
    ("melodic", "du dương"),
    ("upbeat", "nhịp độ nhanh / vui nhộn"),
    ("relaxing", "thư giãn"),
    ("emotional", "giàu cảm xúc"),
    ("energetic", "tràn đầy năng lượng"),
    ("romantic", "lãng mạn"),
    ("peaceful", "yên bình"),
    ("nostalgic", "hoài niệm"),
    ("dramatic", "kịch tính"),
    ("fast-paced", "nhịp điệu nhanh"),
    ("soulful", "truyền cảm"),
    ("haunting", "ám ảnh"),
    ("jazzy", "mang âm hưởng jazz"),
    ("classical", "mang tính cổ điển"),
    ("traditional", "mang tính truyền thống"),
    ("modern", "hiện đại"),
    ("rhythmic", "nhịp nhàng"),
    ("cheerful", "vui tươi")
]

people = [
    ("singer", "ca sĩ"),
    ("musician", "nhạc sĩ"),
    ("composer", "nhà soạn nhạc"),
    ("band", "ban nhạc"),
    ("orchestra", "dàn nhạc giao hưởng"),
    ("solo artist", "nghệ sĩ solo"),
    ("guitarist", "người chơi ghi-ta"),
    ("pianist", "người chơi piano"),
    ("violinist", "người chơi vĩ cầm"),
    ("hit song", "bài hát nổi tiếng"),
    ("lyrics", "lời bài hát"),
    ("melody", "giai điệu"),
    ("rhythm", "nhịp điệu"),
    ("tune", "giai điệu"),
    ("album", "album nhạc"),
    ("stage", "sân khấu"),
    ("microphone", "mic-rô"),
    ("DJ", "người chỉnh nhạc (DJ)")
]


kinds_html = "\n".join([make_card(en, vn, "#3b82f6") for en, vn in kinds])
inst_html = "\n".join([make_card(en, vn, "#f59e0b") for en, vn in instruments])
act_html = "\n".join([make_card(en, vn, "#10b981") for en, vn in activities])
adjs_html = "\n".join([make_card(en, vn, "#8b5cf6") for en, vn in adjs])
people_html = "\n".join([make_card(en, vn, "#06b6d4") for en, vn in people])

music_html = f"""
                        <!-- Sub-tab content cho Music -->
                        <div id="subtab-music" class="subtab-pane hidden fade-in" style="display: none;">
                            
                            <!-- KINDS OF MUSIC -->
                            <div class="benefits-grid" id="music-kinds">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; display: inline-block;">🎵 KINDS OF MUSIC</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{kinds_html}
                                </div>
                            </div>

                            <!-- MUSICAL INSTRUMENTS -->
                            <div class="benefits-grid" id="music-instruments">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 0.5rem; display: inline-block;">🎸 MUSICAL INSTRUMENTS</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{inst_html}
                                </div>
                            </div>

                            <!-- MUSIC ACTIVITIES & PREFERENCES -->
                            <div class="benefits-grid" id="music-activities">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 0.5rem; display: inline-block;">🎤 MUSIC ACTIVITIES & PREFERENCES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{act_html}
                                </div>
                            </div>

                            <!-- ADJECTIVES TO DESCRIBE A KIND OF MUSIC -->
                            <div class="benefits-grid" id="music-adjectives">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; display: inline-block;">✨ ADJECTIVES TO DESCRIBE A KIND OF MUSIC</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{adjs_html}
                                </div>
                            </div>

                            <!-- PEOPLE & MUSICAL TERMS -->
                            <div class="benefits-grid" id="music-people">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 0.5rem; display: inline-block;">👤 PEOPLE & MUSICAL TERMS</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{people_html}
                                </div>
                            </div>
                            
                            <div style="margin-top: 3rem;">
                                <div class="f-title" style="text-align: center; margin-bottom: 1.5rem; color: var(--primary);">
                                    <i class="fa-solid fa-gamepad"></i> Góc Ôn Tập Từ Vựng
                                </div>
                                
                                <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;">
                                    <button class="btn" onclick="startReviewGame('flashcards', 'subtab-music')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border:none; box-shadow: 0 4px 10px rgba(16,185,129,0.3);"><i class="fa-solid fa-layer-group"></i> Lật Thẻ</button>
                                    <button class="btn" onclick="startReviewGame('matching', 'subtab-music')" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; border:none; box-shadow: 0 4px 10px rgba(139,92,246,0.3);"><i class="fa-solid fa-link"></i> Nối Từ</button>
                                    <button class="btn" onclick="startReviewGame('quiz', 'subtab-music')" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border:none; box-shadow: 0 4px 10px rgba(245,158,11,0.3);"><i class="fa-solid fa-list-check"></i> Trắc Nghiệm</button>
                                    <button class="btn" onclick="startReviewGame('spelling', 'subtab-music')" style="background: linear-gradient(135deg, #ec4899, #be185d); color: white; border:none; box-shadow: 0 4px 10px rgba(236,72,153,0.3);"><i class="fa-solid fa-keyboard"></i> Gõ Từ</button>
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
    content = content[:idx+len(end_str)] + music_html + content[idx+len(end_str):]
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated successfully.")
else:
    print("Could not find the end marker.")
