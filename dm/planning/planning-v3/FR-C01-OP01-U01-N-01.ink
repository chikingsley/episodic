var=FR_LEVEL_CLAIM

-> intro_jet
=== intro_jet ===
/* FADE IN: PRIVATE JET - 30,000 FEET - NIGHT
Ambient engine noise. Luxurious but practical interior.
DRAKE (Duck, player) is stretched out on a bench seat, half-asleep.
SHELDON (Turtle) sits with headphones on, bobbing to music while reviewing files.
*/
// Phone buzzes. Sheldon removes one headphone and answers.
SHELDON: "Sheldon here. Secure line."
// Pause.
SHELDON: "Yes, sir."
// Pause.
SHELDON: "I understand."
// Pause.
SHELDON: "Right away, sir."
// Sheldon hangs up, stares at his phone, then puts his head in his hands.
DRAKE: (sitting up) "What's up?"
SHELDON: (gravely) "They got Stella."
DRAKE: "Huh? Who g...
SHELDON: (agitated) "Paris. She's been dark for 36 hours. Last transmission came from the 4th arrondissement."
DRAKE: "Fuuuck. Soo... fuuuck, I mean well... who are they sending to go find her?"
// Sheldon looks up at Drake. The look says it all
DRAKE: "Nah."
SHELDON: "Man..."
* [I'm not going to France bro] -> refused_paris
* [Why us?]  
    SHELDON: "You and I both know we're the best agents on this side of the world. Should be light work. Intel says it was the Syndicate... low level gang shit. should be light work. what do you say? 
    ** [I mean it's not like I have a choice] -> resigned_paris
    ** [Nah, maaan, that's not the plan. You know I've been looking forward to Spain since] -> refused_paris

=refused_paris
SHELDON: (interrupting) "Lock the fuck in bro, it's not a fuckin debate. that was the Central Five on the phone."
DRAKE: "One of the fucking Central Five called you?? like Network Executives??"
// The Network is a secret group of spys that control the worlds water supply. Sheldon and Drake are freelancers
-> going_to_paris

=resigned_paris
SHELDON: "Hey man. I'm sorry about this shit. Truly. But this is part of the job.
// Drake signs
-> going_to_paris

= going_to_paris
SHELDON: "man. this is next level shit. Something big is happening. big big. and we'll find out when we touch down in 3 hours."
DRAKE: "You are right but this sucks."
SHELDON: "The real question is, how is your French? I think I remember your file saying you were fluent.."
* [I'm new to French] 
    FR_LEVEL_CLAIM=1
    -> overlay_on
* [I know some common words] 
    FR_LEVEL_CLAIM=2
    -> overlay_on
* [I can have basic conversations.]
    FR_LEVEL_CLAIM=3
    -> overlay_on
* [Pretty solid! I can talk about various topics]
    FR_LEVEL_CLAIM=4
    -> overlay_off
* [My french is great! Nothing to worry about haha] 
    FR_LEVEL_CLAIM=5
    -> overlay_off
    
=overlay_off
SHELDON: "Sick - this'll be a breeze then!"
DRAKE: "Honestly, I could take down more birds in Paris than I would have in Barcelona"
SHELDON: "Sure man haha. First things first though... Let's find Stella. Here..
//SHELDON hands Drake a tablet
SHELDON: "Even though it's good, it would be a good idea to brush up on some basics before we land." 
/* FADE TO BLACK */
-> lsn_greetings_01

=overlay_on
DRAKE: "I may have exaggerated my proficiency on my agency profile..."
SHELDON: "Exaggerated how much?"
DRAKE: (jokingly) "you know those neural contacts.. they had just come out and i mean. they helped a lot.."
SHELDON: (incredulous) "soo.."
DRAKE: " i mean i can say bon jor [say it super american]. bon jor bon jor,  voulez vous couchez avec moi... haha
SHELDON: (calmly) "We're fucked"
DRAKE: (defensive) "I needed the fuckin work, okay! I'm good wi.."
SHELDON: (composed, interrupting) "we're about to drop into a foreign fuckin country, ops crawling all over the city looking for idiots like us, and you don't speak French?!"
DRAKE: (thinking, then brightening) "Wait, wait—I have something."
// Drake digs into his bag. then another bag, then another then, pulls out a sleek case containing high-tech contact lenses.
DRAKE: "AHA! I still have them! Neural-linked contacts."
// He taps his tablet, bringing up technical specs.
DRAKE: "They'll connect to my optical nerve and cochlear implant. You'll see what I see, hear what I hear."
SHELDON: "So?"
DRAKE: "So, you'll be my handler! I'll be in the field, but you'll pick the responses. The contacts have a translation overlay. You select the right French phrase, I repeat it."
SHELDON: "That's your plan? Turn me into your puppetmaster?"
DRAKE: "Look, we've got 3 hours. The system has built-in training modules. You start learning now, then feed me lines when we land. I'll reprogram the system to store the words and phrases... Soon, I'll start recognizing patterns."
SHELDON: (skeptical) "okay.. hmm.. okay And if I pick wrong?"
DRAKE: (grim) "Cover blown. Mission compromised. Stella stays missing and we probably go missing too."
// Sheldon considers, then sighs.
SHELDON: "Fuck it. Give me that shit."
// Drake hands over the tablet, grinning with relief.
DRAKE: (jokingly sings) "Voulez vous couchez av..."
// Sheldon shoves him hard trying not to crack a smile
SHELDON: "This better work asshole. and work on your fucking accent."
/* FADE TO BLACK */
-> lsn_greetings_01

DRAKE: "By the way, the program tracks your progress with something called 'Cover Integrity.' Keep it above 25% or we're toast."

// Sheldon looks at the tablet, sees "COVER INTEGRITY: 85%" displayed.

SHELDON: "Alright, let's do this. Operation Dark Mallard is a go."

/* FADE TO BLACK */
-> END