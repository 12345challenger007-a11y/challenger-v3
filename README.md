# CHALLENGER

Tagline: Learn • Practice • Challenge • Achieve

Overview
- CHALLENGER is a free student learning, practice, community and challenge platform built with:
  - Next.js + TypeScript (app router)
  - Tailwind CSS
  - Supabase (Postgres, Auth, Storage)
  - Server-side AI via AI_API_KEY (OpenAI or other provider)
  - YouTube Data API (server-side)

Local setup
1. Clone repository
2. Create a Supabase project (https://app.supabase.com)
3. Run SQL migrations in supabase/migrations in the SQL editor (apply 001_initial_schema.sql, then 002_rls_policies.sql, then 003_functions.sql)
4. Create a Supabase Auth provider (email)
5. Create a Storage bucket `resources`
6. Create environment variables (copy .env.example to .env.local)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (server-only)
   - AI_API_KEY
   - YOUTUBE_API_KEY
7. Install dependencies: `pnpm install` or `npm install`
8. Run dev: `npm run dev`
9. Open http://localhost:3000

Supabase setup (summary)
- Create project
- In SQL editor run migrations (001, 002, 003)
- Set Row Level Security policies as included or via the SQL file
- Create storage bucket `resources` and configure CORS as needed
- Create service role key (found in Settings → API) and set SUPABASE_SERVICE_ROLE_KEY in your deployment secrets, never commit it.

AI setup
- Provide AI_API_KEY in env. Implementation uses OpenAI chat completions by default; set AI_API_PROVIDER to `openai` or change lib/ai/server.ts to adapt.

YouTube setup
- Create API key in Google Cloud Console, enable YouTube Data API v3, set YOUTUBE_API_KEY in env.

Vercel deployment
- Create a new Vercel project, connect to GitHub repo
- Add environment variables in the Vercel project settings (all keys including SUPABASE_SERVICE_ROLE_KEY)
- Deploy. Ensure that RLS and service-side admin access is correct.

Security notes
- The SUPABASE_SERVICE_ROLE_KEY must never be exposed to client code or committed.
- Use Supabase RLS policies to limit access.
- AI endpoint is rate-limited; consider adding edge rate limiting on Vercel (or use a third-party).
- Validate file uploads (file size, MIME types) server-side before storing to Supabase Storage.

Limitations
- Realtime 1v1 battle feature scaffolding included, but for very low-latency matchmaking you should add a Realtime server or use Supabase Realtime with WebSockets scaling considerations.
- The in-memory rate limiter is for dev only; use Redis or a managed rate-limiter in prod.
- UI is a solid skeleton and functional, but you may iterate on the design for final polish and animations.
