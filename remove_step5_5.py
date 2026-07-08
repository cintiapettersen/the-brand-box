import re

path = 'src/app/[lang]/page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Step 5.2 Next button
content = content.replace("onClick={() => setStep(5.5)}", "onClick={() => setStep(6)}")

# 2. Update Back button logic
content = content.replace("else if (step === 6) setStep(5.5);", "else if (step === 6) setStep(5.2);")
content = content.replace("else if (step === 5.5) setStep(5.2);", "")

# 3. Remove Step 5.5 block
step_5_5_pattern = re.compile(r'\s*\{\s*step === 5\.5 && \(\s*<motion\.div.*?</motion\.div>\s*\)\s*\}', re.DOTALL)
content = re.sub(step_5_5_pattern, "", content)

# 4. Remove Personalidade from summary
summary_pattern = re.compile(r'\s*<p[^>]*>✅ <strong>[^<]*summary_personality[^<]*</strong>[^<]*formData\.personalidade[^<]*</p>')
content = re.sub(summary_pattern, "", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Step 5.5 removed successfully!")
