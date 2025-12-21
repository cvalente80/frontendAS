# Cloud Functions — Ansião Seguros (Chat)

This folder contains Firebase Cloud Functions for the real‑time chat. The main function implemented is:

- notifyOnFirstUserMessage: Sends an email notification to the admin when a user starts a new chat (first message), then marks chat.firstNotified = true.

## Prerequisites

- Node.js 18+
- Firebase CLI (logged in): https://firebase.google.com/docs/cli
- A Firebase project with Firestore enabled

## Install

```bash
cd functions
npm install
```

## Configuration (EmailJS + Admin recipient)

This function uses EmailJS REST API to send email notifications. Configure via environment variables (CI secrets or Firebase runtime vars).

Required env vars:

```bash
export EMAIL_NOTIFICATIONS_ENABLED=true
export EMAILJS_SERVICE_ID="service_4ltybjl"
export EMAILJS_TEMPLATE_ID="template_k0tx9hp"
export EMAILJS_PUBLIC_KEY="<YOUR_EMAILJS_PUBLIC_KEY>" # aka user_id
export ADMIN_TO="carlos@aurelioseguros.com"
export SITE_BASE_URL="https://cvalente80.github.io/frontendAS" # inbox link base
```

Notes:
- EMAILJS_PUBLIC_KEY is the EmailJS public key (user_id). You can reuse your existing public key used in the web app.
- Template variables expected by this function: `to_email`, `name`, `message`.
  - Subject can be defined in EmailJS as `{{name}}`.
  - Body can include `{{name}}` and `{{message}}`.

## Local emulation

Run the Functions emulator (and Firestore if desired) from the repo root if you have a firebase.json configured. From the `functions/` folder you can also run:

```bash
cd functions
npm run build
# Optionally export SITE_BASE_URL for local links in the email template
export SITE_BASE_URL="http://localhost:5173"
# Start emulators for functions (add Firestore if configured at the repo root)
npm run serve
```

Trigger locally by creating a user message under `chats/{chatId}/messages` where `authorRole = "user"` and ensure the parent chat document has `firstNotified = false` (or missing).

## Deploy

```bash
cd functions
npm run deploy
```

This runs `firebase deploy --only functions` using your active Firebase project.

## How it works

- Trigger: `onCreate` of `chats/{chatId}/messages/{messageId}`
- If the message authorRole is `user` and the parent chat has not been notified:
  - It builds an email containing the user identity (name/email/phone) and the first message text
  - Sends via Nodemailer using the SMTP configuration
  - Updates `chats/{chatId}` with `{ firstNotified: true }`

## Related Firestore rules

Rules in the web app project gate access so that:
- Users can only read/update their own `chats/{uid}` (limited fields for updates)
- Admins can read/write all chats

Ensure you’ve provisioned at least one admin (create a document at `admins/{uid}` for your admin user, or set `users/{uid}.isAdmin = true`).

## Troubleshooting

- Missing SMTP or admin recipient
  - The function logs a warning and skips email if SMTP/recipient is not configured.
- Inspect logs
  - Use the Firebase console or `firebase functions:log` to see runtime errors.
- Emails blocked/spam
  - Check SPF/DKIM with your SMTP provider and use a verified sender.

## Notes

- The email link to the inbox uses `SITE_BASE_URL` if present; otherwise a hardcoded fallback. Adjust `SITE_BASE_URL` in your environment or customize the code.
- For other channels (Slack/Webhook), swap the Nodemailer send for the desired integration in `src/index.ts`.
