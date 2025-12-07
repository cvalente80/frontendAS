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

## Configuration (SMTP + Admin recipient)

This function uses Nodemailer to send email. Configure SMTP and the destination email via Firebase Functions config (recommended) or environment variables when emulating.

Set config (recommended):

```bash
# Replace with your SMTP provider values
firebase functions:config:set \
  mail.host="smtp.yourhost.com" \
  mail.port="587" \
  mail.secure="false" \
  mail.user="smtp_user" \
  mail.pass="smtp_password" \
  mail.from="Ansião Seguros <no-reply@ansiao.pt>"

# Admin email that will receive alerts
firebase functions:config:set admin.to="admin@ansiao.pt"

# Optional: Base URL used in email link to the inbox
# The code reads process.env.SITE_BASE_URL; for local emulation you can export it before running.
# For production you can change the fallback inside the code or set this env var in your CI.
```

Check stored config:

```bash
firebase functions:config:get
```

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
