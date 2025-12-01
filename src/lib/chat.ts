import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  increment,
} from 'firebase/firestore';

export type ChatDoc = {
  userId: string;
  status: 'open' | 'closed' | 'pending';
  firstNotified?: boolean;
  lastMessageAt?: any;
  lastMessagePreview?: string;
  unreadForAdmin?: number;
  unreadForUser?: number;
  createdAt?: any;
  lastReadAtAdmin?: any;
  lastReadAtUser?: any;
  // Identity fields (optional, provided by the user via ChatWidget)
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type ChatMessageDoc = {
  authorId: string;
  authorRole: 'user' | 'admin' | 'system';
  text: string;
  createdAt: any;
};

// For simplicity, use the user's uid as chatId (one chat por utilizador)
export async function ensureChatForUser(userId: string): Promise<string> {
  const chatId = userId;
  const ref = doc(db, 'chats', chatId);
  // Avoid getDoc first to prevent failures when client is considered offline.
  // Just ensure the document exists via a merge write; if it fails, we still return chatId
  // so that subscriptions can proceed and cache can populate when connectivity resumes.
  try {
    console.log('[chat] ensureChatForUser:setDoc', { chatId });
    const payload: ChatDoc = {
      userId,
      status: 'open',
      firstNotified: false,
      createdAt: serverTimestamp(),
      unreadForAdmin: 0,
      unreadForUser: 0,
    };
    await setDoc(ref, payload, { merge: true });
    console.log('[chat] ensureChatForUser:ok', { chatId });
  } catch (e) {
    // Ignore write failures (e.g., offline). Firestore listeners can still attach,
    // and the write will be retried by the SDK when back online if queued elsewhere.
    // console.warn('[ensureChatForUser] setDoc failed, proceeding', e);
    console.log('[chat] ensureChatForUser:write_failed_offline?', { chatId });
  }
  return chatId;
}

export async function addUserMessage(chatId: string, userId: string, text: string) {
  const col = collection(db, 'chats', chatId, 'messages');
  const msg: ChatMessageDoc = {
    authorId: userId,
    authorRole: 'user',
    text,
    createdAt: serverTimestamp(),
  };
  console.log('[chat] addUserMessage', { chatId, len: text.length });
  await addDoc(col, msg);
  // update chat meta
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessageAt: serverTimestamp(),
    lastMessagePreview: text.slice(0, 140),
    unreadForAdmin: increment(1),
    status: 'open',
  });
  console.log('[chat] addUserMessage:metaUpdated', { chatId });
}

export function subscribeMessages(chatId: string, cb: (messages: Array<{ id: string; text: string; authorRole: string; createdAt: Date | null }>) => void) {
  const col = collection(db, 'chats', chatId, 'messages');
  const q = query(col, orderBy('createdAt', 'asc'));
  console.log('[chat] subscribeMessages:start', { chatId });
  return onSnapshot(q, (snap) => {
    const out = snap.docs.map((d) => {
      const data = d.data() as any;
      const ts = data.createdAt;
      return {
        id: d.id,
        text: String(data.text || ''),
        authorRole: String(data.authorRole || ''),
        createdAt: ts && ts.toDate ? ts.toDate() : null,
      };
    });
    console.log('[chat] subscribeMessages:update', { chatId, count: out.length });
    cb(out);
  });
}

// Admin sends a message into a user's chat
export async function addAdminMessage(chatId: string, adminId: string, text: string) {
  const col = collection(db, 'chats', chatId, 'messages');
  const msg: ChatMessageDoc = {
    authorId: adminId,
    authorRole: 'admin',
    text,
    createdAt: serverTimestamp(),
  };
  await addDoc(col, msg);
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessageAt: serverTimestamp(),
    lastMessagePreview: text.slice(0, 140),
    unreadForUser: increment(1),
    status: 'open',
  });
}

// Mark that admin viewed the chat; reset unread counter
export async function markAdminOpened(chatId: string) {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    unreadForAdmin: 0,
    lastReadAtAdmin: serverTimestamp(),
  });
}

// Mark that user viewed the chat; reset unread counter for the user
export async function markUserOpened(chatId: string) {
  const chatRef = doc(db, 'chats', chatId);
  console.log('[chat] markUserOpened', { chatId });
  await updateDoc(chatRef, {
    unreadForUser: 0,
    lastReadAtUser: serverTimestamp(),
  });
}

// Subscribe to chats list for admin inbox view
export function subscribeChats(cb: (items: Array<{ id: string; data: ChatDoc }>) => void) {
  const colRef = collection(db, 'chats');
  const qy = query(colRef, orderBy('lastMessageAt', 'desc'));
  return onSnapshot(qy, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, data: d.data() as ChatDoc }));
    cb(rows);
  });
}

// Update identity fields on the chat document (name/email/phone)
export async function updateChatIdentity(chatId: string, partial: { name?: string | null; email?: string | null; phone?: string | null }) {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    ...('name' in partial ? { name: partial.name ?? null } : {}),
    ...('email' in partial ? { email: partial.email ?? null } : {}),
    ...('phone' in partial ? { phone: partial.phone ?? null } : {}),
  });
}

// Fetch a chat document once
export async function getChat(chatId: string): Promise<ChatDoc | null> {
  const chatRef = doc(db, 'chats', chatId);
  const snap = await getDoc(chatRef);
  if (!snap.exists()) return null;
  return snap.data() as ChatDoc;
}
