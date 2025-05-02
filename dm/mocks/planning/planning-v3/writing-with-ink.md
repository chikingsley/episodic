# Writing with Ink

## The Basics

**Ink** is a scripting language built around the idea of marking up pure-text with flow to produce interactive scripts. It offers several features to enable non-technical writers to branch often and play out the consequences of those branches with minimum fuss and complexity.

At its most basic, it can be used to write a Choose Your Own-style story or a branching dialogue tree. Its real strength is in writing dialogues with lots of options and lots of recombination of the flow. It can be used to create entirely text-based games or plugged into game engines to power the narrative components of more complex or graphical games. Ink has been used to make free-to-play mobile games, open-world 3D adventure games, customer chat-bots, consumer surveys, interactive novels, visual novels, and more.

An ink script aims to be clean and logically ordered so that branching dialogue can be tested "by eye." The flow is described in a declarative fashion where possible. It's also designed with editing and redrafting in mind; skim-reading a flow should be fast, and moving it around convenient. And it starts from a core idea: the text comes first.

## Software

You can write ink using any text editor, but the best software to use is **inky**: a text editor with the ink compiler built-in, which allows you to test your game as you write and will help you locate and fix errors in your script quickly.

Games can be exported directly from inky as playable web-pages. With knowledge of JavaScript, these can be expanded into full games. Ink can also be used with the Unity game engine using the ink-unity integration.

Links to all these resources can be found on the ink site:
[inklestudios.com/ink](https://www.inklestudios.com/ink/)

There is also a community-developed integration for the Godot engine and a work-in-progress integration for Unreal.

## The Simplest Ink Script

The most basic ink script is just text in a `.ink` file.

### Hello, World

```markdown
Hello, world!
Hello?
```

On running, this will output the content and then stop. Putting text onto separate lines produces separate lines of output content.

## Choices

Input is offered to the player via text choices. A text choice is indicated by an `*` character.

```markdown
Hello world!
* Hello back!
    Nice to hear from you!
```

This produces the following "game":

```markdown
Hello world
1: Hello back!
> 1
Hello back!
Nice to hear from you.
```

### Suppressing Choice Text

If the choice text is given in square brackets, then the text of the choice will not be printed into the response.

```markdown
Hello world!
* [Hello back!]
    Nice to hear from you!
```

This produces:

```markdown
Hello world
1: Hello back!
> 1
Nice to hear from you.
```

### Advanced: Mixing Choice and Output Text

The square brackets divide up the option content. What's before is printed in both choice and output; what's inside only in the choice; and what's after, only in output.

```markdown
Hello world!
* Hello [back!] right back to you!
```

This produces:

```markdown
Hello world
1: Hello back!
> 1
Hello right back to you!
```

This is most useful when writing "prose" dialogue choices, where the dialogue option is given a line of speech, which then turns into a full paragraph.

```markdown
"What's that?" my master asked.
* "I am somewhat tired[."]," I repeated.
    "Really," he responded. "How deleterious."
```

This produces:

```markdown
"What's that?" my master asked.
1: "I am somewhat tired."
> 1
"I am somewhat tired," I repeated.
"Really," he responded. "How deleterious."
```

### Multiple Choices

To make choices really choices, we need to provide alternatives. We do this in ink simply by listing them.

```markdown
"What's that?" my master asked.
* "I am somewhat tired[."]," I repeated.
    "Really," he responded. "How deleterious."
* "Nothing, Monsieur!"[] I replied.
    "Very good, then."
* "I said, this journey is appalling[."] and I want no more of it."
    "Ah," he replied, not unkindly. "You are feeling frustrated."
```

This produces the following interactive moment:

```markdown
"What's that?" my master asked.
1: "I am somewhat tired."
2: "Nothing, Monsieur!"
3: "I said, this journey is appalling."
> 3
"I said, this journey is appalling and I want no more of it."
"Ah," he replied, not unkindly. "You are feeling frustrated."
```

## Knots

### Pieces of Content are Called Knots

To allow the game to branch, we need to mark up sections of content with names. Each section is called a "knot," and knots are the fundamental structural unit of ink content.

### Writing a Knot

The start of a knot is indicated by two or more equals signs.

```markdown
=== top_knot ===
```

The equals signs on the end are optional, and the name needs to be a single word with no spaces. Programmers often use underscores in place of spaces.

```markdown

=== back_in_london ===
    We arrived into London at 9.45pm exactly.
```

There's no marker for the end of a knot: a knot ends whenever the next one starts (or when the source file itself ends).

### Knots Divert to Knots

You can tell the story to move from one knot to another using `->`, a "divert arrow." Diverts happen immediately without any user input.

```markdown
=== back_in_london ===
    We arrived into London at 9.45pm exactly.
    -> hurry_home
=== hurry_home ===
    We hurried home to Savile Row as fast as we could.
```

### The First Divert

When you start an ink file, content before the first knot will be run automatically. But knots themselves won't be. So if you start using knots, you'll need to tell the game where to go as part of the opening content, by diverting.

```markdown
-> top_knot
=== top_knot ===
    Hello world!
```

### `-> END`

Once you start using knots, ink will start looking out for loose ends in the story. It produces a warning on compilation and/or runtime when it thinks it's found a place in the story where the story runs out of places to go. To remove the warning and the error, we need to tell the compiler "the story is meant to stop here" using the `-> END` divert.

```markdown
-> top_knot
=== top_knot ===
    Hello world!
    -> END
```

### Diverts Continue the Story

Diverts are what link one knot to another and make your story flow. They're invisible to the player and are intended to be seamless. They can even happen mid-sentence!

```markdown
=== hurry_home ===
    We hurried home to Savile Row ->
as_fast_as_we_could
=== as_fast_as_we_could ===
    as fast as we could.
```

This produces:

```markdown
We hurried home to Savile Row as fast as we could.
```

### Glue

The above behavior can also be achieved without the divert being on the same line, but we have to tell the compiler to do it. By default, ink inserts a line break every time a new line of content is found. But content can insist on not having a line break after it, or before it, by using `<>`, or "glue."

```markdown
=== hurry_home ===
    We hurried home <>
    -> to_savile_row
=== to_savile_row ===
    to Savile Row
    -> as_fast_as_we_could
=== as_fast_as_we_could ===
    <> as fast as we could.
```

This produces:

```markdown
We hurried home to Savile Row as fast as we could.
```

The glue marker is invisible to the player, and you can't use too much of it: multiple glues next to each other have no additional effect.

## Branching the Flow

### Basic Branching

Combining knots, options, and diverts gives us the basic structure of a choose-your-own game.

```markdown
=== paragraph_1 ===
    You stand by the wall of Analand, sword in hand.
    * [Open the gate] -> paragraph_2
    * [Smash down the gate] -> paragraph_3
    * [Turn back and go home] -> paragraph_4
=== paragraph_2 ===
    You open the gate and step out onto the path.
```

Using diverts, the writer can branch the flow and join it back up again without showing the player that the flow has rejoined.

```markdown
=== back_in_london ===
    We arrived into London at 9.45pm exactly.
* "There is not a moment to lose!"[] I declared.
    -> hurry_outside
* "Monsieur, let us savour this moment!"[] I declared.
    My master clouted me firmly around the head and dragged me out of the door.
    -> dragged_outside
* [We hurried home] -> hurry_outside
=== hurry_outside ===
    We hurried home to Savile Row ->
as_fast_as_we_could
=== dragged_outside ===
    He insisted that we hurried home to Savile Row
    -> as_fast_as_we_could
=== as_fast_as_we_could ===
    <> as fast as we could.
```

### The Story Flow

Knots and diverts combine to create the basic story flow of the game. This flow is "flat"—there's no call stack, and diverts aren't "returned" from.

In most ink scripts, the story flow starts at the top, bounces around in a spaghetti-like mess, and eventually, hopefully, reaches the `-> END`.

The very loose structure means writers can get on and write, branching and rejoining without worrying about the structure they're creating as they go. There's no boilerplate to creating new branches or diversions, and no need to track any state.

### Advanced: Loops

You absolutely can use diverts to create looped content, and ink has several features to exploit this, including ways to make the content vary itself and ways to control how often options can be chosen.

```markdown
=== round ===
    and
    -> round
```

If ink does get stuck in an infinite loop, you'll need to crash the game to get out of it. In inky, however, the compiler is still watching for text changes to recompile even while it's locked in a loop, which means if you can break your script, you can break the loop. The fastest way to do that is to type a `a` on a blank line. As soon as the compiler finds it, it'll crash for reasons we'll come on to later, and then you can go in and remove your infinite loop.

## Includes and Stitches

As stories get longer, they become more confusing to keep organized without some additional structure. The classic solution to this for interactive designers is the flowchart, but here at inkle, we don't really believe in them: they make even simple things look complicated, and they make complicated things look absolutely appalling. Ink is very much about flat text scripts, with section labeling and good filenames being essential for keeping things organized.

### Stitches Divide Knots

Knots can be divided up into sub-sections called "stitches." These are marked using a single equals sign.

```markdown
=== the_orient_express ===
    = in_first_class
    ...
    = in_third_class
    ...
    = in_the_guards_van
    ...
    = missed_the_train
```

One could use a knot for a scene, for instance, and stitches for the events within the scene.

### Stitches Have Unique Names

A stitch can be diverted to using its "address," given as `knot.stitch`.

```markdown
* [Travel in third class]
    -> the_orient_express.in_third_class
* [Travel in the guard's van]
    -> the_orient_express.in_the_guards_van
```

### The First Stitch is the Default

Diverting to a knot which contains stitches will divert to the first stitch in the knot. So:

```markdown
* [Travel in first class]
"First class, Monsieur. Where else?"
-> the_orient_express
```

is the same as:

```markdown
* [Travel in first class]
"First class, Monsieur. Where else?"
-> the_orient_express.in_first_class
```

(...unless we didn't put first-class first inside the knot. How unseemly!)

You can also include content at the top of a knot outside of any stitch. But you'll need to remember to divert out of it—the engine won't automatically enter the first stitch once it's worked its way through the header content.

```markdown
=== the_orient_express ===
    We boarded the train, but where?
    * [First class] -> in_first_class
    * [Second class] -> in_second_class
    * [Third class] -> in_third_class
= in_first_class
    ...
= in_second_class
    ...
= in_third_class
    ...
```

### Local Diverts

From inside a knot, you don't need to use the full address for a stitch. When ink encounters a divert, it'll look in the most local context first for somewhere to go.

```markdown
-> the_orient_express
=== the_orient_express ===
= in_first_class
    I settled my master.
    * [Move to third class]
        -> in_third_class
= in_third_class
    I put myself in third.
```

This means that while stitches and knots can't share names, several knots can contain the same stitch name. (So both the Orient Express and the SS Mongolia can have a first class.)

The compiler will warn you if ambiguous names are used.

### Including Multiple Script Files

You can also split your content across multiple files using an `INCLUDE` statement.

```markdown
INCLUDE newspaper.ink
INCLUDE cities/vienna.ink
INCLUDE journeys/orient_express.ink
```

Include statements should always go at the top of a file and not inside knots, and in general, it's sensible to put all your includes in your top-level "main" ink file, rather than hiding them away in sub-files. When you create an include file using the button for it in inky, this is exactly what it'll do.

There are no rules about file structure in ink. Include files exist purely for the human's benefit: since everything is global in ink, ink doesn't care about the structure you use. (Note to coders: that means you'll never want to include the same include file twice.)

## Varying Choices

### Choices Can Only Be Used Once

By default, every choice in the game can only be chosen once, but if you don't have loops in your story, you'll never notice this behavior.

If you do use loops, however, you'll quickly notice your options disappearing...

```markdown
=== find_help ===
You search desperately for a friendly face in the crowd.

* The woman in the hat[?] pushes you roughly aside. -> find_help
* The man with the briefcase[?] looks disgusted as you stumble past him. -> find_help
```

This produces:

```markdown
You search desperately for a friendly face in the crowd.

1: The woman in the hat?
2: The man with the briefcase?
> 1
The woman in the hat pushes you roughly aside. You search desperately for a friendly face in the crowd.

1: The man with the briefcase?
>
```

And on the next loop, you'll have no options left.

### Fallback Choices

The above example stops where it does because the next choice ends up in an "out of content" runtime error. There are no choices left to offer, and no content for the player to read!

```markdown
Runtime error in tests/test.ink line 6: ran out of content. Do you need a '-> DONE' or '-> END'?
```

We can resolve this with a "fallback choice." Fallback choices are never displayed to the player but are "chosen" by the game if no other options exist.

A fallback choice is simply written as a choice without any choice text:

```markdown
* -> out_of_options
```

And, in a slight abuse of syntax, we can give a fallback choice some content:

```markdown
* ->
    Mulder never could properly explain how he got out of that burning box car.
    -> season_3
```

### Example of a Fallback Choice

Adding this into the previous example gives us:

```markdown
=== find_help ===
    You search desperately for a friendly face in the crowd.

* The woman in the hat[?] pushes you roughly aside. -> find_help
* The man with the briefcase[?] looks disgusted as you stumble past him. -> find_help
* -
But it is too late: you collapse onto the station platform. This is the end.
-> END
```

This produces:

```markdown
You search desperately for a friendly face in the crowd.

1: The woman in the hat?
2: The man with the briefcase?
> 1
The woman in the hat pushes you roughly aside. You search desperately for a friendly face in the crowd.

1: The man with the briefcase?
> 1
The man with the briefcase looks disgusted as you stumble past him.
You search desperately for a friendly face in the crowd.
But it is too late: you collapse onto the station platform. This is the end.
```

### Sticky Choices

The "once-only" behavior of a choice is not always what we want, of course, so we have a second kind of choice: the "sticky" choice. A sticky choice is simply one that doesn't get used up and is marked by a `≠` bullet. (A "splatted" asterisk.)

```markdown
=== homers_couch ===
    + [Eat another donut]
        You eat another donut. -> homers_couch
    * [Get off the couch]
        You struggle up off the couch to go and compose epic poetry.
    -> END
```

Fallback choices can be sticky too.

```markdown
=== conversation_loop
    * [Talk about the weather]
-> chat_weather
    * [Talk about the children]
-> chat_children
    * [Talk about the impermanence of all things]
-> chat_philosophy
    * [Talk about minor skin conditions]
-> chat_skin_conditions
    + -> sit_in_silence_again
```

### Conditional Choices

In an ink story, what has happened, has happened, and past events should affect future ones. In practice, this means we need to be able to turn off choices that don't fit the current playthrough and turn on new ones that do. Ink has quite a broad suite of logic available to the author to use, but the very simplest test there is asks, "Has the player seen a particular piece of content?"

Every knot/stitch in the game has a unique address (so it can be diverted to), and we can use that same address directly to test if that piece of content has been seen in this playthrough.

```markdown
    * { not visit_paris } [Go to Paris]
-> visit_paris
    + { visit_paris } [Return to Paris] -> visit_paris
    * { visit_paris.met_estelle } [Phone Mme Estelle] -> phone_estelle
```

Note that the test `knot_name` is true if any stitch inside that knot has been seen. Note also that conditionals don't override the once-only behavior of options, so you'll still need sticky options for repeatable choices.

### Advanced: Multiple Conditions

You can use several logical tests on an option; if you do, all the tests must all be passed for the option to appear. Conditionals like this can be placed on multiple lines if you like (there can sometimes be quite a lot of them).

```markdown
    * { not visit_paris } [Go to Paris] -> visit_paris
    + { visit_paris }
        { not bored_of_paris }
        [Return to Paris] -> visit_paris
```

### Logical Operators: AND and OR

The above "multiple conditions" are really just conditions combined with the usual programming AND operator. Ink supports `and` (also written as `&&`) and `or` (also written as `||`) in the usual way, as well as bracketing.

```markdown
* { not (visit_paris or visit_rome) && (visit_london || visit_new_york) }
    [Wait. Go where? I'm confused.]
    -> visit_someplace
```

For non-programmers, `X and Y` means both `X` and `Y` must be true; `X or Y` means either or both; we don't have a xor, nor a xnor (though it's no one's fault if they xnor).

You can also use the standard `!` for not, though it'll sometimes confuse the compiler, which thinks `{!text}` is a once-only list with one entry. We recommend using `not` because negated Boolean tests are never that exciting!!!

You'll encounter lots of examples of these operators in the examples in the rest of this book.

### Advanced: Knot/Stitch Labels are Actually Read Counts

The test:

```markdown
* {seen_clue} [Accuse Mr Jefferson]
```

is actually testing `seen_clue` as an integer and asking "are you not zero?" A knot or stitch label is actually a variable containing the number of times the content at the address has been seen by the player in this game.

If it's non-zero, it'll return true in a test like the one above, but you can also be more specific as well:

```markdown
* {seen_clue > 3} [Flat-out arrest red-handed Mr Jefferson]
```

### Advanced: More Logic

For more on logic and conditionality, see the section on variables and logic.

## Variable Text

### Text Can Vary

So far, all the content we've seen has been static, fixed pieces of text. But content can also vary at the moment of being printed.

### Sequences, Cycles, and Other Alternatives

The simplest variations of text are provided blocks of possible alternatives, selected using one of several possible rules. Alternatives like this are written inside `{...}` curly brackets, with elements separated by `|` symbols (vertical divider lines—these appear on most keyboards despite being typographically useless. UNTIL NOW. Also, in code.)

### Types of Alternatives

#### Sequences

A sequence (or a "stopping block") is a set of alternatives that tracks how many times it's been seen and each time shows the next element along. When it runs out of new content, it continues to show the final element.

This is the default in ink, so it requires no markup beyond the braces.

```markdown
The radio hissed into life.
{"Three!"|"Two!"|"One!"|There was the white noise racket of an explosion.|But it was just static.}
{I bought a coffee with my five-pound note.|I bought a second coffee for my friend.|I didn't have enough money to buy any more coffee.}
```

#### Cycles

Cycles are like sequences, but instead of stopping on the last element, they loop their content.

```markdown
It was {\&Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday} today.
```

#### Once-Only

Once-only alternatives are like sequences, but when they run out of new content to display, they display nothing. (You can think of a once-only replacement as a sequence with a blank last entry.)

```markdown
He told me a joke. {!I laughed politely.|I smiled.|I grimaced.|I promised myself to not react again.}
```

#### Shuffles

Shuffles produce randomized output. In cases of two alternatives, they choose randomly each time.

```markdown
I tossed the coin. {\$~Head|Tails}.
```

In longer shuffles, they operate a shuffle algorithm, working through the full list in random order before resetting and doing so again.

```markdown
My favourite color today is {\~blue|red|green|orange}.
```

Note that a shuffle like this can produce, say, two consecutive orange days, should orange day fall at the end of one shuffle and the start of a next. But, thankfully, it can't do three.

### Features of Alternatives

Alternatives can contain blank elements. The following does nothing for several turns and then scares the player silly.

```markdown
I took a step forward. {!||||Then the lights went out. -> eek}
```

Alternatives can be nested, with the only limit being your ability to work out what on earth is going on.

```markdown
The Ratbear {\&\{wastes no time and |\}swipes | scratches} {\&at you|into your {\&leg|arm|cheek}}.
```

Alternatives can include divert statements, so they aren't just superficial!

```markdown
I {waited.|waited some more.|snoozed.|woke up and waited more.|gave up and left. -> leave_post_office}
```

### Examples

Alternatives can be used inside loops to create the appearance of intelligent, state-tracking gameplay without particular effort.

Here's a one-knot version of whack-a-mole. Note we use once-only options, and a fallback, to ensure the mole doesn't move around, and the game will always end.

```markdown
=== whack_a_mole ===
    {I heft the hammer.|{\milsed!|Nothing!|No good. Where is he?|Ah-ha! Got him! -> END}}
    The {&mole|{&nasty|blasted|foul}{&creature|rodent}} is {in here somewhere|hiding somewhere|still at large|laughing at me|still unwhacked|doomed}.<>
    {!I'll show him!|But this time he won't escape!}
    * [{&Hit|Smash|Try} top-left] -> whack_a_mole
    * [{&Whallop|Splat|Whack} top-right] -> whack_a_mole
    * [{&Blast|Hammer} middle] -> whack_a_mole
    * [{&Clobber|Bosh} bottom-left] -> whack_a_mole
    * [{&Nail|Thump} bottom-right] -> whack_a_mole
    * ->
    Then you collapse from hunger. The mole has defeated you!
    -> END
```

This produces the following fun-filled rodent-splatting adventure:

```markdown
I heft the hammer.
The mole is in here somewhere. I'll show him!
1: Hit top-left
2: Whallop top-right
3: Blast middle
4: Clobber bottom-left
5: Nail bottom-right
> 1
Missed!
The nasty creature is hiding somewhere. But this time he won't escape!

1: Splat top-right
2: Hammer middle
3: Bosh bottom-left
4: Thump bottom-right
> 4
Nothing!
The mole is still at large.
1: Whack top-right
2: Blast middle
3: Clobber bottom-left
> 2
Ah-ha! Got him!
```

And here's a bit of unasked-for lifestyle advice. Note the sticky choice—the lure of the television will never fade:

```markdown
=== turn_on_television ===
    I turned on the television {for the first time|for the second time|again|once more}, but

there was {nothing good on, so I turned it off again|still nothing worth watching|even less to hold my interest than before|nothing but rubbish|a program about sharks and I don't like sharks|nothing on}.
    + [Try it again] -> turn_on_television
    * [Go outside instead] -> go_outside_instead
=== go_outside_instead ===
    -> END
```

### Advanced: Alternatives in Choices

Alternatives can also be used inside choice text:

```markdown
+ "Hello, {\&Master|Monsieur Fogg|you|browne-eyes\"[] I declared.
```

But there's a caveat; you can't start an option's text with a `{`, as it'll look like a conditional. But then, the caveat has a caveat: if you escape a whitespace `\` before your `{`, then ink will recognize it as text. So

```markdown
+ \{\&Hello|Hi|Wotcha\}!
```

will work as expected...
... only it won't, because choice text is re-evaluated when it is included in the output, meaning the sequence won't give you the same text as the choice. So using a sequence in a choice text usually doesn't do what you want it to do.

### Sneak Preview: Multiline Alternatives

Ink has another format for making alternatives of varying content blocks that span several lines of text. See the section on multiline blocks for details.

### Conditional Text

Text can also vary depending on logical tests, just as options can. The format is `{test: text if true}` or `{test: text if true text if false}`.

```markdown
{met_blofeld: "I saw him. Only for a moment."}
```

or

```markdown
"His real name was {met_blofeld.learned_his_name: Franz|a secret}."
```

They can be nested, the same as other alternatives, so that:

```markdown
{met_blofeld: "I saw him. Only for a moment. His real name was {met_blofeld.learned_his_name: Franz|kept a secret}." | "I missed him. Was he particularly evil?"}
```

can produce either:

```markdown
"I saw him. Only for a moment. His real name was Franz."
```

or:

```markdown
"I saw him. Only for a moment. His real name was kept a secret."
```

or:

```markdown
"I missed him. Was he particularly evil?"
```

## Game Queries and Functions

Ink provides a few useful "game level" queries about game state, for use in conditional logic. They're not quite parts of the language, but they're always available and they can't be edited by the author. In a sense, they're the "standard library functions" of the language.

The convention is to name these in capital letters.

### CHOICE_COUNT()

`CHOICE_COUNT` returns the number of options created so far in the current chunk. So for instance:

```markdown
* {false} Option A
* {true} Option B
* {CHOICE_COUNT() == 1} Option C
```

This produces two options, B and C. This can be useful for limiting how many options a player gets on a turn.

### TURNS()

This returns the number of game turns since the game began.

### TURNS_SINCE(-> knot)

`TURNS_SINCE` returns the number of moves (formally, player inputs) since a particular knot/stitch was last visited.

A value of 0 means "was seen as part of the current chunk." A value of -1 means "has never been seen." Any other positive value means it has been seen that many turns ago.

```markdown
    * {TURNS_SINCE(-> sleeping.intro) > 10}
You're feeling tired.
    * {TURNS_SINCE(-> laugh) == 0} You try to stop laughing.
```

Note that the parameter passed to `TURNS_SINCE` is a "divert target," not simply the knot address itself (because the knot address is a number—the read count—not a location in the story...)

### Sneak Preview: Using TURNS_SINCE in a Function

The `TURNS_SINCE(->x)==0` test is so useful it's often worth wrapping it up as a function.

```markdown
Hello, world!
Hello?
```

The chapter on functions outlines the syntax here a bit more clearly, but the above allows you to say things like:

```markdown
    * {came_from(-> nice_welcome)} 'I'm happy to be here!'
    * {came_from(-> nasty_welcome)} 'Let's keep this quick.'
```

... and have the game react to content the player saw just now.

### SEED_RANDOM()

For testing purposes, it's often useful to fix the random number generator so ink will produce the same outcomes every time you play. You can do this by "seeding" the random number system.

### SEED_RANDOM(235)

The number you pass to the seed function is arbitrary, but providing different seeds will result in different sequences of outcomes.

Note that seeding can also be useful in non-debug contexts too—in Overboard! we re-seed the random generator every time the player begins the card game, using the number of times the player has visited that location as a seed, to prevent people quitting and reloading their save to get better cards.

### Advanced: More Queries

You can make your own "game level" queries yourself by using "external functions," which cause ink to pass the query up into the game code and use the result given. There's a little more syntax involved for these: see the section on chapter on external functions for more information.

## Comments

By default, all text in your file will appear in the output content, unless marked up as a conditional, divert, or a knot-label. But there's also some mark-up for the writer to use to keep track of their story.

### Comments and TODOs

The simplest mark-up is a comment. Ink supports two kinds of comment. There's the kind used for someone reading the code, which the compiler ignores completely. It comes in two flavors, a single line comment marked by `//`, and a comment sections between a `/*` and a `*/`:

```markdown
"What do you make of this?" she asked.
// Something unprintable...
"I couldn't possibly comment," I replied.
/*
... or an unlimited block of text
*/
```

```markdown
Hello world!
* Hello back!
    Nice to hear from you!
```

TODO: Write this section properly!

```markdown
Hello world
1: Hello back!
> 1
Hello back!
Nice to hear from you.

```markdown
A line of normal game-text. #blue
```

## Weave

So far, we've been building branched stories in the simplest way, with "options" that link to "pages" like a paper choose-your-own book. But this has a heavy overhead: it requires us to uniquely name every destination in the story and spread everything out, which can slow down writing and discourage minor branching. Often branching stories don't really want to branch at every choice. Sometimes a branch is a minor detour, sometimes it's purely one line of varying color.

Ink has a much more powerful syntax designed specifically for simplifying story flows which have an always-forwards direction (as most stories do, and most computer programs don't). This format is called "weave," and it's built out of the basic content/option syntax with two new features: the humble gather mark, `-`, and the nesting of choices and gathers.

### Gathers

#### Gather Points Gather the Flow

Let's go back to the first multi-choice example at the start of this book.

```markdown
"What's that?" my master asked.
    * "I am somewhat tired[."]," I repeated.
        "Really," he responded. "How deleterious."
    * "Nothing, Monsieur!"[] I replied.
        "Very good, then."
    * "I said, this journey is appalling[."] and I want no more of it."
    "Ah," he replied, not unkindly. "I see you are frustrated."
- With that, Monsieur Fogg left the room.
```

In a real game, all three of these options might well lead to the same conclusion—Monsieur Fogg leaves the room. We can do this using a gather, without the need to create any new knots or add any diverts.

That single `-` at the bottom tells ink this is a point that collects up all the flows above it, and it produces the following playthrough:

```markdown
"What's that?" my master asked.
1: "I am somewhat tired."
2: "Nothing, Monsieur!"
3: "I said, this journey is appalling."
> 1
"I am somewhat tired," I repeated.
"Really," he responded. "How deleterious."
With that, Monsieur Fogg left the room.
```

### Options and Gathers Form Chains of Content

We can string these gather-and-branch sections together to make branchy sequences that always run forwards.

```markdown
=== escape ===
I ran through the forest, the dogs snapping at my heels.

* I checked the jewels[] were still in my pocket, and the feel of them brought a spring to my step. <>
* I did not pause for breath[] but kept on running. <>
* I cheered with joy. <>
- The road could not be much further! Mackie would have the engine running, and then I'd be safe.
* I reached the road and looked about[]. And would you believe it?
* I should interrupt to say Mackie is normally very reliable[]. He's never once let me down. Or rather, never once, previously to that night.
- The road was empty. Mackie was nowhere to be seen.
```

This is the most basic kind of weave. The rest of this section details additional features that allow weaves to nest, contain side-tracks and diversions, divert within themselves, and use earlier choices to influence later ones.

### The Weave Philosophy

Weaves are more than just a convenient encapsulation of branching flow; they're also a way to author more robust content. The escape example above has already six possible routes through it, and a more complex sequence might have lots and lots more. Using normal diverts, one has to check the links by chasing the diverts from point to point, and it's easy for errors to creep in.

With a weave, the flow is guaranteed to start at the top and "fall" to the bottom. Flow errors are impossible in a basic weave structure, and the output text can be easily skim-read. That means there's no need to actually test all the branches in game to be sure they work as intended. (There may be continuity errors, but these are an order of magnitude less serious than the flow collapsing or ending up in the wrong place.)

Weaves also allow for easy redrafting of choice-points; in particular, it's easy to break a sentence up and insert additional choices for variety or pacing reasons, without having to re-engineer any of the flow before or after.

### Nested Flow

The weaves shown above are simple, dropdown structures. Whatever the player does, they take the same number of turns to get from top to bottom. However, sometimes certain choices warrant a bit more depth or complexity.

For that, we allow weaves to nest.

#### Options Can Be Nested

Consider the following scene:

```markdown
- "Well, Poirot? Murder or suicide?"
    * "Murder!"
    "And who did it?"
    * * "Detective-Inspector Japp!"
    * * "Captain Hastings!"
    * * "Myself!"
    * "Suicide!"
- Mrs. Christie lowered her manuscript a moment. The rest of the writing group sat, open-mouthed.
```

The first choice presented is "Murder!" or "Suicide!". If Poirot declares a suicide, there's no more to do, but in the case of murder, there's a follow-up question needed—whom does he suspect?

We can add new options via a set of nested sub-choices. We tell the script that these new choices are "part of" another choice by using two asterisks, instead of just one.

```markdown
- "Well, Poirot? Murder or suicide?"
    * "Murder!"
        "And who did it?"
        * * "Detective-Inspector Japp!"
        * * "Captain Hastings!"
        * * "Myself!"
    * "Suicide!"
- Mrs. Christie lowered her manuscript a moment. The rest of the writing group sat, open-mouthed.
```

(Note that it's good style to also indent the lines to show the nesting, but the compiler doesn't mind.)

Should we want to add new sub-options to the other route, we do that in a similar fashion.

```markdown
- "Well, Poirot? Murder or suicide?"
    * "Murder!"
        "And who did it?"
        * * "Detective-Inspector Japp!"
        * * "Captain Hastings!"
        * * "Myself!"
    * "Suicide!"
        "Really, Poirot? Are you quite sure?"
        * * "Quite sure."
        * * "It is perfectly obvious."
- Mrs. Christie lowered her manuscript a moment. The rest of the writing group sat, open-mouthed.
```

Now, that initial choice of accusation will lead to specific follow-up questions—but either way, the flow will still come back together at the gather point, for Mrs. Christie's cameo appearance.

#### Gather Points Can Be Nested Too

Sometimes, it's not a question of expanding the number of options, but having more than one additional beat of story. We can do this by nesting gather points as well as options.

```markdown
- "Well, Poirot? Murder or suicide?"
    * "Murder!"
        "And who did it?"
        * * "Detective-Inspector Japp!"
        * * "Captain Hastings!"
        * * "Myself!"
        - - "You must be joking!"
        * * "Mon ami, I am deadly serious."
        * * "If only..."
    * "Suicide!"
        "Really, Poirot? Are you quite sure?"
        * * "Quite sure."
        * * "It is perfectly obvious."
        - - "Well, blimey."
- Mrs. Christie lowered her manuscript a moment. The rest of the writing group sat, open-mouthed.
```

If the player chooses the "murder" option, they'll have two choices in a row on their sub-branch—a whole flat weave, just for them.

### Advanced: What Gathers Do

Gathers are hopefully intuitive, but their behavior is a little harder to put into words: in general, after an option has been taken, the story finds the next gather down that isn't on a more nested level, and diverts to it.

The basic idea is this: options separate the paths of the story, and gathers bring them back together. (Hence the name, "weave"!)

#### You Can Nest as Many Levels as You Like

Above, we used two levels of nesting; the main flow, and the sub-flow. But there's no limit to how many levels deep you can go.

```markdown
- "Tell us a tale, Captain!"
    * "Very well, you sea-dogs. Here's a tale..."
    * * "It was a dark and stormy night..."
        * * * "...and the crew were restless..."
        * * * * "... and they said to their Captain..."
                            * * * * * "...Tell us a tale Captain!"
    * "No, it's past your bed-time."
- To a man, the crew began to yawn.
```

After a while, this sub-nesting gets hard to read and manipulate, so it's good practice to divert away to a new stitch if a side-choice goes unwieldy. But, in theory at least, you could write your entire story as a single weave.

### Example: A Conversation with Nested Nodes

Here's a longer example:

```markdown
- I looked at Monsieur Fogg
    * ... and I could contain myself no longer[].
    'What is the purpose of our journey, Monsieur?'
    'A wager,' he replied.
* * 'A wager!'[] I returned.
        He nodded.
* * * 'But surely that is foolishness!'
    * * * 'A most serious matter then!'
    - - - He nodded again.
* * * 'But can we win?'
                            'That is what we will endeavour to find out,' he answered.
* * * 'A modest wager, I trust?'
                            'Twenty thousand pounds,' he replied, quite flatly.
* * * I asked nothing further of him then[.], and after a final, polite cough, he offered nothing more to me. <>
    * * 'Ah[.'],' I replied, uncertain what I thought.
-     - After that, <>
* ... but I said nothing[] and <>
* ... and was so overcome I stared at my shoes[], and in this manner, <>
- we passed the day in silence.
```

With a couple of possible playthroughs. A short one:

```markdown
I looked at Monsieur Fogg
1: ... and I could contain myself no longer
2: ... but I said nothing
3: ... and was so overcome I stared at my shoes
> 2
... but I said nothing and we passed the day in silence.
```

And a longer one:

```markdown
I looked at Monsieur Fogg
1: ... and I could contain myself no longer
2: ... but I said nothing
3: ... and was so overcome I stared at my shoes
> 1
... and I could contain myself no longer.
'What is the purpose of our journey, Monsieur?'
'A wager,' he replied.
1: 'A wager!'
2: 'Ah.'
> 1
'A wager!' I returned.
He nodded.
1: 'But surely that is foolishness!'
2: 'A most serious matter then!'
> 2
'A most serious matter then!'
He nodded again.

1: 'But can we win?'
2: 'A modest wager, I trust?'
3: I asked nothing further of him then.
> 2
'A modest wager, I trust?'
'Twenty thousand pounds,' he replied, quite flatly.
After that, we passed the day in silence.
```

Hopefully, this demonstrates the philosophy laid out above: that weaves offer a compact way to offer a lot of branching, a lot of choices, but with the guarantee of getting from beginning to end!

### Tracking a Weave

Sometimes, the weave structure is sufficient. When it's not, we need a bit more control.

#### Weaves are Largely Unaddressed

By default, lines of content in a weave don't have an address or label, which means they can't be diverted to and they can't be tested for. In the most basic weave structure, choices vary the path the player takes through the weave and what they see, but once the weave is finished, those choices and that path are forgotten.

But should we want to remember what the player has seen, we can—we add in labels where they're needed using the `(label_name)` syntax.

#### Gathers and Options Can Be Labelled

Gather points at any nested level can be labelled using brackets.

```markdown
- (top_bit)
    - (middle_bit)
```

Once labelled, gather points can be diverted to, or tested for in conditionals, just like knots and stitches. This means you can use previous decisions to alter later outcomes inside the weave, while still keeping all the advantages of a clear, reliable forward-flow.

Options can also be labelled, just like gather points, using brackets. Label brackets come before conditions in the line.

```markdown
    * (insult_the_guard) { bravery >= 5 } "Oi! Lug-head!"
```

These addresses can be used in conditional tests, which can be useful for creating options unlocked by other options.

```markdown
=== meet_guard ===
    The guard frowns at you.
    * (greet) [Greet him] 'Greetings.'
    * (get_out) 'Get out of my way[.'],' you tell the guard.
- 'Hmm,' replies the guard.
    * {greet} 'Having a nice day?' // only if you greeted him
    * 'Hmm?'[] you reply.
    * {get_out} [Shove him aside] // only if you threatened him
    You shove him sharply.
    -> fight_guard // we're off to have a fight now
- 'Mff,' the guard replies, offering a paper bag. 'Toffee?'
```

### Scope

Inside the same stitch, you can use a label name directly—it's the local address of a gather or option. From outside the block, you need to provide a more detailed address name, either to a different stitch within the same knot:

```markdown
=== knot ===
= stitch_one
- (gatherpoint) Some content.
= stitch_two
    * {stitch_one.gatherpoint} Option
```

... or pointing into another knot:

```markdown
=== knot_one ===
    * (option_one) {knot_two.stitch_two.gather_two} Option
=== knot_two ===
= stitch_two
- (gather_two)
    * {knot_one.option_one } Option
```

### Advanced: All Options Can Be Labelled

In truth, all content in ink is a weave, even if there are no gathers in sight, and you can label any option in the game with a bracket label and then reference it using the addressing syntax.

```markdown
=== fight_guard ===
    * throw_something
    * (rock) [Throw rock at guard] -> throw
    * (sand) [Throw sand at guard] -> throw
= throw
    You hurl {throw_something.rock:a rock|a handful of sand} at the guard.
```

### Advanced: Loops in a Weave

Labelling gathers allows us to neatly create loops inside weaves. Here's a standard pattern for asking questions of an NPC.

```markdown
- (opts)
    * 'Can I get a uniform from somewhere?'[] you ask the cheerful guard.
    'Sure. In the locker.' He grins. 'Don't think it'll fit you, though.'
* 'Tell me about the security system.'
'It's ancient,' the guard assures you. 'Old as coal.'
* 'Are there dogs?'
'Hundreds,' the guard answers, with a toothy grin. 'Hungry devils, too.'
// We require the player to ask at least one question here
* {loop} [Enough talking]
-> done
- (loop)
// loop a few times before the guard gets bored
{ -> opts | -> opts | }
He scratches his head.
'Well, can't stand around talking all day,' he declares.
- (done)
You thank the guard, and move away.
```

### Advanced: Diverting to Options

Options can also be diverted to: the divert goes to the output of having chosen that choice as though the choice had been chosen. So the content printed will ignore square bracketed text, and if the option is once-only, it will be marked as used up.

```markdown
- (opts)
    * [Pull a face]
        You pull a face, and the soldier comes at you! -> shove
    * (shove) [Shove the guard aside]
        You shove the guard to one side, but he comes back swinging.
    * {shove} [Grapple and fight] -> fight_the_guard
- -> opts
```

This produces:

```markdown
1: Pull a face
2: Shove the guard aside
> 1
You pull a face, and the soldier comes at you! You shove the guard to one side, but he comes back swinging.

1: Grapple and fight
>
```

### Advanced: Gathers Directly After an Option

The following is valid, and frequently useful.

```markdown
    * "Are you quite well, Monsieur?"[] I asked.
        - - (quite_well) "Quite well," he replied.
    * "How did you do at the crossword, Monsieur?"[] I asked.
        -> quite_well
    * I said nothing[] and neither did my Master.
- We fell into companionable silence once more.
```

Note the second-level gather point `quite_well` directly below the first option: there's nothing to gather here, really, but it gives us a handy place to divert the second option to, so we can write fewer lines while still conveying Fogg's character.

## Variables and Logic

So far we've written conditional text, and conditional choices, using tests based on what content the player has seen so far. Ink also supports variables, both temporary and global, for storing numerical and content data, and even story flow commands. The language is fully-featured in terms of logic, strongly-featured for mathematics, and contains a few additional structures to help keep the often complex logic of a branching story better organized.

That said, you can write a pretty good adaptive story without ever reading another page of this manual if you prefer. If you take that route, goodbye! May this book act as a good object on which to rest your coffee cup. If, however, you wish to press onwards, please note that things will become more a little more programmery from here.

### Global Variables

The most powerful kind of variable, and arguably the most useful for a story, is a variable to store some unique property about the state of the game—anything from the amount of money in the protagonist's pocket, to a value representing the protagonist's state of mind.

This kind of variable is called "global" because it can be fully accessed from anywhere in the story—it can be both set, and read, at any time. (Traditionally, programming tries to avoid this kind of thing, as it allows one part of a program to mess with another, unrelated part. But a story is a story, and stories are all about consequences: what happens in Vegas rarely stays there.)

#### Defining Global Variables

Global variables can be defined anywhere, via a `VAR` statement. They should be given an initial value, which defines what type of variable they are—integer, floating point (decimal), content, or a story address.

```markdown
VAR knowledge_of_the_cure = false
VAR players_name = "Emilia"
VAR number_of_infected_people = 521
VAR current_epilogue = -> they_all_die_of_the_plague
```

#### Using Global Variables

We can test global variables to control options, and provide conditional text, in a similar way to what we have previously seen.

```markdown
=== the_train ===
    The train jolted and rattled. { mood > 0:I was feeling positive enough, however, and did not mind the odd bump|It was more than I could bear}.
    * { not knows_about_wager } 'But, Monsieur, why are we travelling?'[] I asked.
    * { knows_about_wager} I contemplated our strange adventure[]. Would it be possible?
```

### Advanced: Storing Diverts as Variables

A "divert" statement is actually a type of value in itself, and can be stored, altered, and diverted to.

```markdown
VAR current_epilogue = -> everybody_dies
=== continue_or_quit ===
    Give up now, or keep trying to save your Kingdom?
    * [Keep trying!] -> more_hopeless_introspection
    * [Give up] -> current_epilogue
```

#### Advanced: Global Variables are Externally Visible

Global variables can be accessed, and altered, from the runtime as well from the story, so they provide a good way to for the game to snoop on what's going on in the story.

The ink layer can also be a good place to store wider gameplay variables: saving and loading is handled for you and the story itself can react to the current values.

#### Printing Variables

The value of a variable can be printed out as content using an inline syntax similar to sequences and conditional text:

```markdown
VAR friendly_name_of_player = "Jackie"
VAR age = 23
My name is Jean Passepartout, but my friend's call me {friendly_name_of_player}. I'm {age} years old.
```

This can be useful in debugging as well as in the normal course of the story. (And for more complex printing based on logic and variables, see the chapter on functions.)

### Evaluating Strings

It might be noticed that above we referred to variables as being able to contain "content," rather than "strings." That was deliberate, because a string defined in ink can contain ink—although it will always evaluate to a string. (Yikes!)

```markdown
VAR a_colour = ""
~ a_colour = "{~red|blue|green|yellow}"
{a_colour}
```

... produces one of red, blue, green or yellow.
Note that once a piece of content like this is evaluated, its value is "sticky." (The quantum state collapses.) So the following:

```markdown
The goon hits you, and sparks fly before your eyes, {a_colour} and {a_colour}.
```

won't produce a very interesting effect. (If you really want this to work, use a text function to print the color!)

This is also why the initial value of a string can't contain logic, so:

```markdown
VAR a_colour = "{~red|blue|green|yellow}"
```

is explicitly disallowed; it would be evaluated on the construction of the story, which probably isn't what you want.

### Logic

#### Assignment

Obviously, global variables are not intended to be constant, so we need a syntax for altering them.

By default, any text in an ink script is printed out directly; so we use a markup symbol, `~`, to indicate when a line of content is actually intended to be doing some numerical work.

The following statements all assign values to variables, doing more or less work along the way:

```markdown
=== set_some_variables ===
    ~ knows_about_wager = true
    ~ x = (x * x) - (y * y) + c
    ~ y = 2 * x * y
```

#### Mathematics

Ink can do maths, and perform basic mathematical tests. The following tests various numerical conditions:

```markdown
{ x == 1.2 }
{ x != 0 }
{ x / 2 > 4 }
{ y - 1 <= x * x }
```

Alongside the core mathematical operations (`+`, `-`, `*`, and `/`), ink supports `%` (or mod), returning the remainder after integer division (so `12 % 5 == 2`). There's also `MIN(a, b)` and `MAX(c, d)`, and `POW` for doing to-the-power-of:

```markdown
{MIN(7, -3)} is -3.
{POW(3, 2)} is 9.
{POW(16, 0.5)} is 4. // power of 0.5 is square root
```

Operations can be nested using brackets in the normal way:

```markdown
{ (MIN(POW(x, 2), POW(y, 3)) <= MAX(k mod 3, (4 * k) mod 5) }
```

If more complex operations are required, one can write functions (using recursion if necessary), or call out to external, game-code functions (for anything more advanced). There's a section on this coming up.

#### Increment and Decrement

Ink supports increment and decrement shorthand for addition and subtraction only.

```markdown
~ x ++ // means ~ x = x + 1
~ x -- // means ~ x = x - 1
~ x += 3 // means ~ x = x + 3
~ x -= 5 // means ~ x = x - 5
```

#### RANDOM(min, max)

Ink can generate random integers if required using the `RANDOM` function. `RANDOM` is authored to be like a dice (yes, pendants, we said a dice), so the min and max values are both inclusive.

```markdown
~ temp dice_roll = RANDOM(1, 6)
~ temp lazy_grading_for_test_paper = RANDOM(30, 75)
~ temp number_of_heads_the_serpent_has = RANDOM(3, 8)
```

Recall that the random number generator can be seeded for testing purposes using `SEED_RANDOM()` (as detailed in Game Queries and Functions section above).

#### Advanced: Numerical Types are Implicit

Results of operations—in particular, for division—are typed based on the type of the input. So while floating point division returns floating point results, integer division returns integer results. (This is usually really unexpected and annoying.)

```markdown
~ x = 2 / 3 // => x = 0
~ y = 7 / 3 // => y = 2
~ z = 1.2 / 0.5 // => z = 2.4
```

#### Advanced: INT(), FLOOR(), and FLOAT()

In cases where you don't want implicit types, you want to force a decimal division, or you want to round off a variable, you can cast it directly.

```markdown
{INT(3.2)} is 3.
{FLOOR(4.8)} is 4.
{INT(-4.8)} is -4.
{FLOOR(-4.8)} is -5.
{FLOAT(4)} is, um, still 4.
{FLOAT(2) / 3} is 0.666667. // nobody's perfect
```

`FLOOR` returns the highest integer less than or equal to the given number. `INT` returns the integer part. `FLOAT` returns the same value, but as a floating point number.

#### Example: Generating Random Floats

Ink doesn't have a method for generating a random floating-point number, and since `RANDOM()` returns an integer, the following will always produce 0.

```markdown
RANDOM(1, 10000) / 10000
```

To resolve this, you need to force the division into floating point, either properly:

```markdown
FLOAT(RANDOM(1, 10000)) / 10000
```

or hackily:

```markdown
RANDOM(1, 10000) / 9999.9999
```

#### String Handling

Oddly enough for a text-engine, ink doesn't have much in the way of string-handling: it's assumed that any string conversion you need to do will be handled by the game code (and perhaps by external functions—see the chapter in Running Your Ink for an example!).

But you can do some basic string operations and queries.

##### Concatenation

Strings can be concatenated, either directly:

```markdown
name = first_name + " " + second_name
```

Or more powerfully, by using the fact that strings are actually ink:

```markdown
~ name = "{first_name} {second_name}"
~ magician_name = "the {\~marvellous | mysterious} {second_name}"
```

The following is valid:

```markdown
~ surname += "Darcy"
```

The following isn't:

```markdown
~ surname -= "Bennett"
```

##### String Queries

Ink supports four string queries—equality, inequality, substring (which we call `?` for reasons that will become clear in a later chapter), and inverse substring (inexplicably called `!?`).

The following will all return true:

```markdown
{ "Yes please." == "Yes please." } // eggs is eggs
{ "No." != "Yes, really." } // no does not mean yes
{ "pirate" ? "irate" } // pirates are angry
{ "team" !? "I" } // there's no I in team
```

##### Example: A or An?

It would be nice to be able to write something like:

```markdown
I put {a("cat")} and {a("ape")} into {a("old box")} with {a("elephant")}.
```

... for use in cases where those strings are actually variable: here's an implementation for that.

``````markdown
=== function a(x)
    ~ temp stringWithStartMarker = "^" + x
    { stringWithStartMarker ? "^a" or
stringWithStartMarker ? "^A" or
stringWithStartMarker ? "^e" or
stringWithStartMarker ? "^E" or
stringWithStartMarker ? "^i" or
stringWithStartMarker ? "^I" or
stringWithStartMarker ? "^o" or
stringWithStartMarker ? "^O" or
stringWithStartMarker ? "^u" or
stringWithStartMarker ? "^U" :

        an {x}
- else:
        a {x}
}
```

### Conditional Blocks (if/else)

We've seen conditionals used to control options and story content; ink also provides an equivalent of the normal if/else-if/else structure.

#### A Simple If

The if syntax takes its cue from the other conditionals used so far, with the `{...}` syntax indicating that something is being tested.

```
{ x > 0:
    ~ y = x - 1
}
```

Else conditions can be provided:

```
{ x > 0:
    ~ y = x - 1
- else:
    ~ y = x + 1
}
```

#### Extended if/else if/else Blocks

The above syntax is actually a specific case of a more general structure, something like a "switch" statement of another language:

```
{
- x == 0:
    ~ y = 0
- x > 0:
    ~ y = x - 1
- else:
    ~ y = x + 1
}
```

(Note, as with everything else, the white-space is purely for readability and has no syntactic meaning.)

#### Switch Blocks

And there's also an actual switch statement, where the value of a variable is used to decide which block to use:

```
{ x:
- 0: zero
- 1: one
- 2: two
- else: lots
}
{ day:
- "Monday": "I hate Mondays."
- "Tuesday": "Tuesdays are okay, I guess."
- "Wednesday": "No one likes Wednesdays, do they?"
- else: "It'll be Monday soon."
}
```

#### Example: Context-Relevant Content

Note these tests don't have to be variable-based and can use read counts, just as other conditionals can. The following construction is frequent as a way of saying "do some content which is relevant to the current game state":

```
=== dream ===
{
- visited_snakes && not dream_about_snakes:
    ~ fear++
    -> dream_about_snakes
- visited_poland && not dream_about_polish_beer:
    ~ fear--
    -> dream_about_polish_beer
- else:
// breakfast-based dreams have no effect
```
