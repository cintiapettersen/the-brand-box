import re

path = 'src/app/[lang]/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

icon_code = """const LightbulbIcon = ({ size = 20, color = 'var(--text-primary)' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M9.5 14h5" />
    <path d="M12 2v1" />
    <path d="M20 8h-1" />
    <path d="M5 8H4" />
    <path d="M17.65 3.35l-1.41 1.41" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.65 12.65l-1.41-1.41" />
    <path d="M4.93 11.07l1.41-1.41" />
  </svg>
);

export default function Home() {"""

content = content.replace("export default function Home() {", icon_code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("page.js fixed!")
