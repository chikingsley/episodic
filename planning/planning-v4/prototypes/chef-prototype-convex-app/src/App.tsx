import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface Lesson {
  _id: Id<"lessons">;
  name: string;
  questions: Array<{
    type: string;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    hint?: string;
    xp: number;
  }>;
  completed?: boolean;
  score?: number;
  timesCompleted?: number;
  totalXpEarned?: number;
}

function LessonContent({ lesson, onComplete }: { 
  lesson: Lesson;
  onComplete: () => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const submitAnswer = useMutation(api.courses.submitAnswer);

  const question = lesson.questions[currentQuestion];
  const isLastQuestion = currentQuestion === lesson.questions.length - 1;

  const handleAnswer = async (answer: string) => {
    const isCorrect = answer === question.correctAnswer;
    if (isCorrect) {
      toast.success("Correct! " + question.explanation);
      setScore(score + 1);
      setXpEarned(xpEarned + question.xp);
    } else {
      toast.error("Incorrect. " + question.explanation);
    }

    if (isLastQuestion) {
      const finalScore = ((score + (isCorrect ? 1 : 0)) / lesson.questions.length) * 100;
      await submitAnswer({
        lessonId: lesson._id,
        score: finalScore,
        xpEarned: xpEarned + (isCorrect ? question.xp : 0),
      });
      onComplete();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{lesson.name}</h2>
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {lesson.questions.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / lesson.questions.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-6">{question.text}</p>
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option}
              className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {question.hint && (
          <div className="mt-4 text-sm text-gray-600">
            💡 Hint: {question.hint}
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div>Score: {score}/{currentQuestion}</div>
        <div>XP Earned: {xpEarned}</div>
      </div>
    </div>
  );
}

function LessonList({ courseId, onSelectLesson }: { 
  courseId: Id<"courses">, 
  onSelectLesson: (lesson: Lesson) => void 
}) {
  const lessons = useQuery(api.courses.listLessons, { courseId }) || [];
  const stats = useQuery(api.courses.getUserStats);
  const course = useQuery(api.courses.getCourse, { courseId });

  if (!stats || !course) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
      <p className="text-gray-600 mb-8">{course.description}</p>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">Total XP</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalXp}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Lessons Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.lessonsCompleted}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {lessons.map((lesson: Lesson) => (
          <div
            key={lesson._id}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectLesson(lesson)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{lesson.name}</h3>
              {lesson.completed && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Best Score: {Math.round(lesson.score || 0)}%
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center justify-between">
                <span>{lesson.questions.length} questions</span>
                {(lesson.timesCompleted || 0) > 0 && (
                  <span className="text-yellow-600 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {lesson.totalXpEarned} XP Total
                  </span>
                )}
              </div>
              {lesson.completed && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${Math.round(lesson.score || 0)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Completed {lesson.timesCompleted} time{(lesson.timesCompleted || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useConvexAuth();
  const courses = useQuery(api.courses.listCourses) || [];
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (!isAuthenticated) {
    return <SignInForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Language Learning</h1>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {selectedLesson ? (
          <div>
            <button
              onClick={() => setSelectedLesson(null)}
              className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Lessons
            </button>
            <LessonContent 
              lesson={selectedLesson} 
              onComplete={() => setSelectedLesson(null)} 
            />
          </div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="mb-12">
              <LessonList 
                courseId={course._id} 
                onSelectLesson={setSelectedLesson}
              />
            </div>
          ))
        )}
      </main>
    </div>
  );
}
