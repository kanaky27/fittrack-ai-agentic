import re

for file in ['frontend/src/pages/FoodLogs.tsx', 'frontend/src/pages/ActivityLogs.tsx']:
    with open(file, 'r') as f:
        content = f.read()
    
    # Fix date format
    content = content.replace("date: new Date().toISOString()", "date: new Date().toISOString().split('T')[0]")
    # Fix calories number conversion
    content = re.sub(r'const data = \{\n\s*\.\.\.formData,\n', 'const data = {\n                ...formData,\n                calories: Number(formData.calories),\n', content)
    
    with open(file, 'w') as f:
        f.write(content)
