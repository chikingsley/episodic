# Dark Mallard - Mockv4 Expo App (Archived Prototype)

**Status:** Archived Prototype | **Date:** December 2024 | **Version:** v4 Mock

## Overview

This is an archived version of the Dark Mallard language learning app prototype, preserved as a foundation for v0 development. This Expo React Native app represents the current state of development with core features and UI components established.

## Project Structure

### Core Directories

- **`app/`** - Expo Router app structure
  - `(auth)/` - Authentication flow
  - `(tabs)/` - Main tab navigation
  - `legal/` - Legal pages
  - `index.tsx`, `showcase.tsx` - Entry and showcase screens

- **`components/`** - Reusable UI components
  - `ui/` - Base UI components
  - `icons/` - Icon components
  - `common/` - Shared components
  - `hq/` - High-quality/specialized components
  - `showcase/` - Demo/showcase components

- **`content/`** - Content management
  - `audio/` - Audio files and resources
  - `lessons/` - Lesson content
  - `narrative/` - Story/narrative content
  - `images/` - Image assets

- **`convex/`** - Backend/database (Convex)
- **`lib/`** - Utility libraries and helpers
- **`assets/`** - Static assets

## Key Features Implemented

- Expo Router navigation
- Themed UI components
- Loading animations and screens
- Authentication structure
- Tab-based navigation
- Responsive design with Tailwind CSS
- TypeScript support
- Dark Mallard branding and theming

## Technology Stack

- **Framework:** Expo React Native
- **Navigation:** Expo Router
- **Styling:** Tailwind CSS + NativeWind
- **Backend:** Convex
- **Language:** TypeScript
- **Build:** Metro bundler

## Preparation for v0

### Immediate Next Steps

1. **Code Review & Cleanup**
   - Review component architecture
   - Consolidate duplicate code
   - Standardize naming conventions
   - Remove unused dependencies

2. **Architecture Planning**
   - Define app flow and navigation structure
   - Plan component hierarchy
   - Design state management strategy
   - Outline data models

3. **Feature Prioritization**
   - Core learning mechanics
   - User authentication
   - Progress tracking
   - Narrative integration

### v0 Development Goals

- [ ] Streamlined onboarding flow
- [ ] Core lesson structure
- [ ] Basic spaced repetition system
- [ ] Character progression (Dark Mallard)
- [ ] Clean, accessible UI
- [ ] Offline capability foundation

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun run start

# iOS development
bun run ios

# Android development
bun run android

# Web development
bun run web
```

## Notes for v0

- This prototype contains experimental features and UI explorations
- Focus on core learning mechanics for v0
- Preserve the Dark Mallard theme and character design
- Maintain TypeScript strict mode
- Keep accessibility as a priority

## Archive Context

This archive represents the exploration phase where various UI patterns, navigation structures, and feature concepts were tested. Use this as reference for what worked well and what should be simplified for v0.
