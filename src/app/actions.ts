'use server';

import { z } from 'zod';
import { generateQuizFromText } from '@/ai/flows/generate-quiz-from-text';
import { generateQuizFromUrl } from '@/ai/flows/generate-quiz-from-url';
import { aiPoweredFeedback } from '@/ai/flows/receive-ai-powered-feedback';

const quizInputSchema = z.object({
  sourceType: z.enum(['text', 'url']),
  source: z.string().min(1, 'Source cannot be empty.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function createQuizAction(prevState: any, formData: FormData) {
  const validatedFields = quizInputSchema.safeParse({
    sourceType: formData.get('sourceType'),
    source: formData.get('source'),
    difficulty: formData.get('difficulty'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      quiz: null,
    };
  }
  
  const { sourceType, source, difficulty } = validatedFields.data;

  try {
    let result;
    if (sourceType === 'text') {
      result = await generateQuizFromText({ text: source, difficulty });
    } else {
      result = await generateQuizFromUrl({ url: source, difficulty });
    }

    if (!result || !result.quiz) {
      throw new Error('AI failed to generate a quiz.');
    }
    
    // The AI returns a JSON string, so we parse it.
    const quizData = JSON.parse(result.quiz);
    
    return {
      message: 'Quiz generated successfully.',
      errors: null,
      quiz: quizData,
      sourceMaterial: source,
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
