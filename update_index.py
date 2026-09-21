with open('backend/src/index.ts', 'r') as f:
    content = f.read()

# Add the chat-message controller to permissions
replacement = """
            'api::chat-message': {
              controllers: { 'chat-message': { find: { enabled: true }, create: { enabled: true }, chat: { enabled: true } } }
            },
            'plugin::users-permissions': {
"""

content = content.replace("'plugin::users-permissions': {", replacement.strip())

with open('backend/src/index.ts', 'w') as f:
    f.write(content)
