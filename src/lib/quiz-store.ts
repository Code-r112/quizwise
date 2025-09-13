'use client';

import type { Quiz, UserAnswer } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, getDoc, getDocs, query, where, updateDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

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

export const deleteQuiz = async (quizId: string, userId: string): Promise<void> => {
    try {
        // First, delete the quiz document itself
        await deleteDoc(doc(db, 'quizzes', quizId));

        // Then, delete the specific user's result for that quiz.
        const resultId = `${quizId}_${userId}`;
        const resultDocRef = doc(db, 'quizResults', resultId);
        await deleteDoc(resultDocRef);

    } catch (error) {
        console.error('Failed to delete quiz and its results from Firestore', error);
    }
}


export const saveQuizResults = async (quizId: string, userId: string, answers: UserAnswer[], score: number) => {
    try {
        const resultId = `${quizId}_${userId}`;
        const resultsRef = doc(db, "quizResults", resultId);
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
    if (!userId) return null;
    try {
        const resultId = `${quizId}_${userId}`;
        const resultsRef = doc(db, "quizResults", resultId);
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
