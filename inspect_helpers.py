with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('export const getPatternTileMm')
if idx >= 0:
    print('Found at char', idx)
    print(repr(content[idx:idx+350]))
else:
    print('NOT FOUND')
