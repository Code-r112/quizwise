'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered feedback on quiz answers.
 *
 * The flow takes the user's answer, the correct answer, and the source material as input, and
 * returns a personalized explanation for why the user's answer was incorrect, referencing the
 * original source material.
 *
 * @interface AiPoweredFeedbackInput - The input type for the aiPoweredFeedback function.
 * @interface AiPoweredFeedbackOutput - The output type for the aiPoweredFeedback function.
 * @function aiPoweredFeedback - The main function that triggers the flow and returns the AI-powered feedback.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredFeedbackInputSchema = z.object({
  userAnswer: z
    .string()
    .describe('The answer provided by the user.'),
  correctAnswer: z
    .string()
    .describe('The correct answer to the question.'),
  sourceMaterial: z
    .string()
    .describe('The source material used to generate the quiz.'),
  question: z
    .string()
    .describe('The question that was asked.'),
});
export type AiPoweredFeedbackInput = z.infer<typeof AiPoweredFeedbackInputSchema>;

const AiPoweredFeedbackOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A personalized explanation of why the user answer was incorrect, referencing the source material.'),
});
export type AiPoweredFeedbackOutput = z.infer<typeof AiPoweredFeedbackOutputSchema>;

export async function aiPoweredFeedback(input: AiPoweredFeedbackInput): Promise<AiPoweredFeedbackOutput> {
  return aiPoweredFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredFeedbackPrompt',
  input: {
    schema: AiPoweredFeedbackInputSchema,
  },
  output: {
    schema: AiPoweredFeedbackOutputSchema,
  },
  prompt: `You are an AI assistant that provides personalized feedback on quiz answers.

You will receive the user's answer, the correct answer, the source material, and the question.

Your task is to provide a clear and concise explanation of why the user's answer was incorrect, referencing the specific section(s) of the source material that support the correct answer.

User Answer: {{{userAnswer}}}
Correct Answer: {{{correctAnswer}}}
Source Material: {{{sourceMaterial}}}
Question: {{{question}}}

Explanation:`,
});

const aiPoweredFeedbackFlow = ai.defineFlow(
  {
    name: 'aiPoweredFeedbackFlow',
    inputSchema: AiPoweredFeedbackInputSchema,
    outputSchema: AiPoweredFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
