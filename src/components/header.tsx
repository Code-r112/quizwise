import Link from 'next/link';
import { BookOpenCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b">
      <Link className="flex items-center justify-center" href="/">
        <BookOpenCheck className="h-6 w-6 text-black" />
        <span className="ml-2 text-lg font-semibold font-headline text-black">QuizWise</span>
      </Link>
    </header>
  );
}
