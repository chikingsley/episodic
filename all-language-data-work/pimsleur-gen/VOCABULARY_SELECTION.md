# Pimsleur Vocabulary Selection Principles

## Why These 285 Words? The Logic Behind Level 1 Vocabulary

Pimsleur French Level 1 teaches approximately 285 vocabulary items across 30 lessons. This is deliberately small — roughly 9-10 new items per lesson. The selection is not random, not frequency-based, and not theme-based. It follows a set of identifiable principles that can be formalized for course generation.

---

## The 10 Selection Principles

### 1. Meta-Communication First ("Bootstrap Protocol")

The very first words taught are about **the act of communication itself**:

| Lesson | Words | Function |
|--------|-------|----------|
| L1 | pardon, comprenez, comprends, l'anglais, le français, un peu, pas, ne | Establishing whether communication is possible |
| L1 | est-ce que, oui, non, monsieur, mademoiselle | Asking questions, basic politeness |
| L1 | américain, je, vous | Identity |

**Principle**: Before teaching ANY content vocabulary, teach the learner how to *negotiate* communication. "Excuse me, do you understand English? I don't understand. A little." — these are survival phrases for someone who knows nothing.

**Why it matters for generation**: Every new language course should start with this same meta-communicative bootstrapping, regardless of language. The first lesson is always: excuse me, do you understand [L1]?, I understand/don't understand, a little, yes, no.

### 2. Formal Register First

Pimsleur systematically teaches formal before informal:

| Formal (taught first) | Informal (taught later) | Gap |
|----------------------|------------------------|-----|
| vous (L1) | tu (L28) | 27 lessons |
| bonjour (L2) | salut (L2-L9) | Never in L1 |
| comment allez-vous (L2) | ça va (L16) | 14 lessons |
| monsieur/madame (L1) | — | Always present |

**Principle**: Formal register is *safer* for a beginner. Using "vous" with a stranger is never wrong; using "tu" can be rude. Pimsleur optimizes for social safety, not naturalness.

**Contrast with Speak**: Speak teaches "Salut" and "Moi, c'est..." in Unit 1. Speak optimizes for casual social encounters; Pimsleur optimizes for not offending anyone.

### 3. Function Over Frequency

Words are selected for what they **let you do**, not how common they are in French text:

| High-frequency word | Taught in... | Why? |
|---------------------|-------------|------|
| aimer (to like/love) | L29 (2nd to last!) | Not survival-functional |
| avoir (to have) | L13 | You can survive without "having" |
| vouloir/voudrais | L5 | Enables ALL requests |
| aller | L2/L10 | Navigation + future tense |
| pouvoir | L15 | Enables ability/permission |

**Principle**: "Je voudrais" (I would like) is taught in L5 because it's the **universal request handle**. "J'aime" (I like) waits until L29 because liking things isn't survival-critical. The conditional form (voudrais) is taught before the simple present (veux) because it's more polite and more useful.

**Key insight**: Pimsleur doesn't teach the most frequent words — it teaches the most **functionally powerful** words. A word that enables an entire category of interaction (requesting, asking, navigating) is prioritized over a word that only describes (liking, wanting).

### 4. Handle-Construction-Driven Selection

Vocabulary exists to serve the 7 "handle constructions" (see GRAMMAR_STAIRCASE.md):

| Handle | Taught | Vocabulary it drives |
|--------|--------|---------------------|
| je voudrais + inf. | L5 | boire, manger, faire, acheter, voir, prendre, partir |
| est-ce que + statement | L1 | comprenez, êtes, allez, avez, savez, pouvez |
| je vais + inf. | L10 | manger, boire, faire, acheter, voir, prendre |
| où est + noun | L4 | rue, boulevard, restaurant, magasin, toilettes |
| il y a + noun | L22 | personnes, voiture, essence |
| combien + noun | L12 | francs, personnes, enfants, heures |
| pourquoi/parce que | L25 | fermé, ouvert, tard |

**Principle**: Each content word is selected because it **plugs into a handle construction** the learner already knows. Verbs in infinitive form (boire, manger, faire...) are taught because they slot into "je voudrais [verb]" and "je vais [verb]". Nouns are taught because they slot into "où est [noun]" or "combien de [noun]".

**For generation**: When selecting vocabulary for a new language, first identify the handle constructions, then select content words that plug into them productively.

### 5. Conversation-Embeddable (No Orphan Words)

Every word must immediately participate in a conversation. There are zero isolated vocabulary items:

| Word | Immediate conversational use |
|------|---------------------------|
| restaurant (L4) | "Où est le restaurant?" → "C'est ici" / "C'est là-bas" |
| vin (L7) | "Je voudrais du vin" → "Du vin rouge ou blanc?" |
| enfants (L20) | "Vous avez des enfants?" → "Oui, j'ai trois enfants" |

**Principle**: If a word can't be used in a conversation with what the learner already knows, it's not taught yet. This is why "restaurant" comes at L4 (after "où est" in L4) but "magasin" waits until L25.

### 6. Progressive Context Expansion

Vocabulary follows a predictable expansion from self → other → world:

```
L1-3:   SELF     → Who am I? (identity, nationality, language ability)
L4-8:   PLACE    → Where am I? (locations, food, drink)
L9-15:  TIME     → When? How much? (time, money, numbers)
L16-21: PEOPLE   → Who else? (family, communication, introductions)
L22-27: WORLD    → How do I get around? (travel, directions, shopping)
L28-30: DEPTH    → Register, past tense, complexity
```

**Principle**: The vocabulary domain expands concentrically. You start with the most immediate need (yourself) and gradually widen to the surrounding world.

### 7. Numbers as Infrastructure

Numbers get disproportionate attention (8+ lessons), because they're infrastructure for multiple domains:

| Number Range | Lesson | Used For |
|-------------|--------|----------|
| 1-5 | L8, L10 | Counting, ordering |
| 6-10 | L11 | Time (hours) |
| 11-19 | L12-14 | Money (francs), age |
| 20-69 | L16-17 | Money, addresses |
| 70-79 | L23 | Directions (distances) |
| 80-100 | L25, L27 | Prices, ages, distances |

**Principle**: Numbers are taught not as a vocabulary domain but as **enabling infrastructure**. You can't tell time without numbers. You can't handle money without numbers. You can't give directions without numbers. They're spread across 8 lessons because each range unlocks a new capability.

### 8. Grammar Through Vocabulary (Implicit Instruction)

Grammar structures are introduced through vocabulary contrasts, never as explicit rules:

| Grammar Point | Taught Through | Lesson |
|--------------|----------------|--------|
| Gender agreement | américain / américaine | L3 |
| Negation | comprends / ne comprends pas | L1 |
| Partitive articles | du vin / de la bière | L7 |
| Adjective agreement | grand / grande | L18 |
| Plural forms | enfant / enfants | L20 |
| Tu/vous register | Same conversation, two versions | L28 |
| Passé composé | acheté, mangé (with j'ai) | L29 |
| Être verbs | arrivé, allé (with suis/sommes) | L30 |

**Principle**: Vocabulary items are sometimes selected specifically to illustrate a grammar point. "Américain/américaine" is taught in L3 partly because it's useful identity vocabulary, but also because it's the perfect vehicle for teaching masculine/feminine agreement (the difference is audible: -ain vs -aine).

### 9. Cognitive Load Management (~9 items/lesson)

The introduction rate is remarkably consistent:

| Phase | Lessons | Avg. new items/lesson |
|-------|---------|----------------------|
| Foundation (L1-8) | 8 | ~12 (higher — bootstrapping) |
| Multimodal (L9-21) | 13 | ~8 (numbers inflate this) |
| Instruction Flip (L22-27) | 6 | ~8 |
| Register/Tense (L28-30) | 3 | ~10 (grammar concepts) |

**Principle**: Never more than ~12 genuinely new items per lesson. The spaced repetition system needs room to operate — if you introduce 20 words, there's no time to revisit them within the 30-minute lesson at the required intervals (5s → 25s → 125s → 625s).

### 10. Cultural Appropriateness (Traditional Lens)

Pimsleur's vocabulary reflects its era and cultural assumptions:

| Pimsleur teaches | Modern gap |
|-----------------|-----------|
| francs | euros (pre-2002 content) |
| mademoiselle | Increasingly deprecated in modern French |
| Formal register only (L1) | Modern learners need casual French too |
| chapeau, journal | Less relevant to modern tourists |
| — | par carte / en espèces (payment methods) |
| — | chercher (to look for) |
| — | avoir faim/soif (hungry/thirsty) |

**Principle**: Vocabulary choices reflect the assumed learner persona (adult American tourist in a formal context). This creates gaps for modern learners, especially around casual social interaction and digital-age transactions.

---

## Cross-Method Comparison: What Each System Prioritizes

### Pimsleur Level 1 (285 items, 30 lessons)
**Selection logic**: Survival-functional, formal, conversation-embeddable
- Strongest in: Politeness, requests, navigation, time/money, meta-communication
- Weakest in: Casual social, personal expression, modern transactions, feelings

### Speak App (Beginner 1-3, ~8 units)
**Selection logic**: Social-functional, casual, immediately expressive
- Strongest in: Casual greetings, self-expression, modern transactions, food/drink
- Weakest in: Formal register, complex grammar, numbers, extended conversation

### Duolingo (Sections 1-2, ~32 units)
**Selection logic**: Frequency-based, CEFR-aligned, broad coverage
- Strongest in: Vocabulary breadth, reading/writing, grammar explanation, themed units
- Weakest in: Speaking practice, pronunciation, conversational flow, active recall

### The Ideal Hybrid Vocabulary Selection

Combining insights from all three methods, vocabulary for a new course should be selected by:

1. **Start with meta-communication** (Pimsleur): excuse me, understand, don't understand, a little, yes, no
2. **Add survival handles** (Pimsleur): I would like, where is, how much, what time
3. **Include casual social** (Speak): informal greetings, expressing likes, learner phrases
4. **Use modern vocabulary** (Speak): current currency, payment methods, digital terms
5. **Maintain frequency awareness** (Duolingo): don't ignore truly high-frequency words
6. **Embed grammar** (Pimsleur): choose words that naturally illustrate grammar points
7. **Ensure conversation-embeddability** (Pimsleur): every word must fit into existing patterns

---

## Complete Level 1 Vocabulary by Theme

### Identity & Communication (L1-3, L17): ~30 items
pardon, comprenez, comprends, l'anglais, le français, un peu, est-ce que, non, monsieur, je, vous, mademoiselle, oui, je ne comprends pas, pas, ne, américain, êtes, suis, américaine, français/française, ne suis pas, n'êtes pas, et, mais, parlez, s'il vous plaît, comprendre, parler, vite, si (yes/emphatic)

### Greetings & Politeness (L2): ~10 items
bonjour, madame, très bien, merci, bien, comment allez-vous, allez, au revoir, je vais bien, et vous

### Locations (L4): ~8 items
où est, rue, boulevard, restaurant, c'est, ici, là-bas, ce n'est pas, la

### Food & Drink (L5-8): ~20 items
veux, voulez, voudriez, boire, manger, quelque chose, voudrais, chez moi, chez vous, maintenant, plus tard, quand, pas maintenant, aussi, moi aussi, déjeuner, mais si, d'accord, pas d'accord, qu'est-ce que, faire, acheter, avec qui, vin, bière, du vin, de la bière, ou, deux, dites-moi

### Time (L10-11): ~20 items
quelle heure est-il, il est, cinq/trois/quatre/deux/huit/neuf heures, je vais, vous allez, à quelle heure, voudriez, déjeuner, dîner, ce soir, demain, demain soir, aujourd'hui, vite, sept, huit, neuf, dix, mal, assez, trop

### Money & Numbers (L12-17): ~30 items
franc, je vous dois, vous me devez, combien, onze-seize, j'ai, en, beaucoup, pas de, peut, peux, journal, voilà, dix-sept/dix-huit/dix-neuf, donnez-moi, cher, pour, je peux, vous pouvez, font, ça va, argent, beaucoup d'argent, ça suffit, vingt, trente, quarante, cinquante, soixante

### Family (L18-21): ~25 items
chapeau, magnifique, mari, femme, mon, ma, votre, eau, grand/grande, garçon, fille, bonsoir, entrez, enchanté, habitez, habiter, j'habite, nous habitons, marié, nous, on, enfants, trois enfants, nous avons, combien d'enfants, intéressant, attendre, les toilettes, la famille, à gauche, plus loin

### Travel & Directions (L22-24): ~20 items
il y a, combien de personnes, personne, dans votre famille, voiture, si (if), essence, litre, kilomètre, comment dit-on, mettez, mettre, attendez, loin, soixante-dix, soixante-douze, route, tout droit, à droite, et puis, bonne route

### Shopping & Plans (L25-27): ~25 items
quatre-vingts, pourquoi, parce que, magasin, grand magasin, fermé, ouvert, tard, prendre, voir, amis, mes amis, quelques, travailler, passer, jours, peut-être, je crois, croyez, quatre-vingt-dix, quatre-vingt-quinze, cent, rien, seul/seule, ensemble, partir

### Register & Past (L28-30): ~25 items
tu, ça ne va pas, depuis, semaines, temps, rester, nous sommes, zut, veut dire, mot, mal, pas mal, hier, hier matin, hier soir, une semaine, quelques semaines, acheté, du lait, du bon vin, mangé, un beau chapeau, aimer, ce mot, sommes américains, depuis combien de temps, j'aime la France, arrivé, êtes arrivés, ce matin, allé, sommes allés, parlé

---

## Implications for Course Generation

### To generate vocabulary for a new language:

1. **Identify the 7 handle constructions** for that language (see GRAMMAR_STAIRCASE.md)
2. **Select meta-communication words first**: excuse me, understand, don't understand, a little, yes, no, please — these are universal
3. **Select formal greetings and politeness markers** appropriate to the culture
4. **For each handle construction**, select 5-8 content words that plug into it productively
5. **Add numbers 1-100** spread across lessons as infrastructure
6. **Add family/social vocabulary** for the introduction phase
7. **Add travel/navigation vocabulary** for the independent phase
8. **Add time expressions** (today, tomorrow, yesterday, morning, evening)
9. **Total target: 250-300 items for 30 lessons** (~9 per lesson)
10. **Validate**: every word must be conversation-embeddable with previously taught material

### What Pimsleur Gets Right (Keep)
- Meta-communication bootstrapping
- Handle-construction-driven selection
- Conversation-embeddability requirement
- Cognitive load management (~9 items/lesson)
- Grammar through vocabulary contrasts

### What Pimsleur Gets Wrong (Fix)
- Formal-only register in Level 1 (add casual greetings by lesson 10)
- No personal expression vocabulary (add "like/love" by lesson 15)
- Outdated cultural references (use current currency, modern payment)
- Missing high-utility verbs: chercher, apprendre, avoir faim/soif
- No learner-meta phrases ("I'm learning French")
