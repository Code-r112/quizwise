'use server';

import { z } from 'zod';
import { generateQuizFromTopic } from '@/ai/flows/generate-quiz-from-topic';
import { generateQuizFromText } from '@/ai/flows/generate-quiz-from-text';
import { generateQuizFromUrl } from '@/ai/flows/generate-quiz-from-url';
import { aiPoweredFeedback } from '@/ai/flows/receive-ai-powered-feedback';
import { getAnalyticsAction as getQuizAnalytics, getQuizSubmissionsAction } from '@/lib/quiz-store.server';
import type { QuizSubmission } from '@/lib/quiz-store.server';

const quizInputSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce.number().min(1).max(10),
});

export async function createQuizFromTopicAction(prevState: any, formData: FormData) {
  const validatedFields = quizInputSchema.safeParse({
    topic: formData.get('topic'),
    difficulty: formData.get('difficulty'),
    numberOfQuestions: formData.get('numberOfQuestions'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      quiz: null,
    };
  }
  
  const { topic, difficulty, numberOfQuestions } = validatedFields.data;

  try {
    const result = await generateQuizFromTopic({ topic, difficulty, numberOfQuestions });

    if (!result || !result.quiz) {
      throw new Error('AI failed to generate a quiz.');
    }
    
    const quizData = JSON.parse(result.quiz);
    
    return {
      message: 'Quiz generated successfully.',
      errors: null,
      quiz: { ...quizData, title: quizData.title || `Quiz on ${topic}` },
      sourceMaterial: `Quiz generated for topic: ${topic}`,
    };

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Failed to generate quiz: ${errorMessage}`,
      errors: null,
      quiz: null,
    };
  }
}

const textInputSchema = z.object({
  text: z.string().min(50, 'Text must be at least 50 characters long.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function createQuizFromTextAction(prevState: any, formData: FormData) {
    const validatedFields = textInputSchema.safeParse({
        text: formData.get('text'),
        difficulty: formData.get('difficulty'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            quiz: null,
        };
    }

    const { text, difficulty } = validatedFields.data;

    try {
        const result = await generateQuizFromText({ text, difficulty });
        if (!result || !result.quiz) {
            throw new Error('AI failed to generate a quiz.');
        }

        const quizData = JSON.parse(result.quiz);
        const title = quizData.title || `Quiz from your text`;

        return {
            message: 'Quiz generated successfully.',
            errors: null,
            quiz: { ...quizData, title },
            sourceMaterial: text,
        };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return {
            message: `Failed to generate quiz: ${errorMessage}`,
            errors: null,
            quiz: null,
        };
    }
}

const urlInputSchema = z.object({
  url: z.string().url('Please enter a valid URL.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function createQuizFromUrlAction(prevState: any, formData: FormData) {
    const validatedFields = urlInputSchema.safeParse({
        url: formData.get('url'),
        difficulty: formData.get('difficulty'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            quiz: null,
        };
    }

    const { url, difficulty } = validatedFields.data;

    try {
        const result = await generateQuizFromUrl({ url, difficulty });
        if (!result || !result.quiz) {
            throw new Error('AI failed to generate a quiz.');
        }
        
        const quizData = JSON.parse(result.quiz);
        const title = quizData.title || `Quiz from ${url}`;

        return {
            message: 'Quiz generated successfully.',
            errors: null,
            quiz: { ...quizData, title },
            sourceMaterial: `Content from URL: ${url}`,
        };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return {
            message: `Failed to generate quiz: ${errorMessage}`,
            errors: null,
            quiz: null,
        };
    }
}


const feedbackInputSchema = z.object({
    userAnswer: z.string(),
    correctAnswer: z.string(),
    sourceMaterial: z.string(),
    question: z.string(),
});

export async function getFeedbackAction(input: {
    userAnswer: string;
    correctAnswer: string;
    sourceMaterial: string;
    question: string;
}) {
    const validatedFields = feedbackInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return { error: 'Invalid input for feedback.' };
    }

    try {
        const feedback = await aiPoweredFeedback(validatedFields.data);
        return { explanation: feedback.explanation };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to get AI feedback.' };
    }
}

const analyticsInputSchema = z.object({
    quizId: z.string(),
});

export async function getAnalyticsAction(input: { quizId: string }) {
    const validatedFields = analyticsInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return { error: 'Invalid input for analytics.', analytics: null };
    }
    
    try {
        const analytics = await getQuizAnalytics(validatedFields.data.quizId);
        return { analytics, error: null };
    } catch (error) {
        console.error('Failed to get quiz analytics:', error);
        return { error: 'Failed to get quiz analytics.', analytics: null };
    }
}


export async function getSubmissionsAction(input: { quizId: string }): Promise<{ submissions: QuizSubmission[] | null, error: string | null }> {
    const validatedFields = analyticsInputSchema.safeParse(input);

    if (!validatedFields.success) {
        return { error: 'Invalid input for submissions.', submissions: null };
    }

    try {
        const submissions = await getQuizSubmissionsAction(validatedFields.data.quizId);
        return { submissions, error: null };
    } catch (error) {
        console.error('Failed to get quiz submissions:', error);
        return { error: 'Failed to get quiz submissions.', submissions: null };
    }
}
