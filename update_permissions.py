with open('backend/src/index.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "controllers: { meal: { find: { enabled: true }, findOne: { enabled: true }, create: { enabled: true }, update: { enabled: true }, destroy: { enabled: true }, delete: { enabled: true } } }",
    "controllers: { meal: { find: { enabled: true }, findOne: { enabled: true }, create: { enabled: true }, update: { enabled: true }, destroy: { enabled: true }, delete: { enabled: true }, analyzeFood: { enabled: true } } }"
)

with open('backend/src/index.ts', 'w') as f:
    f.write(content)
