import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, FileText, Link as LinkIcon, Plus, Minus } from 'lucide-react';
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
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Unlock Knowledge with AI-Powered Quizzes
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  QuizWise transforms any topic into an interactive quiz, helping you learn faster and assess understanding with ease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/create">
                    Create Your First Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            {heroImage && (
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint={heroImage.imageHint}
                height="550"
                src={heroImage.imageUrl}
                width="550"
              />
            )}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.993.142"/><path d="M18 5a3 3 0 1 0-5.993.142"/><path d="M5 8.142A3 3 0 1 0 8 5"/><path d="M15 8.142A3 3 0 1 0 18 5"/><path d="M12 12a3 3 0 1 0-5.993.142"/><path d="M18 12a3 3 0 1 0-5.993.142"/><path d="M5 15.142A3 3 0 1 0 8 12"/><path d="M15 15.142A3 3 0 1 0 18 12"/><path d="M12 19a3 3 0 1 0-5.993.142"/><path d="M18 19a3 3 0 1 0-5.993.142"/><path d="M5 22.142A3 3 0 1 0 8 19"/><path d="M15 22.142A3 3 0 1 0 18 19"/><path d="M12 5v7"/><path d="M12 12v7"/><path d="M12 12h-7"/><path d="m19 12-7 0"/><path d="m19 5-7 0"/><path d="M5 5h7"/><path d="M5 19h7"/><path d="m19 19-7 0"/></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
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
