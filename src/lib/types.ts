export type QuestionType =
  | 'multiple-choice'
  | 'true/false'
  | 'fill-in-the-blank'
  | 'short-answer';

export interface Question {
  type: QuestionType;
  text: string;
  answers: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  sourceMaterial: string;
  questions: Question[];
}

export interface UserAnswer {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
}
