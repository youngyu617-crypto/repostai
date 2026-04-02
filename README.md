# RepostAI

Turn one long content into 10 platform-ready posts in seconds.

A clean, minimal web tool that helps creators repurpose long-form content into multiple platform-ready versions instantly. Built for overseas English-speaking users.

## Tech Stack

- **Framework:** Next.js 15+ (App Router, TypeScript, Server Actions)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **AI:** Vercel AI SDK + Google Gemini (gemini-2.5-flash)
- **Deployment:** Vercel

## Supported Platforms

- LinkedIn Post
- X/Twitter Thread
- Newsletter Summary
- TikTok / YouTube Shorts Script
- Instagram Caption

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project ([supabase.com](https://supabase.com))
- A Google AI API key ([aistudio.google.com](https://aistudio.google.com))

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google AI API key |
| `AI_MODEL` | Model name (default: `gemini-2.5-flash`) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (default: `http://localhost:3000`) |

### 3. Set up the database

Run the SQL migration in your Supabase SQL Editor:

```sql
-- Copy contents of supabase/migrations/001_initial_schema.sql
```

### 4. Configure Supabase Auth

In your Supabase dashboard:

1. **Authentication > Providers:** Enable Google OAuth (add your Google Client ID and Secret)
2. **Authentication > Providers:** Enable Email (enable "Confirm email" for magic links)
3. **Authentication > URL Configuration:** Add redirect URLs:
   - `http://localhost:3000/callback` (development)
   - `https://your-domain.com/callback` (production)

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production URL
5. Deploy

## Switching AI Models

The app is designed to easily switch AI providers via environment variables.

### Use a different Google model

```env
AI_MODEL=gemini-2.5-pro
```

### Switch to a different provider

To use a different AI provider (e.g., OpenAI, Anthropic, Groq), you need to:

1. Install the provider package:
   ```bash
   npm install @ai-sdk/openai
   # or: npm install @ai-sdk/anthropic
   # or: npm install @ai-sdk/groq
   ```

2. Update `src/lib/ai/model.ts`:
   ```typescript
   import { createOpenAI } from "@ai-sdk/openai";
   
   const openai = createOpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   
   export function getModel() {
     return openai("gpt-4o");
   }
   ```

3. Add the new API key to your environment variables.

## Rate Limiting

Free users get 3 generations per day per account. The limit resets at midnight UTC. To modify the limit, change `FREE_DAILY_LIMIT` in `src/lib/constants.ts`.

## Project Structure

```
src/
  app/              # Next.js App Router pages and API routes
    (auth)/         # Login, signup, OAuth callback
    (app)/          # Authenticated pages (history)
    api/generate/   # Streaming AI generation endpoint
  components/
    generator/      # Content input, platform selector, results
    history/        # History list and cards
    layout/         # Header, footer, user menu
    shared/         # Theme toggle, copy button, logo
    ui/             # shadcn/ui primitives
  lib/
    ai/             # Model config, prompts, URL extraction
    supabase/       # Client factories and middleware
  actions/          # Server Actions (auth, generate, history)
  hooks/            # Client-side hooks
```

## License

MIT
