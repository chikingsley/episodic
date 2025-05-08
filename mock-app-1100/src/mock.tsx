import React, { useState, useEffect, useCallback, useRef } from 'react';
// Note: Framer Motion and Shadcn UI components are assumed to be available
// In a real project: npm install framer-motion lucide-react && npx shadcn-ui@latest add card button progress tabs avatar separator toggle-group alert-dialog accordion
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Zap, Target, User, RadioTower, Briefcase, BrainCircuit, ShieldCheck, Settings, ChevronRight, ChevronDown, // Added ChevronDown
    CheckCircle, BookOpen, ListChecks, Repeat, MessageSquare, Languages, Star, Sigma, X, Flag, Check,
    ShoppingCart, PlayCircle, PauseCircle, SkipForward, AlertCircle, Lock, Gem, Palette, Users, // Example icons for Store
    Headphones, Dumbbell, AlertTriangle, Info, // Added AlertTriangle and Info
    Search, Bell, Volume2, Moon, Shield, Key, History, Database, Download, Filter, MapPin, // Added new icons
    CreditCard, HelpCircle, Globe, LogOut, FileText, // Added new icons
    Wallet, Award, // Added Award
    TrendingUp, Map, Network, Clock, // Added more icons
} from 'lucide-react';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion" // For Ops Screen mission details
import { Badge } from "@/components/ui/badge";


// --- Font Setup ---
// Ensure JetBrains Mono is linked in your main HTML file or CSS setup
// <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
const monoFontClass = "font-['JetBrains_Mono',_monospace]";
const sansFontClass = "font-['Inter',_sans-serif]"; // Default sans-serif

// --- Elo to Rank Mapping ---
const getRankFromElo = (elo) => { /* ... (same as before) ... */ if (elo >= 2000) return { name: "Legendary Operative", level: 8 }; if (elo >= 1800) return { name: "Master Operative", level: 7 }; if (elo >= 1500) return { name: "Senior Operative", level: 6 }; if (elo >= 1200) return { name: "Special Operative", level: 5 }; if (elo >= 1000) return { name: "Operative", level: 4 }; if (elo >= 800) return { name: "Field Specialist", level: 3 }; if (elo >= 600) return { name: "Field Agent", level: 2 }; return { name: "Recruit", level: 1 }; };

// --- Interactive Status Bar Component ---
// (Code remains the same as the previous version with interactivity restored)
// --- SVG Icons ---
const ShieldIcon = ({ className, progress = 0 }) => { let strokeColorClass = 'text-[#9CFF63]'; if (progress <= 30) { strokeColorClass = 'text-[#FF4E4E]'; } else if (progress <= 70) { strokeColorClass = 'text-[#FFC857]'; } return (<svg className={`${className} ${strokeColorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>); };
const TallyMarksIcon = ({ className }) => ( <svg className={`${className} text-[#FFC857]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6v12M7 6v12M10 6v12M13 6v12M16 18L20 6" /></svg> );
const DonationIcon = ({ className }) => ( <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" className="fill-[#FFC857]" /><path d="M12 5.5C12.8284 5.5 13.5 6.17157 13.5 7C13.5 7.82843 12.8284 8.5 12 8.5C11.1716 8.5 10.5 7.82843 10.5 7C10.5 6.17157 11.1716 5.5 12 5.5Z" className="fill-[#0d0d12] opacity-50" /><path d="M18 14C18 12.8954 17.1046 12 16 12H8C6.89543 12 6 12.8954 6 14V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V14Z" className="stroke-[#9CFF63] fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 12V10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V12" className="stroke-[#9CFF63]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> );
// --- Detail Components ---
const IntegrityDetails = ({ integrity, onClose }) => ( <Card className={`bg-black/85 border-[#9CFF63]/30 text-gray-200 relative shadow-lg w-full max-w-xs sm:max-w-sm ${monoFontClass}`}><Button variant="ghost" size="icon" onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white h-7 w-7 z-10">&times;<span className="sr-only">Close</span></Button><CardHeader className="items-center text-center pt-6 pb-3"><CardTitle className="text-sm uppercase tracking-wider text-gray-400">Cover Integrity</CardTitle><div className="text-3xl font-bold text-[#9CFF63] my-1">{integrity}%</div></CardHeader><CardContent className="pb-4 px-4"><Button className="w-full bg-[#9CFF63] text-[#0d0d12] font-bold text-sm hover:bg-[#86e64c] focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[#9CFF63] focus-visible:ring-offset-[#0d0d12]" variant="default" size="sm">REINFORCE COVER</Button></CardContent></Card> );
const StreakDetails = ({ currentStreak, longestStreak, onClose }) => ( <Card className={`bg-black/85 border-[#FFC857]/30 text-gray-200 relative text-center shadow-lg w-full max-w-xs sm:max-w-sm ${monoFontClass}`}><Button variant="ghost" size="icon" onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white h-7 w-7 z-10">&times;<span className="sr-only">Close</span></Button><CardHeader className="pb-1 pt-5"><CardTitle className="text-sm uppercase tracking-wider text-gray-400">Days Undercover</CardTitle></CardHeader><CardContent className="pb-4"><p className="mb-1 text-xs">Current Streak</p><p className="text-[#FFC857] text-2xl md:text-3xl font-bold mb-2">{currentStreak}</p><p className="text-[10px] text-gray-500">Longest: {longestStreak} Days</p></CardContent></Card> );
const FundsDetails = ({ donations, illicit, onClose }) => ( <Card className={`bg-black/85 border-[#9B6BFF]/30 text-gray-200 relative shadow-lg w-full max-w-xs sm:max-w-sm ${monoFontClass}`}><Button variant="ghost" size="icon" onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white h-7 w-7 z-10">&times;<span className="sr-only">Close</span></Button><CardHeader className="pb-1 pt-5"><CardTitle className="text-sm uppercase tracking-wider text-gray-400 text-center">Funds Breakdown</CardTitle></CardHeader><CardContent className="space-y-2 text-center pb-4"><div><span className="text-[10px] text-gray-400 block uppercase">Donations</span><span className="font-semibold text-[#9CFF63] text-base md:text-lg">{donations.toLocaleString()}</span></div><div className="border-t border-gray-700 w-1/2 mx-auto my-1"></div><div><span className="text-[10px] text-gray-400 block uppercase">Illicit</span><span className="font-semibold text-[#9B6BFF] text-base md:text-lg">{illicit.toLocaleString()}</span></div></CardContent></Card> );
// --- StatusBar Component Logic ---
const StatusBar = ({ title }) => { 
    const [integrity, setIntegrity] = useState(84); 
    const [currentStreak, setCurrentStreak] = useState(42); 
    const [longestStreak, setLongestStreak] = useState(118); 
    const [totalFunds, setTotalFunds] = useState(3275); 
    const [donations, setDonations] = useState(1850); 
    const [illicitFunds, setIllicitFunds] = useState(1425); 
    const [activeSection, setActiveSection] = useState(null); 
    
    const handleSectionToggle = (sectionName) => { 
        setActiveSection(prev => prev === sectionName ? null : sectionName); 
    }; 
    
    const closeDetails = useCallback(() => setActiveSection(null), []); 
    const formattedStreak = String(currentStreak).padStart(3, '0'); 
    
    const detailVariants = { 
        hidden: { opacity: 0, scale: 0.9, y: -5 }, 
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }, 
        exit: { opacity: 0, scale: 0.9, y: -5, transition: { duration: 0.15, ease: "easeIn" } } 
    }; 
    
    const getPopupStyle = (sectionName: string): React.CSSProperties => { 
        const baseStyle: React.CSSProperties = { 
            position: 'absolute', 
            top: 'calc(100% + 8px)', 
            zIndex: 50 
        }; 
        
        switch (sectionName) { 
            case 'integrity': 
                return { ...baseStyle, left: '1rem' }; 
            case 'streak': 
                return { ...baseStyle, left: '50%', transform: 'translateX(-50%)' }; 
            case 'funds': 
                return { ...baseStyle, right: '1rem' }; 
            default: 
                return baseStyle; 
        } 
    }; 

    return ( 
        <div className={`w-full max-w-[1080px] mx-auto ${sansFontClass} relative`}> 
            <div className="h-14 bg-[rgba(13,13,18,0.92)] backdrop-blur-sm text-gray-200 flex items-center justify-between px-3 relative z-10 border-b border-white/10">
                <h1 className={`text-base font-bold ${monoFontClass} uppercase tracking-wider text-gray-300`}>{title}</h1>
                <div className="flex items-center gap-3">
                    <div 
                        onClick={() => handleSectionToggle('integrity')} 
                        className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded-md transition-colors ${activeSection === 'integrity' ? 'bg-white/10' : 'hover:bg-white/5'}`} 
                        title={`Cover Integrity: ${integrity}%`}
                    >
                        <ShieldIcon className="w-5 h-5" progress={integrity} />
                        <span className={`text-sm font-medium ${activeSection === 'integrity' ? 'text-white' : ''} ${integrity <= 30 ? 'text-[#FF4E4E]' : integrity <= 70 ? 'text-[#FFC857]' : 'text-[#9CFF63]'}`}>{integrity}%</span>
                    </div>
                    <div 
                        onClick={() => handleSectionToggle('streak')} 
                        className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded-md transition-colors ${activeSection === 'streak' ? 'bg-white/10' : 'hover:bg-white/5'}`} 
                        title={`Days Undercover: ${currentStreak}`}
                    >
                        <TallyMarksIcon className="w-5 h-5 text-[#FFC857]" />
                        <span className={`text-sm font-medium ${activeSection === 'streak' ? 'text-white' : 'text-[#FFC857]'}`}>{formattedStreak}</span>
                    </div>
                    <div 
                        onClick={() => handleSectionToggle('funds')} 
                        className={`flex items-center gap-1.5 cursor-pointer p-1.5 rounded-md transition-colors ${activeSection === 'funds' ? 'bg-white/10' : 'hover:bg-white/5'}`} 
                        title={`Total Funds: ${totalFunds.toLocaleString()}`}
                    >
                        <Gem className="w-5 h-5 text-[#9B6BFF]" />
                        <span className={`text-sm font-medium ${activeSection === 'funds' ? 'text-white' : 'text-gray-300'}`}>{totalFunds.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {activeSection && (
                    <motion.div 
                        key={activeSection} 
                        style={getPopupStyle(activeSection)} 
                        variants={detailVariants} 
                        initial="hidden" 
                        animate="visible" 
                        exit="exit"
                    >
                        {activeSection === 'integrity' && <IntegrityDetails integrity={integrity} onClose={closeDetails} />}
                        {activeSection === 'streak' && <StreakDetails currentStreak={currentStreak} longestStreak={longestStreak} onClose={closeDetails} />}
                        {activeSection === 'funds' && <FundsDetails donations={donations} illicit={illicitFunds} onClose={closeDetails} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
// --- End of Status Bar ---


// --- Screen Components ---

// --- HQ Screen ---
const HQScreen = () => { /* ... (Code remains largely the same as previous version, ensuring consistent padding/fonts) ... */ const mapImageUrl = "https://0yt99wt00r.ufs.sh/f/dhLwyAsZTU9stPTXsCdo21WyhwRpakx4sdLmeJFujCHD5IEn"; const [mapError, setMapError] = useState(false); const [isAudioActive, setIsAudioActive] = useState(true); const [fieldOpStep, setFieldOpStep] = useState(0); const totalFieldOps = 5; const currentOperation = { clearance: "Clearance 01", number: 3, name: "Infiltration du Marché", readiness: 40, completedOps: 2 }; const handleAudioClick = () => { if (isAudioActive) { setIsAudioActive(false); setFieldOpStep(1); } else { setIsAudioActive(true); setFieldOpStep(0); } }; const handleFieldOpClick = () => { if (!isAudioActive) { setFieldOpStep(prev => (prev % totalFieldOps) + 1); } }; const readinessSegments = Array.from({ length: totalFieldOps }, (_, i) => ({ completed: i < currentOperation.completedOps })); return (
    // Constrain image/overlay bottom edge relative to tab bar height (approx pb-16)
    <div className={`flex-grow relative overflow-hidden bg-[#0d0d12] ${sansFontClass}`}> 
        {/* Map Image - Adjusted bottom */}
        {!mapError ? (
            <img
                src={mapImageUrl}
                alt="City map background"
                className="absolute top-0 left-0 right-0 bottom-16 w-full h-auto object-cover z-0"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    console.error("Error loading map image:", mapImageUrl);
                    setMapError(true);
                }}
            />
        ) : (
            <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center"><p className="text-red-500 text-center text-sm p-4">Map failed to load.<br/>({mapImageUrl})</p></div>
        )}
        {/* Overlay - Adjusted bottom */}
        {!mapError && <div className="absolute top-0 left-0 right-0 bottom-16 bg-black/40 z-1"></div>}
        {/* Highlight - Position might need further adjustment based on new image bounds */}
        {!mapError && (
            <div className="absolute top-[45%] left-[55%] w-16 h-16 md:w-24 md:h-24 bg-[#FF4E4E]/30 rounded-full z-1 animate-pulse border-2 border-[#FF4E4E]"><span className="sr-only">Current mission area highlighted</span></div>
        )}
        {/* Bottom Overlays - Kept pb-16 for spacing above tab bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent pb-16">
            <Card className={`w-full max-w-md border-gray-700 bg-black/60 backdrop-blur-sm text-center p-3`}>
                <CardHeader className="p-0 mb-2">
                    <CardTitle className={`text-lg font-bold text-gray-100 mb-1 ${monoFontClass}`}>{currentOperation.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                        <span className="font-semibold text-[#FFC857]">{currentOperation.clearance}</span>
                        <span className="mx-1">|</span>
                        <span>OP-{String(currentOperation.number).padStart(2, '0')}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex items-center gap-1 w-full h-3 rounded overflow-hidden bg-gray-800 border border-gray-700 mb-1">
                        {readinessSegments.map((seg, index) => (
                            <div key={index} className={`flex-1 h-full transition-colors ${seg.completed ? 'bg-[#FFC857]' : 'bg-gray-600'}`} title={`Field Op ${index + 1} ${seg.completed ? 'Complete' : 'Pending'}`} />
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 px-1">
                        <span>Readiness</span>
                        <span>{currentOperation.readiness}%</span>
                    </div>
                </CardContent>
            </Card>
            <div className="w-full max-w-md flex flex-col gap-2">
                <Button onClick={handleAudioClick} className={`w-full ${isAudioActive ? 'bg-[#9CFF63] text-[#0d0d12] animate-pulse' : 'bg-gray-600 text-gray-400'} font-bold hover:bg-[#86e64c] focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[#9CFF63] focus-visible:ring-offset-[#0d0d12] flex items-center justify-center gap-2 ${monoFontClass}`} size="lg">
                    {isAudioActive ? <PlayCircle className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />} INTERCEPT AUDIO
                </Button>
                {!isAudioActive && (
                    <Button onClick={handleFieldOpClick} variant="secondary" className={`w-full font-bold bg-gray-700 border border-gray-600 hover:bg-gray-600 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-[#0d0d12] flex items-center justify-center gap-2 ${monoFontClass}`} size="lg">
                        <Target className="w-5 h-5 text-[#FFC857]" /> FIELD OPS ({fieldOpStep}/{totalFieldOps})
                        <div className="w-10 h-1 bg-gray-500 rounded-full overflow-hidden ml-2">
                            <div className="bg-[#FFC857] h-full" style={{ width: `${(fieldOpStep / totalFieldOps) * 100}%` }}></div>
                        </div>
                    </Button>
                )}
            </div>
        </div>
    </div>
); };

// --- Intel Screen ---
const IntelScreen = () => {
    const intelCards = [
        {
            type: 'mission',
            title: 'Operation Clearview',
            description: 'Infiltrate corporate systems to extract financial records.',
            level: 'Level 4',
            reward: '2,500 XP',
            time: '3 hrs',
            progress: 65
        },
        {
            type: 'event',
            title: 'Shadow Market',
            description: 'Underground tech bazaar. Rare items available for limited time.',
            level: 'Level 3',
            reward: '1,800 XP',
            time: '48 hrs',
            status: 'ACTIVE'
        },
        {
            type: 'alert',
            title: 'Security Breach',
            description: 'Multiple endpoints compromised in sector 7. Caution advised.',
            time: '10 min ago',
            importance: 'HIGH'
        },
        {
            type: 'intel',
            title: 'Corporate Movement',
            description: 'Unusual activity detected at Nexus Corp headquarters.',
            time: '1 hr ago',
            source: 'Field Agent'
        },
    ];

    return (
        <div className="flex-1 bg-[#0D0D12] text-white overflow-y-auto">
            <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Intel</h2>
                    <div className="flex space-x-1.5">
                        <button className="p-1 bg-[#17171F] rounded-md">
                            <Filter className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 bg-[#17171F] rounded-md">
                            <Bell className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
                
                <div className="space-y-2">
                    {intelCards.map((card, index) => (
                        <div key={index} className="bg-[#17171F] border border-gray-800 rounded-lg p-2">
                            <div className="flex justify-between items-start mb-1">
                                <div className={`text-xs px-1.5 py-0.5 rounded ${
                                    card.type === 'mission' ? 'bg-blue-500/20 text-blue-400' :
                                    card.type === 'event' ? 'bg-purple-500/20 text-purple-400' :
                                    card.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                                    'bg-green-500/20 text-green-400'
                                }`}>
                                    {card.type.toUpperCase()}
                                </div>
                                {card.importance && (
                                    <div className="text-xs text-red-400">
                                        {card.importance}
                                    </div>
                                )}
                                {card.status && (
                                    <div className="text-xs text-purple-400">
                                        {card.status}
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-sm font-medium mb-0.5">{card.title}</h3>
                            <p className="text-xs text-gray-400 mb-1">{card.description}</p>
                            
                            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500">
                                {card.level && <div>{card.level}</div>}
                                {card.reward && <div>{card.reward}</div>}
                                {card.time && <div>{card.time}</div>}
                                {card.source && <div>Source: {card.source}</div>}
                            </div>
                            
                            {card.type === 'mission' && card.progress && (
                                <div className="mt-1 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${card.progress}%` }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Ops Screen (Refactored) ---
const OpsScreen = () => {
    const [activeTab, setActiveTab] = useState('timeline');

    // --- Mission Data (Adapted from original and reference) ---
    const episodeData = {
        currentEpisode: {
            number: 1,
            name: "INITIAL INFILTRATION",
            description: "Establish basic French skills for covert operations.",
            progress: 40, // Example overall progress
            missions: [
                { 
                    id: "1.1", 
                    name: "BASIC GREETINGS", 
                    description: "Master basic French greetings to establish initial contact with local assets.", 
                    completed: true, 
                    xp: 100, 
                    completedDate: "APR 13, 2025" 
                },
                { 
                    id: "1.2", 
                    name: "PERSONAL INTRODUCTIONS", 
                    description: "Learn how to introduce yourself and establish your cover identity in French.", 
                    completed: false, 
                    xp: 150, 
                    inProgress: true 
                },
                { 
                    id: "1.3", 
                    name: "CASUAL CONVERSATIONS", 
                    description: "Master café discussions and public space conversations to gather intelligence.", 
                    completed: false, 
                    xp: 200, 
                    locked: true 
                },
                { 
                    id: "1.4", 
                    name: "NUMBERS & INFORMATION", 
                    description: "Learn numbers, dates, and essential information exchange protocols.", 
                    completed: false, 
                    xp: 150, 
                    locked: true 
                },
                { 
                    id: "1.5", 
                    name: "FIRST SOCIAL GATHERING", 
                    description: "Complete assessment mission testing your ability to navigate a social event in French.", 
                    completed: false, 
                    xp: 300, 
                    locked: true, 
                    isAssessment: true 
                }
            ]
        },
        futureEpisodes: [
            { number: 2, name: "ESTABLISHING PRESENCE", description: "Shopping, transportation, restaurants, and communication skills." },
            { number: 3, name: "DEEP COVER OPERATIONS", description: "Business French, cultural references, complex social situations." },
            { number: 4, name: "TARGET ACQUISITION", description: "Specialized terminology, negotiation, subtext comprehension." },
            { number: 5, name: "MISSION CRITICAL", description: "Advanced cultural nuances, debate, regional variations." }
        ]
    };

    // --- Mission Timeline Component (Refactored) ---
    const MissionTimeline = () => {
        const currentEpisode = episodeData.currentEpisode;
        
        const getStatusBadge = (mission) => {
            if (mission.completed) return <span className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs font-mono text-green-500">COMPLETED</span>;
            if (mission.inProgress) return <span className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">IN PROGRESS</span>;
            if (mission.isAssessment) return <span className="px-2 py-0.5 bg-red-900/30 border border-red-800 rounded text-xs font-mono text-red-500">FINAL ASSESSMENT</span>;
            if (mission.locked) return <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-500">LOCKED</span>;
            return null;
        };

        const getStatusIcon = (mission) => {
            if (mission.completed) return (
                <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-green-900 border-2 border-green-700 flex items-center justify-center">
                    <Check width="12" height="12" className="text-green-500" strokeWidth="3" />
                </div>
            );
            if (mission.inProgress) return (
                <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-yellow-900 border-2 border-yellow-700 flex items-center justify-center">
                     {/* Using Sigma as placeholder for in-progress, could be replaced */}
                     <Sigma width="12" height="12" className="text-yellow-500" strokeWidth="3" />
                </div>
            );
             if (mission.locked) return (
                <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                    <Lock width="12" height="12" className="text-gray-600" strokeWidth="3" />
                </div>
            );
            return null;
        };
        
        const getBorderColor = (mission) => {
             if (mission.completed) return 'border-green-900';
             if (mission.inProgress) return 'border-yellow-900';
             if (mission.locked) return 'border-gray-800 opacity-70';
             return 'border-gray-800';
        };

        return (
            <div className={`mb-20 p-4 ${monoFontClass}`}>
                {/* Current Episode Header */}
                <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-3">
                        <div className="w-12 h-12 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                            <span className="text-2xl font-bold text-red-400">{currentEpisode.number}</span>
                        </div>
                        <div>
                            <p className="text-xs font-mono text-red-500">CURRENT OPERATION</p>
                            <h3 className="font-mono text-gray-200 text-lg">EPISODE {currentEpisode.number}: {currentEpisode.name}</h3>
                             <div className="w-48 bg-gray-800 h-1 rounded-full mt-1 overflow-hidden">
                                <div className="bg-red-700 h-1 rounded-full" style={{width: `${currentEpisode.progress}%`}}></div>
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-xs font-mono text-gray-400">PROGRESS</p>
                            <p className="text-lg font-mono text-red-500">{currentEpisode.progress}%</p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative pl-8 mb-10">
                    {/* Vertical Line */}
                    <div className="absolute left-3 top-0 bottom-0 w-1 bg-red-900/30 rounded-full"></div>
                    
                    {currentEpisode.missions.map((mission) => (
                        <div key={mission.id} className="mb-8 relative">
                            {getStatusIcon(mission)}
                            <div className={`bg-gray-900 border rounded p-4 ${getBorderColor(mission)}`}>
                                <div className="flex justify-between items-center">
                                    <h4 className={`font-mono text-sm ${mission.locked ? 'text-gray-400' : 'text-gray-200'}`}>
                                        MISSION {mission.id}: {mission.name}
                                    </h4>
                                    {getStatusBadge(mission)}
                                </div>
                                <p className={`text-xs font-mono mt-1 ${mission.locked ? 'text-gray-600' : 'text-gray-500'}`}>
                                    {mission.description}
                                </p>
                                <div className="mt-2 flex justify-between">
                                    <div className="flex items-center">
                                        <Award width="14" height="14" className={`mr-1 ${mission.locked ? 'text-gray-600' : 'text-gray-500'}`} strokeWidth="2"/>
                                        <span className={`text-xs font-mono ${mission.locked ? 'text-gray-600' : 'text-gray-500'}`}>{mission.xp} XP</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock width="14" height="14" className={`mr-1 ${mission.locked ? 'text-gray-600' : 'text-gray-500'}`} strokeWidth="2"/>
                                        <span className={`text-xs font-mono ${mission.locked ? 'text-gray-600' : 'text-gray-500'}`}>
                                            {mission.completed ? mission.completedDate : mission.inProgress ? 'IN PROGRESS' : 'LOCKED'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Future Episodes Preview */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">FUTURE OPERATIONS</h3>
                    <div className="h-px bg-red-900 flex-grow mx-2"></div>
                </div>

                <div className="space-y-3 mb-10">
                    {episodeData.futureEpisodes.map((ep, index) => (
                         <div key={ep.number} className={`bg-gray-900 border border-gray-800 rounded p-4 ${['opacity-70', 'opacity-60', 'opacity-50', 'opacity-40'][index] || 'opacity-30'}`}>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
                                    <span className="text-xl text-gray-600 font-bold">{ep.number}</span>
                                </div>
                                <div>
                                    <h4 className="font-mono text-gray-400 text-sm">EPISODE {ep.number}: {ep.name}</h4>
                                    <p className="text-xs text-gray-600 font-mono mt-1">{ep.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    // --- End of Mission Timeline ---

    // --- Field Dossier Component (Refactored) ---
     const FieldDossier = () => {
        // Simplified data for example
        const skills = [
            { name: 'LISTENING', level: 'BASIC+', value: 30 },
            { name: 'SPEAKING', level: 'BASIC', value: 20 },
            { name: 'READING', level: 'BASIC+', value: 35 },
            { name: 'WRITING', level: 'BASIC', value: 15 },
            { name: 'VOCABULARY', level: 'BASIC+', value: 40 },
            { name: 'GRAMMAR', level: 'BASIC', value: 25 },
        ];
        const vocabulary = [
            { word: 'BONJOUR', translation: 'HELLO', status: 'MASTERED' },
            { word: 'AU REVOIR', translation: 'GOODBYE', status: 'MASTERED' },
            { word: 'MERCI', translation: 'THANK YOU', status: 'LEARNING' },
            { word: "S'IL VOUS PLAÎT", translation: 'PLEASE', status: 'LEARNING' },
            { word: "JE M'APPELLE", translation: 'MY NAME IS', status: 'MASTERED' },
            { word: "J'HABITE À", translation: 'I LIVE IN', status: 'LEARNING' },
            { word: 'JE SUIS', translation: 'I AM', status: 'LEARNING' },
            { word: 'ENCHANTÉ', translation: 'PLEASED TO MEET YOU', status: 'NEW' },
        ];
        const grammar = [
            { title: 'BASIC SENTENCE STRUCTURE', level: 'LEVEL 1', description: 'Subject + Verb + Object structure for basic French sentences.' },
            { title: 'GENDER AGREEMENT', level: 'BASIC', description: 'Masculine and feminine nouns and corresponding articles.' },
            { title: 'PRESENT TENSE VERBS', level: 'LOCKED', description: 'Regular and irregular verb conjugations in present tense.' },
        ];
        
        const getStatusStyle = (status) => {
             switch(status?.toUpperCase()) {
                case 'MASTERED': return 'bg-green-900/30 border border-green-800 text-green-500';
                case 'LEARNING': return 'bg-yellow-900/30 border border-yellow-800 text-yellow-500';
                case 'NEW': return 'bg-red-900/30 border border-red-800 text-red-500';
                case 'LOCKED': return 'bg-gray-800 border border-gray-700 text-gray-500';
                default: return 'bg-gray-800 border border-gray-700 text-gray-500';
            }
        };
        
        return (
            <div className={`mb-20 p-4 ${monoFontClass}`}>
                {/* Skill Assessment */}
                <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
                    <h3 className="font-mono text-gray-200 text-base mb-3 uppercase tracking-wider">Agent Skill Assessment</h3>
                    <div className="space-y-4">
                        {skills.map(skill => (
                            <div key={skill.name}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-mono text-gray-400">{skill.name}</span>
                                    <span className="text-xs font-mono text-red-500">{skill.level}</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                    <div className="bg-red-700 h-1 rounded-full" style={{ width: `${skill.value}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Vocabulary Sections */}
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">ACQUIRED VOCABULARY</h3>
                    <div className="h-px bg-red-900 flex-grow mx-2"></div>
                    <span className="text-xs text-gray-600 font-mono">{vocabulary.filter(v => v.status !== 'NEW').length} WORDS</span>
                </div>
                
                <div className="mb-6">
                    <div className="bg-gray-900 border border-red-900 rounded-lg p-4">
                        <div className="space-y-2">
                            {vocabulary.map((item, index) => (
                                <div key={index} className={`flex justify-between items-center ${index < vocabulary.length - 1 ? 'border-b border-red-900/20 pb-2 mb-2' : ''}`}>
                                    <div>
                                        <p className="text-sm text-gray-300 font-mono">{item.word}</p>
                                        <p className="text-xs text-gray-500 font-mono">{item.translation}</p>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-xs font-mono ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
                 
                 {/* Grammar Knowledge */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">GRAMMAR PROTOCOLS</h3>
                    <div className="h-px bg-red-900 flex-grow mx-2"></div>
                </div>
                
                <div className="space-y-3 mb-10">
                    {grammar.map((item, index) => (
                         <div key={index} className={`bg-gray-900 border rounded p-4 ${item.level === 'LOCKED' ? 'border-gray-800 opacity-70' : 'border-red-900'}`}>
                            <div className="flex justify-between">
                                <h4 className={`font-mono text-sm ${item.level === 'LOCKED' ? 'text-gray-400' : 'text-gray-300'}`}>{item.title}</h4>
                                <div className={`px-2 py-0.5 rounded text-xs font-mono ${getStatusStyle(item.level)}`}>
                                    {item.level}
                                </div>
                            </div>
                            <p className={`text-xs font-mono mt-1 ${item.level === 'LOCKED' ? 'text-gray-600' : 'text-gray-500'}`}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    // --- End of Field Dossier ---

    return (
        // Use bg-black for the main container to match reference
        <div className="flex-grow flex flex-col bg-black text-gray-200 overflow-hidden">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow overflow-hidden">
                 {/* Updated TabsList styling */}
                 <TabsList className={`flex border-b border-red-900 mb-0 bg-black p-0 h-auto overflow-x-auto hide-scrollbar ${monoFontClass}`}>
                    <TabsTrigger 
                        value="timeline" 
                         className={`py-3 px-4 font-mono text-sm whitespace-nowrap rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-700 data-[state=active]:font-semibold data-[state=active]:bg-transparent text-gray-500 border-b-2 border-transparent data-[state=active]:shadow-none`}
                    >
                        MISSION TIMELINE
                    </TabsTrigger>
                    <TabsTrigger 
                        value="dossier" 
                        className={`py-3 px-4 font-mono text-sm whitespace-nowrap rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-700 data-[state=active]:font-semibold data-[state=active]:bg-transparent text-gray-500 border-b-2 border-transparent data-[state=active]:shadow-none`}
                    >
                        FIELD DOSSIER
                    </TabsTrigger>
                     {/* Example of adding more tabs if needed in future */}
                    {/* 
                    <TabsTrigger value="map" className={`py-3 px-4 font-mono text-sm whitespace-nowrap ...`}>TACTICAL MAP</TabsTrigger>
                    <TabsTrigger value="network" className={`py-3 px-4 font-mono text-sm whitespace-nowrap ...`}>ASSET NETWORK</TabsTrigger> 
                    */}
                </TabsList>
                {/* Keep pb-16 to avoid overlap with TabBar */}
                <TabsContent value="timeline" className="flex-grow overflow-y-auto no-scrollbar mt-0 pb-16"> 
                    <MissionTimeline /> 
                </TabsContent>
                <TabsContent value="dossier" className="flex-grow overflow-y-auto no-scrollbar mt-0 pb-16"> 
                    <FieldDossier /> 
                </TabsContent>
            </Tabs>
        </div>
    );
};


// --- Agent Screen (Refactored based on ProfileTab and ProfileScreen examples) ---
const AgentScreen = () => { 
    // Existing Agent Data
    const agentData = { 
        name: "Agent Kestrel", // Changed from DARK MALLARD
        avatarUrl: "https://placehold.co/96x96/0f172a/ef4444?text=K", // Updated placeholder to match red theme size
        elo: 1050, 
        xp: 12850, 
        missionsCompleted: 35, 
        currentStreak: 42, 
        wordsLearned: 850, 
        joinDate: "APR 14, 2025" // Added join date for example
    }; 
    
    const agentRank = getRankFromElo(agentData.elo); 
    const language = "French"; // Could be dynamic later
    const currentOpName = "Infiltration du Marché"; 
    const currentOpProgress = 40; // Example progress for current op

    // Achievement data (from ProfileTab example)
    const achievements = [
        {
            icon: Award,
            iconBg: 'bg-yellow-900/30',
            iconColor: 'text-yellow-400',
            title: "Master Infiltrator",
            xp: "+500 XP",
            xpColor: 'text-yellow-400',
            description: "Complete 10 infiltration missions without being detected",
            locked: false
        },
        {
            icon: Star,
            iconBg: 'bg-cyan-900/30', // Using cyan as placeholder color from example
            iconColor: 'text-cyan-400',
            title: "Tech Wizard",
            xp: "+300 XP",
            xpColor: 'text-cyan-400',
            description: "Hack 25 security systems successfully",
            locked: false
        },
        {
            icon: Lock,
            iconBg: 'bg-gray-800',
            iconColor: 'text-gray-600',
            title: "Ghost Protocol",
            xp: "Locked",
            xpColor: 'text-gray-500',
            description: "Complete a mission without triggering any alarms",
            locked: true
        },
         {
            icon: Lock,
            iconBg: 'bg-gray-800',
            iconColor: 'text-gray-600',
            title: "Fatal Flirtation", // Added from 2nd example for variety
            xp: "Locked",
            xpColor: 'text-gray-500',
            description: "First romantic takedown",
            locked: true
        },
    ];

    // Settings modal state (optional, kept from example)
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    return (
        // Use bg-black from second example, pb-16 for bottom padding
        <div className={`bg-black min-h-screen text-white p-4 pb-16 overflow-y-auto no-scrollbar ${monoFontClass}`}>
            {/* Header with settings button (from second example) */}
            <div className="flex items-center justify-between mb-4">
                {/* Display Rank Level like in example */}
                <span className="text-xs text-red-500 font-mono">LVL.{agentRank.level.toString().padStart(2,'0')}</span>
                <button 
                    className="w-8 h-8 rounded-full bg-gray-900 border border-red-800 flex items-center justify-center"
                    // onClick={() => setShowSettingsModal(true)} // Disabled as per instructions
                >
                    <Settings width="20" height="20" className="text-red-500" strokeWidth="2" />
                </button>
            </div>

            {/* Centered Profile Header (from second example, adapted) */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-red-800 flex items-center justify-center overflow-hidden mb-3 shadow-lg shadow-red-900/20">
                    {/* Using Avatar component for consistency, adjust styling as needed */}
                     <Avatar className="h-full w-full">
                        <AvatarImage src={agentData.avatarUrl} alt={agentData.name} className="object-cover" />
                        <AvatarFallback className="bg-red-900 text-red-300 font-bold text-4xl">{agentData.name ? agentData.name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
                    </Avatar>
                </div>
                <h2 className="text-xl font-bold font-mono tracking-tight uppercase">{agentData.name}</h2>
                {/* Use Agent Rank Name */}
                <p className="text-gray-500 text-xs uppercase">{agentRank.name} | SINCE {agentData.joinDate}</p>
                
                {/* Language indicator (from second example, adapted) */}
                <div className="mt-2 flex items-center bg-gray-900 border border-red-800 px-4 py-2 rounded">
                     {/* Placeholder flag icon, replace with actual flag if available */}
                    <Flag className="w-5 h-5 mr-2 text-gray-500 opacity-70"/>
                    <span className="font-mono text-gray-300 uppercase">{language}</span>
                    {/* Using Rank as the badge content */}
                    <span className="ml-2 text-xs bg-red-800 text-gray-200 px-2 py-0.5 rounded font-mono uppercase">{agentRank.name}</span>
                </div>
            </div>

            {/* Stats Cards - 2 per row (from second example, populated with Agent data) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Total XP */}
                <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
                    <div className="flex flex-col">
                        <p className="text-xs text-red-500 font-mono mb-1 uppercase">Total XP</p>
                        <p className="text-3xl font-bold font-mono text-gray-200">{agentData.xp.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 font-mono uppercase">Earned</p>
                    </div>
                </div>
                
                {/* Words Learned */}
                 <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
                    <div className="flex flex-col">
                        <p className="text-xs text-red-500 font-mono mb-1 uppercase">Vocabulary</p>
                        <p className="text-3xl font-bold font-mono text-gray-200">{agentData.wordsLearned}</p>
                        <p className="text-xs text-gray-500 font-mono uppercase">Words Learned</p>
                    </div>
                </div>
                
                {/* Missions Completed */}
                <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
                    <div className="flex flex-col">
                        <p className="text-xs text-red-500 font-mono mb-1 uppercase">Missions</p>
                        <p className="text-3xl font-bold font-mono text-gray-200">{agentData.missionsCompleted}</p>
                        <p className="text-xs text-gray-500 font-mono uppercase">Completed</p>
                    </div>
                </div>
                
                {/* Current Streak */}
                <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
                    <div className="flex flex-col">
                        <p className="text-xs text-red-500 font-mono mb-1 uppercase">Undercover</p>
                        <p className="text-3xl font-bold font-mono text-gray-200">{agentData.currentStreak}</p>
                        <p className="text-xs text-gray-500 font-mono uppercase">Day Streak</p>
                    </div>
                </div>
            </div>

            {/* Current Operation Progress (Adapted from 'Missions Log' in second example) */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">CURRENT OPERATION</h3>
                <div className="h-px bg-red-900 flex-grow mx-2"></div>
                {/* Can add Op Number here if needed */}
                 {/* <span className="text-xs text-gray-600 font-mono">OP-03</span> */}
            </div>
      
            <div className="bg-gray-900 border border-red-900 rounded p-4 mb-6">
                 <div className="flex items-center mb-1"> {/* Reduced margin */}
                    <div className="w-8 h-8 rounded bg-red-900/30 border border-red-800 flex items-center justify-center mr-3">
                        {/* Using Target icon for operation */}
                        <Target width="16" height="16" className="text-red-500" strokeWidth="2"/> 
                    </div>
                    <div className="flex-grow">
                        <p className="font-mono text-sm text-gray-300 uppercase">{currentOpName}</p>
                        <div className="w-full bg-gray-800 h-1 rounded-full mt-1">
                             {/* Use currentOpProgress */}
                             <div className="bg-red-700 h-1 rounded-full" style={{width: `${currentOpProgress}%`}}></div>
                        </div>
                    </div>
                    <span className="ml-4 text-red-500 text-xs font-mono">{currentOpProgress}%</span>
                </div>
            </div>
            
             {/* Achievements (Styled like second example, content from first) */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">ACHIEVEMENTS</h3>
                <div className="h-px bg-red-900 flex-grow mx-2"></div>
                <span className="text-xs text-gray-600 font-mono">{achievements.filter(a => !a.locked).length}/{achievements.length}</span>
            </div>

            <div className="space-y-3 mb-8">
                {achievements.map((ach, index) => {
                    const AchIcon = ach.icon; // Get the icon component
                    return (
                        <div key={index} className={`bg-gray-900 border rounded p-3 ${ach.locked ? 'border-gray-700 opacity-60' : 'border-red-900'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg ${ach.iconBg} ${ach.locked ? '' : 'border border-red-700'} flex items-center justify-center`}>
                                    <AchIcon className={`w-6 h-6 ${ach.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div className={`text-sm font-medium ${ach.locked ? 'text-gray-500' : 'text-gray-300'}`}>{ach.title}</div>
                                        <div className={`text-xs ${ach.xpColor}`}>{ach.xp}</div>
                                    </div>
                                    <div className={`text-xs ${ach.locked ? 'text-gray-600' : 'text-gray-400'}`}>{ach.description}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                 {/* Optional: Add View All button from example */}
                {/* 
                <Button variant="ghost" size="sm" className="w-full mt-1 text-red-500 hover:bg-red-900/20 hover:text-red-400">
                    View All Achievements <ChevronRight className="w-4 h-4 ml-1" />
                </Button> 
                */}
            </div>

            {/* Removed Progress section from first example */}

            {/* Settings Modal (from second example - kept structure but commented out trigger) */}
            {/* ... modal JSX ... */}
        </div>
    );
};

// --- Store Screen ---
const StoreScreen = () => {
    const categories = ['Featured', 'Weapons', 'Armor', 'Consumables', 'Mods', 'Blueprints'];
    const [selectedCategory, setSelectedCategory] = useState('Featured');
    
    const items = [
        { id: 1, name: 'Quantum Blade', type: 'Weapon', rarity: 'Rare', price: '12,500', image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3liZXJwdW5rfGVufDB8fDB8fHww' },
        { id: 2, name: 'Neural Interface', type: 'Mod', rarity: 'Epic', price: '27,800', image: 'https://images.unsplash.com/photo-1597858520171-563a8e8b9925?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D' },
        { id: 3, name: 'Stealth Cloak', type: 'Armor', rarity: 'Legendary', price: '45,000', image: 'https://images.unsplash.com/photo-1506202687253-52e1b29d3527?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D' },
        { id: 4, name: 'Hacking Kit', type: 'Tool', rarity: 'Uncommon', price: '6,200', image: 'https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D' },
        { id: 5, name: 'Combat Drone', type: 'Gadget', rarity: 'Rare', price: '18,500', image: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D' },
        { id: 6, name: 'Energy Shield', type: 'Defense', rarity: 'Epic', price: '32,000', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGN5YmVycHVua3xlbnwwfHwwfHx8MA%3D%3D' },
    ];
    
    const getRarityColor = (rarity) => {
        switch(rarity) {
            case 'Common': return 'text-gray-300';
            case 'Uncommon': return 'text-green-400';
            case 'Rare': return 'text-blue-400';
            case 'Epic': return 'text-purple-400';
            case 'Legendary': return 'text-yellow-400';
            default: return 'text-gray-300';
        }
    };
    
    return (
        <div className="flex-1 bg-[#0D0D12] text-white overflow-y-auto">
            <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Exchange</h2>
                    <div className="flex space-x-1.5">
                        <button className="p-1 bg-[#17171F] rounded-md">
                            <Filter className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 bg-[#17171F] rounded-md">
                            <Wallet className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
                
                <div className="flex space-x-2 mb-3 overflow-x-auto hide-scrollbar pb-1">
                    {categories.map(category => (
                        <button 
                            key={category}
                            className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
                                selectedCategory === category 
                                ? 'bg-[#9CFF63] text-black font-medium' 
                                : 'bg-[#17171F] text-gray-400'
                            }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                    {items.map(item => (
                        <div key={item.id} className="bg-[#17171F] border border-gray-800 rounded-lg overflow-hidden">
                            <div className="aspect-square relative">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 right-0 bg-black/60 px-1 py-0.5 text-[10px] text-[#9CFF63]">
                                    {item.price}
                                </div>
                            </div>
                            <div className="p-1.5">
                                <div className="text-xs font-medium truncate">{item.name}</div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400">{item.type}</span>
                                    <span className={`text-[10px] ${getRarityColor(item.rarity)}`}>{item.rarity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Tab Bar Component (Refactored for Mission Control style) ---
const TabBar = ({ activeTab, setActiveTab }) => {
    const tabs = [ 
        { name: 'HQ', icon: Home, label: 'HQ' }, 
        { name: 'Intel', icon: RadioTower, label: 'INTEL' }, // Updated icon? Maybe FileText or Database? Using RadioTower for consistency
        { name: 'Ops', icon: Target, label: 'OPS' }, // Target icon seems appropriate
        // { name: 'Store', icon: ShoppingCart, label: 'EXCHANGE' }, // Removed Store from bottom bar as per common patterns
        { name: 'Agent', icon: User, label: 'AGENT' }
    ];

    // Use red theme consistent with Ops screen example
    const activeColor = 'text-red-500';
    const inactiveColor = 'text-gray-600';
    
    return (
        // Updated style: fixed position, red border, black bg
        <div className={`fixed bottom-0 left-0 right-0 bg-black border-t border-red-900 p-2 ${monoFontClass} z-40`}>
            <div className="flex justify-around max-w-[1080px] mx-auto"> 
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.name;
                    return (
                        <button // Changed div to button for accessibility
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex flex-col items-center p-1 flex-1 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={`w-6 h-6 mb-0.5 ${isActive ? activeColor : inactiveColor}`} strokeWidth={isActive ? 2 : 1.5} />
                            <span className={`text-xs font-mono ${isActive ? activeColor : inactiveColor}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


// --- Main App Component ---
const Mock = () => {
    const [activeTab, setActiveTab] = useState('HQ'); // Default to HQ

    // Updated getTitle to include new Ops title style
    const getTitle = (tab) => {
        switch (tab) { 
            case 'HQ': return 'HEADQUARTERS'; 
            case 'Intel': return 'INTEL FEED'; 
            case 'Ops': return 'OPERATIONS'; // Using 'OPERATIONS' like the old one, not 'MISSION CONTROL' from ref header
            case 'Store': return 'EXCHANGE'; 
            case 'Agent': return 'AGENT PROFILE'; // Agent doesn't use StatusBar/Header in current setup
            default: return 'MOCK APP'; 
        } 
    };
    
    // Simple Header for Screens without StatusBar
    const SimpleHeader = ({ title }) => (
        <div className={`w-full max-w-[1080px] mx-auto ${sansFontClass} relative`}> 
            <div className="h-14 bg-[rgba(13,13,18,0.92)] backdrop-blur-sm text-gray-200 flex items-center justify-between px-3 relative z-10 border-b border-white/10">
                <h1 className={`text-base font-bold ${monoFontClass} uppercase tracking-wider text-gray-300`}>{title}</h1>
                {/* Add icons or controls if needed for these screens */}
            </div>
        </div>
    );

    const renderScreen = () => { 
        switch (activeTab) { 
            case 'HQ': return <HQScreen />; 
            case 'Intel': return <IntelScreen />; 
            case 'Ops': return <OpsScreen />; 
            case 'Store': return <StoreScreen />; 
            case 'Agent': return <AgentScreen />; 
            default: return <HQScreen />; 
        } 
    };

    return (
        // Changed bg-background to bg-black to match Ops/reference style
        <div className={`bg-black text-foreground min-h-screen dark flex flex-col ${sansFontClass}`}>
             {/* Conditionally render StatusBar or a simple header */}
             {/* Ops screen now manages its own internal header/tabs */}
             {activeTab !== 'Agent' && activeTab !== 'Store' && <StatusBar title={getTitle(activeTab)} />}
             {/* Agent and Store might need their own simple headers if StatusBar isn't used */}
             {(activeTab === 'Agent' || activeTab === 'Store') && <SimpleHeader title={getTitle(activeTab)} />}
            
             {/* Let the OpsScreen handle its own top bar/tabs */}
             {/* Remove pb-20 from main and add pb-16 to content containers */}
             <main className="flex-grow flex flex-col overflow-hidden"> 
                 {renderScreen()} 
             </main>
            
             {/* Render the refactored TabBar */}
             <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

export default Mock;

// Helper CSS for scrollbar hiding (if needed, add to your global CSS)
/*
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
