
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllQuizzes, getQuizResults, deleteQuiz } from '@/lib/quiz-store';
import type { Quiz } from '@/lib/types';
import { Plus, Play, Trash2, Share2, Loader2, BarChart2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [resultsMap, setResultsMap] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (user) {
      const fetchQuizzes = async () => {
        setLoadingQuizzes(true);
        const userQuizzes = await getAllQuizzes(user.uid);
        setQuizzes(userQuizzes);

        const resultsExistence: Record<string, boolean> = {};
        for (const quiz of userQuizzes) {
            const results = await getQuizResults(quiz.id, user.uid);
            resultsExistence[quiz.id] = results !== null;
        }
        setResultsMap(resultsExistence);

        setLoadingQuizzes(false);
      };
      fetchQuizzes();
    }
  }, [user, authLoading, router]);

  const handleTakeQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const confirmDeleteQuiz = async () => {
    if (quizToDelete) {
        await deleteQuiz(quizToDelete);
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizToDelete));
        toast({ title: "Quiz Deleted", description: "The quiz has been successfully deleted." });
        setQuizToDelete(null);
    }
  };

  const handleShareQuiz = (quizId: string) => {
    const url = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'Quiz link has been copied to your clipboard.',
      });
    });
  };
  
  const hasResults = (quizId: string) => {
    return resultsMap[quizId] || false;
  }

  if (authLoading || loadingQuizzes || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-24 px-4">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Hello, {user?.displayName?.split(' ')[0] || 'User'}!</h1>
            <p className="text-muted-foreground">Welcome back to your dashboard.</p>
        </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-3xl">Your Quizzes</CardTitle>
                <CardDescription>
                    Here are all the quizzes you've created.
                </CardDescription>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Quiz
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
          {quizzes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Title</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">
                        <Link href={`/quiz/${quiz.id}`} className="hover:underline">
                            {quiz.title}
                        </Link>
                    </TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" onClick={() => handleTakeQuiz(quiz.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Take Quiz
                        </Button>
                        {hasResults(quiz.id) && (
                            <Button variant="outline" size="sm" onClick={() => router.push(`/quiz/${quiz.id}/results`)}>
                                <BarChart2 className="mr-2 h-4 w-4" />
                                View Results
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleShareQuiz(quiz.id)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" onClick={() => setQuizToDelete(quiz.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your quiz
                                and any associated results.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setQuizToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDeleteQuiz}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No Quizzes Yet!</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                    Click the button above to create your first quiz.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
