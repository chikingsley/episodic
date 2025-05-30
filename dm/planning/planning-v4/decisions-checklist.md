# Episodic Language Learning: Decision Checklist

**Status:** `PLANNING` → `PRODUCTION` (when core decisions locked)

---

## Phase 0: Minimal App Store Submission (Bare Bones)

**Goal:** Get approved on iOS/Android App Stores with minimal viable app to enable iterative updates

### Required Components

- [ ] **App Shell & Navigation**
  - [ ] Basic tab navigation (Home, Learn, Profile)
  - [ ] Minimal branding/theming
  - [ ] Basic app icon and splash screen
- [ ] **Authentication**
  - [ ] Simple auth flow (likely anonymous + optional account creation)
  - [ ] Basic user profile storage
- [ ] **Single Demo Lesson**
  - [ ] One hardcoded French lesson with 3-5 exercises
  - [ ] Basic exercise types (MCQ only for v0?)
  - [ ] Simple progress tracking (local storage)
- [ ] **Minimal Audio**
  - [ ] Pre-recorded audio files bundled with app
  - [ ] Basic playback controls
- [ ] **Store Requirements**
  - [ ] Privacy policy page
  - [ ] Terms of service page
  - [ ] App Store screenshots/description
  - [ ] TestFlight beta testing

### Questions for App Store Submission

- [ ] What do we already have built? (List current components)
- [ ] Anonymous-first or require signup?
- [ ] Bundle first lesson or load from server?
- [ ] Include speech recognition in v0?

---

## Phase 1: Core Learning Experience

**Goal:** Define and implement the actual language learning mechanics and first real content

### 🚨 Core Mechanics (NOT DECIDED - Next 10 Days)

- [ ] **Language Delivery Method**
  - [ ] How do we blend the 4 methods (Pimsleur, Michel Thomas, Paul Noble, Language Transfer)?
  - [ ] When do we use TTS vs pre-recorded audio?
  - [ ] How is Pimsleur-style spaced repetition integrated?
  - [ ] Do mechanics change per language or story?

- [ ] **Exercise Templates & Flow**
  - [ ] Define the 5-7 core exercise types
  - [ ] How do exercises connect to narrative?
  - [ ] Difficulty progression system
  - [ ] Error handling and feedback

- [ ] **Audio Architecture**
  - [ ] Real-time TTS or pre-generated?
  - [ ] How to handle voice acting for characters?
  - [ ] Speech recognition integration approach
  - [ ] Pronunciation feedback mechanism

- [ ] **Open Dialogue System**
  - [ ] Push-to-talk vs continuous listening?
  - [ ] How much flexibility in responses?
  - [ ] Pipecat Flows integration specifics
  - [ ] Fallback for off-topic responses

### Narrative & Content Structure

- [ ] **Content Identification System**
  - [ ] Finalize slug scheme (current: `<lang>-<clearance>-<op>-<unit>-<kind>-<idx>`)
  - [ ] Terminology mapping (Campaign/Clearance/Operation/Mission)
  - [ ] How much can change between languages/stories?

- [ ] **Narrative Integration**
  - [ ] How tightly coupled is language learning to story?
  - [ ] Branching complexity for v1
  - [ ] Failure states and recovery paths

### Technical Foundation

- [ ] **Data & State Management**
  - [x] Database: Convex (decided)
  - [x] Auth: Clerk (decided)
  - [ ] State management: Legend State (evaluate)
  - [ ] Offline capability requirements

- [ ] **Content Pipeline**
  - [ ] Ink/Inky for narrative (confirm)
  - [ ] Exercise authoring workflow
  - [ ] Asset management (audio, images, animations)
  - [ ] Validation and QA tools

---

## Phase 2: Extended Features & Polish

**Goal:** Add progression systems, social features, and platform maturity

### Progression & Gamification

- [ ] **Integrity/Health System**
  - [ ] Starting values and depletion rates
  - [ ] Recovery mechanisms
  - [ ] Impact on gameplay

- [ ] **Rewards & Motivation**
  - [ ] XP/points system
  - [ ] Streak mechanics
  - [ ] Unlockables and achievements

### Platform Features

- [ ] **Multi-device Sync**
- [ ] **Offline Mode**
- [ ] **Analytics & Tracking**
- [ ] **A/B Testing Framework**

---

## Immediate Action Items (This Week)

1. [ ] **List Current Assets**
   - What's already built in the Expo app?
   - What content exists?
   - What can be reused for App Store submission?

2. [ ] **Core Mechanics Workshop**
   - Review 4-methods analysis
   - Define how to blend approaches
   - Create first lesson prototype

3. [ ] **Technical Spike**
   - Test Convex with Expo
   - Verify speech recognition on device
   - Audio playback performance

---

## Questions to Answer First

### For You to Answer

1. What components do you already have built?
2. Do you have any lessons/content created?
3. What's your timeline for App Store submission?
4. Which language teaching elements from the 4 methods resonate most?

### Design Decisions Needed

1. Should language mechanics vary by story/language?
2. How much narrative in v1 vs pure language learning?
3. Real-time generation vs pre-authored content balance?
4. Target lesson length and session structure?

---

## Parking Lot (Decisions for Later)

- Character voice acting approach
- Monetization model
- Social features
- Advanced analytics
- Multi-language content production pipeline
- Community features
