'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getQuizResults, getQuiz } from '@/lib/quiz-store';
import type { Quiz, UserAnswer, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle, FileText, Share2, Home, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getFeedbackAction } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function Feedback({ question, userAnswer, sourceMaterial }: { question: Question, userAnswer: string, sourceMaterial: string }) {
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const loadFeedback = useCallback(async () => {
        if (isLoaded) return;
        setIsLoading(true);
        const res = await getFeedbackAction({
            question: question.text,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            sourceMaterial: sourceMaterial
        });
        if (res.explanation) {
            setFeedback(res.explanation);
        } else {
            setFeedback('Could not load feedback.');
        }
        setIsLoading(false);
        setIsLoaded(true);
    }, [question, userAnswer, sourceMaterial, isLoaded]);

    return (
        <Accordion type="single" collapsible className="w-full mt-2">
            <AccordionItem value="item-1">
                <AccordionTrigger onClick={loadFeedback} className="text-sm text-accent-foreground hover:no-underline">
                     <div className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4 text-accent" />
                        Show AI-Powered Explanation
                     </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground p-2 rounded-md bg-accent/10 border border-accent/20">
                    {isLoading ? <div className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</div> : <p>{feedback}</p>}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}


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
      router.push('/');
    }
  }, [quizId, router]);

  const handleShare = () => {
    const url = window.location.href.replace('/results', '');
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'Quiz link has been copied to your clipboard.',
      });
    });
  };

  if (!results || !quiz) {
    return (
       <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const scoreColor = results.score >= 80 ? 'text-green-500' : results.score >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>Here's how you did on "{quiz.title}"</CardDescription>
          <p className={`text-6xl font-bold pt-4 ${scoreColor}`}>{Math.round(results.score)}%</p>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg mb-4 text-center">Your Answers</h3>
          <ScrollArea className="h-[400px] w-full">
            <ul className="space-y-6 p-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = results.answers.find(a => a.questionIndex === index);
                const answerText = userAnswer?.answer || "No answer";
                const isCorrect = userAnswer?.isCorrect || false;

                return (
                  <li key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <div>
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500 mt-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{question.text}</p>
                      <p className={cn("text-sm", isCorrect ? "text-muted-foreground" : "text-red-600 font-semibold")}>
                        Your answer: {answerText}
                      </p>
                      {!isCorrect && (
                         <p className="text-sm text-green-600 font-semibold">Correct answer: {question.correctAnswer}</p>
                      )}
                      <Feedback 
                          question={question} 
                          userAnswer={answerText} 
                          sourceMaterial={quiz.sourceMaterial}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => router.push('/dashboard')} className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" /> Create New Quiz
            </Button>
            <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" /> Share Quiz
            </Button>
             <Button onClick={() => router.push('/')} variant="ghost" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
