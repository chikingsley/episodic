# Dark Mallard UI Development Plan & Enhancement Specifications

## Global UI Standardization Requirements

### Typography Standardization

- Use "JetBrains Mono" (or equivalent monospace font) consistently across all screens
- Header hierarchy: 20px bold for main headers, 16px semibold for section headers, 14px medium for card titles
- Body text: 14px regular for primary content, 12px for secondary information
- Ensure proper line height (1.5 for body text, 1.2 for headers)
- Maintain consistent letter spacing (0.5px for headers, 0.3px for body)

### Color Application Guidelines

- Primary background: Deep midnight blue (#0F1A2C) for all screen backgrounds
- Secondary containers: Slightly lighter gray (#1F2937) for cards and content containers
- Accent elements: Crimson red (#991B1B) for primary interactive elements and highlights
- Create consistent color mapping:
  - Success states: Deep green (#065F46)
  - Warning states: Amber (#92400E)
  - Error states: Red (#9B1C1C)
  - Inactive states: Gray (#4B5563)
- Maintain consistent opacity levels for overlays (70% for modals, 40% for tooltips)

### Component Design Standardization

- Buttons: 8px rounded corners, 2px border (when applicable), 12px vertical padding
- Cards: 12px rounded corners, 1px border, 16px internal padding, subtle gradient overlay (2% from bottom to top)
- Input fields: Dark backgrounds (#111827), light text, red accent on focus, consistent 12px padding
- Toggle switches: Custom styled to resemble security switches with red/green indicators
- Progress bars: 4px height, rounded ends, animated fill transitions (300ms duration)

### Animation & Interaction Guidelines

- Implement consistent animation durations: 300ms for standard transitions, 200ms for micro-interactions
- Create custom easing curves that feel "mechanical" rather than bouncy
- Standardize hover states: subtle glow effect (box-shadow with accent color)
- Develop consistent loading animations resembling data scanning or decryption
- Standardize transition effects between screens (slide for navigation, fade for modals)

## Screen-Specific Enhancements

### HQ (Home) Screen Enhancements

**Header Section Improvements**

- Add classified document stamp overlay in top corner (subtle, semi-transparent)
- Implement dynamic day/night cycle indicator based on user's local time
- Create animated connection status indicator ("secure link established")
- Add subtle scan line effect on header text for retro computer terminal feel

**Agent Status Panel Revisions**

- Replace circular progress indicator with more tactical horizontal gauge
- Add animated glow effect to status indicators (active, on mission, etc.)
- Implement dynamic background that subtly shifts based on current mission status
- Create more detailed stats visualization with military-style data presentation
- Add "operational readiness" metric combining streak and recent performance

**Mission Card Enhancements**

- Implement folding/unfolding animation when mission card is selected
- Add subtle parallax effect to mission graphic elements on scroll
- Create "classified" watermark overlay that fades when card is activated
- Add mission timer with countdown visualization (operation window)
- Implement mission difficulty indicator with tactical terminology (low risk, high priority, etc.)
- Create "mission status" ribbon in top corner (pending, active, completed, compromised)

**Quick Actions Section**

- Redesign as tactical command console with illuminated buttons
- Create "power-up" visual effect when buttons are pressed
- Add subtle pulse animation to highest priority action
- Implement swipe capability to access additional action options
- Create visual connection between actions and related mission objectives

**Intelligence Briefing Section**

- Redesign as incoming transmission visual style
- Add subtle decryption animation when section loads
- Implement collapsible detailed view for each intelligence item
- Create visual priority classification system (color coding + icons)
- Add interaction capability to save key intelligence to dossier

### Mission Flow Screen Enhancements

**Mission Briefing Improvements**

- Add decryption animation when briefing text first appears
- Implement dynamic typography that simulates typing effect for key sections
- Create collapsible sections for mission details, objectives, and rewards
- Add interactive map element showing mission location with zoom capability
- Implement dossier-style tabs for different briefing information categories
- Add signature section with handler character detail

**Vocabulary Drill Enhancements**

- Create weapon targeting interface styling for selection interactions
- Implement scanning animation when new vocabulary is presented
- Add pronunciation waveform visualization for audio elements
- Create tactical multi-angle view of terms (meaning, usage, context)
- Implement "intelligence classification" visual system for vocabulary difficulty

**Practice Exercise Improvements**

- Create dynamic difficulty scaling visualization
- Implement "field condition" variations (time pressure, distraction elements)
- Add "tactical advantage" hints system with spy-themed visual treatment
- Create performance tracking visualization updating in real-time
- Implement responsive feedback system with contextual suggestions

**Conversation Simulation Refinements**

- Create environmental ambient effects for conversation backgrounds
- Implement character reaction animations based on response quality
- Add conversation branching visualization showing multiple paths
- Create "cover integrity" meter affected by conversation choices
- Implement typing indicator for NPC responses to create realistic timing

**Mission Challenge Enhancements**

- Create more immersive "final test" presentation with dramatic visual treatment
- Implement performance visualization showing real-time evaluation
- Add multi-part challenge flow with progressive difficulty
- Create "mission critical moment" styling for key interactions
- Implement comprehensive results summary with detailed metrics

**Mission Debrief Refinements**

- Create official report document styling with stamp and signature elements
- Implement dynamic performance breakdown with expandable sections
- Add comparison to previous mission performances
- Create visual narrative consequence system showing story impact
- Implement recommendation system with specific improvement suggestions

### Intel (Vocabulary) Screen Enhancements

**Search & Filter Enhancement**

- Create advanced filter panel styled as intelligence control console
- Implement visual filter state indicators showing active filtering
- Add predictive search with visual results preview
- Create category filter toggles with icon-based visualization
- Implement sort options with visual indicator of current sort

**Vocabulary Card Refinements**

- Create expanding card interaction with classified file styling
- Implement multi-view cards showing different aspects of vocabulary
- Add mastery visualization using security clearance visual metaphor
- Create usage context section with expandable examples
- Implement spaced repetition scheduling indicator styled as "refresh required"

**Organization Improvements**

- Create section dividers with tactical classification styling
- Implement collapsible category sections with count indicators
- Add priority flagging system with visual hierarchy
- Create recently acquired section with "new intelligence" styling
- Implement connected terms visualization showing related vocabulary

**Study Tools Enhancement**

- Create tactical training console interface for practice tools
- Implement specialized drill visualizations for different practice types
- Add streak-building incentive visualizations
- Create scheduled practice reminders styled as mission directives
- Implement mastery path visualization showing term progression

### Mission Control Dashboard Enhancements

**Mission Timeline Improvements**

- Create interactive timeline with expandable mission details
- Implement zoom controls for timeline exploration
- Add visual connection between related missions
- Create milestone markers with special visual treatment
- Implement progress prediction visualization showing projected completion

**Field Dossier Refinements**

- Create military-style skill assessment visualization
- Implement expandable skill category details
- Add comparative analysis against mission requirements
- Create "operational readiness" visualization for different skill areas
- Implement training recommendation engine with tactical priority system

**Tactical Map Enhancements**

- Create zoom and pan capabilities for map exploration
- Implement progressive unlocking visualization for new areas
- Add mission location markers with status indicators
- Create path connections showing progression routes
- Implement area-specific intelligence summaries
- Add "reconnaissance" feature revealing upcoming challenge areas

**Asset Network Refinements**

- Create interactive skill relationship visualization
- Implement node selection with detail expansion
- Add visual strength indicators for connections between skills
- Create skill gap highlighting for areas needing improvement
- Implement recommended focus path with tactical advantage indicators

### Agent Profile Screen Enhancements

**Profile Header Improvements**

- Create dynamic background based on highest achievements
- Implement animated rank insignia with level indicators
- Add decorated frame treatment based on accomplishments
- Create custom typography treatment for agent codename
- Implement dynamic agent status indicator with mission context

**Stats Card Refinements**

- Create military-style stats dashboard with tactical data presentation
- Implement expandable detail sections for each stat category
- Add historical trend visualization for progress metrics
- Create comparative analysis against similar agents (leaderboard integration)
- Implement goal tracking visualization with mission context

**Journey Progress Enhancements**

- Create episode completion visualization with narrative context
- Implement mission success rate metrics with visual feedback
- Add "critical moment" highlights from past missions
- Create narrative choice visualization showing story path
- Implement future episode teaser with classified redaction styling

**Achievement Display Refinements**

- Create tactical medal case visualization for achievements
- Implement rarity indicators with appropriate visual hierarchy
- Add unlocking animation with tactical/military ceremony styling
- Create achievement detail view with acquisition context
- Implement achievement progress tracking for in-progress items

**Settings Modal Enhancements**

- Create command console styling for settings interfaces
- Implement section organization with tactical terminology
- Add visual confirmation for setting changes
- Create custom control elements maintaining spy aesthetic
- Implement security-themed verification for important changes

## Implementation Priority Guidelines

1. **Core Navigation & Layout** - Establish fundamental app structure
2. **Global Component Library** - Build reusable elements with standardized styling
3. **HQ & Mission Flow** - Focus on the primary learning experience first
4. **Intel Management** - Develop vocabulary management system
5. **Mission Control** - Build progress tracking and visualization
6. **Agent Profile** - Implement personalization and achievement systems
7. **Settings & Auxiliary Screens** - Complete supporting functionality

## Visual Asset Requirements

### Essential Iconography

- Create custom icon set maintaining consistent style (2px stroke, geometric shapes)
- Design status indicators for various states (active, locked, completed, etc.)
- Develop rank insignias for progression visualization
- Create achievement icons with consistent styling but unique silhouettes
- Design navigation icons with active/inactive states

### Character Illustrations

- Create portrait illustrations for key NPCs (handlers, contacts, targets)
- Design consistent character style with noir influence
- Develop expression variations for conversation feedback
- Create silhouette system for unknown characters

### Environmental Elements

- Design location backdrop illustrations for mission contexts
- Create tactical map elements for geographic progression
- Develop ambient visual elements for atmosphere enhancement
- Design UI container backgrounds with appropriate thematic styling

### Animation Assets

- Create loading/processing animations with spy technology theme
- Design transition effects between screens and states
- Develop micro-interaction animations for feedback
- Create celebration/achievement unlock animations

This detailed plan provides comprehensive guidance for UI development while maintaining flexibility for implementation. The specifications focus on enhancing the spy theme, improving usability, and creating a cohesive visual language throughout the application.
