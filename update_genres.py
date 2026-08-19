import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

def make_card(en, vn, color="#3b82f6"):
    # Speak first part if there is a slash
    speak_term = en.split("/")[0].strip().replace("'", "\\'")
    # Remove parenthetical details for speech if any
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

# 1. New KINDS OF BOOKS list (Plural + with 'books' / 'novels')
books_genres = [
    ("novels", "tiểu thuyết"),
    ("comic books / comics", "truyện tranh"),
    ("graphic novels", "tiểu thuyết đồ họa / truyện tranh dài"),
    ("fiction books", "sách hư cấu"),
    ("non-fiction books", "sách phi hư cấu / người thật việc thật"),
    ("sci-fi books / science fiction books", "sách khoa học viễn tưởng"),
    ("romance novels / romance books", "tiểu thuyết lãng mạn / tình cảm"),
    ("thriller books / thrillers", "truyện giật gân / ly kỳ"),
    ("mystery books / detective books", "truyện bí ẩn / trinh thám"),
    ("biographies", "sách tiểu sử"),
    ("autobiographies", "sách tự truyện"),
    ("historical novels / history books", "tiểu thuyết lịch sử / sách lịch sử"),
    ("fantasy books", "truyện giả tưởng / kỳ ảo"),
    ("adventure books / adventure stories", "truyện phiêu lưu"),
    ("horror books / horror stories", "truyện kinh dị"),
    ("picture books", "sách tranh"),
    ("self-help books", "sách kỹ năng sống / phát triển bản thân"),
    ("travel books", "sách du lịch"),
    ("poetry books / poetry collections", "tập thơ / sách thơ"),
    ("short stories", "truyện ngắn"),
    ("textbooks", "sách giáo khoa / giáo trình")
]

# 2. New TYPES OF MOVIES list (Plural + with 'movies' / 'films')
movies_genres = [
    ("action movies", "phim hành động"),
    ("horror movies", "phim kinh dị"),
    ("comedy movies / comedies", "phim hài"),
    ("romantic movies / rom-coms", "phim lãng mạn / hài tình cảm"),
    ("thriller movies / thrillers", "phim ly kỳ / giật gân"),
    ("sci-fi movies / science fiction movies", "phim khoa học viễn tưởng"),
    ("animated movies / cartoons", "phim hoạt hình"),
    ("documentaries / documentary films", "phim tài liệu"),
    ("drama movies / dramas", "phim tâm lý / chính kịch"),
    ("fantasy movies", "phim giả tưởng / kỳ ảo"),
    ("adventure movies", "phim phiêu lưu"),
    ("mystery movies / detective movies", "phim trinh thám / bí ẩn"),
    ("musical movies / musicals", "phim ca nhạc"),
    ("historical movies", "phim lịch sử"),
    ("blockbuster movies / blockbusters", "phim bom tấn")
]

books_html = "\n".join([make_card(en, vn, "#3b82f6") for en, vn in books_genres])
movies_html = "\n".join([make_card(en, vn, "#3b82f6") for en, vn in movies_genres])

# Replace KINDS OF BOOKS grid content
books_pattern = r'(<div class="benefits-grid" id="books-grid">[\s\S]*?<div style="display:grid; grid-template-columns: repeat\(auto-fit, minmax\(300px, 1fr\)\); gap: 1rem; margin-bottom: 2rem;">)[\s\S]*?(<\/div>\s*<\/div>)'
new_books_section = f'''<div class="benefits-grid" id="books-grid">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; display: inline-block;">📚 KINDS OF BOOKS</h3>
<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{books_html}
</div>
                            </div>'''

content = re.sub(r'<div class="benefits-grid" id="books-grid">[\s\S]*?<\/div>\s*<\/div>', new_books_section, content, count=1)

# Replace TYPES OF MOVIES grid content
new_movies_section = f'''<div class="benefits-grid" id="movies-types">
                                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; display: inline-block;">🎬 TYPES OF MOVIES</h3>
                                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
{movies_html}
                                </div>
                            </div>'''

content = re.sub(r'<div class="benefits-grid" id="movies-types">[\s\S]*?<\/div>\s*<\/div>', new_movies_section, content, count=1)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated genres for BOOKS and MOVIES successfully.")
