import { factories } from '@strapi/strapi';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default factories.createCoreController('api::meal.meal' as any, ({ strapi }: { strapi: any }) => ({
  async analyzeFood(ctx: any) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('You must be logged in.');
      }

      const { imageBase64 } = ctx.request.body;
      if (!imageBase64) {
        return ctx.badRequest('Image is required.');
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return ctx.internalServerError('AI is not configured on the server.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const availableModels = ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-1.5-pro'];

      const imagePart = { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } };
      const prompt = `Analyze this food image. Return ONLY a valid JSON object with exactly these keys: "name" (string, the food name), "calories" (number, estimated calories). Do not use markdown.`;

      let result = null;
      let lastError = null;

      for (const m of availableModels) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: m,
            generationConfig: { responseMimeType: "application/json" }
          });
          result = await model.generateContent([prompt, imagePart]);
          if (result) break;
        } catch(err: any) {
          lastError = err.message;
        }
      }

      if (!result) {
        return ctx.internalServerError('AI failed to generate a response. ' + lastError);
      }

      const text = result.response.text().trim();
      const parsed = JSON.parse(text);

      return { data: parsed };

    } catch (err) {
      console.error(err);
      return ctx.internalServerError('Something went wrong during image processing.');
    }
  }
}));
