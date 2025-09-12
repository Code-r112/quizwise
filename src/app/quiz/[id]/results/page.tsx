import QuizResultsClient from '@/components/quiz/quiz-results-client';

export default function ResultsPage({ params }: { params: { id: string } }) {
  return <QuizResultsClient quizId={params.id} />;
}
