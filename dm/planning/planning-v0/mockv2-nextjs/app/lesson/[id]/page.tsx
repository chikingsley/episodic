'use client';

import { notFound } from 'next/navigation';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '../../../context/user-context';
import LessonPlayer from '../../../components/lesson/lesson-player';
import { sampleLessons, UserProgress } from '../../../data/lesson-data';

export default function LessonPage() {
  const router = useRouter();
  const { userProgress, completeLesson } = useUser();
  
  // Get params using the useParams hook
  const params = useParams();
  const lessonId = params.id as string;
  
  // In a real app, we would fetch this from the database
  const lesson = sampleLessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    notFound();
    return null;
  }
  
  // Handle lesson completion - this updates user progress
  const handleComplete = (xpEarned: number, updatedProgress: UserProgress) => {
    completeLesson(lessonId, xpEarned);
    console.log('Lesson completed!', { xpEarned, updatedProgress });
  };
  
  // Handle exiting the lesson
  const handleExit = () => {
    console.log('Lesson exited');
    // Redirect to home page
    router.push('/');
  };
  
  return (
    <LessonPlayer 
      lesson={lesson}
      userProgress={userProgress}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
} 