import { useState } from 'react';

const IntelScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Intel categories data
  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'recent', name: 'RECENT' },
    { id: 'essential', name: 'ESSENTIAL' },
    { id: 'weapons', name: 'WEAPONS' },
    { id: 'locations', name: 'LOCATIONS' }
  ];

  // Vocabulary data (as intel items)
  const vocabularyItems = [
    {
      id: 1,
      term: 'BONJOUR',
      translation: 'HELLO',
      phoneticSpelling: '/bɔ̃.ʒuʁ/',
      category: 'essential',
      dateAdded: '04.12.25',
      mastery: 85,
      tagged: true
    },
    {
      id: 2,
      term: 'AU REVOIR',
      translation: 'GOODBYE',
      phoneticSpelling: '/o.ʁə.vwaʁ/',
      category: 'essential',
      dateAdded: '04.12.25',
      mastery: 70,
      tagged: true
    },
    {
      id: 3,
      term: 'PISTOLET',
      translation: 'PISTOL',
      phoneticSpelling: '/pis.tɔ.lɛ/',
      category: 'weapons',
      dateAdded: '04.13.25',
      mastery: 50,
      tagged: false
    },
    {
      id: 4,
      term: 'COUTEAU',
      translation: 'KNIFE',
      phoneticSpelling: '/ku.to/',
      category: 'weapons',
      dateAdded: '04.13.25',
      mastery: 35,
      tagged: true
    },
    {
      id: 5,
      term: 'PARIS',
      translation: 'PARIS',
      phoneticSpelling: '/pa.ʁi/',
      category: 'locations',
      dateAdded: '04.14.25',
      mastery: 90,
      tagged: false
    },
    {
      id: 6,
      term: 'RESTAURANT',
      translation: 'RESTAURANT',
      phoneticSpelling: '/ʁɛs.to.ʁɑ̃/',
      category: 'locations',
      dateAdded: '04.14.25',
      mastery: 60,
      tagged: false
    },
  ];

  // Filter items based on search term and active category
  const filteredItems = vocabularyItems.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.translation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory || 
                           (activeCategory === 'recent' && item.dateAdded === '04.14.25');
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-black min-h-screen text-white p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-mono font-bold tracking-tight text-gray-200">INTEL DATABASE</h1>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-red-500 font-mono">{vocabularyItems.length} FILES</span>
          <div className="w-8 h-8 rounded-full bg-gray-900 border border-red-800 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          placeholder="SEARCH INTELLIGENCE FILES"
          className="bg-gray-900 border border-red-900 w-full pl-10 pr-4 py-2 rounded font-mono text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 hide-scrollbar">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-1 rounded whitespace-nowrap font-mono text-xs ${
              activeCategory === category.id 
                ? 'bg-red-900/40 border border-red-800 text-red-500' 
                : 'bg-gray-900 border border-gray-800 text-gray-500'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Intel Items */}
      <div className="space-y-3 mb-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-gray-900 border border-red-900 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-mono font-bold text-gray-200 text-lg">{item.term}</h3>
                    {item.tagged && (
                      <div className="ml-2 px-2 py-0.5 bg-red-900/30 border border-red-800 rounded text-xs font-mono text-red-500">
                        PRIORITY
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 font-mono text-sm">{item.translation}</p>
                  <p className="text-gray-500 font-mono text-xs">{item.phoneticSpelling}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 font-mono mr-1">ACQUIRED:</span>
                    <span className="text-xs text-gray-400 font-mono">{item.dateAdded}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 font-mono mr-1">MASTERY:</span>
                    <span className="text-xs text-red-500 font-mono">{item.mastery}%</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-800 h-1 rounded-full mt-3">
                <div 
                  className={`h-1 rounded-full ${
                    item.mastery > 70 ? 'bg-green-700' : item.mastery > 40 ? 'bg-yellow-700' : 'bg-red-700'
                  }`} 
                  style={{ width: `${item.mastery}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex border-t border-red-900/30 bg-gray-900">
              <button className="flex-1 py-2 font-mono text-xs text-gray-400 border-r border-red-900/30 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                ADD TO PRIORITY
              </button>
              <button className="flex-1 py-2 font-mono text-xs text-gray-400 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
                STUDY DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Intel Button */}
      <div className="fixed bottom-20 right-4">
        <button className="w-12 h-12 rounded-full bg-red-800 flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Study Tools Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">TACTICAL RESOURCES</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-red-900 to-red-950 border border-red-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">VOCABULARY DRILLS</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-red-900 to-red-950 border border-red-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">PHRASE BOOK</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-red-900 to-red-950 border border-red-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">GRAMMAR FILES</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-red-900 to-red-950 border border-red-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">FIELD COMMS</p>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-red-900 p-2">
        <div className="flex justify-around">
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs text-gray-600 font-mono">HQ</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            <span className="text-xs text-red-500 font-mono">INTEL</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-xs text-gray-600 font-mono">RANKS</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs text-gray-600 font-mono">AGENT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelScreen;