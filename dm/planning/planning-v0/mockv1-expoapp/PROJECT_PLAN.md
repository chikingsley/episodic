# Episodic App - Project Plan

This document outlines the technical stack, structure, workflow, and key decisions for the Episodic language learning application.

## 1. Project & App Name

* **App Name:** Episodic
* **First Story Arc / Season:** Canne You Not

## 2. Project Structure

A multi-package structure without a formal monorepo tool:

```
episodic/                      # Main project root
├── app/                       # Expo React Native App (Primary focus)
├── web/                       # (Optional) Future Web App
├── canne-you-not/             # Content (Scripts, Vocab, Planning)
└── PROJECT_PLAN.md            # This file
```

## 3. Core Tech Stack

* **Platform:** iOS first
* **Framework:** Expo React Native
* **Routing:** Expo Router
* **UI Library:** Tamagui / Shadcn-rn (Assumed based on prior discussion - *confirm if different*)
* **Animation:** React Native Reanimated (v3+)
* **Database & Auth:** Convex (TypeScript)
* **State Management (Frontend):** Zustand (Recommended)
* **Error Logging:** Sentry (Recommended)

## 4. AI & Content Generation Tools

* **Text-to-Speech (TTS):** ElevenLabs
* **Image Generation:** Midjourney, ChatGPT 4o, Gemini 2.5
* **Video Generation:** RunwayML (v4), Google Veo 2, OpenAI Sora
* **Lip Sync:** Hedra AI
* **UI Assets (Flags):** [flagpack.xyz](https://flagpack.xyz/)
* **Sound Effects:** Requires a solution (e.g., Freesound.org, ZapSplat, Epidemic Sound, Artlist.io)

## 5. Key Features & Considerations

* **Learning Method:** Episodic narrative, Pimsleur-style interaction, Spaced Repetition System (SRS).
* **Core Interaction:** Dialogue presentation, `[FREEZE & TEACH]` vocabulary/grammar explanations, user input/choices.
* **Haptics:** Essential for UX. Implement using `expo-haptics`, creating sequences with timing for desired effects.
* **Progress Tracking:** Utilize Convex to track user progress, vocabulary mastery, mistakes, and successes.
* **Asset Management:** Develop a strategy for organizing, storing (CDN? Convex Files?), and efficiently loading numerous generated media assets.

## 6. Scene Creation Workflow

1. **High-Level Planning:** Define episode learning objectives & vocab.
2. **Script Writing:** Write dialogue, scene descriptions, `[FREEZE & TEACH]` blocks.
3. **Vocabulary Extraction:** Create/update `vocabulary/epX-vocab.md`.
4. **Storyboard/Shot List:** Detail key visuals, actions, SFX, mood per scene.
5. **Asset Generation:** Use AI tools (Image, Video, Audio, Lip Sync) based on storyboard.
6. **App Implementation:** Build UI, integrate assets, add animations, logic, haptics, Convex integration.
7. **Testing & Refinement:** Iterate on flow, learning, performance.

## 7. Next Steps / To-Dos

* Initialize Expo project: `npx create-expo-app app`
* Set up basic Expo Router navigation.
* Choose and set up UI library (Tamagui/Shadcn-rn?).
* Integrate Convex SDK for auth and basic data models (user progress).
* Select and integrate a Sound Effects solution/library.
* Define frontend state management approach (Zustand?).
* Implement the first scene based on the workflow.
