# Admin Setup (Chats)

To allow an admin user to see all users' chats and messages, you must grant them admin rights in Firestore. The security rules require admins to be explicitly marked.

Two supported ways (choose one):

1) Create a document in `admins/{uid}`
- Get the admin user's UID from Firebase Authentication.
- In Firestore, create a document at `admins/<uid>` with any (or empty) content.
- This is the preferred method.

2) Set `users/{uid}.isAdmin = true`
- In Firestore, find or create the document `users/<uid>` and set the boolean field `isAdmin` to `true`.

Notes
- The first admin must be provisioned via Firebase Console (rules only allow admins to write to `/admins`).
- After granting admin, reload the app. The Inbox at `/pt/admin/inbox` should populate, and threads will show messages.
- If you see `permission-denied` banners in the admin UI, the account is still not recognized as admin.
