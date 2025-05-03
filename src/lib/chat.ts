import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  or,
  and,
  serverTimestamp,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: Timestamp;
}

export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
  try {
    const messagesRef = collection(db, 'chat-messages');
    const messageData = {
      ...message,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(messagesRef, messageData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToChatMessages = (
  userId: string,
  otherUserId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const messagesRef = collection(db, 'chat-messages');
  const q = query(
    messagesRef,
    or(
      and(
        where('senderId', '==', userId),
        where('receiverId', '==', otherUserId)
      ),
      and(
        where('senderId', '==', otherUserId),
        where('receiverId', '==', userId)
      )
    ),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    callback(messages);
  });
};