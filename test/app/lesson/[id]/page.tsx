'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import LessonPlayer from '../../../components/lesson/lesson-player';
import { sampleLessons, initialUserProgress, UserProgress } from '../../../data/lesson-data';

export default function LessonPage() {
  // Get params using the useParams hook
  const params = useParams();
  const lessonId = params.id as string;
  
  // In a real app, we would fetch this from the database
  const lesson = sampleLessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    notFound();
    return null;
  }
  
  // Handle lesson completion - in a real app, this would update the database
  const handleComplete = (xpEarned: number, updatedProgress: UserProgress) => {
    console.log('Lesson completed!', { xpEarned, updatedProgress });
    // Here we would save progress to the database
  };
  
  // Handle exiting the lesson
  const handleExit = () => {
    console.log('Lesson exited');
    // In a real app, we would redirect to the mission page
    // window.location.href = `/mission/${lesson.missionId}`;
  };
  
  return (
    <LessonPlayer 
      lesson={lesson}
      userProgress={initialUserProgress}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
} 