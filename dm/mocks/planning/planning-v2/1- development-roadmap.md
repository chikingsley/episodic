# EPISODIC Development Roadmap

## Mission Structure Clarifications

### Active Mission Flow

The active mission is a complete narrative unit containing all these components:

1. **Intelligence Gathering** - Prerequisite vocabulary acquisition
2. **Mission Briefing** - Narrative context and objectives
3. **Field Training** - Core learning modules (lessons)
4. **Field Operation** - Interactive application scenario
5. **Mission Debrief** - Performance review and rewards

These components are **sequential steps within each mission**, not separate missions. The UI should visualize:

- Which components are completed
- Which component is currently active
- Which components are locked until prerequisites are completed

Progress through these components is linear - Intelligence Gathering must be completed to unlock Mission Briefing, and so on.

### Interface Clarifications

**HQ Screen:**

- Shows the current active mission with progress visualization
- Quick actions for daily practice, review, etc.
- Entry point to mission components

**Intel Tab:**

- Reference library of previously learned vocabulary
- Spaced repetition review system
- Cultural information and grammar notes
- No new training modules - just reference and review

**Mission Control:**

- List of available and completed missions
- Geographic "map" visualization showing mission locations
- Should be implemented as a stylized, interactive map rather than a literal one
- Missions unlock based on clearance level and previous completions

**Agent Profile:**

- Personal progress stats and customization
- Achievement tracking and rewards display

## Development Phases

### Phase 1: Core Infrastructure (2-3 weeks)

- [ ] **Authentication System**
  - [ ] User registration and login
  - [ ] Profile creation with agent codename
  - [ ] Auth state management

- [ ] **Database Schema Design**
  - [ ] User profiles
  - [ ] Learning progress tracking
  - [ ] Mission/lesson completion state
  - [ ] Vocabulary mastery tracking
  - [ ] XP and leveling system

- [ ] **State Management**
  - [ ] Set up Zustand store for UI state
  - [ ] Create contexts for user data
  - [ ] Implement persistence layer with Convex

- [ ] **Basic UI Framework**
  - [ ] Layout components with Shadcn
  - [ ] Navigation structure
  - [ ] Dark mode implementation
  - [ ] Responsive design foundation

### Phase 2: Minimum Viable Product (3-4 weeks)

- [ ] **HQ Screen Implementation**
  - [ ] Agent status display
  - [ ] Mission progress visualization
  - [ ] Quick actions grid
  - [ ] Settings modal

- [ ] **First Mission Flow**
  - [ ] Intelligence gathering interface
  - [ ] Mission briefing screen
  - [ ] Basic lesson structure
  - [ ] Simple field operation
  - [ ] Mission completion flow

- [ ] **Essential Learning Systems**
  - [ ] Basic vocabulary presentation
  - [ ] Simple quiz mechanism
  - [ ] Progress tracking
  - [ ] XP rewards system

- [ ] **Content Creation - Basics**
  - [ ] First mission narrative
  - [ ] Core vocabulary set
  - [ ] Basic dialogue scripts
  - [ ] Fundamental grammar points

### Phase 3: Core Gameplay Systems (4-6 weeks)

- [ ] **Spaced Repetition System**
  - [ ] Algorithm implementation
  - [ ] Review scheduling
  - [ ] Mastery tracking
  - [ ] Review interface

- [ ] **Field Operation Mechanics**
  - [ ] Dialog tree system
  - [ ] Response selection
  - [ ] Cover effectiveness tracking
  - [ ] Success/failure states

- [ ] **Progression Systems**
  - [ ] Clearance level mechanics
  - [ ] XP and leveling
  - [ ] Unlock conditions
  - [ ] Reward distribution

- [ ] **Content Expansion**
  - [ ] Additional mission narratives
  - [ ] Expanded vocabulary sets
  - [ ] More complex dialogues
  - [ ] Intermediate grammar points

### Phase 4: Enhanced Experience (4-6 weeks)

- [ ] **Mission Control Map**
  - [ ] Stylized map visualization
  - [ ] Location unlocking
  - [ ] Mission status indicators
  - [ ] Navigation to available missions (maybe like GTA in a way where you can have a mission in an old or new area)

- [ ] **Intel Archive**
  - [ ] Vocabulary reference system
  - [ ] Grammar reference library
  - [ ] Cultural notes database
  - [ ] Search and filtering

- [ ] **Animation and Polish**
  - [ ] Mission transitions
  - [ ] Achievement notifications
  - [ ] Interactive elements
  - [ ] Loading states and progress indicators

- [ ] **Content Enrichment**
  - [ ] Character portraits
  - [ ] Environment illustrations
  - [ ] Audio recordings for vocabulary
  - [ ] Mission briefing narrations

### Phase 5: Advanced Features (Ongoing)

- [ ] **Interactive Dialogues**
  - [ ] More complex branching
  - [ ] Character relationship tracking
  - [ ] Contextual responses
  - [ ] Time-limited challenges

- [ ] **Media Integration**
  - [ ] Video content embedding
  - [ ] Audio dialogue practice
  - [ ] Pronunciation feedback
  - [ ] Visual learning aids

- [ ] **Social Features**
  - [ ] Achievement sharing
  - [ ] Progress comparisons
  - [ ] Friend recommendations
  - [ ] Optional collaborative missions

- [ ] **Analytics and Adaptation**
  - [ ] Learning performance tracking
  - [ ] Content effectiveness metrics
  - [ ] Personalized recommendations
  - [ ] Difficulty adjustments

## Technical Implementation Priorities

### Database Considerations

**Convex DB Structure:**

```
- users/
  - profiles
  - progress
  - settings
- content/
  - missions
  - lessons
  - vocabulary
  - grammar
- progress/
  - completions
  - mastery
  - reviews
```

**Key Entities:**

- User (profile, preferences, progress metrics)
- Mission (narrative, components, unlock conditions)
- Lesson (content, exercises, assessments)
- VocabularyItem (term, translation, usage, mastery data)
- UserProgress (mission status, lesson completions, vocabulary mastery)
- ReviewSchedule (SRS algorithm data, due dates)

### State Management Strategy

**Use Zustand For:**

- UI state (active tabs, modals, animations)
- Current mission/lesson state
- Temporary session data

**Use Convex For:**

- User authentication state
- Persistent progress data
- Content delivery
- Review scheduling

### Performance Considerations

- Implement lazy loading for content
- Cache frequently accessed vocabulary
- Use optimistic updates for user progress
- Implement efficient querying patterns for lesson content
- Consider offline capabilities for lesson content

## Content Development Strategy

Start with a single, complete mission flow that demonstrates all components:

1. **First Mission: "Café Introduction"**
   - 20-30 essential vocabulary items
   - 3-4 simple dialogue scenarios
   - 1 complete field operation
   - Clear narrative arc with defined objectives

Once the first mission is complete and functional, establish a template-based approach for future content:

1. **Mission Template**
   - Standard structure for narrative components
   - Defined format for mission briefings
   - Consistent flow through components

2. **Content Authoring Tools**
   - Simple interface for adding vocabulary
   - Dialog tree editor for field operations
   - Narrative component templates

use sentry for error tracking
Use a top-tier word ASR (Scribe v1) → Montreal Forced Aligner.
<https://montreal-forced-aligner.readthedocs.io/en/stable/index.html>
setup python microservice for ASR processing and conversation

This phased approach allows for iterative development, with early feedback on core mechanics before significant content investment.
