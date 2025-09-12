'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getQuiz, saveQuizResults } from '@/lib/quiz-store';
import type { Quiz, UserAnswer } from '@/lib/types';
import QuizQuestion from './quiz-question';
import QuizFeedbackDialog from './quiz-feedback-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-radix';
import { getFeedbackAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function QuizClient({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const quizData = getQuiz(quizId);
    if (quizData) {
      setQuiz(quizData);
    } else {
      router.push('/'); // Or a 404 page
    }
  }, [quizId, router]);

  const currentQuestion = useMemo(() => {
    return quiz?.questions[currentQuestionIndex];
  }, [quiz, currentQuestionIndex]);

  const progressValue = useMemo(() => {
    if (!quiz) return 0;
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  }, [quiz, currentQuestionIndex]);

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const correct = selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      answer: selectedAnswer,
      isCorrect: correct,
    };
    setUserAnswers(prev => [...prev, newAnswer]);

    if (!correct) {
        setIsFeedbackLoading(true);
        setShowFeedbackDialog(true);
        const feedbackResult = await getFeedbackAction({
            userAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            sourceMaterial: quiz?.sourceMaterial || '',
            question: currentQuestion.text,
        });
        setIsFeedbackLoading(false);
        if (feedbackResult.explanation) {
            setFeedback(feedbackResult.explanation);
        } else {
            setFeedback("Could not load feedback at this time.");
        }
    }
  };
  
  const handleNext = () => {
    setIsAnswerSubmitted(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFeedback(null);
    setShowFeedbackDialog(false);

    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished
      const score = (userAnswers.filter(a => a.isCorrect).length / quiz!.questions.length) * 100;
      saveQuizResults(quizId, userAnswers, score);
      router.push(`/quiz/${quizId}/results`);
    }
  };

  if (!quiz || !currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            isSubmitted={isAnswerSubmitted}
            isCorrect={isCorrect}
            userAnswer={selectedAnswer}
          />
           {isAnswerSubmitted && (
            <Alert variant={isCorrect ? 'default' : 'destructive'} className="mt-6 animate-in fade-in">
              {isCorrect ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
              <AlertDescription>
                {isCorrect ? 'Great job!' : `The correct answer is: ${currentQuestion.correctAnswer}`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {isAnswerSubmitted ? (
             <Button onClick={handleNext} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
             </Button>
          ) : (
            <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full">
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {!isCorrect && <QuizFeedbackDialog 
        isOpen={showFeedbackDialog}
        isLoading={isFeedbackLoading}
        feedback={feedback}
        onOpenChange={setShowFeedbackDialog}
      />}
    </div>
  );
}
