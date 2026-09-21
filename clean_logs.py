import re

with open('frontend/src/pages/FoodLogs.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"console\.log\(`\[Food AI\].*?`\);\n?", "", content)

with open('frontend/src/pages/FoodLogs.tsx', 'w') as f:
    f.write(content)
