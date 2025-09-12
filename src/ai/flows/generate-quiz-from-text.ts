'use server';
/**
 * @fileOverview AI flow to generate a quiz from text input.
 *
 * - generateQuizFromText - A function that generates a quiz from text.
 * - GenerateQuizFromTextInput - The input type for the generateQuizFromText function.
 * - GenerateQuizFromTextOutput - The return type for the generateQuizFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTextInputSchema = z.object({
  text: z.string().describe('The text to generate the quiz from.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .default('medium')
    .describe('The difficulty level of the quiz.'),
});
export type GenerateQuizFromTextInput = z.infer<
  typeof GenerateQuizFromTextInputSchema
>;

const GenerateQuizFromTextOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizFromTextOutput = z.infer<
  typeof GenerateQuizFromTextOutputSchema
>;

export async function generateQuizFromText(
  input: GenerateQuizFromTextInput
): Promise<GenerateQuizFromTextOutput> {
  return generateQuizFromTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTextPrompt',
  input: {schema: GenerateQuizFromTextInputSchema},
  output: {schema: GenerateQuizFromTextOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz based on the following text. The quiz should be in JSON format.

Difficulty: {{{difficulty}}}

Text: {{{text}}}

Ensure the quiz is engaging and relevant to the provided content. Include a variety of question types such as multiple-choice, true/false, fill-in-the-blank, and short-answer questions.

Output the quiz as a JSON object with a "questions" array. Each question should have the following fields:
- "type" (string): The type of question (e.g., "multiple-choice", "true/false", "fill-in-the-blank", "short-answer").
- "text" (string): The actual question text.
- "answers" (array): An array of possible answers. For multiple-choice questions, include one correct answer and several incorrect options. For true/false questions, include "true" and "false". For fill-in-the-blank questions, this field may be empty.
- "correctAnswer" (string): The correct answer to the question. For multiple-choice questions, this should be one of the values from the "answers" array. For true/false questions, this should be either "true" or "false". For fill-in-the-blank questions, this should be the word or phrase that fills the blank. For short-answer questions, this should be a model answer or a set of acceptable answers.
`, 
});

const generateQuizFromTextFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTextFlow',
    inputSchema: GenerateQuizFromTextInputSchema,
    outputSchema: GenerateQuizFromTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
