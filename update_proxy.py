import re

with open('src/proxy.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update locales and defaultLocale
content = content.replace("let locales = ['pt-BR', 'en']", "let locales = ['pt', 'pt-BR', 'en']")
content = content.replace("let defaultLocale = 'pt-BR'", "let defaultLocale = 'pt'")

with open('src/proxy.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/middleware.js', 'w', encoding='utf-8') as f:
    f.write("export { proxy as middleware, config } from './proxy'\n")

print("Updated proxy.js and created middleware.js")
