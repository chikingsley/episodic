import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const initSpanishCourse = mutation({
  args: {},
  handler: async (ctx) => {
    // Create Spanish course
    const courseId = await ctx.db.insert("courses", {
      name: "Spanish for Beginners",
      description: "Learn basic Spanish vocabulary and phrases",
      language: "Spanish",
    });

    // Greetings lesson
    await ctx.db.insert("lessons", {
      courseId,
      name: "Basic Greetings",
      type: "multiple_choice",
      questions: [
        {
          type: "translation",
          text: "How do you say 'Hello' in Spanish?",
          options: ["Hola", "Gracias", "Por favor", "Adiós"],
          correctAnswer: "Hola",
          explanation: "'Hola' means 'Hello' in Spanish",
          xp: 10,
        },
        {
          type: "translation",
          text: "What does 'Buenos días' mean?",
          options: ["Good morning", "Good afternoon", "Good evening", "Good night"],
          correctAnswer: "Good morning",
          explanation: "'Buenos días' is used to say 'Good morning'",
          xp: 10,
        },
        {
          type: "translation",
          text: "How do you say 'Goodbye' in Spanish?",
          options: ["Adiós", "Gracias", "Por favor", "Hola"],
          correctAnswer: "Adiós",
          explanation: "'Adiós' means 'Goodbye'",
          xp: 10,
        },
      ],
    });

    // Numbers lesson
    await ctx.db.insert("lessons", {
      courseId,
      name: "Numbers 1-10",
      type: "multiple_choice",
      questions: [
        {
          type: "translation",
          text: "What is 'one' in Spanish?",
          options: ["uno", "dos", "tres", "cuatro"],
          correctAnswer: "uno",
          explanation: "'uno' means 'one'",
          xp: 10,
        },
        {
          type: "translation",
          text: "What is 'five' in Spanish?",
          options: ["cinco", "seis", "siete", "ocho"],
          correctAnswer: "cinco",
          explanation: "'cinco' means 'five'",
          xp: 10,
        },
        {
          type: "matching",
          text: "Match the number: 'diez'",
          options: ["10", "7", "8", "9"],
          correctAnswer: "10",
          explanation: "'diez' means '10'",
          xp: 15,
        },
      ],
    });

    // Colors lesson
    await ctx.db.insert("lessons", {
      courseId,
      name: "Basic Colors",
      type: "multiple_choice",
      questions: [
        {
          type: "translation",
          text: "What color is 'rojo'?",
          options: ["Red", "Blue", "Green", "Yellow"],
          correctAnswer: "Red",
          explanation: "'rojo' means 'red'",
          xp: 10,
        },
        {
          type: "translation",
          text: "How do you say 'blue' in Spanish?",
          options: ["azul", "verde", "amarillo", "negro"],
          correctAnswer: "azul",
          explanation: "'azul' means 'blue'",
          xp: 10,
        },
        {
          type: "fill_in_blank",
          text: "The sky is _____. (azul)",
          options: ["azul", "rojo", "verde", "amarillo"],
          correctAnswer: "azul",
          explanation: "We use 'azul' to describe the color of the sky",
          xp: 15,
        },
      ],
    });

    // Family members lesson
    await ctx.db.insert("lessons", {
      courseId,
      name: "Family Members",
      type: "multiple_choice",
      questions: [
        {
          type: "translation",
          text: "What does 'madre' mean?",
          options: ["Mother", "Father", "Sister", "Brother"],
          correctAnswer: "Mother",
          explanation: "'madre' means 'mother'",
          xp: 10,
        },
        {
          type: "translation",
          text: "How do you say 'brother' in Spanish?",
          options: ["hermano", "hermana", "padre", "madre"],
          correctAnswer: "hermano",
          explanation: "'hermano' means 'brother'",
          xp: 10,
        },
        {
          type: "matching",
          text: "Match the family member: 'abuelo'",
          options: ["Grandfather", "Uncle", "Cousin", "Father"],
          correctAnswer: "Grandfather",
          explanation: "'abuelo' means 'grandfather'",
          xp: 15,
        },
      ],
    });

    // Common phrases lesson
    await ctx.db.insert("lessons", {
      courseId,
      name: "Common Phrases",
      type: "multiple_choice",
      questions: [
        {
          type: "translation",
          text: "What does 'por favor' mean?",
          options: ["Please", "Thank you", "You're welcome", "Excuse me"],
          correctAnswer: "Please",
          explanation: "'por favor' means 'please'",
          xp: 10,
        },
        {
          type: "translation",
          text: "How do you say 'thank you' in Spanish?",
          options: ["gracias", "de nada", "por favor", "lo siento"],
          correctAnswer: "gracias",
          explanation: "'gracias' means 'thank you'",
          xp: 10,
        },
        {
          type: "conversation",
          text: "How would you respond to 'gracias'?",
          options: ["de nada", "por favor", "lo siento", "gracias"],
          correctAnswer: "de nada",
          explanation: "'de nada' means 'you're welcome' and is used to respond to 'gracias'",
          xp: 15,
        },
      ],
    });

    // Weather lesson
    await ctx.db.insert("lessons", {
      courseId,
      name: "Weather",
      type: "multiple_choice",
      questions: [
        {
          type: "translation",
          text: "What does 'hace calor' mean?",
          options: ["It's hot", "It's cold", "It's raining", "It's sunny"],
          correctAnswer: "It's hot",
          explanation: "'hace calor' means 'it's hot'",
          xp: 10,
        },
        {
          type: "translation",
          text: "How do you say 'it's raining' in Spanish?",
          options: ["está lloviendo", "hace sol", "hace frío", "hace viento"],
          correctAnswer: "está lloviendo",
          explanation: "'está lloviendo' means 'it's raining'",
          xp: 10,
        },
        {
          type: "conversation",
          text: "What's the weather like? 'Hace mucho frío'",
          options: ["It's very cold", "It's very hot", "It's very windy", "It's very sunny"],
          correctAnswer: "It's very cold",
          explanation: "'hace mucho frío' means 'it's very cold'",
          hint: "Remember, 'frío' means 'cold' and 'mucho' means 'very/a lot'",
          xp: 15,
        },
      ],
    });

    // Basic verbs lesson
    await ctx.db.insert("lessons", {
      courseId,
      name: "Basic Verbs",
      type: "multiple_choice",
      questions: [
        {
          type: "translation",
          text: "What does 'hablar' mean?",
          options: ["to speak", "to eat", "to walk", "to sleep"],
          correctAnswer: "to speak",
          explanation: "'hablar' means 'to speak'",
          xp: 10,
        },
        {
          type: "conjugation",
          text: "Complete: Yo _____ español (hablar)",
          options: ["hablo", "hablas", "habla", "hablan"],
          correctAnswer: "hablo",
          explanation: "'hablo' is the first-person singular form of 'hablar'",
          hint: "For -ar verbs, the 'yo' form ends in 'o'",
          xp: 15,
        },
        {
          type: "translation",
          text: "What does 'comer' mean?",
          options: ["to eat", "to drink", "to run", "to write"],
          correctAnswer: "to eat",
          explanation: "'comer' means 'to eat'",
          xp: 10,
        },
        {
          type: "conjugation",
          text: "Complete: Ella _____ una manzana (comer)",
          options: ["come", "comes", "comen", "comemos"],
          correctAnswer: "come",
          explanation: "'come' is the third-person singular form of 'comer'",
          hint: "For -er verbs, the 'él/ella' form ends in 'e'",
          xp: 15,
        },
      ],
    });
  },
});
