# Field Operation Mechanics

## Overview

Field Operations are the culminating interactive scenarios in each mission where users apply their language skills in a simulated real-world context. These scenarios function as both an assessment and an engaging narrative climax, allowing users to experience language as a practical tool rather than just an academic subject.

## Core Experience

The Field Operation transforms passive language learning into active language use by:

1. **Contextualizing vocabulary and grammar** in realistic scenarios
2. **Creating stakes** through mission objectives and success ratings  
3. **Simulating authentic interactions** with meaningful choices
4. **Providing immediate feedback** on language use in context
5. **Rewarding both accuracy and appropriateness** of language choices

## Gameplay Mechanics

### Basic Structure

1. **Scenario Introduction**
   - Establishes location, objectives, and context
   - Reviews "mission critical" vocabulary
   - Provides any necessary cultural context
   
2. **Interactive Dialogue Tree**
   - Multiple-choice conversation paths
   - Time-limited responses (optional difficulty setting)
   - Branching outcomes based on choices
   - Recovery paths from suboptimal choices
   
3. **Success Metrics**
   - Cover Effectiveness (how natural the conversation feels)
   - Objective Completion (did you get the required information?)
   - Efficiency (how directly you accomplished goals)
   - Cultural Appropriateness (did you follow social norms?)

### Dialogue System

Each interaction follows this flow:

1. **NPC Prompt** - Audio and text of conversation partner
2. **Response Selection** - 2-4 response options of varying appropriateness
3. **Feedback** - Subtle indications of response quality
4. **Continuation** - Story progresses based on choices
5. **Branch Management** - Paths reconverge to maintain narrative coherence

### Example Dialogue Tree

```
Waiter: "Bonjour monsieur, vous désirez?"

OPTIONS:
A. "Bonjour, je voudrais un café s'il vous plaît." [BEST - formal, polite]
B. "Un café." [OKAY - direct but abrupt]
C. "Coffee please." [POOR - breaks cover by using English]

IF A SELECTED:
Waiter: "Bien sûr, monsieur. Un petit café normal?"

IF B SELECTED:
Waiter: [slight frown] "D'accord... un café normal?"

IF C SELECTED:
Waiter: [suspicious look] "Ah, un touriste. Café américain?"
[Cover effectiveness -20%]
```

### Cover Effectiveness Meter

- Starts at 100% at beginning of operation
- Decreases with inappropriate language choices
- Affects mission outcome and final rating
- Different thresholds for mission success/failure

### Challenge Escalation

As the scenario progresses, challenges increase:

1. Initial exchanges are simple and forgiving
2. Middle interactions require more specific vocabulary
3. Later conversations may include:
   - Idiomatic expressions
   - Cultural references
   - Unexpected questions
   - Time pressure
   - Emotional components (urgency, suspicion)

## Implementation Details

### Visual Components

- **Environment Visuals** - Café interior, street scene, etc.
- **Character Portraits** - With expressions that change based on interactions
- **UI Overlays**:
  - Cover effectiveness meter
  - Objective tracker
  - Time indicator (if applicable)
  - "Handler assistance" button (hints)

### Audio Components

- **NPC Voice Lines** - Professional voice actors with authentic accents
- **Ambient Sound** - Location-appropriate background noise
- **Feedback Effects** - Subtle audio cues for good/poor choices

### Advanced Features

#### Speech Recognition (Optional)

- Allow users to speak responses rather than select them
- Evaluate pronunciation and vocabulary usage
- Provide specific feedback on articulation

#### Adaptive Difficulty

- Track user performance across multiple metrics
- Adjust challenge level based on:
  - Previous mission performance
  - Specific vocabulary mastery
  - Self-selected difficulty settings
  - Learning pace preferences

#### Memory Testing

- Occasionally reference information from previous lessons
- Reward recall of specific vocabulary or cultural information
- Create "callback" moments to earlier training

## Scenario Types

### Information Extraction

- **Objective:** Obtain specific information from a contact
- **Challenge:** Must be subtle and maintain cover
- **Example:** Determine contact's travel plans without arousing suspicion

### Cover Maintenance

- **Objective:** Successfully navigate a social situation without revealing identity
- **Challenge:** Handle unexpected questions and situations
- **Example:** Attend a dinner party and discuss "your hometown" convincingly

### Transaction Completion

- **Objective:** Successfully complete a purchase or service interaction
- **Challenge:** Navigate specialized vocabulary and cultural norms
- **Example:** Order a specific meal with modifications at a restaurant

### Direction Navigation

- **Objective:** Find a specific location using local directions
- **Challenge:** Understand spatial instructions in target language
- **Example:** Follow spoken directions to locate a hidden drop point

## Reward Structure

### Performance Ratings

- **S-Rank:** Perfect cover maintenance, all objectives completed
- **A-Rank:** Strong cover, all primary objectives completed
- **B-Rank:** Adequate cover, primary objectives completed
- **C-Rank:** Questionable cover, basic objectives completed
- **Failure:** Cover blown or critical objectives missed

### Rewards

- **XP Bonuses** - Based on rank achieved
- **Narrative Progression** - Better outcomes unlock more detailed story elements
- **Special Commendations** - Perfect executions earn badges
- **Clearance Increases** - Accumulating high ratings increases security clearance

## Technical Requirements

1. **Dialogue System** - Capable of branching conversations with state tracking
2. **Performance Evaluation** - Real-time assessment of language appropriateness
3. **Adaptive Response** - NPC reactions that vary based on player choices
4. **State Management** - Tracking of conversation history and choices
5. **UI Framework** - Dynamic interface elements that respond to gameplay

## Example Field Operation: "Café Encounter"

### Setup

**Briefing:** "Your mission is to make contact with asset 'Blue Jay' at Café Lumière. You'll confirm identity using the phrase 'The weather in Marseille is lovely this time of year.' After confirmation, extract information about an upcoming meeting without arousing suspicion. Cover identity: Canadian tourist interested in French culture."

**Objectives:**
- Successfully order a coffee in natural French
- Identify and confirm contact using code phrase
- Extract meeting location and time
- Maintain cover throughout interaction
- Exit naturally without raising suspicion

### Key Interactions

1. **Waiter Interaction**
   - Greeting and ordering
   - Small talk about local recommendations
   - Payment and tipping (cultural knowledge test)

2. **Contact Identification**
   - Casual observation of other patrons
   - Subtle use of code phrase
   - Recognition confirmation

3. **Information Extraction**
   - Natural conversation building
   - Indirect questions about plans
   - Note-taking without appearing suspicious

4. **Exit Strategy**
   - Graceful conversation conclusion
   - Appropriate farewell expressions
   - Proper café etiquette on departure

### Success Conditions

**Full Success:** Contact confirmed, all information extracted, cover maintained above 80%

**Partial Success:** Contact confirmed, basic information extracted, cover maintained above 60%

**Failure Conditions:**
- Cover effectiveness drops below 50%
- Incorrect person identified as contact
- Extraction too obvious, making contact suspicious
- Critical cultural error that draws unwanted attention

## Development Roadmap

### MVP Version
- Multiple-choice dialogue system
- Basic cover effectiveness tracking
- Linear scenario with limited branching
- Text-based feedback and assessment

### Enhanced Version
- Expanded dialogue options and consequences
- Voice acting for all NPCs
- Environmental visuals and animations
- Detailed performance metrics

### Full Version
- Speech recognition capabilities
- Fully branching scenarios with multiple outcomes
- Dynamic NPC reactions based on user history
- Adaptive difficulty scaling
- Interconnected scenarios that remember past choices

## Integration with Learning System

Field Operations tie directly back to the learning content by:

1. Featuring recently taught vocabulary in critical conversations
2. Requiring mastery of specific grammar points for success
3. Testing cultural knowledge introduced in lessons
4. Identifying weak areas for future spaced repetition
5. Contextualizing abstract language concepts in practical scenarios

This creates a virtuous learning cycle where training has immediate application, and performance in the field informs future training priorities. 