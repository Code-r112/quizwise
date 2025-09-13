// This is a server-only file
import { db } from '@/lib/firebase-admin'; // Using admin SDK for server-side operations
import type { UserAnswer } from '@/lib/types';

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

export interface QuizSubmission {
    userId: string;
    userName: string;
    userImage: string;
    score: number;
    completedAt: string;
}

export const getQuizSubmissionsAction = async (quizId: string): Promise<QuizSubmission[] | null> => {
    try {
        const submissionsSnapshot = await db.collection("quizResults").where("quizId", "==", quizId).orderBy("createdAt", "desc").get();

        if (submissionsSnapshot.empty) {
            return [];
        }

        const userIds = submissionsSnapshot.docs.map(doc => doc.data().userId);
        
        const userPromises = userIds.map(userId => admin.auth().getUser(userId).catch(() => null));
        const userRecords = await Promise.all(userPromises);

        const usersMap = new Map<string, admin.auth.UserRecord>();
        userRecords.forEach(user => {
            if (user) {
                usersMap.set(user.uid, user);
            }
        });

        const submissions: QuizSubmission[] = submissionsSnapshot.docs.map((doc) => {
            const data = doc.data();
            const user = usersMap.get(data.userId);
            const submissionDate = data.createdAt.toDate();

            return {
                userId: data.userId,
                userName: user?.displayName || 'Anonymous',
                userImage: user?.photoURL || '',
                score: Math.round(data.score),
                completedAt: submissionDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            };
        });

        return submissions;

    } catch (error) {
        console.error('Failed to get quiz submissions from Firestore:', error);
        return null;
    }
}
