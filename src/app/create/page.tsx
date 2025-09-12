'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createQuizAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { saveQuiz } from '@/lib/quiz-store';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [sourceType, setSourceType] = useState('text');
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
            Provide your source material and let our AI build your quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-8">
            <Tabs defaultValue="text" className="w-full" onValueChange={(value) => setSourceType(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">From Text</TabsTrigger>
                <TabsTrigger value="url">From URL</TabsTrigger>
              </TabsList>
              <input type="hidden" name="sourceType" value={sourceType} />
              <TabsContent value="text" className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="text-source">Paste your text</Label>
                    <Textarea
                        id="text-source"
                        name="source"
                        placeholder="Paste the content you want to create a quiz from..."
                        className="min-h-[200px]"
                        required={sourceType === 'text'}
                    />
                 </div>
              </TabsContent>
              <TabsContent value="url" className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="url-source">Enter a URL</Label>
                    <Input
                        id="url-source"
                        name="source"
                        type="url"
                        placeholder="https://example.com/article"
                        required={sourceType === 'url'}
                    />
                 </div>
              </TabsContent>
            </Tabs>
            
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
            
            <SubmitButton />

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
