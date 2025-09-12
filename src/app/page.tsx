import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, FileText, Link as LinkIcon } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = placeholderImages.find(img => img.id === 'hero-quiz');

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Unlock Knowledge with AI-Powered Quizzes
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  QuizWise transforms any text, document, or webpage into an interactive quiz, helping you learn faster and assess understanding with ease.
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

      <section className="w-full py-12 md:py-24 lg:py-32">
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
              <h3 className="text-lg font-bold">From Text or URL</h3>
              <p className="text-sm text-muted-foreground">
                Paste any text or provide a URL. Our AI reads and understands the content to create relevant questions.
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
                Choose a difficulty and let our AI generate a mix of question types, from multiple-choice to short answer.
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
    </div>
  );
}
