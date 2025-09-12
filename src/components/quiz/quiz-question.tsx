'use client';

import { Question } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface QuizQuestionProps {
  question: Question;
  onAnswerSelect: (answer: string) => void;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  userAnswer: string | null;
}

export default function QuizQuestion({
  question,
  onAnswerSelect,
  isSubmitted,
  isCorrect,
  userAnswer,
}: QuizQuestionProps) {
  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'true/false':
        return (
          <RadioGroup onValueChange={onAnswerSelect} disabled={isSubmitted}>
            <div className="space-y-3">
              {question.answers.map((answer, index) => {
                const isUserChoice = userAnswer === answer;
                const isCorrectAnswer = question.correctAnswer === answer;
                
                return (
                  <Label
                    key={index}
                    htmlFor={`option-${index}`}
                    className={cn(
                      "flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors",
                      isSubmitted && isCorrectAnswer && "border-green-500 bg-green-100/50 text-green-900",
                      isSubmitted && isUserChoice && !isCorrect && "border-red-500 bg-red-100/50 text-red-900",
                      !isSubmitted && "hover:bg-accent/50"
                    )}
                  >
                    <RadioGroupItem value={answer} id={`option-${index}`} />
                    <span>{answer}</span>
                  </Label>
                );
              })}
            </div>
          </RadioGroup>
        );
      case 'fill-in-the-blank':
      case 'short-answer':
        return (
          <Input
            type="text"
            placeholder="Type your answer here..."
            onChange={(e) => onAnswerSelect(e.target.value)}
            disabled={isSubmitted}
            className={cn(
              isSubmitted && (isCorrect ? "border-green-500" : "border-red-500")
            )}
          />
        );
      default:
        return <p>Unsupported question type.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium leading-relaxed">{question.text}</p>
      <div>{renderQuestionType()}</div>
    </div>
  );
}
