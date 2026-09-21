# FitTrack AI 💪🤖

FitTrack AI is a modern, full-stack fitness and nutrition tracking application powered by generative AI. It allows users to track their meals, log activities, and receive personalized fitness coaching directly from an intelligent AI assistant.

## Live Demo & Repository
- **Live Frontend**: [https://frontend-fit-track-ai.vercel.app](https://frontend-fit-track-ai.vercel.app) *(Placeholder)*
- **Live Backend**: [https://fittrack-ai-api.onrender.com](https://fittrack-ai-api.onrender.com) *(Placeholder)*
- **GitHub Repository**: [https://github.com/kanaky27/fittrack-ai-agentic](https://github.com/kanaky27/fittrack-ai-agentic) *(Placeholder)*

## Key Features
- 🥑 **AI Food Scanner**: Upload a photo of your meal and let AI instantly identify the food and estimate calories. (Powered by Gemini 1.5 Flash).
- 💬 **Personalized AI Coach**: An integrated chatbot that knows your goals, height, weight, and *today's* actual calorie intake/burn, providing deeply contextual fitness advice.
- 📊 **Dashboard & Progress Tracking**: Visualize your daily calorie consumption against your limits.
- 🔐 **Secure Authentication**: Fully secure JWT-based authentication system.
- 🛡️ **Absolute Data Isolation**: Multi-tenant database design ensures your chat history and food logs are strictly isolated and private.

## Architecture Overview
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Strapi v5 (Node.js/TypeScript REST API).
- **Database**: PostgreSQL (Production) / SQLite (Local Development).
- **AI Integration**: Google Generative AI (`gemini-1.5-flash`), strictly executed server-side.

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm run develop
```
- Rename `backend/.env.example` to `backend/.env` and add your `GEMINI_API_KEY=your_key_here`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Known Limitations
- The AI Coach uses your *current day* fitness metrics and recent conversation history to provide advice. It does not actively retrieve lifetime historical data to maintain rapid response times and stay within AI token limits.

---
*Built with ❤️ and AI.*
