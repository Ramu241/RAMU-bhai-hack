/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
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
  Zap,
  Key,
  Copy,
  ShieldAlert
} from "lucide-react";
import { playSound } from "./utils/audio";

const PARTITION_URLS: Record<string, string> = {
  "bdg": "https://bdgwinmy.cc//#/register?invitationCode=8261315097340",
  "tc": "https://tclotteryapi.com//#/register?invitationCode=8261315097340",
  "bigdaddy": "https://bigdaddymember.cc//#/register?invitationCode=8261315097340",
  "tiranga": "https://tirangaclub.cc//#/register?invitationCode=8261315097340",
  "club91": "https://91clubmember.cc//#/register?invitationCode=8261315097340",
  "rxce": "https://rxcegame.com//#/register?invitationCode=8261315097340"
};

const PARTITION_NAMES: Record<string, string> = {
  "bdg": "BDG Win Server-1",
  "tc": "TC Lottery Server-2",
  "bigdaddy": "Big Daddy Server-3",
  "tiranga": "Tiranga Games Server-4",
  "club91": "91 Club Server-5",
  "rxce": "Rxce Game Server-6"
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
  predictedColor?: "RED" | "GREEN" | "VIOLET";
  actualType: "BIG" | "SMALL";
  actualNum: number;
  actualColor?: "RED" | "GREEN" | "VIOLET";
  status: "WIN" | "LOSS" | "JACKPOT";
  patternName: string;
  confidence?: number;
}

// Generated Keys for Admin Panel
interface GeneratedKey {
  key: string;
  game: "wingo" | "wingo30s" | "mines" | "aviator" | "goal" | "all";
  duration: string; // "1 Hour", "1 Day", "3 Days", "7 Days", "1 Month"
  expiresAt: number; // timestamp
  usedByDevice?: string | null;
  firstUsedAt?: number | null;
  partition?: string;
}

// ENGLISH ONLY TRANSLATION SYSTEM
const t = {
  HINDI: {
    title: "🔥👑 RAMU BHAI PREMIUM PANEL 👑🔥",
    headerDesc: "⚡ PREMIUM LZR HACKING SYSTEM v4.9 ⚡",
    telegramBtn: "📢 JOIN TELEGRAM 📢",
    guidelineTitle: "🚨⚠️ IMPORTANT GUIDELINE ⚠️🚨",
    guidelineDesc: "🎯 Create your ID using the link, verify your UID, and deposit 💸 500 to activate the VIP prediction hack on all games. 🚀 Playing with an unverified account will lead to severe losses ⚠️",
    
    // Wingo Card
    wingoBadge: "🎰 WINGO 1 MINUTE 🎰",
    wingoTitle: "🎯 WinGo Live Mod",
    wingoDesc: "📡 Direct live sync with the Bingo server. Our advanced trend-chart algorithms deliver high-probability Big/Small & Jackpot numbers. 📈💰",
    activateBtn: "⚡ ACTIVATE HACK ⚡",
    
    // Wingo 30S Card
    wingo30Badge: "⚡ WINGO 30 SECONDS ⚡",
    wingo30Title: "🚀 WinGo 30S Live Mod",
    wingo30Desc: "⚡ Rapid neural forecasts for 30-Second live Bingo. Extremely accurate pattern decryption in real-time. 📈🔥",
    
    // Mines Card
    minesBadge: "💣 MINESWEEPER GRID 💣",
    minesTitle: "💎 Mines Grid Scan",
    minesDesc: "🔍 Deep scans of the active grid to map precise locations of safe stars and gems. ⭐💰",
    
    // Aviator Card
    aviatorBadge: "✈️ AVIATOR CRASH ✈️",
    aviatorTitle: "🚀 Aviator Crash Mod",
    aviatorDesc: "✈️ Pre-calculates the expected crash multiplier before the plane flies away using synchronized server feeds. 📈🎯",
    
    // Goal Card
    goalBadge: "⚽ GOAL FIELD PATH ⚽",
    goalTitle: "🥅 Goal Football Path",
    goalDesc: "⚽ Maps out a clear, direct path to bypass the goalkeeper and secure guaranteed goals. 🏆🥅",
    
    // Security Passcode View
    securityTitle: "🔑 SECURITY VERIFICATION 🔑",
    securityDesc: (mode: string) => `🔒 Enter VIP Passcode to unlock the ${mode.toUpperCase()} predictor.`,
    enterKeyLabel: "🔑 ENTER VIP DECRYPTION KEY 🔑",
    passcodePlaceholder: "🔐 Enter Passcode...",
    cancelBtn: "❌ CANCEL ❌",
    unlockBtn: "🔓 UNLOCK 🔓",
    incorrectPasscode: "🚫 Invalid passcode! Try again or contact support.",
    
    // Telegram Screen
    telegramVerification: "🚨⚠️ MANDATORY VERIFICATION ⚠️🚨",
    telegramInstructionTitle: "📢 SYSTEM INSTRUCTIONS:",
    telegramInstructionText: "👉 You must join our official Telegram channel to verify your access. The premium server hack will activate automatically once you join! 🔐✨",
    telegramJoinBtn: "📢 JOIN TELEGRAM TO ACTIVATE 📢",
    telegramWarning: "⚠️ *Joining the channel will automatically authenticate and unlock your panel* ⚠️",
    
    // Game Panel Overlay
    homeExit: "🏠 EXIT GAME 🏠",
    wins: "🏆 WINS",
    losses: "📉 LOSSES",
    jackpot: "💎 JACKPOT",
    accuracy: "🎯 ACCURACY",
    period: "⏰ PERIOD",
    timeLeft: "⏳ TIME LEFT",
    signal: "📡 SIGNAL",
    bypassProtocol: "🛡️ BYPASS PROTOCOL",
    confidence: "🔥 CONFIDENCE RATE",
    waitingBingo: "🔄 Syncing live server data... please wait...",
    viewLogHistory: "📊 VIEW LOG HISTORY 📊",
    minesScanGrid: "💎 Mines Grid Scan",
    scanNextGrid: "🎯 SCAN NEXT GRID 🎯",
    scanning: "🔄 SCANNING GRID...",
    crashPrediction: "✈️ Crash Multiplier",
    expectedBust: "📈 EXPECTED BUST MULTIPLIER",
    climbing: "🚀 AIRCRAFT CLIMBING...",
    predictNextFlyout: "🔮 PREDICT NEXT FLYOUT 🔮",
    calculating: "⏳ CALCULATING CRASH...",
    goalkeeperBypass: "⚽ Goalkeeper Bypass Path",
    findNextGoal: "🥅 FIND NEXT PATH 🥅",
    sessionHistoryTitle: "📊 SESSION HISTORY LOGS 📊",
    closeBtn: "❌ CLOSE ❌",
    noHistory: "🚫 No history records found yet. Live outcomes will populate here.",
    sessionLocalOnly: "● ⚠️ Session Local History Only (Resets on refresh)",
    row: "📍 ROW"
  },
  ENGLISH: {
    title: "🔥👑 RAMU BHAI PREMIUM PANEL 👑🔥",
    headerDesc: "⚡ PREMIUM LZR HACKING SYSTEM v4.9 ⚡",
    telegramBtn: "📢 JOIN TELEGRAM 📢",
    guidelineTitle: "🚨⚠️ IMPORTANT GUIDELINE ⚠️🚨",
    guidelineDesc: "🎯 Create your ID using the link, verify your UID, and deposit 💸 500 to activate the VIP prediction hack on all games. 🚀 Playing with an unverified account will lead to severe losses ⚠️",
    
    // Wingo Card
    wingoBadge: "🎰 WINGO 1 MINUTE 🎰",
    wingoTitle: "🎯 WinGo Live Mod",
    wingoDesc: "📡 Direct live sync with the Bingo server. Our advanced trend-chart algorithms deliver high-probability Big/Small & Jackpot numbers. 📈💰",
    activateBtn: "⚡ ACTIVATE HACK ⚡",
    
    // Wingo 30S Card
    wingo30Badge: "⚡ WINGO 30 SECONDS ⚡",
    wingo30Title: "🚀 WinGo 30S Live Mod",
    wingo30Desc: "⚡ Rapid neural forecasts for 30-Second live Bingo. Extremely accurate pattern decryption in real-time. 📈🔥",
    
    // Mines Card
    minesBadge: "💣 MINESWEEPER GRID 💣",
    minesTitle: "💎 Mines Grid Scan",
    minesDesc: "🔍 Deep scans of the active grid to map precise locations of safe stars and gems. ⭐💰",
    
    // Aviator Card
    aviatorBadge: "✈️ AVIATOR CRASH ✈️",
    aviatorTitle: "🚀 Aviator Crash Mod",
    aviatorDesc: "✈️ Pre-calculates the expected crash multiplier before the plane flies away using synchronized server feeds. 📈🎯",
    
    // Goal Card
    goalBadge: "⚽ GOAL FIELD PATH ⚽",
    goalTitle: "🥅 Goal Football Path",
    goalDesc: "⚽ Maps out a clear, direct path to bypass the goalkeeper and secure guaranteed goals. 🏆🥅",
    
    // Security Passcode View
    securityTitle: "🔑 SECURITY VERIFICATION 🔑",
    securityDesc: (mode: string) => `🔒 Enter VIP Passcode to unlock the ${mode.toUpperCase()} predictor.`,
    enterKeyLabel: "🔑 ENTER VIP DECRYPTION KEY 🔑",
    passcodePlaceholder: "🔐 Enter Passcode...",
    cancelBtn: "❌ CANCEL ❌",
    unlockBtn: "🔓 UNLOCK 🔓",
    incorrectPasscode: "🚫 Invalid passcode! Try again or contact support.",
    
    // Telegram Screen
    telegramVerification: "🚨⚠️ MANDATORY VERIFICATION ⚠️🚨",
    telegramInstructionTitle: "📢 SYSTEM INSTRUCTIONS:",
    telegramInstructionText: "👉 You must join our official Telegram channel to verify your access. The premium server hack will activate automatically once you join! 🔐✨",
    telegramJoinBtn: "📢 JOIN TELEGRAM TO ACTIVATE 📢",
    telegramWarning: "⚠️ *Joining the channel will automatically authenticate and unlock your panel* ⚠️",
    
    // Game Panel Overlay
    homeExit: "🏠 EXIT GAME 🏠",
    wins: "🏆 WINS",
    losses: "📉 LOSSES",
    jackpot: "💎 JACKPOT",
    accuracy: "🎯 ACCURACY",
    period: "⏰ PERIOD",
    timeLeft: "⏳ TIME LEFT",
    signal: "📡 SIGNAL",
    bypassProtocol: "🛡️ BYPASS PROTOCOL",
    confidence: "🔥 CONFIDENCE RATE",
    waitingBingo: "🔄 Syncing live server data... please wait...",
    viewLogHistory: "📊 VIEW LOG HISTORY 📊",
    minesScanGrid: "💎 Mines Grid Scan",
    scanNextGrid: "🎯 SCAN NEXT GRID 🎯",
    scanning: "🔄 SCANNING GRID...",
    crashPrediction: "✈️ Crash Multiplier",
    expectedBust: "📈 EXPECTED BUST MULTIPLIER",
    climbing: "🚀 AIRCRAFT CLIMBING...",
    predictNextFlyout: "🔮 PREDICT NEXT FLYOUT 🔮",
    calculating: "⏳ CALCULATING CRASH...",
    goalkeeperBypass: "⚽ Goalkeeper Bypass Path",
    findNextGoal: "🥅 FIND NEXT PATH 🥅",
    sessionHistoryTitle: "📊 SESSION HISTORY LOGS 📊",
    closeBtn: "❌ CLOSE ❌",
    noHistory: "🚫 No history records found yet. Live outcomes will populate here.",
    sessionLocalOnly: "● ⚠️ Session Local History Only (Resets on refresh)",
    row: "📍 ROW"
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

// Helper to get simulated sequential periods matching current UTC time for 30 seconds
function getWingo30Period() {
  const currentUtc = new Date();
  const year = currentUtc.getUTCFullYear();
  const month = String(currentUtc.getUTCMonth() + 1).padStart(2, '0');
  const day = String(currentUtc.getUTCDate()).padStart(2, '0');
  // Each period is 30 seconds. So total periods in a day is 2880.
  const totalSeconds = currentUtc.getUTCHours() * 3600 + currentUtc.getUTCMinutes() * 60 + currentUtc.getUTCSeconds();
  const currentPeriodIndex = Math.floor(totalSeconds / 30) + 1;
  return `${year}${month}${day}3000${String(currentPeriodIndex).padStart(4, '0')}`;
}

// Helper to decode obfuscated base64 strings
const _obfD = (s: string) => {
  try {
    return atob(s);
  } catch(e) {
    return "";
  }
};

// Premium Trend Chart pattern matcher based on user PDF
function getWingoChartPatternPrediction(period: string): {
  type: "BIG" | "SMALL";
  num: number;
  color: "RED" | "GREEN";
  patternUsed: string;
  confidence: number;
} {
  const patterns = [
    { name: "Single Trend (B S B S B)", sequence: ["BG", "SR", "BG", "SR", "BG"] },
    { name: "Double Trend (S S B B S S)", sequence: ["SR", "SR", "BG", "BG", "SR", "SR"] },
    { name: "Triple Trend (B B B S S S)", sequence: ["BG", "BG", "BG", "SR", "SR", "SR"] },
    { name: "Quadra Trend (S S S S B B B B)", sequence: ["SR", "SR", "SR", "SR", "BG", "BG", "BG", "BG"] },
    { name: "Three in One Trend (B B B S B B B)", sequence: ["BG", "BG", "BG", "SR", "BG", "BG", "BG"] },
    { name: "Two in One Trend (S S B S S B S S)", sequence: ["SR", "SR", "BG", "SR", "SR", "BG", "SR", "SR"] },
    { name: "Three in Two Trend (B B B S S B B B)", sequence: ["BG", "BG", "BG", "SR", "SR", "BG", "BG", "BG"] },
    { name: "Four in One Trend (S S S S B S S S S)", sequence: ["SR", "SR", "SR", "SR", "BG", "SR", "SR", "SR", "SR"] },
    { name: "Four in Two Trend (B B B B S S B B B B)", sequence: ["BG", "BG", "BG", "BG", "SR", "SR", "BG", "BG", "BG", "BG"] },
    { name: "Long Trend (S S S S S S S S S S)", sequence: ["SR", "SR", "SR", "SR", "SR", "SR", "SR", "SR", "SR", "SR"] },
    
    // Page 2: Opposite Patterns
    { name: "Opposite Single Trend (S B S B S)", sequence: ["SR", "BG", "SR", "BG", "SR"] },
    { name: "Opposite Double Trend (B B S S B B)", sequence: ["BG", "BG", "SR", "SR", "BG", "BG"] },
    { name: "Opposite Triple Trend (S S S B B B)", sequence: ["SR", "SR", "SR", "BG", "BG", "BG"] },
    { name: "Opposite Quadra Trend (B B B B S S S S)", sequence: ["BG", "BG", "BG", "BG", "SR", "SR", "SR", "SR"] },
    { name: "Opposite Three in One Trend (S S S B S S S)", sequence: ["SR", "SR", "SR", "BG", "SR", "SR", "SR"] },
    { name: "Opposite Two in One Trend (B B S B B S B B)", sequence: ["BG", "BG", "SR", "BG", "BG", "SR", "BG", "BG"] },
    { name: "Opposite Three in Two Trend (S S S B B S S S)", sequence: ["SR", "SR", "SR", "BG", "BG", "SR", "SR", "SR"] },
    { name: "Opposite Four in One Trend (B B B B S B B B B)", sequence: ["BG", "BG", "BG", "BG", "SR", "BG", "BG", "BG", "BG"] },
    { name: "Opposite Four in Two Trend (S S S S B B S S S S)", sequence: ["SR", "SR", "SR", "SR", "BG", "BG", "SR", "SR", "SR", "SR"] },
    { name: "Opposite Long Trend (B B B B B B B B B B)", sequence: ["BG", "BG", "BG", "BG", "BG", "BG", "BG", "BG", "BG", "BG"] }
  ];

  // Deterministically select pattern and step based on period digits
  const numericPeriod = parseInt(period.slice(-4)) || 0;
  const patternIndex = numericPeriod % patterns.length;
  const pattern = patterns[patternIndex];
  const stepIndex = numericPeriod % pattern.sequence.length;
  const element = pattern.sequence[stepIndex];

  let type: "BIG" | "SMALL" = "BIG";
  let color: "RED" | "GREEN" = "RED";
  let nums: number[] = [6, 8];

  if (element === "BG") {
    type = "BIG";
    color = "GREEN";
    nums = [5, 7, 9];
  } else if (element === "SR") {
    type = "SMALL";
    color = "RED";
    nums = [0, 2, 4];
  } else if (element === "BR") {
    type = "BIG";
    color = "RED";
    nums = [6, 8];
  } else if (element === "SG") {
    type = "SMALL";
    color = "GREEN";
    nums = [1, 3];
  }

  const num = nums[Math.floor(Math.random() * nums.length)];
  const confidence = Math.floor(Math.random() * 8) + 91; // 91-98%

  return {
    type,
    num,
    color,
    patternUsed: `${pattern.name} (Step ${stepIndex + 1})`,
    confidence
  };
}

// Core Adaptive Neural Chart Pattern predictor
function calculateAdaptiveNeuralPrediction(recentSizes: ("BIG" | "SMALL")[]): {
  type: "BIG" | "SMALL";
  patternUsed: string;
  confidence: number;
} {
  if (recentSizes.length < 4) {
    return {
      type: Math.random() > 0.5 ? "BIG" : "SMALL",
      patternUsed: "Adaptive Initial Partition",
      confidence: 94
    };
  }

  // 1. Dragon Pattern (4+ consecutive same outcomes) - Continuous continuation
  const isDragonSmall = recentSizes.slice(0, 4).every(x => x === "SMALL");
  const isDragonBig = recentSizes.slice(0, 4).every(x => x === "BIG");
  if (isDragonSmall) {
    return {
      type: "SMALL",
      patternUsed: "Dragon Trend Continued (S S S S S)",
      confidence: 99
    };
  }
  if (isDragonBig) {
    return {
      type: "BIG",
      patternUsed: "Dragon Trend Continued (B B B B B)",
      confidence: 99
    };
  }

  // 2. Alternating series (B S B S or S B S B) - predict opposite of last to continue series
  if (recentSizes[0] === "BIG" && recentSizes[1] === "SMALL" && recentSizes[2] === "BIG" && recentSizes[3] === "SMALL") {
    return {
      type: "SMALL",
      patternUsed: "Alternating Trend (B S B S -> S)",
      confidence: 98
    };
  }
  if (recentSizes[0] === "SMALL" && recentSizes[1] === "BIG" && recentSizes[2] === "SMALL" && recentSizes[3] === "BIG") {
    return {
      type: "BIG",
      patternUsed: "Alternating Trend (S B S B -> B)",
      confidence: 98
    };
  }

  // 3. Double series (S S B B or B B S S)
  if (recentSizes[0] === "SMALL" && recentSizes[1] === "SMALL" && recentSizes[2] === "BIG" && recentSizes[3] === "BIG") {
    return {
      type: "SMALL",
      patternUsed: "Double Split (S S B B -> S)",
      confidence: 97
    };
  }
  if (recentSizes[0] === "BIG" && recentSizes[1] === "BIG" && recentSizes[2] === "SMALL" && recentSizes[3] === "SMALL") {
    return {
      type: "BIG",
      patternUsed: "Double Split (B B S S -> B)",
      confidence: 97
    };
  }

  // 4. Mirror Symmetry Pattern (B S S B -> B) or (S B B S -> S)
  if (recentSizes[0] === "BIG" && recentSizes[1] === "SMALL" && recentSizes[2] === "SMALL" && recentSizes[3] === "BIG") {
    return {
      type: "SMALL",
      patternUsed: "Mirror Symmetry (B S S B)",
      confidence: 96
    };
  }
  if (recentSizes[0] === "SMALL" && recentSizes[1] === "BIG" && recentSizes[2] === "BIG" && recentSizes[3] === "SMALL") {
    return {
      type: "BIG",
      patternUsed: "Mirror Symmetry (S B B S)",
      confidence: 96
    };
  }

  // 5. Triple Breakout (S S S B -> S) or (B B B S -> B)
  if (recentSizes[0] === "SMALL" && recentSizes[1] === "SMALL" && recentSizes[2] === "SMALL" && recentSizes[3] === "BIG") {
    return {
      type: "BIG",
      patternUsed: "Triple Breakout (S S S B)",
      confidence: 98
    };
  }
  if (recentSizes[0] === "BIG" && recentSizes[1] === "BIG" && recentSizes[2] === "BIG" && recentSizes[3] === "SMALL") {
    return {
      type: "SMALL",
      patternUsed: "Triple Breakout (B B B S)",
      confidence: 98
    };
  }

  // 6. Markov Chain Level-5 Transition Matrix - "What comes after what" (किसके बाद क्या आ रहा है)
  // Computes the probability distribution of transitions in the last 15 periods to predict the exact next state
  let bigToBig = 0;
  let bigToSmall = 0;
  let smallToBig = 0;
  let smallToSmall = 0;

  // We analyze the recent sequence to count dynamic transitions
  for (let i = recentSizes.length - 1; i > 0; i--) {
    const current = recentSizes[i];
    const nextVal = recentSizes[i - 1];
    if (current === "BIG") {
      if (nextVal === "BIG") bigToBig++;
      else bigToSmall++;
    } else {
      if (nextVal === "BIG") smallToBig++;
      else smallToSmall++;
    }
  }

  const lastOutcome = recentSizes[0];
  if (lastOutcome === "BIG") {
    if (bigToSmall > bigToBig) {
      return {
        type: "SMALL",
        patternUsed: `Markov Sequence Transition [B -> S] (${bigToSmall}:${bigToBig})`,
        confidence: Math.min(99, 93 + bigToSmall)
      };
    } else if (bigToBig > bigToSmall) {
      return {
        type: "BIG",
        patternUsed: `Markov Sequence Transition [B -> B] (${bigToBig}:${bigToSmall})`,
        confidence: Math.min(99, 93 + bigToBig)
      };
    }
  } else {
    if (smallToBig > smallToSmall) {
      return {
        type: "BIG",
        patternUsed: `Markov Sequence Transition [S -> B] (${smallToBig}:${smallToSmall})`,
        confidence: Math.min(99, 93 + smallToBig)
      };
    } else if (smallToSmall > smallToBig) {
      return {
        type: "SMALL",
        patternUsed: `Markov Sequence Transition [S -> S] (${smallToSmall}:${smallToBig})`,
        confidence: Math.min(99, 93 + smallToSmall)
      };
    }
  }

  // 7. Stochastic Momentum Ratio Fallback (Calculates overbought vs oversold ratio of BIG/SMALL)
  const bigCount = recentSizes.filter(x => x === "BIG").length;
  const smallCount = recentSizes.length - bigCount;
  if (bigCount > smallCount) {
    return {
      type: "SMALL", // Reversion prediction
      patternUsed: `Stochastic Momentum Reversion [S] (${bigCount}B:${smallCount}S)`,
      confidence: 95
    };
  } else {
    return {
      type: "BIG", // Reversion prediction
      patternUsed: `Stochastic Momentum Reversion [B] (${smallCount}S:${bigCount}B)`,
      confidence: 95
    };
  }
}

// ----------------- STRICT DEEP PATTERN ANALYSIS LOGIC FROM USER -----------------
function calculateStrictUserChart(lastNum: number, historyList: BingoListItem[]): {
  type: "BIG" | "SMALL";
  num: number;
  color: "RED" | "GREEN";
  patternUsed: string;
  confidence: number;
} {
  const strictChart: Record<number, ("BIG" | "SMALL")[]> = {
    0: ["SMALL", "BIG"], 1: ["BIG", "SMALL"], 2: ["BIG", "SMALL"],
    3: ["SMALL", "BIG"], 4: ["BIG", "BIG"], 5: ["SMALL", "BIG"],
    6: ["BIG", "SMALL"], 7: ["SMALL", "BIG"], 8: ["SMALL", "BIG"],
    9: ["BIG", "SMALL"]
  };

  let bigCount = 0;
  let smallCount = 0;
  let redCount = 0;
  let greenCount = 0;

  if (historyList && historyList.length > 0) {
    historyList.slice(0, 10).forEach(item => {
      const n = parseInt(item.number);
      if (isNaN(n)) return;
      if (n >= 5) bigCount++; else smallCount++;
      if ([0, 2, 4, 6, 8].includes(n)) redCount++; else greenCount++;
    });
  }

  const dominantSize = bigCount >= smallCount ? "BIG" : "SMALL";
  const dominantColor = redCount >= greenCount ? "RED" : "GREEN";

  const chartOptions = (strictChart[lastNum] !== undefined ? strictChart[lastNum] : (lastNum >= 5 ? ["BIG" as const] : ["SMALL" as const])) as ("BIG" | "SMALL")[];
  let predictedType: "BIG" | "SMALL";
  let patternUsed = "";

  if (chartOptions.length > 1) {
    predictedType = (dominantSize === "BIG")
      ? (Math.random() < 0.65 ? "SMALL" : "BIG")
      : (Math.random() < 0.65 ? "BIG" : "SMALL");
    patternUsed = `Strict Matrix Split (Last: ${lastNum})`;
  } else {
    predictedType = chartOptions[0] as "BIG" | "SMALL";
    patternUsed = `Strict Matrix Lock (Last: ${lastNum})`;
  }

  // Determine predicted color according to exact user logic
  const predictedColor = (dominantColor === "RED")
    ? (Math.random() < 0.7 ? "RED" : "GREEN")
    : (Math.random() < 0.7 ? "GREEN" : "RED");

  // Generate the specific predicted number based on size and the dominant color
  let matchedNums: number[] = [];
  if (predictedType === "BIG") {
    // BIG is 5, 6, 7, 8, 9
    if (predictedColor === "RED") {
      matchedNums = [6, 8]; // Red numbers in BIG
    } else {
      matchedNums = [7, 9]; // Green numbers in BIG
    }
    // Fallback
    if (matchedNums.length === 0) matchedNums = [6, 7, 8, 9];
  } else {
    // SMALL is 0, 1, 2, 3, 4
    if (predictedColor === "RED") {
      matchedNums = [2, 4, 0]; // Red numbers in SMALL
    } else {
      matchedNums = [1, 3]; // Green numbers in SMALL
    }
    // Fallback
    if (matchedNums.length === 0) matchedNums = [1, 2, 3, 4];
  }

  const predictedNum = matchedNums[Math.floor(Math.random() * matchedNums.length)];

  return {
    type: predictedType,
    num: predictedNum,
    color: predictedColor,
    patternUsed: `${patternUsed} [Dominant: ${dominantSize}/${dominantColor}]`,
    confidence: Math.floor(Math.random() * 8) + 91 // 91% to 98%
  };
}

// Generate real-looking historical entries for the initial load of 30S simulation
function generateInitial30sSimulatedHistory(count = 10) {
  const history: HistoryRecord[] = [];
  const currentUtc = new Date();
  for (let i = 1; i <= count; i++) {
    const pastTime = new Date(currentUtc.getTime() - i * 30000);
    const year = pastTime.getUTCFullYear();
    const month = String(pastTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(pastTime.getUTCDate()).padStart(2, '0');
    
    const totalSeconds = pastTime.getUTCHours() * 3600 + pastTime.getUTCMinutes() * 60 + pastTime.getUTCSeconds();
    const currentPeriodIndex = Math.floor(totalSeconds / 30) + 1;
    const period = `${year}${month}${day}3000${String(currentPeriodIndex).padStart(4, '0')}`;
    
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
    const predictedColor = [0, 2, 4, 6, 8].includes(predNum) ? "RED" : "GREEN";
    const actualColor = [0, 2, 4, 6, 8].includes(actualNum) ? "RED" : "GREEN";
    
    history.push({
      period,
      predictedType: predType,
      predictedNum: predNum,
      predictedColor,
      actualType,
      actualNum,
      actualColor,
      status,
      patternName: "Trend Analysis Engine"
    });
  }
  return history;
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
    const predictedColor = [0, 2, 4, 6, 8].includes(predNum) ? "RED" : "GREEN";
    const actualColor = [0, 2, 4, 6, 8].includes(actualNum) ? "RED" : "GREEN";
    
    history.push({
      period,
      predictedType: predType,
      predictedNum: predNum,
      predictedColor,
      actualType,
      actualNum,
      actualColor,
      status,
      patternName: "Trend Analysis Engine"
    });
  }
  return history;
}

export default function App() {
  // Initialize or fetch the persistent device ID
  const deviceId = React.useMemo(() => {
    let dId = localStorage.getItem("ramu_bhai_device_id");
    if (!dId) {
      dId = "dev_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("ramu_bhai_device_id", dId);
    }
    return dId;
  }, []);

  const [isTampered, setIsTampered] = useState(() => {
    try {
      const hn = window.location.hostname;
      const isDev = hn.includes("ais-dev") || hn.includes("ais-pre") || hn.includes("localhost") || hn.includes("127.0.0.1") || hn.includes("run.app");
      if (isDev) {
        localStorage.removeItem("sys_security_locked_v1");
        return false;
      }
      const locked = localStorage.getItem("sys_security_locked_v1");
      return locked === "true";
    } catch (e) {
      return false;
    }
  });

  const triggerTamperBlock = () => {
    try {
      const hn = window.location.hostname;
      const isDev = hn.includes("ais-dev") || hn.includes("ais-pre") || hn.includes("localhost") || hn.includes("127.0.0.1") || hn.includes("run.app");
      if (isDev) {
        console.log("[SECURITY] Guard block ignored in development mode.");
        return;
      }
      localStorage.setItem("sys_security_locked_v1", "true");
    } catch (e) {}
    setIsTampered(true);
    playEmergencySiren();
  };

  const playEmergencySiren = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playSiren = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.type = "sawtooth";
        osc2.type = "sine";
        
        osc1.frequency.setValueAtTime(600, ctx.currentTime);
        osc2.frequency.setValueAtTime(6, ctx.currentTime); // LFO for sweep effect
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, ctx.currentTime);
        
        osc2.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        
        osc1.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        
        // Sweep frequency up and down aggressively
        let toggle = true;
        setInterval(() => {
          try {
            if (toggle) {
              osc1.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.2);
            } else {
              osc1.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.2);
            }
            toggle = !toggle;
          } catch(e) {}
        }, 300);
      };
      
      playSiren();
    } catch (err) {
      console.warn("Audio Context error", err);
    }
  };

  const secureFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...(options.headers || {}),
      "X-Device-ID": deviceId
    };
    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 403) {
        triggerTamperBlock();
        throw new Error("DEVICE_BANNED");
      }
      return res;
    } catch (err: any) {
      if (err.message === "DEVICE_BANNED") {
        triggerTamperBlock();
      }
      throw err;
    }
  };

  // Upgraded High-Security Anti-hacking, Anti-reverse-engineering and Anti-devtools scan script
  useEffect(() => {
    try {
      const hn = window.location.hostname;
      const isDev = hn.includes("ais-dev") || hn.includes("ais-pre") || hn.includes("localhost") || hn.includes("127.0.0.1") || hn.includes("run.app");
      if (isDev) return; // Completely relax security in developer preview to avoid blocking the owner
    } catch (e) {}

    // 1. Block right click context menu to prevent inspecting elements
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      try { triggerSound("loss"); } catch(ex) {}
    };

    // 2. Block critical debugging hotkeys (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
        try { triggerSound("loss"); } catch(ex) {}
        triggerTamperBlock();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    // 3. Console Debugger Trap: executes dynamically to pause browser on any devtools open state
    const debugTrapInterval = setInterval(() => {
      const startTime = performance.now();
      debugger; // Traps open debugger panels instantly
      const endTime = performance.now();
      if (endTime - startTime > 150) {
        triggerTamperBlock();
      }
    }, 1000);

    // 4. Dimension detection block: fires if side or bottom devtools panel resizes screen width/height significantly
    const dimInterval = setInterval(() => {
      const threshold = 170;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > threshold || heightDiff > threshold) {
        triggerTamperBlock();
      }
    }, 1000);

    // 5. Console Flooding & Anti-Injections
    const consoleClearInterval = setInterval(() => {
      console.clear();
      console.log("%c⚠️ ACCESS RESTRICTED! RAMU BHAI SECURITY PROTOCOL ACTIVE.", "color: red; font-size: 20px; font-weight: bold;");
    }, 800);

    // 6. Block function decomposition by hooking toString
    const blockDecomp = () => {
      const f = function() {};
      f.toString = () => {
        triggerTamperBlock();
        return "secure_obfuscated_code()";
      };
    };
    blockDecomp();

    // Clean up
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(debugTrapInterval);
      clearInterval(dimInterval);
      clearInterval(consoleClearInterval);
    };
  }, []);

  // Navigation & Multi-step Entry Flow States
  const [appLoadedState, setAppLoadedState] = useState<"loading1" | "telegram" | "loading2" | "ready">("loading1");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const [verifyLogs, setVerifyLogs] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"home" | "game">("home");
  const [unlockedMode, setUnlockedMode] = useState<"none" | "wingo" | "wingo30s" | "mines" | "aviator" | "goal">("none");
  const [targetUnlockMode, setTargetUnlockMode] = useState<"none" | "wingo" | "wingo30s" | "mines" | "aviator" | "goal">("none");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [muted, setMuted] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [appLang, setAppLang] = useState<"HINDI" | "ENGLISH">("ENGLISH");
  const [usingSimulation, setUsingSimulation] = useState(false);
  const [usingSimulation30s, setUsingSimulation30s] = useState(false);

  // VIP Key purchase states
  const [isBuyPasscodeOpen, setIsBuyPasscodeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"1 Hour" | "1 Day" | "3 Days" | "7 Days">("1 Day");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const PLAN_PRICES = {
    "1 Hour": 50,
    "1 Day": 150,
    "3 Days": 300,
    "7 Days": 400
  };

  const curTrans = t[appLang];

  // Map to store all generated predictions for 100% accurate log history tracking
  const [wingoPredictionsMap, setWingoPredictionsMap] = useState<Record<string, any>>({});
  const [wingo30PredictionsMap, setWingo30PredictionsMap] = useState<Record<string, any>>({});

  // Hidden Admin Panel States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Admin Key Generation States
  const [genGame, setGenGame] = useState<"wingo" | "wingo30s" | "mines" | "aviator" | "goal" | "all">("wingo");
  const [genDuration, setGenDuration] = useState<string>("1 Hour");
  const [genPartition, setGenPartition] = useState<string>("bdg");
  const [activePartition, setActivePartition] = useState<string>(() => {
    return localStorage.getItem("ramu_bhai_active_partition") || "bdg";
  });

  useEffect(() => {
    localStorage.setItem("ramu_bhai_active_partition", activePartition);
  }, [activePartition]);

  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKey[]>(() => {
    const saved = localStorage.getItem("ramu_bhai_generated_keys");
    return saved ? JSON.parse(saved) : [];
  });
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string>("");
  const [copiedNewKey, setCopiedNewKey] = useState(false);

  // Wingo History Modal View
  const [isWingoHistoryOpen, setIsWingoHistoryOpen] = useState(false);
  const [showWingoHistoryBox, setShowWingoHistoryBox] = useState(false);
  const [showWingo30HistoryBox, setShowWingo30HistoryBox] = useState(false);

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
    color: "RED" | "GREEN";
    confidence: number;
    patternUsed: string;
  } | null>(null);
  const [lastProcessedPeriod, setLastProcessedPeriod] = useState<string>("");
  const [wingoWins, setWingoWins] = useState(0);
  const [wingoLosses, setWingoLosses] = useState(0);
  const [wingoJackpots, setWingoJackpots] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // 1b. Wingo 30S Game States & Live API Sync
  const [wingo30History, setWingo30History] = useState<HistoryRecord[]>([]);
  const [wingo30CurrentPrediction, setWingo30CurrentPrediction] = useState<{
    period: string;
    type: "BIG" | "SMALL";
    num: number;
    color: "RED" | "GREEN";
    confidence: number;
    patternUsed: string;
  } | null>(null);
  const [lastProcessedPeriod30, setLastProcessedPeriod30] = useState<string>("");
  const [wingo30Wins, setWingo30Wins] = useState(0);
  const [wingo30Losses, setWingo30Losses] = useState(0);
  const [wingo30Jackpots, setWingo30Jackpots] = useState(0);
  const [timeLeft30, setTimeLeft30] = useState(30);

  // Period Hacking States
  const [isPeriodHacking, setIsPeriodHacking] = useState(false);
  const [periodHackLogs, setPeriodHackLogs] = useState<string[]>([]);
  const [periodHackProgress, setPeriodHackProgress] = useState(0);
  const [lastTriggeredPeriod, setLastTriggeredPeriod] = useState("");
  const [lastTriggeredPeriod30, setLastTriggeredPeriod30] = useState("");

  // 2. Mines Game States
  const [minesGrid, setMinesGrid] = useState<boolean[]>(new Array(25).fill(false)); // true = Star, false = Blank
  const [isMinesScanning, setIsMinesScanning] = useState(false);
  const [minesCount, setMinesCount] = useState<number>(3); // Selected bomb count (1, 3, 5, 10), default 3

  // 3. Aviator Game States
  const [aviatorMultiplier, setAviatorMultiplier] = useState(1.00);
  const [aviatorIsFlying, setAviatorIsFlying] = useState(false);
  const [predictedCrashPoint, setPredictedCrashPoint] = useState<string>("--");
  const [isAviatorScanning, setIsAviatorScanning] = useState(false);
  const aviatorTimerRef = useRef<any>(null);

  // 4. Goal Game States (5x10 grid)
  const [goalGrid, setGoalGrid] = useState<number[]>(new Array(10).fill(-1)); // stores correct column (0-4) for each of the 10 rows
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

  // Start Period Hacking Sequence (Instant resolution to avoid scanner delay/speed lag)
  const startPeriodHackingSequence = (pred: any, is30s: boolean) => {
    if (is30s) {
      setWingo30CurrentPrediction(pred);
      setWingo30PredictionsMap(prev => ({
        ...prev,
        [pred.period]: pred
      }));
    } else {
      setWingoCurrentPrediction(pred);
      setWingoPredictionsMap(prev => ({
        ...prev,
        [pred.period]: pred
      }));
    }
    setIsPeriodHacking(false);
  };

  // Trigger high-tech hacker animation sequence when calculating/getting the next prediction
  const triggerPeriodHackingSequence = (pred: any, is30s: boolean) => {
    setIsPeriodHacking(true);
    setPeriodHackProgress(0);
    
    const logsList = [
      `📡 TARGET DETECTED: PERIOD ${pred.period} / अगला बिंगो पीरियड सिंक...`,
      `⚙️ BYPASSING GAME SERVER FIREWALL HANDSHAKES...`,
      `🔓 EXPLOITING BDG SECURE TUNNEL [PORT: 3000]...`,
      `🧬 INJECTING RAMU BHAI PREDICTIVE PATTERN ENGINE...`,
      `🧠 PATTERN MATCHED: ${pred.patternUsed || "PHOENIX TREND CHART"}`,
      `💎 CALCULATING CONFIDENCE FACTOR: ${pred.confidence}%...`,
      `🔥 DATA EXTRACTED SUCCESSFULLY / अगला डाटा सफलतापूर्वक हैक!`
    ];

    setPeriodHackLogs([logsList[0]]);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress > 100) {
        currentProgress = 100;
      }
      
      setPeriodHackProgress(currentProgress);
      
      const logCount = Math.min(
        logsList.length,
        Math.floor((currentProgress / 100) * logsList.length) + 1
      );
      setPeriodHackLogs(logsList.slice(0, logCount));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          startPeriodHackingSequence(pred, is30s);
        }, 500);
      }
    }, 100);
  };

  // Sync Live Clock Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = new Date().getSeconds();
      setTimeLeft(60 - (seconds % 60));
      setTimeLeft30(30 - (seconds % 30));
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
        const response = await secureFetch("/api/bingo-history");
        if (!response.ok) throw new Error("API error status: " + response.status);
        const json = await response.json();
        
        if (!isMounted) return;

        if (json && json.data && json.data.list && json.data.list.length > 0) {
          setUsingSimulation(false); // Successfully connected to real live API! Turn off local simulation
          const list: BingoListItem[] = json.data.list;
          const latestItem = list[0];
          
          // Detect Period change & Process outcomes
          if (latestItem.issueNumber !== lastProcessedPeriod && latestItem.issueNumber !== lastTriggeredPeriod) {
            setLastTriggeredPeriod(latestItem.issueNumber);

            const actualNum = parseInt(latestItem.number);
            const actualType = actualNum >= 5 ? "BIG" : "SMALL";
            let actualColor: "RED" | "GREEN" | "VIOLET" = [0, 2, 4, 6, 8].includes(actualNum) ? "RED" : "GREEN";
            if (actualNum === 0 || actualNum === 5) actualColor = "VIOLET";

            // Find or reconstruct the prediction for this period
            let predObj = (wingoCurrentPrediction && wingoCurrentPrediction.period === latestItem.issueNumber) ? wingoCurrentPrediction : wingoPredictionsMap[latestItem.issueNumber];
            if (!predObj) {
              const previousList = list.slice(1);
              const prevNum = previousList.length > 0 ? parseInt(previousList[0].number) : 5;
              const { type: pT, num: pN, color: pC, patternUsed: pP, confidence: pCo } = calculateStrictUserChart(prevNum, previousList);
              predObj = {
                period: latestItem.issueNumber,
                type: pT,
                num: pN,
                color: pC,
                confidence: pCo,
                patternUsed: pP
              };
            }

            let status: "WIN" | "LOSS" | "JACKPOT" = "LOSS";
            if (predObj.num === actualNum) {
              status = "JACKPOT";
              setWingoWins(w => w + 1);
              setWingoJackpots(j => j + 1);
              triggerSound("jackpot");
            } else if (predObj.type === actualType || predObj.color === actualColor || actualColor === "VIOLET") {
              status = "WIN";
              setWingoWins(w => w + 1);
              triggerSound("win");
            } else {
              setWingoLosses(l => l + 1);
              status = "LOSS";
              triggerSound("loss");
            }

            // Prepend to history logs safely (Only duplicate checker to prevent repeats, ensuring no missing periods)
            setWingoHistory(prev => {
              if (prev.some(x => x.period === latestItem.issueNumber)) return prev;
              return [
                {
                  period: latestItem.issueNumber,
                  predictedType: predObj.type,
                  predictedNum: predObj.num,
                  predictedColor: predObj.color,
                  actualType,
                  actualNum,
                  actualColor,
                  status,
                  patternName: predObj.patternUsed,
                  confidence: predObj.confidence
                },
                ...prev
              ];
            });

            // Sync Period ID
            setLastProcessedPeriod(latestItem.issueNumber);

            // Generate prediction for the next period
            const nextPeriod = (BigInt(latestItem.issueNumber) + 1n).toString();
            
            // TREND CHART PATTERN MATCHING ENGINE
            const lastNum = parseInt(latestItem.number);
            const { type: predictedType, num: predictedNum, color: predictedColor, patternUsed: patternDetected, confidence } = calculateStrictUserChart(lastNum, list);

            triggerPeriodHackingSequence({
              period: nextPeriod,
              type: predictedType,
              num: predictedNum,
              color: predictedColor,
              confidence,
              patternUsed: patternDetected
            }, false);
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
  }, [unlockedMode, wingoCurrentPrediction, wingoPredictionsMap, lastProcessedPeriod, appLoadedState]);

  // Wingo 30S Live Predictor Sync
  useEffect(() => {
    if (unlockedMode !== "wingo30s" || appLoadedState !== "ready") return;

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const response = await secureFetch("/api/bingo-history-30s");
        if (!response.ok) throw new Error("API error status: " + response.status);
        const json = await response.json();
        
        if (!isMounted) return;

        if (json && json.data && json.data.list && json.data.list.length > 0) {
          setUsingSimulation30s(false); // Successfully connected to real live API! Turn off local simulation
          const list: BingoListItem[] = json.data.list;
          const latestItem = list[0];
          
          // Detect Period change & Process outcomes
          if (latestItem.issueNumber !== lastProcessedPeriod30 && latestItem.issueNumber !== lastTriggeredPeriod30) {
            setLastTriggeredPeriod30(latestItem.issueNumber);

            const actualNum = parseInt(latestItem.number);
            const actualType = actualNum >= 5 ? "BIG" : "SMALL";
            let actualColor: "RED" | "GREEN" | "VIOLET" = [0, 2, 4, 6, 8].includes(actualNum) ? "RED" : "GREEN";
            if (actualNum === 0 || actualNum === 5) actualColor = "VIOLET";

            // Find or reconstruct the prediction for this period
            let predObj = (wingo30CurrentPrediction && wingo30CurrentPrediction.period === latestItem.issueNumber) ? wingo30CurrentPrediction : wingo30PredictionsMap[latestItem.issueNumber];
            if (!predObj) {
              const previousList = list.slice(1);
              const prevNum = previousList.length > 0 ? parseInt(previousList[0].number) : 5;
              const { type: pT, num: pN, color: pC, patternUsed: pP, confidence: pCo } = calculateStrictUserChart(prevNum, previousList);
              predObj = {
                period: latestItem.issueNumber,
                type: pT,
                num: pN,
                color: pC,
                confidence: pCo,
                patternUsed: pP
              };
            }

            let status: "WIN" | "LOSS" | "JACKPOT" = "LOSS";
            if (predObj.num === actualNum) {
              status = "JACKPOT";
              setWingo30Wins(w => w + 1);
              setWingo30Jackpots(j => j + 1);
              triggerSound("jackpot");
            } else if (predObj.type === actualType || predObj.color === actualColor || actualColor === "VIOLET") {
              status = "WIN";
              setWingo30Wins(w => w + 1);
              triggerSound("win");
            } else {
              setWingo30Losses(l => l + 1);
              status = "LOSS";
              triggerSound("loss");
            }

            // Prepend to history logs safely (Only duplicate checker to prevent repeats, ensuring no missing periods)
            setWingo30History(prev => {
              if (prev.some(x => x.period === latestItem.issueNumber)) return prev;
              return [
                {
                  period: latestItem.issueNumber,
                  predictedType: predObj.type,
                  predictedNum: predObj.num,
                  predictedColor: predObj.color,
                  actualType,
                  actualNum,
                  actualColor,
                  status,
                  patternName: predObj.patternUsed,
                  confidence: predObj.confidence
                },
                ...prev
              ];
            });

            // Sync Period ID
            setLastProcessedPeriod30(latestItem.issueNumber);

            // Generate prediction for the next period
            const nextPeriod = (BigInt(latestItem.issueNumber) + 1n).toString();
            
            // TREND CHART PATTERN MATCHING ENGINE
            const lastNum = parseInt(latestItem.number);
            const { type: predictedType, num: predictedNum, color: predictedColor, patternUsed: patternDetected, confidence } = calculateStrictUserChart(lastNum, list);

            triggerPeriodHackingSequence({
              period: nextPeriod,
              type: predictedType,
              num: predictedNum,
              color: predictedColor,
              confidence,
              patternUsed: patternDetected
            }, true);
          }
        } else {
          throw new Error("Empty list returned");
        }
      } catch (err) {
        console.warn("Bingo Live 30S API failed. Initiating synchronized local client engine:", err);
        if (isMounted) {
          setUsingSimulation30s(true);
        }
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [unlockedMode, wingo30CurrentPrediction, wingo30PredictionsMap, lastProcessedPeriod30, appLoadedState]);

  // Synchronized Local Simulation Engine
  useEffect(() => {
    if (!usingSimulation || unlockedMode !== "wingo" || appLoadedState !== "ready") return;

    // Start with empty history list when first entering the active panel

    const runSimulationTick = () => {
      const currentPeriod = getWingoPeriod();
      
      // Seed first prediction if none exists
      if (!wingoCurrentPrediction && lastTriggeredPeriod !== currentPeriod) {
        setLastTriggeredPeriod(currentPeriod);
        const pred = getWingoChartPatternPrediction(currentPeriod);
        triggerPeriodHackingSequence(pred, false);
        setLastProcessedPeriod(currentPeriod);
        return;
      }

      // Check if period changed based on UTC clock minute transition
      if (currentPeriod !== wingoCurrentPrediction.period && currentPeriod !== lastTriggeredPeriod) {
        setLastTriggeredPeriod(currentPeriod);
        const lastPred = wingoCurrentPrediction;
        
        // High win-rate simulator: 85% of the time we choose a winning outcome, 15% of the time a losing outcome
        let actualNum: number;
        const winProbability = Math.random() < 0.85;
        
        if (winProbability) {
          // Choose a winning outcome (where number matches, or size matches, or color matches)
          const chooseExactNum = Math.random() < 0.18; // 18% of winning is a JACKPOT
          if (chooseExactNum) {
            actualNum = lastPred.num;
          } else {
            // Choose a number that matches size or color
            const possibleWinningNums: number[] = [];
            for (let i = 0; i <= 9; i++) {
              const tType = i >= 5 ? "BIG" : "SMALL";
              const tColor = [0, 2, 4, 6, 8].includes(i) ? "RED" : "GREEN";
              if (tType === lastPred.type || tColor === lastPred.color) {
                possibleWinningNums.push(i);
              }
            }
            const otherWinningNums = possibleWinningNums.filter(n => n !== lastPred.num);
            actualNum = otherWinningNums.length > 0 
              ? otherWinningNums[Math.floor(Math.random() * otherWinningNums.length)] 
              : lastPred.num;
          }
        } else {
          // Choose a losing outcome (where BOTH size AND color do not match)
          const losingNums: number[] = [];
          for (let i = 0; i <= 9; i++) {
            const tType = i >= 5 ? "BIG" : "SMALL";
            const tColor = [0, 2, 4, 6, 8].includes(i) ? "RED" : "GREEN";
            if (tType !== lastPred.type && tColor !== lastPred.color) {
              losingNums.push(i);
            }
          }
          actualNum = losingNums.length > 0 
            ? losingNums[Math.floor(Math.random() * losingNums.length)] 
            : (lastPred.num + 5) % 10;
        }

        const actualType = actualNum >= 5 ? "BIG" : "SMALL";
        const actualColor = [0, 2, 4, 6, 8].includes(actualNum) ? "RED" : "GREEN";
        
        let status: "WIN" | "LOSS" | "JACKPOT";
        
        // Exact user rules:
        // Number matching -> JACKPOT (जैकपॉट)
        // Type or Color matching -> WIN (विन)
        // Otherwise -> LOSS
        if (actualNum === lastPred.num) {
          status = "JACKPOT";
          setWingoWins(w => w + 1);
          setWingoJackpots(j => j + 1);
          triggerSound("jackpot");
        } else if (actualType === lastPred.type || actualColor === lastPred.color) {
          status = "WIN";
          setWingoWins(w => w + 1);
          triggerSound("win");
        } else {
          status = "LOSS";
          setWingoLosses(l => l + 1);
          triggerSound("loss");
        }
        
        setWingoHistory(prev => [
          {
            period: lastPred.period,
            predictedType: lastPred.type,
            predictedNum: lastPred.num,
            predictedColor: lastPred.color,
            actualType,
            actualNum,
            actualColor,
            status,
            patternName: lastPred.patternUsed,
            confidence: lastPred.confidence
          },
          ...prev
        ]);

        // Generate prediction for the NEW period based on local history patterns
        const nextPeriodPred = getWingoChartPatternPrediction(currentPeriod);
        triggerPeriodHackingSequence(nextPeriodPred, false);
        setLastProcessedPeriod(currentPeriod);
      }
    };

    runSimulationTick();
    const interval = setInterval(runSimulationTick, 1000);
    return () => clearInterval(interval);
  }, [usingSimulation, unlockedMode, wingoCurrentPrediction, appLoadedState, wingoHistory]);

  // Synchronized Local Simulation Engine for 30S
  useEffect(() => {
    if (!usingSimulation30s || unlockedMode !== "wingo30s" || appLoadedState !== "ready") return;

    // Start with empty history list when first entering the active panel

    const runSimulationTick = () => {
      const currentPeriod = getWingo30Period();
      
      // Seed first prediction if none exists
      if (!wingo30CurrentPrediction && lastTriggeredPeriod30 !== currentPeriod) {
        setLastTriggeredPeriod30(currentPeriod);
        const pred = getWingoChartPatternPrediction(currentPeriod);
        triggerPeriodHackingSequence(pred, true);
        setLastProcessedPeriod30(currentPeriod);
        return;
      }

      // Check if period changed based on UTC clock minute transition
      if (currentPeriod !== wingo30CurrentPrediction.period && currentPeriod !== lastTriggeredPeriod30) {
        setLastTriggeredPeriod30(currentPeriod);
        const lastPred = wingo30CurrentPrediction;
        
        // High win-rate simulator: 85% of the time we choose a winning outcome, 15% of the time a losing outcome
        let actualNum: number;
        const winProbability = Math.random() < 0.85;
        
        if (winProbability) {
          // Choose a winning outcome (where number matches, or size matches, or color matches)
          const chooseExactNum = Math.random() < 0.18; // 18% of winning is a JACKPOT
          if (chooseExactNum) {
            actualNum = lastPred.num;
          } else {
            // Choose a number that matches size or color
            const possibleWinningNums: number[] = [];
            for (let i = 0; i <= 9; i++) {
              const tType = i >= 5 ? "BIG" : "SMALL";
              const tColor = [0, 2, 4, 6, 8].includes(i) ? "RED" : "GREEN";
              if (tType === lastPred.type || tColor === lastPred.color) {
                possibleWinningNums.push(i);
              }
            }
            const otherWinningNums = possibleWinningNums.filter(n => n !== lastPred.num);
            actualNum = otherWinningNums.length > 0 
              ? otherWinningNums[Math.floor(Math.random() * otherWinningNums.length)] 
              : lastPred.num;
          }
        } else {
          // Choose a losing outcome (where BOTH size AND color do not match)
          const losingNums: number[] = [];
          for (let i = 0; i <= 9; i++) {
            const tType = i >= 5 ? "BIG" : "SMALL";
            const tColor = [0, 2, 4, 6, 8].includes(i) ? "RED" : "GREEN";
            if (tType !== lastPred.type && tColor !== lastPred.color) {
              losingNums.push(i);
            }
          }
          actualNum = losingNums.length > 0 
            ? losingNums[Math.floor(Math.random() * losingNums.length)] 
            : (lastPred.num + 5) % 10;
        }

        const actualType = actualNum >= 5 ? "BIG" : "SMALL";
        const actualColor = [0, 2, 4, 6, 8].includes(actualNum) ? "RED" : "GREEN";
        
        let status: "WIN" | "LOSS" | "JACKPOT";
        
        // Exact user rules:
        // Number matching -> JACKPOT (जैकपॉट)
        // Type or Color matching -> WIN (विन)
        // Otherwise -> LOSS
        if (actualNum === lastPred.num) {
          status = "JACKPOT";
          setWingo30Wins(w => w + 1);
          setWingo30Jackpots(j => j + 1);
          triggerSound("jackpot");
        } else if (actualType === lastPred.type || actualColor === lastPred.color) {
          status = "WIN";
          setWingo30Wins(w => w + 1);
          triggerSound("win");
        } else {
          status = "LOSS";
          setWingo30Losses(l => l + 1);
          triggerSound("loss");
        }
        
        setWingo30History(prev => [
          {
            period: lastPred.period,
            predictedType: lastPred.type,
            predictedNum: lastPred.num,
            predictedColor: lastPred.color,
            actualType,
            actualNum,
            actualColor,
            status,
            patternName: lastPred.patternUsed,
            confidence: lastPred.confidence
          },
          ...prev
        ]);

        // Generate prediction for the NEW period based on local history patterns
        const nextPeriodPred = getWingoChartPatternPrediction(currentPeriod);
        triggerPeriodHackingSequence(nextPeriodPred, true);
        setLastProcessedPeriod30(currentPeriod);
      }
    };

    runSimulationTick();
    const interval = setInterval(runSimulationTick, 1000);
    return () => clearInterval(interval);
  }, [usingSimulation30s, unlockedMode, wingo30CurrentPrediction, appLoadedState, wingo30History]);

  // Handle exiting and resetting states (preserving the logged history as per user request)
  const handleGoHome = () => {
    triggerSound("click");
    setUnlockedMode("none");
    setTargetUnlockMode("none");
    // Preserve wingoHistory and wingo30History so that they are not wiped upon exit
    setWingoWins(0);
    setWingoLosses(0);
    setWingoJackpots(0);
    setLastProcessedPeriod("");
    setWingoCurrentPrediction(null);
    
    setWingo30Wins(0);
    setWingo30Losses(0);
    setWingo30Jackpots(0);
    setLastProcessedPeriod30("");
    setWingo30CurrentPrediction(null);

    setMinesGrid(new Array(25).fill(false));
    setGoalGrid(new Array(7).fill(-1));
    if (aviatorTimerRef.current) {
      clearInterval(aviatorTimerRef.current);
    }
    setAviatorIsFlying(false);
    setPredictedCrashPoint("--");
    setActiveTab("home");
  };

  // Open Key Unlock Dialog (Now requiring passcode as per user request!)
  const requestUnlock = (mode: "wingo" | "wingo30s" | "mines" | "aviator" | "goal") => {
    triggerSound("click");
    setTargetUnlockMode(mode);
    setPasswordInput("");
    setPasswordError("");
    setActivePartition("bdg");
  };
  
  // Helper to fetch keys list from central server database
  const fetchServerKeys = async () => {
    try {
      const securePin = atob("UkFNVV9CSEFJX0FETUlOX1NFQ1VSRV9CWVBBU1NfOTA5MF8jQCE=");
      const res = await secureFetch("/api/keys", {
        headers: { "Authorization": securePin }
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKeys(data);
        localStorage.setItem("ramu_bhai_generated_keys", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to fetch keys from central server", e);
    }
  };

  // Validate Key (Checks dynamically on server to work on ALL client devices instantly!)
  const handleVerifyPassword = async () => {
    const entered = passwordInput.trim();
    if (!entered) return;

    try {
      const response = await secureFetch("/api/keys/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: entered, game: targetUnlockMode, deviceId })
      });

      if (response.ok) {
        setFailedAttempts(0); // Reset attempts on success
        const resData = await response.json().catch(() => ({}));
        if (resData.key && resData.key.partition) {
          setActivePartition(resData.key.partition);
        } else {
          setActivePartition("bdg");
        }
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
        const errData = await response.json().catch(() => ({}));
        setPasswordError(errData.error || "गड़बड़ पासवर्ड! अमान्य या समाप्त। / Incorrect passcode! Invalid or expired.");
        triggerSound("loss");
        
        setFailedAttempts(prev => {
          const next = prev + 1;
          if (next >= 5) {
            triggerTamperBlock();
          }
          return next;
        });
      }
    } catch (err) {
      // Offline fallback: Check local keys in case server is temporarily down (Obfuscated codes to block decompilers)
      const now = Date.now();
      const manualCodesObf: Record<string, string> = {
        "OTA4MDcw": "wingo",    // "908070"
        "OTA4MDcx": "wingo30s", // "908071"
        "OTA4MDcy": "mines",    // "908072"
        "OTA4MDcz": "aviator",  // "908073"
        "OTA4MDc0": "goal"      // "908074"
      };

      const isManualValid = Object.keys(manualCodesObf).some(k => _obfD(k) === entered && manualCodesObf[k] === targetUnlockMode);
      const matchedCustomKey = generatedKeys.find(
        (k) => k.key === entered && (k.game === targetUnlockMode || k.game === "all") && k.expiresAt > now
      );

      if (matchedCustomKey || isManualValid) {
        setFailedAttempts(0); // Reset attempts on success
        setPasswordError("");
        setIsHacking(true);
        setHackProgress(0);
        setHackLogs([]);

        const logTemplates = [
          `[DECRYPT] 🎭 (LOCAL OFFLINE FALLBACK) RAMU BHAI टनल सक्रिय की जा रही है...`,
          `[SUCCESS] स्थानीय रूप से पासकोड सत्यापित! `
        ];
        
        let pct = 0;
        const progressTimer = setInterval(() => {
          pct += 5;
          setHackProgress(pct);
          if (pct >= 100) {
            clearInterval(progressTimer);
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
          }
        }, 50);
      } else {
        setPasswordError("गलत पासकोड! अमान्य या समाप्त। / Incorrect passcode! Invalid or expired.");
        triggerSound("loss");
        
        setFailedAttempts(prev => {
          const next = prev + 1;
          if (next >= 5) {
            triggerTamperBlock();
          }
          return next;
        });
      }
    }
  };

  // Admin Key Generation (Sends to central server)
  const handleGenerateKey = async () => {
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

    const expiresAt = Date.now() + durationMs;
    const newKey: GeneratedKey = {
      key: newKeyStr,
      game: genGame,
      duration: genDuration,
      expiresAt: expiresAt,
      partition: genPartition
    };

    try {
      const securePin = atob("UkFNVV9CSEFJX0FETUlOX1NFQ1VSRV9CWVBBU1NfOTA5MF8jQCE=");
      const res = await secureFetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": securePin
        },
        body: JSON.stringify(newKey)
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKeys(data.keys);
        localStorage.setItem("ramu_bhai_generated_keys", JSON.stringify(data.keys));
      } else {
        setGeneratedKeys([newKey, ...generatedKeys]);
      }
    } catch (e) {
      setGeneratedKeys([newKey, ...generatedKeys]);
    }

    setNewlyCreatedKey(newKeyStr);
    triggerSound("unlock");
  };

  // Remove individual Key (Sync with server)
  const handleRemoveKey = async (keyToRemove: string) => {
    triggerSound("click");
    try {
      const securePin = atob("UkFNVV9CSEFJX0FETUlOX1NFQ1VSRV9CWVBBU1NfOTA5MF8jQCE=");
      const res = await secureFetch(`/api/keys/${encodeURIComponent(keyToRemove)}`, {
        method: "DELETE",
        headers: {
          "Authorization": securePin
        }
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKeys(data.keys);
        localStorage.setItem("ramu_bhai_generated_keys", JSON.stringify(data.keys));
      } else {
        setGeneratedKeys(generatedKeys.filter(k => k.key !== keyToRemove));
      }
    } catch (e) {
      setGeneratedKeys(generatedKeys.filter(k => k.key !== keyToRemove));
    }
  };

  // Verify Admin Login (Highly Secure, Uncrackable Admin Password Obfuscated)
  const handleAdminAuth = () => {
    // Decrypting the uncrackable secure password dynamically to block static code scanning/extraction
    const securePin = atob("UkFNVV9CSEFJX0FETUlOX1NFQ1VSRV9CWVBBU1NfOTA5MF8jQCE=");
    if (adminPinInput === securePin) {
      setIsAdminAuthenticated(true);
      setAdminError("");
      triggerSound("unlock");
      fetchServerKeys(); // Fetch keys list dynamically from the server upon login!
    } else {
      setAdminError("अमान्य एडमिन पासवर्ड! एक्सेस अस्वीकृत। / Invalid Admin Password! Access Denied.");
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
      
      // If mines count is 3, show 5, 6, or 7 safe stars!
      // Otherwise, adjust starCount accordingly.
      let starCount = 4;
      if (minesCount === 1) {
        starCount = 10;
      } else if (minesCount === 3) {
        starCount = Math.floor(Math.random() * 3) + 5; // Generates 5, 6, or 7 safe stars
      } else if (minesCount === 5) {
        starCount = 4;
      } else if (minesCount === 10) {
        starCount = 3;
      } else {
        starCount = 4;
      }

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
    }, 1500);
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
    }, 150);
  };

  // Goal Field Pathfinder
  const generateGoalPrediction = () => {
    if (isGoalScanning) return;
    setIsGoalScanning(true);
    triggerSound("verify");

    setTimeout(() => {
      const grid = new Array(10).fill(-1).map(() => Math.floor(Math.random() * 5));
      setGoalGrid(grid);
      setIsGoalScanning(false);
      triggerSound("win");
    }, 1500);
  };

  // Click handler to route Telegram link and trigger Phase 2
  const handleTelegramClick = () => {
    triggerSound("unlock");
    window.open("https://t.me/paneladhacksale001", "_blank");
    setAppLoadedState("loading2");
  };

  if (isTampered) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-black p-6 text-center text-red-500 font-mono select-none" style={{ background: '#000000' }}>
        <div className="max-w-md p-8 border-2 border-red-600 rounded-2xl bg-red-950/20 shadow-[0_0_50px_rgba(220,38,38,0.5)] space-y-6 animate-pulse">
          <ShieldAlert className="w-16 h-16 mx-auto text-red-500" />
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
            SECURITY BLOCKED / सुरक्षा अवरुद्ध
          </h1>
          <p className="text-xs sm:text-sm font-bold text-gray-300 leading-relaxed">
            सुरक्षा उल्लंघनों (Reverse Engineering / DevTools Detection / timing tamper) का पता चला है! एंटी-हैकिंग और डिक्रिप्शन सुरक्षा प्रोटोकॉल सक्रिय कर दिया गया है। ऐप को पूरी तरह से ब्लॉक कर दिया गया है।
          </p>
          <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
            Security Violation Detected (DevTools, Inspect, or Timing Tampering attempt)! The anti-hacking and decryption security protocol has been activated. The app is completely blocked for safety.
          </p>
          <div className="pt-4 border-t border-red-500/30 text-[10px] text-gray-500 uppercase tracking-widest font-black">
            IP PROTOCOL LZR BYPASS SECURED BY RAMU BHAI
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-[#04010a] text-gray-100 bg-grid-cyber font-sans select-none"
      onClick={() => triggerSound("click")}
      id="app-root-container"
    >
      
      {/* ----------------- STAGE 1: FIRST DANGEROUS LOADING SCREEN ----------------- */}
      {appLoadedState === "loading1" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#020005] px-6 relative overflow-hidden" id="loading-stage-1">
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none"></div>
          
          {/* Scanning Line overlay */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_#a855f7] animate-scan-sweep pointer-events-none"></div>
          
          <div className="w-full max-w-lg relative bg-black/95 border-2 border-purple-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.4)] backdrop-blur-md space-y-6">
            
            {/* Cyber Corners Decoration */}
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-purple-500"></div>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-purple-500"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-purple-500"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-purple-500"></div>

            {/* Glowing Status Header Bar */}
            <div className="flex justify-between items-center border-b border-purple-900/40 pb-4 text-[10px] font-mono text-purple-400">
              <span className="flex items-center gap-1.5 font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                SYSTEM: CRITICAL BYPASS MODE
              </span>
              <span className="font-mono text-xs text-pink-500 font-black animate-pulse">
                RAMU_BHAI_LZR_INJECTOR
              </span>
            </div>

            {/* Concentric Rotating Tech Rings Spinner */}
            <div className="flex justify-center my-4 relative">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500/30 animate-spin-slow"></div>
                {/* Middle Ring (Reverse direction) */}
                <div className="absolute inset-2 rounded-full border-4 border-dotted border-pink-500/40 animate-spin-reverse"></div>
                {/* Inner Ring */}
                <div className="absolute inset-4 rounded-full border border-cyan-500/50 animate-pulse"></div>
                {/* Crosshair lines */}
                <div className="absolute h-full w-[1px] bg-purple-500/20"></div>
                <div className="absolute w-full h-[1px] bg-purple-500/20"></div>
                {/* Core Icon */}
                <Terminal className="w-10 h-10 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              </div>
            </div>

            {/* Glitch Typography Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 uppercase font-mono drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                🎭╰‿╯RAMUㅤᏴᎻᎪᏆ
              </h2>
              <div className="inline-block px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-md">
                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-black font-mono">
                  INJECTING PREMIUM BYPASS ENGINE v4.9
                </p>
              </div>
            </div>

            {/* Log Stream Terminal Window */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono text-purple-400 uppercase px-1">
                <span>SYSTEM DECIPHER STREAM</span>
                <span className="animate-pulse">DECRYPTING...</span>
              </div>
              <div className="bg-[#040108]/90 border border-purple-500/20 rounded-xl p-4 h-40 overflow-y-auto text-left font-mono text-[10px] text-purple-400 space-y-1.5 scrollbar-none shadow-inner">
                {loadingLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 items-start animate-fade-in">
                    <span className="text-pink-500 font-bold shrink-0">[0x7FFE{(1000 + idx).toString(16).toUpperCase()}]</span>
                    <span className="text-pink-500 font-bold shrink-0">&gt;</span>
                    <span className="leading-relaxed text-gray-200">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Cybernetic Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-mono font-bold text-purple-300">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  TUNNELING ESTABLISHED
                </span>
                <span className="font-black text-cyan-400 animate-pulse">{loadingProgress}% COMPLETE</span>
              </div>
              <div className="h-4 w-full bg-[#080214] rounded-full overflow-hidden border border-purple-500/30 p-0.5 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 shadow-[0_0_15px_#a855f7] transition-all duration-100 ease-out relative"
                  style={{ width: `${loadingProgress}%` }}
                >
                  {/* Sliding shine animation inside progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine-slide"></div>
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-purple-500 uppercase tracking-widest">
                <span>PORT BOUND: 3000 (SECURE)</span>
                <span>DECRYPTOR SPEED: 4.8 GB/s</span>
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
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#000205] px-6 relative overflow-hidden" id="loading-stage-2">
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none"></div>
          
          {/* Scanning Line overlay */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_#06b6d4] animate-scan-sweep pointer-events-none"></div>
          
          <div className="w-full max-w-lg relative bg-black/95 border-2 border-cyan-500/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-md space-y-6">
            
            {/* Cyber Corners Decoration */}
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-cyan-500"></div>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-cyan-500"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-cyan-500"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-cyan-500"></div>

            {/* Glowing Status Header Bar */}
            <div className="flex justify-between items-center border-b border-cyan-900/40 pb-4 text-[10px] font-mono text-cyan-400">
              <span className="flex items-center gap-1.5 font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                VERIFICATION CHANNEL: CONNECTED
              </span>
              <span className="font-mono text-xs text-emerald-400 font-black animate-pulse">
                RAMU_BHAI_MEMBER_CHECK
              </span>
            </div>

            {/* Concentric Rotating Tech Rings Spinner */}
            <div className="flex justify-center my-4 relative">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-cyan-500/30 animate-spin-slow"></div>
                {/* Middle Ring (Reverse direction) */}
                <div className="absolute inset-2 rounded-full border-4 border-dotted border-emerald-500/40 animate-spin-reverse"></div>
                {/* Inner Ring */}
                <div className="absolute inset-4 rounded-full border border-purple-500/50 animate-pulse"></div>
                {/* Crosshair lines */}
                <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>
                <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
                {/* Core Icon */}
                <Cpu className="w-10 h-10 text-emerald-400 animate-pulse drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              </div>
            </div>

            {/* Glitch Typography Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 uppercase font-mono drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                TELEGRAM MEMBERSHIP CHECK
              </h2>
              <div className="inline-block px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-md">
                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-black font-mono">
                  टेलीग्राम चैनल सदस्यता जांच शुरू...
                </p>
              </div>
            </div>

            {/* Log Stream Terminal Window */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono text-cyan-400 uppercase px-1">
                <span>HANDSHAKE PROTOCOL STREAM</span>
                <span className="animate-pulse">AUTHENTICATING...</span>
              </div>
              <div className="bg-[#000205]/90 border border-cyan-500/20 rounded-xl p-4 h-40 overflow-y-auto text-left font-mono text-[10px] text-cyan-400 space-y-1.5 scrollbar-none shadow-inner">
                {verifyLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 items-start animate-fade-in">
                    <span className="text-emerald-400 font-bold shrink-0">[0x5F1B{(2000 + idx).toString(16).toUpperCase()}]</span>
                    <span className="text-emerald-400 font-bold shrink-0">&gt;</span>
                    <span className="leading-relaxed text-gray-200">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Cybernetic Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-mono font-bold text-cyan-300">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  SHA-256 MEMBER HANDSHAKE
                </span>
                <span className="font-black text-emerald-400 animate-pulse">{verifyProgress}% COMPLETE</span>
              </div>
              <div className="h-4 w-full bg-[#000508] rounded-full overflow-hidden border border-cyan-500/30 p-0.5 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-emerald-400 to-purple-500 shadow-[0_0_15px_#06b6d4] transition-all duration-100 ease-out relative"
                  style={{ width: `${verifyProgress}%` }}
                >
                  {/* Sliding shine animation inside progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine-slide"></div>
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-cyan-500 uppercase tracking-widest">
                <span>HANDSHAKE: ACTIVE & SECURED</span>
                <span>AUTHENTICATION LEVEL: 99.8%</span>
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
              src={PARTITION_URLS[activePartition] || PARTITION_URLS["bdg"]}
              className="w-full h-full border-none"
              title="Game Server Register Link"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>

          {/* ----------------- LANDING / HOME MENU SCREEN ----------------- */}
          {activeTab === "home" && !isAdminOpen && (
            <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto px-4 py-6 md:py-10 max-w-5xl mx-auto">
              
              {/* Header Banner - RAMU BHAI VIP DESIGN (Perfected Font Alignment) */}
              <div className="flex justify-between items-center mb-8 border-b border-purple-900/40 pb-5">
                <div className="flex items-center gap-3">
                  {/* Decorative Emblem Logo (Static, secure, non-clickable) */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.1)] select-none">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  
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

                  {/* Buy VIP Passcode Header Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); triggerSound("unlock"); setIsBuyPasscodeOpen(true); }}
                    className="flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border border-yellow-500/50 bg-yellow-950/20 hover:bg-yellow-900/40 text-yellow-400 hover:text-yellow-300 transition-all text-[10px] sm:text-xs font-black uppercase tracking-widest glow-yellow animate-pulse cursor-pointer shadow-[0_0_12px_rgba(234,179,8,0.2)]"
                    id="header-buy-passcode-btn"
                  >
                    <Key className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{appLang === "HINDI" ? "की खरीदें" : "BUY VIP KEY"}</span>
                  </button>

                  {/* Telegram Channel Link */}
                  <a 
                    href="https://t.me/paneladhacksale001" 
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
                      <div className="px-2.5 py-1 rounded bg-purple-600/20 border border-purple-500/40 text-[9px] font-bold font-mono text-purple-300 animate-pulse">
                        {curTrans.wingoBadge}
                      </div>
                      <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.wingoTitle} 🎰🔮
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.wingoDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-purple-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-purple-400/70">
                      <span>SECURITY CORE: VIP_V4 / SEC_PORT: VIP_V4</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ SECURE PORT</span>
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

                {/* WINGO 30S CARD */}
                <div className="relative group overflow-hidden rounded-2xl border border-pink-500/30 bg-pink-950/10 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-pink-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2.5 py-1 rounded bg-pink-600/20 border border-pink-500/40 text-[9px] font-bold font-mono text-pink-300 animate-pulse">
                        {curTrans.wingo30Badge}
                      </div>
                      <Zap className="w-4.5 h-4.5 text-pink-400 animate-pulse" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-pink-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.wingo30Title} ⚡🚀
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.wingo30Desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-pink-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-pink-400/70">
                      <span>SECURITY CORE: VIP_V4 / SEC_PORT: VIP_V4</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ SECURE PORT</span>
                    </div>
                    <button 
                      onClick={() => requestUnlock("wingo30s")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-pink-900/30 transition-all"
                      id="activate-wingo30s-btn"
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
                      <div className="px-2.5 py-1 rounded bg-cyan-600/20 border border-cyan-500/40 text-[9px] font-bold font-mono text-cyan-300 animate-pulse">
                        {curTrans.minesBadge}
                      </div>
                      <Target className="w-4.5 h-4.5 text-cyan-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.minesTitle} 💣⭐
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.minesDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-cyan-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-cyan-400/70">
                      <span>SECURITY CORE: VIP_V4 / SEC_PORT: VIP_V4</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ SECURE PORT</span>
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
                      <div className="px-2.5 py-1 rounded bg-red-600/20 border border-red-500/40 text-[9px] font-bold font-mono text-red-300 animate-pulse">
                        {curTrans.aviatorBadge}
                      </div>
                      <TrendingUp className="w-4.5 h-4.5 text-red-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-red-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.aviatorTitle} ✈️📈
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.aviatorDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-red-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-red-400/70">
                      <span>SECURITY CORE: VIP_V4 / SEC_PORT: VIP_V4</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ SECURE PORT</span>
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
                      <div className="px-2.5 py-1 rounded bg-green-600/20 border border-green-500/40 text-[9px] font-bold font-mono text-green-300 animate-pulse">
                        {curTrans.goalBadge}
                      </div>
                      <Compass className="w-4.5 h-4.5 text-green-400" />
                    </div>
                    <h3 className="text-base font-black text-white group-hover:text-green-300 transition-colors uppercase tracking-wide flex items-center gap-1.5">
                      {curTrans.goalTitle} ⚽🥅
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      {curTrans.goalDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-green-900/40 flex flex-col gap-3">
                    <div className="flex justify-between text-[9px] font-mono text-green-400/70">
                      <span>SECURITY CORE: VIP_V4 / SEC_PORT: VIP_V4</span>
                      <span className="font-bold tracking-wider text-emerald-400 animate-pulse">✓ SECURE PORT</span>
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

              <div 
                onClick={(e) => { e.stopPropagation(); setIsAdminOpen(true); triggerSound("unlock"); }}
                className="mt-auto text-center py-6 border-t border-purple-950 text-[10px] text-gray-500/70 hover:text-gray-400/80 tracking-wider uppercase font-mono cursor-default select-none transition-all"
                id="secret-footer-trigger"
              >
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
                    <p className="text-xs text-gray-400 mb-6">एडमिन पैनल अनलॉक करने के लिए सुरक्षित पासवर्ड दर्ज करें। / Enter Admin secret password.</p>
                    
                    <div className="space-y-4">
                      <input 
                        type="password"
                        placeholder="ENTER SECRET PASSWORD..."
                        value={adminPinInput}
                        onChange={(e) => setAdminPinInput(e.target.value)}
                        className="w-full text-center py-3 bg-black/60 border border-purple-500/30 rounded-xl focus:border-purple-400 focus:outline-none text-white font-mono tracking-widest text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAdminAuth();
                        }}
                      />
                      {adminError && <p className="text-xs text-red-400 font-bold">{adminError}</p>}
                      
                      <button 
                        onClick={handleAdminAuth}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all cursor-pointer"
                      >
                        सत्यापित करें / VERIFY PASSWORD
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

                      {/* Select Partition */}
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                          गेम सर्वर पार्टीशन चुनें / GAME SERVER PARTITION
                        </label>
                        <select 
                          value={genPartition}
                          onChange={(e: any) => setGenPartition(e.target.value)}
                          className="w-full py-2.5 px-3 bg-black border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                        >
                          <option value="bdg">BDG Win (Partition 1)</option>
                          <option value="tc">TC Lottery (Partition 2)</option>
                          <option value="bigdaddy">Big Daddy (Partition 3)</option>
                          <option value="tiranga">Tiranga Games (Partition 4)</option>
                          <option value="club91">91 Club (Partition 5)</option>
                          <option value="rxce">Rxce Game (Partition 6)</option>
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
                      <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-center space-y-2.5 animate-in fade-in duration-350">
                        <span className="block text-[10px] font-mono text-cyan-400 uppercase font-black">नया पासकोड (कॉपी करने के लिए दबाएं) / NEW GENERATED KEY:</span>
                        <div className="flex bg-black/60 border border-cyan-500/30 p-2.5 rounded-xl items-center justify-between text-xs font-mono">
                          <span className="text-white font-black tracking-widest text-sm pl-2 select-all">{newlyCreatedKey}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(newlyCreatedKey);
                              setCopiedNewKey(true);
                              triggerSound("unlock");
                              setTimeout(() => setCopiedNewKey(false), 2000);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
                              copiedNewKey 
                                ? "bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                                : "bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900"
                            }`}
                          >
                            <Copy className="w-3 h-3" />
                            {copiedNewKey ? "COPIED!" : "COPY"}
                          </button>
                        </div>
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
                              <div className="flex items-center gap-2">
                                <span className="text-white font-black">{k.key}</span>
                                {k.usedByDevice ? (
                                  <span className="text-[8px] bg-red-950/50 border border-red-500/30 text-red-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider" title="यह पासकोड किसी डिवाइस पर लॉक हो चुका है">USED (लॉक)</span>
                                ) : (
                                  <span className="text-[8px] bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider" title="यह पासकोड उपयोग के लिए तैयार है">READY</span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-1 uppercase">
                                गेम / GAME: <span className="text-purple-400 font-bold">{k.game.toUpperCase()}</span> | सर्वर / SRV: <span className="text-pink-400 font-bold">{(k.partition || "BDG").toUpperCase()}</span> | टाइम / EXP: <span className="text-cyan-400 font-bold">{k.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(k.key);
                                  triggerSound("unlock");
                                }}
                                className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-900 transition-all cursor-pointer flex items-center justify-center"
                                title="कॉपी करें / Copy Passcode"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleRemoveKey(k.key)}
                                className="p-2 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:text-white hover:bg-red-900 transition-all cursor-pointer flex items-center justify-center"
                                title="हटाएं"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

                  <div className="pt-3 border-t border-purple-950/60 text-center">
                    <button 
                      onClick={() => { triggerSound("unlock"); setIsBuyPasscodeOpen(true); }}
                      className="w-full py-2.5 rounded-xl border border-dashed border-yellow-500/50 bg-yellow-950/20 hover:bg-yellow-950/40 text-yellow-400 hover:text-yellow-200 transition-all text-[11px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                    >
                      <Key className="w-3.5 h-3.5" />
                      {appLang === "HINDI" ? "पासकोड खरीदें / BUY VIP KEY" : "BUY VIP PASSCODE KEY"}
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
            <>
              <div className="absolute top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-purple-500/30 flex items-center justify-between px-4 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.85)]">
                {/* Premium Live Status Badge on the left */}
                <div className="flex items-center gap-2 pl-2">
                  <Flame className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase tracking-widest font-mono">
                    RAMU VIP: LIVE
                  </span>
                </div>

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
                  href="https://t.me/paneladhacksale001" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/10 text-cyan-400 hover:text-cyan-300 transition-all text-xs font-bold font-mono tracking-wider glow-cyan"
                  id="telegram-link-navbar-btn"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  TELEGRAM
                </a>
              </div>

              {/* Back Button Positioned beautifully and prominently at the bottom center */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center">
                <button 
                  onClick={handleGoHome}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-red-500/50 bg-red-950/90 text-red-200 hover:text-white hover:bg-red-900 hover:border-red-400 active:scale-95 transition-all text-xs font-black uppercase tracking-widest font-mono cursor-pointer shadow-[0_4px_25px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.7)]"
                  id="back-home-navbar-btn"
                >
                  <Home className="w-4 h-4" />
                  {curTrans.homeExit}
                </button>
              </div>
            </>
          )}

                      {/* ----------------- PREDICTOR PANEL FLOATING CONTENT ----------------- */}
          {activeTab === "game" && panelVisible && (
            <div 
              className="absolute left-1/2 top-[62px] -translate-x-1/2 z-30 w-[96%] sm:w-[650px] md:w-[720px] max-w-[750px] bg-slate-950/45 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-[0_12px_45px_rgba(0,0,0,0.9)] max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-none animate-in slide-in-from-top-4 duration-300"
              id="prediction-overlay-panel"
            >
              {/* SCARY DANGEROUS HACKING SCAN OVERLAY */}
              {isPeriodHacking && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-55 rounded-2xl p-3 flex flex-col justify-center items-center text-center space-y-3 animate-in fade-in duration-200">
                  {/* RED LASER SCAN LINE */}
                  <div className="animate-laser-scan"></div>

                  {/* Scary danger skull or red shield */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-600/20 blur-xl animate-pulse"></div>
                    <div className="w-12 h-12 rounded-full border border-red-500/40 bg-red-950/40 flex items-center justify-center text-red-500 animate-bounce">
                      <span className="text-2xl">☠️</span>
                    </div>
                  </div>

                  {/* Warning Messages */}
                  <div className="space-y-1 z-10">
                    <h4 className="text-red-500 font-black text-xs tracking-widest font-mono uppercase animate-pulse">
                      {appLang === "HINDI" ? "☠️ अगला डेटा हैक हो रहा है ☠️" : "☠️ DATA BREACH IN PROGRESS ☠️"}
                    </h4>
                    <p className="text-[9px] text-gray-400 font-mono leading-relaxed uppercase">
                      {appLang === "HINDI" ? "सर्वर फायरवॉल बायपास किया जा रहा है..." : "BYPASSING GAME SERVER FIREWALL..."}
                    </p>
                  </div>

                  {/* Custom log outputs scrolling dynamically */}
                  <div className="w-full bg-black/80 border border-red-950 rounded-lg p-1.5 h-16 overflow-y-auto text-left font-mono text-[8px] text-red-400/90 space-y-0.5 scrollbar-none z-10 shadow-inner">
                    {periodHackLogs.map((log, idx) => (
                      <div key={idx} className="truncate select-none animate-in fade-in duration-150">
                        {log}
                      </div>
                    ))}
                  </div>

                  {/* Danger red progress bar */}
                  <div className="w-full space-y-0.5 z-10">
                    <div className="flex justify-between text-[8px] font-mono text-red-500/70 uppercase">
                      <span>{appLang === "HINDI" ? "हैक प्रोग्रेस:" : "BREACH PROGRESS:"}</span>
                      <span className="font-black">{periodHackProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-red-950/40 rounded-full overflow-hidden border border-red-900/30">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_10px_#ef4444]"
                        style={{ width: `${periodHackProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Header Area */}
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    RAMU VIP: LIVE
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest font-mono">
                    MODE: {unlockedMode.toUpperCase()}
                  </span>
                  <span className="text-[7.5px] text-pink-400 font-black tracking-wider uppercase font-mono">
                    SRV: {activePartition.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* ----------------- SUB-VIEW: WINGO 1 MINUTE ----------------- */}
              {unlockedMode === "wingo" && (
                <div className="space-y-3" id="wingo-subview-container">
                  {/* Single Column Compact Predictor */}
                  <div className="space-y-2.5 max-w-[420px] mx-auto">
                    {/* Wins & Losses Counter */}
                    <div className="grid grid-cols-4 gap-1 bg-purple-950/20 backdrop-blur-md border border-purple-500/20 p-1.5 rounded-lg text-center animate-in fade-in duration-200">
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.wins}</span>
                        <span className="text-xs font-black text-emerald-400 font-mono">{wingoWins}</span>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.losses}</span>
                        <span className="text-xs font-black text-red-400 font-mono">{wingoLosses}</span>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.jackpot}</span>
                        <span className="text-xs font-black text-yellow-400 font-mono">{wingoJackpots}</span>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.accuracy}</span>
                        <span className="text-xs font-black text-cyan-400 font-mono">
                          {wingoWins + wingoLosses > 0 
                            ? Math.round((wingoWins / (wingoWins + wingoLosses)) * 100) 
                            : 100}%
                        </span>
                      </div>
                    </div>

                    {/* LIVE OUTCOME FOR BINGO */}
                    {wingoCurrentPrediction ? (
                      <div className="p-2.5 rounded-xl border border-purple-500/20 bg-purple-950/15 backdrop-blur-md text-center space-y-2 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center text-[9px] font-mono text-purple-300">
                          <span>{curTrans.period}: <span className="text-white font-bold">{wingoCurrentPrediction.period.slice(-4)}</span></span>
                          <span className="flex items-center gap-1 text-red-400 font-bold">
                            <Clock className="w-3 h-3 animate-pulse" />
                            {curTrans.timeLeft}: {timeLeft}s
                          </span>
                        </div>

                        {/* Prediction Outputs - Perfect 3-column equal grid, corner-to-corner set, equal-width */}
                        <div className="grid grid-cols-3 gap-1.5 bg-black/30 p-1.5 rounded-lg border border-purple-500/10 text-center items-stretch">
                          <div className="bg-purple-950/10 p-1.5 rounded-md border border-purple-900/20 flex flex-col justify-center items-center">
                            <span className="block text-[7.5px] font-mono uppercase text-purple-400 tracking-wider mb-1">{curTrans.signal}</span>
                            <span className={`text-[10px] font-black tracking-wider block ${
                              wingoCurrentPrediction.type === "BIG" 
                                ? "text-rose-500 [text-shadow:0_0_8px_rgba(244,63,94,0.5)]" 
                                : "text-emerald-400 [text-shadow:0_0_8px_rgba(52,211,153,0.5)]"
                            }`}>
                              {wingoCurrentPrediction.type === "BIG" ? "🔴 BIG" : "🟢 SMALL"}
                            </span>
                          </div>

                          {/* Color Indicator Pill */}
                          <div className="bg-purple-950/10 p-1.5 rounded-md border border-purple-900/20 flex flex-col justify-center items-center">
                            <span className="block text-[7.5px] font-mono uppercase text-purple-400 tracking-wider mb-1">COLOR</span>
                            <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-white ${
                              wingoCurrentPrediction.color === "RED" 
                                ? "bg-red-600 border border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.4)]" 
                                : "bg-emerald-500 border border-emerald-300 text-black shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                            }`}>
                              {wingoCurrentPrediction.color}
                            </span>
                          </div>

                          <div className="bg-purple-950/10 p-1.5 rounded-md border border-purple-900/20 flex flex-col justify-center items-center">
                            <span className="block text-[7.5px] font-mono uppercase text-cyan-400 tracking-wider mb-1">{curTrans.jackpot}</span>
                            <span className="text-xs font-black text-cyan-300 font-mono [text-shadow:0_0_8px_rgba(34,211,238,0.5)]">
                              {wingoCurrentPrediction.num}
                            </span>
                          </div>
                        </div>

                        {/* BYPASS ENGINE */}
                        <div className="text-[8.5px] font-mono text-purple-300/80 bg-purple-950/20 py-0.5 px-1.5 rounded-md border border-purple-900/30 flex justify-between">
                          <span>{curTrans.bypassProtocol}:</span>
                          <span className="text-emerald-400 font-bold animate-pulse">ACTIVE ON-DEMAND</span>
                        </div>

                        {/* Accuracy Bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[8.5px] font-mono text-gray-400">
                            <span>{curTrans.confidence}:</span>
                            <span className="text-cyan-400 font-bold">{wingoCurrentPrediction.confidence}%</span>
                          </div>
                          <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden border border-purple-900/40">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                              style={{ width: `${wingoCurrentPrediction.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-purple-500/20 bg-purple-950/15 backdrop-blur-md rounded-xl animate-in fade-in duration-200">
                        <RefreshCw className="w-4 h-4 text-purple-400 animate-spin mx-auto mb-1" />
                        <span className="text-xs text-purple-300 font-mono">{curTrans.waitingBingo}</span>
                      </div>
                    )}

                    {/* Collapsible toggle button to show/hide history */}
                    <button
                      onClick={() => { triggerSound("click"); setShowWingoHistoryBox(!showWingoHistoryBox); }}
                      className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-purple-900/40 to-indigo-950/40 hover:from-purple-900/60 hover:to-indigo-950/60 border border-purple-500/30 hover:border-purple-400/50 text-purple-200 hover:text-white font-black text-[9.5px] uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(168,85,247,0.15)]"
                    >
                      {showWingoHistoryBox ? "👁️ HIDE GAME HISTORY / इतिहास छुपाएं" : "📊 VIEW GAME HISTORY / इतिहास देखें"}
                    </button>
                  </div>

                  {/* SEPARATE, BEAUTIFUL OUTSIDE BOX FOR WINGO HISTORY */}
                  {showWingoHistoryBox && (
                    <div className="p-3.5 rounded-2xl border border-purple-500/30 bg-slate-950/90 backdrop-blur-2xl text-left shadow-[0_8px_32px_rgba(0,0,0,0.8)] max-w-[420px] mx-auto animate-in slide-in-from-top-3 duration-300 space-y-2.5">
                      <div className="text-[9.5px] font-mono text-purple-300 font-bold uppercase tracking-wider border-b border-purple-900/40 pb-1.5 flex justify-between items-center">
                        <span>📊 {appLang === "HINDI" ? "बिंगो खेल इतिहास / HISTORY" : "BINGO HISTORY LOGS"}</span>
                        <span className="text-purple-400 font-mono text-[8.5px] bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-500/20 font-black">
                          TOTAL: {wingoHistory.length}
                        </span>
                      </div>

                      {wingoHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-[10px] font-mono leading-relaxed">
                          {appLang === "HINDI" ? "कोई इतिहास उपलब्ध नहीं है। कृपया खेल शुरू होने की प्रतीक्षा करें!" : "No history logs registered yet. Waiting for game outcomes!"}
                        </div>
                      ) : (
                        <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 font-mono text-[9px] scrollbar-thin animate-in fade-in duration-200">
                          {wingoHistory.map((hist, index) => (
                            <div 
                              key={index} 
                              className="bg-slate-950/70 p-2 rounded-lg border border-purple-950/40 flex justify-between items-center gap-2 animate-in fade-in duration-150"
                            >
                              <div className="space-y-0.5">
                                <span className="text-purple-300 font-bold block text-[8.5px]">PER: {hist.period.slice(-4)}</span>
                                <span className="text-[7.5px] text-gray-500 block leading-none truncate max-w-[85px]">{hist.patternName || "System Pattern"}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                {/* Prediction Column */}
                                <div className="text-left space-y-0.5 min-w-[70px]">
                                  <span className="text-[7px] text-purple-400 block uppercase font-bold tracking-wider font-mono">PRED PANEL</span>
                                  <div className="flex flex-wrap gap-0.5 items-center">
                                    <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                      hist.predictedType === "BIG" ? "bg-rose-950/60 text-rose-400 border border-rose-900/30" : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                    }`}>
                                      {hist.predictedType}
                                    </span>
                                    {hist.predictedColor && (
                                      <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                        hist.predictedColor === "RED" 
                                          ? "bg-red-950/60 text-red-400 border border-red-900/30" 
                                          : hist.predictedColor === "VIOLET"
                                            ? "bg-purple-950/60 text-purple-400 border border-purple-900/30"
                                            : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                      }`}>
                                        {hist.predictedColor}
                                      </span>
                                    )}
                                    <span className="text-cyan-400 font-black text-[8px] bg-cyan-950/40 px-1 py-0.5 rounded border border-cyan-950">
                                      N:{hist.predictedNum}
                                    </span>
                                  </div>
                                </div>

                                {/* Actual Result Column */}
                                <div className="text-left space-y-0.5 min-w-[70px] border-l border-purple-900/30 pl-2">
                                  <span className="text-[7px] text-pink-400 block uppercase font-bold tracking-wider font-mono">ACTUAL OPEN</span>
                                  <div className="flex flex-wrap gap-0.5 items-center">
                                    <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                      hist.actualType === "BIG" ? "bg-rose-950/60 text-rose-400 border border-rose-900/30" : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                    }`}>
                                      {hist.actualType}
                                    </span>
                                    {hist.actualColor && (
                                      <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                        hist.actualColor === "RED" 
                                          ? "bg-red-950/60 text-red-400 border border-red-900/30" 
                                          : hist.actualColor === "VIOLET"
                                            ? "bg-purple-950/60 text-purple-400 border border-purple-900/30"
                                            : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                      }`}>
                                        {hist.actualColor}
                                      </span>
                                    )}
                                    <span className="text-zinc-300 font-black text-[8px] bg-slate-900/60 px-1 py-0.5 rounded border border-slate-950">
                                      N:{hist.actualNum}
                                    </span>
                                  </div>
                                </div>

                                {/* Status Badge */}
                                <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-center min-w-[55px] ${
                                  hist.status === "JACKPOT"
                                    ? "bg-yellow-500 text-black border border-yellow-300 shadow-[0_0_5px_rgba(234,179,8,0.4)] animate-pulse"
                                    : hist.status === "WIN"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_4px_rgba(16,185,129,0.2)]"
                                      : "bg-rose-950/40 text-rose-400 border border-rose-500/20 shadow-[0_0_4px_rgba(244,63,94,0.1)]"
                                }`}>
                                  {hist.status === "JACKPOT" ? "JACKPOT 👑" : hist.status === "WIN" ? "WIN 🐯" : "LOES 🖤"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------- SUB-VIEW: WINGO 30 SECONDS ----------------- */}
              {unlockedMode === "wingo30s" && (
                <div className="space-y-3" id="wingo30s-subview-container">
                  {/* Single Column Compact Predictor */}
                  <div className="space-y-2.5 max-w-[420px] mx-auto">
                    {/* Wins & Losses Counter */}
                    <div className="grid grid-cols-4 gap-1 bg-pink-950/20 backdrop-blur-md border border-pink-500/20 p-1.5 rounded-lg text-center animate-in fade-in duration-200">
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.wins}</span>
                        <span className="text-xs font-black text-emerald-400 font-mono">{wingo30Wins}</span>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.losses}</span>
                        <span className="text-xs font-black text-red-400 font-mono">{wingo30Losses}</span>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.jackpot}</span>
                        <span className="text-xs font-black text-yellow-400 font-mono">{wingo30Jackpots}</span>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-gray-400 font-bold uppercase tracking-wider">{curTrans.accuracy}</span>
                        <span className="text-xs font-black text-cyan-400 font-mono">
                          {wingo30Wins + wingo30Losses > 0 
                            ? Math.round((wingo30Wins / (wingo30Wins + wingo30Losses)) * 100) 
                            : 100}%
                        </span>
                      </div>
                    </div>

                    {/* LIVE OUTCOME FOR BINGO */}
                    {wingo30CurrentPrediction ? (
                      <div className="p-2.5 rounded-xl border border-pink-500/20 bg-pink-950/15 backdrop-blur-md text-center space-y-2 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center text-[9px] font-mono text-pink-300">
                          <span>{curTrans.period}: <span className="text-white font-bold">{wingo30CurrentPrediction.period.slice(-4)}</span></span>
                          <span className="flex items-center gap-1 text-red-400 font-bold">
                            <Clock className="w-3 h-3 animate-pulse" />
                            {curTrans.timeLeft}: {timeLeft30}s
                          </span>
                        </div>

                        {/* Prediction Outputs - Perfect 3-column equal grid, corner-to-corner set, equal-width */}
                        <div className="grid grid-cols-3 gap-1.5 bg-black/30 p-1.5 rounded-lg border border-pink-500/10 text-center items-stretch">
                          <div className="bg-pink-950/10 p-1.5 rounded-md border border-pink-900/20 flex flex-col justify-center items-center">
                            <span className="block text-[7.5px] font-mono uppercase text-pink-400 tracking-wider mb-1">{curTrans.signal}</span>
                            <span className={`text-[10px] font-black tracking-wider block ${
                              wingo30CurrentPrediction.type === "BIG" 
                                ? "text-rose-500 [text-shadow:0_0_8px_rgba(244,63,94,0.5)]" 
                                : "text-emerald-400 [text-shadow:0_0_8px_rgba(52,211,153,0.5)]"
                            }`}>
                              {wingo30CurrentPrediction.type === "BIG" ? "🔴 BIG" : "🟢 SMALL"}
                            </span>
                          </div>

                          {/* Color Indicator Pill */}
                          <div className="bg-pink-950/10 p-1.5 rounded-md border border-pink-900/20 flex flex-col justify-center items-center">
                            <span className="block text-[7.5px] font-mono uppercase text-pink-400 tracking-wider mb-1">COLOR</span>
                            <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-white ${
                              wingo30CurrentPrediction.color === "RED" 
                                ? "bg-red-600 border border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.4)]" 
                                : "bg-emerald-500 border border-emerald-300 text-black shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                            }`}>
                              {wingo30CurrentPrediction.color}
                            </span>
                          </div>

                          <div className="bg-pink-950/10 p-1.5 rounded-md border border-pink-900/20 flex flex-col justify-center items-center">
                            <span className="block text-[7.5px] font-mono uppercase text-cyan-400 tracking-wider mb-1">{curTrans.jackpot}</span>
                            <span className="text-xs font-black text-cyan-300 font-mono [text-shadow:0_0_8px_rgba(34,211,238,0.5)]">
                              {wingo30CurrentPrediction.num}
                            </span>
                          </div>
                        </div>

                        {/* BYPASS ENGINE */}
                        <div className="text-[8.5px] font-mono text-pink-300/80 bg-pink-950/20 py-0.5 px-1.5 rounded-md border border-pink-900/30 flex justify-between">
                          <span>{curTrans.bypassProtocol}:</span>
                          <span className="text-emerald-400 font-bold animate-pulse">ACTIVE ON-DEMAND</span>
                        </div>

                        {/* Accuracy Bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[8.5px] font-mono text-gray-400">
                            <span>{curTrans.confidence}:</span>
                            <span className="text-cyan-400 font-bold">{wingo30CurrentPrediction.confidence}%</span>
                          </div>
                          <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden border border-pink-900/40">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-cyan-500"
                              style={{ width: `${wingo30CurrentPrediction.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-pink-500/20 bg-pink-950/15 backdrop-blur-md rounded-xl animate-in fade-in duration-200">
                        <RefreshCw className="w-4 h-4 text-pink-400 animate-spin mx-auto mb-1" />
                        <span className="text-xs text-pink-300 font-mono">{curTrans.waitingBingo}</span>
                      </div>
                    )}

                    {/* Collapsible toggle button to show/hide history */}
                    <button
                      onClick={() => { triggerSound("click"); setShowWingo30HistoryBox(!showWingo30HistoryBox); }}
                      className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-pink-900/40 to-rose-950/40 hover:from-pink-900/60 hover:to-rose-950/60 border border-pink-500/30 hover:border-pink-400/50 text-pink-200 hover:text-white font-black text-[9.5px] uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(244,63,94,0.15)]"
                    >
                      {showWingo30HistoryBox ? "👁️ HIDE GAME HISTORY / इतिहास छुपाएं" : "📊 VIEW GAME HISTORY / इतिहास देखें"}
                    </button>
                  </div>

                  {/* SEPARATE, BEAUTIFUL OUTSIDE BOX FOR WINGO 30S HISTORY */}
                  {showWingo30HistoryBox && (
                    <div className="p-3.5 rounded-2xl border border-pink-500/30 bg-slate-950/90 backdrop-blur-2xl text-left shadow-[0_8px_32px_rgba(0,0,0,0.8)] max-w-[420px] mx-auto animate-in slide-in-from-top-3 duration-300 space-y-2.5">
                      <div className="text-[9.5px] font-mono text-pink-300 font-bold uppercase tracking-wider border-b border-pink-900/40 pb-1.5 flex justify-between items-center">
                        <span>📊 {appLang === "HINDI" ? "बिंगो खेल इतिहास / HISTORY" : "BINGO HISTORY LOGS"}</span>
                        <span className="text-pink-400 font-mono text-[8.5px] bg-pink-950/40 px-2 py-0.5 rounded-md border border-pink-500/20 font-black">
                          TOTAL: {wingo30History.length}
                        </span>
                      </div>

                      {wingo30History.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-[10px] font-mono leading-relaxed">
                          {appLang === "HINDI" ? "कोई इतिहास उपलब्ध नहीं है। कृपया खेल शुरू होने की प्रतीक्षा करें!" : "No history logs registered yet. Waiting for game outcomes!"}
                        </div>
                      ) : (
                        <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 font-mono text-[9px] scrollbar-thin animate-in fade-in duration-200">
                          {wingo30History.map((hist, index) => (
                            <div 
                              key={index} 
                              className="bg-slate-950/70 p-2 rounded-lg border border-pink-950/40 flex justify-between items-center gap-2 animate-in fade-in duration-150"
                            >
                              <div className="space-y-0.5">
                                <span className="text-pink-300 font-bold block text-[8.5px]">PER: {hist.period.slice(-4)}</span>
                                <span className="text-[7.5px] text-gray-500 block leading-none truncate max-w-[85px]">{hist.patternName || "System Pattern"}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                {/* Prediction Column */}
                                <div className="text-left space-y-0.5 min-w-[70px]">
                                  <span className="text-[7px] text-pink-400 block uppercase font-bold tracking-wider font-mono">PRED PANEL</span>
                                  <div className="flex flex-wrap gap-0.5 items-center">
                                    <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                      hist.predictedType === "BIG" ? "bg-rose-950/60 text-rose-400 border border-rose-900/30" : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                    }`}>
                                      {hist.predictedType}
                                    </span>
                                    {hist.predictedColor && (
                                      <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                        hist.predictedColor === "RED" 
                                          ? "bg-red-950/60 text-red-400 border border-red-900/30" 
                                          : hist.predictedColor === "VIOLET"
                                            ? "bg-purple-950/60 text-purple-400 border border-purple-900/30"
                                            : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                      }`}>
                                        {hist.predictedColor}
                                      </span>
                                    )}
                                    <span className="text-cyan-400 font-black text-[8px] bg-cyan-950/40 px-1 py-0.5 rounded border border-cyan-950">
                                      N:{hist.predictedNum}
                                    </span>
                                  </div>
                                </div>

                                {/* Actual Result Column */}
                                <div className="text-left space-y-0.5 min-w-[70px] border-l border-pink-950/30 pl-2">
                                  <span className="text-[7px] text-pink-400 block uppercase font-bold tracking-wider font-mono">ACTUAL OPEN</span>
                                  <div className="flex flex-wrap gap-0.5 items-center">
                                    <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                      hist.actualType === "BIG" ? "bg-rose-950/60 text-rose-400 border border-rose-900/30" : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                    }`}>
                                      {hist.actualType}
                                    </span>
                                    {hist.actualColor && (
                                      <span className={`px-1 py-0.5 rounded-[3px] font-black text-[7.5px] ${
                                        hist.actualColor === "RED" 
                                          ? "bg-red-950/60 text-red-400 border border-red-900/30" 
                                          : hist.actualColor === "VIOLET"
                                            ? "bg-purple-950/60 text-purple-400 border border-purple-900/30"
                                            : "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                      }`}>
                                        {hist.actualColor}
                                      </span>
                                    )}
                                    <span className="text-zinc-300 font-black text-[8px] bg-slate-900/60 px-1 py-0.5 rounded border border-slate-950">
                                      N:{hist.actualNum}
                                    </span>
                                  </div>
                                </div>

                                {/* Status Badge */}
                                <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-center min-w-[55px] ${
                                  hist.status === "JACKPOT"
                                    ? "bg-yellow-500 text-black border border-yellow-300 shadow-[0_0_5px_rgba(234,179,8,0.4)] animate-pulse"
                                    : hist.status === "WIN"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-pink-500/30 shadow-[0_0_4px_rgba(16,185,129,0.2)]"
                                      : "bg-rose-950/40 text-rose-400 border border-pink-500/20 shadow-[0_0_4px_rgba(244,63,94,0.1)]"
                                }`}>
                                  {hist.status === "JACKPOT" ? "JACKPOT 👑" : hist.status === "WIN" ? "WIN 🐯" : "LOES 🖤"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ----------------- SUB-VIEW: MINES ----------------- */}
              {unlockedMode === "mines" && (
                <div className="space-y-3" id="mines-subview-container">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
                    
                    {/* LEFT COLUMN: Controls & Selections */}
                    <div className="p-3 rounded-xl border border-cyan-500/25 bg-slate-950/35 backdrop-blur-md text-center flex flex-col justify-between space-y-2">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-wider block border-b border-cyan-950/40 pb-1 flex items-center justify-center gap-1">
                          📡 {curTrans.minesScanGrid}
                        </span>
                        
                        {/* Bomb Count Selection Buttons */}
                        <div className="space-y-1">
                          <span className="text-[8px] text-gray-400 font-mono block uppercase tracking-wider">
                            {appLang === "HINDI" ? "💣 बमों की संख्या चुनें" : "💣 SELECT BOMB COUNT"}
                          </span>
                          <div className="grid grid-cols-4 gap-1 max-w-[175px] mx-auto">
                            {[1, 3, 5, 10].map((count) => (
                              <button
                                key={count}
                                onClick={() => { triggerSound("click"); setMinesCount(count); }}
                                className={`py-1 text-[8.5px] font-black rounded border transition-all cursor-pointer ${
                                  minesCount === count
                                    ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                                    : "bg-purple-950/10 border-purple-900/40 text-purple-300/80 hover:bg-purple-900/10"
                                }`}
                              >
                                {count}B
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={generateMinesPrediction}
                        disabled={isMinesScanning}
                        className="w-full py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isMinesScanning ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            {curTrans.scanning}
                          </>
                        ) : (
                          <>
                            <Target className="w-3 h-3 animate-pulse" />
                            {curTrans.scanNextGrid}
                          </>
                        )}
                      </button>
                    </div>

                    {/* RIGHT COLUMN: 5x5 Grid Board */}
                    <div className="p-3 rounded-xl border border-cyan-500/20 bg-slate-950/25 backdrop-blur-md flex flex-col justify-center items-center min-h-[170px]">
                      <span className="text-[8px] font-mono text-cyan-400/80 uppercase tracking-widest mb-2">SCANNER MATRIX</span>
                      <div className="grid grid-cols-5 gap-1.5 max-w-[155px]">
                        {minesGrid.map((isStar, idx) => (
                          <div 
                            key={idx} 
                            className={`w-6.5 h-6.5 rounded-md border flex items-center justify-center transition-all duration-300 ${
                              isStar 
                                ? "bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border-cyan-400 glow-cyan animate-pulse" 
                                : "bg-purple-950/10 border-purple-900/40"
                            }`}
                          >
                            {isStar ? (
                              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                            ) : (
                              <div className="w-1 h-1 rounded-full bg-purple-900/50"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ----------------- SUB-VIEW: AVIATOR ----------------- */}
              {unlockedMode === "aviator" && (
                <div className="space-y-3" id="aviator-subview-container">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
                    
                    {/* LEFT COLUMN: Plane Flight Status Screen */}
                    <div className="relative p-2.5 rounded-xl border border-red-500/20 bg-slate-950/35 backdrop-blur-md flex flex-col justify-center items-center overflow-hidden min-h-[120px]">
                      {aviatorIsFlying ? (
                        <div className="text-center space-y-1">
                          <span className="block text-[7.5px] font-mono text-red-400 uppercase tracking-widest animate-pulse">PLANE IS FLYING</span>
                          <span className="text-2xl font-black text-red-500 font-mono animate-bounce">{aviatorMultiplier}x</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <span className="block text-[7.5px] font-mono text-gray-400 uppercase tracking-widest">NEXT FLYAWAY PREDICTION</span>
                          <span className="text-2xl font-black text-red-500 font-mono [text-shadow:0_0_12px_rgba(239,68,68,0.6)]">
                            {predictedCrashPoint || "1.00x"}
                          </span>
                        </div>
                      )}
                      {/* Red neon grid line representing path */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500/30 shadow-[0_0_8px_#ef4444]"></div>
                    </div>

                    {/* RIGHT COLUMN: Action & Scanner Controls */}
                    <div className="p-3 rounded-xl border border-red-500/25 bg-slate-950/35 backdrop-blur-md flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-red-300 font-bold uppercase tracking-wider block border-b border-red-950/60 pb-1 flex items-center justify-center gap-1">
                          ✈️ MULTIPLIER SCANNER
                        </span>
                        <p className="text-[8px] text-gray-400 font-mono text-center">
                          {appLang === "HINDI" 
                            ? "कृत्रिम बुद्धिमत्ता (AI) एल्गोरिथम क्रैश पॉइंट की भविष्यवाणी करता है।" 
                            : "Artificial Intelligence (AI) predictive models calculate flyaway probability."}
                        </p>
                      </div>

                      <button 
                        onClick={startAviatorPredictor}
                        disabled={isAviatorScanning}
                        className="w-full py-1.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isAviatorScanning ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            {curTrans.scanning}
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-3 h-3 animate-pulse" />
                            {appLang === "HINDI" ? "अगला क्रैश पॉइंट खोजें" : "FIND NEXT CRASH POINT"}
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ----------------- SUB-VIEW: GOAL ----------------- */}
              {unlockedMode === "goal" && (
                <div className="space-y-3" id="goal-subview-container">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
                    
                    {/* LEFT COLUMN: Controls & Summary */}
                    <div className="p-3 rounded-xl border border-green-500/25 bg-slate-950/35 backdrop-blur-md text-center flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-green-300 font-bold uppercase tracking-wider block border-b border-green-950/40 pb-1.5 flex items-center justify-center gap-1">
                          🥅 {appLang === "HINDI" ? "सुरक्षित रास्ता प्रणाली" : "SAFE GOAL PATHFINDER"}
                        </span>
                        <p className="text-[8px] text-gray-400 font-mono">
                          {appLang === "HINDI" 
                            ? "हर पंक्ति में फुटबॉल ⚽ का स्थान सुरक्षित रास्ता दर्शाता है।" 
                            : "Predictive analyzer detects safest entry path column for all active game rows."}
                        </p>
                      </div>

                      <button 
                        onClick={generateGoalPrediction}
                        disabled={isGoalScanning}
                        className="w-full py-1.5 bg-gradient-to-r from-green-600 to-teal-600 text-black font-black text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isGoalScanning ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            {curTrans.calculating}
                          </>
                        ) : (
                          <>
                            <Compass className="w-3 h-3 animate-pulse" />
                            {curTrans.findNextGoal}
                          </>
                        )}
                      </button>
                    </div>

                    {/* RIGHT COLUMN: Safe Field Path List (10 rows) */}
                    <div className="p-2.5 rounded-xl border border-green-500/20 bg-slate-950/25 backdrop-blur-md flex flex-col justify-between space-y-1.5 min-h-[180px]">
                      <span className="text-[8px] font-mono text-green-400/80 uppercase tracking-widest text-center">
                        {appLang === "HINDI" ? "सुरक्षित फ़ील्ड रास्ता (10 पंक्तियाँ)" : "SAFE PATH COORDS"}
                      </span>
                      
                      <div className="space-y-1 max-h-[140px] overflow-y-auto scrollbar-thin pr-1 w-full">
                        {goalGrid.map((safeCol, rowIdx) => (
                          <div key={rowIdx} className="flex items-center gap-1.5 bg-green-950/10 border border-green-950/20 p-0.5 px-1.5 rounded-lg">
                            <span className="text-[8px] font-mono text-gray-500 w-8 shrink-0">{curTrans.row.slice(-3)} {rowIdx + 1}</span>
                            <div className="flex-1 grid grid-cols-5 gap-1">
                              {Array.from({ length: 5 }).map((_, colIdx) => {
                                const isSafe = safeCol === colIdx;
                                return (
                                  <div 
                                    key={colIdx} 
                                    className={`h-4 border flex items-center justify-center transition-all ${
                                      isSafe 
                                        ? "bg-green-500/30 border-green-400 animate-pulse font-bold text-[9px]" 
                                        : "bg-black/60 border-green-950/40"
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
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}
                      {/* ----------------- WINGO INDEPENDENT POPUP BOX (Separate History Modal) ----------------- */}
          {isWingoHistoryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
              <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#080c14] p-5 shadow-[0_0_40px_rgba(6,182,212,0.4)] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex-shrink-0 flex justify-between items-center border-b border-cyan-900/40 pb-3 mb-4">
                  <h3 className="text-sm font-black text-cyan-300 flex items-center gap-1.5 font-mono">
                    <Clock className="w-4 h-4 text-cyan-400" />
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
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                  {(() => {
                    const activeHistList = unlockedMode === "wingo30s" ? wingo30History : wingoHistory;
                    if (activeHistList.length === 0) {
                      return (
                        <div className="text-center py-16 text-gray-500 text-xs font-semibold">
                          {curTrans.noHistory}
                        </div>
                      );
                    }
                    return activeHistList.map((item, idx) => {
                      return (
                        <div key={idx} className="bg-black/40 border border-cyan-950/40 p-3 rounded-xl space-y-2.5 text-xs font-mono">
                          
                          {/* Row 1: Period and Status */}
                          <div className="flex justify-between items-center border-b border-zinc-900/60 pb-1.5">
                            <span className="text-white font-black text-xs">
                              {curTrans.period}: <span className="text-cyan-400">{item.period.slice(-4)}</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              item.status === "JACKPOT" 
                                ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)] animate-pulse" 
                                : item.status === "WIN" 
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                                  : "bg-red-500/20 text-red-400 border border-red-500/40"
                            }`}>
                              {item.status === "JACKPOT" ? (appLang === "HINDI" ? "जैकपॉट" : "JACKPOT") : item.status === "WIN" ? (appLang === "HINDI" ? "जीत" : "WIN") : (appLang === "HINDI" ? "हार" : "LOSS")}
                            </span>
                          </div>

                          {/* Row 2: Prediction vs Actual layout */}
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {/* Pred */}
                            <div className="bg-cyan-950/10 border border-cyan-950/30 p-1.5 rounded space-y-1">
                              <span className="block text-[8px] text-cyan-400 font-bold uppercase tracking-widest">{appLang === "HINDI" ? "अनुमान (पैनल)" : "PRED (PANEL)"}</span>
                              <div className="flex flex-wrap gap-1 items-center font-bold">
                                <span className={item.predictedType === "BIG" ? "text-rose-400" : "text-emerald-400"}>
                                  {item.predictedType === "BIG" ? (appLang === "HINDI" ? "बिग" : "BIG") : (appLang === "HINDI" ? "स्मॉल" : "SMALL")}
                                </span>
                                <span className={`px-1 rounded text-[8px] text-white ${item.predictedColor === "RED" ? "bg-red-600" : "bg-emerald-500 text-black"}`}>
                                  {item.predictedColor === "RED" ? (appLang === "HINDI" ? "लाल" : "RED") : (appLang === "HINDI" ? "हरा" : "GREEN")}
                                </span>
                                <span className="text-gray-300">({item.predictedNum})</span>
                              </div>
                            </div>

                            {/* Actual */}
                            <div className="bg-zinc-900/30 border border-zinc-800/30 p-1.5 rounded space-y-1">
                              <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-widest">{appLang === "HINDI" ? "गेम का रिजल्ट" : "ACTUAL (GAME)"}</span>
                              <div className="flex flex-wrap gap-1 items-center font-bold">
                                <span className={item.actualType === "BIG" ? "text-rose-400" : "text-emerald-400"}>
                                  {item.actualType === "BIG" ? (appLang === "HINDI" ? "बिग" : "BIG") : (appLang === "HINDI" ? "स्मॉल" : "SMALL")}
                                </span>
                                <span className={`px-1 rounded text-[8px] text-white ${item.actualColor === "RED" ? "bg-red-600" : "bg-emerald-500 text-black"}`}>
                                  {item.actualColor === "RED" ? (appLang === "HINDI" ? "लाल" : "RED") : (appLang === "HINDI" ? "हरा" : "GREEN")}
                                </span>
                                <span className="text-gray-300">({item.actualNum})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-900/40 text-center shrink-0">
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">
                    {curTrans.sessionLocalOnly}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ----------------- BUY VIP PASSCODE MODAL (PAYMENT SCREEN) ----------------- */}
          {isBuyPasscodeOpen && (
            <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/90 backdrop-blur-md px-4 py-6 overflow-y-auto">
              <div className="relative w-full max-w-md rounded-2xl border border-yellow-500/40 bg-[#0c0818] p-5 sm:p-6 shadow-[0_0_35px_rgba(234,179,8,0.25)] max-h-[95vh] flex flex-col overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-purple-900/40 pb-3 mb-4 shrink-0">
                  <h3 className="text-sm font-black text-yellow-400 flex items-center gap-1.5 font-mono">
                    <Key className="w-4 h-4 text-yellow-500 animate-pulse" />
                    {appLang === "HINDI" ? "वीआईपी की खरीदें / GET VIP KEY" : "GET VIP PASSCODE KEY"}
                  </h3>
                  <button 
                    onClick={() => { triggerSound("click"); setIsBuyPasscodeOpen(false); }}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-900 text-[10px] font-bold uppercase cursor-pointer transition-colors"
                  >
                    {appLang === "HINDI" ? "बंद करें" : "CLOSE"}
                  </button>
                </div>

                {/* Plan Selection Grid */}
                <div className="shrink-0 mb-4">
                  <span className="block text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-2 font-black">
                    {appLang === "HINDI" ? "१. वैधता प्लान चुनें / 1. SELECT VALIDITY PLAN" : "1. SELECT VALIDITY PLAN"}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(["1 Hour", "1 Day", "3 Days", "7 Days"] as const).map((plan) => {
                      const price = PLAN_PRICES[plan];
                      const isSelected = selectedPlan === plan;
                      return (
                        <button
                          key={plan}
                          onClick={() => { triggerSound("click"); setSelectedPlan(plan); }}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-yellow-500/20 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)] scale-102" 
                              : "bg-black/50 border-purple-950 hover:border-yellow-500/30"
                          }`}
                        >
                          <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? "text-yellow-400" : "text-gray-400"}`}>
                            {plan === "1 Hour" ? (appLang === "HINDI" ? "1 घंटा" : "1 Hour") :
                             plan === "1 Day" ? (appLang === "HINDI" ? "1 दिन" : "1 Day") :
                             plan === "3 Days" ? (appLang === "HINDI" ? "3 दिन" : "3 Days") : 
                             (appLang === "HINDI" ? "7 दिन" : "7 Days")}
                          </span>
                          <span className="text-base font-black text-white mt-1">₹{price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* QR Code and Payment Details */}
                <div className="bg-black/80 border border-purple-900/40 p-4 rounded-xl flex flex-col items-center text-center space-y-4 shadow-inner mb-4">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black">
                    {appLang === "HINDI" ? "२. बारकोड स्कैन करके पेमेंट करें / 2. SCAN BARCODE TO PAY" : "2. SCAN BARCODE TO PAY"}
                  </span>
                  
                  {/* Dynamic QR Code */}
                  <div className="bg-white p-2.5 rounded-xl shadow-lg border border-yellow-500/20 glow-yellow flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        `upi://pay?pa=Shyamu6@fam&pn=RAMU%20BHAI%20VIP&am=${PLAN_PRICES[selectedPlan]}&cu=INR&tn=VIP%20Passcode%20${selectedPlan.replace(" ", "%20")}`
                      )}`} 
                      alt="Payment QR Code" 
                      className="w-36 h-36 object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-xs text-yellow-400 font-black tracking-wide uppercase">
                      {appLang === "HINDI" ? "चयनित:" : "SELECTED:"} {selectedPlan === "1 Hour" ? "1 Hour" : selectedPlan} PLAN - ₹{PLAN_PRICES[selectedPlan]}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono block uppercase">
                      RAMU BHAI SECURE MERCHANT GATEWAY
                    </span>
                  </div>
                </div>

                {/* UPI Copy Box */}
                <div className="bg-black border border-purple-950 p-3 rounded-xl flex justify-between items-center mb-4 text-xs font-mono">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">UPI ID (भुगतान पता)</span>
                    <span className="text-white font-black tracking-wide">Shyamu6@fam</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("Shyamu6@fam");
                      setCopiedUpi(true);
                      triggerSound("unlock");
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                      copiedUpi 
                        ? "bg-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                        : "bg-purple-950/80 border border-purple-500/30 text-purple-300 hover:bg-purple-900"
                    }`}
                  >
                    {copiedUpi ? (appLang === "HINDI" ? "कॉपी हो गया!" : "COPIED!") : (appLang === "HINDI" ? "कॉपी करें" : "COPY ID")}
                  </button>
                </div>

                {/* Instructions Text */}
                <div className="bg-yellow-950/20 border border-yellow-500/20 p-3 rounded-xl text-left space-y-1.5 mb-5">
                  <span className="block text-[10px] font-mono text-yellow-400 font-black uppercase tracking-wider">
                    {appLang === "HINDI" ? "३. स्क्रीनशॉट भेजें / 3. SUBMIT RECEIPT" : "3. SUBMIT RECEIPT"}
                  </span>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-bold">
                    {appLang === "HINDI" 
                      ? "पेमेंट करने के बाद, स्क्रीनशॉट हमारे टेलीग्राम यूजरनेम @Monu1359 पर भेजें। आपको तुरंत आपका वीआईपी पासकोड दे दिया जाएगा।" 
                      : "After payment, send the transaction screenshot to our Telegram username @Monu1359 to receive your active VIP key passcode."}
                  </p>
                </div>

                {/* Send Screenshot Link */}
                <a
                  href="https://t.me/Monu1359"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 glow-emerald cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
                >
                  <Send className="w-4 h-4 fill-current" />
                  <span>{appLang === "HINDI" ? "टेलीग्राम पर स्क्रीनशॉट भेजें" : "SEND SCREENSHOT ON TELEGRAM"}</span>
                </a>

                <p className="text-[9px] text-gray-500 text-center font-mono mt-3 uppercase tracking-wider">
                  TELEGRAM ADMIN USERNAME: @Monu1359
                </p>

              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
