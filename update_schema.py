import json

with open('backend/src/api/chat-message/content-types/chat-message/schema.json', 'r') as f:
    schema = json.load(f)

if "inversedBy" in schema["attributes"]["user"]:
    del schema["attributes"]["user"]["inversedBy"]

with open('backend/src/api/chat-message/content-types/chat-message/schema.json', 'w') as f:
    json.dump(schema, f, indent=2)
