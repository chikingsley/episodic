import fs from 'fs/promises';
import path from 'path';

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const TRANSCRIPTS_DIR = path.resolve(SCRIPT_DIR, '../../../planning/planning-v4/french-course-transcripts/Pimsleur/Pimsleur_French_1');
const OUTPUT_DIR = path.resolve(SCRIPT_DIR);
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'transcript_analysis_data.json');

// List of common French stop words to exclude from analysis.
const STOP_WORDS = new Set([
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'à', 'au', 'aux',
  'que', 'qui', 'quoi', 'ne', 'pas', 'mais', 'ou', 'où', 'est', 'sont', 'a', 'ont',
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'ce', 'se', 'en', 'y',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
  'me', 'te', 'lui', 'leur', 'soi',
  'ai', 'as', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont',
  'étais', 'était', 'étions', 'étiez', 'étaient',
  'serai', 'seras', 'sera', 'serons', 'serez', 'seront',
  '!', '?', '.', ',', ';', ':', '-', "'", '"',
  'd', 'l', 's', 't', 'm', 'n'
]);

interface WordStats {
  [word: string]: number[];
}

interface AnalysisData {
  lessons: string[];
  wordFrequencies: WordStats;
  bigramFrequencies: WordStats;
  trigramFrequencies: WordStats;
}

async function analyzeTranscripts() {
  console.log('Starting transcript analysis...');
  console.log(`Reading transcripts from: ${TRANSCRIPTS_DIR}`);

  const allFiles = await fs.readdir(TRANSCRIPTS_DIR);
  const transcriptFiles = allFiles
    .filter(file => file.endsWith('_human_eval.txt'))
    .sort((a, b) => {
      const lessonA = parseInt(a.match(/Lesson_(\d+)/)?.[1] || '0');
      const lessonB = parseInt(b.match(/Lesson_(\d+)/)?.[1] || '0');
      return lessonA - lessonB;
    });

  if (transcriptFiles.length === 0) {
    console.error('No transcript files found. Please check the TRANSCRIPTS_DIR path.');
    return;
  }

  console.log(`Found ${transcriptFiles.length} transcript files.`);

  const analysisData: AnalysisData = {
    lessons: transcriptFiles.map(file => file.replace('_human_eval.txt', '')),
    wordFrequencies: {},
    bigramFrequencies: {},
    trigramFrequencies: {},
  };

  for (let i = 0; i < transcriptFiles.length; i++) {
    const file = transcriptFiles[i];
    const filePath = path.join(TRANSCRIPTS_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // Clean and tokenize
    const cleanedContent = content
      .replace(/\[.*?\]/g, '') // Remove speaker tags like [Narrator]
      .replace(/=====.*?=====/g, '') // Remove file headers
      .toLowerCase()
      .replace(/[.,?!:;()"']/g, '') // Remove punctuation
      .replace(/(\s-\s|-\s|\s-)/g, ' ') // Remove stray dashes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    const words = cleanedContent.split(' ').filter(w => w && !STOP_WORDS.has(w) && w.length > 1);

    // Word Frequencies (1-grams)
    const lessonWordFreq: { [word: string]: number } = {};
    for (const word of words) {
      if (word) {
        lessonWordFreq[word] = (lessonWordFreq[word] || 0) + 1;
      }
    }

    // Bigram Frequencies (2-grams)
    const lessonBigramFreq: { [phrase: string]: number } = {};
    for (let j = 0; j < words.length - 1; j++) {
      const bigram = `${words[j]} ${words[j+1]}`;
      if (bigram.includes('-')) continue;
      lessonBigramFreq[bigram] = (lessonBigramFreq[bigram] || 0) + 1;
    }

    // Trigram Frequencies (3-grams)
    const lessonTrigramFreq: { [phrase: string]: number } = {};
    for (let j = 0; j < words.length - 2; j++) {
      const trigram = `${words[j]} ${words[j+1]} ${words[j+2]}`;
      if (trigram.includes('-')) continue;
      lessonTrigramFreq[trigram] = (lessonTrigramFreq[trigram] || 0) + 1;
    }

    // Aggregate data
    updateFrequencies(analysisData.wordFrequencies, lessonWordFreq, transcriptFiles.length, i);
    updateFrequencies(analysisData.bigramFrequencies, lessonBigramFreq, transcriptFiles.length, i);
    updateFrequencies(analysisData.trigramFrequencies, lessonTrigramFreq, transcriptFiles.length, i);
  }

  // Add all words from all lessons to ensure the arrays are the correct length
  finalizeFrequencies(analysisData.wordFrequencies, transcriptFiles.length);
  finalizeFrequencies(analysisData.bigramFrequencies, transcriptFiles.length);
  finalizeFrequencies(analysisData.trigramFrequencies, transcriptFiles.length);


  await fs.writeFile(OUTPUT_FILE, JSON.stringify(analysisData, null, 2));
  console.log(`Analysis complete. Data saved to ${OUTPUT_FILE}`);
}

function updateFrequencies(globalFreq: WordStats, lessonFreq: { [key: string]: number }, totalLessons: number, lessonIndex: number) {
  for (const item in lessonFreq) {
    if (!globalFreq[item]) {
      globalFreq[item] = Array(totalLessons).fill(0);
    }
    globalFreq[item][lessonIndex] = lessonFreq[item];
  }
}

function finalizeFrequencies(globalFreq: WordStats, totalLessons: number) {
    for (const item in globalFreq) {
        if (globalFreq[item].length < totalLessons) {
            const currentLength = globalFreq[item].length;
            for (let i = 0; i < totalLessons - currentLength; i++) {
                globalFreq[item].push(0);
            }
        }
    }
}


analyzeTranscripts().catch(console.error);
