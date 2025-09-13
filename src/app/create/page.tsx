'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  createQuizFromTopicAction,
  createQuizFromTextAction,
  createQuizFromUrlAction
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveQuiz } from '@/lib/quiz-store';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

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

const initialState = { message: null, errors: null, quiz: null, sourceMaterial: null };

function QuizFormContainer({ state, children }: { state: any, children: React.ReactNode }) {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (state.quiz && user) {
            const handleSave = async () => {
                const quizId = await saveQuiz({
                    title: state.quiz.title || "Generated Quiz",
                    sourceMaterial: state.sourceMaterial,
                    questions: state.quiz.questions,
                }, user.uid);

                if (quizId) {
                    toast({
                        title: "Success!",
                        description: "Your quiz has been generated.",
                    });
                    router.push(`/dashboard`);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Could not save the generated quiz.",
                    });
                }
            }
            handleSave();
        } else if (state.message && !state.quiz) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: state.message,
            });
        }
    }, [state, router, toast, user]);

    return <>{children}</>;
}


export default function CreateQuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [topicState, topicDispatch] = useActionState(createQuizFromTopicAction, initialState);
  const [textState, textDispatch] = useActionState(createQuizFromTextAction, initialState);
  const [urlState, urlDispatch] = useActionState(createQuizFromUrlAction, initialState);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Quiz</CardTitle>
          <CardDescription>
            Choose your method and let our AI build your quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="topic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="topic">From Topic</TabsTrigger>
              <TabsTrigger value="text">From Text</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>
            <TabsContent value="topic">
                <QuizFormContainer state={topicState}>
                    <form action={topicDispatch} className="space-y-8 mt-6">
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
                            <RadioGroupItem value="easy" id="easy-topic" />
                            <Label htmlFor="easy-topic">Easy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium-topic" />
                            <Label htmlFor="medium-topic">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hard" id="hard-topic" />
                            <Label htmlFor="hard-topic">Hard</Label>
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
                </QuizFormContainer>
            </TabsContent>
            <TabsContent value="text">
              <QuizFormContainer state={textState}>
                <form action={textDispatch} className="space-y-8 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="text">Your Text</Label>
                        <Textarea
                            id="text"
                            name="text"
                            placeholder="Paste the text you want to create a quiz from here. Minimum 50 characters."
                            required
                            rows={10}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Difficulty Level</Label>
                        <RadioGroup defaultValue="medium" name="difficulty" className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="easy" id="easy-text" />
                                <Label htmlFor="easy-text">Easy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="medium-text" />
                                <Label htmlFor="medium-text">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hard" id="hard-text" />
                                <Label htmlFor="hard-text">Hard</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    
                    <SubmitButton />
                </form>
              </QuizFormContainer>
            </TabsContent>
            <TabsContent value="url">
              <QuizFormContainer state={urlState}>
                <form action={urlDispatch} className="space-y-8 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="url">Website URL</Label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            placeholder="e.g., https://en.wikipedia.org/wiki/Photosynthesis"
                            required
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Difficulty Level</Label>
                        <RadioGroup defaultValue="medium" name="difficulty" className="flex space-x-4">
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="easy" id="easy-url" />
                                <Label htmlFor="easy-url">Easy</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="medium-url" />
                                <Label htmlFor="medium-url">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hard" id="hard-url" />
                                <Label htmlFor="hard-url">Hard</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    
                    <SubmitButton />
                </form>
              </QuizFormContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
