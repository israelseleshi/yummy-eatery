import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { User } from './auth';

export interface UserStats {
  total: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId: string, status: 'active' | 'inactive') => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map(doc => doc.data());

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      newUsersThisMonth: users.filter(user => {
        const createdAt = user.createdAt?.toDate();
        return createdAt && createdAt >= firstDayOfMonth;
      }).length
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};