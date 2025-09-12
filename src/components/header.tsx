import Link from 'next/link';
import { BookOpenCheck } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="px-4 lg:px-6 py-4 flex items-center bg-white">
      <Link className="flex items-center justify-center" href="/">
        <BookOpenCheck className="h-6 w-6 text-black" />
        <span className="ml-2 text-lg font-semibold font-headline text-black">QuizWise</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          Sign In
        </Button>
      </div>
    </header>
  );
}
