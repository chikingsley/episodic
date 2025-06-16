import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, HeatMap, Cell } from 'recharts';

const PimsleurAlgorithmAnalysis = () => {
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedVocab, setSelectedVocab] = useState(null);

  // Core data - vocabulary usage across lessons
  const vocabularyData = {
    // Tier 1: Scaffolding (never dropped)
    vous: { tier: 'scaffolding', pattern: 'stable_high', data: [25,18,22,19,21,24,26,23,20,18,19,17] },
    je: { tier: 'scaffolding', pattern: 'stable_high', data: [20,15,25,18,22,20,24,21,19,23,20,18] },
    'est-ce que': { tier: 'scaffolding', pattern: 'declining_stable', data: [15,8,12,10,9,14,16,12,10,8,6,4] },
    
    // Tier 2: Core conversational (peak then maintenance)
    bonjour: { tier: 'core_conversational', pattern: 'peak_then_maintenance', data: [0,12,8,6,4,3,2,5,6,4,5,3] },
    'comment allez-vous': { tier: 'core_conversational', pattern: 'peak_then_maintenance', data: [0,15,8,6,5,4,3,7,6,4,5,2] },
    'très bien': { tier: 'core_conversational', pattern: 'peak_then_stable', data: [0,10,8,6,4,5,7,6,3,4,5,6] },
    
    // Tier 3: Spaced repetition (clear decay)
    américain: { tier: 'spaced_repetition', pattern: 'peak_then_decay', data: [8,6,12,4,2,1,0,1,0,0,0,0] },
    'l\'anglais': { tier: 'spaced_repetition', pattern: 'peak_then_decay', data: [12,6,8,3,1,0,0,1,2,0,0,0] },
    'le français': { tier: 'spaced_repetition', pattern: 'peak_then_decay', data: [10,8,9,5,3,2,1,0,3,1,0,0] },
    pardon: { tier: 'spaced_repetition', pattern: 'cyclical_revival', data: [8,4,6,2,5,1,2,3,1,0,0,1] },
    
    // Tier 4: Contextual building (module-based)
    'je voudrais': { tier: 'contextual_building', pattern: 'introduction_peak_maintenance', data: [0,0,0,0,15,18,20,14,10,8,12,6] },
    'qu\'est-ce que': { tier: 'contextual_building', pattern: 'intensive_introduction_decay', data: [0,0,0,0,0,0,25,18,12,8,6,4] },
    maintenant: { tier: 'contextual_building', pattern: 'gradual_build_stable', data: [0,0,0,0,0,8,12,10,6,8,10,5] },
    'à quelle heure': { tier: 'contextual_building', pattern: 'late_introduction_peak', data: [0,0,0,0,0,0,0,0,20,15,18,10] },
    
    // Numbers cluster
    'une heure': { tier: 'contextual_cluster', pattern: 'cluster_introduction', data: [0,0,0,0,0,0,0,0,12,8,6,4] },
    'deux heures': { tier: 'contextual_cluster', pattern: 'cluster_introduction', data: [0,0,0,0,0,0,0,2,10,8,6,3] }
  };

  const lessons = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];
  
  const tierColors = {
    scaffolding: '#e74c3c',
    core_conversational: '#3498db', 
    spaced_repetition: '#f39c12',
    contextual_building: '#27ae60',
    contextual_cluster: '#9b59b6'
  };

  const tierDescriptions = {
    scaffolding: 'Foundation vocabulary used in every lesson',
    core_conversational: 'Social phrases with peak then maintenance',
    spaced_repetition: 'Subject-specific vocab with clear decay curves',
    contextual_building: 'New concepts introduced in learning modules',
    contextual_cluster: 'Related vocabulary introduced together'
  };

  // Calculate cognitive load per lesson
  const cognitiveLoadData = useMemo(() => {
    return lessons.map((lesson, index) => {
      let totalReps = 0;
      let activeVocab = 0;
      let newIntroductions = 0;
      
      Object.keys(vocabularyData).forEach(vocab => {
        const usage = vocabularyData[vocab].data[index];
        totalReps += usage;
        if (usage > 0) activeVocab++;
        
        // Check if this is introduction lesson
        const prevUsage = index > 0 ? vocabularyData[vocab].data[index - 1] : 0;
        if (usage > 0 && prevUsage === 0) newIntroductions++;
      });
      
      return {
        lesson,
        totalReps,
        activeVocab,
        newIntroductions,
        avgRepsPerItem: activeVocab > 0 ? Math.round(totalReps / activeVocab) : 0
      };
    });
  }, []);

  // Filter vocabulary by tier
  const filteredVocabulary = useMemo(() => {
    if (selectedTier === 'all') return vocabularyData;
    return Object.fromEntries(
      Object.entries(vocabularyData).filter(([_, data]) => data.tier === selectedTier)
    );
  }, [selectedTier]);

  // Prepare data for decay curve visualization
  const decayCurveData = useMemo(() => {
    return lessons.map((lesson, index) => {
      const lessonData = { lesson };
      Object.keys(filteredVocabulary).forEach(vocab => {
        lessonData[vocab] = filteredVocabulary[vocab].data[index];
      });
      return lessonData;
    });
  }, [filteredVocabulary]);

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    return Object.keys(filteredVocabulary).map(vocab => {
      const vocabData = filteredVocabulary[vocab];
      const row = { vocab, tier: vocabData.tier };
      lessons.forEach((lesson, index) => {
        row[lesson] = vocabData.data[index];
      });
      return row;
    });
  }, [filteredVocabulary]);

  const maxUsage = Math.max(...Object.values(vocabularyData).flatMap(v => v.data));

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🧠 Pimsleur Vocabulary Management Algorithm
      </h1>
      
      {/* Tier Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Vocabulary Tier:</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedTier === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Tiers
          </button>
          {Object.keys(tierColors).map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedTier === tier ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: selectedTier === tier ? tierColors[tier] : 'white',
                border: `2px solid ${tierColors[tier]}`
              }}
            >
              {tier.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        
        {selectedTier !== 'all' && (
          <p className="mt-2 text-gray-600 text-sm">
            <strong>{selectedTier.replace('_', ' ').toUpperCase()}:</strong> {tierDescriptions[selectedTier]}
          </p>
        )}
      </div>

      {/* Decay Curves */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          📉 Vocabulary Usage Patterns (Decay Curves)
        </h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={decayCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lesson" />
              <YAxis label={{ value: 'Usage Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {Object.keys(filteredVocabulary).map((vocab, index) => (
                <Line
                  key={vocab}
                  type="monotone"
                  dataKey={vocab}
                  stroke={tierColors[filteredVocabulary[vocab].tier]}
                  strokeWidth={selectedVocab === vocab ? 4 : 2}
                  opacity={selectedVocab && selectedVocab !== vocab ? 0.3 : 1}
                  onClick={() => setSelectedVocab(selectedVocab === vocab ? null : vocab)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Click on lines to highlight individual vocabulary items. Notice the distinct patterns for each tier.
        </p>
      </div>

      {/* Cognitive Load Management */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          ⚖️ Cognitive Load Management
        </h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
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
      </div>

      {/* Usage Frequency Heatmap */}
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
                {lessons.map(lesson => (
                  <th key={lesson} className="p-2 text-center font-medium text-sm">{lesson}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map(row => (
                <tr key={row.vocab} className="border-t">
                  <td className="p-2 font-medium text-sm">{row.vocab}</td>
                  <td className="p-2">
                    <span 
                      className="px-2 py-1 rounded text-xs text-white font-medium"
                      style={{ backgroundColor: tierColors[row.tier] }}
                    >
                      {row.tier.replace('_', ' ')}
                    </span>
                  </td>
                  {lessons.map(lesson => {
                    const value = row[lesson];
                    const intensity = value / maxUsage;
                    return (
                      <td key={lesson} className="p-2 text-center">
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

      {/* Algorithm Insights */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          🎯 Pimsleur Algorithm Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: tierColors.scaffolding }}>
              🏗️ Scaffolding Strategy
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Core pronouns (je, vous) and question structures (est-ce que) maintain consistent high usage.
              These form the grammatical foundation that supports all other learning.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• "vous": 17-26 uses per lesson (never drops below 17)</li>
              <li>• "je": 15-25 uses per lesson (consistent foundation)</li>
              <li>• "est-ce que": Gradually declines as question inversion is introduced</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: tierColors.core_conversational }}>
              💬 Conversational Maintenance
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Social phrases peak during introduction then maintain steady background usage.
              Essential for natural conversation flow.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Peak practice: 10-15 repetitions during introduction</li>
              <li>• Maintenance: 2-7 repetitions in subsequent lessons</li>
              <li>• Revival: Increased usage during conversation practice</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: tierColors.spaced_repetition }}>
              📉 Spaced Repetition Curves
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Topic-specific vocabulary shows classic spaced repetition decay curves.
              Heavy initial practice followed by gradual reduction.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• "américain": 12 peak → 0 by lesson 7</li>
              <li>• "l'anglais": 12 peak → sporadic revival</li>
              <li>• "pardon": Cyclical revival pattern for politeness</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: tierColors.contextual_building }}>
              🎯 Contextual Clustering
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              New concepts introduced when contextually relevant, often in clusters.
              Intensive initial drilling followed by integrated usage.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• "je voudrais": Introduced lesson 5, peaks lesson 7 (restaurants)</li>
              <li>• Time expressions: Cluster introduction lessons 9-11</li>
              <li>• Question patterns: Peak practice then integration</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">🧠 Cognitive Load Balance</h3>
          <p className="text-sm text-gray-700">
            Pimsleur maintains cognitive balance by managing the introduction of new vocabulary against 
            the decay of older items. Total repetitions stay relatively stable (80-140 per lesson) 
            while the vocabulary mix constantly evolves. This creates a sustainable learning load 
            that builds complexity without overwhelming learners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PimsleurAlgorithmAnalysis;