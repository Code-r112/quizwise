'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getQuiz, saveQuizResults } from '@/lib/quiz-store';
import type { Quiz, UserAnswer, Question } from '@/lib/types';
import QuizQuestion from './quiz-question';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function QuizClient({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { user } = useAuth();
  
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizData = await getQuiz(quizId);
      if (quizData) {
        setQuiz(quizData);
        setUserAnswers(Array(quizData.questions.length).fill(null));
      } else {
        router.push('/'); // Or a 404 page
      }
    };
    fetchQuiz();
  }, [quizId, router]);

  const currentQuestion = useMemo(() => {
    return quiz?.questions[currentQuestionIndex];
  }, [quiz, currentQuestionIndex]);

  const progressValue = useMemo(() => {
    if (!quiz) return 0;
    return ((currentQuestionIndex) / quiz.questions.length) * 100;
  }, [quiz, currentQuestionIndex]);

  const handleNext = async () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
    
    setSelectedAnswer(null);

    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished, calculate results and save
      const finalAnswers: UserAnswer[] = quiz!.questions.map((question, index) => {
        const userAnswer = newAnswers[index];
        return {
          questionIndex: index,
          answer: userAnswer || "No answer",
          isCorrect: userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim(),
        };
      });
      const score = (finalAnswers.filter(a => a.isCorrect).length / quiz!.questions.length) * 100;
      await saveQuizResults(quizId, user?.uid || null, finalAnswers, score);
      router.push(`/quiz/${quizId}/results`);
    }
  };

  useEffect(() => {
      if (userAnswers.length > 0) {
        setSelectedAnswer(userAnswers[currentQuestionIndex]);
      }
  }, [currentQuestionIndex, userAnswers]);

  if (!quiz || !currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{quiz.title}</CardTitle>
          <div className="pt-4">
            <Progress value={progressValue} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <QuizQuestion
            question={currentQuestion}
            onAnswerSelect={setSelectedAnswer}
            isSubmitted={false} // Never show immediate feedback
            isCorrect={null}
            userAnswer={selectedAnswer}
          />
        </CardContent>
        <CardFooter className="gap-2">
            {currentQuestionIndex > 0 && (
                 <Button onClick={() => setCurrentQuestionIndex(prev => prev - 1)} variant="outline">
                    Previous
                 </Button>
            )}
             <Button onClick={handleNext} disabled={!selectedAnswer} className="w-full">
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
             </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
