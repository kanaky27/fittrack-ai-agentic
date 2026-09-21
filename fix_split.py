with open('frontend/src/pages/AICoach.tsx', 'r') as f:
    content = f.read()

content = content.replace("text.split('\n');", "text.split('\\n');")

with open('frontend/src/pages/AICoach.tsx', 'w') as f:
    f.write(content)
