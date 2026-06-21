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

export default function ModeAnalyticsDashboard() {
  const [isTelugu, setIsTelugu] = useState<boolean>(false);
  const [isExpertMode, setIsExpertMode] = useState<boolean>(false);

  // Core Simulation States
  const [cropType, setCropType] = useState<string>("Paddy (Rice)");
  const [moisture, setMoisture] = useState<number>(14.5);
  const [temperature, setTemperature] = useState<number>(28.0);
  const [humidity, setHumidity] = useState<number>(72.0);
  const [mass, setMass] = useState<number>(50);

  // Analysis Store Engine Sync
  const [analytics, setAnalytics] = useState({
    ghi: 78,
    lossInr: 20900,
    lossKg: 420,
    riskLevel: "MEDIUM",
    advisories: [
      "Continue Drying Cycles: Critical moisture warning. Bring batch down to safety limit.",
      "Manage Ventilation Aeration: Warm lot temperature acts as biological catalyst for micro-infestation."
    ] as string[],
    violations: { moisture: true, temp: true, humidity: true }
  });

  const lexicons: { en: UIText; te: UIText } = {
    en: {
      title: "GRAINGUARDIAN",
      tagline: "Storage Intelligence for Post-Harvest Decisions",
      cta: "Start Storage Assessment",
      viewDemo: "Load Wet Batch (Demo)",
      heroHead: "Know when to store.\nKnow when to act.",
      heroSub: "Assess grain bulk conditions, understand complex physiological storage risks, predict potential financial deterioration, and secure direct scientific recommendations.",
      readinessLabel: "Live Intelligence Analysis",
      safe: "STORAGE COMPLIANT / SAFE",
      unsafe: "ATTENTION / ACTION REQUIRED",
      ghiLabel: "Grain Health Score",
      riskLabel: "Calculated Storage Risk",
      financialLabel: "Potential Financial Impact",
      weightLoss: "Projected Weight Deficit:",
      controlsLabel: "Harvest Integrity Analytics Node",
      actionsLabel: "Preservation Guidelines & Tactical Actions",
      ledgerLabel: "Telemetry Assessment Log & History",
      downloadCta: "Generate Professional PDF Report",
      farmerMode: "Farmer View",
      expertMode: "Expert Matrix"
    },
    te: {
      title: "ధాన్యసంరక్షకుడు",
      tagline: "పంట అనంతర నిల్వ నిర్ణయాల విశ్లేషణ వేదిక",
      cta: "పరిశీలన ప్రారంభించండి",
      viewDemo: "వెట్ బ్యాచ్ లోడ్ చేయండి",
      heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి.\nఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
      heroSub: "ధాన్య పరిస్థితులను ఖచ్చితంగా అంచనా వేసి, సంభావ్య ఆర్థిక నష్టాలను నివారించి పంటను భద్రపరచండి.",
      readinessLabel: "ప్రత్యక్ష విశ్లేషణ ప్యానెల్",
      safe: "నిల్వకు సురక్షితం",
      unsafe: "చర్య తీసుకోవలసి ఉంది",
      ghiLabel: "ధాన్య ఆరోగ్య సూచిక (GHI)",
      riskLabel: "లెక్కించబడిన నిల్వ ప్రమాదం",
      financialLabel: "సాధ్యమయ్యే ఆర్థిక నష్టం",
      weightLoss: "అంచనా వేసిన బరువు నష్టం:",
      controlsLabel: "పర్యావరణ టెలిమెట్రీ ఆకృతీకరణ",
      actionsLabel: "కార్యాచరణ సంరక్షణ సూచనలు",
      ledgerLabel: "చారిత్రక మూల్యాంకన రిజిస్టర్",
      downloadCta: "పూర్తి వివేదిక పత్రం (PDF)",
      farmerMode: "రైతు మోడ్",
      expertMode: "निపుణుల మోడ్"
    }
  };

  const UI = isTelugu ? lexicons.te : lexicons.en;

  // Sync parameters with calculation engine or backend routing loop
  useEffect(() => {
    async function performPipelineAnalysis() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v3/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop_type: cropType,
            moisture: moisture,
            temperature: temperature,
            humidity: humidity,
            stored_mass_kg: mass * 1000 // Convert Metric Tons to KG for standard schema matching
          })
        });
        if (response.ok) {
          const res = await response.json();
          setAnalytics({
            ghi: res.grain_health_index,
            lossInr: res.estimated_financial_loss_inr,
            lossKg: res.projected_weight_loss_kg,
            riskLevel: res.fungal_risk_status,
            advisories: res.action_advisory,
            violations: {
              moisture: res.clp_matrix.clp_moisture_violation,
              temp: res.clp_matrix.clp_temp_violation,
              humidity: res.clp_matrix.clp_humidity_violation
            }
          });
        }
      } catch (err) {
        console.error("FastAPI backend live connection error:", err);
      }
    }
    performPipelineAnalysis();
  }, [cropType, moisture, temperature, humidity, mass]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* ADVANCED FIXED CHROMATIC NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-16 md:h-[72px] border-b border-white/5 bg-slate-950/80 backdrop-blur-md z-50 neon-magic-drop">
        <div className="mode-container h-full flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-black tracking-widest text-emerald-400">{UI.title}</h1>
            <p className="text-[9px] text-slate-400 tracking-tight hidden sm:block mt-0.5">{UI.tagline}</p>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => setIsTelugu(!isTelugu)} className="text-xs font-bold font-mono text-slate-400 hover:text-white transition">
              {isTelugu ? "ENGLISH" : "తెలుగు"}
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="bg-slate-900 border border-white/10 p-0.5 rounded-xl flex items-center">
              <button onClick={() => setIsExpertMode(false)} className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${!isExpertMode ? 'bg-emerald-400 text-slate-950 shadow-md' : 'text-slate-400'}`}>
                {UI.farmerMode}
              </button>
              <button onClick={() => setIsExpertMode(true)} className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${isExpertMode ? 'bg-cyan-400 text-slate-950 shadow-md' : 'text-slate-400'}`}>
                {UI.expertMode}
              </button>
            </div>
            <a href="#pipeline" className="hidden md:inline-block bg-white text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-100 transition shadow-lg">
              {UI.cta}
            </a>
          </div>
        </div>
      </nav>

      {/* 2-COLUMN DENSE HERO CONSOLE HEADER */}
      <div className="mode-container pt-24 md:pt-[112px]">
        <header className="grid lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-10">
          <div className="lg:col-span-7 space-y-4 text-left">
            {isExpertMode && (
              <span className="inline-block text-[10px] font-bold font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
                ✓ EXPERT PARAMETER MATRIX ACTIVE (EMC, DEWPOINT)
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.95] whitespace-pre-line">
              {UI.heroHead}
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              {UI.heroSub}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#pipeline" className="bg-cyan-400 text-slate-950 text-xs font-bold px-5 py-3 rounded-lg hover:bg-cyan-300 transition font-mono tracking-wide shadow-lg">
                Begin Smart Scan
              </a>
              <button className="bg-slate-900 border border-white/5 text-slate-300 text-xs font-bold px-5 py-3 rounded-lg hover:bg-slate-800 transition">
                {UI.viewDemo}
              </button>
            </div>
          </div>

          {/* RIGHT VIEWPORT PREVIEW COMPONENT CARD */}
          <div className="lg:col-span-5">
            <div className="mode-card p-6 bg-slate-900/50 border border-white/10 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition duration-500" />
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div>
                  <span className="compact-label text-[9px] text-slate-400">Current Batch Health</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">Rabi Harvest 24</h3>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold tracking-widest">LIVE PREVIEW</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <span className="compact-label text-[9px]">Health GHI</span>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{analytics.ghi}</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <span className="compact-label text-[9px]">Storage Risk</span>
                  <p className={`text-xl font-black mt-2 ${analytics.riskLevel === 'HIGH' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {analytics.riskLevel}
                  </p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 col-span-2">
                  <span className="compact-label text-[9px]">Potential Financial Impact</span>
                  <p className="text-2xl font-black text-red-400 mt-0.5">₹{analytics.lossInr.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* METRICS QUAD GRID */}
      <div className="mode-container py-4">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="mode-card p-5 relative overflow-hidden">
            <span className="compact-label">{UI.ghiLabel}</span>
            <div className="metric-heading text-emerald-400 mt-2 font-black text-4xl">{analytics.ghi}</div>
            <p className="text-[11px] text-slate-500 mt-1">Weighted storage envelope safety index</p>
          </div>
          <div className="mode-card p-5">
            <span className="compact-label">{UI.riskLabel}</span>
            <div className="metric-heading text-yellow-400 mt-2 font-black text-4xl">{analytics.riskLevel}</div>
            <p className="text-[11px] text-slate-500 mt-1">Deterioration & spore hatching threshold</p>
          </div>
          <div className="mode-card p-5">
            <span className="compact-label">{UI.financialLabel}</span>
            <div className="metric-heading text-red-400 mt-2 font-black text-4xl">₹{analytics.lossInr.toLocaleString("en-IN")}</div>
            <p className="text-[11px] text-slate-500 mt-1">Estimated dry matter contraction value</p>
          </div>
          <div className="mode-card p-5">
            <span className="compact-label">Actionable Directives</span>
            <div className="metric-heading text-cyan-400 mt-2 font-black text-4xl">{analytics.advisories.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Prescriptive pipeline warnings loaded</p>
          </div>
        </section>
      </div>

      {/* CORE PIPELINE ASSESSMENT AREA (2-COLUMNS) */}
      <div id="pipeline" className="mode-container mode-section-padding scroll-mt-20">
        <h2 className="text-2xl font-black tracking-tight text-white text-center mb-8">Harvest Integrity Analytics</h2>
        <section className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT TELEMETRY INPUT CONTROLS SLIDERS BLOCK */}
          <div className="lg:col-span-7 flex input-panel-wrapper">
            <div className="mode-card p-6 md:p-8 space-y-6 flex-1 bg-slate-900/30 flex flex-col justify-between">
              <h3 className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-2 uppercase">
                <span>📊</span> {UI.controlsLabel}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="compact-label text-[10px]">Primary Crop Target Profile</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                    {["Paddy (Rice)", "Wheat", "Maize (Corn)", "Sorghum (Jowar)", "Bengal Gram"].map((crop) => (
                      <button 
                        key={crop}
                        onClick={() => setCropType(crop)}
                        className={`p-2.5 rounded-xl border text-[10px] font-bold transition text-center ${
                          cropType === crop ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400' : 'bg-slate-950 border-white/5 text-slate-400'
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Grain Moisture Balance</span>
                    <span className="font-mono text-cyan-400 font-bold">{moisture}%</span>
                  </div>
                  <input type="range" min="8" max="25" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono"><span>Min: 8%</span><span>Safe Threshold Limit: 13.5%</span></div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Core Silo Ambient Temperature</span>
                    <span className="font-mono text-red-400 font-bold">{temperature}°C</span>
                  </div>
                  <input type="range" min="5" max="45" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Relative Internal Air Humidity</span>
                    <span className="font-mono text-yellow-400 font-bold">{humidity}%</span>
                  </div>
                  <input type="range" min="20" max="95" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} />
                </div>

                {isExpertMode && (
                  <div className="space-y-1.5 pt-3 border-t border-white/5 animate-fade-in">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Batch Mass Volumetric Scale</span><span className="font-mono text-slate-300 font-bold">{mass} Metric Tons</span></div>
                    <input type="range" min="1" max="250" step="1" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: REALTIME ENGINE PIPELINE RESPONSES */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="mode-card p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 bg-slate-900/80 border-cyan-500/10">
              <div>
                <span className="compact-label text-slate-400">{UI.readinessLabel}</span>
                <h2 className={`text-2xl md:text-3xl font-black mt-2 tracking-tight uppercase ${analytics.ghi > 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {analytics.ghi > 80 ? UI.safe : UI.unsafe}
                </h2>
              </div>

              {/* LIVE STRUCTURAL DATA REEVAL MATRIX */}
              <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-medium font-mono">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500">{UI.ghiLabel}</span>
                  <span className="text-emerald-400 font-bold">{analytics.ghi} / 100</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500">{UI.riskLabel}</span>
                  <span className="text-yellow-400 font-bold">{analytics.riskLevel} TIER</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Financial Exposure Value</span>
                  <span className="text-red-400 font-bold">₹{analytics.lossInr.toLocaleString("en-IN")}</span>
                </div>
                
                {isExpertMode && (
                  <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 grid grid-cols-2 gap-2 font-sans animate-fade-in">
                    <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                      <span className="text-[9px] text-slate-500 block uppercase font-mono">EMC Balance</span>
                      <span className="text-cyan-400 font-bold">11.2% Ratio</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
                      <span className="text-[9px] text-slate-500 block uppercase font-mono">Dew Point</span>
                      <span className="text-red-400 font-bold">22.4°C Limit</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ACTIONABLE ADVISORIES PRESCRIPTIVE LIST */}
      <div className="mode-container py-2">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>🎗️</span> {UI.actionsLabel}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {analytics.advisories.map((item, index) => (
              <div key={index} className="mode-card p-5 border-l-2 border-emerald-400 bg-slate-900/20 flex flex-col justify-between">
                <h4 className="font-bold text-xs text-slate-200 tracking-wide">{item.split(":")[0]}</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{item.split(":")[1] || item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* SPECIFIC RELEVANT RISKS CHECKLIST BAR CONTROLS */}
      <div className="mode-container py-6">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="mode-card p-4 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Moisture Content</span>
            <p className={`text-xs font-bold mt-1 ${analytics.violations.moisture ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.moisture ? "⚠️ CEILING OVERLIMIT" : "✓ NORMAL BOUNDS"}
            </p>
          </div>
          <div className="mode-card p-4 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Thermal Hotspot</span>
            <p className={`text-xs font-bold mt-1 ${analytics.violations.temp ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.temp ? "⚠️ WARNING TIER" : "✓ COMPLIANT VECT"}
            </p>
          </div>
          <div className="mode-card p-4 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Relative Air Humidity</span>
            <p className={`text-xs font-bold mt-1 ${analytics.violations.humidity ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {analytics.violations.humidity ? "⚠️ CONDENSATION RISK" : "✓ COMPLIANT"}
            </p>
          </div>
          <div className="mode-card p-4 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Fungal Activity</span>
            <p className={`text-xs font-bold mt-1 ${analytics.riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.riskLevel === 'HIGH' ? "⚠️ PROLIFERATION" : "✓ DORMANT"}
            </p>
          </div>
        </section>
      </div>

      {/* HISTORICAL TIMELINE STREAM RECORD matrix */}
      <div className="mode-container py-4">
        <section className="space-y-4">
          <span className="saas-label">{UI.ledgerLabel}</span>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="mode-card p-4 border border-white/5 bg-slate-950/40">
              <span className="text-[10px] font-mono text-cyan-400 font-bold block">June 21 — Telemetry Completed</span>
              <p className="text-xs font-medium text-slate-300 mt-1">Batch parameter log matrix compiled safely for lot verification.</p>
            </div>
            <div className="mode-card p-4 border border-white/5 bg-slate-950/40">
              <span className="text-[10px] font-mono text-slate-500 font-bold block">June 10 — Forced Aeration Cycle</span>
              <p className="text-xs font-medium text-slate-500 mt-1">Silo baseline dynamic drying parameter checklist saved local node storage.</p>
            </div>
          </div>
        </section>
      </div>

      {/* REPORT COMPILER CARD SECTION */}
      <div className="mode-container py-6">
        <section className="mode-card p-6 bg-slate-900/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-xs text-slate-200 tracking-wide">Quality Certificate & Report Generator</h4>
            <p className="text-[11px] text-slate-500 mt-1">Generates an authorized digital telemetry analysis sheet for processing limits records.</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-white text-slate-950 font-bold text-xs font-mono tracking-wider px-6 py-3 rounded-xl hover:bg-slate-200 transition-all uppercase shadow-lg shadow-white/5"
          >
            {UI.downloadCta}
          </button>
        </section>
      </div>

    </div>
  );
}
