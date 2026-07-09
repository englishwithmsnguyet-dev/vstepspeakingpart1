import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace the items array inside type: 'benefit' when it only contains a few items including 'reduce stress'
# but not the one that already has 5 items.

# Let's find all occurrences of type: 'benefit' and its items array.
pattern = re.compile(r"(type:\s*'benefit',\s*title:\s*'Cụm Lợi ích:',\s*items:\s*\[\s*)(.*?)(\s*\])", re.DOTALL)

standard_benefits = """{ en: 'reduce stress', vn: 'giảm căng thẳng' },
                        { en: 'improve my mood', vn: 'cải thiện tâm trạng' },
                        { en: 'widen my knowledge', vn: 'mở rộng kiến thức' },
                        { en: 'clear my mind', vn: 'thư giãn đầu óc' },
                        { en: 'stay healthy', vn: 'duy trì sức khỏe' }"""

def replacer(match):
    items_content = match.group(2)
    # If it contains 'reduce stress' but less than 4 commas (meaning < 5 items)
    if 'reduce stress' in items_content and items_content.count('{') < 5:
        return match.group(1) + standard_benefits + match.group(3)
    return match.group(0)

new_content = pattern.sub(replacer, content)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated benefits.")
