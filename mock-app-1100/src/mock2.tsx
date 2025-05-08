import React, { useState, useEffect, useCallback, useRef } from 'react';
// Note: Framer Motion and Shadcn UI components are assumed to be available
// In a real project: npm install framer-motion lucide-react && npx shadcn-ui@latest add card button progress tabs avatar separator toggle-group alert-dialog accordion
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Zap, Target, User, RadioTower, Briefcase, BrainCircuit, ShieldCheck, Settings, ChevronRight, ChevronDown, // Added ChevronDown
    CheckCircle, BookOpen, ListChecks, Repeat, MessageSquare, Languages, Star, Sigma, X, Flag, Check,
    ShoppingCart, PlayCircle, PauseCircle, SkipForward, AlertCircle, Lock, Gem, Palette, Users, // Example icons for Store
    Headphones, Dumbbell // Icons for Mission Types
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
            <div className="h-16 md:h-20 bg-[rgba(13,13,18,0.92)] backdrop-blur-sm text-gray-200 flex items-center justify-between px-4 md:px-6 relative z-10 border-b border-white/10"> 
                <h1 className={`text-lg md:text-xl font-bold ${monoFontClass} uppercase tracking-wider text-gray-300`}>{title}</h1> 
                <div className="flex items-center gap-3 md:gap-4"> 
                    <div onClick={() => handleSectionToggle('integrity')} className={`flex items-center gap-1 cursor-pointer p-1 rounded transition-colors ${activeSection === 'integrity' ? 'bg-white/10' : 'hover:bg-white/5'}`} title={`Cover Integrity: ${integrity}%`}> 
                        <ShieldIcon className="w-4 h-4 md:w-5 md:h-5" progress={integrity} /> 
                        <span className={`text-xs md:text-sm font-bold ${activeSection === 'integrity' ? 'text-white' : ''} ${integrity <= 30 ? 'text-[#FF4E4E]' : integrity <= 70 ? 'text-[#FFC857]' : 'text-[#9CFF63]'}`}>{integrity}%</span>
                    </div> 
                    <div onClick={() => handleSectionToggle('streak')} className={`flex items-center gap-1 cursor-pointer p-1 rounded transition-colors ${activeSection === 'streak' ? 'bg-white/10' : 'hover:bg-white/5'}`} title={`Days Undercover: ${currentStreak}`}> 
                        <TallyMarksIcon className="w-4 h-4 md:w-5 md:h-5 text-[#FFC857]" /> 
                        <span className={`text-xs md:text-sm font-bold ${activeSection === 'streak' ? 'text-white' : 'text-[#FFC857]'}`}>{formattedStreak}</span>
                    </div> 
                    <div onClick={() => handleSectionToggle('funds')} className={`flex items-center gap-1 cursor-pointer p-1 rounded transition-colors ${activeSection === 'funds' ? 'bg-white/10' : 'hover:bg-white/5'}`} title={`Total Funds: ${totalFunds.toLocaleString()}`}> 
                        <DonationIcon className="w-4 h-4 md:w-5 md:h-5" /> 
                        <span className={`text-xs md:text-sm font-bold ${activeSection === 'funds' ? 'text-white' : 'text-gray-300'}`}>{totalFunds.toLocaleString()}</span>
                    </div>
                </div>
            </div> 
            <AnimatePresence>
                {activeSection && ( 
                    <motion.div key={activeSection} style={getPopupStyle(activeSection)} variants={detailVariants} initial="hidden" animate="visible" exit="exit"> 
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
const HQScreen = () => { 
    const mapImageUrl = "https://0yt99wt00r.ufs.sh/f/dhLwyAsZTU9stPTXsCdo21WyhwRpakx4sdLmeJFujCHD5IEn"; 
    const [mapError, setMapError] = useState(false); 
    const [isAudioActive, setIsAudioActive] = useState(true); 
    const [fieldOpStep, setFieldOpStep] = useState(0); 
    const totalFieldOps = 5; 
    const currentOperation = { 
        clearance: "Clearance 01", 
        number: 3, 
        name: "Infiltration du Marché", 
        readiness: 40, 
        completedOps: 2 
    }; 
    
    const handleAudioClick = () => { 
        if (isAudioActive) { 
            setIsAudioActive(false); 
            setFieldOpStep(1); 
        } else { 
            setIsAudioActive(true); 
            setFieldOpStep(0); 
        } 
    }; 
    
    const handleFieldOpClick = () => { 
        if (!isAudioActive) { 
            setFieldOpStep(prev => (prev % totalFieldOps) + 1); 
        } 
    }; 
    
    const readinessSegments = Array.from({ length: totalFieldOps }, (_, i) => ({ completed: i < currentOperation.completedOps })); 
    
    return ( 
        <div className={`flex-grow relative overflow-hidden bg-[#0d0d12] ${sansFontClass}`}> 
            {/* Map Image */} 
            {!mapError ? ( 
                <img 
                    src={mapImageUrl} 
                    alt="City map background" 
                    className="absolute inset-0 w-full h-full object-cover z-0" 
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { 
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        console.error("Error loading map image:", mapImageUrl); 
                        setMapError(true); 
                    }} 
                /> 
            ) : ( 
                <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
                    <p className="text-red-500 text-center text-sm p-4">Map failed to load.<br/>({mapImageUrl})</p>
                </div> 
            )}
            {!mapError && <div className="absolute inset-0 bg-black/40 z-1"></div>}
            {!mapError && ( <div className="absolute top-[45%] left-[55%] w-16 h-16 md:w-24 md:h-24 bg-[#FF4E4E]/30 rounded-full z-1 animate-pulse border-2 border-[#FF4E4E]"><span className="sr-only">Current mission area highlighted</span></div> )}
            {/* Bottom Overlays */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
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
                        {isAudioActive ? <PlayCircle className="w-5 h-5"/> : <PauseCircle className="w-5 h-5"/>} INTERCEPT AUDIO
                    </Button>
                    {!isAudioActive && (
                        <Button onClick={handleFieldOpClick} variant="secondary" className={`w-full font-bold bg-gray-700 border border-gray-600 hover:bg-gray-600 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-[#0d0d12] flex items-center justify-center gap-2 ${monoFontClass}`} size="lg">
                            <Target className="w-5 h-5 text-[#FFC857]"/> FIELD OPS ({fieldOpStep}/{totalFieldOps})
                            <div className="w-10 h-1 bg-gray-500 rounded-full overflow-hidden ml-2">
                                <div className="bg-[#FFC857] h-full" style={{width: `${(fieldOpStep / totalFieldOps) * 100}%`}}></div>
                            </div>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Intel Screen ---
const IntelScreen = () => { /* ... (Practice Hub concept remains, ensure consistent padding/fonts) ... */ const practiceActivities = [ { title: "Translate Intercept", description: "Decode incoming enemy comms.", icon: Languages, color: "text-[#9CFF63]" }, { title: "Conversation Drill", description: "Practice dialogue with assets.", icon: MessageSquare, color: "text-[#FFC857]" }, { title: "Vocabulary Reinforcement", description: "Strengthen your known lexicon.", icon: Repeat, color: "text-[#9B6BFF]" }, { title: "Grammar Challenge", description: "Test your structural knowledge.", icon: BrainCircuit, color: "text-gray-400" }, ]; return ( <div className={`flex-grow p-4 md:p-6 space-y-4 overflow-y-auto bg-gray-900 ${sansFontClass}`}> <h2 className={`text-xl font-bold text-gray-200 mb-4 ${monoFontClass}`}>Practice & Drills</h2> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {practiceActivities.map((activity) => { const Icon = activity.icon; return ( <Card key={activity.title} className="bg-gray-800 border-gray-700 hover:border-[#9CFF63]/50 transition-colors cursor-pointer"> <CardHeader className="flex flex-row items-center justify-between pb-2"> <CardTitle className={`text-base font-semibold ${activity.color} ${monoFontClass}`}>{activity.title}</CardTitle> <Icon className={`w-5 h-5 ${activity.color}`} /> </CardHeader> <CardContent> <p className="text-xs text-gray-400">{activity.description}</p> </CardContent> </Card> ); })} </div> </div> ); };


// --- Ops Screen ---
// Reworked Timeline to show sub-missions
const OpsScreen = () => {
    const [activeTab, setActiveTab] = useState('timeline');

    // --- Mission Timeline Component ---
    const MissionTimeline = () => {
        // More detailed placeholder data
        const campaignData = {
            name: "French Campaign",
            clearanceLevels: [
                {
                    level: "01",
                    operations: [
                        {
                            opNumber: 1,
                            name: "Premiers Contacts", // First Contact
                            progress: 100,
                            missions: [
                                { id: "1.1", name: "Salutations de Base", completed: true, subTasks: [ { type: 'audio', name: 'Intercept Audio', completed: true }, { type: 'drill', name: 'Field Op Alpha', completed: true }, { type: 'drill', name: 'Field Op Bravo', completed: true }, { type: 'drill', name: 'Field Op Charlie', completed: true }, { type: 'drill', name: 'Field Op Delta', completed: true }, { type: 'assessment', name: 'Debriefing', completed: true } ] },
                                { id: "1.2", name: "Introductions Personnelles", completed: true, subTasks: [ { type: 'audio', name: 'Intercept Audio', completed: true }, { type: 'drill', name: 'Field Op Echo', completed: true }, { type: 'drill', name: 'Field Op Foxtrot', completed: true }, { type: 'drill', name: 'Field Op Golf', completed: true }, { type: 'assessment', name: 'Debriefing', completed: true } ] },
                            ]
                        },
                        {
                            opNumber: 2,
                            name: "Conversations Courantes", // Casual Conversations
                            progress: 60,
                            missions: [
                                { id: "2.1", name: "Au Café", completed: true, subTasks: [ { type: 'audio', name: 'Intercept Audio', completed: true }, { type: 'drill', name: 'Field Op Hotel', completed: true }, { type: 'drill', name: 'Field Op India', completed: true }, { type: 'drill', name: 'Field Op Juliett', completed: false }, { type: 'drill', name: 'Field Op Kilo', completed: false }, { type: 'assessment', name: 'Debriefing', completed: false } ] },
                                { id: "2.2", name: "Demander son Chemin", completed: false, subTasks: [ { type: 'audio', name: 'Intercept Audio', completed: false }, { type: 'drill', name: 'Field Op Lima', completed: false }, /* ... */ ] },
                            ]
                        },
                         { opNumber: 3, name: "Infiltration du Marché", progress: 0, missions: [ { id: "3.1", name: "Nombres et Prix", completed: false, subTasks: [ /*...*/ ] } ] }, // Current Op from HQ
                    ]
                },
                {
                    level: "02", // Locked clearance
                    operations: [
                        { opNumber: 4, name: "Établir la Présence", progress: 0, missions: [] },
                    ]
                }
            ]
        };

        const getStatusStyles = (mission) => {
            const missionCompleted = mission.completed;
            const missionProgress = mission.progress > 0 || mission.subTasks.some(st => st.completed);
            
            if (missionCompleted) return { 
                icon: Check, 
                color: 'green', 
                borderColor: 'border-green-900/50', 
                bgColor: 'bg-gray-800',
                completed: true,
                progress: 100
            };
            if (missionProgress) return { 
                icon: Sigma, 
                color: 'yellow', 
                borderColor: 'border-yellow-900/50', 
                bgColor: 'bg-gray-800',
                completed: false,
                progress: 50
            };
            return { 
                icon: Lock, 
                color: 'gray', 
                borderColor: 'border-gray-800', 
                bgColor: 'bg-gray-900 opacity-70',
                completed: false,
                progress: 0
            };
        };

        const getSubTaskIcon = (subTask) => {
            switch (subTask.type) {
                case 'audio': return Headphones;
                case 'drill': return Dumbbell;
                case 'assessment': return CheckCircle;
                default: return Target;
            }
        };

        return (
            <div className={`mb-28 p-4 md:p-6 space-y-6 ${monoFontClass}`}>
                {campaignData.clearanceLevels.map((cl, clIndex) => (
                    <div key={`cl-${cl.level}`}>
                        <h3 className="text-lg font-semibold mb-3 text-[#FFC857] uppercase tracking-wider flex items-center gap-2">
                            Clearance <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-200">{cl.level}</span>
                            {clIndex > 0 && <Lock className="w-4 h-4 text-gray-600" />} {/* Lock icon for future levels */}
                        </h3>
                        <div className="relative pl-8 space-y-6">
                            {/* Vertical Line for the clearance level */}
                            <div className="absolute left-3 top-0 bottom-0 w-1 bg-[#FFC857]/20 rounded"></div>

                            {cl.operations.map((op) => (
                                <div key={`op-${op.opNumber}`} className="space-y-3">
                                    <h4 className="text-base font-medium text-gray-300 relative -left-8 pl-8 pt-2">
                                       <span className="absolute left-0 top-2.5 w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center text-xs text-gray-400">{op.opNumber}</span>
                                       OP-{String(op.opNumber).padStart(2,'0')}: {op.name}
                                    </h4>
                                    {op.missions.map((mission) => {
                                        const status = getStatusStyles(mission);
                                        const StatusIcon = status.icon;
                                        return (
                                            <div key={mission.id} className="relative">
                                                {/* Mission Status Icon on the line */}
                                                <div className={`absolute left-[-25px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${status.completed ? 'bg-green-900 border-green-700' : status.progress > 0 ? 'bg-yellow-900 border-yellow-700' : 'bg-gray-800 border-gray-700'}`}>
                                                    <StatusIcon className={`w-3 h-3 ${status.completed ? 'text-green-500' : status.progress > 0 ? 'text-yellow-500' : 'text-gray-600'}`} />
                                                </div>
                                                {/* Mission Card with Accordion for Sub-tasks */}
                                                <Accordion type="single" collapsible className={`w-full border rounded ${status.borderColor} ${status.bgColor}`} disabled={status.icon === Lock}>
                                                    <AccordionItem value={mission.id} className="border-b-0">
                                                        <AccordionTrigger className={`p-3 hover:no-underline ${status.icon === Lock ? 'cursor-not-allowed' : ''}`}>
                                                            <div className="flex justify-between items-center w-full">
                                                                <h5 className={`text-sm font-medium text-left ${status.icon === Lock ? 'text-gray-400' : 'text-gray-200'}`}>
                                                                    Mission {mission.id}: {mission.name}
                                                                </h5>
                                                                {/* Progress/Status Badge */}
                                                                <span className={`px-2 py-0.5 rounded text-[10px] ml-2 ${status.completed ? 'bg-green-900/30 border border-green-800 text-green-500' : status.progress > 0 ? 'bg-yellow-900/30 border border-yellow-800 text-yellow-500' : 'bg-gray-800 border border-gray-700 text-gray-500'}`}>
                                                                    {status.completed ? 'COMPLETED' : status.progress > 0 ? 'IN PROGRESS' : 'LOCKED'}
                                                                </span>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-3 pt-0">
                                                            <div className="space-y-2 mt-2 border-t border-gray-700 pt-2">
                                                                {mission.subTasks.map((task, taskIndex) => {
                                                                    const SubTaskIcon = getSubTaskIcon(task);
                                                                    const isSubTaskComplete = task.completed;
                                                                    return (
                                                                        <div key={taskIndex} className="flex items-center justify-between text-xs">
                                                                            <span className={`flex items-center gap-1.5 ${isSubTaskComplete ? 'text-gray-400' : 'text-gray-300'}`}>
                                                                                <SubTaskIcon className={`w-3.5 h-3.5 ${isSubTaskComplete ? 'text-green-600' : 'text-amber-500'}`} />
                                                                                {task.name}
                                                                            </span>
                                                                            {isSubTaskComplete && <Check className="w-3.5 h-3.5 text-green-600" />}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    // --- End of Mission Timeline ---

    // --- Field Dossier Component ---
    const FieldDossier = () => ( 
        <div className={`mb-28 p-4 md:p-6 space-y-4 ${monoFontClass}`}> 
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle className="text-base text-[#FFC857] uppercase tracking-wider">Agent Skill Assessment</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div><div className="flex justify-between mb-1"><span className="text-xs text-gray-400">LISTENING</span><span className="text-xs text-[#9CFF63]">BASIC+</span></div><Progress value={30} className="h-1 bg-gray-700 [&>div]:bg-[#9CFF63]" /></div>
                    <div><div className="flex justify-between mb-1"><span className="text-xs text-gray-400">SPEAKING</span><span className="text-xs text-[#9CFF63]">BASIC</span></div><Progress value={20} className="h-1 bg-gray-700 [&>div]:bg-[#9CFF63]" /></div>
                </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle className="text-base text-[#FFC857] uppercase tracking-wider">Acquired Vocabulary</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-300">Bonjour - <span className="text-green-500">Mastered</span></p>
                    <p className="text-sm text-gray-300">Merci - <span className="text-yellow-500">Learning</span></p>
                    <p className="text-sm text-gray-300">Marché - <span className="text-yellow-500">Learning</span></p>
                    <p className="text-sm text-gray-300">Infiltration - <span className="text-red-500">New</span></p>
                </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader><CardTitle className="text-base text-[#FFC857] uppercase tracking-wider">Grammar Codex</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-300">Present Tense (Regular -er) - <span className="text-green-500">Mastered</span></p>
                    <p className="text-sm text-gray-300">Gender Agreement (Basic) - <span className="text-yellow-500">Learning</span></p>
                </CardContent>
            </Card>
        </div> 
    );
    // --- End of Field Dossier ---

    return (
        <div className="flex-grow flex flex-col bg-gray-900 text-gray-200 overflow-hidden">
             <Tabs defaultValue="timeline" className="flex flex-col flex-grow overflow-hidden">
                <TabsList className={`flex justify-start overflow-x-auto bg-gray-800 rounded-none border-b border-[#9CFF63]/30 p-0 h-auto ${monoFontClass}`}>
                    <TabsTrigger value="timeline" className="px-4 py-3 text-xs data-[state=active]:bg-gray-700 data-[state=active]:text-[#9CFF63] data-[state=active]:shadow-none rounded-none whitespace-nowrap">MISSION TIMELINE</TabsTrigger>
                    <TabsTrigger value="dossier" className="px-4 py-3 text-xs data-[state=active]:bg-gray-700 data-[state=active]:text-[#9CFF63] data-[state=active]:shadow-none rounded-none whitespace-nowrap">FIELD DOSSIER</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="flex-grow overflow-y-auto no-scrollbar"> <MissionTimeline /> </TabsContent>
                <TabsContent value="dossier" className="flex-grow overflow-y-auto no-scrollbar"> <FieldDossier /> </TabsContent>
            </Tabs>
        </div>
    );
};


// --- Agent Screen ---
const AgentScreen = () => { /* ... (Code remains the same, LanguageProgressWidget included) ... */ const agentData = { name: "Agent Kestrel", avatarUrl: "https://placehold.co/100x100/0d0d12/9CFF63?text=K", elo: 1050, xp: 12850, missionsCompleted: 35, currentStreak: 42, wordsLearned: 850 }; const agentRank = getRankFromElo(agentData.elo); const language = "French"; const currentOpName = "Infiltration du Marché"; const currentOpProgress = 40; const LanguageProgressWidget = () => ( <Card className={`bg-gray-800 border-gray-700 text-gray-200 mb-6 ${sansFontClass}`}> <CardHeader className="flex flex-row items-center justify-between pb-2"> <div> <CardDescription className="text-xs text-[#FFC857] uppercase tracking-wider">{language} Ops</CardDescription> <CardTitle className={`text-lg font-bold ${monoFontClass}`}>{agentRank.name}</CardTitle> </div> <Flag className="w-5 h-5 text-gray-500"/> </CardHeader> <CardContent> <p className="text-sm text-gray-300 mb-2">Current Op: <span className={`font-semibold ${monoFontClass}`}>{currentOpName}</span></p> <Progress value={currentOpProgress} className="h-2 bg-gray-600 [&>div]:bg-[#9CFF63]" /> <div className="flex justify-between text-xs text-gray-400 mt-1"> <span>Operation Progress</span> <span>{currentOpProgress}%</span> </div> </CardContent> </Card> ); return ( <div className={`flex-grow p-4 md:p-6 space-y-4 overflow-y-auto bg-gray-900 text-gray-200 ${sansFontClass}`}> <div className="flex items-center justify-between mb-4"> <div className="flex items-center gap-3"> <Avatar className="h-16 w-16 border-2 border-[#9CFF63]"> <AvatarImage src={agentData.avatarUrl} alt={agentData.name} /> <AvatarFallback className="bg-gray-700 text-[#9CFF63] font-bold">{agentData.name ? agentData.name.charAt(0).toUpperCase() : '?'}</AvatarFallback> </Avatar> <div> <h2 className={`text-xl font-bold ${monoFontClass}`}>{agentData.name}</h2> <p className="text-sm font-medium text-[#9CFF63]">{agentRank.name} ({agentData.elo} Elo)</p> </div> </div> <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"> <Settings className="w-5 h-5" /> <span className="sr-only">Settings</span> </Button> </div> <LanguageProgressWidget /> <Separator className="bg-gray-700" /> <div className="grid grid-cols-2 gap-4 pt-4"> <Card className="bg-gray-800 border-gray-700 text-center"><CardHeader className="pb-1 pt-3"><CardTitle className={`text-xs font-medium text-gray-400 uppercase tracking-wider ${monoFontClass}`}>Total XP</CardTitle></CardHeader><CardContent className="pb-3"><p className="text-2xl font-bold text-gray-200">{agentData.xp.toLocaleString()}</p></CardContent></Card> <Card className="bg-gray-800 border-gray-700 text-center"><CardHeader className="pb-1 pt-3"><CardTitle className={`text-xs font-medium text-gray-400 uppercase tracking-wider ${monoFontClass}`}>Missions Done</CardTitle></CardHeader><CardContent className="pb-3"><p className="text-2xl font-bold text-gray-200">{agentData.missionsCompleted}</p></CardContent></Card> <Card className="bg-gray-800 border-gray-700 text-center"><CardHeader className="pb-1 pt-3"><CardTitle className={`text-xs font-medium text-gray-400 uppercase tracking-wider ${monoFontClass}`}>Current Streak</CardTitle></CardHeader><CardContent className="pb-3"><p className="text-2xl font-bold text-[#FFC857]">{agentData.currentStreak} <span className="text-base">Days</span></p></CardContent></Card> <Card className="bg-gray-800 border-gray-700 text-center"><CardHeader className="pb-1 pt-3"><CardTitle className={`text-xs font-medium text-gray-400 uppercase tracking-wider ${monoFontClass}`}>Words Learned</CardTitle></CardHeader><CardContent className="pb-3"><p className="text-2xl font-bold text-gray-200">{agentData.wordsLearned}</p></CardContent></Card> </div> </div> ); };

// --- Store Screen ---
// Added new character images
const StoreScreen = () => {
    const storeItems = [
        // Added new characters
        { id: 1, name: "Agent: Anya Petrova", type: "Avatar", price: 750, icon: User, imageUrl: "https://0yt99wt00r.ufs.sh/f/dhLwyAsZTU9sYUzKL3hlpjyvNxknMwgORZ8LfsV3Q270BHe6" },
        { id: 2, name: "Agent: Jian Li", type: "Avatar", price: 750, icon: User, imageUrl: "https://0yt99wt00r.ufs.sh/f/dhLwyAsZTU9sAJBiSou9DWnZstiBIlM73mcLQN4dVzbF98S0" },
        { id: 3, name: "Agent: Marcus Jones", type: "Avatar", price: 750, icon: User, imageUrl: "https://0yt99wt00r.ufs.sh/f/dhLwyAsZTU9si4pUsPQf9ux8b7vdhFwqr12B3KmeSLAIMZH0" },
        { id: 4, name: "Agent: Sofia Rossi", type: "Avatar", price: 750, icon: User, imageUrl: "https://0yt99wt00r.ufs.sh/f/dhLwyAsZTU9ssQanNuC7M6DImN5KcevHLjorSl82zyZ40tbw" },
        { id: 5, name: "Agent: Kenji Tanaka", type: "Avatar", price: 750, icon: User, imageUrl: "https://0yt99wt00r.ufs.sh/f/dhLwyAsZTU9sRNcFzPJm21r4Yjylw7poac80HTJC3NSsqGLu" },
        // Other items
        { id: 6, name: "UI Theme: Crimson Night", type: "Theme", price: 300, icon: Palette, imageUrl: "https://placehold.co/150x150/FF4E4E/ffffff?text=UI" },
        { id: 7, name: "Bonus Operation: Paris Heist", type: "Content", price: 1000, icon: Briefcase, imageUrl: "https://placehold.co/150x150/0d0d12/9CFF63?text=Op" },
        { id: 8, name: "Dialogue Pack: Advanced Negotiations", type: "Content", price: 750, icon: MessageSquare, imageUrl: "https://placehold.co/150x150/0d0d12/FFC857?text=+" },
    ];
    const userGems = 1250;

    return (
        <div className={`flex-grow p-4 md:p-6 space-y-4 overflow-y-auto bg-gray-900 ${sansFontClass}`}>
            <div className="flex justify-between items-center mb-4">
                 <h2 className={`text-xl font-bold text-gray-200 ${monoFontClass}`}>Exchange</h2>
                 <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 px-3 py-1 rounded">
                    <Gem className="w-4 h-4 text-[#9B6BFF]"/>
                    <span className={`text-sm font-semibold text-gray-200 ${monoFontClass}`}>{userGems.toLocaleString()}</span>
                 </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {storeItems.map((item) => (
                    <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden flex flex-col hover:border-[#9B6BFF]/50 transition-colors">
                        <div className="aspect-square bg-gray-700 flex items-center justify-center">
                             <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => { 
                                    const target = e.target as HTMLImageElement;
                                    const parent = target.parentElement;
                                    if(parent) { 
                                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-500 text-4xl ${monoFontClass}">${item.name.charAt(0)}</div>`; 
                                    } 
                                }}
                            />
                        </div>
                        <CardHeader className="p-3 flex-grow">
                            <CardTitle className={`text-sm font-semibold text-gray-200 ${monoFontClass}`}>{item.name}</CardTitle>
                            <CardDescription className="text-xs text-gray-400">{item.type}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-3 bg-gray-800/50 border-t border-gray-700">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button variant="outline" size="sm" className={`w-full border-[#9B6BFF]/50 text-[#9B6BFF] hover:bg-[#9B6BFF]/10 hover:text-[#9B6BFF] ${monoFontClass}`}>
                                        <Gem className="w-3 h-3 mr-1"/> {item.price}
                                     </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className={`bg-gray-900 border-purple-800 text-gray-200 ${monoFontClass}`}>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                                    <AlertDialogDescription className={`text-gray-400 ${sansFontClass}`}>
                                        Acquire "{item.name}" for {item.price} gems? Your current balance is {userGems}.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-[#9B6BFF] text-gray-900 hover:bg-[#8a5bff]">Confirm</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};


// --- Tab Bar Component ---
const TabBar = ({ activeTab, setActiveTab }) => { /* ... (same as before) ... */ const tabs = [ { name: 'HQ', icon: Home }, { name: 'Intel', icon: RadioTower }, { name: 'Ops', icon: Target }, { name: 'Store', icon: ShoppingCart }, { name: 'Agent', icon: User }, ]; return ( <div className="h-16 md:h-20 bg-[rgba(13,13,18,0.95)] border-t border-white/10 flex items-center justify-around px-1 md:px-2 sticky bottom-0 z-40"> {tabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.name; return ( <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex flex-col items-center justify-center p-1 md:p-2 rounded-md transition-colors group flex-1 min-w-0 ${ isActive ? 'text-[#9CFF63]' : 'text-gray-400 hover:text-gray-200' }`} aria-current={isActive ? 'page' : undefined} > <Icon className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} /> <span className={`text-[9px] md:text-xs font-medium transition-opacity truncate ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}> {tab.name} </span> </button> ); })} </div> ); };


// --- Main App Component ---
const Mock2 = () => {
    const [activeTab, setActiveTab] = useState('HQ');

    const getTitle = (tab) => { 
        switch (tab) { 
            case 'HQ': return 'HEADQUARTERS'; 
            case 'Intel': return 'INTEL'; 
            case 'Ops': return 'OPERATIONS'; 
            case 'Store': return 'EXCHANGE'; 
            default: return ''; 
        } 
    };
    
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
        <div className={`bg-background text-foreground min-h-screen dark flex flex-col ${sansFontClass}`}>
             {/* Conditionally render StatusBar */}
             {activeTab !== 'Agent' && activeTab !== 'Store' && <StatusBar title={getTitle(activeTab)} />}
             {/* Custom header for Store */}
              {activeTab === 'Store' && ( <div className={`w-full max-w-[1080px] mx-auto ${sansFontClass} relative`}> <div className="h-16 md:h-20 bg-[rgba(13,13,18,0.92)] backdrop-blur-sm text-gray-200 flex items-center justify-between px-4 md:px-6 relative z-10 border-b border-white/10"> <h1 className={`text-lg md:text-xl font-bold ${monoFontClass} uppercase tracking-wider text-gray-300`}>{getTitle(activeTab)}</h1> </div> </div> )}
             <main className="flex-grow flex flex-col overflow-hidden pb-20"> {renderScreen()} </main>
             <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

export default Mock2;

// Helper CSS for scrollbar hiding (if needed, add to your global CSS)
/*
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
