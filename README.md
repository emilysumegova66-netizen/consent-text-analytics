# Consent-based text interaction analytics

A lightweight dashboard and embeddable tracker. Tracking starts only after visitors accept the consent prompt. It records only field type, an optional developer-supplied `data-analytics-label`, character count, page path and timestamp. It never sends the text typed or keystrokes. Password, email, telephone, number, hidden and file inputs are excluded; fields marked `data-private` are ignored.

## Use
1. Create an account on the dashboard and sign in.
2. Create a tracking project.
3. Copy the generated embed snippet into a website you own or administer.
4. Optionally label a field with `data-analytics-label="contact-message"` (avoid personal data).
5. Tell visitors what is collected and obtain consent as required by applicable law.

The public browser key is intended for client use. Never put a Supabase service-role or secret key in browser code. The SQL schema is available in `supabase/schema.sql`.
