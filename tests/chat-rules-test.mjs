// Firestore security rules test harness for chat functionality
// Run with: npm run test:rules
import { readFileSync } from 'fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { join } from 'path';

const rulesPath = join(process.cwd(), 'firestore.rules');
const rules = readFileSync(rulesPath, 'utf8');

async function main() {
  let firestoreConfig = { rules };
  // Support firebase emulators:exec which sets FIRESTORE_EMULATOR_HOST
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    const [host, portStr] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
    const port = parseInt(portStr, 10);
    firestoreConfig = { ...firestoreConfig, host, port };
  } else {
    // Fallback defaults assuming local emulator on 8080 when run directly after manual start
    firestoreConfig = { ...firestoreConfig, host: '127.0.0.1', port: 8080 };
  }
  const env = await initializeTestEnvironment({
    projectId: 'ansiaoseguros-test',
    firestore: firestoreConfig,
  });

  const cleanup = async () => { await env.cleanup(); };
  try {
    const userId = 'user1';
    const adminId = 'admin1';
    const userCtx = env.authenticatedContext(userId, {});
    const adminCtx = env.authenticatedContext(adminId, {});
    const anonCtx = env.unauthenticatedContext();

    const userDb = userCtx.firestore();
    const adminDb = adminCtx.firestore();
    const anonDb = anonCtx.firestore();

    const results = [];

    // 0. Admin provisioning doc required
    results.push(['adminProvision', await assertSucceeds(adminDb.collection('admins').doc(adminId).set({ createdAt: Date.now() }))]);

    // 1. Anonymous cannot read chat
    await assertFails(anonDb.collection('chats').doc(userId).get()).catch(e => results.push(['anonReadChat', e.code]));

    // 2. User creates own chat doc (must include correct userId)
    results.push(['createOwnChat', await assertSucceeds(userDb.collection('chats').doc(userId).set({ userId, status: 'open' }))]);

    // 3. User cannot create chat with different id
    await assertFails(userDb.collection('chats').doc('other').set({ userId })).catch(e => results.push(['createOtherChat', e.code]));

    // 4. User can create message in own chat
    results.push(['userCreateMessage', await assertSucceeds(userDb.collection('chats').doc(userId).collection('messages').add({
      authorId: userId,
      authorRole: 'user',
      text: 'Olá mundo',
      createdAt: new Date(),
    }))]);

    // 5. User cannot create message with mismatched authorId
    await assertFails(userDb.collection('chats').doc(userId).collection('messages').add({
      authorId: 'other', authorRole: 'user', text: 'teste', createdAt: new Date()
    })).catch(e => results.push(['userMismatchedAuthor', e.code]));

    // 6. Admin can create admin message in user chat
    results.push(['adminCreateMessage', await assertSucceeds(adminDb.collection('chats').doc(userId).collection('messages').add({
      authorId: adminId,
      authorRole: 'admin',
      text: 'Resposta admin',
      createdAt: new Date(),
    }))]);

    // 7. User message too long (>5000 chars) fails
    const longText = 'x'.repeat(5001);
    await assertFails(userDb.collection('chats').doc(userId).collection('messages').add({
      authorId: userId, authorRole: 'user', text: longText, createdAt: new Date()
    })).catch(e => results.push(['userLongMessage', e.code]));

    // 8. Missing userId in chat doc triggers failure then after repair success
    const brokenChatId = 'user2';
    const user2Ctx = env.authenticatedContext(brokenChatId, {});
    const user2Db = user2Ctx.firestore();
    // Create broken chat (no userId) as admin (allowed)
    await assertSucceeds(adminDb.collection('chats').doc(brokenChatId).set({ status: 'open' }));
    await assertFails(user2Db.collection('chats').doc(brokenChatId).collection('messages').add({
      authorId: brokenChatId, authorRole: 'user', text: 'Primeira', createdAt: new Date()
    })).catch(e => results.push(['userBrokenChatMessage', e.code]));
    // Repair
    await assertSucceeds(user2Db.collection('chats').doc(brokenChatId).set({ userId: brokenChatId }, { merge: true }));
    results.push(['userBrokenChatMessageAfterRepair', await assertSucceeds(user2Db.collection('chats').doc(brokenChatId).collection('messages').add({
      authorId: brokenChatId, authorRole: 'user', text: 'Depois repair', createdAt: new Date()
    }))]);

    // 9. Admin reading user chat
    results.push(['adminReadChat', await assertSucceeds(adminDb.collection('chats').doc(userId).get())]);

    // Output summary
    console.log('\nChat Rules Test Summary');
    for (const [key, value] of results) {
      console.log(key, '=>', (value && value.constructor && value.constructor.name) ? 'OK' : value);
    }
  } catch (e) {
    console.error('Test harness failure', e);
    process.exitCode = 1;
  } finally {
    await cleanup();
  }
}

main();
