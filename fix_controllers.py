import glob

for file in glob.glob('backend/src/api/*/controllers/*.ts'):
    with open(file, 'r') as f:
        content = f.read()
    
    content = content.replace("process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY", "process.env.GEMINI_API_KEY")
    
    with open(file, 'w') as f:
        f.write(content)
