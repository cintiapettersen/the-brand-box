import os
task_path = '/Users/cintiapettersen/.gemini/antigravity/brain/883a0d3b-bcc3-48a5-ba35-61ce75c1d320/task.md'
with open(task_path, 'r') as f:
    content = f.read()

content = content.replace('`[/]` Update `src/dictionaries/', '`[x]` Update `src/dictionaries/')
content = content.replace('`[ ]` Update `src/app/[lang]/page.js', '`[/]` Update `src/app/[lang]/page.js')

with open(task_path, 'w') as f:
    f.write(content)
