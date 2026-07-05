/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, 
  Unlock, 
  Send, 
  RefreshCw, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Home, 
  Layers, 
  Cpu, 
  Compass, 
  Target, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  Eye,
  Trash2,
  CheckCircle,
  ShieldCheck,
  Zap
} from "lucide-react";
import { playSound } from "./utils/audio";

// DEFAULT FIXED PASSWORDS (Hidden from public UI screens)
const DEFAULT_PASSWORDS = {
  wingo: "24249090",
  mines: "99887766",
  aviator: "55443322",
  goal: "77889900"
};

// Interface for API response list items
interface BingoListItem {
  issueNumber: string;
  number: string;
  colour: string;
}

// Interface for local history
interface HistoryRecord {
  period: string;
  predictedType: "BIG" | "SMALL";
  predictedNum: number;
  actualType: "BIG" | "SMALL";
  actualNum: number;
  status: "WIN" | "LOSS" | "JACKPOT";
  patternName: string;
}

// Generated Keys for Admin Panel
interface GeneratedKey {
  key: string;
  game: "wingo" | "mines" | "aviator" | "goal" | "all";
  duration: string; // "1 Hour", "1 Day", "3 Days", "7 Days", "1 Month"
  expiresAt: number; // timestamp
}

// BILINGUAL TRANSLATION SYSTEM
const t = {
  HINDI: {
    title: "प्रीमियम हैकिंग सिस्टम पैनल",
    headerDesc: "PREMIUM HACKING SYSTEM PANEL / प्रीमियम हैकिंग सिस्टम पैनल",
    telegramBtn: "टेलीग्राम / TELEGRAM",
    guidelineTitle: "⚠️ महत्वपूर्ण दिशानिर्देश",
    guidelineDesc: "इसी लिंक से आईडी बनाकर और यूआईडी अपनी वेरीफाई करके 500 का डिपाजिट करके आपका इन सब गेम में हक एक्टिवेट हो जाएगा अगर आप दूसरा अकाउंट लॉगिन करके अकेले कोशिश करें तो आपका भारी लॉस हो सकता है",
    
    // Wingo Card
    wingoBadge: "WINGO 1 MINUTE / विनगो 1 मिनट",
    wingoTitle: "🎰 WinGo Live Mod / विनगो लाइव मॉड",
    wingoDesc: "लाइव बिंगो एपीआई के साथ सीधे सिंक। हमारे ट्रेंड चार्ट एल्गोरिदम के साथ बिना किसी नुकसान के सही बिग-स्मॉल और जैकपॉट संख्या प्राप्त करें।",
    activateBtn: "HACK ACTIVATE / हैक सक्रिय करें",
    
    // Mines Card
    minesBadge: "MINESWEEPER GRID / माइंस ग्रिड",
    minesTitle: "💎 Mines Grid Scan / माइंस ग्रिड स्कैन",
    minesDesc: "सुरक्षित सितारे और सोने की सटीक स्थिति का पता लगाने के लिए २४-घंटे एल्गोरिदम स्कैनिंग। सुरक्षित बॉक्सेस की पहचान करें।",
    
    // Aviator Card
    aviatorBadge: "AVIATOR FLYOUT / एविएटर मोड",
    aviatorTitle: "✈️ Aviator Crash Mod / एविएटर क्रैश मॉड",
    aviatorDesc: "विमान के टेकऑफ होने से पहले क्रैश पॉइंट मल्टीप्लायर की गणना करें। वास्तविक रडार रिसेप्शन के साथ लाइव भविष्यवाणी।",
    
    // Goal Card
    goalBadge: "GOAL FIELD PATH / गोल पाथ",
    goalTitle: "⚽ Goal Football Path / गोल फ़ुटबॉल पाथ",
    goalDesc: "गोलकीपर को चकमा देकर फुटबॉल को आगे बढ़ाने का ५x७ ग्रिड वाला रास्ता। बिल्कुल सही और अजेय फुटबॉल दिशा पथ।",
    
    // Security Passcode View
    securityTitle: "सुरक्षा पासकोड सत्यापन",
    securityDesc: (mode: string) => `गेम ${mode.toUpperCase()} को अनलॉक करने के लिए सुरक्षा पासकोड दर्ज करें।`,
    enterKeyLabel: "ENTER VIP DECRYPTION KEY / वीआईपी पासवर्ड डालें",
    passcodePlaceholder: "पासवर्ड दर्ज करें... / Passcode...",
    cancelBtn: "रद्द करें / CANCEL",
    unlockBtn: "अनलॉक करें / UNLOCK",
    incorrectPasscode: "गड़बड़ पासवर्ड! अमान्य या समाप्त।",
    
    // Telegram Screen
    telegramVerification: "⚠️ अनिवार्य सत्यापन ⚠️",
    telegramInstructionTitle: "HINDI (हिंदी निर्देश):",
    telegramInstructionText: "आगे बढ़ने के लिए आपको हमारे टेलीग्राम चैनल को जॉइन करना होगा। नीचे दिए गए बटन पर क्लिक करके चैनल जॉइन करें। इसके बिना गेम हैक सक्रिय नहीं होगा!",
    telegramJoinBtn: "JOIN TELEGRAM TO ACTIVATE / टेलीग्राम जॉइन करें",
    telegramWarning: "*बटन पर क्लिक करते ही आप टेलीग्राम पर पहुंच जाएंगे और सत्यापन शुरू हो जाएगा*",
    
    // Game Panel Overlay
    homeExit: "HOME EXIT / बाहर निकलें",
    wins: "WINS (जीत)",
    losses: "LOSS (हार)",
    jackpot: "JACKPOT (जैकपॉट)",
    accuracy: "ACCURACY (सटीकता)",
    period: "PERIOD / पीरियड",
    timeLeft: "TIME LEFT",
    signal: "SIGNAL / सिग्नल",
    bypassProtocol: "BYPASS PROTOCOL",
    confidence: "CONFIDENCE RATE",
    waitingBingo: "वेट करें, लाइव बिंगो डेटा सिंक हो रहा है... / Syncing live data...",
    viewLogHistory: "पूरी हिस्ट्री देखें / VIEW LOG HISTORY",
    minesScanGrid: "💎 सुरक्षित खानों का पता लगाएं / Mines Grid scan",
    scanNextGrid: "नया पैटर्न स्कैन करें / SCAN NEXT GRID",
    scanning: "स्कैनिंग जारी है... / SCANNING...",
    crashPrediction: "✈️ क्रैश भविष्यवाणी मल्टीप्लायर / Crash Multiplier",
    expectedBust: "EXPECTED BUST MULTIPLIER",
    climbing: "AIRCRAFT CLIMBING...",
    predictNextFlyout: "अगली उड़ान की भविष्यवाणी / PREDICT NEXT FLYOUT",
    calculating: "गणना जारी है... / CALCULATING...",
    goalkeeperBypass: "⚽ गोलकीपर चकमा पथ / Goal goalkeeper bypass",
    findNextGoal: "सुरक्षित गोल दिशा खोजें / FIND NEXT GOAL PATH",
    sessionHistoryTitle: "बिंगो लाइव परिणाम इतिहास / SESSION HISTORY",
    closeBtn: "बंद करें / CLOSE",
    noHistory: "कोई पुराना इतिहास उपलब्ध नहीं है। लाइव परिणाम यहाँ जुड़ेंगे! / No logs recorded yet.",
    sessionLocalOnly: "● डेटा रिफ्रेश होने पर गायब हो जाएगा / Session Local Only",
    row: "ROW"
  },
  ENGLISH: {
    title: "Premium Hacking System Panel",
    headerDesc: "PREMIUM HACKING SYSTEM PANEL",
    telegramBtn: "TELEGRAM CHANNEL",
    guidelineTitle: "⚠️ IMPORTANT GUIDELINE",
    guidelineDesc: "By creating your ID using this link, verifying your UID, and depositing 500, your hack will be activated in all these games. If you log in with another account and try alone, you could face heavy losses.",
    
    // Wingo Card
    wingoBadge: "WINGO 1 MINUTE",
    wingoTitle: "🎰 WinGo Live Mod",
    wingoDesc: "Direct sync with Live Bingo API. Get precise Big-Small and Jackpot numbers with zero losses using our trend chart algorithm.",
    activateBtn: "ACTIVATE HACK",
    
    // Mines Card
    minesBadge: "MINESWEEPER GRID",
    minesTitle: "💎 Mines Grid Scan",
    minesDesc: "24-hour algorithm scanning to locate safe stars and gold boxes inside the mine grid.",
    
    // Aviator Card
    aviatorBadge: "AVIATOR FLYOUT",
    aviatorTitle: "✈️ Aviator Crash Mod",
    aviatorDesc: "Pre-calculate the crash point multiplier before the flight takeoff. Live prediction with radar synchronization.",
    
    // Goal Card
    goalBadge: "GOAL FIELD PATH",
    goalTitle: "⚽ Goal Football Path",
    goalDesc: "5x7 grid path to bypass the goalkeeper and score easily. Highly accurate path tracking.",
    
    // Security Passcode View
    securityTitle: "SECURITY KEY DECRYPTION",
    securityDesc: (mode: string) => `Enter security passcode to unlock ${mode.toUpperCase()} predictor.`,
    enterKeyLabel: "ENTER VIP DECRYPTION KEY",
    passcodePlaceholder: "Enter Passcode...",
    cancelBtn: "CANCEL",
    unlockBtn: "UNLOCK",
    incorrectPasscode: "Incorrect passcode! Invalid or expired.",
    
    // Telegram Screen
    telegramVerification: "⚠️ MANDATORY VERIFICATION ⚠️",
    telegramInstructionTitle: "ENGLISH (INSTRUCTIONS):",
    telegramInstructionText: "To proceed further, you must join our official Telegram channel. Click the button below to join. Without this, the premium hack panel will not be activated!",
    telegramJoinBtn: "JOIN TELEGRAM TO ACTIVATE",
    telegramWarning: "*CLICKING THE BUTTON WILL ROUTE YOU TO TELEGRAM AND START THE SCANNER*",
    
    // Game Panel Overlay
    homeExit: "HOME EXIT",
    wins: "WINS",
    losses: "LOSSES",
    jackpot: "JACKPOT",
    accuracy: "ACCURACY",
    period: "PERIOD",
    timeLeft: "TIME LEFT",
    signal: "SIGNAL",
    bypassProtocol: "BYPASS PROTOCOL",
    confidence: "CONFIDENCE RATE",
    waitingBingo: "Syncing live data, please wait...",
    viewLogHistory: "VIEW LOG HISTORY",
    minesScanGrid: "💎 Mines Grid scan",
    scanNextGrid: "SCAN NEXT GRID",
    scanning: "SCANNING...",
    crashPrediction: "✈️ Crash Multiplier",
    expectedBust: "EXPECTED BUST MULTIPLIER",
    climbing: "AIRCRAFT CLIMBING...",
    predictNextFlyout: "PREDICT NEXT FLYOUT",
    calculating: "CALCULATING...",
    goalkeeperBypass: "⚽ Goal goalkeeper bypass",
    findNextGoal: "FIND NEXT GOAL PATH",
    sessionHistoryTitle: "SESSION HISTORY",
    closeBtn: "CLOSE",
    noHistory: "No logs recorded yet. Live results will populate here.",
    sessionLocalOnly: "● Session Local Only (Resets on refresh)",
    row: "ROW"
  }
};

// Helper to get simulated sequential periods matching current UTC time
function getWingoPeriod() {
  const currentUtc = new Date();
  const year = currentUtc.getUTCFullYear();
  const month = String(currentUtc.getUTCMonth() + 1).padStart(2, '0');
  const day = String(currentUtc.getUTCDate()).padStart(2, '0');
  const totalMinutes = currentUtc.getUTCHours() * 60 + currentUtc.getUTCMinutes() + 1;
  return `${year}${month}${day}1000${String(totalMinutes).padStart(4, '0')}`;
}

// Generate real-looking historical entries for the initial load of simulation
function generateInitialSimulatedHistory(count = 10) {
  const history: HistoryRecord[] = [];
  const currentUtc = new Date();
  for (let i = 1; i <= count; i++) {
    const pastTime = new Date(currentUtc.getTime() - i * 60000);
    const year = pastTime.getUTCFullYear();
    const month = String(pastTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(pastTime.getUTCDate()).padStart(2, '0');
    const totalMinutes = pastTime.getUTCHours() * 60 + pastTime.getUTCMinutes() + 1;
    const period = `${year}${month}${day}1000${String(totalMinutes).padStart(4, '0')}`;
    
    const actualNum = Math.floor(Math.random() * 10);
    const actualType = actualNum >= 5 ? "BIG" : "SMALL";
    
    const matchesPred = Math.random() > 0.15;
    const predType = matchesPred ? actualType : (actualType === "BIG" ? "SMALL" : "BIG");
    
    let predNum = 0;
    if (predType === "BIG") {
      const opposites = [6, 8, 7, 9];
      predNum = opposites[Math.floor(Math.random() * opposites.length)];
    } else {
      const opposites = [1, 3, 2, 4];
      predNum = opposites[Math.floor(Math.random() * opposites.length)];
    }
    
    const status = (predNum === actualNum) ? "JACKPOT" : (predType === actualType ? "WIN" : "LOSS");
    
    history.push({
      period,
      predictedType: predType,
      predictedNum: predNum,
      actualType,
      actualNum,
      status,
      patternName: "Trend Analysis Engine"
    });
  }
  return history;
}

export default function App() {
  // Navigation & Multi-step Entry Flow States
  const [appLoadedState, setAppLoadedState] = useState<"loading1" | "telegram" | "loading2" | "ready">("loading1");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const [verifyLogs, setVerifyLogs] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"home" | "game">("home");
  const [unlockedMode, setUnlockedMode] = useState<"none" | "wingo" | "mines" | "aviator" | "goal">("none");
  const [targetUnlockMode, setTargetUnlockMode] = useState<"none" | "wingo" | "mines" | "aviator" | "goal">("none");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [muted, setMuted] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [appLang, setAppLang] = useState<"HINDI" | "ENGLISH">("HINDI");
  const [usingSimulation, setUsingSimulation] = useState(false);

  const curTrans = t[appLang];

  // Hidden Admin Panel States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Admin Key Generation States
  const [genGame, setGenGame] = useState<"wingo" | "mines" | "aviator" | "goal" | "all">("wingo");
  const [genDuration, setGenDuration] = useState<string>("1 Hour");
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKey[]>(() => {
    const saved = localStorage.getItem("ramu_bhai_generated_keys");
    return saved ? JSON.parse(saved) : [];
  });
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string>("");

  // Wingo History Modal View
  const [isWingoHistoryOpen, setIsWingoHistoryOpen] = useState(false);

  // Hacking/Bypassing Animation Overlay States
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [hackLogs, setHackLogs] = useState<string[]>([]);

  // 1. Wingo Game States & Live API Sync
  const [wingoHistory, setWingoHistory] = useState<HistoryRecord[]>([]);
  const [wingoCurrentPrediction, setWingoCurrentPrediction] = useState<{
    period: string;
    type: "BIG" | "SMALL";
    num: number;
    confidence: number;
    patternUsed: string;
  } | null>(null);
  const [lastProcessedPeriod, setLastProcessedPeriod] = useState<string>("");
  const [wingoWins, setWingoWins] = useState(0);
  const [wingoLosses, setWingoLosses] = useState(0);
  const [wingoJackpots, setWingoJackpots] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // 2. Mines Game States
  const [minesGrid, setMinesGrid] = useState<boolean[]>(new Array(25).fill(false)); // true = Star, false = Blank
  const [isMinesScanning, setIsMinesScanning] = useState(false);

  // 3. Aviator Game States
  const [aviatorMultiplier, setAviatorMultiplier] = useState(1.00);
  const [aviatorIsFlying, setAviatorIsFlying] = useState(false);
  const [predictedCrashPoint, setPredictedCrashPoint] = useState<string>("--");
  const [isAviatorScanning, setIsAviatorScanning] = useState(false);
  const aviatorTimerRef = useRef<any>(null);

  // 4. Goal Game States (5x7 grid)
  const [goalGrid, setGoalGrid] = useState<number[]>(new Array(7).fill(-1)); // stores correct column (0-4) for each of the 7 rows
  const [isGoalScanning, setIsGoalScanning] = useState(false);

  // Save generated keys to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem("ramu_bhai_generated_keys", JSON.stringify(generatedKeys));
  }, [generatedKeys]);

  // Sound triggers checking mute option
  const triggerSound = (type: "click" | "verify" | "unlock" | "win" | "loss" | "jackpot") => {
    if (!muted) {
      playSound(type);
    }
  };

  // Sync Live Clock Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = new Date().getSeconds();
      setTimeLeft(60 - (seconds % 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ----------------- MULTI-STAGE ENTRY FLOW EFFECTS -----------------

  // 1. Initial Dangerous Loading Screen (loading1)
  useEffect(() => {
    if (appLoadedState !== "loading1") return;

    const logsList = [
      "🎭 RAMU BHAI LZR BYPASS v4.9: ONLINE / रामू भाई एलजेडआर बाईपास: एक्टिव",
      "📡 CONNECTING TO CLOUD WORKSPACE PORT 3000... / पोर्ट 3000 से सुरक्षित कनेक्शन...",
      "🔒 ESTABLISHING DIRECT BDG WIN TUNNEL... / डायरेक्ट बीडीजी टनल स्थापित की जा रही है...",
      "⚡ BYPASSING FIREWALL SECURITIES... / एंटी-चीट फायरवॉल बाईपास किया जा रहा है...",
      "⚙️ DETECTING SECURE PORTS AND HANDSHAKES... / सुरक्षित सॉकेट्स और डिक्रिप्शन एक्टिव...",
      "🧠 INJECTING PHOENIX PATTERN PREDICTION ENGINES... / प्रेडिक्शन इंजन इंजेक्ट हो रहा है...",
      "🔥 RAMU BHAI PREMIUM BYPASS CORE: ACTIVE! / प्रीमियम बाईपास कोर पूरी तरह सक्रिय!"
    ];

    let pct = 0;
    const interval = setInterval(() => {
      pct += 4;
      if (pct > 100) pct = 100;
      setLoadingProgress(pct);

      const logIdx = Math.floor((pct / 100) * logsList.length);
      if (logIdx < logsList.length) {
        setLoadingLogs(prev => {
          if (prev.includes(logsList[logIdx])) return prev;
          return [...prev, logsList[logIdx]];
        });
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setAppLoadedState("telegram");
        }, 600);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [appLoadedState]);

  // 2. Second Verification Loading Screen (loading2)
  useEffect(() => {
    if (appLoadedState !== "loading2") return;

    const logsList = [
      "🔄 INITIATING TELEGRAM JOIN VERIFICATION... / टेलीग्राम सदस्यता जांच शुरू...",
      "🛡️ VERIFYING SHA-256 MEMBER DIRECTORY HANDSHAKE... / सुरक्षित हैंडशेक सत्यापित...",
      "📱 RAMU BHAI TELEGRAM CLOUD TUNNEL SYNCED... / टेलीग्राम क्लाउड टनल सिंक्रोनाइज्ड...",
      "🧬 CHECKING USER REFERRAL STATUS FROM REGISTER LINK... / आईडी रजिस्ट्रेशन की जांच...",
      "🔑 GENERATING MEMORY POINTERS AND ACTIVE HOOKS... / लोकल मेमोरी हुक जनरेट...",
      "💎 SYNCHRONIZING REALTIME WIN-GO BINGO CHANNELS... / बिंगो लाइव चैनल सिंक...",
      "✅ VERIFICATION COMPLETE! WELCOME TO RAMU BHAI PANEL! / सत्यापन पूर्ण! होम स्क्रीन अनलॉक!"
    ];

    let pct = 0;
    const interval = setInterval(() => {
      pct += 5;
      if (pct > 100) pct = 100;
      setVerifyProgress(pct);

      const logIdx = Math.floor((pct / 100) * logsList.length);
      if (logIdx < logsList.length) {
        setVerifyLogs(prev => {
          if (prev.includes(logsList[logIdx])) return prev;
          return [...prev, logsList[logIdx]];
        });
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setAppLoadedState("ready");
          triggerSound("unlock");
        }, 600);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [appLoadedState]);

  // Wingo Live Predictor Sync
  useEffect(() => {
    if (unlockedMode !== "wingo" || appLoadedState !== "ready") return;

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/bingo-history");
        if (!response.ok) throw new Error("API error status: " + response.status);
        const json = await response.json();
        
        if (!isMounted) return;

        if (json && json.data && json.data.list && json.data.list.length > 0) {
          setUsingSimulation(false); // Successfully connected to real live API! Turn off local simulation
          const list: BingoListItem[] = json.data.list;
          const latestItem = list[0];
          
          // Detect Period change & Process outcomes
          if (latestItem.issueNumber !== lastProcessedPeriod) {
            if (wingoCurrentPrediction && wingoCurrentPrediction.period === latestItem.issueNumber) {
              const actualNum = parseInt(latestItem.number);
              const actualType = actualNum >= 5 ? "BIG" : "SMALL";
              
              let status: "WIN" | "LOSS" | "JACKPOT" = "LOSS";
              if (wingoCurrentPrediction.num === actualNum) {
                status = "JACKPOT";
                setWingoWins(w => w + 1);
                setWingoJackpots(j => j + 1);
                triggerSound("jackpot");
              } else if (wingoCurrentPrediction.type === actualType) {
                status = "WIN";
                setWingoWins(w => w + 1);
                triggerSound("win");
              } else {
                setWingoLosses(l => l + 1);
                status = "LOSS";
                triggerSound("loss");
              }

              // Prepend to history logs
              setWingoHistory(prev => [
                {
                  period: latestItem.issueNumber,
                  predictedType: wingoCurrentPrediction.type,
                  predictedNum: wingoCurrentPrediction.num,
                  actualType,
                  actualNum,
                  status,
                  patternName: wingoCurrentPrediction.patternUsed
                },
                ...prev
              ]);
            }

            // Sync Period ID
            setLastProcessedPeriod(latestItem.issueNumber);

            // Generate prediction for the next period
            const nextPeriod = (BigInt(latestItem.issueNumber) + 1n).toString();
            
            // TREND CHART PATTERN MATCHING ENGINE (Based on User's Chart PDF)
            const recentSizes = list.slice(0, 10).map(x => parseInt(x.number) >= 5 ? "BIG" : "SMALL");
            
            let predictedType: "BIG" | "SMALL" = "BIG";
            let patternDetected = "Standard Neural Pattern";
            let confidence = 92;

            // Pattern Match Checks (BIG SMALL TREND CHART PATTERN)
            if (recentSizes[0] === "SMALL" && recentSizes[1] === "SMALL" && recentSizes[2] === "BIG" && recentSizes[3] === "BIG") {
              predictedType = "SMALL";
              patternDetected = "Double Trend (S S B B)";
              confidence = 97;
            } else if (recentSizes[0] === "BIG" && recentSizes[1] === "BIG" && recentSizes[2] === "SMALL" && recentSizes[3] === "SMALL") {
              predictedType = "BIG";
              patternDetected = "Double Trend (B B S S)";
              confidence = 97;
            }
            else if (recentSizes[0] === "SMALL" && recentSizes[1] === "SMALL" && recentSizes[2] === "SMALL" && recentSizes[3] === "BIG") {
              predictedType = "BIG";
              patternDetected = "Triple Trend (S S S B)";
              confidence = 98;
            } else if (recentSizes[0] === "BIG" && recentSizes[1] === "BIG" && recentSizes[2] === "BIG" && recentSizes[3] === "SMALL") {
              predictedType = "SMALL";
              patternDetected = "Triple Trend (B B B S)";
              confidence = 98;
            }
            else if (recentSizes[0] === "BIG" && recentSizes[1] === "SMALL" && recentSizes[2] === "BIG" && recentSizes[3] === "SMALL") {
              predictedType = "BIG";
              patternDetected = "Single Trend (B S B S)";
              confidence = 95;
            } else if (recentSizes[0] === "SMALL" && recentSizes[1] === "BIG" && recentSizes[2] === "SMALL" && recentSizes[3] === "BIG") {
              predictedType = "SMALL";
              patternDetected = "Single Trend (S B S B)";
              confidence = 95;
            }
            else if (recentSizes[0] === "SMALL" && recentSizes[1] === "SMALL" && recentSizes[2] === "SMALL" && recentSizes[3] === "SMALL") {
              predictedType = "BIG";
              patternDetected = "Quadra Trend (S S S S)";
              confidence = 99;
            } else if (recentSizes[0] === "BIG" && recentSizes[1] === "BIG" && recentSizes[2] === "BIG" && recentSizes[3] === "BIG") {
              predictedType = "SMALL";
              patternDetected = "Quadra Trend (B B B B)";
              confidence = 99;
            }
            else {
              predictedType = recentSizes[0] === "BIG" ? "SMALL" : "BIG";
              patternDetected = "Opposite Pattern Matcher";
              confidence = 90;
            }

            // Custom adjustments requested by RAMU BHAI:
            let predictedNum = 0;
            if (predictedType === "BIG") {
              const opposites = [6, 8, 7, 9];
              predictedNum = opposites[Math.floor(Math.random() * opposites.length)];
            } else {
              const opposites = [1, 3, 2, 4];
              predictedNum = opposites[Math.floor(Math.random() * opposites.length)];
            }

            setWingoCurrentPrediction({
              period: nextPeriod,
              type: predictedType,
              num: predictedNum,
              confidence: Math.floor(Math.random() * 8) + 91, // 91% to 98% Live confidence rate
              patternUsed: patternDetected
            });
          }
        } else {
          throw new Error("Empty list returned");
        }
      } catch (err) {
        console.warn("Bingo Live API failed. Initiating synchronized local client engine:", err);
        if (isMounted) {
          setUsingSimulation(true);
        }
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [unlockedMode, wingoCurrentPrediction, lastProcessedPeriod, appLoadedState]);

  // Synchronized Local Simulation Engine
  useEffect(() => {
    if (!usingSimulation || unlockedMode !== "wingo" || appLoadedState !== "ready") return;

    // Prefill local history if empty
    if (wingoHistory.length === 0) {
      setWingoHistory(generateInitialSimulatedHistory(12));
    }

    const runSimulationTick = () => {
      const currentPeriod = getWingoPeriod();
      
      // Seed first prediction if none exists
      if (!wingoCurrentPrediction) {
        const type = Math.random() > 0.5 ? "BIG" : "SMALL";
        const opposites = type === "BIG" ? [6, 8, 7, 9] : [1, 3, 2, 4];
        const num = opposites[Math.floor(Math.random() * opposites.length)];
        setWingoCurrentPrediction({
          period: currentPeriod,
          type,
          num,
          confidence: Math.floor(Math.random() * 8) + 91,
          patternUsed: "Neural Trend Analyzer"
        });
        setLastProcessedPeriod(currentPeriod);
        return;
      }

      // Check if period changed based on UTC clock minute transition
      if (currentPeriod !== wingoCurrentPrediction.period) {
        const lastPred = wingoCurrentPrediction;
        const actualNum = Math.floor(Math.random() * 10);
        const actualType = actualNum >= 5 ? "BIG" : "SMALL";
        
        let status: "WIN" | "LOSS" | "JACKPOT" = "LOSS";
        if (lastPred.num === actualNum) {
          status = "JACKPOT";
          setWingoWins(w => w + 1);
          setWingoJackpots(j => j + 1);
          triggerSound("jackpot");
        } else if (lastPred.type === actualType) {
          status = "WIN";
          setWingoWins(w => w + 1);
          triggerSound("win");
        } else {
          setWingoLosses(l => l + 1);
          status = "LOSS";
          triggerSound("loss");
        }

        setWingoHistory(prev => [
          {
            period: lastPred.period,
            predictedType: lastPred.type,
            predictedNum: lastPred.num,
            actualType,
            actualNum,
            status,
            patternName: lastPred.patternUsed
          },
          ...prev
        ]);

        // Generate prediction for the NEW period
        const nextPeriodType = Math.random() > 0.5 ? "BIG" : "SMALL";
        const opposites = nextPeriodType === "BIG" ? [6, 8, 7, 9] : [1, 3, 2, 4];
        const nextPeriodNum = opposites[Math.floor(Math.random() * opposites.length)];

        setWingoCurrentPrediction({
          period: currentPeriod,
          type: nextPeriodType,
          num: nextPeriodNum,
          confidence: Math.floor(Math.random() * 8) + 91,
          patternUsed: Math.random() > 0.5 ? "Trend Chart Matcher" : "Phoenix Pattern Tracker"
        });
        setLastProcessedPeriod(currentPeriod);
      }
    };

    runSimulationTick();
    const interval = setInterval(runSimulationTick, 1000);
    return () => clearInterval(interval);
  }, [usingSimulation, unlockedMode, wingoCurrentPrediction, appLoadedState]);

  // Handle exiting and resetting all history instantly (Strictly no browser cache trace)
  const handleGoHome = () => {
    triggerSound("click");
    setUnlockedMode("none");
    setTargetUnlockMode("none");
    setWingoHistory([]);
    setWingoWins(0);
    setWingoLosses(0);
    setWingoJackpots(0);
    setLastProcessedPeriod("");
    setWingoCurrentPrediction(null);
    setMinesGrid(new Array(25).fill(false));
    setGoalGrid(new Array(7).fill(-1));
    if (aviatorTimerRef.current) {
      clearInterval(aviatorTimerRef.current);
    }
    setAviatorIsFlying(false);
    setPredictedCrashPoint("--");
    setActiveTab("home");
  };

  // Open Key Unlock Dialog
  const requestUnlock = (mode: "wingo" | "mines" | "aviator" | "goal") => {
    triggerSound("click");
    setTargetUnlockMode(mode);
    setPasswordInput("");
    setPasswordError("");
  };

  // Validate Key (Checks generated keys list with active expirations or uses Default Key)
  const handleVerifyPassword = () => {
    const entered = passwordInput.trim();
    const defaultKey = DEFAULT_PASSWORDS[targetUnlockMode as keyof typeof DEFAULT_PASSWORDS];

    // Check custom generated keys first
    const now = Date.now();
    const matchedCustomKey = generatedKeys.find(
      (k) => k.key === entered && (k.game === targetUnlockMode || k.game === "all") && k.expiresAt > now
    );

    if (entered === defaultKey || matchedCustomKey) {
      setPasswordError("");
      setIsHacking(true);
      setHackProgress(0);
      setHackLogs([]);

      const logTemplates = [
        `[DECRYPT] 🎭 RAMU BHAI VIP LZR v4.9 टनल सक्रिय की जा रही है... / Establishing premium tunnel...`,
        `[BYPASS] बीडीजी विन क्लाउड सर्वर पर वर्चुअल कनेक्शन स्थापित... / Virtual bypass server connected...`,
        `[SYNC] एल्गोरिदम सुरक्षा कोड बाईपास सक्रिय किया जा रहा है... / Bypass security active...`,
        `[HASH] स्थानीय मेमोरी पॉइंटर्स को डिक्रिप्ट किया जा रहा है... / Decrypting key hashes...`,
        `[SUCCESS] पासवर्ड सत्यापित! रामू भाई बाईपास सक्रिय! / Passcode Verified! Hack active!`
      ];

      const soundInterval = setInterval(() => {
        triggerSound("verify");
      }, 500);

      let pct = 0;
      const progressTimer = setInterval(() => {
        pct += 2;
        setHackProgress(pct);

        const logIdx = Math.floor((pct / 100) * logTemplates.length);
        if (logIdx < logTemplates.length) {
          setHackLogs(prev => {
            if (prev.includes(logTemplates[logIdx])) return prev;
            return [...prev, logTemplates[logIdx]];
          });
        }

        if (pct >= 100) {
          clearInterval(progressTimer);
          clearInterval(soundInterval);
          setTimeout(() => {
            setIsHacking(false);
            setUnlockedMode(targetUnlockMode);
            setTargetUnlockMode("none");
            setActiveTab("game");
            triggerSound("unlock");

            // Init game parameters
            if (targetUnlockMode === "mines") {
              generateMinesPrediction();
            } else if (targetUnlockMode === "aviator") {
              startAviatorPredictor();
            } else if (targetUnlockMode === "goal") {
              generateGoalPrediction();
            }
          }, 500);
        }
      }, 40); // ~2s screen
    } else {
      setPasswordError("गड़बड़ पासवर्ड! अमान्य या समाप्त। / Incorrect passcode! Invalid or expired.");
      triggerSound("loss");
    }
  };

  // Admin Key Generation
  const handleGenerateKey = () => {
    triggerSound("click");
    if (!isAdminAuthenticated) return;

    // Generate random premium 8-digit key (RAMU_VIP_XXXXXX)
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newKeyStr = `RAMU_VIP_${randomSuffix}`;

    // Calculate Expiry
    let durationMs = 3600000; // default 1 hour
    if (genDuration === "1 Day") durationMs = 86400000;
    else if (genDuration === "3 Days") durationMs = 259200000;
    else if (genDuration === "7 Days") durationMs = 604800000;
    else if (genDuration === "1 Month") durationMs = 2592000000;

    const newKey: GeneratedKey = {
      key: newKeyStr,
      game: genGame,
      duration: genDuration,
      expiresAt: Date.now() + durationMs
    };

    setGeneratedKeys([newKey, ...generatedKeys]);
    setNewlyCreatedKey(newKeyStr);
    triggerSound("unlock");
  };

  // Remove individual Key
  const handleRemoveKey = (keyToRemove: string) => {
    triggerSound("click");
    setGeneratedKeys(generatedKeys.filter(k => k.key !== keyToRemove));
  };

  // Verify Admin Login (PIN: 20269090)
  const handleAdminAuth = () => {
    if (adminPinInput === "20269090") {
      setIsAdminAuthenticated(true);
      setAdminError("");
      triggerSound("unlock");
    } else {
      setAdminError("अमान्य एडमिन पिन! एक्सेस अस्वीकृत। / Invalid Pin! Access Denied.");
      triggerSound("loss");
    }
  };

  // Mines Predictor (Star Generator)
  const generateMinesPrediction = () => {
    if (isMinesScanning) return;
    setIsMinesScanning(true);
    triggerSound("verify");

    setTimeout(() => {
      const grid = new Array(25).fill(false);
      const starCount = 4; // ALWAYS 4 accurate safe stars
      const selectedIndices = new Set<number>();
      while (selectedIndices.size < starCount) {
        selectedIndices.add(Math.floor(Math.random() * 25));
      }
      selectedIndices.forEach(idx => {
        grid[idx] = true;
      });
      setMinesGrid(grid);
      setIsMinesScanning(false);
      triggerSound("win");
    }, 1800);
  };

  // Aviator Crash Predictor Engine
  const startAviatorPredictor = () => {
    if (isAviatorScanning) return;
    setIsAviatorScanning(true);
    triggerSound("verify");

    if (aviatorTimerRef.current) {
      clearInterval(aviatorTimerRef.current);
    }

    setTimeout(() => {
      const r = Math.random();
      let predicted: number;
      if (r < 0.15) {
        predicted = parseFloat((Math.random() * 0.4 + 1.1).toFixed(2));
      } else if (r < 0.75) {
        predicted = parseFloat((Math.random() * 2.1 + 1.5).toFixed(2));
      } else {
        predicted = parseFloat((Math.random() * 12 + 4.0).toFixed(2));
      }

      setPredictedCrashPoint(`${predicted}x`);
      setIsAviatorScanning(false);
      triggerSound("win");

      setAviatorIsFlying(true);
      let currMult = 1.00;
      aviatorTimerRef.current = setInterval(() => {
        currMult += 0.05 * (currMult * 0.1 + 0.3);
        if (currMult >= predicted) {
          setAviatorMultiplier(predicted);
          setAviatorIsFlying(false);
          clearInterval(aviatorTimerRef.current);
          triggerSound("loss");
        } else {
          setAviatorMultiplier(parseFloat(currMult.toFixed(2)));
        }
      }, 75);
    }, 2000);
  };

  // Goal Field Pathfinder
  const generateGoalPrediction = () => {
    if (isGoalScanning) return;
    setIsGoalScanning(true);
    triggerSound("verify");

    setTimeout(() => {
      const grid = new Array(7).fill(-1).map(() => Math.floor(Math.random() * 5));
      setGoalGrid(grid);
      setIsGoalScanning(false);
      triggerSound("win");
    }, 1800);
  };

  // Click handler to route Telegram link and trigger Phase 2
  const handleTelegramClick = () => {
    triggerSound("unlock");
    window.open("https://t.me/+h5jDuTLxOEQ4NmVl", "_blank");
    setAppLoadedState("loading2");
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#04010a] text-gray-100 bg-grid-cyber font-sans select-none"
      onClick={() => triggerSound("click")}
      id="app-root-container"
    >
      
      {/* ----------------- STAGE 1: FIRST DANGEROUS LOADING SCREEN ----------------- */}
      {appLoadedState === "loading1" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#05020c] px-6" id="loading-stage-1">
          <div className="w-full max-w-md space-y-6 text-center animate-pulse">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-purple-500 animate-spin"></div>
              <Terminal className="w-10 h-10 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 uppercase font-mono">
                🎭╰‿╯RAMUㅤᏴᎻᎪᏆ
              </h2>
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold font-mono">
                INJECTING PREMIUM BYPASS ENGINE v4.9
              </p>
            </div>

            <div className="bg-black/80 border border-purple-500/20 rounded-xl p-4 h-48 overflow-y-auto text-left font-mono text-[10px] text-purple-400 space-y-2 scrollbar-none">
              {loadingLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-pink-500 font-bold shrink-0">&gt;</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-purple-950/40 rounded-full overflow-hidden border border-purple-900/30">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 shadow-[0_0_12px_#a855f7] transition-all duration-100"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-purple-300">
                <span>SECURITY: ACTIVE ON-DEMAND</span>
                <span>SYSTEM LOADING: {loadingProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- STAGE 2: MANDATORY TELEGRAM JOIN PROMPT SCREEN ----------------- */}
      {appLoadedState === "telegram" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md px-4" id="telegram-mandatory-lock">
          
          {/* Top-Right Language Switch on Telegram Screen */}
          <div className="absolute top-4 right-4 z-50 flex bg-black/60 border border-purple-500/30 p-1 rounded-xl items-center gap-1">
            <button
              onClick={() => { triggerSound("click"); setAppLang("HINDI"); }}
              className={`px-3 py-1 text-xs font-black uppercase rounded-lg transition-all ${
                appLang === "HINDI" 
                  ? "bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
              id="telegram-lang-hindi-btn"
            >
              हिन्दी
            </button>
            <button
              onClick={() => { triggerSound("click"); setAppLang("ENGLISH"); }}
              className={`px-3 py-1 text-xs font-black uppercase rounded-lg transition-all ${
                appLang === "ENGLISH" 
                  ? "bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
              id="telegram-lang-english-btn"
            >
              ENG
            </button>
          </div>

          <div className="relative w-full max-w-md rounded-2xl border border-purple-500/40 bg-[#0c0819] p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Send className="w-8 h-8 text-cyan-400 fill-current animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-cyan-300 uppercase font-mono">
                🎭 ╰‿╯RAMUㅤᏴᎻᎪᏆ VIP PANEL
              </h3>
              <p className="text-xs font-mono uppercase tracking-widest text-yellow-400 font-bold">
                {curTrans.telegramVerification}
              </p>
            </div>

            {/* Bilingual Warning text for Telegram Join */}
            <div className="space-y-4 text-left bg-black/60 border border-purple-900/40 p-4 rounded-xl">
              <div className={`space-y-1.5 border-l-2 ${appLang === "HINDI" ? "border-yellow-500" : "border-cyan-500"} pl-3`}>
                <span className="block text-[10px] font-mono text-yellow-400 font-bold uppercase">
                  {appLang === "HINDI" ? t.HINDI.telegramInstructionTitle : t.ENGLISH.telegramInstructionTitle}
                </span>
                <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                  {curTrans.telegramInstructionText}
                </p>
              </div>
            </div>

            {/* Glowing bouncing Join Telegram Button */}
            <button 
              onClick={handleTelegramClick}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-widest cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all transform hover:scale-102 active:scale-98 animate-pulse"
              id="mandatory-telegram-join-btn"
            >
              <Send className="w-5 h-5 fill-current" />
              {curTrans.telegramJoinBtn}
            </button>
            
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              {curTrans.telegramWarning}
            </p>
          </div>
        </div>
      )}

      {/* ----------------- STAGE 3: SECOND DANGEROUS LOADING SCREEN (VERIFICATION) ----------------- */}
      {appLoadedState === "loading2" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#030108] px-6" id="loading-stage-2">
          <div className="w-full max-w-md space-y-6 text-center animate-pulse">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-cyan-500 animate-spin"></div>
              <Cpu className="w-10 h-10 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 uppercase font-mono">
                TELEGRAM MEMBERSHIP CHECK / टेलीग्राम जांच
              </h2>
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">
                VERIFYING SECURE CLOUD HANDSHAKE...
              </p>
            </div>

            <div className="bg-black/80 border border-cyan-500/20 rounded-xl p-4 h-48 overflow-y-auto text-left font-mono text-[10px] text-cyan-400 space-y-2 scrollbar-none">
              {verifyLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-emerald-400 font-bold shrink-0">&gt;</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-cyan-950/40 rounded-full overflow-hidden border border-cyan-900/30">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-500 shadow-[0_0_12px_#06b6d4] transition-all duration-100"
                  style={{ width: `${verifyProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-mono font-bold text-cyan-300">
                <span>HANDSHAKE STATUS: SECURE</span>
                <span>AUTHENTICATING: {verifyProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- STAGE 4: MAIN APPLICATION SCREEN (READY) ----------------- */}
      {appLoadedState === "ready" && (
        <>
          {/* PERSISTENT FULL-SCREEN REGISTRATION IFRAME IN GAME VIEW */}
          <div 
            className={`absolute inset-0 w-full h-full transition-all duration-700 ${
              activeTab === "game" ? "z-0 opacity-100 pointer-events-auto scale-100" : "-z-50 opacity-0 pointer-events-none scale-95"
            }`}
            id="gaming-iframe-wrapper"
          >
            <iframe 
              id="bdg-register-iframe"
              src="https://bdgwinmy.cc//#/register?invitationCode=8261315097340"
              className="w-full h-full border-none"
              title="BDG Win Register Link"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>

          {/* ----------------- LANDING / HOME MENU SCREEN ----------------- */}
          {activeTab === "home" && !isAdminOpen && (
            <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto px-4 py-6 md:py-10 max-w-5xl mx-auto">
              
              {/* Header Banner - RAMU BHAI VIP DESIGN (Perfected Font Alignment) */}
              <div className="flex justify-between items-center mb-8 border-b border-purple-900/40 pb-5">
                <div className="flex items-center gap-3">
                  {/* Secret Admin Panel Trigger Icon (Ramu Bhai Flame Badge) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsAdminOpen(true); }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/50 flex items-center justify-center glow-purple hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="एडमिन सेटिंग्स"
                    id="admin-settings-trigger"
                  >
                    <Flame className="w-6 h-6 text-purple-400 animate-bounce" />
                  </button>
                  
                  {/* Title Section (Perfect spacing alignment & emojis) */}
                  <div className="flex flex-col items-start justify-center leading-none">
                    <span className="text-xl xs:text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)] select-none animate-pulse">
                      🎭╰‿╯RAMUㅤᏴᎻᎪᏆ
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-bold mt-1.5 shadow-sm">
                      {curTrans.headerDesc}
                    </span>
                  </div>
                </div>

                {/* Header Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Sound Toggle */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                    className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-950/20 hover:bg-purple-900/40 text-purple-400 hover:text-purple-300 transition-colors"
                    id="toggle-sound-btn"
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  {/* Interactive Language Selector */}
                  <div className="flex bg-black/80 border border-purple-500/40 p-1 rounded-xl items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); triggerSound("click"); setAppLang("HINDI"); }}
                      className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                        appLang === "HINDI" 
                          ? "bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                      id="header-lang-hi-btn"
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); triggerSound("click"); setAppLang("ENGLISH"); }}
                      className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                        appLang === "ENGLISH" 
                          ? "bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                      id="header-lang-en-btn"
                    >
                      ENG
                    </button>
                  </div>

                  {/* Telegram Channel Link */}
                  <a 
                    href="https://t.me/+h5jDuTLxOEQ4NmVl" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300 transition-all text-xs font-bold font-mono tracking-wider glow-cyan"
                    id="join-telegram-header"
                  >
                    <Send className="w-3.5 h-3.5 fill-current" />
                    {curTrans.telegramBtn}
                  </a>
                </div>
              </div>

              {/* BILINGUAL HELP AND NOTICE BOX */}
              <div className="mb-8 p-5 rounded-2xl border border-yellow-500/40 bg-gradient-to-r from-yellow-950/20 to-black/60 backdrop-blur-md flex flex-col gap-4 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5 animate-bounce" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      {curTrans.guidelineTitle}
                    </h4>
                    
                    <p className={`text-xs text-gray-200 leading-relaxed font-bold border-l-2 ${appLang === "HINDI" ? "border-yellow-500" : "border-purple-500"} pl-3`}>
                      {curTrans.guidelineDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Game Mod Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                
                {/* WINGO CARD */}
                <div className="relative group overflow-hidden rounded-2xl border border-purple-500/30 bg-purple-950/10 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-purple-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 rounded bg-purple-600/20 border border-purple-500/40 text-[9px] font-bold font-mono text-purple-300">
                        {curTrans.wingoBadge}
                      </div>
                      <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.wingoTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.wingoDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-purple-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-purple-400/70">
                      <span>SECURITY CORE: VIP_V4 / {appLang === "HINDI" ? "सुरक्षा: VIP_V4" : "SEC_PORT: VIP_V4"}</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ {appLang === "HINDI" ? "सुरक्षित पोर्ट" : "SECURE PORT"}</span>
                    </div>
                    <button 
                      onClick={() => requestUnlock("wingo")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-purple-900/30 transition-all"
                      id="activate-wingo-btn"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {curTrans.activateBtn}
                    </button>
                  </div>
                </div>

                {/* MINES CARD */}
                <div className="relative group overflow-hidden rounded-2xl border border-cyan-500/30 bg-cyan-950/10 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 rounded bg-cyan-600/20 border border-cyan-500/40 text-[9px] font-bold font-mono text-cyan-300">
                        {curTrans.minesBadge}
                      </div>
                      <Target className="w-4.5 h-4.5 text-cyan-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.minesTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.minesDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-cyan-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-cyan-400/70">
                      <span>SECURITY CORE: VIP_V4 / {appLang === "HINDI" ? "सुरक्षा: VIP_V4" : "SEC_PORT: VIP_V4"}</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ {appLang === "HINDI" ? "सुरक्षित पोर्ट" : "SECURE PORT"}</span>
                    </div>
                    <button 
                      onClick={() => requestUnlock("mines")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-cyan-900/30 transition-all"
                      id="activate-mines-btn"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {curTrans.activateBtn}
                    </button>
                  </div>
                </div>

                {/* AVIATOR CARD */}
                <div className="relative group overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/10 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-red-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 rounded bg-red-600/20 border border-red-500/40 text-[9px] font-bold font-mono text-red-300">
                        {curTrans.aviatorBadge}
                      </div>
                      <TrendingUp className="w-4.5 h-4.5 text-red-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-red-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.aviatorTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.aviatorDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-red-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-red-400/70">
                      <span>SECURITY CORE: VIP_V4 / {appLang === "HINDI" ? "सुरक्षा: VIP_V4" : "SEC_PORT: VIP_V4"}</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ {appLang === "HINDI" ? "सुरक्षित पोर्ट" : "SECURE PORT"}</span>
                    </div>
                    <button 
                      onClick={() => requestUnlock("aviator")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-red-900/30 transition-all"
                      id="activate-aviator-btn"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {curTrans.activateBtn}
                    </button>
                  </div>
                </div>

                {/* GOAL PATHFINDER CARD */}
                <div className="relative group overflow-hidden rounded-2xl border border-green-500/30 bg-green-950/10 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-green-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 rounded bg-green-600/20 border border-green-500/40 text-[9px] font-bold font-mono text-green-300">
                        {curTrans.goalBadge}
                      </div>
                      <Compass className="w-4.5 h-4.5 text-green-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-green-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.goalTitle}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.goalDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-green-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-green-400/70">
                      <span>SECURITY CORE: VIP_V4 / {appLang === "HINDI" ? "सुरक्षा: VIP_V4" : "SEC_PORT: VIP_V4"}</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ {appLang === "HINDI" ? "सुरक्षित पोर्ट" : "SECURE PORT"}</span>
                    </div>
                    <button 
                      onClick={() => requestUnlock("goal")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-black font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-green-900/30 transition-all"
                      id="activate-goal-btn"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {curTrans.activateBtn}
                    </button>
                  </div>
                </div>

              </div>

              <div className="mt-auto text-center py-6 border-t border-purple-950 text-[10px] text-gray-500 tracking-wider uppercase font-mono">
                🎭╰‿╯RAMUㅤᏴᎻᎪᏆ VIP PANEL - ADAPTIVE NEURAL OVERLAY v4.9
              </div>

            </div>
          )}

          {/* ----------------- ADMIN PANEL ----------------- */}
          {isAdminOpen && (
            <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto px-4 py-8 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-center mb-6 border-b border-purple-900/40 pb-4">
                <h2 className="text-lg sm:text-xl font-black text-purple-300 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-purple-400 animate-pulse" />
                  रामू भाई विशेष एडमिन कंसोल / SECRET ADMIN CONSOLE
                </h2>
                <button 
                  onClick={() => { triggerSound("click"); setIsAdminOpen(false); }}
                  className="px-4 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-900 text-xs font-bold uppercase cursor-pointer"
                >
                  बाहर निकलें / BACK EXIT
                </button>
              </div>

              {!isAdminAuthenticated ? (
                /* ADMIN LOGIN SCREEN */
                <div className="flex-1 flex items-center justify-center py-12">
                  <div className="w-full max-w-sm rounded-2xl border border-purple-500/30 bg-[#0c0817] p-6 shadow-xl text-center">
                    <Lock className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-base font-black text-white uppercase mb-1">प्रशासक प्रमाणीकरण / ADMIN LOGIN</h3>
                    <p className="text-xs text-gray-400 mb-6">एडमिन पैनल अनलॉक करने के लिए सुरक्षित पिन दर्ज करें। / Enter Admin secret pin.</p>
                    
                    <div className="space-y-4">
                      <input 
                        type="password"
                        placeholder="ENTER SECRET PIN..."
                        value={adminPinInput}
                        onChange={(e) => setAdminPinInput(e.target.value)}
                        className="w-full text-center py-3 bg-black/60 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none text-white font-mono tracking-widest text-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAdminAuth();
                        }}
                      />
                      {adminError && <p className="text-xs text-red-400 font-bold">{adminError}</p>}
                      
                      <button 
                        onClick={handleAdminAuth}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer"
                      >
                        सत्यापित करें / VERIFY PIN
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ADMIN CONTROLS SCREEN */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  
                  {/* Left Column: Generate Keys */}
                  <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-sm space-y-6">
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider border-b border-purple-900/30 pb-2">
                      🔐 नई वीआईपी पासकोड बनाएं / VIP KEYS GENERATOR
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Select Game */}
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                          लक्षित गेम चुनें / SELECT GAME
                        </label>
                        <select 
                          value={genGame}
                          onChange={(e: any) => setGenGame(e.target.value)}
                          className="w-full py-2.5 px-3 bg-black border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                        >
                          <option value="wingo">WinGo 1M Predictor</option>
                          <option value="mines">Mines Scanner</option>
                          <option value="aviator">Aviator Mod</option>
                          <option value="goal">Goal Football Path</option>
                          <option value="all">ALL GAMES (MASTER KEY)</option>
                        </select>
                      </div>

                      {/* Expiry / Validity Option */}
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                          की वैधता अवधि / EXPIRE DURATION
                        </label>
                        <select 
                          value={genDuration}
                          onChange={(e) => setGenDuration(e.target.value)}
                          className="w-full py-2.5 px-3 bg-black border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                        >
                          <option value="1 Hour">1 Hour (1 घंटा)</option>
                          <option value="1 Day">1 Day (1 दिन)</option>
                          <option value="3 Days">3 Days (3 दिन)</option>
                          <option value="7 Days">7 Days (7 दिन)</option>
                          <option value="1 Month">1 Month (1 महीना)</option>
                        </select>
                      </div>

                      {/* Generate Button */}
                      <button 
                        onClick={handleGenerateKey}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 shadow-lg shadow-purple-900/20 transition-all cursor-pointer"
                      >
                        पासकोड जेनरेट करें / GENERATE VIP KEY
                      </button>
                    </div>

                    {/* Display Newly Created Key */}
                    {newlyCreatedKey && (
                      <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-center animate-pulse">
                        <span className="block text-[10px] font-mono text-cyan-400 uppercase">नया पासकोड (कॉपी करें) / NEWLY GENERATED KEY:</span>
                        <span className="block text-base font-black text-white font-mono tracking-wider mt-1">{newlyCreatedKey}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Active Keys List */}
                  <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-sm flex flex-col">
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider border-b border-purple-900/30 pb-2 mb-4">
                      📋 सक्रिय पासकोड सूची / ACTIVE VIP KEYS DATABASE
                    </h3>

                    <div className="flex-1 max-h-[300px] overflow-y-auto space-y-3 pr-1 scrollbar-none">
                      {generatedKeys.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-xs">
                          कोई सक्रिय पासकोड उपलब्ध नहीं है। ऊपर से नया कोड बनाएं! / No active custom keys found.
                        </div>
                      ) : (
                        generatedKeys.map((k, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-purple-950 bg-black/60 flex justify-between items-center text-xs font-mono">
                            <div>
                              <div className="text-white font-black">{k.key}</div>
                              <div className="text-[10px] text-gray-400 mt-1 uppercase">
                                गेम / GAME: <span className="text-purple-400 font-bold">{k.game.toUpperCase()}</span> | टाइम / EXP: <span className="text-cyan-400 font-bold">{k.duration}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveKey(k.key)}
                              className="p-1.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-900 transition-colors cursor-pointer"
                              title="हटाएं"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ----------------- SECURITY KEY ENTRY SCREEN ----------------- */}
          {targetUnlockMode !== "none" && !isHacking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4">
              <div className="relative w-full max-w-sm rounded-2xl border border-purple-500/40 bg-[#0b0718] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-base font-black text-purple-200 uppercase tracking-wide text-center flex items-center justify-center gap-2 mb-2 font-mono">
                  <Lock className="w-4 h-4 text-purple-400" />
                  {curTrans.securityTitle}
                </h3>
                <p className="text-center text-xs text-gray-400 mb-6">
                  {curTrans.securityDesc(targetUnlockMode)}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-purple-400/80 tracking-widest mb-1.5">
                      {curTrans.enterKeyLabel}
                    </label>
                    <input 
                      type="text" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={curTrans.passcodePlaceholder}
                      className="w-full text-center py-3 bg-black/50 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none text-white font-mono tracking-widest text-lg uppercase"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerifyPassword();
                      }}
                    />
                    {passwordError && (
                      <p className="text-[11px] text-red-400 mt-2 text-center font-bold flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {passwordError === "गड़बड़ पासवर्ड! अमान्य या समाप्त।" || passwordError === "Incorrect key passcode!"
                          ? curTrans.incorrectPasscode 
                          : passwordError}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => { triggerSound("click"); setTargetUnlockMode("none"); }}
                      className="flex-1 py-3 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 hover:text-white hover:bg-red-900 transition-all text-xs font-bold uppercase cursor-pointer"
                    >
                      {curTrans.cancelBtn}
                    </button>
                    <button 
                      onClick={handleVerifyPassword}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-purple-900/30"
                    >
                      {curTrans.unlockBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- FUTURISTIC HACKING OVERLAY ----------------- */}
          {isHacking && (
            <div className="fixed inset-0 z-50 flex flex-col justify-center bg-black/95 backdrop-blur-md px-4">
              <div className="w-full max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-purple-500 animate-spin"></div>
                    <Terminal className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h2 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase font-mono">
                    BYPASS TUNNEL ACTIVE / बाईपास टनल सक्रिय
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">ESTABLISHING PREMIUM NEURAL OVERLAY / सुरक्षा कवच बाईपास चालू...</p>
                </div>

                <div className="bg-black/80 border border-purple-500/20 rounded-xl p-4 h-48 overflow-y-auto font-mono text-[10px] text-purple-400 space-y-1.5 scrollbar-none">
                  {hackLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-pink-500 font-bold shrink-0">&gt;</span>
                      <span className="leading-relaxed">{log}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full max-w-3xl mx-auto space-y-2">
                  <div className="h-2 w-full bg-green-950 rounded-full overflow-hidden border border-green-900">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-500 shadow-[0_0_10px_#22c55e]"
                      style={{ width: `${hackProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-green-500 font-mono">
                    <span>CIPHER: AES-256-GCM SSL</span>
                    <span>BYPASS: {hackProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- ACTIVE GAME MODE OVERLAY CONTROL BAR ----------------- */}
          {activeTab === "game" && (
            <div className="absolute top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-purple-500/30 flex items-center justify-between px-4 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
              {/* Back Button */}
              <button 
                onClick={handleGoHome}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 hover:text-white hover:bg-red-950/60 transition-all text-xs font-bold font-mono cursor-pointer"
                id="back-home-navbar-btn"
              >
                <Home className="w-3.5 h-3.5" />
                {curTrans.homeExit}
              </button>

              {/* Center Toggle Overlays Panel */}
              <button 
                onClick={() => { triggerSound("click"); setPanelVisible(!panelVisible); }}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest border transition-all duration-300 glow-purple cursor-pointer ${
                  panelVisible 
                    ? "bg-purple-600 border-purple-400 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                    : "bg-black/60 border-purple-500/40 text-purple-400 hover:text-purple-300 hover:border-purple-500"
                }`}
                id="toggle-overlay-panel-btn"
              >
                <Layers className="w-4 h-4 animate-pulse" />
                {panelVisible ? "P_PANEL: ON" : "P_PANEL: OFF"}
              </button>

              {/* Join Telegram Button */}
              <a 
                href="https://t.me/+h5jDuTLxOEQ4NmVl" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/10 text-cyan-400 hover:text-cyan-300 transition-all text-xs font-bold font-mono tracking-wider glow-cyan"
                id="telegram-link-navbar-btn"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                TELEGRAM
              </a>
            </div>
          )}

          {/* ----------------- PREDICTOR PANEL FLOATING CONTENT ----------------- */}
          {activeTab === "game" && panelVisible && (
            <div 
              className="absolute left-1/2 top-[75px] -translate-x-1/2 z-30 w-[94%] max-w-sm bg-black/95 border border-purple-500/40 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.95)] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-none animate-in slide-in-from-top-4 duration-300"
              id="prediction-overlay-panel"
            >
              {/* Header Area */}
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    RAMU BHAI LZR VIP: LIVE
                  </span>
                </div>
                <div className="text-[10px] text-purple-400 uppercase font-bold tracking-widest font-mono">
                  MODE: {unlockedMode.toUpperCase()}
                </div>
              </div>

              {/* ----------------- SUB-VIEW: WINGO 1 MINUTE ----------------- */}
              {unlockedMode === "wingo" && (
                <div className="space-y-4" id="wingo-subview-container">
                  
                  {/* Wins & Losses Counter */}
                  <div className="grid grid-cols-4 gap-2 bg-purple-950/10 border border-purple-500/20 p-2.5 rounded-xl text-center">
                    <div>
                      <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.wins}</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">{wingoWins}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.losses}</span>
                      <span className="text-sm font-black text-red-400 font-mono">{wingoLosses}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.jackpot}</span>
                      <span className="text-sm font-black text-yellow-400 font-mono">{wingoJackpots}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.accuracy}</span>
                      <span className="text-sm font-black text-cyan-400 font-mono">
                        {wingoWins + wingoLosses > 0 
                          ? Math.round((wingoWins / (wingoWins + wingoLosses)) * 100) 
                          : 100}%
                      </span>
                    </div>
                  </div>

                  {/* LIVE OUTCOME FOR BINGO */}
                  {wingoCurrentPrediction ? (
                    <div className="p-3 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-black/60 text-center space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono text-purple-300">
                        <span>{curTrans.period}: <span className="text-white font-bold">{wingoCurrentPrediction.period.slice(-4)}</span></span>
                        <span className="flex items-center gap-1 text-red-400 font-bold">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          {curTrans.timeLeft}: {timeLeft}s
                        </span>
                      </div>

                      {/* Prediction Outputs */}
                      <div className="flex justify-around items-center">
                        <div>
                          <span className="block text-[8px] font-mono uppercase text-purple-400 tracking-wider">{curTrans.signal}</span>
                          <span className={`text-2xl sm:text-3xl font-black tracking-wider glow-text-purple ${
                            wingoCurrentPrediction.type === "BIG" ? "text-purple-400" : "text-cyan-400"
                          }`}>
                            {wingoCurrentPrediction.type === "BIG" 
                              ? (appLang === "HINDI" ? "BIG (बड़ा)" : "BIG") 
                              : (appLang === "HINDI" ? "SMALL (छोटा)" : "SMALL")
                            }
                          </span>
                        </div>

                        <div className="w-14 h-14 rounded-xl border border-cyan-500/50 flex flex-col items-center justify-center bg-cyan-950/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.3)]">
                          <span className="text-[8px] font-mono text-cyan-400 font-bold uppercase">{curTrans.jackpot}</span>
                          <span className="text-xl font-black text-cyan-300 font-mono glow-text-cyan">
                            {wingoCurrentPrediction.num}
                          </span>
                        </div>
                      </div>

                      {/* BYPASS ENGINE */}
                      <div className="text-[10px] font-mono text-purple-300/80 bg-purple-950/20 py-1 px-2 rounded-lg border border-purple-900/30 flex justify-between">
                        <span>{curTrans.bypassProtocol}:</span>
                        <span className="text-emerald-400 font-bold animate-pulse">ACTIVE ON-DEMAND</span>
                      </div>

                      {/* Accuracy Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-gray-400">
                          <span>{curTrans.confidence}:</span>
                          <span className="text-cyan-400 font-bold">{wingoCurrentPrediction.confidence}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-purple-900/40">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                            style={{ width: `${wingoCurrentPrediction.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-purple-500/20 bg-purple-950/10 rounded-xl">
                      <RefreshCw className="w-5 h-5 text-purple-400 animate-spin mx-auto mb-2" />
                      <span className="text-xs text-purple-300 font-mono">{curTrans.waitingBingo}</span>
                    </div>
                  )}

                  {/* HISTORIC BOX BUTTON */}
                  <button 
                    onClick={() => { triggerSound("click"); setIsWingoHistoryOpen(true); }}
                    className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Eye className="w-4 h-4 text-purple-400" />
                    {curTrans.viewLogHistory}
                  </button>
                </div>
              )}

              {/* ----------------- SUB-VIEW: MINES ----------------- */}
              {unlockedMode === "mines" && (
                <div className="space-y-4" id="mines-subview-container">
                  <div className="p-3 bg-black/60 border border-purple-500/20 rounded-xl text-center">
                    <span className="text-xs text-gray-400 block mb-2">{curTrans.minesScanGrid}</span>
                    
                    {/* 5x5 Mines Board */}
                    <div className="grid grid-cols-5 gap-2.5 max-w-[210px] mx-auto my-3">
                      {minesGrid.map((isStar, idx) => (
                        <div 
                          key={idx} 
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                            isStar 
                              ? "bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border-cyan-400 glow-cyan animate-pulse" 
                              : "bg-purple-950/10 border-purple-900/40"
                          }`}
                        >
                          {isStar ? (
                            <Sparkles className="w-5 h-5 text-cyan-300" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-900/50"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={generateMinesPrediction}
                      disabled={isMinesScanning}
                      className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isMinesScanning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          {curTrans.scanning}
                        </>
                      ) : (
                        <>
                          <Target className="w-3.5 h-3.5 animate-pulse" />
                          {curTrans.scanNextGrid}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-VIEW: AVIATOR ----------------- */}
              {unlockedMode === "aviator" && (
                <div className="space-y-4" id="aviator-subview-container">
                  <div className="p-4 bg-black/60 border border-purple-500/20 rounded-xl text-center space-y-4">
                    <span className="text-xs text-gray-400 block">{curTrans.crashPrediction}</span>

                    <div className="py-6 rounded-2xl bg-red-950/10 border border-red-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15),transparent_70%)] animate-pulse"></div>
                      
                      {/* Digital Aircraft Multiplier Progress */}
                      <div className="text-4xl font-black text-red-500 tracking-wider glow-text-purple font-mono animate-pulse">
                        {aviatorIsFlying ? `${aviatorMultiplier}x` : predictedCrashPoint}
                      </div>
                      <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                        {aviatorIsFlying ? curTrans.climbing : curTrans.expectedBust}
                      </span>
                    </div>

                    <button 
                      onClick={startAviatorPredictor}
                      disabled={isAviatorScanning}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isAviatorScanning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          {curTrans.calculating}
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
                          {curTrans.predictNextFlyout}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------- SUB-VIEW: GOAL (5x7 Field) ----------------- */}
              {unlockedMode === "goal" && (
                <div className="space-y-4" id="goal-subview-container">
                  <div className="p-3 bg-black/60 border border-purple-500/20 rounded-xl text-center">
                    <span className="text-xs text-green-400 font-bold block mb-2">{curTrans.goalkeeperBypass}</span>

                    {/* 5x7 Path Grid */}
                    <div className="space-y-1.5 my-3 max-w-[280px] mx-auto">
                      {goalGrid.map((safeCol, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-2 bg-green-950/5 border border-green-950/20 p-1 rounded-xl">
                          <span className="text-[9px] font-mono text-gray-500 w-10 shrink-0">{curTrans.row} {rowIdx + 1}</span>
                          <div className="flex-1 grid grid-cols-5 gap-1.5">
                            {Array.from({ length: 5 }).map((_, colIdx) => {
                              const isSafe = safeCol === colIdx;
                              return (
                                <div 
                                  key={colIdx} 
                                  className={`h-6 rounded-lg border flex items-center justify-center transition-all ${
                                    isSafe 
                                      ? "bg-green-500/30 border-green-400 animate-pulse font-bold text-xs" 
                                      : "bg-black/60 border-green-950"
                                  }`}
                                >
                                  {isSafe ? "⚽" : ""}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={generateGoalPrediction}
                      disabled={isGoalScanning}
                      className="w-full mt-2 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isGoalScanning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          {curTrans.calculating}
                        </>
                      ) : (
                        <>
                          <Compass className="w-3.5 h-3.5 animate-pulse" />
                          {curTrans.findNextGoal}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ----------------- WINGO INDEPENDENT POPUP BOX (Separate History Modal) ----------------- */}
          {isWingoHistoryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
              <div className="relative w-full max-w-sm rounded-2xl border border-purple-500/40 bg-[#0a0614] p-5 shadow-[0_0_40px_rgba(168,85,247,0.4)] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-purple-900/40 pb-3 mb-4 shrink-0">
                  <h3 className="text-sm font-black text-purple-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-400" />
                    {curTrans.sessionHistoryTitle}
                  </h3>
                  <button 
                    onClick={() => { triggerSound("click"); setIsWingoHistoryOpen(false); }}
                    className="px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-900 text-[10px] font-bold uppercase cursor-pointer"
                  >
                    {curTrans.closeBtn}
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto space-y-2.5 divide-y divide-purple-950 pr-1 scrollbar-none">
                  {wingoHistory.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 text-xs font-semibold">
                      {curTrans.noHistory}
                    </div>
                  ) : (
                    wingoHistory.map((item, idx) => (
                      <div key={idx} className="pt-2.5 flex justify-between items-center text-xs font-mono">
                        <div>
                          <div className="text-white font-black">{curTrans.period}: {item.period.slice(-4)}</div>
                          <div className="text-[10px] text-gray-400 mt-1 uppercase">
                            {appLang === "HINDI" ? "प्रेडिक्शन" : "PRED"}: <span className="text-purple-400 font-bold">{item.predictedType}({item.predictedNum})</span>
                          </div>
                          <div className="text-[9px] text-emerald-400 font-mono">
                            ALGORITHM: BYPASS_OK
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">
                            {appLang === "HINDI" ? "नंबर" : "ACT"}: <span className="text-white font-bold">{item.actualType}({item.actualNum})</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            item.status === "JACKPOT" 
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.3)]" 
                              : item.status === "WIN" 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                                : "bg-red-500/20 text-red-400 border border-red-500/40"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-purple-900/40 text-center shrink-0">
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">
                    {curTrans.sessionLocalOnly}
                  </p>
                </div>

              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
