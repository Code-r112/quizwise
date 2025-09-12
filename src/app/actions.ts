'use server';

import { z } from 'zod';
import { generateQuizFromTopic } from '@/ai/flows/generate-quiz-from-topic';
import { aiPoweredFeedback } from '@/ai/flows/receive-ai-powered-feedback';

const quizInputSchema = z.object({
  topic: z.string().min(1, 'Topic cannot be empty.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce.number().min(1).max(10),
});

export async function createQuizAction(prevState: any, formData: FormData) {
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
    
    // The AI returns a JSON string, so we parse it.
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
