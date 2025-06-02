import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const listCourses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("courses").collect();
  },
});

export const getCourse = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(args.courseId);
  },
});

export const getLesson = query({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(args.lessonId);
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return stats || { totalXp: 0, lessonsCompleted: 0 };
  },
});

export const listLessons = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    return await Promise.all(lessons.map(async (lesson) => {
      // Get all progress entries for this lesson
      const progress = await ctx.db
        .query("progress")
        .withIndex("by_lesson_and_user", (q) => 
          q.eq("lessonId", lesson._id).eq("userId", userId)
        )
        .collect();

      // Calculate stats
      const bestScore = Math.max(...progress.map(p => p.score), 0);
      const totalXpEarned = progress.reduce((sum, p) => sum + p.xpEarned, 0);
      
      return {
        ...lesson,
        completed: progress.length > 0,
        score: bestScore,
        timesCompleted: progress.length,
        totalXpEarned
      };
    }));
  },
});

export const submitAnswer = mutation({
  args: {
    lessonId: v.id("lessons"),
    score: v.number(),
    xpEarned: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Always create a new progress entry for each lesson attempt
    await ctx.db.insert("progress", {
      userId,
      lessonId: args.lessonId,
      score: args.score,
      xpEarned: args.xpEarned,
      completedAt: Date.now()
    });

    // Update user stats with new XP
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (stats) {
      await ctx.db.patch(stats._id, {
        totalXp: stats.totalXp + args.xpEarned,
        lessonsCompleted: stats.lessonsCompleted + 1
      });
    } else {
      await ctx.db.insert("userStats", {
        userId,
        totalXp: args.xpEarned,
        lessonsCompleted: 1
      });
    }
  },
});
