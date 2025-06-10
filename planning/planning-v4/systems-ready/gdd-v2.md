# **Dark Mallard - Game Design Document**

## **Part 1: Core Vision & Philosophy**

### Core Vision

Dark Mallard is a spy thriller where you learn French to solve a mystery in Paris. Everything else—the language learning, the social dynamics, the communication challenges—serves that story. We are not building "language learning disguised as a game." We are building a spy game that requires language competence to succeed.

### Design Principles

1. **Story Justifies Systems:** Every mechanic exists because the spy narrative demands it. You learn vocabulary because missions require it. You manage relationships because intelligence gathering requires it. You face communication pressure because undercover work requires it.
2. **Pressure Creates Learning:** Real language acquisition happens under pressure. Deposition scenes, time-critical meetings, and relationship crises create the cognitive conditions where French becomes necessary rather than optional.
3. **Choices Reveal Character:** Players discover their communication style through accumulated choices under pressure. The handlers, Sheldon and Pane, represent strategic options, not moral judgments.
4. **Consequences Feel Natural:** Failed conversations don't trigger "game over" screens—they create story complications that require different approaches. Blown relationships affect intelligence access. Poor pronunciation raises suspicion.
5. **Competence Enables Story:** As French improves, story possibilities expand. Better language skills unlock deeper relationships, more complex missions, and richer narrative branches.

### The Handler Duality as Design Organizing Principle

Sheldon (empathetic integration) vs. Pane (efficient extraction) provides a coherent framework for:

* **Language learning approaches:** Cultural immersion vs. mission-critical vocabulary.
* **Communication coaching:** Relationship building vs. boundary setting.
* **Mission planning:** Deep cover vs. rapid deployment.

### Core Tension: Competence vs. Compromise

The central narrative question is: *"To maintain your cover, how much of yourself must you compromise?"*

Every conversation is a pressure cooker where your linguistic limitations force you into morally ambiguous situations. Failure to communicate naturally leads to difficult choices.

#### The Blackmail Mechanic

This is not the default failure state, but a high-risk, high-cost tactical choice, embodying Pane's operational philosophy. When linguistic failure is imminent and your cover is about to be blown, you may have the option to use leverage against a character.

* **Activation:** Occurs when suspicion is critically high. You can choose to use pre-gathered intelligence (rumors, verified facts) to coerce an NPC.
* **Consequences:** Using blackmail permanently alters your relationship. It creates a forced asset, but generates hatred and distrust. It may also damage your reputation with other characters who observe the coercion, and it solidifies your character's path toward a more manipulative, "ends-justify-the-means" operative. This path is sustainable only through escalating pressure, contrasting with the more difficult but stable path of building genuine trust.

#### Suspicion System

Every NPC tracks suspicion levels, which increase based on:

* **Mispronunciation:** Minor to moderate increases.
* **Wrong Vocabulary/Register:** Significant increases.
* **Using Phone Assistance:** Varies based on context and NPC personality.
* **Repeated Mistakes:** Escalating penalties.

#### NPC Personality Types

* **Trusting (Café owners, hotel clerks):** Give the benefit of the doubt; high blackmail threshold.
* **Suspicious (Police, government officials):** Notice every mistake; medium blackmail threshold.
* **Paranoid (Syndicate members):** Zero tolerance for inconsistency; low blackmail threshold but extremely dangerous to leverage.

## **Part 2: The Player Experience & Mission Flow**

### Mission Architecture Overview

Every Dark Mallard mission follows a structured 5-phase flow that integrates language learning, social dynamics, and narrative progression. This structure is flexible to accommodate different session lengths.

### The 5-Phase Mission Flow

#### **Phase 1: Mission Briefing (2-3 minutes)**

* **Narrative:** Connects to previous outcomes, establishes objectives, and introduces characters and cultural challenges.
* **Pedagogy:** Key phrases and vocabulary are introduced in a mission-relevant context, modeled by the handler. This sets the stage for the audio-first learning methodology.

#### **Phase 2: Handler Training Chamber (3-12 minutes)**

* **Narrative:** The player enters an in-universe AI simulation to practice for the mission.
* **Pedagogy:** This is the core learning phase. It uses conversation deconstruction, cognate integration, and contextual drilling with a 2-3 second response pressure to build automaticity. (Detailed in Part 3c).

#### **Phase 3: Simulation Environment (0-5 minutes)**

* **Narrative:** A full mission rehearsal against AI characters with distinct personalities.
* **Pedagogy:** Applies learned vocabulary under social pressure in a safe-to-fail environment. Handler coaching is available via an "earpiece."

#### **Phase 4: Live Mission (5-20 minutes)**

* **Narrative:** The player undertakes the mission in the live game world.
* **Gameplay:** This phase integrates the Social Dynamics and Dialogue systems. Communication competence directly affects story outcomes, relationship development, and intelligence gathered. Emergency support is available at a cost to cover integrity.

#### **Phase 5: Mission Debrief (2-3 minutes)**

* **Narrative:** The handler reviews the player's performance and discusses the consequences of their actions.
* **Pedagogy:** Reinforces learning. The system identifies vocabulary gaps, assesses pronunciation and cultural appropriateness, and schedules forgotten terms for future spaced repetition.

### Session Length Optimization (Adapting the Flow)

The game is designed to respect player time and provide meaningful progress in any session length.

* **10-Minute Quick Session:** Focuses on maintaining momentum. Typically consists of **Phase 2 (Training Chamber)** activities like vocabulary drilling or an "Agent Assistance" call (see Part 3c), followed by a brief **Phase 1 (Briefing)** for the next mission.
* **20-Minute Standard Session:** The primary experience. The player goes through a complete, slightly abbreviated 5-phase mission cycle, advancing the main story.
* **Extended Session (30+ minutes):** Allows for deep story immersion. May involve multiple connected missions, complex social dynamics across several characters, and major story revelations.

The system features flexible stopping points and smart entry suggestions to seamlessly guide the player into an appropriate-length experience.

## **Part 3: Core Systems Deep Dive**

### 3a. The Dialogue System

This system enables natural conversation practice while maintaining pedagogical and narrative control.

#### System Architecture

* **ASR (Automatic Speech Recognition):** Captures player speech with confidence scoring.
* **DM (Dialogue Manager - Pipecat):** Manages real-time conversation state and flow.
* **LLM (Large Language Model):** Provides natural language understanding within defined boundaries.
* **TTS (Text-to-Speech):** Delivers high-quality, character-appropriate NPC voice lines.
* **Assessment (e.g., SpeechAce):** Provides detailed pronunciation scoring.

#### Control Mechanisms

The primary control mechanism is the **Cover Integrity System**, which naturally limits conversation scope.

* **Speaking the wrong language** or **going off-topic** raises suspicion.
* **Poor pronunciation** or **cultural insensitivity** damages credibility and relationships.
* These failures lead to natural narrative consequences (e.g., an NPC becoming wary, a mission objective becoming harder) rather than a "game over" screen.

#### Dialogue Integration in Missions

* **Briefing:** Dialogue is modeled by handlers and native speaker examples.
* **Training:** The dialogue system is used for controlled drilling and simulations with real-time feedback.
* **Live Mission:** The full system is deployed. Player intent is understood within mission constraints, and conversation flow is managed to maintain narrative coherence.
* **Emergency Support:** The player has a graduated system of help, from visual context clues (no cost) to handler earpiece coaching (minor cost) to full emergency intervention (major cost to cover integrity).

### 3b. The Social Dynamics System

Relationship quality directly correlates with story access and mission capability.

#### Core Mechanics

Players manage relationships with three distinct target types, each testing different communication skills. Relationships are measured on meters like Trust, Emotional Investment, and Suspicion.

1. **Target A: Street Contact (e.g., Café Owner)**
    * **Function:** Ground-level intelligence, cultural authentication.
    * **Vocabulary:** Informal, slang, emotional expression.
    * **Pressure:** Tests loyalty and authenticity. Values genuine connection over politeness.

2. **Target B: Professional Contact (e.g., Government Official)**
    * **Function:** Institutional intelligence, formal access.
    * **Vocabulary:** Business terminology, formal register, diplomatic language.
    * **Pressure:** Challenges competence and professional credibility.

3. **Target C: Personal Contact (e.g., Romantic Interest)**
    * **Function:** Intimate intelligence, emotional complexity.
    * **Vocabulary:** Personal stories, emotional language, relationship terms.
    * **Pressure:** Demands emotional honesty, vulnerability, and time commitment.

#### Narrative Integration & Pressure Points

Relationship development unlocks deeper story arcs. For example, building high trust with a **Street Contact** might unlock access to a community resistance meeting. Earning the respect of a **Professional Contact** might grant access to classified documents.

Conversations are filled with **Communication Pressure Points** (e.g., Guilt Manipulation, Boundary Testing) where the player's response, coached by Sheldon (empathy) or Pane (boundaries), directly impacts relationship meters and future story access. Damaging one relationship can have network effects, as characters in the world communicate with each other.

### 3c. The Language Learning & Progression System

This system is composed of two main pillars: how the player acquires new language (Acquisition) and how they retain it over time (Retention).

#### Acquisition: The Handler Training Chamber

This is the "holodeck for spies," an AI-powered simulation environment for safe, contextual practice.

* **Chamber Types:**
  * **Type 1: Conversation Deconstruction Lab:** Breaks down native conversations for pronunciation and phrase practice (backward buildup method).
  * **Type 2: Contextual Drilling Simulator:** Rapid-fire response practice under time pressure.
  * **Type 3: Social Pressure Simulation:** Practice with AI personalities who react emotionally and test cultural norms.
  * **Type 4: Mission Rehearsal Environment:** A full practice run of an upcoming mission.
* **Handler Coaching:** Sheldon's coaching focuses on cultural context and relationship building, while Pane's focuses on mission efficiency and clear communication.

#### Retention: Spaced Repetition Story Emergence

Instead of flashcards, vocabulary review is woven into the narrative at optimal learning intervals.

* **Agent Assistance Network:** The primary review mechanism. 24-48 hours after learning a new vocabulary set, the player receives a call from another agent needing help in a similar situation. By teaching the other agent (e.g., "Tell her 'Je suis en vacances'"), the player reinforces their own mastery.
* **Relationship Maintenance:** To maintain relationships with key characters, the player must consistently use their specific vocabulary domains (e.g., re-visiting the café owner requires using café vocabulary). Failure to do so can lead to relationship decay, providing a natural motivation for review.
* **Mission Callbacks:** Handlers will reference specific phrases or cultural knowledge from past missions during debriefs or future briefings, reinforcing successful application.
* **Crisis-Driven Activation:** Emergency situations (e.g., a medical incident) force the rapid recall of previously learned vocabulary under high emotional pressure, forging strong memory links.

## **Part 4: Content & Scope**

### Mission Types

Missions are the genre of a task, while Scenarios are the settings. This allows for replayability and scalable content.

#### Recommended Core 6 Mission Types

1. **Surveillance:** Focus on listening comprehension and context clues.
2. **Identity Verification:** Deduction and conversation analysis under pressure.
3. **Direct Infiltration:** Speaking under pressure to maintain a cover identity.
4. **Agent Training (Agent Assistance):** The core spaced repetition mechanic.
5. **Interrogation/Information Extraction:** High-stakes dialogue and persuasion.

This core set covers all language skills (listening, speaking, context), includes both success and failure paths, and supports the primary game loops without overwhelming production scope.

### Mission vs. Scenario

* **Mission Type:** The *kind* of task (e.g., Surveillance).
* **Mission Scenario:** The *setting* where it happens (e.g., Café, Hotel, Airport).
  * This allows a Surveillance mission to take place in a café in one mission and at a party in another, providing narrative variety while reusing the core mechanics.

## **Part 5: Appendix - Systems in Action**

This section provides concrete examples of how the systems described above integrate to create cohesive gameplay experiences.

### Example 1: Business Infiltration Mission (Standard 20-min Session)

* **Context:** Infiltrate a board meeting to identify money laundering.
* **Phase 1 (Briefing):** Pane briefs on the mission, previewing financial and business vocabulary ("projections financières," "développement urbain").
* **Phase 2 (Training Chamber):**
  * **Deconstruction:** Break down audio of a native business discussion.
  * **Drilling:** Practice responding to professional questions under time pressure.
  * **Simulation:** Interact with a simulated AI Director to test diplomatic language.
* **Phase 3 (Live Mission):**
  * **Social Dynamics:** Player must manage their existing relationship with Director Laurent while building new ones with other board members, each requiring different levels of formality.
  * **Dialogue:** The conversation is guided by the objective of finding the "anonymous investors." ASR and Cover Integrity are active.
  * **Spaced Repetition:** The Director tests the player by mentioning their known visits to a café from a previous mission, forcing the player to integrate café/neighborhood vocabulary (from Mission 2) with the business terminology (from Mission 4).
* **Phase 4 (Debrief):** Pane assesses performance, noting improved pronunciation on key terms and the successful integration of vocabulary from multiple domains. This unlocks corporate espionage missions.

### Example 2: Crisis Management (Emergency 10-min Session)

* **Context:** The café owner's son is arrested. She calls the player for help.
* **Spaced Repetition Under Pressure:** The player must instantly recall and use legal, family, and emergency vocabulary learned across several previous missions.
* **Social Dynamics:** The player's response to the crisis will permanently affect their relationship trust level with the café owner.
* **Dialogue in Crisis:** The dialogue system prioritizes emotional speech recognition. Handler coaching (from Sheldon) focuses on providing emotional support ("Use 'Je vais vous aider'").
* **Cross-System Integration:** The player must use their professional contact network (calling Director Laurent) to help their street contact, requiring them to switch registers from emotional support (with the owner) to formal request (with the Director) in real-time. Successful resolution deeply solidifies both relationships.
