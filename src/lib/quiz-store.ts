'use client';

import type { Quiz, UserAnswer } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, getDoc, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';

export const saveQuiz = async (quizData: Omit<Quiz, 'id' | 'userId'>, userId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      userId: userId,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to save quiz to Firestore', error);
    return '';
  }
};

export const getQuiz = async (id: string): Promise<Quiz | null> => {
  try {
    const docRef = doc(db, 'quizzes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Quiz;
    }
    return null;
  } catch (error) {
    console.error('Failed to get quiz from Firestore', error);
    return null;
  }
};

export const getAllQuizzes = async (userId: string): Promise<Quiz[]> => {
    try {
        const q = query(collection(db, "quizzes"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const quizzes: Quiz[] = [];
        querySnapshot.forEach((doc) => {
            quizzes.push({ id: doc.id, ...doc.data() } as Quiz);
        });
        return quizzes;
    } catch (error) {
        console.error('Failed to get all quizzes from Firestore', error);
        return [];
    }
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
    try {
        await doc(db, 'quizzes', quizId).delete();
        // You might want to delete associated results as well.
        // This is more complex and would require querying the results subcollection.
    } catch (error) {
        console.error('Failed to delete quiz from Firestore', error);
    }
}


export const saveQuizResults = async (quizId: string, userId: string | null, answers: UserAnswer[], score: number) => {
    try {
        const resultId = userId || crypto.randomUUID();
        const resultsRef = doc(db, "quizResults", `${quizId}_${resultId}`);
        await setDoc(resultsRef, {
            quizId,
            userId,
            answers,
            score,
            createdAt: new Date(),
        });

    } catch (error) {
        console.error('Failed to save quiz results to Firestore', error);
    }
};

export const getQuizResults = async (quizId: string, userId: string | null): Promise<{ answers: UserAnswer[], score: number } | null> => {
    if (!userId) return null; // Or handle anonymous results differently
    try {
        const resultsRef = doc(db, "quizResults", `${quizId}_${userId}`);
        const docSnap = await getDoc(resultsRef);

        if (docSnap.exists()) {
            return docSnap.data() as { answers: UserAnswer[], score: number };
        }
        return null;
    } catch (error) {
        console.error('Failed to get quiz results from Firestore', error);
        return null;
    }
};
