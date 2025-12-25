import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, serverTimestamp, collectionGroup } from 'firebase/firestore';
import { db } from '../firebase';
import type { SimulationType } from './simulations';

export type PaymentFrequency = 'anual' | 'semestral' | 'trimestral' | 'mensal';

export type PolicyRecord = {
  id?: string;
  simulationId: string;
  type?: SimulationType | string;
  status?: 'em_criacao' | 'em_validacao' | 'em_vigor' | string;
  holderName?: string;
  nif?: string;
  citizenCardNumber?: string;
  // Legacy combined address (kept for backward compatibility)
  address?: string;
  // New split address fields
  addressStreet?: string; // Rua e nº
  addressPostalCode?: string; // Código Postal (NNNN-NNN)
  addressLocality?: string; // Localidade
  phone?: string;
  email?: string;
  paymentMethod?: 'multibanco' | 'debito_direto' | string;
  paymentFrequency?: PaymentFrequency;
  nib?: string; // Format: PT50 + 21 digits
  // Document URLs
  policyPdfUrl?: string; // Apólice
  receiptPdfUrl?: string; // Recibo
  conditionsPdfUrl?: string; // Condições particulares
  greenCardPdfUrl?: string; // Carta Verde (auto)
  createdAt?: any;
  updatedAt?: any;
};

/** Create or load a policy bound to a simulation. Uses simulationId as policyId for idempotency. */
export async function createOrGetPolicyForSimulation(uid: string, simulationId: string, type?: SimulationType | string): Promise<{ id: string; data: PolicyRecord }> {
  const colRef = collection(db, 'users', uid, 'policies');
  const policyId = simulationId; // keep 1:1 mapping
  const ref = doc(colRef, policyId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data() as PolicyRecord;
    return { id: policyId, data: { ...data, id: policyId } };
  }
  const now = serverTimestamp();
  const initial: PolicyRecord = {
    simulationId,
    type,
    status: 'em_criacao',
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, initial);
  return { id: policyId, data: { ...initial, id: policyId } };
}

/** Persist policy fields. Merges into existing document. */
export async function savePolicy(uid: string, policyId: string, data: Partial<PolicyRecord>): Promise<void> {
  const ref = doc(db, 'users', uid, 'policies', policyId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** List all policies for a user. */
export async function listPolicies(uid: string): Promise<PolicyRecord[]> {
  const colRef = collection(db, 'users', uid, 'policies');
  const q = query(colRef);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as PolicyRecord) }));
}

/** Admin: list all policies across all users (requires rules allowing collectionGroup). */
export async function listAllPolicies(): Promise<Array<PolicyRecord & { ownerUid: string }>> {
  const cg = collectionGroup(db, 'policies');
  const snap = await getDocs(cg);
  return snap.docs.map((d) => {
    const ownerUid = d.ref.parent.parent?.id || '';
    const data = d.data() as PolicyRecord;
    return { id: d.id, ...data, ownerUid };
  });
}
