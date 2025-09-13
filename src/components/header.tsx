'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpenCheck, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export default function Header() {
  const scrolled = useScroll();
  const { user, signInWithGoogle, signOut } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full px-4 lg:px-6 py-4 flex items-center bg-white transition-all",
        scrolled ? "border-b shadow-sm" : ""
      )}
    >
      <Link className="flex items-center justify-center" href="/">
        <BookOpenCheck className="h-6 w-6 text-black" />
        <span className="ml-2 text-lg font-semibold font-headline text-black">QuizWise</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={signInWithGoogle} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
