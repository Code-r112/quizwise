
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllQuizzes } from '@/lib/quiz-store';
import type { Quiz } from '@/lib/types';
import { Plus, Play, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  useEffect(() => {
    setQuizzes(getAllQuizzes());
  }, []);

  const handleTakeQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    // Note: This is a simple implementation. A more robust solution
    // would involve confirming the deletion with the user.
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`quiz-${quizId}`);
      const quizIds = JSON.parse(localStorage.getItem('quizIds') || '[]').filter((id: string) => id !== quizId);
      localStorage.setItem('quizIds', JSON.stringify(quizIds));
      setQuizzes(getAllQuizzes());
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
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
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" onClick={() => handleTakeQuiz(quiz.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Take Quiz
                        </Button>
                         <Button variant="destructive" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
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
