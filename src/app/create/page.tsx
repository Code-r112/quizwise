'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createQuizAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { saveQuiz } from '@/lib/quiz-store';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Quiz'
      )}
    </Button>
  );
}

export default function CreateQuizPage() {
  const initialState = { message: null, errors: null, quiz: null };
  const [state, dispatch] = useFormState(createQuizAction, initialState);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state.quiz) {
      const quizId = saveQuiz({
        title: state.quiz.title || "Generated Quiz",
        sourceMaterial: state.sourceMaterial,
        questions: state.quiz.questions,
      });

      if (quizId) {
        toast({
          title: "Success!",
          description: "Your quiz has been generated.",
        });
        router.push(`/quiz/${quizId}`);
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not save the generated quiz.",
        });
      }
    } else if (state.message && !state.quiz) {
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: state.message,
        });
    }
  }, [state, router, toast]);

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Quiz</CardTitle>
          <CardDescription>
            Provide a topic and let our AI build your quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="topic">Quiz Topic</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., 'The Roman Empire' or 'React.js Hooks'"
                required
              />
            </div>
            
            <div className="space-y-4">
              <Label>Difficulty Level</Label>
              <RadioGroup defaultValue="medium" name="difficulty" className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard</Label>
                </div>
              </RadioGroup>
            </div>

             <div className="space-y-4">
              <Label htmlFor="numberOfQuestions">Number of Questions (1-10)</Label>
               <Input 
                id="numberOfQuestions"
                name="numberOfQuestions"
                type="number"
                min="1"
                max="10"
                defaultValue="5"
               />
            </div>
            
            <SubmitButton />

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
