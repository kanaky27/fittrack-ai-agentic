with open('backend/src/api/chat-message/controllers/chat-message.ts', 'r') as f:
    content = f.read()

# Fix GEMINI_API_KEY
content = content.replace("process.env.GEMINI_API_KEY;", "process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;")

# Override find
replacement_find = """
export default factories.createCoreController('api::chat-message.chat-message' as any, ({ strapi }: { strapi: any }) => ({
  async find(ctx: any) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('You must be logged in.');

    // Force the query to only return the authenticated user's messages
    ctx.query = {
      ...ctx.query,
      filters: {
        ...(ctx.query.filters || {}),
        user: user.id
      }
    };

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
"""

content = content.replace("export default factories.createCoreController('api::chat-message.chat-message' as any, ({ strapi }: { strapi: any }) => ({", replacement_find)

with open('backend/src/api/chat-message/controllers/chat-message.ts', 'w') as f:
    f.write(content)
