import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import analysisDataJson from './analysis/transcript_analysis_data.json';

// --- Data Interfaces ---
interface WordStats {
  [key: string]: number[];
}

interface VocabularyItem {
  tier: string;
  data: number[];
}

interface VocabularyData {
  [key: string]: VocabularyItem;
}

interface AnalysisData {
  lessons: string[];
  wordFrequencies: WordStats;
  bigramFrequencies: WordStats;
  trigramFrequencies: WordStats;
}

const analysisData: AnalysisData = analysisDataJson as unknown as AnalysisData;

type NgramType = 'wordFrequencies' | 'bigramFrequencies' | 'trigramFrequencies';

// --- Component ---
const PimsleurAlgorithmAnalysis = () => {
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null);
  const [ngramType, setNgramType] = useState<NgramType>('wordFrequencies');
  const [searchTerm, setSearchTerm] = useState('');

  const { lessons } = analysisData;
  
  const frequencyData = useMemo(() => {
    return analysisData[ngramType];
  }, [ngramType]);

  const vocabularyData: VocabularyData = useMemo(() => {
    const processedData: VocabularyData = {};
    for (const term in frequencyData) {
      processedData[term] = {
        tier: 'ungrouped', // Tier is static for now
        data: frequencyData[term]
      };
    }
    return processedData;
  }, [frequencyData]);

  const displayedVocabulary: VocabularyData = useMemo(() => {
    if (searchTerm.trim() === '') {
      // Return top 20 if no search term
      const sorted = Object.entries(vocabularyData).sort(([, a], [, b]) => {
        const sumA = a.data.reduce((acc, val) => acc + val, 0);
        const sumB = b.data.reduce((acc, val) => acc + val, 0);
        return sumB - sumA;
      });
      return Object.fromEntries(sorted.slice(0, 20));
    }
    
    // Filter by search term
    const filtered = Object.entries(vocabularyData).filter(([term]) => 
      term.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return Object.fromEntries(filtered);
  }, [vocabularyData, searchTerm]);

  const tierColors: { [key: string]: string } = {
    ungrouped: '#7f8c8d',
  };
  
  const lessonLabels = useMemo(() => lessons.map(l => l.replace('French_I_-_Lesson_', 'L')), [lessons]);

  const cognitiveLoadData = useMemo(() => {
    return lessonLabels.map((lessonLabel, index) => {
      let totalReps = 0;
      let activeVocab = 0;
      let newIntroductions = 0;
      
      Object.values(vocabularyData).forEach(vocabItem => {
        const usage = vocabItem.data[index];
        if (usage > 0) {
            totalReps += usage;
            activeVocab++;
        }
        
        const isFirstAppearance = vocabItem.data.slice(0, index).every(u => u === 0);
        if (usage > 0 && isFirstAppearance) {
            newIntroductions++;
        }
      });
      
      return {
        lesson: lessonLabel,
        totalReps,
        activeVocab,
        newIntroductions,
      };
    });
  }, [vocabularyData, lessonLabels]);

  const top20Vocabulary: VocabularyData = useMemo(() => {
    const sorted = Object.entries(vocabularyData).sort(([, a], [, b]) => {
      const sumA = a.data.reduce((acc, val) => acc + val, 0);
      const sumB = b.data.reduce((acc, val) => acc + val, 0);
      return sumB - sumA;
    });
    return Object.fromEntries(sorted.slice(0, 20));
  }, [vocabularyData]);

  const chartData = useMemo(() => {
    return lessonLabels.map((lessonLabel, index) => {
      const dataPoint: {[key: string]: string | number} = { lesson: lessonLabel };
      for (const term in displayedVocabulary) {
        dataPoint[term] = displayedVocabulary[term].data[index];
      }
      return dataPoint;
    });
  }, [displayedVocabulary, lessonLabels]);
  
  const maxUsage = useMemo(() => Math.max(1, ...Object.values(vocabularyData).flatMap(v => v.data)), [vocabularyData]);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🧠 Pimsleur Vocabulary Management Algorithm
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Analysis Type:</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setNgramType('wordFrequencies')} className={`px-4 py-2 rounded-lg font-medium ${ngramType === 'wordFrequencies' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Words (1-grams)</button>
            <button onClick={() => setNgramType('bigramFrequencies')} className={`px-4 py-2 rounded-lg font-medium ${ngramType === 'bigramFrequencies' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Phrases (2-grams)</button>
            <button onClick={() => setNgramType('trigramFrequencies')} className={`px-4 py-2 rounded-lg font-medium ${ngramType === 'trigramFrequencies' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Phrases (3-grams)</button>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Search Vocabulary:</h2>
          <input
            type="text"
            placeholder="e.g. 'voudrais' or 'manger quelque chose'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          📉 Vocabulary Usage Patterns
        </h2>
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lesson" />
              <YAxis label={{ value: 'Usage Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {Object.keys(displayedVocabulary).map((vocab) => (
                <Line
                  key={vocab}
                  type="monotone"
                  dataKey={vocab}
                  stroke={tierColors.ungrouped}
                  strokeWidth={selectedVocab === vocab ? 4 : 2}
                  opacity={selectedVocab && selectedVocab !== vocab ? 0.3 : 1}
                  onClick={() => setSelectedVocab(selectedVocab === vocab ? null : vocab)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-2">
          {searchTerm.trim() === '' ? 'Showing top 20 most frequent items. ' : `Showing results for "${searchTerm}". `}
          Click on lines to highlight individual vocabulary items.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          ⚖️ Cognitive Load Management
        </h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cognitiveLoadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lesson" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalReps" fill="#3498db" name="Total Repetitions" />
              <Bar dataKey="activeVocab" fill="#27ae60" name="Active Vocabulary Items" />
              <Bar dataKey="newIntroductions" fill="#e74c3c" name="New Introductions" />
            </BarChart>
          </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          🔥 Vocabulary Usage Heatmap
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left font-medium">Vocabulary</th>
                <th className="p-2 text-left font-medium">Tier</th>
                {lessonLabels.map(lesson => (
                  <th key={lesson} className="p-2 text-center font-medium text-sm">{lesson}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(displayedVocabulary).map(([vocab, { tier, data }]) => (
                <tr key={vocab} className="border-t">
                  <td className="p-2 font-medium text-sm">{vocab}</td>
                  <td className="p-2">
                    <span 
                      className="px-2 py-1 rounded text-xs text-white font-medium"
                      style={{ backgroundColor: tierColors[tier] }}
                    >
                      {tier}
                    </span>
                  </td>
                  {data.map((value, index) => {
                    const intensity = value > 0 ? Math.max(0.1, value / maxUsage) : 0;
                    return (
                      <td key={lessonLabels[index]} className="p-2 text-center">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: value > 0 ? `rgba(52, 152, 219, ${intensity})` : '#f8f9fa',
                            color: intensity > 0.5 ? 'white' : 'black'
                          }}
                        >
                          {value || ''}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PimsleurAlgorithmAnalysis; 