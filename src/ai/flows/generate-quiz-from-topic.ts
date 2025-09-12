'use server';
/**
 * @fileOverview AI flow to generate a quiz from a topic.
 *
 * - generateQuizFromTopic - A function that generates a quiz from a topic.
 * - GenerateQuizFromTopicInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizFromTopicOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic to generate the quiz from.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .default('medium')
    .describe('The difficulty level of the quiz.'),
  numberOfQuestions: z
    .number()
    .min(1)
    .max(10)
    .default(5)
    .describe('The number of questions to generate.'),
});
export type GenerateQuizFromTopicInput = z.infer<
  typeof GenerateQuizFromTopicInputSchema
>;

const GenerateQuizFromTopicOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizFromTopicOutput = z.infer<
  typeof GenerateQuizFromTopicOutputSchema
>;

export async function generateQuizFromTopic(
  input: GenerateQuizFromTopicInput
): Promise<GenerateQuizFromTopicOutput> {
  return generateQuizFromTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTopicPrompt',
  input: {schema: GenerateQuizFromTopicInputSchema},
  output: {schema: GenerateQuizFromTopicOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz based on the following topic. The quiz should be in JSON format.

Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Number of Questions: {{{numberOfQuestions}}}

Ensure the quiz is engaging and relevant to the provided topic. Include a variety of question types such as multiple-choice, true/false, and short-answer questions.

Output the quiz as a JSON object with a "questions" array of exactly {{{numberOfQuestions}}} questions. Each question should have the following fields:
- "type" (string): The type of question (e.g., "multiple-choice", "true/false", "short-answer").
- "text" (string): The actual question text.
- "answers" (array): An array of possible answers. For multiple-choice questions, include one correct answer and several incorrect options. For true/false questions, include "True" and "False". For short-answer questions, this field should be empty or contain a model answer.
- "correctAnswer" (string): The correct answer to the question.
`, 
});

const generateQuizFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizFromTopicInputSchema,
    outputSchema: GenerateQuizFromTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
