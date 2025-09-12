'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getQuizResults, getQuiz } from '@/lib/quiz-store';
import type { Quiz, UserAnswer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle, FileText, Share2, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function QuizResultsClient({ quizId }: { quizId: string }) {
  const [results, setResults] = useState<{ answers: UserAnswer[], score: number } | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const resultsData = getQuizResults(quizId);
    const quizData = getQuiz(quizId);
    if (resultsData && quizData) {
      setResults(resultsData);
      setQuiz(quizData);
    } else {
      // Handle case where results or quiz aren't found, maybe redirect
      router.push('/');
    }
  }, [quizId, router]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'Quiz results link has been copied to your clipboard.',
      });
    });
  };

  if (!results || !quiz) {
    return null; // Or a loading spinner
  }

  const scoreColor = results.score >= 80 ? 'text-green-500' : results.score >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>Here's how you did on "{quiz.title}"</CardDescription>
          <p className={`text-6xl font-bold pt-4 ${scoreColor}`}>{Math.round(results.score)}%</p>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg mb-4 text-center">Your Answers</h3>
          <ScrollArea className="h-60 w-full rounded-md border p-4">
            <ul className="space-y-4">
              {results.answers.map((userAnswer, index) => {
                const question = quiz.questions[userAnswer.questionIndex];
                return (
                  <li key={index} className="flex items-start space-x-3">
                    <div>
                      {userAnswer.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{question.text}</p>
                      <p className={cn("text-sm", userAnswer.isCorrect ? "text-muted-foreground" : "text-red-600")}>
                        Your answer: {userAnswer.answer}
                      </p>
                      {!userAnswer.isCorrect && (
                         <p className="text-sm text-green-600">Correct answer: {question.correctAnswer}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => router.push('/create')} className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" /> Create New Quiz
            </Button>
            <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" /> Share Results
            </Button>
             <Button onClick={() => router.push('/')} variant="ghost" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
