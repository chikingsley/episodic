import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  courses: defineTable({
    name: v.string(),
    description: v.string(),
    language: v.string(),
  }),
  lessons: defineTable({
    courseId: v.id("courses"),
    name: v.string(),
    type: v.string(),
    questions: v.array(
      v.object({
        type: v.string(),
        text: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.string(),
        explanation: v.string(),
        hint: v.optional(v.string()),
        xp: v.number(),
      })
    ),
  }).index("by_course", ["courseId"]),
  progress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    score: v.number(),
    xpEarned: v.number(),
    completedAt: v.number(),
  }).index("by_lesson_and_user", ["lessonId", "userId"]),
  userStats: defineTable({
    userId: v.id("users"),
    totalXp: v.number(),
    lessonsCompleted: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
