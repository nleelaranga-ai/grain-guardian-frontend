'use client';

import React, { useState, useEffect } from 'react';

// ============================================================================
// SYSTEM TYPE DEFINITIONS & SCHEMAS
// ============================================================================
interface ClpMatrix {
  clp_moisture_violation: boolean;
  clp_temp_violation: boolean;
  clp_humidity_violation: boolean;
  clp_duration_violation: boolean;
  clp_fungal_violation: boolean;
}

interface HistoricLog {
  id: number;
  date: string;
  batch: string;
  crop: string;
  mode: string;
  score: number;
  status: string;
  emc: number;
  tAvg: number;
  lossInr: number;
}

// ============================================================================
// CROP INTELLIGENCE DATABASE
// ============================================================================
const CROP_DATABASE = [
  { 
    id: 0, 
    name: "Paddy (Rice - Fine)", 
    variety: "IR-64 Standard",
    c1: 1.9187e-5, 
    c2: 51.161, 
    c3: 2.4484, 
    safeLimit: 13.5, 
    msp: 23.20, 
    warningMoisture: 14.5,
    criticalMoisture: 16.0,
    warningTemp: 35.0,
    criticalTemp: 42.0,
    maxStorageDays: 180
  },
  { 
    id: 1, 
    name: "Wheat", 
    variety: "Sharbati Premium",
    c1: 2.3007e-5, 
    c2: 35.853, 
    c3: 2.2857, 
    safeLimit: 13.0, 
    msp: 22.75,
    warningMoisture: 14.0,
    criticalMoisture: 15.5,
    warningTemp: 33.0,
    criticalTemp: 40.0,
    maxStorageDays: 240
  },
  { 
    id: 2, 
    name: "Maize (Corn)", 
    variety: "Deccan Hybrid",
    c1: 8.6541e-5, 
    c2: 49.810, 
    c3: 1.8634, 
    safeLimit: 13.5, 
    msp: 20.90,
    warningMoisture: 14.2,
    criticalMoisture: 15.8,
    warningTemp: 34.0,
    criticalTemp: 41.0,
    maxStorageDays: 120
  }
];

export default function App() {
  // ============================================================================
  // GLOBAL STATE SYSTEM
  // ============================================================================
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'clp' | 'history' | 'reports' | 'help' | 'settings'>('dashboard');
  const [lang, setLang] = useState<'EN' | 'TE'>('EN');
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [bleConnected, setBleConnected] = useState(true);
  const [farmerName, setFarmerName] = useState("Prasad Rao");
  const [fpoName, setFpoName] = useState("Kalyani Farmer Producer Org (FPO)");
  const [activeBatchId, setActiveBatchId] = useState("BATCH-2026-P09");
  const [initialMassKg, setInitialMassKg] = useState(12000); 
  const [storageDurationDays, setStorageDurationDays] = useState(45);

  const [isStorageMode, setIsStorageMode] = useState(true);
  const [tempT1, setTempT1] = useState(28.5); // Surface (0.2m)
  const [tempT2, setTempT2] = useState(31.2); // Mid (0.7m)
  const [tempT3, setTempT3] = useState(34.8); // Core (1.3m)
  const [interGranularHumidity, setInterGranularHumidity] = useState(64.5);
  const [ambientTemp, setAmbientTemp] = useState(30.0);
  const [ambientHumidity, setAmbientHumidity] = useState(62.0);

  const [historyLog, setHistoryLog] = useState<HistoricLog[]>([
    { id: 1, date: "2026-06-18 10:20", batch: "BATCH-2026-P09", crop: "Paddy (Rice - Fine)", mode: "Storage", score: 92, status: "SAFE", emc: 12.8, tAvg: 29.2, lossInr: 0 },
    { id: 2, date: "2026-06-15 14:15", batch: "BATCH-2026-P09", crop: "Paddy (Rice - Fine)", mode: "Drying", score: 58, status: "WARNING", emc: 15.2, tAvg: 32.4, lossInr: 9120 },
    { id: 3, date: "2026-06-10 09:00", batch: "BATCH-2026-W04", crop: "Wheat", mode: "Storage", score: 96, status: "SAFE", emc: 12.1, tAvg: 26.8, lossInr: 0 },
    { id: 4, date: "2026-06-02 16:40", batch: "BATCH-2026-P09", crop: "Paddy (Rice - Fine)", mode: "Storage", score: 38, status: "CRITICAL", emc: 16.4, tAvg: 41.5, lossInr: 28450 }
  ]);

  const [cropFilter, setCropFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [hoveredNode, setHoveredNode] = useState<{ x: number, y: number, label: string, val: number } | null>(null);

  // ============================================================================
  // MULTILINGUAL TRANSLATION INTERFACES
  // ============================================================================
  const lexicon = {
    EN: {
      brand: "GRAINGUARDIAN",
      tagline: "Post-Harvest Security & Loss Prediction Engine",
      dashboard: "Command Center",
      clp: "Critical Loss Points",
      history: "Historic Ledger",
      reports: "Report Compiler",
      help: "Farmer Help Desk",
      settings: "Configuration",
      activeCrop: "Active Crop Profile",
      probeMode: "Active Hardware Mode",
      dryingCanopy: "Drying Yard Canopy",
      storageProbe: "Storage Probe Column",
      runScan: "EXECUTE LIVE CLOUD COMPUTATION",
      overallGHI: "GRAIN HEALTH INDEX (GHI)",
      financialLoss: "ESTIMATED LOSS EXPOSURE",
      fungalRisk: "FUNGAL ACTIVITY PROFILE",
      advisory: "DECISION SUPPORT RECOMMENDATIONS",
      criticalAlerts: "ACTIVE EXCEPTION ALARMS",
      calibration: "Hardware Calibration Standards",
      cropSelect: "Select Baseline Target Crop",
      massInput: "Stored Batch Mass (kg)"
    },
    TE: {
      brand: "గ్రెయిన్ గార్డియన్ AI",
      tagline: "తెలివైన పంట నిల్వ మరియు రక్షణ నిర్ణయ వ్యవస్థ",
      dashboard: "నియంత్రణ కేంద్రం",
      clp: "నష్ట నియంత్రణ పాయింట్లు",
      history: "చారిత్రక రికార్డులు",
      reports: "ధాన్య పరిశీలన నివేదిక",
      help: "సహాయ కేంద్రం",
      settings: "సిస్టమ్ సెట్టింగులు",
      activeCrop: "పంట ప్రొఫైల్",
      probeMode: "పరికరం మోడ్",
      dryingCanopy: "ఆరబెట్టే స్థలం",
      storageProbe: "నిల్వ గిడ్డంగి పరిశీలన",
      runScan: "లైవ్ క్లౌడ్ పరీక్షను రన్ చేయండి",
      overallGHI: "ధాన్యం ఆరోగ్య సూచిక (GHI)",
      financialLoss: "అంచనా వేసిన ఆర్థిక నష్టం",
      fungalRisk: "శిలీంధ్రాల ముప్పు స్థాయి",
      advisory: "వ్యవసాయ నిపుణుల సిఫార్సులు",
      criticalAlerts: "ప్రమాద హెచ్చరిక అలారాలు",
      calibration: "పరికర అమరిక అమరిక",
      cropSelect: "పంట రకాన్ని ఎంచుకోండి",
      massInput: "నిల్వ చేసిన ధాన్యం బరువు (kg)"
    }
  };

  const activeCrop = CROP_DATABASE[selectedCropIndex];

  // ============================================================================
  // EQUILIBRIUM & BIOLOGICAL MATH ENGINE
  // ============================================================================
  const calculateEMC = (temp: number, rh: number, crop: typeof CROP_DATABASE[0]) => {
    const rhDecimal = Math.max(0.01, Math.min(99.9, rh)) / 100.0;
    const term1 = -Math.log(1.0 - rhDecimal);
    const term2 = crop.c1 * (temp + crop.c2);
    if (term2 <= 0) return 0;
    return Math.pow(term1 / term2, 1.0 / crop.c3) * 100;
  };

  const currentEMC = isStorageMode 
    ? calculateEMC(tempT3, interGranularHumidity, activeCrop) 
    : calculateEMC(ambientTemp, ambientHumidity, activeCrop);

  const calculateFungalActivityIndex = (moisture: number, temp: number) => {
    return ((moisture / activeCrop.safeLimit) ** 2) * (temp / 28.0);
  };

  const bai = calculateFungalActivityIndex(currentEMC, isStorageMode ? tempT3 : ambientTemp);
  const fungalRiskStatus = bai < 1.05 ? "LOW" : (bai < 1.30 ? "MEDIUM" : "HIGH");

  const computeDecisionMatrix = () => {
    let score = 100;
    let warnings: string[] = [];
    let teluguWarnings: string[] = [];

    // CLP-1: Moisture Violation
    const clp1Moisture = currentEMC > activeCrop.criticalMoisture;
    const clp1Warning = currentEMC > activeCrop.warningMoisture;
    if (clp1Moisture) {
      score -= 35;
      warnings.push(`CLP-1 [CRITICAL]: Grain moisture content of ${currentEMC.toFixed(1)}% exceeds absolute safe ceiling threshold (${activeCrop.criticalMoisture}%).`);
      teluguWarnings.push(`తేమ శాతం ఎక్కువగా ఉంది (${currentEMC.toFixed(1)}%). ధాన్యాన్ని వెంటనే ఎండబెట్టండి.`);
    } else if (clp1Warning) {
      score -= 15;
      warnings.push(`CLP-1 [WARNING]: Grain moisture is elevated at ${currentEMC.toFixed(1)}% above storage ideal limit.`);
      teluguWarnings.push(`తేమ శాతం సాధారణ పరిమితి కంటే ఎక్కువ ఉంది (${currentEMC.toFixed(1)}%). పర్యవేక్షణ అవసరం.`);
    }

    // CLP-2: Thermal Boundary Gradient Violation
    const maxTempDiff = Math.max(Math.abs(tempT1 - tempT2), Math.abs(tempT2 - tempT3), Math.abs(tempT1 - tempT3));
    const clp2Gradient = isStorageMode && maxTempDiff > 4.0;
    if (clp2Gradient) {
      score -= 20;
      warnings.push(`CLP-2 [WARNING]: Critical internal thermal gradient gap detected (ΔT = ${maxTempDiff.toFixed(1)}°C). Core localized hotspots forming.`);
      teluguWarnings.push(`కుప్ప లోపల వివిధ పొరల మధ్య ఉష్ణోగ్రత వ్యత్యాసం ఎక్కువగా ఉంది (ΔT = ${maxTempDiff.toFixed(1)}°C).`);
    }

    // CLP-3: High Core Temperature Respiration
    const absoluteMaxTemp = Math.max(tempT1, tempT2, tempT3);
    const clp3HighTemp = absoluteMaxTemp > activeCrop.criticalTemp;
    if (clp3HighTemp) {
      score -= 25;
      warnings.push(`CLP-3 [CRITICAL]: Core localized temperatures have spiked to dangerous levels (${absoluteMaxTemp.toFixed(1)}°C) suggesting rapid insect/fungal activity.`);
      teluguWarnings.push(`కుప్ప లోపల అత్యధిక వేడి నమోదు అయ్యింది (${absoluteMaxTemp.toFixed(1)}°C). వెంటనే గాలి ప్రసరణ కల్పించండి.`);
    }

    // CLP-4: Storage Lifespan Violation
    const clp4Duration = storageDurationDays > activeCrop.maxStorageDays;
    if (clp4Duration) {
      score -= 15;
      warnings.push(`CLP-4 [WARNING]: Storage duration of ${storageDurationDays} days exceeds safe limit (${activeCrop.maxStorageDays} days) for this crop.`);
      teluguWarnings.push(`నిల్వ ఉంచిన సమయం చాలా ఎక్కువయింది (${storageDurationDays} రోజులు). నాణ్యత నష్టం పొంచి ఉంది.`);
    }

    // CLP-5: Biotic Infection Vector
    const clp5Fungal = fungalRiskStatus === "HIGH";
    if (clp5Fungal) {
      score -= 20;
      warnings.push("CLP-5 [CRITICAL]: Environmental conditions match micro-organic growth matrix. Accelerated mold generation imminent.");
      teluguWarnings.push("శిలీంధ్రాల వ్యాప్తి వేగంగా జరిగే అవకాశం ఉంది. వెంటనే నిల్వ గిడ్డంగిని ఆరబెట్టండి.");
    }

    score = Math.max(0, Math.min(100, score));
    let status = "SAFE";
    if (score < 60) status = "CRITICAL";
    else if (score < 85) status = "WARNING";

    // Financial calculations
    let weightLossKg = 0;
    let lossInr = 0;
    if (currentEMC > activeCrop.safeLimit) {
      const moistureVarianceRatio = (currentEMC - activeCrop.safeLimit) / 100;
      const riskMultiplier = fungalRiskStatus === "HIGH" ? 1.4 : (fungalRiskStatus === "MEDIUM" ? 1.15 : 1.0);
      weightLossKg = Math.round(initialMassKg * moistureVarianceRatio * riskMultiplier);
      lossInr = Math.round(weightLossKg * activeCrop.msp);
    }

    return {
      score,
      status,
      warnings,
      teluguWarnings,
      maxTempDiff,
      lossInr,
      weightLossKg,
      violations: {
        clp1: clp1Warning || clp1Moisture,
        clp2: clp2Gradient,
        clp3: clp3HighTemp,
        clp4: clp4Duration,
        clp5: clp5Fungal
      }
    };
  };

  const { score: currentHealthScore, status: currentStatus, warnings: riskWarnings, teluguWarnings, maxTempDiff: tempGradient, lossInr, weightLossKg, violations } = computeDecisionMatrix();

  // ============================================================================
  // SIMULATION HANDLERS & LOG GENERATORS
  // ============================================================================
  const executeInspectionLog = () => {
    const newLogEntry: HistoricLog = {
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      batch: activeBatchId,
      crop: activeCrop.name,
      mode: isStorageMode ? "Storage" : "Drying",
      score: currentHealthScore,
      status: currentStatus,
      emc: parseFloat(currentEMC.toFixed(1)),
      tAvg: parseFloat(((tempT1 + tempT2 + tempT3) / 3).toFixed(1)),
      lossInr: lossInr
    };
    setHistoryLog([newLogEntry, ...historyLog]);
    setCurrentScreen('history');
  };

  const forceScenario = (preset: 'hotspot' | 'ideal' | 'wetYard' | 'dampWarehouse') => {
    if (preset === 'hotspot') {
      setTempT1(27.0); setTempT2(29.5); setTempT3(44.5);
      setInterGranularHumidity(78.0);
      setIsStorageMode(true);
    } else if (preset === 'ideal') {
      setTempT1(24.0); setTempT2(24.5); setTempT3(25.0);
      setInterGranularHumidity(48.0);
      setIsStorageMode(true);
    } else if (preset === 'wetYard') {
      setAmbientTemp(25.0); setAmbientHumidity(88.0);
      setIsStorageMode(false);
    } else if (preset === 'dampWarehouse') {
      setTempT1(29.0); setTempT2(33.0); setTempT3(38.0);
      setInterGranularHumidity(75.0);
      setIsStorageMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col xl:flex-row font-sans selection:bg-[#00FF9D] selection:text-[#020617] antialiased">
      
      {/* PERSISTENT BRANDING SIDEBAR */}
      <aside className="w-full xl:w-80 bg-[#070b19] border-b xl:border-b-0 xl:border-r border-white/5 flex flex-col justify-between shrink-0 p-6 z-20">
        <div>
          {/* Logo Group */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-[#00FF9D]/10 text-[#00FF9D] rounded-xl border border-[#00FF9D]/20 shadow-[0_0_15px_rgba(0,255,157,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3M12 5.25l7.5 7.5-7.5 7.5M12 18.75L4.5 11.25l7.5-7.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white leading-none">{lexicon[lang].brand}</h1>
              <span className="text-[8px] font-bold text-[#00D9FF] tracking-widest block uppercase mt-1">DECISION INTELLIGENCE V3</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-8">
            {lexicon[lang].tagline}
          </p>

          {/* Sticky Navigation Link Grid */}
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: lexicon[lang].dashboard, sub: "Real-time parameters", icon: "📊" },
              { id: 'clp', label: lexicon[lang].clp, sub: "5-Tier Risk Vectors", icon: "🔬" },
              { id: 'history', label: lexicon[lang].history, sub: "Dynamic ledger storage", icon: "⏳" },
              { id: 'reports', label: lexicon[lang].reports, sub: "Compile certifiable PDF", icon: "📋" },
              { id: 'help', label: lexicon[lang].help, sub: "Visual calibration center", icon: "🧑‍🌾" },
              { id: 'settings', label: lexicon[lang].settings, sub: "Profiles & thresholds", icon: "⚙️" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentScreen(tab.id as any)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center gap-3.5 ${
                  currentScreen === tab.id 
                    ? 'bg-[#00FF9D]/10 border-[#00FF9D]/20 text-white shadow-[0_4px_20px_rgba(0,255,157,0.08)]' 
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <span className="text-base shrink-0">{tab.icon}</span>
                <div className="text-left leading-none">
                  <div className="text-xs font-bold tracking-wide uppercase">{tab.label}</div>
                  <div className="text-[9px] text-slate-500 mt-1 font-medium">{tab.sub}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Global Connection/Telemetry Broadcast Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Hardware Probe Broadcast</span>
            <span className={`h-2 w-2 rounded-full ${bleConnected ? 'bg-[#00FF9D] animate-ping' : 'bg-red-500'}`} />
          </div>
          <div className="bg-[#020617] rounded-xl border border-white/5 p-3 text-left">
            <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider mb-1.5">BLE Stream Payload</span>
            <code className="text-xs font-mono font-bold text-[#00D9FF] block leading-relaxed">
              {bleConnected ? `${isStorageMode ? "STORAGE" : "DRYING"}, T3=${tempT3.toFixed(1)}C, H=${interGranularHumidity}%` : "TRANSMISSION_FAILED"}
            </code>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setLang(lang === 'EN' ? 'TE' : 'EN')} 
              className="flex-1 bg-slate-900 hover:bg-slate-800 border border-white/5 text-xs font-bold py-2 rounded-lg transition-all"
            >
              🌐 {lang === 'EN' ? "తెలుగు" : "English"}
            </button>
            <button 
              onClick={() => setBleConnected(!bleConnected)} 
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all border ${
                bleConnected ? 'bg-blue-950/20 border-blue-900 text-blue-400' : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
            >
              {bleConnected ? "DISCONNECT" : "CONNECT BLE"}
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================================
          MAIN CONTENT WORKSPACE
          ============================================================================ */}
      <main className="flex-1 p-6 lg:p-8 xl:p-12 overflow-y-auto max-w-7xl mx-auto w-full z-10">
        
        {/* Active Route Screen Renderer */}
        {currentScreen === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* HERO STATEMENT: AETHERFIELD EDITORIAL STYLE */}
            <div className="text-left py-4 border-b border-white/5">
              <span className="text-[10px] font-bold text-[#00FF9D] tracking-widest uppercase block mb-1">PREMIUM GRAIN DIAGNOSTICS</span>
              <h2 className="text-5xl font-black text-white tracking-tighter leading-none mb-3">Built for clarity.<br />Designed for action.</h2>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                We combine regional minimum support pricing parameters, Henderson-Thompson equilibrium constants, and multi-depth hardware telemetry vectors to safeguard harvest resources.
              </p>
            </div>

            {/* QUICK PRESET CHANNELS */}
            <div className="flex flex-wrap gap-2 items-center bg-[#070b19] border border-white/5 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">DIAGNOSTIC TESTBEDS:</span>
              <button onClick={() => forceScenario('ideal')} className="bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">🌾 Ideal Cold Storage</button>
              <button onClick={() => forceScenario('hotspot')} className="bg-red-950/30 hover:bg-red-900/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">🔥 Localized Hotspot</button>
              <button onClick={() => forceScenario('wetYard')} className="bg-cyan-950/30 hover:bg-cyan-900/20 text-[#00D9FF] border border-[#00D9FF]/30 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">🌧️ Rainy Canopy</button>
              <button onClick={() => forceScenario('dampWarehouse')} className="bg-amber-950/30 hover:bg-amber-900/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">🏚️ Damp Warehouse</button>
            </div>

            {/* INTEGRATED MULTI-STAGE ANALYTICAL SCOREBOARD CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CARD 1: OVERALL GHI GAUGE CARD */}
              <div className="bg-[#070b19]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#00FF9D]/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{lexicon[lang].overallGHI}</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-7xl font-black tracking-tighter ${
                      currentStatus === 'SAFE' ? 'text-[#00FF9D]' : currentStatus === 'WARNING' ? 'text-amber-400' : 'text-red-400 animate-pulse'
                    }`}>{currentHealthScore}</span>
                    <span className="text-xs text-slate-500 font-mono">/100</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1.5 border-t border-white/5 pt-4">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    currentStatus === 'SAFE' ? 'bg-[#10B981]' : currentStatus === 'WARNING' ? 'bg-amber-400' : 'bg-red-400 animate-ping'
                  }`} />
                  <span className="text-xs font-bold uppercase tracking-wider">{currentStatus} STATUS LIMIT</span>
                </div>
              </div>

              {/* CARD 2: FINANCIAL LOSS ESTIMATION IN INR */}
              <div className="bg-[#070b19]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-red-500/5 rounded-full blur-2xl" />
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{lexicon[lang].financialLoss}</span>
                  <div className="flex flex-col">
                    <span className="text-5xl font-extrabold text-red-400 tracking-tight">₹{lossInr.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400 mt-2 font-semibold">Projected Mass Loss: <strong className="text-slate-200 font-mono">{weightLossKg} kg</strong></span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-6 uppercase tracking-wider border-t border-white/5 pt-4">
                  MSP Calculated Basis: <strong className="text-slate-200">₹{activeCrop.msp}/kg</strong>
                </p>
              </div>

              {/* CARD 3: BIOLOGICAL EXPOSURE RATE INDEX */}
              <div className="bg-[#070b19]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#00D9FF]/5 rounded-full blur-2xl" />
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{lexicon[lang].fungalRisk}</span>
                  <div className="flex flex-col">
                    <span className={`text-4xl font-black tracking-tight ${
                      fungalRiskStatus === 'HIGH' ? 'text-red-400' : fungalRiskStatus === 'MEDIUM' ? 'text-amber-400' : 'text-[#00FF9D]'
                    }`}>{fungalRiskStatus} RISK</span>
                    <span className="text-xs text-slate-400 mt-2 font-semibold">Biological Activity Index: <strong className="text-slate-200 font-mono">{bai.toFixed(2)} BAI</strong></span>
                  </div>
                </div>
                <div className="bg-[#020617] p-2.5 rounded-lg border border-white/5 flex justify-between items-center text-[10px] mt-6">
                  <span className="text-slate-500 font-semibold uppercase">Micro-growth Model:</span>
                  <span className="font-bold text-slate-300 font-mono">{bai > 1.25 ? "ACCELERATING" : "STABLE"}</span>
                </div>
              </div>

            </div>

            {/* REAL-TIME CONTROLS & DALLAS SENSOR STACK SIMULATORS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* INTERACTIVE SIMULATOR SLIDERS CAP (SIZE 5) */}
              <div className="lg:col-span-5 bg-[#070b19]/90 border border-white/5 p-6 rounded-2xl space-y-6 shadow-xl z-10">
                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#00FF9D] mb-1">PROBE TELEMETRY SANDBOX</h3>
                  <p className="text-xs text-slate-400">Manipulate thermodynamics parameters live to test boundaries.</p>
                </div>

                <div className="space-y-4">
                  {/* Select crop inside panel for faster testing */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lexicon[lang].cropSelect}</label>
                    <select
                      value={selectedCropIndex}
                      onChange={(e) => setSelectedCropIndex(parseInt(e.target.value))}
                      className="w-full bg-[#020617] border border-white/10 text-[#00FF9D] font-bold text-xs py-3 px-3.5 rounded-lg focus:outline-none focus:border-[#00FF9D] transition-all cursor-pointer"
                    >
                      {CROP_DATABASE.map((c, i) => (
                        <option key={c.id} value={i}>{c.name} ({c.variety})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">{lexicon[lang].probeMode}</span>
                      <button 
                        onClick={() => setIsStorageMode(!isStorageMode)}
                        className="text-[9px] bg-[#00FF9D]/15 text-[#00FF9D] font-bold px-2.5 py-1.5 rounded border border-[#00FF9D]/20 hover:bg-[#00FF9D]/25 transition"
                      >
                        SWITCH MODE
                      </button>
                    </div>
                    <div className="bg-[#020617] rounded-xl border border-white/5 p-3 text-center text-xs font-bold text-[#00D9FF]">
                      {isStorageMode ? `🏠 ${lexicon[lang].storageProbe}` : `🌞 ${lexicon[lang].dryingCanopy}`}
                    </div>
                  </div>

                  {isStorageMode ? (
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">T1 Layer (0.2m Surface Convection)</span>
                          <span className="text-[#00FF9D] font-mono font-bold">{tempT1.toFixed(1)}°C</span>
                        </div>
                        <input type="range" min="15" max="55" step="0.5" value={tempT1} onChange={(e) => setTempT1(parseFloat(e.target.value))} className="w-full accent-[#00FF9D] bg-slate-950" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">T2 Layer (0.7m Middle Conduction)</span>
                          <span className="text-[#00FF9D] font-mono font-bold">{tempT2.toFixed(1)}°C</span>
                        </div>
                        <input type="range" min="15" max="55" step="0.5" value={tempT2} onChange={(e) => setTempT2(parseFloat(e.target.value))} className="w-full accent-[#00FF9D] bg-slate-950" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">T3 Layer (1.3m Hot Core Pile)</span>
                          <span className="text-[#00D9FF] font-mono font-bold">{tempT3.toFixed(1)}°C</span>
                        </div>
                        <input type="range" min="15" max="55" step="0.5" value={tempT3} onChange={(e) => setTempT3(parseFloat(e.target.value))} className="w-full accent-[#00FF9D] bg-slate-950" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">Probe Core Relative Humidity</span>
                          <span className="text-purple-400 font-mono font-bold">{interGranularHumidity}%</span>
                        </div>
                        <input type="range" min="20" max="95" value={interGranularHumidity} onChange={(e) => setInterGranularHumidity(parseFloat(e.target.value))} className="w-full accent-[#00FF9D] bg-slate-950" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">Drying Ambient Temp</span>
                          <span className="text-[#00FF9D] font-mono font-bold">{ambientTemp.toFixed(1)}°C</span>
                        </div>
                        <input type="range" min="15" max="50" step="0.5" value={ambientTemp} onChange={(e) => setAmbientTemp(parseFloat(e.target.value))} className="w-full accent-[#00FF9D] bg-slate-950" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">Ambient Rel Humidity</span>
                          <span className="text-[#00FF9D] font-mono font-bold">{ambientHumidity}%</span>
                        </div>
                        <input type="range" min="20" max="95" value={ambientHumidity} onChange={(e) => setAmbientHumidity(parseFloat(e.target.value))} className="w-full accent-[#00FF9D] bg-slate-950" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5">
                  <button 
                    onClick={executeInspectionLog} 
                    className="w-full bg-gradient-to-r from-[#00FF9D] to-[#00D9FF] hover:brightness-110 text-[#020617] font-black tracking-wider text-xs py-4 px-6 rounded-xl transition-all shadow-[0_0_25px_rgba(0,255,157,0.15)] uppercase"
                  >
                    {lexicon[lang].runScan}
                  </button>
                </div>
              </div>

              {/* DYNAMIC DIAGNOSTICS & ADVISORY CHANNELS (SIZE 7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* COMPOSITE HEALTH SUMMARY CHART (SVG NATIVE DRAWING) */}
                <div className="bg-[#070b19]/40 border border-white/5 p-6 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">GHI Chronological Vector Curve</h4>
                      <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-bold font-mono">Dynamic GHI Tracking Curve</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#00FF9D] font-bold border border-emerald-900 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg">LIVE CHANNELS ACTIVE</span>
                  </div>

                  {/* SVG Line Graph with glowing interaction state */}
                  <div className="w-full bg-[#020617] rounded-xl border border-white/5 p-4 relative">
                    <svg viewBox="0 0 500 130" className="w-full overflow-visible font-mono select-none">
                      <defs>
                        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#00FF9D" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#00FF9D" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      <line x1="0" y1="15" x2="500" y2="15" stroke="#101a35" strokeDasharray="3 3" />
                      <line x1="0" y1="65" x2="500" y2="65" stroke="#101a35" strokeDasharray="3 3" />
                      <line x1="0" y1="115" x2="500" y2="115" stroke="#101a35" strokeDasharray="3 3" />

                      {/* Area Fill */}
                      <path 
                        d={`M 0 130 L 0 ${130 - (historyLog[3]?.score ?? 80)} L 166 ${130 - (historyLog[2]?.score ?? 60)} L 333 ${130 - (historyLog[1]?.score ?? 90)} L 500 ${130 - currentHealthScore} L 500 130 Z`} 
                        fill="url(#glowGrad)"
                      />

                      {/* Line Plot */}
                      <path 
                        d={`M 0 ${130 - (historyLog[3]?.score ?? 80)} L 166 ${130 - (historyLog[2]?.score ?? 60)} L 333 ${130 - (historyLog[1]?.score ?? 90)} L 500 ${130 - currentHealthScore}`} 
                        fill="none" 
                        stroke="#00FF9D" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]"
                      />

                      {/* Nodes */}
                      <g>
                        {[
                          { cx: 0, cy: 130 - (historyLog[3]?.score ?? 80), val: historyLog[3]?.score ?? 80, date: "06-02" },
                          { cx: 166, cy: 130 - (historyLog[2]?.score ?? 60), val: historyLog[2]?.score ?? 60, date: "06-10" },
                          { cx: 333, cy: 130 - (historyLog[1]?.score ?? 90), val: historyLog[1]?.score ?? 90, date: "06-15" },
                          { cx: 500, cy: 130 - currentHealthScore, val: currentHealthScore, date: "Now" }
                        ].map((node, i) => (
                          <g key={i}>
                            <circle 
                              cx={node.cx} 
                              cy={node.cy} 
                              r="5" 
                              fill="#020617" 
                              stroke="#00FF9D" 
                              strokeWidth="2.5" 
                              className="cursor-pointer"
                              onMouseEnter={() => {
                                setHoveredNode({
                                  x: node.cx,
                                  y: node.cy,
                                  label: node.date,
                                  val: node.val
                                });
                              }}
                              onMouseLeave={() => setHoveredNode(null)}
                            />
                          </g>
                        ))}
                      </g>

                      {/* Interactive Tooltip Box */}
                      {hoveredNode && (
                        <g>
                          <rect 
                            x={Math.max(10, hoveredNode.x - 45)} 
                            y={Math.max(5, hoveredNode.y - 45)} 
                            width="90" 
                            height="35" 
                            rx="6" 
                            fill="#0b1329" 
                            stroke="#00FF9D" 
                            strokeWidth="1" 
                            className="shadow-2xl opacity-90"
                          />
                          <text 
                            x={Math.max(10, hoveredNode.x - 45) + 45} 
                            y={Math.max(5, hoveredNode.y - 45) + 15} 
                            textAnchor="middle" 
                            fill="#94a3b8" 
                            fontSize="8" 
                            fontWeight="bold"
                          >
                            {hoveredNode.label}
                          </text>
                          <text 
                            x={Math.max(10, hoveredNode.x - 45) + 45} 
                            y={Math.max(5, hoveredNode.y - 45) + 27} 
                            textAnchor="middle" 
                            fill="#00FF9D" 
                            fontSize="10" 
                            fontWeight="black"
                          >
                            GHI: {hoveredNode.val}
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase mt-3">
                    <span>Lot Ingestion (June 02)</span>
                    <span>Inter-Drying Phase (June 10)</span>
                    <span>Sealing Baseline (June 15)</span>
                    <span className="text-[#00FF9D]">Live telemetry stream</span>
                  </div>
                </div>

                {/* ADVISORY & WARNING MESSAGES LIST */}
                <div className="bg-[#070b19]/40 border border-white/5 p-6 rounded-2xl shadow-xl border-l-4 border-[#00FF9D]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{lexicon[lang].advisory}</h4>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {lang === 'EN' ? (
                      riskWarnings.length > 0 ? (
                        riskWarnings.map((warn, i) => (
                          <div key={i} className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl flex gap-3 text-red-200 text-xs text-left shadow-lg">
                            <span className="text-lg">🚨</span>
                            <p className="leading-relaxed font-semibold">{warn}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl flex gap-3 text-emerald-200 text-xs text-left shadow-lg">
                          <span className="text-lg">🛡️</span>
                          <p className="leading-relaxed font-semibold">
                            Batch parameters are within limits. All physical sensors confirm optimal containment. Maintain hermetic sealing.
                          </p>
                        </div>
                      )
                    ) : (
                      teluguWarnings.length > 0 ? (
                        teluguWarnings.map((warn, i) => (
                          <div key={i} className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl flex gap-3 text-red-200 text-xs text-left shadow-lg">
                            <span className="text-lg">🚨</span>
                            <p className="leading-relaxed font-semibold">{warn}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl flex gap-3 text-emerald-200 text-xs text-left shadow-lg">
                          <span className="text-lg">🛡️</span>
                          <p className="leading-relaxed font-semibold">
                            ధాన్యంలో తేమ నిల్వకు సురక్షితం. అన్ని పారామితులు సాధారణ స్థితిలో ఉన్నాయి.
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================================
            SCREEN: 5-TIER CRITICAL LOSS POINTS DETAILED GRAPHICS
            ============================================================================ */}
        {currentScreen === 'clp' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-left border-b border-white/5 pb-6">
              <h2 className="text-3xl font-black text-white tracking-tight">{lexicon[lang].clp}</h2>
              <p className="text-xs text-slate-400 mt-1">Definitive agricultural loss vectors mapped directly to IEEE post-harvest security guidelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { 
                  id: "clp-1", 
                  title: "CLP-1: Equilibrium Moisture Boundary", 
                  status: violations.clp1 ? "CRITICAL OUT-OF-BOUNDS" : "NOMINAL RUNNING", 
                  color: violations.clp1 ? "border-red-500/30 bg-red-950/10 text-red-400" : "border-emerald-500/20 bg-emerald-950/5 text-[#00FF9D]",
                  desc: "Evaluates moisture spikes relative to active storage baseline. High moisture leads to biological respiration, starch degradation, and direct mass loss.",
                  value: `${currentEMC.toFixed(1)}% (Threshold Limit: <${activeCrop.safeLimit}%)`
                },
                { 
                  id: "clp-2", 
                  title: "CLP-2: Spatial Gradient Delta", 
                  status: violations.clp2 ? "GRADIENT EXCEPTION DETECTED" : "UNIFORM MATRIX", 
                  color: violations.clp2 ? "border-amber-500/30 bg-amber-950/10 text-amber-400" : "border-emerald-500/20 bg-emerald-950/5 text-[#00FF9D]",
                  desc: "Tracks temperature variances among vertical sensor probe intervals. A difference greater than 4°C indicates localized thermal hotspot formation.",
                  value: `ΔT = ${tempGradient.toFixed(1)}°C (Boundary limit: <4.0°C)`
                },
                { 
                  id: "clp-3", 
                  title: "CLP-3: High Core Temperature", 
                  status: violations.clp3 ? "CRITICAL TEMPERATURE LIMIT" : "THERMAL REGULATION NORMAL", 
                  color: violations.clp3 ? "border-red-500/30 bg-red-950/10 text-red-400" : "border-emerald-500/20 bg-emerald-950/5 text-[#00FF9D]",
                  desc: "Monitors peak core temperatures within the bulk storage container. Rapid temperature spikes alert to localized insect and microbial colony growth.",
                  value: `${Math.max(tempT1, tempT2, tempT3).toFixed(1)}°C (Safety Limit: <${activeCrop.criticalTemp}°C)`
                },
                { 
                  id: "clp-4", 
                  title: "CLP-4: Safe Storable Duration", 
                  status: violations.clp4 ? "CONTAINMENT INTERVAL EXCEEDED" : "SAFE STORAGE DURATION", 
                  color: violations.clp4 ? "border-amber-500/30 bg-amber-950/10 text-amber-400" : "border-emerald-500/20 bg-emerald-950/5 text-[#00FF9D]",
                  desc: "Tracks the elapsed duration of batch storage against the storable lifespan of the specific crop profile to predict weight shrinkage.",
                  value: `${storageDurationDays} Days (Max Safe Span: ${activeCrop.maxStorageDays} Days)`
                },
                { 
                  id: "clp-5", 
                  title: "CLP-5: Fungal Proliferation Model", 
                  status: violations.clp5 ? "MOLD RESPIN EXCESS" : "STABLE BIOLOGICAL INDEX", 
                  color: violations.clp5 ? "border-red-500/30 bg-red-950/10 text-red-400" : "border-emerald-500/20 bg-emerald-950/5 text-[#00FF9D]",
                  desc: "Combines Henderson-Thompson equilibrium calculations with current temperature readings to predict biological activity risks.",
                  value: `BAI Rate: ${bai.toFixed(2)} Index (Risk: ${fungalRiskStatus})`
                }
              ].map((clp) => (
                <div key={clp.id} className="bg-[#070b19]/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-2xl space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">DEPT OF RISK CONTROL</span>
                      <span className={`text-[8px] font-extrabold tracking-wider border px-2 py-0.5 rounded ${clp.color}`}>{clp.status}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{clp.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{clp.desc}</p>
                  </div>
                  <div className="bg-[#020617] rounded-xl border border-white/5 p-3 text-center">
                    <span className="text-[8px] text-slate-500 block font-bold uppercase mb-1">Active Calculated Metric</span>
                    <span className="text-xs font-mono font-bold text-[#00D9FF]">{clp.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================
            SCREEN: HISTORICAL LEDGER INDEX DISCOVERY
            ============================================================================ */}
        {currentScreen === 'history' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
              <div className="text-left">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{lexicon[lang].history}</h2>
                <p className="text-xs text-slate-400 mt-1">Searchable historical matrix storing previous crop safety assessments.</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-[#00FF9D] font-bold border border-emerald-900 bg-emerald-950/20 px-3 py-2 rounded-lg">
                  {historyLog.length} CONSOLE LOGS
                </span>
              </div>
            </div>

            {/* HIGH FIDELITY HISTORICAL STATISTICS GRAPHS BLOCK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* HISTOGRAM 1: CROP VALUE STABILITY HISTOGRAM */}
              <div className="bg-[#070b19]/40 border border-white/5 p-6 rounded-2xl shadow-xl">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">Equilibrium Moisture Variance Histogram</h3>
                
                <div className="h-44 flex items-end justify-between px-2 gap-4 pt-4 border-b border-white/5">
                  {historyLog.map((log) => {
                    const percentageHeight = (log.emc / 20) * 100; // Scaled to max 20% moisture
                    return (
                      <div key={log.id} className="flex-1 bg-[#020617] rounded-t-lg h-full relative group transition-all duration-300 hover:bg-[#070b19]">
                        <div 
                          className={`absolute w-full rounded-t-lg bottom-0 transition-all duration-500 ${
                            log.emc > activeCrop.warningMoisture ? 'bg-red-500' : 'bg-[#00FF9D]'
                          }`}
                          style={{ height: `${percentageHeight}%` }}
                        />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-300 font-bold bg-slate-900 border border-white/5 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {log.emc}%
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono font-bold uppercase mt-3">
                  {historyLog.map((log) => (
                    <span key={log.id}>{log.date.substring(5, 10)}</span>
                  ))}
                </div>
              </div>

              {/* STATISTICAL HISTOGRAM 2: FINANCIAL LOSS COMPARATIVE METRICS */}
              <div className="bg-[#070b19]/40 border border-white/5 p-6 rounded-2xl shadow-xl">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">Calculated Exposure (INR) Variance Histogram</h3>
                
                <div className="h-44 flex items-end justify-between px-2 gap-4 pt-4 border-b border-white/5">
                  {historyLog.map((log) => {
                    // Maximum financial loss cap for scaling is ₹30,000
                    const percentageHeight = (log.lossInr / 30000) * 100;
                    return (
                      <div key={log.id} className="flex-1 bg-[#020617] rounded-t-lg h-full relative group transition-all duration-300 hover:bg-[#070b19]">
                        <div 
                          className="absolute w-full bg-red-400/80 rounded-t-lg bottom-0 transition-all duration-500 shadow-[0_0_15px_rgba(248,113,113,0.15)]"
                          style={{ height: `${Math.max(5, percentageHeight)}%` }} // Minimum height of 5% for zero values
                        />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-red-400 font-bold bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ₹{log.lossInr}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono font-bold uppercase mt-3">
                  {historyLog.map((log) => (
                    <span key={log.id}>{log.date.substring(5, 10)}</span>
                  ))}
                </div>
              </div>

            </div>

            {/* Filter Tools Panel */}
            <div className="bg-[#070b19] p-4 rounded-xl border border-white/5 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Crop Filter:</span>
                <select 
                  value={cropFilter} 
                  onChange={(e) => setCropFilter(e.target.value)}
                  className="bg-[#020617] border border-white/10 text-xs text-slate-300 py-2 px-3 rounded focus:outline-none focus:border-[#00FF9D] transition-all cursor-pointer"
                >
                  <option value="ALL">All Varieties</option>
                  <option value="Paddy (Rice - Fine)">Paddy (Rice)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize (Corn)">Maize (Corn)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Status Filter:</span>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#020617] border border-white/10 text-xs text-slate-300 py-2 px-3 rounded focus:outline-none focus:border-[#00FF9D] transition-all cursor-pointer"
                >
                  <option value="ALL">All Levels</option>
                  <option value="SAFE">Safe Status</option>
                  <option value="WARNING">Warning Status</option>
                  <option value="CRITICAL">Critical Danger</option>
                </select>
              </div>
            </div>

            {/* Structured Table ledger */}
            <div className="bg-[#070b19]/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#070b19] text-slate-400 border-b border-white/5 uppercase tracking-wider text-[9px] font-bold">
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Batch ID</th>
                      <th className="p-4">Crop Type</th>
                      <th className="p-4">Process Mode</th>
                      <th className="p-4">Moisture (EMC)</th>
                      <th className="p-4">Health score</th>
                      <th className="p-4 text-right">Loss Exposure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {historyLog
                      .filter(item => cropFilter === 'ALL' || item.crop === cropFilter)
                      .filter(item => statusFilter === 'ALL' || item.status === statusFilter)
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.01] transition-all duration-150">
                          <td className="p-4 font-mono text-slate-400">{log.date}</td>
                          <td className="p-4 font-bold text-slate-200">{log.batch}</td>
                          <td className="p-4 font-medium text-slate-300">{log.crop}</td>
                          <td className="p-4">
                            <span className="bg-[#020617] border border-white/5 text-slate-400 px-2 py-0.5 rounded font-bold font-mono uppercase text-[9px]">
                              {log.mode}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[#06B6D4] font-bold">{log.emc}%</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 font-bold ${
                              log.status === 'SAFE' ? 'text-[#10B981]' : log.status === 'WARNING' ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                log.status === 'SAFE' ? 'bg-[#10B981]' : log.status === 'WARNING' ? 'bg-amber-400' : 'bg-red-400'
                              }`} />
                              {log.score}/100 ({log.status})
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-red-400">
                            {log.lossInr > 0 ? `₹${log.lossInr.toLocaleString('en-IN')}` : "₹0.00"}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================================
            SCREEN: REPORT COMPILER (CERTIFIABLE LAYOUT FOR PRINT)
            ============================================================================ */}
        {currentScreen === 'reports' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
              <div className="text-left">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{lexicon[lang].reports}</h2>
                <p className="text-xs text-slate-400 mt-1">Compile structured inspection results into an official agricultural certificate document.</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-[#00FF9D] hover:brightness-110 text-[#020617] font-black tracking-wider text-xs px-5 py-3 rounded-xl transition shadow-lg uppercase"
              >
                🖨️ Print / Save PDF
              </button>
            </div>

            {/* Printable Frame Area */}
            <div className="bg-white text-slate-900 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl space-y-8 border-t-8 border-[#00FF9D] text-left printable-card">
              
              {/* Report Letterhead Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div className="text-left">
                  <h1 className="text-xl font-black tracking-widest text-[#020617] uppercase">GRAINGUARDIAN PLATFORM</h1>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">Automated Harvest Diagnostics Certificate</span>
                  <p className="text-xs text-slate-400 mt-1">FPO Registry ID: FPO-AP-991A</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold">{fpoName}</p>
                  <p className="text-slate-500">Location: AP-Zone-3, India</p>
                </div>
              </div>

              {/* Farmer Info Context Rows */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-6">
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Primary Consignee:</p>
                  <p className="font-black text-slate-800">{farmerName}</p>
                  <p className="text-slate-500">Lot Location: Block B-Silo-04</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Inspection Run Date:</p>
                  <p className="font-mono text-slate-800">{new Date().toLocaleDateString()}</p>
                  <p className="text-slate-500">Batch Core ID: {activeBatchId}</p>
                </div>
              </div>

              {/* Computational Diagnostics Core Results */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold uppercase text-slate-500">Consolidated Inspection Metrics</h3>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    currentStatus === 'SAFE' ? 'bg-emerald-100 text-emerald-800' : currentStatus === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>{currentStatus} STATUS</span>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Health Score</span>
                    <span className="text-3xl font-black text-slate-800 font-mono">{currentHealthScore}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Calculated Moisture</span>
                    <span className="text-3xl font-black text-[#00D9FF] font-mono">{currentEMC.toFixed(1)}%</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Fungal Activity Limit</span>
                    <span className="text-3xl font-black text-slate-800">{fungalRiskStatus}</span>
                  </div>
                </div>
              </div>

              {/* Structural Penalty Explanations */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Exception Violations Breakdown</h4>
                <div className="space-y-2">
                  {[
                    { name: "CLP-1: Equilibrium Moisture Threshold Limits", status: violations.clp1 ? "CRITICAL OUT-OF-BOUNDS" : "PASSED (SAFE)" },
                    { name: "CLP-2: Internal Probe Temperature Gradient Deltas", status: violations.clp2 ? "GRADIENT EXCEPTION ALERT" : "PASSED (SAFE)" },
                    { name: "CLP-3: High Core Corelocalized Temperature", status: violations.clp3 ? "CRITICAL SPIKE EXCEPTION" : "PASSED (SAFE)" },
                    { name: "CLP-4: Safe Lifespan Storage Duration Bounds", status: violations.clp4 ? "STALE WARNING WARNING" : "PASSED (SAFE)" },
                    { name: "CLP-5: Microbial Fungal Spore Index Modeling", status: violations.clp5 ? "CRITICAL BIOLOGICAL HIGH" : "PASSED (SAFE)" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 py-1.5">
                      <span className="text-slate-600 font-semibold">{item.name}</span>
                      <span className="font-mono font-bold text-[10px] text-slate-800">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic Impact Statement */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <p className="text-slate-500 uppercase font-bold text-[9px] mb-2">Primary Economic Projections</p>
                <p className="text-slate-700 leading-normal">
                  Our algorithm has projected an initial dry matter structural shrinkage rate of <strong className="text-slate-900">{weightLossKg} kg</strong> based on active batch size parameters ({initialMassKg.toLocaleString()} kg). Calculated loss exposure is valued at <strong className="text-red-600 font-mono">₹{lossInr.toLocaleString('en-IN')}</strong> computed from standard regional Minimum Support Prices (MSP) of <strong className="text-slate-900">₹{activeCrop.msp}/kg</strong>.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-500">
                <div className="text-left">
                  <div className="w-40 border-b border-slate-300 h-8 mb-1" />
                  <p className="font-bold text-slate-700">{farmerName}</p>
                  <p>Certified Producer Representative</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="w-40 border-b border-slate-300 h-8 mb-1" />
                  <p className="font-bold text-slate-700">Automated AI Certificate Signer</p>
                  <p>GrainGuardian AI Core Engine</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================================
            SCREEN: HELP CENTER (FPO TRAINING AND COMPREHENSIVE GUIDES)
            ============================================================================ */}
        {currentScreen === 'help' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-left border-b border-white/5 pb-6">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{lexicon[lang].help}</h2>
              <p className="text-xs text-slate-400 mt-1">Instruction manuals and engineering specifications for operating the hardware probe assembly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Calibration Guide Card */}
              <div className="bg-[#070b19]/40 border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dallas Temperature Probe Calibration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our hardware uses a multi-layer Dallas DS18B20 1-Wire temperature sensor array embedded inside a robust stainless steel insertion lance. Follow these calibration rules once a season:
                </p>
                <div className="space-y-2">
                  <div className="bg-[#020617] p-4 rounded-xl border border-white/5 text-xs">
                    <span className="font-bold text-[#00FF9D] block mb-1">1. Baseline Zero Calibration</span>
                    <p className="text-slate-400 leading-normal">Submerge probe tip sensors into ice water slurry (0.0°C) and ensure baseline readings fluctuate within ±0.2°C limit.</p>
                  </div>
                  <div className="bg-[#020617] p-4 rounded-xl border border-white/5 text-xs">
                    <span className="font-bold text-[#00FF9D] block mb-1">2. Moisture Sensor Calibration</span>
                    <p className="text-slate-400 leading-normal">Keep the inter-granular relative humidity node clear of grain dust. Clean core air inlet vents with low-pressure clean dry air before insertion.</p>
                  </div>
                </div>
              </div>

              {/* Agronomy Support Guides */}
              <div className="bg-[#070b19]/40 border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-extrabold font-mono">South Indian Regional Agronomy Standards</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Grain storage management rules for regional climates:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="bg-[#020617] p-4 rounded-xl border border-white/5 text-left">
                    <strong className="text-white block mb-1">Fine Paddy (Rice) Safe limits</strong>
                    <p className="text-slate-400 leading-relaxed">Fine varieties are susceptible to insect attacks and starch yellowing. Safe moisture ceilings require storage limits strictly below <strong className="text-emerald-400">13.5%</strong> moisture ratios and relative humidity constraints below <strong className="text-emerald-400">65%</strong>.</p>
                  </div>
                  <div className="bg-[#020617] p-4 rounded-xl border border-white/5 text-left">
                    <strong className="text-white block mb-1">Maize Core Storage</strong>
                    <p className="text-slate-400 leading-relaxed">High ambient relative humidity in Andhra Pradesh/Telangana monsoonal periods triggers rapid Aspergillus flavus colonization. Drying core to <strong className="text-emerald-400">13.0%</strong> limits reduces aflatoxin risks to nominal limits.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================================
            SCREEN: APP SYSTEM CONFIGURATIONS
            ============================================================================ */}
        {currentScreen === 'settings' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-left border-b border-white/5 pb-6">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{lexicon[lang].settings}</h2>
              <p className="text-xs text-slate-400 mt-1">Manage target parameters, FPO registries, and profile information.</p>
            </div>

            <div className="max-w-2xl bg-[#070b19]/40 border border-white/5 p-8 rounded-2xl space-y-6 text-left shadow-2xl">
              <h3 className="text-sm font-black uppercase text-slate-400">System Profiles Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Farmer Name</label>
                  <input 
                    type="text" 
                    value={farmerName} 
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 font-medium focus:outline-none focus:border-[#00FF9D] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Producer Organization Name</label>
                  <input 
                    type="text" 
                    value={fpoName} 
                    onChange={(e) => setFpoName(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 font-medium focus:outline-none focus:border-[#00FF9D] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Batch Identifier ID</label>
                  <input 
                    type="text" 
                    value={activeBatchId} 
                    onChange={(e) => setActiveBatchId(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 font-medium focus:outline-none focus:border-[#00FF9D] transition-all"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">{lexicon[lang].massInput}</label>
                  <input 
                    type="number" 
                    value={initialMassKg} 
                    onChange={(e) => setInitialMassKg(parseInt(e.target.value))}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 font-medium focus:outline-none focus:border-[#00FF9D] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">Total Days in Container Storage ({storageDurationDays} Days)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="120" 
                  value={storageDurationDays} 
                  onChange={(e) => setStorageDurationDays(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]" 
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setCurrentScreen('dashboard')} 
                  className="bg-[#10B981] hover:bg-[#34D399] text-[#030712] font-black text-xs px-6 py-3 rounded-xl transition uppercase"
                >
                  Save and return
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}