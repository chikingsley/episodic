'use client';

import { useRouter } from 'next/navigation';
import ReviewSession from '../../components/review-session';

export default function ReviewPage() {
  const router = useRouter();
  
  // Handle review completion
  const handleComplete = () => {
    // Navigate back to home
    router.push('/');
  };
  
  // Handle exiting the review
  const handleExit = () => {
    router.push('/');
  };
  
  return (
    <ReviewSession
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
} 