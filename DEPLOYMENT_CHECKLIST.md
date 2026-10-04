# Deployment validation checklist

Before you mark production deployment as complete, validate the following checklist:

1. Environment variables
- Ensure SUPABASE_SERVICE_ROLE_KEY is set only in Vercel server environment variables (do NOT set it as public or in client environment).
- AI_API_KEY and YOUTUBE_API_KEY must be set in server environment variables.
- Set ADMIN_EMAILS env var to a comma-separated list of admin emails (for server-side checks), e.g. ADMIN_EMAILS=admin@example.com

2. Supabase SQL and RLS
- Run migrations in the correct order: 001_initial_schema.sql, 002_rls_policies.sql, 003_functions.sql, 004_rls_tighten.sql
- Verify RLS policies in the Supabase UI; perform sample queries as a non-admin user to confirm access restrictions.

3. Storage
- Create `resources` bucket and configure public/private rules based on your needs.
- Configure bucket CORS if you'll serve files from browser uploads.

4. Secrets and keys
- Rotate any test keys used during development.
- Ensure in logs you do not print secrets.

5. Rate limiting and abuse protection
- Replace in-memory rate limiter with a Redis or managed solution for AI endpoints.
- Set up monitoring/alerts for high usage.

6. Admin access
- Test admin flows with an email listed in ADMIN_EMAILS and with service role RPCs.

7. Performance
- Enable Vercel build optimizations.
- Consider CDN for large resources (PDFs, videos) and cache headers for static data.

8. Backups and migrations
- Schedule regular backups for your Supabase DB.
- Test migrations on a staging DB before running on production.

9. Logging and monitoring
- Configure Sentry or an equivalent for server errors.
- Enable Supabase logs monitoring and Vercel metrics.

10. Final UX checks
- Test flows: signup, onboarding, take test, AI doubt, post doubt, upload resource, submit challenge.

