import re

with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import LanguageOverrideProvider if not imported
if 'LanguageOverrideProvider' not in content:
    content = content.replace(
        "import { useTranslation } from '../../LanguageContext';",
        "import { useTranslation, LanguageOverrideProvider } from '../../LanguageContext';"
    )

# 2. Wrap ReactDOMServer.renderToString for PrenatalPage with LanguageOverrideProvider
content = re.sub(
    r"const p1 = ReactDOMServer\.renderToString\(<PrenatalPage1 (.*?) />\);",
    r"const p1 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage1 \1 /></LanguageOverrideProvider>);",
    content
)
content = re.sub(
    r"const p2 = ReactDOMServer\.renderToString\(<PrenatalPage2 (.*?) />\);",
    r"const p2 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage2 \1 /></LanguageOverrideProvider>);",
    content
)
content = re.sub(
    r"const p3 = ReactDOMServer\.renderToString\(<PrenatalPage3 (.*?) />\);",
    r"const p3 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage3 \1 /></LanguageOverrideProvider>);",
    content
)
content = re.sub(
    r"const p4 = ReactDOMServer\.renderToString\(<PrenatalPage4 (.*?) />\);",
    r"const p4 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><PrenatalPage4 \1 /></LanguageOverrideProvider>);",
    content
)

# Do the same for other folders if they exist?
# FolderVacina
content = re.sub(
    r"const vp([1-6]) = ReactDOMServer\.renderToString\(<FolderVacinaPage([1-6]) (.*?) />\);",
    r"const vp\1 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderVacinaPage\2 \3 /></LanguageOverrideProvider>);",
    content
)

# FolderCuidados
content = re.sub(
    r"const cp([1-6]) = ReactDOMServer\.renderToString\(<FolderCuidadosPage([1-6]) (.*?) />\);",
    r"const cp\1 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderCuidadosPage\2 \3 /></LanguageOverrideProvider>);",
    content
)

# FolderSono
content = re.sub(
    r"const sp([1-6]) = ReactDOMServer\.renderToString\(<FolderSonoPage([1-6]) (.*?) />\);",
    r"const sp\1 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderSonoPage\2 \3 /></LanguageOverrideProvider>);",
    content
)

# FolderAmamentacao
content = re.sub(
    r"const ap([1-6]) = ReactDOMServer\.renderToString\(<FolderAmamentacaoPage([1-6]) (.*?) />\);",
    r"const ap\1 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderAmamentacaoPage\2 \3 /></LanguageOverrideProvider>);",
    content
)

# Folder
content = re.sub(
    r"const fp([2-5]) = ReactDOMServer\.renderToString\(<FolderPage([2-5])Art (.*?) />\);",
    r"const fp\1 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderPage\2Art \3 /></LanguageOverrideProvider>);",
    content
)
content = re.sub(
    r"const f6 = ReactDOMServer\.renderToString\(<FolderPage6Etiqueta (.*?) />\);",
    r"const f6 = ReactDOMServer.renderToString(<LanguageOverrideProvider lang={lang} dictionary={dictionary}><FolderPage6Etiqueta \1 /></LanguageOverrideProvider>);",
    content
)


# 3. Fix the Prenatal pattern duplication on the cover
# Find the exact PDF wrapper for PrenatalPage
prenatal_pdf_old = r"""<div style="width:297mm;height:210mm;display:flex;">
                <div style="flex:1;position:relative;${comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${((patternScale || 120)*0.35).toFixed(1)}mm;background-repeat:repeat;` : `background:${borderColor||accentColor}15;`}">${p4}</div>
                <div style="flex:1;position:relative;${comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${((patternScale || 120)*0.35).toFixed(1)}mm;background-repeat:repeat;` : `background:${borderColor||accentColor}15;`}">${p1}</div>
              </div>"""

prenatal_pdf_new = r"""<div style="width:297mm;height:210mm;display:flex;${comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${((patternScale || 120)*0.35).toFixed(1)}mm;background-repeat:repeat;` : `background:${borderColor||accentColor}15;`}">
                <div style="flex:1;position:relative;">${p4}</div>
                <div style="flex:1;position:relative;">${p1}</div>
              </div>"""

content = content.replace(prenatal_pdf_old, prenatal_pdf_new)

# 4. Same for p2, p3
prenatal_pdf_old_2 = r"""<div style="width:297mm;height:210mm;display:flex;">
                <div style="flex:1;position:relative;${comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${((patternScale || 120)*0.35).toFixed(1)}mm;background-repeat:repeat;` : `background:${borderColor||accentColor}15;`}">${p2}</div>
                <div style="flex:1;position:relative;${comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${((patternScale || 120)*0.35).toFixed(1)}mm;background-repeat:repeat;` : `background:${borderColor||accentColor}15;`}">${p3}</div>
              </div>"""

prenatal_pdf_new_2 = r"""<div style="width:297mm;height:210mm;display:flex;${comBorda && patternSrc ? `background-image:url(${patternSrc});background-size:${((patternScale || 120)*0.35).toFixed(1)}mm;background-repeat:repeat;` : `background:${borderColor||accentColor}15;`}">
                <div style="flex:1;position:relative;">${p2}</div>
                <div style="flex:1;position:relative;">${p3}</div>
              </div>"""

content = content.replace(prenatal_pdf_old_2, prenatal_pdf_new_2)

with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed prenatal PDF!")
