'use client';

import type { Quiz, UserAnswer } from '@/lib/types';

export const saveQuiz = (quizData: Omit<Quiz, 'id'>): string => {
  if (typeof window === 'undefined') return '';
  const id = crypto.randomUUID();
  const quiz: Quiz = { ...quizData, id };
  try {
    localStorage.setItem(`quiz-${id}`, JSON.stringify(quiz));
    const quizIds = JSON.parse(localStorage.getItem('quizIds') || '[]');
    quizIds.push(id);
    localStorage.setItem('quizIds', JSON.stringify(quizIds));
    return id;
  } catch (error) {
    console.error('Failed to save quiz to localStorage', error);
    return '';
  }
};

export const getQuiz = (id: string): Quiz | null => {
  if (typeof window === 'undefined') return null;
  try {
    const quizData = localStorage.getItem(`quiz-${id}`);
    return quizData ? (JSON.parse(quizData) as Quiz) : null;
  } catch (error) {
    console.error('Failed to get quiz from localStorage', error);
    return null;
  }
};

export const getAllQuizzes = (): Quiz[] => {
    if (typeof window === 'undefined') return [];
    try {
        const quizIds = JSON.parse(localStorage.getItem('quizIds') || '[]');
        const quizzes = quizIds.map((id: string) => getQuiz(id)).filter(Boolean);
        return quizzes as Quiz[];
    } catch (error) {
        console.error('Failed to get all quizzes from localStorage', error);
        return [];
    }
};

export const saveQuizResults = (quizId: string, answers: UserAnswer[], score: number) => {
    if (typeof window === 'undefined') return;
    try {
        const results = { answers, score };
        localStorage.setItem(`results-${quizId}`, JSON.stringify(results));
    } catch (error) {
        console.error('Failed to save quiz results to localStorage', error);
    }
};

export const getQuizResults = (quizId: string): { answers: UserAnswer[], score: number } | null => {
    if (typeof window === 'undefined') return null;
    try {
        const resultsData = localStorage.getItem(`results-${quizId}`);
        return resultsData ? JSON.parse(resultsData) : null;
    } catch (error) {
        console.error('Failed to get quiz results from localStorage', error);
        return null;
    }
};
