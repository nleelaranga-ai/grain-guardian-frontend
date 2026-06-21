"use client";

import React, { useState, useEffect } from "react";

// Explicit interface template mapping ensures zero build pipeline compilation faults
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

export default function AnalyticsDrivenSuite() {
  const [isTelugu, setIsTelugu] = useState<boolean>(false);
  const [isExpertMode, setIsExpertMode] = useState<boolean>(false);

  // Core Simulation Parameter Matrices
  const [cropType, setCropType] = useState<string>("Paddy (Rice)");
  const [moisture, setMoisture] = useState<number>(14.0);
  const [temperature, setTemperature] = useState<number>(34.0);
  const [humidity, setHumidity] = useState<number>(65.0);
  const [mass, setMass] = useState<number>(12000);

  // Pipeline Metrics Aggregator
  const [analytics, setAnalytics] = useState({
    ghi: 92,
    lossInr: 12540,
    lossKg: 240,
    riskLevel: "LOW",
    advisories: [] as string[],
    violations: { moisture: false, temp: false, humidity: false }
  });

  const lexicons: { en: UIText; te: UIText } = {
    en: {
      title: "GRAINGUARDIAN",
      tagline: "Storage Intelligence for Post-Harvest Decisions",
      cta: "Start Assessment",
      viewDemo: "View Demo",
      heroHead: "Know when to store.\nKnow when to act.",
      heroSub: "Assess grain conditions, understand storage risks, predict potential losses, and receive clear recommendations.",
      readinessLabel: "Storage Readiness Evaluation",
      safe: "Safe to Store",
      unsafe: "Continue Drying",
      ghiLabel: "Grain Health Score",
      riskLabel: "Storage Risk Level",
      financialLabel: "Potential Financial Impact",
      weightLoss: "Estimated weight loss:",
      controlsLabel: "Storage Parameters Configuration",
      actionsLabel: "Prescriptive Recommended Actions",
      ledgerLabel: "Historical Assessment Ledger",
      downloadCta: "Export Complete Assessment Report",
      farmerMode: "Farmer",
      expertMode: "Expert"
    },
    te: {
      title: "ధాన్యసంరక్షకుడు",
      tagline: "పంట అనంతర నిల్వ నిర్ణయాల కోసం తెలివైన వేదిక",
      cta: "అంచనాను ప్రారంభించండి",
      viewDemo: "డెమో చూడండి",
      heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి.\nఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
      heroSub: "ధాన్య పరిస్థితులను అంచనా వేసి, నిల్వ ప్రమాదాలను అర్థం చేసుకొని, సంభావ్య నష్టాలను అంచనా వేసి స్పష్టమైన సూచనలు పొందండి.",
      readinessLabel: "ధాన్య నిల్వ సంసిద్ధత మూల్యాంకనం",
      safe: "నిల్వకు సురక్షితం",
      unsafe: "ఆరబెట్టడం కొనసాగించండి",
      ghiLabel: "ధాన్య ఆరోగ్య సూచిక",
      riskLabel: "నిల్వ ప్రమాద స్థాయి",
      financialLabel: "సాధ్యమయ్యే ఆర్థిక నష్టం",
      weightLoss: "అంచనా వేసిన బరువు నష్టం:",
      controlsLabel: "నిల్వ పారామితుల ఆకృతీకరణ",
      actionsLabel: "సిఫార్సు చేయబడిన నివారణ చర్యలు",
      ledgerLabel: "చారిత్రక మూల్యాంకన రిజిస్టర్",
      downloadCta: "పూర్తి మూల్యాంకన నివేదికను డౌన్‌లోడ్ చేయండి",
      farmerMode: "రైతు",
      expertMode: "నిపుణుడు"
    }
  };

  const UI = isTelugu ? lexicons.te : lexicons.en;

  // Realtime Analysis Pass to Live FastAPI Backend Configuration
  useEffect(() => {
    async function triggerComputePass() {
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
          const payload = await res.json();
          setAnalytics({
            ghi: payload.grain_health_index,
            lossInr: payload.estimated_financial_loss_inr,
            lossKg: payload.projected_weight_loss_kg,
            riskLevel: payload.fungal_risk_status,
            advisories: payload.action_advisory,
            violations: {
              moisture: payload.clp_matrix.clp_moisture_violation,
              temp: payload.clp_matrix.clp_temp_violation,
              humidity: payload.clp_matrix.clp_humidity_violation
            }
          });
        }
      } catch (err) {
        console.error("FastAPI backend connection error:", err);
      }
    }
    triggerComputePass();
  }, [cropType, moisture, temperature, humidity, mass]);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-400 selection:text-slate-950">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-16 md:h-[72px] border-b border-white/5 bg-slate-950/70 backdrop-blur-md z-50 px-4 md:px-12 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs md:text-sm font-black tracking-wider text-white">{UI.title}</span>
          <span className="text-[10px] text-slate-500 font-medium tracking-tight hidden lg:block">{UI.tagline}</span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => setIsTelugu(!isTelugu)} className="text-xs font-bold font-mono text-slate-400 hover:text-white transition">
            {isTelugu ? "ENGLISH" : "తెలుగు"}
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="bg-slate-900/80 p-0.5 rounded-lg border border-white/5 flex gap-1">
            <button onClick={() => setIsExpertMode(false)} className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition ${!isExpertMode ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'}`}>
              {UI.farmerMode}
            </button>
            <button onClick={() => setIsExpertMode(true)} className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition ${isExpertMode ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
              {UI.expertMode}
            </button>
          </div>
          <a href="#assess" className="hidden sm:inline-block bg-white text-slate-950 text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-200 transition">
            {UI.cta}
          </a>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pt-24 md:pt-32 space-y-12 md:space-y-20 pb-20">
        
        {/* HERO SECTION: DATA-RICH 2-COLUMN GRID */}
        <section className="grid lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-12 md:pb-20">
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[0.95] whitespace-pre-line">
              {UI.heroHead}
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
              {UI.heroSub}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#assess" className="bg-emerald-400 text-slate-950 text-xs md:text-sm font-bold px-6 md:px-8 py-3.5 rounded-xl hover:scale-102 transition duration-200">
                {UI.cta}
              </a>
              <button className="bg-slate-900 border border-white/10 text-slate-200 text-xs md:text-sm font-bold px-6 md:px-8 py-3.5 rounded-xl hover:bg-slate-800 transition">
                {UI.viewDemo}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: LIVE PRODUCT PREVIEW DASHBOARD CARD */}
          <div className="lg:col-span-5">
            <div className="analytics-card p-6 md:p-8 border border-white/10 bg-slate-900/80 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition duration-500" />
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="dense-label text-[10px]">Operational Preview Live</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{cropType} Profile</h3>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${analytics.ghi > 85 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  ● LIVE DATA
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                  <span className="dense-label text-[9px]">Health GHI</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{analytics.ghi}</p>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                  <span className="dense-label text-[9px]">Risk Tier</span>
                  <p className="text-2xl font-black text-cyan-400 mt-1">{analytics.riskLevel}</p>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 col-span-2">
                  <span className="dense-label text-[9px]">Projected Revenue Risk</span>
                  <p className="text-xl font-black text-red-400 mt-1">₹{analytics.lossInr.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS GRID (4-COLUMNS) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="analytics-card p-6">
            <span className="dense-label">Grain Health Index</span>
            <div className="metric-heading text-emerald-400 mt-4">{analytics.ghi}</div>
            <p className="text-xs text-slate-500 mt-2">Weighted storage condition safety</p>
          </div>
          <div className="analytics-card p-6">
            <span className="dense-label">Storage Risk</span>
            <div className="metric-heading text-cyan-400 mt-4">{analytics.riskLevel}</div>
            <p className="text-xs text-slate-500 mt-2">Deterioration & spore threshold</p>
          </div>
          <div className="analytics-card p-6">
            <span className="dense-label">Potential Loss Impact</span>
            <div className="metric-heading text-red-400 mt-4">₹{analytics.lossInr.toLocaleString("en-IN")}</div>
            <p className="text-xs text-slate-500 mt-2">Estimated structural volume shrinkage</p>
          </div>
          <div className="analytics-card p-6">
            <span className="dense-label">Active Advisories</span>
            <div className="metric-heading text-yellow-400 mt-4">{analytics.advisories.length}</div>
            <p className="text-xs text-slate-500 mt-2">Actionable triggers logged</p>
          </div>
        </section>

        {/* STORAGE ASSESSMENT + LIVE RESULTS GRID (2-COLUMNS) */}
        <section id="assess" className="grid lg:grid-cols-12 gap-8 border-t border-white/5 pt-12 md:pt-20 scroll-mt-24">
          <div className="lg:col-span-7 space-y-6">
            <div className="analytics-card p-6 md:p-8 space-y-6">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-3">{UI.controlsLabel}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="dense-label text-[10px]">Select Managed Crop Profile</label>
                  <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full mt-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-400 outline-none transition">
                    <option value="Paddy (Rice)">Paddy (Rice)</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Moisture Balance</span><span className="font-mono text-emerald-400 font-bold">{moisture}%</span></div>
                  <input type="range" min="5" max="35" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Core Temperature</span><span className="font-mono text-cyan-400 font-bold">{temperature}°C</span></div>
                  <input type="range" min="10" max="65" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Relative Humidity</span><span className="font-mono text-yellow-400 font-bold">{humidity}%</span></div>
                  <input type="range" min="20" max="95" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} />
                </div>
                {isExpertMode && (
                  <div className="space-y-2 sm:col-span-2 pt-2 border-t border-white/5 animate-fade-in">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Batch Mass Load</span><span className="font-mono text-slate-300 font-bold">{mass.toLocaleString()} kg</span></div>
                    <input type="range" min="1000" max="50000" step="500" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: LIVE COMPUTATION EVALUATOR PANELS */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="analytics-card p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <span className="dense-label">{UI.readinessLabel}</span>
                <h2 className={`text-4xl font-black mt-4 tracking-tight ${analytics.ghi > 85 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {analytics.ghi > 85 ? UI.safe : UI.unsafe}
                </h2>
              </div>
              <div className="space-y-3 border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs font-medium py-1">
                  <span className="text-slate-400">{UI.ghiLabel}</span>
                  <span className="font-mono font-bold text-emerald-400">{analytics.ghi} / 100</span>
                </div>
                <div className="flex justify-between text-xs font-medium py-1">
                  <span className="text-slate-400">{UI.riskLabel}</span>
                  <span className="font-mono font-bold text-cyan-400">{analytics.riskLevel} RISK</span>
                </div>
                <div className="flex justify-between text-xs font-medium py-1">
                  <span className="text-slate-400">Financial Revenue Shrinkage</span>
                  <span className="font-mono font-bold text-red-400">₹{analytics.lossInr.toLocaleString("en-IN")}</span>
                </div>
                {isExpertMode && (
                  <div className="flex justify-between text-xs font-medium py-1 border-t border-white/5 pt-2 font-mono text-slate-500 animate-fade-in">
                    <span>{UI.weightLoss}</span>
                    <span className="text-slate-300">{analytics.lossKg} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PRESCRIPTIVE RECOMMENDED ACTIONS */}
        <section className="space-y-6 border-t border-white/5 pt-12 md:pt-20">
          <div><span className="dense-label">{UI.actionsLabel}</span></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {analytics.advisories.length > 0 ? (
              analytics.advisories.map((advice, i) => (
                <div key={i} className="analytics-card p-5 border-l-4 border-l-cyan-400 bg-slate-900/60 flex flex-col justify-between">
                  <h4 className="font-bold text-sm text-slate-200 tracking-wide">{advice.split(":")[0] || "Guideline Block"}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{advice.split(":")[1] || advice}</p>
                </div>
              ))
            ) : (
              <div className="analytics-card p-6 col-span-2 text-center text-xs text-slate-400 font-medium">
                🟢 All infrastructure levels nominal. Baseline parameters safely matched.
              </div>
            )}
          </div>
        </section>

        {/* STATIC MEANINGFUL REAL-TIME RISKS MONITOR LAYER */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-white/5 pt-12 md:pt-20">
          <div className="analytics-card p-4 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Moisture Status</span>
            <p className={`text-sm font-bold mt-2 ${analytics.violations.moisture ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.moisture ? "⚠️ CRITICAL" : "✓ NORMAL"}
            </p>
          </div>
          <div className="analytics-card p-4 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Thermal Load</span>
            <p className={`text-sm font-bold mt-2 ${analytics.violations.temp ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.temp ? "⚠️ HIGH SPIKE" : "✓ STABLE"}
            </p>
          </div>
          <div className="analytics-card p-4 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Relative Humidity</span>
            <p className={`text-sm font-bold mt-2 ${analytics.violations.humidity ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {analytics.violations.humidity ? "⚠️ WARNING" : "✓ NORMAL"}
            </p>
          </div>
          <div className="analytics-card p-4 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Fungal Incubation</span>
            <p className={`text-sm font-bold mt-2 ${analytics.riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.riskLevel === 'HIGH' ? "⚠️ HIGH RISK" : "✓ LOW RISK"}
            </p>
          </div>
        </section>

        {/* HISTORICAL RECENT TIMELINE LEDGER */}
        <section className="space-y-6 border-t border-white/5 pt-12 md:pt-20">
          <div className="text-center"><span className="dense-label">{UI.ledgerLabel}</span></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="analytics-card p-5 border border-white/5">
              <span className="text-xs font-bold font-mono text-cyan-400">June 21</span>
              <h4 className="font-bold text-sm text-slate-200 mt-1">Realtime Storage Assessment Run</h4>
              <p className="text-xs text-slate-400 mt-1 leading-normal">Batch analysis successfully metrics mapped to {cropType} limitations.</p>
            </div>
            <div className="analytics-card p-5 border border-white/5">
              <span className="text-xs font-bold font-mono text-slate-500">June 10</span>
              <h4 className="font-bold text-sm text-slate-400 mt-1">Mechanical De-Humidification Run</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal">Storage silo aeration parameters recorded globally.</p>
            </div>
          </div>
        </section>

        {/* DOWNLOAD CARD ACTION CONSOLE */}
        <section className="analytics-card p-6 md:p-8 border border-white/10 bg-slate-900/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-sm tracking-wide text-white">Aggregated Diagnostic Report Compiler</h4>
            <p className="text-xs text-slate-400 mt-1">Compiles complete sensor calculations log profiles for verification compliance panels.</p>
          </div>
          <button className="w-full sm:w-auto bg-white text-slate-950 font-bold text-xs font-mono tracking-wider px-6 py-3 rounded-lg hover:bg-slate-200 transition uppercase">
            {UI.downloadCta}
          </button>
        </section>

      </main>
    </div>
  );
}
