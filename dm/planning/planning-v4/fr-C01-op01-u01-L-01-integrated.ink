// FRENCH LESSON 1: Hotel Infiltration
// Integrates Pimsleur French I Lesson 1 content

VAR cover_integrity = 85
VAR intel_points = 0
VAR lesson_complete = false
VAR knows_pardon = false
VAR knows_comprendre = false
VAR knows_anglais = false

-> mission_brief

=== mission_brief ===
/* LOCATION: Safe house, 3 blocks from target hotel
   TIME: 0800 hours
   Drake adjusts his neural contacts while Sheldon monitors from his laptop */

SHELDON: "Alright Drake, first test of the neural link system. Your cover is a Canadian tourist checking into the Grand Hotel."

DRAKE: "Canadian? Really?"

SHELDON: "Trust me, it'll help explain any accent issues. Now, the hotel clerk only speaks French. You'll need to communicate without blowing your cover."

DRAKE: "So what's the objective?"

SHELDON: "Intel suggests our target frequents the hotel bar. Get checked in, establish your cover, and we'll move to phase two. Remember - the neural link will help, but you need to internalize these phrases."

* [Let's do this] -> hotel_entrance
* [Review the phrases first] -> quick_review

=== quick_review ===
SHELDON: "Smart. Let's go over the basics. In French, when you need to get someone's attention politely, you say..."

// PIMSLEUR CONTENT BEGINS
-> teach_pardon ->

SHELDON: "Good. Now, you'll need to ask if they understand English. The word for 'understand' is key here..."

-> teach_comprendre ->

SHELDON: "Perfect. And the word for 'English' itself..."

-> teach_anglais ->

SHELDON: "Alright, you're ready. Let's move."

-> hotel_entrance

=== hotel_entrance ===
/* FADE IN: Grand Hotel Cannes - Lobby
   Marble floors, crystal chandeliers. Drake enters, pulling a small suitcase.
   The DESK CLERK (fox, 40s, impeccable suit) looks up from his computer. */

You approach the front desk. The clerk hasn't noticed you yet.

* [Clear your throat] -> get_attention_fail
* [Say "Excuse me"] -> get_attention_success
* {knows_pardon} [Say "Pardon"] -> get_attention_perfect

=== get_attention_fail ===
You clear your throat loudly. "Ahem!"

The clerk looks up with mild annoyance. His eyes narrow slightly.

~ cover_integrity -= 5

CLERK: "Oui?" 

// His tone is curt. Not a great start.

SHELDON: (through earpiece) "Drake, you need to be more polite. Try 'Pardon' - it means 'excuse me'."

-> teach_pardon ->

-> clerk_conversation

=== get_attention_success ===
"Excuse me," you say in English.

The clerk looks up politely but responds in rapid French.

CLERK: "Bonjour monsieur, comment puis-je vous aider?"

You don't understand a word. Your confusion must show.

SHELDON: (through earpiece) "He's asking how he can help. But you need to speak French. The word is 'Pardon'."

-> teach_pardon ->

-> clerk_conversation

=== get_attention_perfect ===
"Pardon," you say with careful pronunciation.

The clerk immediately smiles and gives you his full attention.

~ intel_points += 10
~ cover_integrity += 2

CLERK: "Oui, monsieur? Comment puis-je vous aider?"

SHELDON: (through earpiece) "Perfect! He's asking how he can help. Now you need to find out if he speaks English."

-> clerk_conversation

=== teach_pardon ===
// TEACHING MOMENT: "Pardon" (Excuse me)

SHELDON: "Listen carefully and repeat after the example."

NEURAL LINK: "Par-don"

* [Try to say it: "Par-dawn"] -> pardon_attempt_1
* [Try to say it: "Par-don"] -> pardon_success
* [Try to say it: "Pear-dun"] -> pardon_attempt_2

= pardon_attempt_1
SHELDON: "Close, but the 'don' sounds more like 'dohn'. Try again."

NEURAL LINK: "Par-don"

* [Say: "Par-don"] -> pardon_success

= pardon_attempt_2  
SHELDON: "Not quite. It's not 'pear', it's 'par' - like in 'park'. Try again."

NEURAL LINK: "Par-don"

* [Say: "Par-don"] -> pardon_success

= pardon_success
SHELDON: "Excellent! You've got it."

~ knows_pardon = true
~ intel_points += 5

->->

=== teach_comprendre ===
// TEACHING MOMENT: "Comprenez" (Understand)

SHELDON: "The word for 'understand' is 'comprenez'. Let me break it down."

NEURAL LINK: "Com-pre-nez"

* [Try: "Com-pree-nay"] -> comprendre_attempt_1
* [Try: "Com-pren-ez"] -> comprendre_success
* [Try: "Com-prend"] -> comprendre_attempt_2

= comprendre_attempt_1
SHELDON: "Almost! The middle part is 'pren' not 'pree'. Try again."

* [Say: "Com-pren-ez"] -> comprendre_success

= comprendre_attempt_2
SHELDON: "You need the ending - 'ez'. It's 'com-pren-EZ'."

* [Say: "Com-pren-ez"] -> comprendre_success

= comprendre_success
SHELDON: "Perfect! That's how you say 'understand'."

~ knows_comprendre = true
~ intel_points += 5

->->

=== teach_anglais ===
// TEACHING MOMENT: "L'anglais" (English)

SHELDON: "Now for 'English' - in French it's 'l'anglais'. The 'L' at the beginning means 'the'."

NEURAL LINK: "L'an-glais"

* [Try: "Lang-lays"] -> anglais_attempt_1
* [Try: "L'an-glais"] -> anglais_success
* [Try: "An-glaze"] -> anglais_attempt_2

= anglais_attempt_1
SHELDON: "Close! Remember to separate the 'L' slightly - 'L'an-glais'."

* [Say: "L'an-glais"] -> anglais_success

= anglais_attempt_2
SHELDON: "You're missing the 'L' at the start, and it's 'glay' not 'glaze'."

* [Say: "L'an-glais"] -> anglais_success

= anglais_success
SHELDON: "Excellent! You're getting the hang of this."

~ knows_anglais = true
~ intel_points += 5

->->

=== clerk_conversation ===
The clerk is waiting for your response. You need to ask if he understands English.

{ not knows_comprendre or not knows_anglais:
    SHELDON: "You need to ask 'Do you understand English?' Let me teach you the words..."
    
    { not knows_comprendre:
        -> teach_comprendre ->
    }
    
    { not knows_anglais:
        -> teach_anglais ->
    }
    
    SHELDON: "Now, to make it a question, put 'Est-ce que' at the beginning. Try: 'Est-ce que vous comprenez l'anglais?'"
}

* [Say: "You speak English?"] -> english_attempt
* [Say: "Est-ce que vous comprenez l'anglais?"] -> perfect_question
* [Say: "Comprenez l'anglais?"] -> partial_success
* [Use the neural link overlay] -> cheat_option

=== english_attempt ===
You ask in English: "Do you speak English?"

The clerk's expression hardens slightly.

CLERK: "Non, monsieur. Je ne comprends pas l'anglais."

~ cover_integrity -= 10

SHELDON: "He says he doesn't understand English. And now he's suspicious. You HAVE to use French!"

-> try_again_french

=== perfect_question ===
"Est-ce que vous comprenez l'anglais?" you ask, the words flowing more naturally than expected.

The clerk's expression softens. He responds with a slight smile:

CLERK: "Non, monsieur. Je ne comprends pas l'anglais. Mais vous parlez un peu français, oui?"

~ intel_points += 15
~ cover_integrity += 5

SHELDON: "Brilliant! He says he doesn't understand English, but he noticed you speak some French. This is good for your cover."

-> continue_checkin

=== partial_success ===
"Comprenez l'anglais?" you manage.

The clerk understands but notices your grammar isn't quite right.

CLERK: "Non, monsieur. Je ne comprends pas l'anglais."

~ intel_points += 5

SHELDON: "He understood, but you should have used 'Est-ce que' to make it a proper question. Still, not bad."

-> continue_checkin

=== cheat_option ===
You tap your temple, activating the neural link's translation overlay. Glowing text appears in your vision:

OVERLAY: "Est-ce que vous comprenez l'anglais?"

You read it aloud, but your reliance on the tech is obvious in your halting delivery.

CLERK: "Non, monsieur. Je ne comprends pas l'anglais."

~ cover_integrity -= 15

SHELDON: "Drake! Using the overlay that obviously is risky. The whole point is to internalize the language!"

-> continue_checkin

=== try_again_french ===
SHELDON: "Quick, salvage this. Say 'Pardon' and then ask properly in French."

* {knows_pardon} [Say "Pardon, est-ce que vous comprenez l'anglais?"] -> recovery_success
* [Panic and stay silent] -> mission_fail

=== recovery_success ===
"Pardon," you say, then carefully: "Est-ce que vous comprenez l'anglais?"

The clerk's expression softens slightly.

CLERK: "Ah, vous essayez. C'est bien. Non, je ne comprends pas l'anglais, mais je peux vous aider en français."

~ cover_integrity += 3

SHELDON: "Good recovery. He appreciates that you're trying."

-> continue_checkin

=== continue_checkin ===
The clerk switches to slower, simpler French, gesturing at the computer.

CLERK: "Votre nom, monsieur?"

SHELDON: "He's asking for your name. Just give your cover name - you can say that in English."

DRAKE: "Drake Matthews."

CLERK: "Merci, Monsieur Matthews. Un moment..."

He types, then hands you a key card.

CLERK: "Chambre 512. Cinquième étage."

He points to the elevators.

* [Say "Thank you"] -> english_thanks
* {knows_pardon} [Say "Merci"] -> french_thanks
* [Just nod and go] -> silent_exit

=== english_thanks ===
"Thank you," you say in English.

The clerk nods politely but says nothing more.

~ cover_integrity -= 2

-> mission_complete

=== french_thanks ===
"Merci," you say, attempting the French pronunciation.

The clerk smiles genuinely.

CLERK: "De rien, monsieur. Bon séjour!"

~ intel_points += 10

-> mission_complete

=== silent_exit ===
You nod and head for the elevators without a word.

-> mission_complete

=== mission_complete ===
/* LOCATION: Hotel room 512
   Drake enters and immediately checks for bugs */

SHELDON: "Alright, we're in. Let's debrief."

Cover Integrity: {cover_integrity}%
Intel Points: {intel_points}

{cover_integrity >= 80:
    SHELDON: "Excellent work! Your French was convincing enough. The clerk suspects nothing."
    
    Achievement Unlocked: Smooth Operator
}
{cover_integrity >= 60 && cover_integrity < 80:
    SHELDON: "Not bad for your first field test. Some rough edges, but you maintained cover."
}
{cover_integrity < 60:
    SHELDON: "That was rough, Drake. We need more practice before the next phase."
}

{intel_points >= 30:
    SHELDON: "Also, you've gathered valuable intel on the hotel's operations. This will help in phase two."
}

~ lesson_complete = true

* [Continue to next mission] -> END
* [Practice more French] -> bonus_practice

=== bonus_practice ===
SHELDON: "Good idea. Let's review what you learned."

// This would lead to exercise reviews
-> END

=== mission_fail ===
You freeze, unable to respond. The clerk's suspicion is now obvious.

CLERK: "Un moment, monsieur..." 

He reaches for the phone.

SHELDON: "Abort! ABORT! Get out of there!"

~ cover_integrity = 0

MISSION FAILED
Cover Integrity: 0%

-> END 