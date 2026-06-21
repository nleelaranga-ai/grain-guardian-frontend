"use client";

import React, { useState, useEffect } from "react";

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

export default function ModeInspiredAnalyticsSuite() {
  const [isTelugu, setIsTelugu] = useState<boolean>(false);
  const [isExpertMode, setIsExpertMode] = useState<boolean>(false);

  // Environment & Commodities Parameter States
  const [cropType, setCropType] = useState<string>("Paddy (Rice)");
  const [moisture, setMoisture] = useState<number>(14.0);
  const [temperature, setTemperature] = useState<number>(32.0);
  const [humidity, setHumidity] = useState<number>(60.0);
  const [mass, setMass] = useState<number>(15000);

  // Computed Analytical Store Object
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
      cta: "Analyze System",
      viewDemo: "Reference Logs",
      heroHead: "Know when to store.\nKnow when to act.",
      heroSub: "Assess grain conditions, understand complex storage risks, predict multi-crop degradation, and optimize financial returns.",
      readinessLabel: "Storage Readiness Matrix",
      safe: "Safe to Store",
      unsafe: "Continue Drying Plan",
      ghiLabel: "Grain Health Index (GHI)",
      riskLabel: "Calculated Degradation Risk",
      financialLabel: "Estimated Spoilage Impact",
      weightLoss: "Projected Mass Deficit:",
      controlsLabel: "Environmental Telemetry Simulation Node",
      actionsLabel: "Prescriptive Operational Directives",
      ledgerLabel: "Historical Assessment Log Stream",
      downloadCta: "Compile Evaluation Document (PDF)",
      farmerMode: "Farmer Node",
      expertMode: "Expert Matrix"
    },
    te: {
      title: "ధాన్యసంరక్షకుడు",
      tagline: "పంట అనంతర నిల్వ నిర్ణయాల విశ్లేషణ వేదిక",
      cta: "ధాన్య పరిశీలన",
      viewDemo: "రిఫరెన్స్ లాగ్‌లు",
      heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి.\nఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
      heroSub: "ధాన్య పరిస్థితులను ఖచ్చితంగా అంచనా వేసి, నిల్వ ప్రమాదాలను అర్థం చేసుకొని, సంభావ్య నష్టాలను నివారించండి.",
      readinessLabel: "నిల్వ సంసిద్ధత మాతృక",
      safe: "నిల్వకు సురక్షితం",
      unsafe: "ఆరబెట్టడం కొనసాగించండి",
      ghiLabel: "ధాన్య ఆరోగ్య సూచిక (GHI)",
      riskLabel: "లెక్కించబడిన నిల్వ ప్రమాదం",
      financialLabel: "సాధ్యమయ్యే ఆర్థిక నష్టం",
      weightLoss: "అంచనా వేసిన బరువు నష్టం:",
      controlsLabel: "పర్యావరణ టెలిమెట్రీ సిమ్యులేషన్ నోడ్",
      actionsLabel: "కార్యాచరణ సిఫార్సులు",
      ledgerLabel: "చారిత్రక మూల్యాంకన లాగ్ స్ట్రీమ్",
      downloadCta: "పూర్తి నివేదికను డౌన్‌లోడ్ చేయండి (PDF)",
      farmerMode: "రైతు మోడ్",
      expertMode: "నిపుణుల మోడ్"
    }
  };

  const UI = isTelugu ? lexicons.te : lexicons.en;

  // Intercept changes and sync state with live API matrix
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
        console.error("FastAPI backend network bypass failed:", err);
      }
    }
    triggerComputePass();
  }, [cropType, moisture, temperature, humidity, mass]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-400 selection:text-slate-950">
      
      {/* PROFESSIONAL LOGISTIC GLOBAL NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-[72px] border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="saas-container h-full flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-emerald-400">{UI.title}</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight hidden md:block">{UI.tagline}</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsTelugu(!isTelugu)} className="text-xs font-bold font-mono text-slate-400 hover:text-white transition">
              {isTelugu ? "ENGLISH" : "తెలుగు"}
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="bg-slate-900 border border-white/10 p-0.5 rounded-lg flex items-center">
              <button onClick={() => setIsExpertMode(false)} className={`text-[11px] font-bold px-3 py-1 rounded-md transition ${!isExpertMode ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'}`}>
                {UI.farmerMode}
              </button>
              <button onClick={() => setIsExpertMode(true)} className={`text-[11px] font-bold px-3 py-1 rounded-md transition ${isExpertMode ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
                {UI.expertMode}
              </button>
            </div>
            <a href="#matrix" className="hidden sm:inline-block bg-white text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition">
              {UI.cta}
            </a>
          </div>
        </div>
      </nav>

      {/* COMPACT ANALYTICAL HERO GRID */}
      <div className="saas-container pt-[104px] pb-6">
        <section className="grid lg:grid-cols-12 gap-6 items-center border-b border-white/5 pb-8">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.05] whitespace-pre-line">
              {UI.heroHead}
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              {UI.heroSub}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#matrix" className="bg-cyan-400 text-slate-950 text-xs font-bold px-5 py-3 rounded-lg hover:bg-cyan-300 transition">
                {UI.cta}
              </a>
              <button className="bg-slate-900 border border-white/5 text-slate-300 text-xs font-bold px-5 py-3 rounded-lg hover:bg-slate-800 transition">
                {UI.viewDemo}
              </button>
            </div>
          </div>

          {/* OVERVIEW PREVIEW MODULE DISPLAY CARD */}
          <div className="lg:col-span-5">
            <div className="saas-grid-card p-5 bg-slate-900/40 border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div>
                  <span className="saas-label text-[9px]">Live Context Tracker</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">{cropType} Data Configuration</h3>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <span className="saas-label text-[9px]">Index GHI</span>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">{analytics.ghi}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <span className="saas-label text-[9px]">Risk Profile</span>
                  <p className="text-xl font-black text-cyan-400 mt-0.5">{analytics.riskLevel}</p>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <span className="saas-label text-[9px]">Directives</span>
                  <p className="text-xl font-black text-yellow-400 mt-0.5">{analytics.advisories.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* METRICS DISPATCH COMPONENT ROW */}
      <div className="saas-container py-3">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="saas-grid-card p-5">
            <span className="saas-label">{UI.ghiLabel}</span>
            <div className="metric-heading text-emerald-400 mt-2 font-black text-4xl">{analytics.ghi}</div>
            <p className="text-[11px] text-slate-500 mt-1">Live safe storage capacity evaluation</p>
          </div>
          <div className="saas-grid-card p-5">
            <span className="saas-label">{UI.riskLabel}</span>
            <div className="metric-heading text-cyan-400 mt-2 font-black text-4xl">{analytics.riskLevel}</div>
            <p className="text-[11px] text-slate-500 mt-1">Calculated biological deterioration rate</p>
          </div>
          <div className="saas-grid-card p-5">
            <span className="saas-label">{UI.financialLabel}</span>
            <div className="metric-heading text-red-400 mt-2 font-black text-4xl">₹{analytics.lossInr.toLocaleString("en-IN")}</div>
            <p className="text-[11px] text-slate-500 mt-1">Projected revenue volume risk</p>
          </div>
          <div className="saas-grid-card p-5">
            <span className="saas-label">Active Warnings Triggers</span>
            <div className="metric-heading text-yellow-400 mt-2 font-black text-4xl">{analytics.advisories.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Prescriptive indicators registered</p>
          </div>
        </section>
      </div>

      {/* STORAGE ASSESSMENT INPUT AND MATRIX CONTROLS PANEL */}
      <div id="matrix" className="saas-container analytics-section scroll-mt-20">
        <section className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex">
            <div className="saas-grid-card p-6 md:p-8 space-y-5 flex-1 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">{UI.controlsLabel}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="saas-label text-[10px]">Active Commodity Target Profile</label>
                  <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full mt-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyan-400 outline-none transition">
                    <option value="Paddy (Rice)">Paddy (Rice)</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Moisture Index</span><span className="font-mono text-emerald-400 font-bold">{moisture}%</span></div>
                  <input type="range" min="5" max="35" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Core Temp Vector</span><span className="font-mono text-cyan-400 font-bold">{temperature}°C</span></div>
                  <input type="range" min="10" max="65" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex justify-between text-xs"><span className="text-slate-400">Ambient Relative Humidity</span><span className="font-mono text-yellow-400 font-bold">{humidity}%</span></div>
                  <input type="range" min="20" max="95" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} />
                </div>
                {isExpertMode && (
                  <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-white/5 animate-fade-in">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Total Bulk Volumetric Mass</span><span className="font-mono text-slate-300 font-bold">{mass.toLocaleString()} kg</span></div>
                    <input type="range" min="1000" max="50000" step="500" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* REALTIME CALCULATION EVALUATOR MODULE ROW */}
          <div className="lg:col-span-5 flex">
            <div className="saas-grid-card p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 bg-slate-900/40">
              <div>
                <span className="saas-label">{UI.readinessLabel}</span>
                <h2 className={`text-3xl font-black mt-3 tracking-tight ${analytics.ghi > 85 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {analytics.ghi > 85 ? UI.safe : UI.unsafe}
                </h2>
              </div>
              <div className="space-y-2 border-t border-white/5 pt-4 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{UI.ghiLabel}</span>
                  <span className="font-mono font-bold text-emerald-400">{analytics.ghi} / 100</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">{UI.riskLabel}</span>
                  <span className="font-mono font-bold text-cyan-400">{analytics.riskLevel} LEVEL</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Financial Exposure Value</span>
                  <span className="font-mono font-bold text-red-400">₹{analytics.lossInr.toLocaleString("en-IN")}</span>
                </div>
                {isExpertMode && (
                  <div className="flex justify-between py-1.5 font-mono text-slate-500 animate-fade-in">
                    <span>{UI.weightLoss}</span>
                    <span className="text-slate-300 font-bold">{analytics.lossKg} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PRESCRIPTIVE DIRECTIVES LOGGER */}
      <div className="saas-container py-3">
        <section className="space-y-4">
          <span className="saas-label">{UI.actionsLabel}</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {analytics.advisories.length > 0 ? (
              analytics.advisories.map((advice, idx) => (
                <div key={idx} className="saas-grid-card p-4 border-l-2 border-l-cyan-400 bg-slate-900/40">
                  <h4 className="font-bold text-xs text-slate-200 tracking-wide">{advice.split(":")[0] || "Operational Trigger"}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{advice.split(":")[1] || advice}</p>
                </div>
              ))
            ) : (
              <div className="saas-grid-card p-4 col-span-2 text-center text-xs text-slate-400 font-mono">
                🟢 Environmental balance vectors safe. System parameters secure.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* STATIC STATUS RANGE SPLITTER BARS */}
      <div className="saas-container py-3">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="saas-grid-card p-4 text-center bg-slate-950/40">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Moisture Node</span>
            <p className={`text-xs font-bold mt-1.5 ${analytics.violations.moisture ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.moisture ? "⚠️ CEILING SPIKE" : "✓ COMPLIANT"}
            </p>
          </div>
          <div className="saas-grid-card p-4 text-center bg-slate-950/40">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Thermal Node</span>
            <p className={`text-xs font-bold mt-1.5 ${analytics.violations.temp ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.temp ? "⚠️ HEAT HOTSPOT" : "✓ COMPLIANT"}
            </p>
          </div>
          <div className="saas-grid-card p-4 text-center bg-slate-950/40">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Humidity Vector</span>
            <p className={`text-xs font-bold mt-1.5 ${analytics.violations.humidity ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {analytics.violations.humidity ? "⚠️ LEVEL CEILING" : "✓ COMPLIANT"}
            </p>
          </div>
          <div className="saas-grid-card p-4 text-center bg-slate-950/40">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Microbial Core</span>
            <p className={`text-xs font-bold mt-1.5 ${analytics.riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.riskLevel === 'HIGH' ? "⚠️ PROLIFERATION" : "✓ NOMINAL TIER"}
            </p>
          </div>
        </section>
      </div>

      {/* HISTORICAL RECENT ASSESSMENT LOG STREAM */}
      <div className="saas-container py-4">
        <section className="space-y-4">
          <div className="text-left"><span className="saas-label">{UI.ledgerLabel}</span></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="saas-grid-card p-4 bg-slate-900/20">
              <span className="text-[10px] font-bold font-mono text-cyan-400">June 21</span>
              <h4 className="font-bold text-xs text-slate-300 mt-1">Silo Operational Assessment Evaluated</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">Volumetric limits dynamically processed via system reference matrices.</p>
            </div>
            <div className="saas-grid-card p-4 bg-slate-900/20">
              <span className="text-[10px] font-bold font-mono text-slate-500">June 10</span>
              <h4 className="font-bold text-xs text-slate-400 mt-1">Aeration De-Humidification Loop Logged</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">Manual ventilation balance sequence executed across core baseline registers.</p>
            </div>
          </div>
        </section>
      </div>

      {/* COMPILER GENERATION CONTROLS ROW */}
      <div className="saas-container py-6">
        <section className="saas-grid-card p-5 bg-slate-900/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
          <div className="text-left">
            <h4 className="font-bold text-xs text-slate-200 tracking-wide">Structured Diagnostic Ledger Compiler</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Generates certified technical report matrices across matching verification limits.</p>
          </div>
          <button className="w-full sm:w-auto bg-white text-slate-950 font-bold text-xs font-mono tracking-wider px-5 py-2.5 rounded-lg hover:bg-slate-200 transition uppercase">
            {UI.downloadCta}
          </button>
        </section>
      </div>

    </div>
  );
}
