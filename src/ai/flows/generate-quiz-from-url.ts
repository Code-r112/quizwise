'use server';
/**
 * @fileOverview AI flow to generate a quiz from a given URL.
 *
 * - generateQuizFromUrl - The main function to generate the quiz.
 * - GenerateQuizFromUrlInput - The input type for the generateQuizFromUrl function.
 * - GenerateQuizFromUrlOutput - The output type for the generateQuizFromUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { JSDOM } from 'jsdom';

const GenerateQuizFromUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to generate the quiz from.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium').describe('The desired difficulty level of the quiz.'),
});
export type GenerateQuizFromUrlInput = z.infer<typeof GenerateQuizFromUrlInputSchema>;

const GenerateQuizFromUrlOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in a suitable format (e.g., JSON string).'),
});
export type GenerateQuizFromUrlOutput = z.infer<typeof GenerateQuizFromUrlOutputSchema>;

export async function generateQuizFromUrl(input: GenerateQuizFromUrlInput): Promise<GenerateQuizFromUrlOutput> {
  return generateQuizFromUrlFlow(input);
}

async function extractTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const textContent = document.body ? document.body.textContent || '' : '';
    return textContent;
  } catch (error: any) {
    console.error('Error fetching or parsing URL:', error);
    throw new Error(`Failed to extract text from URL: ${error.message}`);
  }
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromUrlPrompt',
  input: {schema: GenerateQuizFromUrlInputSchema},
  output: {schema: GenerateQuizFromUrlOutputSchema},
  prompt: `You are an expert quiz generator. Given the content of a webpage, generate a quiz with a mix of multiple-choice, true/false, fill-in-the-blank, and short-answer questions.

  The difficulty of the quiz should be {{{difficulty}}}.

  The quiz should be returned as a JSON string.

  Webpage content: {{{webpageContent}}}
  `,
});

const generateQuizFromUrlFlow = ai.defineFlow(
  {
    name: 'generateQuizFromUrlFlow',
    inputSchema: GenerateQuizFromUrlInputSchema,
    outputSchema: GenerateQuizFromUrlOutputSchema,
  },
  async input => {
    try {
      const webpageContent = await extractTextFromUrl(input.url);
      const {output} = await prompt({...input, webpageContent});
      return output!;
    } catch (error: any) {
      console.error('Error in generateQuizFromUrlFlow:', error);
      throw new Error(`Failed to generate quiz from URL: ${error.message}`);
    }
  }
);
