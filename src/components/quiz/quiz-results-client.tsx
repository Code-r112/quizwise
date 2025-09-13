'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getQuizResults, getQuiz } from '@/lib/quiz-store';
import type { Quiz, UserAnswer, Question } from '@/lib/types';
import type { QuizSubmission } from '@/lib/quiz-store.server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle, Users, Target, Share2, Home, Sparkles, Loader2, RefreshCw, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getFeedbackAction, getAnalyticsAction, getSubmissionsAction } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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
  const [analytics, setAnalytics] = useState<{ attemptCount: number, averageScore: number } | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[] | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();


  useEffect(() => {
    if(authLoading) return;

    const fetchQuizAndResults = async () => {
        const quizData = await getQuiz(quizId);
        if (quizData) {
            setQuiz(quizData);
            
            getAnalyticsAction({ quizId }).then(analyticsResult => {
              if (analyticsResult.analytics) {
                setAnalytics(analyticsResult.analytics);
              } else if (analyticsResult.error) {
                console.error("Failed to get quiz analytics:", analyticsResult.error);
              }
            });

            getSubmissionsAction({ quizId }).then(submissionsResult => {
                if(submissionsResult.submissions) {
                    setSubmissions(submissionsResult.submissions);
                } else if (submissionsResult.error) {
                    console.error("Failed to get quiz submissions:", submissionsResult.error);
                }
            });


            // We need a user to fetch their specific results
            if(user) {
                const resultsData = await getQuizResults(quizId, user.uid);
                 if (resultsData) {
                    setResults(resultsData);
                } else {
                    // No results for this user, push to take the quiz
                    router.push(`/quiz/${quizId}`);
                }
            } else {
                // If user is not logged in, they can't have results yet.
                 router.push(`/quiz/${quizId}`);
            }
           
        } else {
            router.push('/');
        }
    };

    fetchQuizAndResults();
  }, [quizId, router, user, authLoading]);

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
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>Here's how you did on "{quiz.title}"</CardDescription>
          <p className={`text-6xl font-bold pt-4 ${scoreColor}`}>{Math.round(results.score)}%</p>
        </CardHeader>
        <CardContent>
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-center">
                    <Card className="p-4">
                        <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-2xl font-bold">{analytics.attemptCount}</p>
                        <p className="text-sm text-muted-foreground">Total Attempts</p>
                    </Card>
                     <Card className="p-4">
                        <Target className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-2xl font-bold">{Math.round(analytics.averageScore)}%</p>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                    </Card>
                </div>
            )}
          
            {quiz.userId === user?.uid && submissions && submissions.length > 0 && (
                <div className="mt-12">
                    <h3 className="font-semibold text-lg mb-4 text-center">Recent Submissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {submissions.map(submission => {
                            const submissionScoreColor = submission.score >= 80 ? 'text-green-500' : submission.score >= 50 ? 'text-yellow-500' : 'text-red-500';
                            return (
                            <Card key={submission.userId} className="flex flex-col">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={submission.userImage} alt={submission.userName} />
                                        <AvatarFallback>{submission.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base">{submission.userName}</CardTitle>
                                         <p className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                                            <CalendarDays className="h-4 w-4"/>
                                            {submission.completedAt}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow flex items-center justify-center">
                                     <p className={`text-4xl font-bold ${submissionScoreColor}`}>{submission.score}%</p>
                                </CardContent>
                            </Card>
                        )})}
                    </div>
                </div>
            )}

            <h3 className="font-semibold text-lg mb-4 text-center mt-8">Your Answers</h3>
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
                        { userAnswer && !isCorrect && (
                            <Feedback 
                            question={question} 
                            userAnswer={answerText} 
                            sourceMaterial={quiz.sourceMaterial}
                            />
                        )}
                        </div>
                    </li>
                    );
                })}
                </ul>
            </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={() => router.push('/dashboard')} className="w-full sm:w-auto" variant="outline">
                <Home className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <Button onClick={() => router.push(`/quiz/${quizId}`)} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" /> Retake Quiz
            </Button>
            <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" /> Share Results
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
