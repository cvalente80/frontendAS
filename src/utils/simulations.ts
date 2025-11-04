import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export type SimulationType = 'auto' | 'vida' | 'saude' | 'habitacao' | 'rc_prof' | 'condominio' | string;

export type SimulationRecord = {
  type: SimulationType;
  title?: string;
  summary?: string;
  status?: string; // 'submitted' | 'quoted' | 'archived' | ...
  payload?: any;   // raw form data or selected fields
  createdAt?: any; // serverTimestamp will set this
};

export async function saveSimulation(uid: string, data: SimulationRecord) {
  const col = collection(db, 'users', uid, 'simulations');
  const toSave = {
    ...data,
    status: data.status ?? 'submitted',
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(col, toSave);
  return ref.id;
}
