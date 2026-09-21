with open('backend/src/api/chat-message/controllers/chat-message.ts', 'r') as f:
    content = f.read()

content = content.replace("meals.reduce((acc, curr)", "meals.reduce((acc: any, curr: any)")
content = content.replace("activities.reduce((acc, curr)", "activities.reduce((acc: any, curr: any)")
content = content.replace("meals.map(m => m.name)", "meals.map((m: any) => m.name)")
content = content.replace("activities.map(a => a.name)", "activities.map((a: any) => a.name)")
content = content.replace("sortedHistory.map(msg =>", "sortedHistory.map((msg: any) =>")

with open('backend/src/api/chat-message/controllers/chat-message.ts', 'w') as f:
    f.write(content)
