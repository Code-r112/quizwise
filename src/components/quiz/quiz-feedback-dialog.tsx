'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Loader2, Sparkles } from 'lucide-react';

interface QuizFeedbackDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  feedback: string | null;
  onOpenChange: (open: boolean) => void;
}

export default function QuizFeedbackDialog({
  isOpen,
  isLoading,
  feedback,
  onOpenChange,
}: QuizFeedbackDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            AI-Powered Feedback
          </AlertDialogTitle>
          <AlertDialogDescription>
            Here's a little more information to help you understand.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 text-sm max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating feedback...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{feedback}</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
