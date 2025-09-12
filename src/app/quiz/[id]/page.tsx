import QuizClient from '@/components/quiz/quiz-client';

export default function QuizPage({ params }: { params: { id: string } }) {
  return <QuizClient quizId={params.id} />;
}
