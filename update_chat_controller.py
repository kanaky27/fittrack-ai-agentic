import re

files = [
    'backend/src/api/chat-message/controllers/chat-message.ts',
    'backend/src/api/chat-message/routes/chat-message.ts',
    'backend/src/api/chat-message/services/chat-message.ts'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    content = content.replace("'api::chat-message.chat-message'", "'api::chat-message.chat-message' as any")
    content = content.replace("({ strapi }) =>", "({ strapi }: { strapi: any }) =>")
    content = content.replace("async chat(ctx) {", "async chat(ctx: any) {")
    content = content.replace("msg.role", "(msg as any).role")
    content = content.replace("msg.content", "(msg as any).content")

    with open(file, 'w') as f:
        f.write(content)
