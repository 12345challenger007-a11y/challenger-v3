## Production notes and tightened RLS

- I added an `admin_users` table and a new RLS migration file `004_rls_tighten.sql`. This file contains conservative policies to protect user data while allowing public reads where appropriate.
- Admins may be recognized from the ADMIN_EMAILS environment variable or via `admin_users` rows. You should populate `admin_users` via the Supabase SQL editor or via a server-only script using SUPABASE_SERVICE_ROLE_KEY.

