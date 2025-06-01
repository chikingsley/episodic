# Controlled Open-Ended Dialogue Architecture

The core challenge: Enable natural conversation practice while maintaining pedagogical control and narrative coherence in a language learning context.

## System Architecture

### Core Components

- Automatic Speech Recognition (ASR)
  - Push-to-talk for most interactions, continuous listening during missions
  - Word-by-word streaming for real-time visual feedback
  - On-device options: Whisper or Apple native dictation
  - Confidence scores used for conversation flow decisions
- Dialogue Manager (DM)
  - Pipecat Flows handles real-time conversation state and flow control
  - Dynamic flows enable adaptive conversations within defined boundaries
  - Integrates with LLM (Gemini 2.0 Flash) for natural language understanding
  - Manages conversation context and pedagogical objectives
- Narrative System
  - Inky handles overall story progression and consequence tracking
  - Updates based on conversation outcomes from DM
  - Maintains mission objectives and character relationships
  - Triggers narrative events based on performance metrics
- Text-to-Speech (TTS)
  - Hybrid approach: pre-recorded for critical dialogue, dynamic TTS for variations
  - Quality-controlled voice generation for consistency
  - Native-level pronunciation models
- Pronunciation Assessment
  - SpeechAce API for detailed pronunciation scoring
  - Real-time confidence metrics influence conversation flow
  - Pronunciation quality affects Cover Integrity scores
- State Management
  - LegendState handles application state with high performance
  - Manages user progress, conversation history, and game state
  - Syncs between conversation outcomes and narrative progression

## Control Mechanisms

### Cover Integrity System

Primary control mechanism that naturally limits conversation scope:

- Speaking wrong language triggers immediate suspicion
- Off-topic conversation gradually decreases cover
- Poor pronunciation affects credibility
- Natural narrative consequences for communication failures

### Conversation Boundaries

Pipecat Flows defines bounded conversation spaces:

- Expected intent categories per scenario
- Vocabulary scope appropriate to mission phase
- Natural time constraints from narrative context
- Clear objectives that guide conversation direction

### Response Handling

System responses integrate naturally with narrative:

- Off-topic detection triggers in-character reactions
- Language switching prompts contextual corrections
- Pronunciation issues addressed through story elements
- Failure states lead to narrative consequences, not error messages

## Voice Content Strategy

### Pre-recorded Approach

- Full dialogue trees with professional voice actors
- Guaranteed quality and emotional consistency
- Higher production cost but complete control
- Best for critical story moments

### Dynamic TTS Approach

- Pipecat Flows enables flexible conversation paths
- Validated TTS models for consistent quality
- Allows for more open-ended interactions
- Requires robust flow definitions to maintain quality

## Progressive Disclosure

Natural progression through:

- Mission complexity increases vocabulary scope
- Successful conversations unlock advanced scenarios
- Character relationships evolve based on communication quality
- New conversation types introduced as player demonstrates mastery

## Implementation Approaches

### Controlled Narrative (Initial approach)

- Tightly scripted conversation flows
- Limited but high-quality interaction paths
- Focus on core learning objectives
- Easier to ensure pedagogical effectiveness

### Guided Flexibility (Target state)

- Pipecat dynamic flows with defined boundaries
- Natural conversation within mission parameters
- LLM-powered understanding with narrative constraints
- Balance between openness and control

### Advanced Integration (Future consideration)

- User-controlled NPCs for premium experiences
- Real-time adaptive difficulty based on performance
- Cross-conversation memory and relationship building
- Emergent narrative possibilities within guardrails

## Success Metrics

The system succeeds when:

- Learners practice speaking without feeling constrained
- Conversation failures feel like natural story consequences
- Language learning objectives are met through engaging gameplay
- Technical complexity remains invisible to the user
