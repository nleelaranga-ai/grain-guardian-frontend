"use client";

import React, { useState, useEffect } from "react";

// --- 1. TYPESCRIPT SCHEMAS & INTERFACES ---
interface UIText {
  title: string;
  tagline: string;
  cta: string;
  viewDemo: string;
  heroHead: string;
  heroSub: string;
  readinessLabel: string;
  safe: string;
  unsafe: string;
  ghiLabel: string;
  riskLabel: string;
  financialLabel: string;
  actionsLabel: string;
  controlsLabel: string;
  ledgerLabel: string;
  downloadCta: string;
  farmerMode: string;
  expertMode: string;
  weightLoss: string;
}

interface AnalyticsData {
  ghi: number;
  lossInr: number;
  lossKg: number;
  riskLevel: string;
  advisories: string[];
  violations: { moisture: boolean; temp: boolean; humidity: boolean };
}

// --- 2. BILINGUAL DICTIONARY SYSTEM ---
const lexicons: { en: UIText; te: UIText } = {
  en: {
    title: "GRAINGUARDIAN",
    tagline: "Storage Intelligence for Post-Harvest Decisions",
    cta: "Execute Analysis",
    viewDemo: "Load Reference Model",
    heroHead: "Know when to store.\nKnow when to act.",
    heroSub: "An AI-native post-harvest decision support system optimizing grain health indexing, relative deterioration risk mapping, and volumetric economic loss prediction.",
    readinessLabel: "Live Optimization Diagnostics",
    safe: "STORAGE CONDITIONS COMPLIANT",
    unsafe: "CRITICAL STORAGE THREAT DETECTED",
    ghiLabel: "Grain Health Index",
    riskLabel: "Calculated Biological Risk",
    financialLabel: "Potential Revenue Loss",
    weightLoss: "Estimated mass shrinkage loss:",
    controlsLabel: "Environmental Telemetry Sandbox Node",
    actionsLabel: "Prescriptive Operational Directives",
    ledgerLabel: "Historical Evaluation Audit Stream",
    downloadCta: "Compile Official Quality Certificate (PDF)",
    farmerMode: "Farmer Workspace",
    expertMode: "Expert Matrix"
  },
  te: {
    title: "ధాన్యసంరక్షకుడు",
    tagline: "పంట అనంతర నిల్వ నిర్ణయాల విశ్లేషణ వేదిక",
    cta: "పరిశీలన ప్రారంభించండి",
    viewDemo: "రిఫరెన్స్ మోడల్",
    heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి.\nఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
    heroSub: "ధాన్య పరిస్థితులను అంచనా వేసి, నిల్వ ప్రమాదాలను అర్థం చేసుకొని, సంభావ్య ఆర్థిక నష్టాలను నివారించి పంటను భద్రపరచండి.",
    readinessLabel: "ప్రత్యక్ష విశ్లేషణ ప్యానెల్",
    safe: "నిల్వకు సురక్షితం",
    unsafe: "చర్య తీసుకోవలసి ఉంది / ఆరబెట్టండి",
    ghiLabel: "ధాన్య ఆరోగ్య సూచిక (GHI)",
    riskLabel: "లెక్కించబడిన నిల్వ ప్రమాదం",
    financialLabel: "సాధ్యమయ్యే ఆర్థిక నష్టం",
    weightLoss: "అంచనా వేసిన బరువు నష్టం:",
    controlsLabel: "పర్యావరణ టెలిమెట్రీ ఆకృతీకరణ",
    actionsLabel: "సిఫార్సు చేయబడిన నివారణ చర్యలు",
    ledgerLabel: "చారిత్రక మూల్యాంకన రిజిస్టర్",
    downloadCta: "పూర్తి వివేదిక పత్రం డౌన్‌లోడ్ చేయండి",
    farmerMode: "రైతు మోడ్",
    expertMode: "నిపుణుల మోడ్"
  }
};

// --- 3. MAIN DASHBOARD ORCHESTRATOR ---
export default function GrainGuardianStudioSuite() {
  const [isTelugu, setIsTelugu] = useState<boolean>(false);
  const [isExpertMode, setIsExpertMode] = useState<boolean>(false);

  // Core Physical Parameter Nodes
  const [cropType, setCropType] = useState<string>("Paddy (Rice)");
  const [moisture, setMoisture] = useState<number>(14.0);
  const [temperature, setTemperature] = useState<number>(32.0);
  const [humidity, setHumidity] = useState<number>(65.0);
  const [mass, setMass] = useState<number>(15000);

  // Compute Aggregator Storage
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    ghi: 92,
    lossInr: 12540,
    lossKg: 240,
    riskLevel: "LOW",
    advisories: ["All parameters comply with baseline standards. Maintain sealed silo monitoring."] as string[],
    violations: { moisture: false, temp: false, humidity: false }
  });

  const UI = isTelugu ? lexicons.te : lexicons.en;

  // Sync state changes instantly through FastAPI validation pipeline
  useEffect(() => {
    async function executeAnalysisPass() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v3/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop_type: cropType,
            moisture: moisture,
            temperature: temperature,
            humidity: humidity,
            stored_mass_kg: mass
          })
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics({
            ghi: data.grain_health_index,
            lossInr: data.estimated_financial_loss_inr,
            lossKg: data.projected_weight_loss_kg,
            riskLevel: data.fungal_risk_status,
            advisories: data.action_advisory,
            violations: {
              moisture: data.clp_matrix.clp_moisture_violation,
              temp: data.clp_matrix.clp_temp_violation,
              humidity: data.clp_matrix.clp_humidity_violation
            }
          });
        }
      } catch (err) {
        console.error("FastAPI backend processing loop unavailable:", err);
      }
    }
    executeAnalysisPass();
  }, [cropType, moisture, temperature, humidity, mass]);

  return (
    <div className="min-h-screen bg-slate-950 text-white select-none">
      <Navbar isTelugu={isTelugu} setIsTelugu={setIsTelugu} isExpertMode={isExpertMode} setIsExpertMode={setIsExpertMode} UI={UI} />
      
      <main className="studio-container pt-24 pb-16 space-y-12 md:space-y-16 animate-studio-fade">
        <Hero cropType={cropType} analytics={analytics} UI={UI} />
        <MetricsGrid analytics={analytics} UI={UI} />
        
        {/* SPLIT-SCREEN ASSESSMENT WORKSPACE */}
        <section id="workspace" className="grid lg:grid-cols-12 gap-6 items-stretch border-t border-white/5 pt-12">
          <div className="lg:col-span-7 flex">
            <AssessmentPanel 
              cropType={cropType} setCropType={setCropType}
              moisture={moisture} setMoisture={setMoisture}
              temperature={temperature} setTemperature={setTemperature}
              humidity={humidity} setHumidity={setHumidity}
              mass={mass} setMass={setMass}
              isExpertMode={isExpertMode} UI={UI}
            />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <LivePreview analytics={analytics} isExpertMode={isExpertMode} UI={UI} />
          </div>
        </section>

        <AIAdvisor analytics={analytics} UI={UI} />
        <HistoryPanel cropType={cropType} analytics={analytics} UI={UI} />
        
        {/* PDF REPORT SECTION */}
        <section className="studio-panel p-6 bg-slate-900/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
          <div className="text-left">
            <h4 className="font-bold text-sm text-white tracking-wide">Quality Certification Log Document Compiler</h4>
            <p className="text-xs text-slate-400 mt-1">Locks variables data configurations into an official print-ready analytics layout.</p>
          </div>
          <button onClick={() => window.print()} className="w-full sm:w-auto bg-white text-slate-950 font-bold text-xs font-mono tracking-wider px-6 py-3 rounded-lg hover:bg-slate-200 transition uppercase shadow-xl">
            {UI.downloadCta}
          </button>
        </section>
      </main>

      <Footer UI={UI} />
    </div>
  );
}

// --- 4. SEPARATE ISOLATED COMPONENT BLOCKS ---

function Navbar({ isTelugu, setIsTelugu, isExpertMode, setIsExpertMode, UI }: { isTelugu: boolean; setIsTelugu: (v: boolean) => void; isExpertMode: boolean; setIsExpertMode: (v: boolean) => void; UI: UIText }) {
  return (
    <nav className="fixed top-0 left-0 w-full h-[72px] border-b border-white/5 bg-slate-950/60 backdrop-blur-xl z-50 px-6 md:px-12 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-black tracking-widest text-emerald-400">{UI.title}</span>
        <span className="text-[10px] text-slate-400 font-medium tracking-tight hidden md:block">{UI.tagline}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setIsTelugu(!isTelugu)} className="text-xs font-bold font-mono text-slate-400 hover:text-white transition">
          {isTelugu ? "ENGLISH" : "తెలుగు"}
        </button>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="bg-slate-900 border border-white/10 p-0.5 rounded-lg flex items-center">
          <button onClick={() => setIsExpertMode(false)} className={`text-[11px] font-bold px-3 py-1 rounded-md transition ${!isExpertMode ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
            {UI.farmerMode.split(" ")[0]}
          </button>
          <button onClick={() => setIsExpertMode(true)} className={`text-[11px] font-bold px-3 py-1 rounded-md transition ${isExpertMode ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
            {UI.expertMode.split(" ")[0]}
          </button>
        </div>
        <a href="#workspace" className="hidden sm:inline-block bg-white text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-100 transition shadow-lg">
          {UI.cta.split(" ")[0]}
        </a>
      </div>
    </nav>
  );
}

function Hero({ cropType, analytics, UI }: { cropType: string; analytics: AnalyticsData; UI: UIText }) {
  return (
    <section className="grid lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-10">
      <div className="lg:col-span-7 space-y-4 text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] whitespace-pre-line">
          {UI.heroHead}
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
          {UI.heroSub}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <a href="#workspace" className="bg-cyan-400 text-slate-950 text-xs font-bold px-5 py-3 rounded-lg hover:bg-cyan-300 transition tracking-wide font-mono shadow-md">
            Launch Analysis Node
          </a>
          <button className="bg-slate-900 border border-white/5 text-slate-300 text-xs font-bold px-5 py-3 rounded-lg hover:bg-slate-800 transition">
            {UI.viewDemo}
          </button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="studio-panel p-5 bg-slate-900/50 border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
            <div>
              <span className="studio-label text-[9px]">Floating Preview Sandbox</span>
              <h3 className="text-xs font-bold text-white mt-0.5">{cropType} Active Profile</h3>
            </div>
            <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-bold tracking-widest">LIVE SYNC</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
              <span className="studio-label text-[9px]">GHI Level</span>
              <p className="text-2xl font-black text-safe-green mt-0.5">{analytics.ghi}</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
              <span className="studio-label text-[9px]">Risk Tier</span>
              <p className="text-2xl font-black text-cyan-400 mt-0.5">{analytics.riskLevel}</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 col-span-2">
              <span className="studio-label text-[9px]">Financial Loss Risk</span>
              <p className="text-xl font-black text-critical-red mt-0.5">₹{analytics.lossInr.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsGrid({ analytics, UI }: { analytics: AnalyticsData; UI: UIText }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="studio-panel p-5">
        <span className="studio-label text-[10px]">{UI.ghiLabel}</span>
        <div className="text-safe-green mt-2 font-black text-3xl md:text-4xl">{analytics.ghi}</div>
      </div>
      <div className="studio-panel p-5">
        <span className="studio-label text-[10px]">{UI.riskLabel}</span>
        <div className="text-cyan-400 mt-2 font-black text-3xl md:text-4xl">{analytics.riskLevel}</div>
      </div>
      <div className="studio-panel p-5">
        <span className="studio-label text-[10px]">{UI.financialLabel}</span>
        <div className="text-critical-red mt-2 font-black text-3xl md:text-4xl">₹{analytics.lossInr.toLocaleString("en-IN")}</div>
      </div>
      <div className="studio-panel p-5">
        <span className="studio-label text-[10px]">Directives Logged</span>
        <div className="text-warning-yellow mt-2 font-black text-3xl md:text-4xl">{analytics.advisories.length}</div>
      </div>
    </section>
  );
}

function AssessmentPanel({ cropType, setCropType, moisture, setMoisture, temperature, setTemperature, humidity, setHumidity, mass, setMass, isExpertMode, UI }: any) {
  return (
    <div className="studio-panel p-6 md:p-8 space-y-5 flex-1 flex flex-col justify-between">
      <h3 className="text-xs font-bold text-slate-200 border-b border-white/5 pb-2 uppercase tracking-wide">
        ⚙️ {UI.controlsLabel}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="studio-label text-[10px]">Active Managed Commodity</label>
          <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg p-3 text-xs text-white focus:border-cyan-400 outline-none transition">
            <option value="Paddy (Rice)">Paddy (Rice)</option>
            <option value="Wheat">Wheat</option>
            <option value="Maize">Maize</option>
          </select>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs"><span className="text-slate-400">Moisture Content</span><span className="font-mono text-safe-green font-bold">{moisture}%</span></div>
          <input type="range" min="5" max="35" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs"><span className="text-slate-400">Thermal Vector</span><span className="font-mono text-cyan-400 font-bold">{temperature}°C</span></div>
          <input type="range" min="10" max="65" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs"><span className="text-slate-400">Relative Humidity</span><span className="font-mono text-warning-yellow font-bold">{humidity}%</span></div>
          <input type="range" min="20" max="95" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} />
        </div>
        {isExpertMode && (
          <div className="space-y-1 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs"><span className="text-slate-400">Total Bulk Mass</span><span className="font-mono text-slate-300 font-bold">{mass.toLocaleString()} kg</span></div>
            <input type="range" min="1000" max="50000" step="500" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
          </div>
        )}
      </div>
    </div>
  );
}

function LivePreview({ analytics, isExpertMode, UI }: { analytics: AnalyticsData; isExpertMode: boolean; UI: UIText }) {
  return (
    <div className="studio-panel p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 bg-slate-900/40 border-cyan-500/10">
      <div>
        <span className="studio-label text-slate-400">{UI.readinessLabel}</span>
        <h2 className={`text-2xl font-black mt-2 tracking-tight uppercase ${analytics.ghi > 80 ? 'text-safe-green' : 'text-critical-red'}`}>
          {analytics.ghi > 80 ? UI.safe : UI.unsafe}
        </h2>
      </div>
      <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-medium font-mono">
        <div className="flex justify-between py-1.5 border-b border-white/5">
          <span className="text-slate-500">{UI.ghiLabel}</span>
          <span className="text-safe-green font-bold">{analytics.ghi} / 100</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-white/5">
          <span className="text-slate-500">{UI.riskLabel}</span>
          <span className="text-cyan-400 font-bold">{analytics.riskLevel} LEVEL</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-slate-500">Revenue Shrinkage Assessment</span>
          <span className="text-critical-red font-bold">₹{analytics.lossInr.toLocaleString("en-IN")}</span>
        </div>
        {isExpertMode && (
          <div className="flex justify-between py-1.5 border-t border-white/5 pt-2 text-slate-400 font-sans">
            <span>{UI.weightLoss}</span>
            <span className="text-slate-200 font-bold font-mono">{analytics.lossKg} kg</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AIAdvisor({ analytics, UI }: { analytics: AnalyticsData; UI: UIText }) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-bold text-white tracking-tight uppercase">✨ {UI.actionsLabel}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {analytics.advisories.map((advice, i) => (
          <div key={i} className="studio-panel p-4 border-l-2 border-l-cyan-400 bg-slate-900/40">
            <h4 className="font-bold text-xs text-slate-200 tracking-wide">{advice.split(":")[0]}</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{advice.split(":")[1] || advice}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HistoryPanel({ cropType, analytics, UI }: { cropType: string; analytics: AnalyticsData; UI: UIText }) {
  return (
    <section className="space-y-4">
      <span className="studio-label">{UI.ledgerLabel}</span>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="studio-panel p-4 bg-slate-900/20 border-white/5">
          <span className="text-[10px] font-bold font-mono text-cyan-400 block">June 21 — Realtime Scan Log</span>
          <p className="text-xs font-medium text-slate-300 mt-1">Batch constraints successfully mapped to {cropType} thresholds matrix.</p>
        </div>
        <div className="studio-panel p-4 bg-slate-900/20 border-white/5">
          <span className="text-[10px] font-bold font-mono text-slate-500 block">June 10 — Aeration Forced Sequence</span>
          <p className="text-xs font-medium text-slate-500 mt-1">Silo baseline dynamic drying parameter logs locked to storage register nodes.</p>
        </div>
      </div>
    </section>
  );
}

function Footer({ UI }: { UI: UIText }) {
  return (
    <footer className="border-t border-white/5 mt-20 py-8 text-center text-xs text-slate-500 font-mono">
      <div className="studio-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 {UI.title} PLATFORMS LLC. INC.</span>
        <span className="text-slate-600">IEEE DATA PROTOCOL V3.0 WORKSPACE ENGINE</span>
      </div>
    </footer>
  );
}
