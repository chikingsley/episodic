# Dark Mallard UI Development Checklist

This checklist outlines the UI development tasks based on the project's planning documents and technical specifications (Expo, NativeWind, Reanimated, react-native-reusables). Tasks are prioritized based on the `Implementation Priority Guidelines`.

## Phase 1: Core Navigation & Layout

-   [x] **Setup Expo Project:** Initialize Expo project structure.
-   [x] **Install Dependencies:** Add NativeWind, Reanimated, `react-native-reusables`, `lucide-react-native` (or chosen icon library). *(Note: Using custom icon library)*
-   [x] **Configure NativeWind:**
    -   [x] Set up `tailwind.config.js`.
    -   [x] Define core color palette in theme (`#0F1A2C`, `#991B1B`, `#A2851D`, `#065F46`, `#92400E`, `#9B1C1C`, `#1F2937`, `#111827`, `#4B5563`). *(Added dm-* colors to `tailwind.config.js -> theme.extend.colors`; CSS vars updated in `global.css`)*
    -   [x] Define typography settings (font family: "JetBrains Mono" or equivalent, sizes: 20px, 16px, 14px, 12px, weights: bold, semibold, medium, regular). *(Added font families, sizes, weights to `tailwind.config.js -> theme.extend`)*
    -   [x] Define standard line heights (1.5 body, 1.2 headers) and letter spacing (0.5px headers, 0.3px body). *(Added `lineHeight.body/heading`, `letterSpacing.body/heading` to `tailwind.config.js -> theme.extend`)*
    -   [-] Define standard opacity levels (70% modals, 40% tooltips). *(Decided against defining custom names for now; use standard utilities like `opacity-70` or `bg-black/70`)*
    -   [ ] Add custom utility classes if needed for specific styles (e.g., mechanical easing curves placeholder). *(Add to `tailwind.config.js` as needed)*
-   [x] **Integrate Font:** Load "JetBrains Mono" & "Flow Block Redacted" fonts. *(Implemented using `@expo-google-fonts` and `useFonts` hook in `_layout.tsx`. Ensure fonts work at runtime.)*
-   [x] **Setup Navigation:** Implement core app navigation structure (e.g., Tab Navigator, Stack Navigator) using React Navigation.
    -   [x] Define main screens (HQ, Mission Flow Placeholder, Intel, Mission Control, Agent Profile, Settings).
    -   [x] Style navigation elements (Tab bar, headers) according to visual design (dark theme, accent colors).
    -   [ ] Implement standard screen transition animations (slide for navigation stack) using Reanimated/React Navigation options. *(Tab navigation styling done, stack transitions TBD)*

## Phase 2: Global Component Library (`react-native-reusables` + Custom)

-   [x] **Setup Icons:**
    -   [x] Create `dm/lib/icons/iconWithClassName.ts`.
    -   [x] Create files in `dm/lib/icons/` for needed Lucide icons (e.g., `Home`, `Target`, `Map`, `User`), wrap with `iconWithClassName`, and create barrel export.
-   [ ] **Base Component Styling:** Style core `react-native-reusables` components in `dm/components/ui/` using NativeWind classes according to guidelines:
    -   [ ] `Button`: 8px radius, optional 2px border (`dm-crimson`), 12px vertical padding, base dark style, crimson accent variant(s).
    -   [ ] `Card`: 12px radius, 1px border (`colors.border` or `dm-crimson`), 16px padding, `colors.card` background, optional subtle gradient.
    -   [ ] `Input`: `dm-neutral-dark` background, `colors.foreground` text, `dm-crimson` accent on focus, 12px padding.
    -   [ ] `Progress`: 4px height, rounded ends, `dm-crimson` or `dm-gold` fill, implement animated fill (Reanimated, 300ms).
    -   [ ] `Switch`: Custom style resembling security switches (red/green indicators using `dm-danger`/`dm-success`).
    -   [ ] `Text`: Ensure default uses `font-mono` and correct base sizes (`text-base`, `text-sm`).
    -   [ ] `Dialog`: Style content area (likely uses `Card` styling), ensure overlay uses standard opacity (`bg-background/70` or similar).
    -   [ ] `Tooltip`: Style with dark background (`dm-neutral-dark` or `dm-neutral-light`), ensure overlay uses standard opacity (`bg-background/40` or similar).
-   [ ] **Custom Global Components:**
    -   [ ] Create `dm/components/Header.tsx`: Basic structure, apply header typography rules.
    -   [ ] Create `dm/components/StatusIndicator.tsx`: Basic structure, define variants (dot, ribbon), apply functional colors.
    -   [ ] Create `dm/components/LoadingAnimation.tsx`: Basic structure, placeholder, plan Reanimated integration (scanning/decryption theme).
-   [ ] **Interaction States:**
    -   [ ] Define and apply standard hover/press states for interactive elements (`Button`, `Switch`, etc.): subtle glow (`shadow-dm-crimson`?), inset shadow + scale. Use Reanimated for press animations.

## Phase 3: HQ & Mission Flow Screens

-   [ ] **HQ (Home) Screen:**
    -   [ ] **Layout:** Build basic HQ screen structure.
    -   [ ] **Header:** Implement header section with specific enhancements:
        -   [ ] Agent Codename/Title (correct typography).
        -   [ ] Classified document stamp overlay (subtle image/style).
        -   [ ] Dynamic day/night cycle indicator (logic + UI).
        -   [ ] Animated connection status indicator ("secure link") (Reanimated).
        -   [ ] Subtle scan line effect on header text (Reanimated).
    -   [ ] **Agent Status Panel:**
        -   [ ] Replace mock's circular progress with horizontal tactical gauge.
        -   [ ] Implement animated glow effect on status indicators (Reanimated).
        -   [ ] Implement dynamic background shift based on mission status (logic + style).
        -   [ ] Add detailed stats visualization (military style).
        -   [ ] Implement "operational readiness" metric display.
    -   [ ] **Mission Card Component:**
        -   [ ] Create `MissionCard` component (dossier style, specs from `visual-design.md` & `instructions.md`).
        -   [ ] Use styled `Card` base from `react-native-reusables`.
        -   [ ] Header (monospace), Status Indicator, Description, Metadata (XP, time, difficulty), Action Button.
        -   [ ] Implement folding/unfolding animation on select (Reanimated).
        -   [ ] Add parallax effect on scroll (Reanimated).
        -   [ ] Implement "classified" watermark overlay (fade on activation).
        -   [ ] Add mission timer/countdown visualization.
        -   [ ] Add mission difficulty indicator (tactical terms).
        -   [ ] Add mission status ribbon.
    -   [ ] **Mission List:** Display Mission Cards (likely in a ScrollView/FlatList).
    -   [ ] **Quick Actions Section:**
        -   [ ] Redesign as tactical command console (styled buttons).
        -   [ ] Implement "power-up" visual effect on button press (Reanimated).
        -   [ ] Add subtle pulse animation to primary action (Reanimated).
        -   [ ] Implement swipe for more actions (Gesture Handler + Reanimated).
        -   [ ] Visual connection to mission objectives (requires data linking).
    -   [ ] **Intelligence Briefing Section:**
        -   [ ] Redesign as incoming transmission visual style.
        -   [ ] Implement subtle decryption animation on load (Reanimated).
        -   [ ] Create collapsible view for intel items.
        -   [ ] Implement priority classification visualization (colors/icons).
        -   [ ] Add interaction to save intel to dossier (state management).
-   [ ] **Mission Flow Screens:**
    -   [ ] **Mission Briefing Screen:**
        -   [ ] Decryption animation for text reveal (Reanimated).
        -   [ ] Dynamic typing effect for key sections (Reanimated).
        -   [ ] Collapsible sections (details, objectives, rewards).
        -   [ ] Interactive map element placeholder (MapView integration).
        -   [ ] Dossier-style tabs for info categories (Tab View component).
        -   [ ] Signature section.
    -   [ ] **Vocabulary Drill Screen:**
        -   [ ] Weapon targeting interface styling for selection.
        -   [ ] Scanning animation for new vocab presentation (Reanimated).
        -   [ ] Pronunciation waveform visualization (requires audio processing/library).
        -   [ ] Tactical multi-angle view component for terms.
        -   [ ] "Intelligence classification" visual system.
    -   [ ] **Practice Exercise Screen:**
        -   [ ] Dynamic difficulty scaling visualization.
        -   [ ] "Field condition" variations UI elements (timer, distractions).
        -   [ ] "Tactical advantage" hints system UI.
        -   [ ] Real-time performance tracking visualization.
        -   [ ] Responsive feedback system UI (e.g., styled toasts/modals).
    -   [ ] **Conversation Simulation Screen:**
        -   [ ] Environmental ambient background effects (animated/static).
        -   [ ] Character reaction animations placeholder (requires character assets).
        -   [ ] Conversation branching visualization component.
        -   [ ] "Cover integrity" meter component.
        -   [ ] Typing indicator for NPC responses (Reanimated).
    -   [ ] **Mission Challenge Screen:**
        -   [ ] Immersive "final test" presentation styling.
        -   [ ] Real-time performance visualization.
        -   [ ] Multi-part challenge flow UI (e.g., stepper).
        -   [ ] "Mission critical moment" styling for key interactions.
        -   [ ] Comprehensive results summary component.
    -   [ ] **Mission Debrief Screen:**
        -   [ ] Official report document styling (borders, stamps, fonts).
        -   [ ] Dynamic performance breakdown component (expandable).
        -   [ ] Comparison visualization (vs. previous missions).
        -   [ ] Visual narrative consequence display.
        -   [ ] Recommendation system UI.

## Phase 4: Intel (Vocabulary) Management Screen

-   [ ] **Layout:** Build basic Intel screen structure.
-   [ ] **Search & Filter Panel:**
    -   [ ] Style as intelligence control console.
    -   [ ] Implement visual filter state indicators.
    -   [ ] Implement predictive search input with results preview.
    -   [ ] Create category filter toggles (icon-based).
    -   [ ] Implement sort options UI with visual indicator.
-   [ ] **Vocabulary Card Component (`IntelItemCard`):**
    -   [ ] Based on `visual-design.md` definition.
    -   [ ] Create expanding interaction (Reanimated, classified file style).
    -   [ ] Implement multi-view display (different aspects of vocab).
    -   [ ] Add mastery visualization (security clearance metaphor).
    -   [ ] Add usage context section (expandable examples).
    -   [ ] Implement SR scheduling indicator ("refresh required" style).
-   [ ] **Vocabulary List/Grid:** Display `IntelItemCard` components.
-   [ ] **Organization Elements:**
    -   [ ] Create section dividers (tactical classification style).
    -   [ ] Implement collapsible category sections (with counts).
    -   [ ] Implement priority flagging system UI.
    -   [ ] Create "Recently Acquired" section styling.
    -   [ ] Implement connected terms visualization placeholder (graph library?).
-   [ ] **Study Tools Section:**
    -   [ ] Tactical training console interface styling.
    -   [ ] Specialized drill visualization placeholders.
    -   [ ] Streak-building incentive visualizations.
    -   [ ] Scheduled practice reminder UI (mission directive style).
    -   [ ] Mastery path visualization component.

## Phase 5: Mission Control Dashboard Screen

-   [ ] **Layout:** Build basic Mission Control screen structure (potentially Tabbed).
-   [ ] **Mission Timeline Section:**
    -   [ ] Create interactive timeline component (scrollable, zoomable - Gesture Handler/Reanimated).
    -   [ ] Implement expandable mission details on timeline nodes.
    -   [ ] Add visual connections between related missions.
    -   [ ] Create milestone marker styling.
    -   [ ] Implement progress prediction visualization.
-   [ ] **Field Dossier Section:**
    -   [ ] Military-style skill assessment visualization component.
    -   [ ] Implement expandable skill category details.
    -   [ ] Add comparative analysis visualization (vs. requirements).
    -   [ ] Create "operational readiness" visualization per skill area.
    -   [ ] Implement training recommendation UI.
-   [ ] **Tactical Map Section:**
    -   [ ] Integrate MapView or create custom map component.
    -   [ ] Implement zoom/pan capabilities.
    -   [ ] Implement progressive unlocking visualization (area masking/styling).
    -   [ ] Add mission location markers with status indicators.
    -   [ ] Create path connection visualizations.
    -   [ ] Implement area-specific intelligence summary UI.
    -   [ ] Add "reconnaissance" feature UI.
-   [ ] **Asset Network Section:**
    -   [ ] Create interactive skill relationship visualization (graph library or custom Reanimated).
    -   [ ] Implement node selection with detail expansion.
    -   [ ] Add visual strength indicators for connections.
    -   [ ] Create skill gap highlighting.
    -   [ ] Implement recommended focus path visualization.

## Phase 6: Agent Profile Screen

-   [ ] **Layout:** Build basic Agent Profile screen structure.
-   [ ] **Profile Header:**
    -   [ ] Implement dynamic background based on achievements.
    -   [ ] Create animated rank insignia component (Reanimated).
    -   [ ] Add decorated frame treatment.
    -   [ ] Apply custom typography for agent codename.
    -   [ ] Implement dynamic agent status indicator.
-   [ ] **Stats Card Section:**
    -   [ ] Create military-style stats dashboard component.
    -   [ ] Implement expandable detail sections.
    -   [ ] Add historical trend visualization (charting library?).
    -   [ ] Implement comparative analysis visualization.
    -   [ ] Implement goal tracking visualization.
-   [ ] **Journey Progress Section:**
    -   [ ] Create episode completion visualization component.
    -   [ ] Implement mission success rate metrics display.
    -   [ ] Add "critical moment" highlights display.
    -   [ ] Create narrative choice visualization component.
    -   [ ] Implement future episode teaser UI (redaction style).
-   [ ] **Achievement Display Section:**
    -   [ ] Create tactical medal case visualization component.
    -   [ ] Implement rarity indicators styling.
    -   [ ] Add unlocking animation (Reanimated, military ceremony style).
    -   [ ] Create achievement detail view (Modal?).
    -   [ ] Implement achievement progress tracking UI.

## Phase 7: Settings & Auxiliary Screens

-   [ ] **Settings Modal/Screen:**
    -   [ ] Style using command console theme.
    -   [ ] Organize into sections (tactical terminology).
    -   [ ] Add visual confirmation for changes.
    -   [ ] Create custom control elements (sliders, toggles) maintaining spy aesthetic.
    -   [ ] Implement security-themed verification UI for critical changes.
-   [ ] **Other Auxiliary Screens:** (Login, Signup, Onboarding if applicable)
    -   [ ] Apply global styling and theme consistently.

## Visual Asset Requirements (Parallel Task)

-   [ ] **Iconography:**
    -   [ ] Create/Source custom icon set (2px stroke, geometric, tactical theme).
    -   [ ] Ensure consistency with `visual-design.md` examples.
    -   [ ] Design status indicators (dots, ribbons).
    -   [ ] Design rank insignias.
    -   [ ] Design achievement icons (unique silhouettes).
    -   [ ] Design navigation icons (active/inactive states).
-   [ ] **Illustrations:**
    -   [ ] Create character portraits (noir style, expressions, silhouettes).
    -   [ ] Design environment/location backdrops.
    -   [ ] Create tactical map elements (markers, paths, area styles).
    -   [ ] Design UI container backgrounds/textures.
-   [ ] **Animation Assets:**
    -   [ ] Prepare assets for loading animations (e.g., Lottie files).
    -   [ ] Define specifics for transition effects.
    -   [ ] Define specifics for micro-interaction animations.
    -   [ ] Define specifics for celebration/unlock animations.

## Cross-Cutting Concerns

-   [ ] **Accessibility:** Ensure adequate color contrast, support for screen readers, touch target sizes.
-   [ ] **Performance:** Monitor performance, especially with animations (Reanimated) and complex visualizations. Optimize lists (FlatList). Use `React.memo` where appropriate.
-   [ ] **State Management:** Integrate UI components with the chosen state management solution.
-   [ ] **Responsiveness:** Ensure layout adapts reasonably to different screen sizes (using NativeWind's responsive modifiers).
-   [ ] **Testing:** Plan for unit/integration testing of components. 