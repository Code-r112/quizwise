import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, FileText, BrainCircuit, Share2, Star, Check } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  const heroImage = placeholderImages.find(img => img.id === 'hero-quiz');

  const faqs = [
    {
      question: "What is QuizWise?",
      answer: "QuizWise is an AI-powered platform that allows you to generate quizzes from any topic. It's designed to make learning and assessment faster, easier, and more engaging."
    },
    {
      question: "How do I create a quiz?",
      answer: "Simply go to the 'Create Quiz' page, enter a topic you want to learn about, select a difficulty level, and choose the number of questions. Our AI will handle the rest!"
    },
    {
      question: "What kind of questions does the AI generate?",
      answer: "The AI can generate a variety of question formats, including multiple-choice, true/false, and short-answer questions to provide a comprehensive assessment."
    },
    {
      question: "Can I share the quizzes I create?",
      answer: "Yes! After you complete a quiz, you'll get a unique link on the results page that you can share with others."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full py-20 md:py-28 lg:py-32 bg-white overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                  Unlock Knowledge with AI-Powered Quizzes
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  QuizWise transforms any topic into an interactive quiz, helping you learn faster and assess understanding with ease.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/dashboard">
                    Create Your First Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
                <Card className="transform-gpu transition-all duration-300 ease-out hover:rotate-[-2deg] hover:scale-105 shadow-2xl">
                    <CardHeader>
                        <h3 className="text-lg font-semibold">The Solar System</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">Question 1 of 5</p>
                        <p className="font-medium">Which planet is known as the Red Planet?</p>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 p-3 rounded-md border bg-gray-50"><Check className="text-green-500"/> Mars</div>
                           <div className="flex items-center gap-2 p-3 rounded-md border"> Jupiter</div>
                           <div className="flex items-center gap-2 p-3 rounded-md border"> Venus</div>
                        </div>
                    </CardContent>
                </Card>
                <div className="absolute -top-8 -left-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg transform-gpu transition-all duration-300 ease-out hover:scale-110">
                    <BrainCircuit className="h-8 w-8"/>
                </div>
                 <div className="absolute -bottom-8 -right-8 bg-accent text-accent-foreground p-3 rounded-full shadow-lg transform-gpu transition-all duration-300 ease-out hover:scale-110">
                    <Star className="h-8 w-8"/>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How QuizWise Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Generate, share, and analyze quizzes in three simple steps. Our AI does the heavy lifting, so you can focus on learning.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary text-primary-foreground rounded-full p-4">
                  <FileText className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold">From Any Topic</h3>
              <p className="text-sm text-muted-foreground">
                Just enter a topic, from historical events to scientific concepts. Our AI creates relevant questions.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary text-primary-foreground rounded-full p-4">
                    <BrainCircuit className="h-8 w-8"/>
                </div>
              </div>
              <h3 className="text-lg font-bold">AI Generation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a difficulty and number of questions, and let our AI generate a mix of question types.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                 <div className="bg-primary text-primary-foreground rounded-full p-4">
                    <Share2 className="h-8 w-8"/>
                 </div>
              </div>
              <h3 className="text-lg font-bold">Share & Analyze</h3>
              <p className="text-sm text-muted-foreground">
                Get a unique link to share your quiz. Track scores and get AI-powered feedback on performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Frequently Asked Questions</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions? We've got answers.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl w-full mt-12">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
