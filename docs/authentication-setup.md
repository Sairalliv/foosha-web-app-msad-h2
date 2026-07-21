# Authentication and email verification setup

Foosha uses Supabase Email/Password authentication with email confirmation enabled in production. The application does not send SMTP mail itself: Supabase Auth sends every confirmation email, so SMTP credentials belong in the Supabase Dashboard or Management API, never in Vercel or a `NEXT_PUBLIC_` variable.

## Required application environment variables

Set these values in `.env.local` for local development and in Vercel for Development, Preview, and Production as appropriate:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL from Supabase Connect/API Keys. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Publishable key from Supabase Connect/API Keys. This is safe to expose to the browser. |
| `SUPABASE_SECRET_KEY` | Server-only admin features | Secret key from Supabase Connect/API Keys. Never use the `NEXT_PUBLIC_` prefix. The legacy `SUPABASE_SERVICE_ROLE_KEY` is also accepted temporarily. |
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` locally and the canonical `https://...` Vercel URL in production. |

Do not configure `SMTP_HOST`, `SMTP_PASSWORD`, or other SMTP credentials in Vercel for this flow. Supabase Auth does not read them from the app; configure them in the Supabase project instead.

## Supabase Dashboard checklist

1. Go to **Authentication -> Sign In / Providers -> Email**. Enable Email and Password sign-in and **Confirm Email**. Ensure **Allow new users to sign up** is enabled.
2. Go to **Authentication -> URL Configuration**. Set the Site URL to the production `NEXT_PUBLIC_SITE_URL`. Add `http://localhost:3000/auth/callback` and `https://your-domain/auth/callback`; add any required Vercel preview callback pattern.
3. Go to **Authentication -> SMTP** and enable Custom SMTP for production. Enter the provider's SMTP host, port, username, password, From email, and sender name. Use the provider's documented TLS mode: port 587 normally uses STARTTLS; port 465 normally uses implicit TLS.
4. Verify the sender domain with the provider and publish its SPF, DKIM, and DMARC records. Check **Authentication -> Logs** after a test signup for provider handoff errors.
5. If Google sign-in is offered, keep the Google provider enabled and register the same `/auth/callback` URLs with Google.

Supabase's built-in SMTP service is development-only: it only sends to organization members and is rate limited. It cannot support Foosha production registrations.

## Local development

Use a mail sandbox such as Mailtrap in the Supabase SMTP configuration to test confirmations without delivering to real users. Do not disable confirmation in production. If a temporary local-only exception is unavoidable, disable Confirm Email only in the local Supabase project's Email provider, then re-enable it before testing the production project.

## Verification flow

The registration Server Action creates the Auth user and requests a confirmation link for `/auth/callback`. The page then tells the user to verify their inbox instead of sending them to a dashboard without a session. The callback exchanges the confirmation code for the session and forwards the verified user to `/dashboard`.
