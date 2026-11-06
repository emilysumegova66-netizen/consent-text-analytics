# Consent-based text activity analytics

Static dashboard hosted with GitHub Pages; Supabase provides authentication and storage.

## Use it
1. Open the GitHub Pages site and create a dashboard account.
2. Sign in. The dashboard creates an owned tracking project and generates an install snippet.
3. Copy that snippet and paste it immediately before `</body>` on your website.
4. Visitors see an Allow / Decline consent prompt. Only after Allow, the tracker sends field label, field type, page path and character count.
5. Refresh the dashboard to see activity.

## Privacy and security
This tracker does **not** read or transmit typed text, keystrokes, passwords, or form values. Password/hidden fields and common payment-card autocomplete fields are excluded. The database uses row-level security: anonymous visitors can submit minimal events; signed-in owners can read events for their own tracking projects. The browser key is a public anon key, not a service-role secret. Review your site's privacy notice, consent requirements and retention policy before production use.
