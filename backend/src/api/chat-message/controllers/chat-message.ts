import { factories } from '@strapi/strapi';
import { GoogleGenerativeAI } from '@google/generative-ai';


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

  async chat(ctx: any) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in.');
      }

      const { message } = ctx.request.body;
      if (!message) {
        return ctx.badRequest('Message is required.');
      }

      // 1. Fetch user's meals and activities for today
      const today = new Date().toISOString().split('T')[0];
      
      const meals = await strapi.entityService.findMany('api::meal.meal', {
        filters: { user: user.id, date: { $eq: today } },
      });
      
      const activities = await strapi.entityService.findMany('api::activity.activity', {
        filters: { user: user.id, date: { $eq: today } },
      });

      const caloriesConsumed = meals.reduce((acc: any, curr: any) => acc + (curr.calories || 0), 0);
      const caloriesBurned = activities.reduce((acc: any, curr: any) => acc + (curr.calories || 0), 0);

      // 2. Fetch Chat History (last 10 messages)
      const history = await strapi.entityService.findMany('api::chat-message.chat-message' as any, {
        filters: { user: user.id },
        sort: { createdAt: 'desc' },
        limit: 10,
      });
      const sortedHistory = history.reverse(); // oldest to newest

      // 3. Build AI Context
      const systemPrompt = `You are a personalized, expert AI Fitness Trainer and Dietician inside the FitTrack app.
Your tone is encouraging, professional, and concise. Format your answers clearly using Markdown (bullet points, bold text).
Never give medical diagnoses. Emphasize that your advice is general fitness guidance.

USER PROFILE:
- Age: ${user.age || 'Unknown'}
- Height: ${user.height || 'Unknown'} cm
- Weight: ${user.weight || 'Unknown'} kg
- Goal: ${user.goal || 'General Fitness'}
- Target Daily Calorie Intake: ${user.dailyCalorieIntake || 'Unknown'} kcal
- Target Daily Calorie Burn: ${user.dailyCalorieBurn || 'Unknown'} kcal

TODAY'S ACTIVITY:
- Calories Consumed Today: ${caloriesConsumed} kcal
- Calories Burned Today: ${caloriesBurned} kcal
- Meals Logged: ${meals.map((m: any) => m.name).join(', ') || 'None'}
- Activities Logged: ${activities.map((a: any) => a.name).join(', ') || 'None'}

When generating your response, directly address their questions using the context of their profile and today's activity.
Provide specific, structured, and actionable advice.`;

      // 4. Set up Gemini
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return ctx.internalServerError('AI is not configured on the server.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-1.5-pro'];
      
      let aiResponseText = "";
      for (const m of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: m, systemInstruction: systemPrompt });
          
          const chatContext = sortedHistory.map((msg: any) => ({
            role: (msg as any).role === 'model' ? 'model' : 'user',
            parts: [{ text: (msg as any).content }]
          }));

          const chat = model.startChat({
            history: chatContext,
          });

          const result = await chat.sendMessage(message);
          aiResponseText = result.response.text();
          if (aiResponseText) break;
        } catch (e) {
          console.error(`Model ${m} failed:`, e);
        }
      }

      if (!aiResponseText) {
        return ctx.internalServerError('AI failed to generate a response.');
      }

      // 5. Save the User's Message
      await strapi.entityService.create('api::chat-message.chat-message' as any, {
        data: {
          role: 'user',
          content: message,
          user: user.id
        }
      });

      // 6. Save the AI's Message
      const aiMessage = await strapi.entityService.create('api::chat-message.chat-message' as any, {
        data: {
          role: 'model',
          content: aiResponseText,
          user: user.id
        }
      });

      return { data: aiMessage };

    } catch (err) {
      console.error(err);
      return ctx.internalServerError('Something went wrong during chat processing.');
    }
  }
}));
