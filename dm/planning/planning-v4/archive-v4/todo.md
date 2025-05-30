# Three Trees Platform: Master To-Do List & Roadmap

This document outlines the phased development plan for the Three Trees platform, consolidating previous plans and incorporating latest requirements. It follows the user's preferred checklist style.

## Core Philosophy & Overarching Goals

* Ease of Use: Simple, intuitive interfaces for clients, referral sources, and admins.
* Efficiency: Streamline current manual processes.
* Data Integrity & Security: Robust backend and payment handling.
* Scalability: Build a system that can grow.
* Professionalism: A polished platform.

---

## Phase 1: MVP Go-Live & Core Admin Functionality

**Goal:** Launch a functional online enrollment form with payment processing and establish the foundational backend for client and class management. Replace current manual enrollment and payment intake.

* [x] 1. Set up development environment
  * [x] Install NodeJS and necessary development tools
  * [x] Create GitHub repository for version control
  * [x] Set up local environment variables
* [x] 2. Initialize Payload CMS project
  * [x] `npx create-payload-app` to bootstrap project
  * [x] Configure database (Supabase/PostgreSQL)
  * [x] Set up initial admin user
* [x] 3. Set up NextJS application
  * [x] NextJS app scaffolded and running
  * [x] `globals.css` theme and section divider established
* [x] 4. Install and configure core libraries
  * [x] ShadCN UI installed
  * [x] Framer Motion installed
  * [x] Zod installed
  * [x] React Hook Form installed
* [x] 5. Build and launch Home Page
  * [x] Home page (`/`) created and ready for launch
  * [x] Navbar component
  * [x] Hero section
  * [x] Trust indicators
  * [x] Why Choose Us section
  * [x] Three Trees Approach section
  * [x] Programs at a Glance section
  * [x] Enrollment Timeline (How it Works) section
  * [x] Testimonials section
  * [x] Footer
* [x] 6. Abstract and implement reusable enrollment form steps/components
  * [x] Abstracted all enrollment steps: Welcome, Personal Info, Scheduling, Payment, Consent Form, Success
  * [x] Abstracted Session Header
  * [x] Abstracted StepHeader, StepAnimationWrapper
  * [x] Conditional logic for "Other" fields in dropdowns (County, Referral Source) - partially implemented; "Other" fields always visible, UX enhanced.
  * [x] Mobile-first styling and responsive cleanup
  * [x] Scheduling UI updated for new class data structure (fetches live `/api/classes`, filters, shows availability)
  * [x] Payment Step UI updated for Square SDK placeholder and recurring payment consent
  * [x] Consent checkbox layout fixed, validation message moved.
* [ ] 7. UI/UX Fixes for Enrollment Form (Pre-Go-Live Polish)
  * [x] **Layout & Spacing Foundation**
    * [x] Add logo (icon only, no text) to welcome page above welcome text
    * [ ] Fix overall page spacing (especially mobile Safari)
    * [ ] Implement wider container for desktop view (current `max-w-md` is too narrow)
    * [ ] Create distinct desktop and mobile layouts
    * [ ] Ensure pages span full height on desktop
    * [ ] Always scroll to top when navigating between steps
  * [x] **Consent Form Page Fixes**
    * [x] Fix "Electronic Signature" label spacing to match input field spacing
    * [x] Add white background to "I have read and agreed" checkbox area (currently blends into background)
    * [ ] Ensure consistent padding/spacing across all form elements
  * [x] **Scheduling Page Overhaul**
    * [x] Complete UI redesign to match rest of form styling
    * [x] Use consistent card/input styling from other steps
    * [x] Improve mobile layout and spacing
  * [ ] **Payment Page Fixes**
    * [x] Change all payment option cards to white background by default
    * [x] Fix "I understand this is a recurring charge" checkbox so it doesn't affect other element spacing
    * [ ] Make payment icons readable (better contrast)
    * [x] Reorganize program cost display:
      * [x] Enrollment fee first
      * [x] Per session cost
      * [x] Number of sessions
      * [x] Total cost
      * [x] Add note: "* Only enrollment fee due today"
    * [ ] Fix extra spacing at bottom of card input (remove "Enter your card number" label or adjust)
    * [ ] Reduce excessive divs around card element
    * [ ] Remove "Continue" button, keep only "Pay $X.XX" button
    * [ ] Fix "Loading payment form..." that sometimes hangs (add timeout/retry mechanism)
    * [ ] Verify payment form loading as part of final payment validation
  * [ ] **Program Info Page Fixes**
    * [x] Only show "Other County" field when "Other" is selected
    * [x] Only show "Other Referral Source" field when "Other" is selected
  * [ ] **Navigation & Flow Issues**
    * [ ] Prevent going back after payment is complete
    * [ ] Make "Go to your dashboard" redirect to home page
    * [ ] Remove button disabling - let users click to see validation errors
  * [ ] **Success Page**
    * [ ] Make enrollment complete page responsive
  * [ ] **General Polish**
    * [ ] Review and fix all responsive breakpoints
    * [ ] Ensure consistent theming across all components
    * [ ] Test on actual mobile devices (not just browser dev tools)
* [ ] 8. Desktop View: Review and adapt the enrollment form for a polished desktop experience
  * Consider how `max-w-md` behaves
  * Evaluate if wider layouts/adjustments are needed for desktop form usability
* [x] 9. Digital Signature for Consent Form
  * [x] Research and implement MVP digital signature method (typed name affirmation implemented with validation against client's name, alongside checkbox).
  * [x] **Decision:** For "go-live next week," simplest acceptable is checkbox affirming "I have read and agree..." with form data submission logged as proof of consent (Typed signature now implemented as MVP)
  * [x] **Storage:** PDF prototype page created using react-pdf; `MyDocument` separated; need to finish typing fixes. (Placeholder for now, actual storage of signed PDF TBD)
* [x] 10. Backend - Initial Setup (Payload CMS with Supabase/PostgreSQL Backend)
  * [x] Payload CMS project initialized.
  * [x] Initial admin user for Payload set up.
  * [x] Define Payload Collections (mapping to Supabase Tables) for MVP:
    * [x] `Clients` (updated with `class` relationship, `tags` commented out)
    * [x] `Programs` (updated with `spotsPerClass`)
    * [x] `Classes` (renamed from `ClassSlots`, new fields, virtual fields with hooks)
    * [ ] `Payments` (schema defined, integration pending)
    * [x] `Enrollments` (obsolete; client-class link refactored - DELETED)
    * [x] `Counties` (new collection, seed script added)
    * [x] `ReferralSourceTypes` (new collection, seed script added)
    * [x] `ReferralSources` (updated for new structure, seed script needed)
  * [x] **Decision** Data Migration: No bulk migration for MVP. Seed scripts for core data created.
  * [x] API for Enrollment Form Submission (`/api/enroll` - NextJS API Route):
    * [x] Validate incoming `EnrollmentFormData` (phased validation implemented with JWT for session; final step includes full Zod schema validation; client-side validation for steps also enhanced)
    * [x] Create/Update `Client` record (via Payload, targeting Supabase)
    * [ ] Handle payment processing via Square (see below).
    * [ ] Store digital consent link/data (PDF generation in progress, storage TBD).
    * [x] Create `Enrollment` record. (Obsolete - client/class link refactored to direct relationships in Clients and Classes collections)
    * [ ] Send confirmation email (client & admin).
    * [x] Implement error handling (basic API error handling on frontend; JWT error handling on backend; client-side error display for Zod also improved. Extensive logging added and fixed).
    * [x] (Future Enhancement Idea) Consider refactor to save form data incrementally per step for abandonment recovery and analytics. (Implemented with phased submission API and JWT-based enrollment session. Token expiry issue noted, interim solution: lengthen expiry & localStorage, long-term: cookie session).
* [ ] 11. Payments - Square Integration (MVP)
  * **Frontend (`PaymentStep.tsx`):**
    * [ ] Integrate Square Web Payments SDK into `#card-container`.
    * [ ] On "Pay" button click: Validate RHF step, then `card.tokenize()`.
    * [ ] Send `cardNonce` and RHF form data to `/api/enroll`.
  * **Backend (`/api/enroll` using Square NodeJS SDK):**
    * [ ] Use Square NodeJS SDK.
    * [ ] One-Time Payments ("Prepay All Sessions"): Create Square charge using `cardNonce`. Record in `Payments`.
    * [ ] Recurring Payments ("Pay Per Session"):
      * [ ] 1. Charge Enrollment Fee (one-time charge with `cardNonce`). Record in `Payments`.
      * [ ] 2. Create Square `Customer`.
      * [ ] 3. Create `Card on File` for Square Customer (using `cardNonce`).
      * [ ] 4. Subscribe Square Customer to pre-defined weekly plan (from Square Dashboard).
      * [ ] 5. Store Square Customer ID & Subscription ID with `Client`.
    * [ ] Securely manage Square Access Token.
* [ ] 12. Phase 1 Completion - Client Portal (Manage Payments - Basic)
  * [ ] Authentication: Basic client login (Payload Auth, custom frontend, no Payload Admin UI access).
  * [ ] Functionality: View subscription status, update card on file (Square SDK), view payment history (from Payload/Supabase).
* [ ] 13. Phase 1 Completion - Admin - Basic Client & Class Management View (Payload CMS)
  * [ ] View client list & details.
  * [ ] View class rosters: For each `ClassSlot`, list enrolled clients and show spots filled / total spots.
  * [ ] Manually update client status.
* [x] 14. Data & Type Consistency Cleanup
  * [ ] Refactor frontend `form-types.ts` to use Payload-generated types from `payload-types.ts` instead of manually maintained interfaces.
  * [ ] Auto-generate reusable Zod schemas from the Payload type definitions (e.g. with `zod-to-ts` or `json-schema-to-zod`) so backend and frontend validation stay in sync.
* [x] 15. Referral Source UX & Association
  * [x] Implement dependent selects in the Program Info step: County ➜ Referral Source Type. (Backend logic for lookup and persistence of county, referral source type, and specific referral source is complete. Frontend dynamically fetches Counties, then filters Referral Source Types based on selected County. "Other" field handling is in place.)
  * [x] Persist the chosen `referralSourceType` & `referralSource` (or `referralSourceOther`) on the `Client` record during the `/api/enroll` `programInfo` phase. (Verified complete)
  * [x] Add `referralSourceType` field to the `Clients` collection for easier analytics & filtering. (Verified complete)
  * [ ] Verify that referral-source data is surfaced in admin list views and can be filtered/exported for weekly partner reports.
* [x] 16. Attendance MVP
  * [x] Create `attendance-records` collection: `date`, `class`, `client`, `status` (Present / Absent Excused / Absent Unexcused), `notes`.
  * [ ] Simple Admin UI: Allow facilitators/admins to mark attendance for the latest class session.
  * [ ] Hooks/cron to aggregate totals onto the `Client` document (`totalAbsences`, `consecutiveAbsences`, `attendanceStatus`).
  * [ ] Implement placeholder business-rules constants (⚠️ 3 consecutive or 5 total absences = Termination Considered) to drive automated status changes & letter generation later.
  * [ ] Class Roster UI: Enhanced view of spots filled/total.
  * [x] **Admin UI Enhancements:** Improve usability of the 'Classes' list view with comprehensive sorting and filtering options (e.g., by program, day, time, availability, active status). Consider limitations and solutions for virtual fields. (Task added for Phase 2, virtual field validation hooks implemented as a preliminary step).

## Phase 2: Full Site Buildout & Enhanced Admin Tools

**Goal:** Develop the full informational website with Payload-managed content, create a robust reusable component library, implement SEO, and add admin document generation and attendance tracking.

* [ ] 6. Website Content Pages & Payload Integration
  * (Site Architecture from `DEVELOPMENT_PLAN.md`)
  * **Marketing Pages:**
    * [ ] Homepage (`/`)
    * [ ] About Us (`/about`)
    * [ ] Contact (`/contact`)
    * [ ] Method (`/about/method`)
    * [ ] Presence Overview (`/about/presence`)
  * **Program Structure Pages:**
    * [ ] Overview Pages (Court-Ordered, College & University, Corporate & Hospital)
    * [ ] Service Pages (Templates for DV, Anger Management, etc.)
  * **Geographic Presence Pages:**
    * [ ] Initial: State-level (e.g., `/locations/california`)
    * [ ] Future: County, City structure.
  * **Blog System:**
    * [ ] Main blog page (`/blog`)
    * [ ] Category pages
    * [ ] Individual posts
  * **Payload Collections for Content:**
    * [ ] `Pages` (generic pages with flexible block-based content).
    * [ ] `Posts`, `Categories`, `Authors` (for blog).
    * [ ] `Locations` (for geographic presence).
    * [ ] `Testimonials`.
    * [ ] Reusable content `Blocks` (Hero, CTA, Text sections, Image galleries etc.).
* [ ] 7. Reusable Component Library
  * [ ] Develop organized library in `/components` based on existing landing page design/style guide.
  * [ ] Components for: Heroes, Cards, CTAs, Navigations, Footers, etc.
  * [ ] Ensure mobile-first, desktop consistency.
* [ ] 8. SEO Implementation
  * [ ] Semantic HTML, meta tags, Open Graph, structured data.
  * [ ] Sitemap generation.
  * [ ] NextJS SEO features.
* [ ] 9. Backend - Document Generation (Admin Triggered)
  * **Templates (from `docs/doc-gen` contents):**
    * [ ] Completion Certificate
    * [ ] Progress Update
    * [ ] Termination Considered Letter
    * [ ] Termination Letter
    * [ ] Failure to Start Letter
    * [ ] Reminder of Payment
  * [ ] **Mechanism:** Choose templating engine (HTML-to-PDF).
  * [ ] **Storage:** Store generated PDFs (S3 via Supabase Storage or Payload Storage) linked to `Client`.
  * [ ] **Payload UI:** Interface for admins to trigger document generation.
* [ ] 10. Enhanced Class Management (Admin - Payload/Custom UI)
  * **Attendance Tracking (Initial Digital):**
    * [ ] Interface for Admin/Facilitator to mark attendance per class session.
    * [ ] Store attendance records (Present, Absent Excused/Unexcused) in Payload/Supabase.
  * [ ] Client Progress View (Admin): Detailed view (classes completed/remaining, absences, payments).
  * [ ] Class Roster UI: Enhanced view of spots filled/total.
  * [ ] **Admin UI Enhancements:** Improve usability of the 'Classes' list view with comprehensive sorting and filtering options (e.g., by program, day, time, availability, active status). Consider limitations and solutions for virtual fields.

## Phase 3: Portal Expansion & Facilitator Tools

**Goal:** Enhance client portal, introduce a referral source portal, and provide tools for facilitators.

* [ ] 11. Client Portal Enhancements
  * [ ] View Class Schedule.
  * [ ] View Attendance Record.
  * [ ] View Progress (completed/remaining).
* [ ] 12. Referral Source Portal (MVP)
  * [ ] Authentication for referral agents.
  * [ ] Form to submit new client referrals (creates `Client` record, status "pending").
  * [ ] View status of their referred clients.
  * [ ] Access simplified progress updates.
  * [ ] **Payload:** `Clients` link to `ReferralSource` (new collection), `ReferralSources` collection.
* [ ] 13. Facilitator Portal/Dash (MVP)
  * [ ] Authentication for facilitators.
  * [ ] View assigned class schedules & rosters.
  * [ ] (Potentially) Input attendance.
  * [ ] View hours/classes taught.
  * [ ] **Payload:** `Facilitators` collection, links to `ClassSlots`.
* [x] 3. Define core collection schemas (Initial thoughts, refined in Phase 1 & 2 Payload Collections)
  * [x] Program types (court-ordered, college, corporate)
  * [x] Services
  * [x] Locations
  * [x] Blog posts
  * [x] Testimonials
  * [x] Clients (schema updated)
  * [x] Programs (schema updated)
  * [x] Classes (renamed from ClassSlots, schema updated)
  * [x] Counties (new)
  * [x] ReferralSourceTypes (new)
  * [x] ReferralSources (schema updated)
* [ ] 4. Configure user roles and permissions (Broader item, part of Cross-Cutting & specific portals)
  * [x] Admin users
  * [ ] Staff/facilitators (Phase 3)
  * [ ] Clients (Phase 1 Portal)
  * [ ] Referral agencies/partners (Phase 3)
* [x] 11. Develop enrollment workflow (Current focus - Phase 1 Frontend/Backend - Phased submission with JWT implemented, extensive backend refactoring, data model changes, frontend updates for scheduling and consent)
* [ ] 12. Create client dashboard (Phase 1 Client Portal, Enhanced in Phase 3)
* [ ] 13. Build facilitator interface (Phase 3 Facilitator Portal)

## Phase 4: Advanced Features & Platform Maturity

**Goal:** Integrate live video classes and further automate processes.

* [ ] 14. Live Video Class Integration (Google Meet API / Daily.co)
  * [ ] Client portal access to live sessions.
  * [ ] Authentication for joining.
  * [ ] (Partial) Auto-attendance via API events.
  * [ ] Facilitator tools for session management.
* [ ] 15. Automated Notifications & Reminders
  * [ ] Email/SMS for classes, payments, milestones.
* [ ] 16. Advanced Reporting & Analytics (Admin)
  * [ ] Dashboards for key metrics.

## Phase X: Original `todo.md` Items Review

(Mapping items from your initial `todo.md` for context and to ensure coverage. Many are integrated above. Styling adheres to the `- [ ] Task` format.)

* [x] 1. Set up development environment
  * [x] Install NodeJS and necessary development tools
  * [x] Create GitHub repository for version control
  * [x] Set up local environment variables
* [x] 2. Initialize Payload CMS project
  * [x] `npx create-payload-app` to bootstrap project
  * [x] Configure MongoDB connection (Note: Decision is Supabase/Postgres, task is now Payload-Supabase integration)
  * [x] Set up initial admin user
* [x] 3. Define core collection schemas (Initial thoughts, refined in Phase 1 & 2 Payload Collections)
  * [x] Program types (court-ordered, college, corporate)
  * [x] Services
  * [x] Locations
  * [x] Blog posts
  * [x] Testimonials
* [ ] 4. Configure user roles and permissions (Broader item, part of Cross-Cutting & specific portals)
  * [x] Admin users
  * [ ] Staff/facilitators (Phase 3)
  * [ ] Clients (Phase 1 Portal)
  * [ ] Referral agencies/partners (Phase 3)
* [ ] 5. Define Payload Blocks & Adapt Components (Covered in Phase 2 - Website Content Pages)
* [ ] 6. Build Initial Page Content in Payload (Covered in Phase 2 - Website Content Pages)
* [ ] 7. Set up media management (Part of Payload setup and S3/Supabase Storage for docs)
* [ ] 8. Create class and attendance system (Covered in Phase 1 Admin & Phase 2 Enhanced)
* [ ] 9. Implement reporting system (Basic in Phase 1/2 Admin, Advanced in Phase 4)
* [ ] 10. Build document management (Covered in Phase 2 Document Generation)
* [ ] 11. Develop enrollment workflow (Current focus - Phase 1 Frontend/Backend)
* [ ] 12. Create client dashboard (Phase 1 Client Portal, Enhanced in Phase 3)
* [ ] 13. Build facilitator interface (Phase 3 Facilitator Portal)
* [ ] 14. Set up payment processing (Phase 1 Payments - Square, your list had Polar.sh/Stripe)
* [ ] 15. Implement video conferencing (Phase 4)
* [ ] 16. Configure email functionality (Phase 1 for enrollment, Phase 4 for automated notifications)
* [ ] 17. Set up NextJS frontend (This is the current app `three-trees-web`)
* [ ] 18. Build interactive components (General, covered by specific features)
* [ ] 19. Implement SEO and analytics (Phase 2 SEO, Phase 4 Advanced Reporting)
* [ ] 20. Comprehensive testing (Ongoing, major focus before each phase completion/go-live)
* [ ] 21. Deploy to production (Cross-Cutting Concern, then specific go-live actions)
* [ ] 22. Launch and monitoring (Post Phase 1 MVP launch, then ongoing)
* [ ] 23. Training and documentation (Post-launch activity)
* [ ] 24. Optimization and improvements (Ongoing post-launch)
* [ ] 25. Complete user roles and permissions (Refinement in later phases)

---

## Cross-Cutting Concerns & Decisions

(To be revisited continuously)

* [ ] Database Strategy:
  * **Decision:** Supabase (PostgreSQL) as primary database. Payload CMS as admin panel/Headless CMS layer.
  * **TODO:** Define specific strategy/tooling for Payload to interface with Supabase tables.
* [ ] Email Service: Choose and integrate (e.g., Resend, SendGrid, AWS SES).
* [ ] Error Monitoring & Logging: Set up (e.g., Sentry, LogRocket).
* [ ] Deployment: Vercel (NextJS frontend), Payload hosting (Payload Cloud, self-host?), Supabase hosting.
* [ ] User Roles & Permissions (Payload & Custom Logic): Detailed definition for Admin, Client, Referral Agent, Facilitator.

---

## Questions for Clarification

(Summary of Decisions Made & Open Items)

1. **Payload & Supabase Strategy:** **Decision:** Supabase (PostgreSQL) is the primary database. Payload CMS interfaces with it. **Open:** How exactly will Payload read/write to Supabase tables (custom adapters, hooks)?
2. **Class Slot Granularity for Enrollment:** **Decision:** Users pick a general time block. Admins handle internal splitting.
3. **Square Subscription Plans:** **Decision:** Pre-define in Square Dashboard for MVP.
4. **Enrollment Fee for "Pay Per Session":** **Decision:** Charge as a separate one-time fee before subscription starts.
5. **Digital Signature - MVP Approach:** **Decision:** Typed name affirmation and checkbox implemented. PDF generation prototype for consent document exists. **Open:** Finalize PDF styling, typing, and storage mechanism.
6. **Admin Data for Class Load (MVP):** **Decision:** "Spots filled / total spots" per class slot + list of names. Virtual fields `spotsTotal` and `spotsAvailable` added to `Classes` collection with `beforeChange` hooks for correct calculation.
7. **Document Storage (Consent Form, Future Docs):** **Decision:** S3-compatible storage (e.g., Supabase Storage), with Payload storing links. **Open:** Does Payload's file handling with S3 adapter suffice, or is direct API interaction with Supabase Storage preferred? PDF generation prototype uses `react-pdf`.
8. **Operational Detail - "General Pool" for Classes:** If multiple `ClassSlots` map to the *same actual video call/facilitator group* and are split manually in breakout rooms:
    * [x] Does `selectedClassSlotId` point to one of these specific, capacity-limited "schedulable" instances? (Yes, `selectedClassId` now points to a specific `Class` record which has capacity defined by `Program.spotsPerClass` and `Class.numberOfParallelClasses`).
    * Client picks a specific class instance.
    * Attendance will be taken against the specific `Class` instance.
9. **JWT Session Management:** **Decision:** Implemented for phased enrollment. **Open:** Address token expiry concerns. Interim: Lengthen expiry, store in localStorage. Long-term: Cookie-based session.
