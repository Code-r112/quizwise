import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-from-text.ts';
import '@/ai/flows/receive-ai-powered-feedback.ts';
import '@/ai/flows/generate-quiz-from-url.ts';