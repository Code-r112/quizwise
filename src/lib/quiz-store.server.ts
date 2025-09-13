// This is a server-only file
import { db } from '@/lib/firebase-admin'; // Using admin SDK for server-side operations

export const getAnalyticsAction = async (quizId: string): Promise<{ attemptCount: number; averageScore: number } | null> => {
    try {
        const querySnapshot = await db.collection("quizResults").where("quizId", "==", quizId).get();
        
        if (querySnapshot.empty) {
            return { attemptCount: 0, averageScore: 0 };
        }

        let totalScore = 0;
        querySnapshot.forEach((doc) => {
            totalScore += doc.data().score;
        });

        const attemptCount = querySnapshot.size;
        const averageScore = totalScore / attemptCount;

        return { attemptCount, averageScore };
    } catch (error) {
        console.error('Failed to get quiz analytics from Firestore:', error);
        return null;
    }
};
