with open("index.html", "r") as f:
    lines = f.readlines()

new_lines = []
skip_overlay = False

for line in lines:
    if '<div class="locked-container"' in line:
        continue # skip the wrapper
    elif '<div class="lock-overlay">' in line:
        skip_overlay = True
        continue
    elif skip_overlay and '</div>' in line and '<div class="locked-content">' in lines[lines.index(line)+1]:
        # Actually it's easier to use a flag that turns off when we see <div class="locked-content">
        pass
    
    if skip_overlay:
        if '<div class="locked-content">' in line:
            skip_overlay = False
        continue
    
    if '<div class="locked-content">' in line:
        continue
    
    # We also need to skip the closing tags of locked-container and locked-content
    # The Yes/No block closing tags are right before </section>
    new_lines.append(line)

with open("index.html", "w") as f:
    f.writelines(new_lines)
