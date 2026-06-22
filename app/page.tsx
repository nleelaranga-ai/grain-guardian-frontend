"use client";

import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Thermometer,
  Droplets,
  AlertTriangle,
  Coins,
  Scale,
  BrainCircuit,
  Printer,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- 1. SCHEMAS & INTERFACES ---
interface CropConfig {
  id: string;
  nameEn: string;
  nameTe: string;
  safeMoisture: number;
  criticalMoisture: number;
  basePricePerTon: number;
  avatar: string;
}

interface HistoryRecord {
  id: string;
  timestamp: string;
  cropName: string;
  moisture: number;
  temperature: number;
  humidity: number;
  mass: number;
  ghi: number;
  lossInr: number;
  risk: string;
  binMarker: string;
}

interface UIText {
  title: string;
  tagline: string;
  cta: string;
  viewDemo: string;
  heroHead: string;
  heroSub: string;
  readiness: string;
  safe: string;
  unsafe: string;
  ghi: string;
  risk: string;
  loss: string;
  weight: string;
  controls: string;
  actions: string;
  ledger: string;
  certificate: string;
  certSub: string;
  printReport: string;
  aiHead: string;
  aiConsult: string;
  saveBtn: string;
  farmerMode: string;
  expertMode: string;
}

const crops: CropConfig[] = [
  { id: 'paddy', nameEn: 'Paddy (Rice)', nameTe: 'వరి (ప్యాడీ)', safeMoisture: 13.5, criticalMoisture: 16.0, basePricePerTon: 22000, avatar: '🌾' },
  { id: 'wheat', nameEn: 'Wheat', nameTe: 'గోధుమలు', safeMoisture: 13.0, criticalMoisture: 15.0, basePricePerTon: 24000, avatar: '🌾' },
  { id: 'maize', nameEn: 'Maize (Corn)', nameTe: 'మొక్కజొన్న', safeMoisture: 14.0, criticalMoisture: 16.5, basePricePerTon: 20000, avatar: '🌽' },
  { id: 'sorghum', nameEn: 'Sorghum (Jowar)', nameTe: 'జొన్నలు', safeMoisture: 12.5, criticalMoisture: 15.0, basePricePerTon: 28000, avatar: '🌾' },
  { id: 'chickpeas', nameEn: 'Bengal Gram', nameTe: 'శనగలు', safeMoisture: 11.5, criticalMoisture: 14.0, basePricePerTon: 53000, avatar: '🧆' }
];

export default function GrainGuardianStudioEngine() {
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const [expertMode, setExpertMode] = useState<boolean>(false);
  const [selectedCrop, setSelectedCrop] = useState<CropConfig>(crops[0]);
  
  // Real-Time Analytics Input Values
  const [moisture, setMoisture] = useState<number>(14.5);
  const [temperature, setTemperature] = useState<number>(28.0);
  const [humidity, setHumidity] = useState<number>(72.0);
  const [mass, setMass] = useState<number>(50); 
  const [binLabel, setBinLabel] = useState<string>('SILO-01');

  // API Execution States
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Load persistent database snapshot files locally on mount
  useEffect(() => {
    const cached = localStorage.getItem('grain_guardian_audit_logs');
    if (cached) setHistory(JSON.parse(cached));
  }, []);

  // --- SCIENTIFIC MATHEMATICAL COMPUTATIONS MATRIX ---
  const moistureDelta = moisture - selectedCrop.safeMoisture;
  const moisturePenalty = moistureDelta > 0 ? moistureDelta * 7.5 : Math.abs(moistureDelta) * 1.5;
  const tempPenalty = temperature > 27 ? (temperature - 27) * 1.8 : 0;
  const humidityPenalty = humidity > 65 ? (humidity - 65) * 0.4 : 0;
  
  const calculatedGhi = Math.max(12, Math.min(100, Math.round(100 - (moisturePenalty + tempPenalty + humidityPenalty))));

  // Biological Respiration Dry Matter Degradation Rate Calculation
  const dryMatterLossRate = Math.max(0, parseFloat(((moistureDelta > 0 ? moistureDelta * 0.08 : 0) + (temperature > 30 ? (temperature - 30) * 0.015 : 0)).toFixed(3)));
  const totalWeightLossKg = Math.round((mass * 1000) * (dryMatterLossRate / 100));
  const totalFinancialLossInr = Math.round((totalWeightLossKg / 1000) * selectedCrop.basePricePerTon);

  // Psychrometric Vapor Hazard Indexes
  const emcCalculated = parseFloat((0.032 * humidity).toFixed(2)); 
  const dewPointApproximation = parseFloat((temperature - ((100 - humidity) / 5)).toFixed(1));
  const isDewHazard = temperature <= dewPointApproximation + 2;

  let riskLevel = "LOW";
  if (calculatedGhi < 65 || moisture > selectedCrop.criticalMoisture) riskLevel = "CRITICAL";
  else if (calculatedGhi < 82) riskLevel = "HIGH";
  else if (calculatedGhi < 90) riskLevel = "MEDIUM";

  // Action Advisories Standard Rules Matrix Map
  const activeAdvisories: string[] = [];
  if (moisture > selectedCrop.safeMoisture) {
    activeAdvisories.push(lang === 'en' ? "Critical Moisture Ceiling Exceeded: Activate continuous fluid aeration or mechanical batch re-drying immediately." : "తీవ్రమైన తేమ పరిమితి దాటినది: వెంటనే నిరంతర గాలి ప్రసరణ లేదా మెకానికల్ రీ-డ్రైయింగ్ ప్రారంభించండి.");
  }
  if (temperature > 32) {
    activeAdvisories.push(lang === 'en' ? "Thermal Hotspot Warning: Internal pile temperature acting as biological multiplier. Increase fan cubic airflow velocity." : "ఉష్ణోగ్రత హెచ్చరిక: అంతర్గత వేడి పెరిగినది. ఫ్యాన్ వేగాన్ని పెంచి గాలి ప్రసరణను మెరుగుపరచండి.");
  }
  if (humidity > 70) {
    activeAdvisories.push(lang === 'en' ? "Condensation Hazard: Elevated humidity triggers localized interstitial spore germination risk." : "చెమట పట్టే ప్రమాదం: అధిక గాలి తేమ వల్ల సిలీంద్రాలు/బూజు వేగంగా వృద్ధి చెందే అవకాశం ఉంది.");
  }
  if (activeAdvisories.length === 0) {
    activeAdvisories.push(lang === 'en' ? "Atmospheric Equilibrium Optimal: Storage parameters verified compliant. Maintain hermetic preservation seals." : "వాతావరణ సమతుల్యత బాగుంది: నిల్వ పారామితులు సురక్షితంగా ఉన్నాయి. సీలు భద్రతను కొనసాగించండి.");
  }

  // --- HANDLERS PIPELINE ---
  const handleSaveAssessment = () => {
    const record: HistoryRecord = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' | ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      cropName: lang === 'en' ? selectedCrop.nameEn : selectedCrop.nameTe,
      moisture, temperature, humidity, mass,
      ghi: calculatedGhi,
      lossInr: totalFinancialLossInr,
      risk: riskLevel,
      binMarker: binLabel
    };
    const updated = [record, ...history];
    setHistory(updated);
    localStorage.setItem('grain_guardian_audit_logs', JSON.stringify(updated));
  };

  const handleClearLog = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('grain_guardian_audit_logs', JSON.stringify(updated));
  };

  // Live Proxy Consult Passage to Gemini Expert AI Model (FIXED SYNTAX BELOW)
  const consultGeminiAdvisor = async () => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/gemini/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop.nameEn, moisture, temperature, humidity,
          mass_tons: mass, ghi: calculatedGhi, loss_inr: totalFinancialLossInr, risk_status: riskLevel
        })
      });
      if (res.ok) {
        const payload = await res.json();
        setAiResponse(payload);
      } else {
        setAiResponse({ error: true });
      }
    } catch {
      setAiResponse({ error: true });
    } finally {
      setAiLoading(false);
    }
  };

  // --- LOCAL BILINGUAL TRANSLATION DICTIONARIES ---
  const text = {
    en: {
      title: "GRAINGUARDIAN",
      tagline: "Storage Intelligence for Post-Harvest Decisions",
      heroHead: "Know when to store.\nKnow when to act.",
      heroSub: "An enterprise-grade post-harvest decision support system powered by dynamic Grain Health Indexing, psychrometric dew point validation, and predictive economic loss analytics.",
      readiness: "Storage Readiness Evaluation Workspace",
      safe: "STORAGE COMPLIANT / SAFE",
      unsafe: "CRITICAL STORAGE HAZARD ALERT",
      ghi: "Grain Health Index",
      risk: "Biological Hazard Level",
      loss: "Projected Shrinkage Impact",
      weight: "Weight Deficit Loss",
      controls: "Environmental Telemetry Simulation Node",
      actions: "Prescriptive Operational Directives Matrix",
      ledger: "Historical Evaluation Audit Trail Stream",
      certificate: "Structured Analysis Certificate Compiler",
      certSub: "Compiles active parameter states into an official printable verification profile.",
      printReport: "Export Quality Report (PDF)",
      aiHead: "Gemini AI Core Strategy Advisor",
      aiConsult: "Consult Gemini AI Expert",
      saveBtn: "Commit Scan to Local Ledger",
      farmerMode: "Farmer Node",
      expertMode: "Expert Console"
    },
    te: {
      title: "ధాన్యసంరక్షకుడు",
      tagline: "పంట అనంతర నిల్వ నిర్ణయాల కోసం విశ్లేషణ వేదిక",
      heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి.\nఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
      heroSub: "ధాన్య పరిస్థితులను ఖచ్చితంగా అంచనా వేసి, సిలీంద్రాల రిస్క్ మరియు సంభావ్య ఆర్థిక నష్టాలను నివారించే పంట అనంతర నిర్ణయ మద్దతు వ్యవస్థ.",
      readiness: "ధాన్య నిల్వ సంసిద్ధత మూల్యాంకన కేంద్రం",
      safe: "నిల్వకు సురక్షితం / సేఫ్",
      unsafe: "తీవ్రమైన నష్ట హెచ్చరిక / చర్య తీసుకోండి",
      ghi: "ధాన్య ఆరోగ్య సూచిక (GHI)",
      risk: "జీవసంబంధిత ప్రమాద స్థాయి",
      loss: "సాధ్యమయ్యే ఆర్థిక నష్టం",
      weight: "అంచనా వేసిన బరువు నష్టం",
      controls: "పర్యావరణ టెలిమెట్రీ ఆకృతీకరణ",
      actions: "కార్యాచరణ సంరక్షణ సూచనలు",
      ledger: "చారిత్రక మూల్యాంకన ఆడిట్ లాగ్ స్ట్రీమ్",
      certificate: "ధాన్య నాణ్యత ధృవీకరణ పత్రం",
      certSub: "ప్రస్తుత నిల్వ పారామితులను ముద్రించదగిన నివేదిక రూపంలో మారుస్తుంది.",
      printReport: "పూర్తి నివేదికను డౌన్‌లోడ్ చేయండి (PDF)",
      aiHead: "గెమిని AI వ్యూహాత్మక సలహాదారు",
      aiConsult: "గెమిని AI నిపుణుడిని సంప్రదించండి",
      saveBtn: "లాగ్‌ను లోకల్ లెడ్జర్‌కు జోడించు",
      farmerMode: "రైతు మోడ్",
      expertMode: "నిపుణుల మోడ్"
    }
  };

  const UI = lang === 'en' ? text.en : text.te;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 select-none antialiased">
      
      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-[72px] border-b border-white/5 bg-[#020617]/75 backdrop-blur-xl z-50 px-6 md:px-12 flex items-center justify-between neon-magic-nav no-print">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00D9FF] to-[#00FF9D] flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-white font-display">{UI.title}</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight hidden lg:block">{UI.tagline}</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button onClick={() => setLang(lang === 'en' ? 'te' : 'en')} className="text-xs font-bold font-mono text-slate-400 hover:text-white transition">
            {lang === 'en' ? "ENGLISH" : "తెలుగు"}
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="bg-slate-900 border border-white/10 p-0.5 rounded-xl flex items-center">
            <button onClick={() => setExpertMode(false)} className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${!expertMode ? 'bg-[#00FF9D] text-slate-950 shadow-md' : 'text-slate-400'}`}>
              {UI.farmerMode.split(" ")[0]}
            </button>
            <button onClick={() => setExpertMode(true)} className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${expertMode ? 'bg-[#00D9FF] text-slate-950 shadow-md' : 'text-slate-400'}`}>
              {UI.expertMode.split(" ")[0]}
            </button>
          </div>
        </div>
      </nav>

      {/* CORE CONTROL CONSOLE CHASSIS */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-20 space-y-12">
        
        {/* HERO HEADER */}
        <header className="grid lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-10 no-print">
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="inline-block text-[10px] font-bold font-mono tracking-widest text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/20 px-2.5 py-1 rounded-md uppercase">
              AI-Native Operational Core Suite
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[0.95] whitespace-pre-line">
              {UI.heroHead}
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              {UI.heroSub}
            </p>
          </div>

          {/* RIGHT SIDE DATA SANDBOX PANEL CARD */}
          <div className="lg:col-span-5">
            <div className="studio-panel p-5 bg-slate-900/40 relative overflow-hidden group">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Live Context Node</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">{lang === 'en' ? selectedCrop.nameEn : selectedCrop.nameTe} Target</h3>
                </div>
                <div className="flex items-center space-x-1.5 font-mono text-[9px] bg-[#00FF9D]/10 text-[#00FF9D] px-2 py-0.5 rounded font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
                  <span>MATRIX CONNECTED</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-[#020617]/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 block">INDEX GHI</span>
                  <p className="text-2xl font-black text-[#00FF9D] mt-0.5">{calculatedGhi}</p>
                </div>
                <div className="bg-[#020617]/50 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-500 block">RISK CLASS</span>
                  <p className={`text-xl font-black mt-1 ${riskLevel === 'CRITICAL' ? 'text-[#FF5A5F]' : riskLevel === 'HIGH' ? 'text-[#FACC15]' : 'text-[#00D9FF]'}`}>
                    {riskLevel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* METRICS QUAD GRID */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="studio-panel p-5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span>{UI.ghi}</span>
            </span>
            <div className="text-4xl font-black text-[#00FF9D] tracking-tight mt-3 font-display">{calculatedGhi}</div>
          </div>
          <div className="studio-panel p-5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>{UI.risk}</span>
            </span>
            <div className="text-3xl font-black text-[#00D9FF] tracking-tight mt-4 font-display">{riskLevel}</div>
          </div>
          <div className="studio-panel p-5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Coins className="w-3.5 h-3.5 text-[#FF5A5F]" />
              <span>{UI.loss}</span>
            </span>
            <div className="text-3xl font-black text-[#FF5A5F] tracking-tight mt-4 font-display">₹{totalFinancialLossInr.toLocaleString("en-IN")}</div>
          </div>
          <div className="studio-panel p-5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>{UI.weight}</span>
            </span>
            <div className="text-3xl font-black text-[#FACC15] tracking-tight mt-4 font-display font-mono">{totalWeightLossKg} kg</div>
          </div>
        </section>

        {/* SPLIT EXPERT WORKSPACE SECTION */}
        <section className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT SLIDER SETTING INTERFACE */}
          <div className="lg:col-span-7 flex input-chassis no-print">
            <div className="studio-panel p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-200 border-b border-white/5 pb-2 uppercase tracking-wide flex items-center space-x-2">
                <span>⚙️</span> <span>{UI.controls}</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Active Commodity Profile</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {crops.map((crop) => (
                      <button
                        key={crop.id}
                        onClick={() => setSelectedCrop(crop)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1.5 ${
                          selectedCrop.id === crop.id ? 'bg-[#00FF9D]/10 border-[#00FF9D] text-[#00FF9D]' : 'bg-[#0f172a]/40 border-white/5 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-lg">{crop.avatar}</span>
                        <span className="text-[10px] tracking-tight truncate max-w-full">{lang === 'en' ? crop.nameEn : crop.nameTe}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Moisture Content</span>
                      <span className="font-mono text-[#00D9FF] font-bold">{moisture}%</span>
                    </div>
                    <input type="range" min="8" max="24" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>Safe: {selectedCrop.safeMoisture}%</span>
                      <span>Critical: {selectedCrop.criticalMoisture}%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Bulk Temperature</span>
                      <span className="font-mono text-[#00FF9D] font-bold">{temperature}°C</span>
                    </div>
                    <input type="range" min="5" max="45" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Relative Internal Air Humidity</span>
                      <span className="font-mono text-[#FACC15] font-bold">{humidity}%</span>
                    </div>
                    <input type="range" min="20" max="95" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5 sm:col-span-2 grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bin / Silo Lot Identifier</label>
                      <input type="text" value={binLabel} onChange={(e) => setBinLabel(e.target.value)} className="w-full mt-1 bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white tracking-widest font-mono focus:border-[#00D9FF] outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stored Bulk Mass (Metric Tons)</label>
                      <input type="number" min="1" max="1000" value={mass} onChange={(e) => setMass(Math.max(1, parseInt(e.target.value) || 0))} className="w-full mt-1 bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-white font-mono focus:border-[#00D9FF] outline-none" />
                    </div>
                  </div>
                </div>

                <button onClick={handleSaveAssessment} className="w-full mt-2 bg-slate-900 border border-white/10 hover:border-[#00FF9D]/30 text-xs font-bold font-mono py-3 rounded-xl tracking-wider hover:bg-slate-950 transition">
                  📥 {UI.saveBtn}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE LIVE OUTPUT PREVIEW PANEL */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="studio-panel p-6 md:p-8 flex-1 bg-gradient-to-b from-slate-900/40 to-slate-950/40 border border-white/10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase font-mono block">{UI.readiness}</span>
                <h2 className={`text-2xl font-black mt-3 font-display tracking-tight ${calculatedGhi > 80 ? 'text-[#00FF9D]' : 'text-[#FF5A5F]'}`}>
                  {calculatedGhi > 80 ? UI.safe : UI.unsafe}
                </h2>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-medium font-mono">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-500">{UI.ghi}</span>
                  <span className="text-[#00FF9D] font-bold">{calculatedGhi} / 100</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-500">Commodity Market Baseline</span>
                  <span className="text-slate-300">₹{(selectedCrop.basePricePerTon).toLocaleString()} / Ton</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-500">Respiration Decay Loss Rate</span>
                  <span className="text-[#FF5A5F] font-bold">{dryMatterLossRate}% / 24h</span>
                </div>

                {/* OPERATIONAL MATRICES FOR EXPERT OPERATORS */}
                {expertMode && (
                  <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 grid grid-cols-2 gap-2 font-sans">
                    <div className="bg-[#020617]/70 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] font-mono block uppercase text-slate-500">Vapor Tension (EMC)</span>
                      <span className="text-[#00D9FF] font-bold font-mono">{emcCalculated} kPa</span>
                    </div>
                    <div className="bg-[#020617]/70 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[9px] font-mono block uppercase text-slate-500">Thermal Dew Point</span>
                      <span className={`font-bold font-mono ${isDewHazard ? 'text-[#FF5A5F]' : 'text-[#00FF9D]'}`}>
                        {dewPointApproximation}°C {isDewHazard ? '⚠️ RISK' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RECOVERY RULES MATRIX */}
        <section className="space-y-4">
          <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 flex items-center space-x-2">
            <span>🛡️</span> <span>{UI.actions}</span>
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {activeAdvisories.map((advice, i) => (
              <div key={i} className="studio-panel p-4 border-l-2 border-l-[#00D9FF] bg-slate-900/40">
                <p className="text-xs font-medium leading-relaxed text-slate-300">{advice}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI ADVISOR PANELS WITH CORRECTED SYNTAX LOOP */}
        <section className="studio-panel p-5 bg-[#090d1a]/80 border border-white/10 no-print">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-[#00D9FF]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white font-mono">{UI.aiHead}</h3>
            </div>
            <button
              onClick={consultGeminiAdvisor}
              disabled={aiLoading}
              className="bg-white text-slate-950 hover:bg-slate-200 text-xs font-bold font-mono px-4 py-2 rounded-lg transition disabled:opacity-40"
            >
              {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin inline mr-1" /> : '✨'} {UI.aiConsult}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {aiResponse && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs bg-slate-950/80 p-4 rounded-xl border border-white/5 space-y-3 font-mono leading-relaxed">
                {aiResponse.error ? (
                  <p className="text-[#FF5A5F]">⚠️ Backend API Offline Proxy Error. Verification parameters matched fallback rule model above.</p>
                ) : (
                  <div className="space-y-2 text-slate-300">
                    <p><strong className="text-white">Assessment summary:</strong> {aiResponse.summary_assessment || aiResponse.summary}</p>
                    <p><strong className="text-[#FF5A5F]">Microbial Threat Vector:</strong> {aiResponse.microbial_threat_assessment || aiResponse.threat}</p>
                    <p><strong className="text-[#FACC15]">Strategic Directives:</strong> {aiResponse.exact_strategic_directives || aiResponse.directives}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* RECENT HISTORICAL AUDIT LEDGER */}
        <section className="space-y-4 no-print">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">{UI.ledger}</span>
          <div className="grid sm:grid-cols-3 gap-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="studio-panel p-4 bg-slate-950/40 relative group border-white/5">
                  <button onClick={() => handleClearLog(item.id)} className="absolute top-3 right-3 text-slate-600 hover:text-[#FF5A5F] opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>{item.timestamp}</span>
                    <span className="text-[#00D9FF] font-bold">{item.binMarker}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-2 flex items-center space-x-1.5">
                    <span>{item.cropName}</span>
                    <span className="text-xs font-mono font-normal text-slate-400">({item.mass} Tons)</span>
                  </h4>
                  <div className="mt-3 flex justify-between text-xs font-mono border-t border-white/5 pt-2">
                    <div>GHI: <span className="text-[#00FF9D] font-bold">{item.ghi}</span></div>
                    <div className="text-slate-400">₹{item.lossInr.toLocaleString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="studio-panel p-4 col-span-3 text-center text-xs text-slate-500 font-mono">
                No telemetry snapshots saved inside local storage ledger index.
              </div>
            )}
          </div>
        </section>

        {/* REPORT PRINTER */}
        <section className="studio-panel p-6 bg-slate-900/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 page-break-inside-avoid">
          <div className="text-left">
            <h4 className="font-bold text-sm text-white font-display tracking-wide">{UI.certificate}</h4>
            <p className="text-xs text-slate-400 mt-1">{UI.certSub}</p>
          </div>
          <button onClick={() => window.print()} className="w-full sm:w-auto bg-white text-slate-950 font-bold text-xs font-mono tracking-wider px-6 py-3 rounded-lg hover:bg-slate-100 transition uppercase shadow-xl flex items-center justify-center space-x-2">
            <Printer className="w-4 h-4 text-slate-950" />
            <span>{UI.printReport}</span>
          </button>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 bg-[#01030b] text-center text-xs text-slate-500 no-print">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono">
          <span>© 2026 GRAINGUARDIAN ANALYTICS SUITE. LLC.</span>
          <span className="text-[10px] text-slate-600">IEEE DATA METRICS PROTOCOL SUITE • PRIVACY COMPLIANT</span>
        </div>
      </footer>

    </div>
  );
}
