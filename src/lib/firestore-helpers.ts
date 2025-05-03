import { 
  doc, 
  setDoc, 
  deleteDoc,
  serverTimestamp,
  writeBatch,
  collection,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Maximum retry attempts for operations
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper to wait between retries
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic write operation with retry logic
export async function writeWithRetry<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  retries = MAX_RETRIES
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error: any) {
    if (retries > 0 && (error.code === 'unavailable' || error.code === 'resource-exhausted')) {
      await wait(RETRY_DELAY);
      return writeWithRetry(collectionName, docId, data, retries - 1);
    }
    throw error;
  }
}

// Batch write operation with retry logic
export async function batchWriteWithRetry(
  operations: Array<{
    type: 'set' | 'delete';
    collection: string;
    doc: string;
    data?: DocumentData;
  }>,
  retries = MAX_RETRIES
): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    operations.forEach(op => {
      const docRef = doc(db, op.collection, op.doc);
      if (op.type === 'set' && op.data) {
        batch.set(docRef, {
          ...op.data,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else if (op.type === 'delete') {
        batch.delete(docRef);
      }
    });

    await batch.commit();
  } catch (error: any) {
    if (retries > 0 && (error.code === 'unavailable' || error.code === 'resource-exhausted')) {
      await wait(RETRY_DELAY);
      return batchWriteWithRetry(operations, retries - 1);
    }
    throw error;
  }
}

// Delete operation with retry logic
export async function deleteWithRetry(
  collectionName: string,
  docId: string,
  retries = MAX_RETRIES
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error: any) {
    if (retries > 0 && (error.code === 'unavailable' || error.code === 'resource-exhausted')) {
      await wait(RETRY_DELAY);
      return deleteWithRetry(collectionName, docId, retries - 1);
    }
    throw error;
  }
}

// Collection reference helper
export function getCollectionRef(collectionName: string) {
  return collection(db, collectionName);
}