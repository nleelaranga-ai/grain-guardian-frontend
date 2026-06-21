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

export default function GrainGuardianStudio() {
  const [isTelugu, setIsTelugu] = useState<boolean>(false);
  const [isExpertMode, setIsExpertMode] = useState<boolean>(false);

  // Core Simulation Parameters
  const [cropType, setCropType] = useState<string>("Paddy (Rice)");
  const [moisture, setMoisture] = useState<number>(14.0);
  const [temperature, setTemperature] = useState<number>(34.0);
  const [humidity, setHumidity] = useState<number>(65.0);
  const [mass, setMass] = useState<number>(12000);

  // State Matrix Sync Payload
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
      viewDemo: "View Demo Model",
      heroHead: "Know when to store.\nKnow when to act.",
      heroSub: "Assess grain conditions, understand complex storage risks, predict potential multi-crop financial losses, and receive contextual real-time prescriptive recommendations.",
      readinessLabel: "Storage Readiness Assessment",
      safe: "Safe to Store Lot",
      unsafe: "Action Required / Continue Drying",
      ghiLabel: "Grain Health Index",
      riskLabel: "Storage Risk Factor",
      financialLabel: "Potential Financial Impact",
      weightLoss: "Estimated weight loss:",
      controlsLabel: "Workspace Environment Sliders",
      actionsLabel: "Prescriptive Tactical Recommendations",
      ledgerLabel: "Recent Assessment Logs Ledger",
      downloadCta: "Generate Professional PDF Report",
      farmerMode: "Farmer Workspace",
      expertMode: "Expert Console"
    },
    te: {
      title: "ధాన్యసంరక్షకుడు",
      tagline: "పంట అనంతర నిల్వ నిర్ణయాల విశ్లేషణ వేదిక",
      cta: "పరిశీలన ప్రారంభించండి",
      viewDemo: "డెమో మోడల్",
      heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి.\nఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
      heroSub: "ధాన్య పరిస్థితులను ఖచ్చితంగా అంచనా వేసి, నిల్వ ప్రమాదాలను అర్థం చేసుకొని, సంభావ్య ఆర్థిక నష్టాలను అంచనా వేసి పంటను భద్రపరచండి.",
      readinessLabel: "ధాన్య నిల్వ సంసిద్ధత మూల్యాంకనం",
      safe: "నిల్వకు సురక్షితం",
      unsafe: "ఆరబెట్టడం కొనసాగించండి",
      ghiLabel: "ధాన్య ఆరోగ్య సూచిక (GHI)",
      riskLabel: "నిల్వ ప్రమాద స్థాయి",
      financialLabel: "సాధ్యమయ్యే ఆర్థిక నష్టం",
      weightLoss: "అంచనా వేసిన బరువు నష్టం:",
      controlsLabel: "పర్యావరణ టెలిమెట్రీ ఆకృతీకరణ",
      actionsLabel: "సిఫార్సు చేయబడిన నివారణ చర్యలు",
      ledgerLabel: "ఇటీవలి మూల్యాంకన లాగ్ రిజిస్టర్",
      downloadCta: "పూర్తి వివేదిక నివేదికను డౌన్‌లోడ్ చేయండి",
      farmerMode: "రైతు మోడ్",
      expertMode: "నిపుణుల మోడ్"
    }
  };

  const UI = isTelugu ? lexicons.te : lexicons.en;

  // Sync parameters with live calculation engine or backend routing loop
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
        console.error("FastAPI backend connectivity pipeline failure bypassed:", err);
      }
    }
    triggerComputePass();
  }, [cropType, moisture, temperature, humidity, mass]);

  return (
    <div className="min-h-screen bg-slate-950 text-white select-none selection:bg-cyan-400 selection:text-slate-950">
      
      {/* GOOGLE AI STUDIO TRANSLUCENT NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-16 md:h-[72px] border-b border-white/5 bg-slate-950/60 backdrop-blur-xl z-50 px-4 md:px-12 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs md:text-sm font-black tracking-widest text-white">{UI.title}</span>
          <span className="text-[10px] text-slate-500 font-medium tracking-tight hidden sm:block">{UI.tagline}</span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => setIsTelugu(!isTelugu)} className="text-xs font-bold font-mono text-slate-400 hover:text-white transition">
            {isTelugu ? "ENGLISH" : "తెలుగు"}
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="bg-slate-900 border border-white/10 p-0.5 rounded-lg flex items-center">
            <button onClick={() => setIsExpertMode(false)} className={`text-[11px] font-bold px-3 py-1 rounded-md transition ${!isExpertMode ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
              {UI.farmerMode}
            </button>
            <button onClick={() => setIsExpertMode(true)} className={`text-[11px] font-bold px-3 py-1 rounded-md transition ${isExpertMode ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
              {UI.expertMode}
            </button>
          </div>
          <a href="#workspace" className="hidden sm:inline-block bg-white text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition">
            {UI.cta}
          </a>
        </div>
      </nav>

      {/* COMPACT TWO-COLUMN HERO SECTION */}
      <div className="studio-container pt-24 md:pt-32">
        <header className="grid lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-10 md:pb-16 animate-studio-fade">
          <div className="lg:col-span-7 space-y-4 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[0.95] whitespace-pre-line">
              {UI.heroHead}
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              {UI.heroSub}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#workspace" className="bg-cyan-400 text-slate-950 text-xs font-bold px-5 py-3 rounded-lg hover:bg-cyan-300 transition shadow-lg">
                {UI.cta}
              </a>
              <button className="bg-slate-900 border border-white/5 text-slate-300 text-xs font-bold px-5 py-3 rounded-lg hover:bg-slate-800 transition">
                {UI.viewDemo}
              </button>
            </div>
          </div>

          {/* FLOATING GLASS PREVIEW PANEL MODULE */}
          <div className="lg:col-span-5">
            <div className="studio-panel p-6 bg-slate-900/50 border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div>
                  <span className="studio-label text-[10px]">Realtime Model Sandbox</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">{cropType} Batch Monitor</h3>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold tracking-widest">LIVE FLOW</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-3.5 rounded-lg border border-white/5">
                  <span className="studio-label text-[9px]">GHI Score</span>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">{analytics.ghi}</p>
                </div>
                <div className="bg-slate-950/40 p-3.5 rounded-lg border border-white/5">
                  <span className="studio-label text-[9px]">Risk Status</span>
                  <p className="text-2xl font-black text-cyan-400 mt-0.5">{analytics.riskLevel}</p>
                </div>
                <div className="bg-slate-950/40 p-3.5 rounded-lg border border-white/5 col-span-2">
                  <span className="studio-label text-[9px]">Potential Valuation Loss</span>
                  <p className="text-xl font-black text-red-400 mt-0.5">₹{analytics.lossInr.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* COMPACT METRICS GRID ROW */}
      <div className="studio-container py-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="studio-panel p-5">
            <span className="studio-label">{UI.ghiLabel}</span>
            <div className="metric-number text-emerald-400 font-black text-3xl mt-2">{analytics.ghi}</div>
            <p className="text-[10px] text-slate-500 mt-1">Weighted dry storage safety score</p>
          </div>
          <div className="studio-panel p-5">
            <span className="studio-label">{UI.riskLabel}</span>
            <div className="metric-number text-cyan-400 font-black text-3xl mt-2">{analytics.riskLevel}</div>
            <p className="text-[10px] text-slate-500 mt-1">Calculated structural biological hazard</p>
          </div>
          <div className="studio-panel p-5">
            <span className="studio-label">{UI.financialLabel}</span>
            <div className="metric-number text-red-400 font-black text-3xl mt-2">₹{analytics.lossInr.toLocaleString("en-IN")}</div>
            <p className="text-[10px] text-slate-500 mt-1">Projected commodity value shrinkage</p>
          </div>
          <div className="studio-panel p-5">
            <span className="studio-label">Directives Registered</span>
            <div className="metric-number text-yellow-400 font-black text-3xl mt-2">{analytics.advisories.length}</div>
            <p className="text-[10px] text-slate-500 mt-1">Contextual recommendations loaded</p>
          </div>
        </section>
      </div>

      {/* CORE ASSESSMENT WORKSPACE HUB (2-COLUMNS) */}
      <div id="workspace" className="studio-container studio-section scroll-mt-24">
        <section className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT SLIDER CONTROL CHASSIS */}
          <div className="lg:col-span-7 flex studio-control-inputs">
            <div className="studio-panel p-6 md:p-8 space-y-5 flex-1 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-200 border-b border-white/5 pb-2 uppercase tracking-wide">
                ⚙️ {UI.controlsLabel}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="studio-label text-[10px]">Crop Classification Matrix</label>
                  <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full mt-1 bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none transition">
                    <option value="Paddy (Rice)">Paddy (Rice)</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Bulk Moisture Index</span>
                    <span className="font-mono text-emerald-400 font-bold">{moisture}%</span>
                  </div>
                  <input type="range" min="5" max="35" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Core Silo Temperature</span>
                    <span className="font-mono text-cyan-400 font-bold">{temperature}°C</span>
                  </div>
                  <input type="range" min="10" max="65" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Ambient Air Humidity</span>
                    <span className="font-mono text-yellow-400 font-bold">{humidity}%</span>
                  </div>
                  <input type="range" min="20" max="95" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} />
                </div>

                {isExpertMode && (
                  <div className="space-y-1 sm:col-span-2 pt-2 border-t border-white/5 animate-studio-fade">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Total Batch Mass</span><span className="font-mono text-slate-300 font-bold">{mass.toLocaleString()} kg</span></div>
                    <input type="range" min="1000" max="50000" step="500" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE LIVE PREVIEW TARGET RESULT SHEET */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="studio-panel p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 bg-slate-900/40">
              <div>
                <span className="studio-label text-slate-400">{UI.readinessLabel}</span>
                <h2 className={`text-2xl font-black mt-2 tracking-tight uppercase ${analytics.ghi > 85 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {analytics.ghi > 85 ? UI.safe : UI.unsafe}
                </h2>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-medium">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-500">{UI.ghiLabel}</span>
                  <span className="font-mono font-bold text-emerald-400">{analytics.ghi} / 100</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-500">{UI.riskLabel}</span>
                  <span className="font-mono font-bold text-cyan-400">{analytics.riskLevel} TIER</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Revenue Shrinkage Loss</span>
                  <span className="font-mono font-bold text-red-400">₹{analytics.lossInr.toLocaleString("en-IN")}</span>
                </div>
                {isExpertMode && (
                  <div className="flex justify-between pt-2 border-t border-white/5 font-mono text-slate-500 animate-studio-fade">
                    <span>{UI.weightLoss}</span>
                    <span className="text-slate-300 font-bold">{analytics.lossKg} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PRESCRIPTIVE ADVISORIES RECOMMENDATIONS PANELS */}
      <div className="studio-container py-4">
        <section className="space-y-4">
          <span className="studio-label">{UI.actionsLabel}</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {analytics.advisories.length > 0 ? (
              analytics.advisories.map((advice, i) => (
                <div key={i} className="studio-panel p-4 border-l-2 border-l-cyan-400 bg-slate-900/60 flex flex-col justify-between">
                  <h4 className="font-bold text-xs text-slate-200 tracking-wide">{advice.split(":")[0] || "Operational Directive"}</h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{advice.split(":")[1] || advice}</p>
                </div>
              ))
            ) : (
              <div className="studio-panel p-4 col-span-2 text-center text-xs text-slate-400 font-mono">
                🟢 Silo ecosystems normal. Environmental variables map to baseline thresholds.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* DISCRETE REFERENCE STATUS MONITOR CHANNELS */}
      <div className="studio-container py-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="studio-panel p-3.5 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Moisture Node</span>
            <p className={`text-xs font-bold mt-1 ${analytics.violations.moisture ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.moisture ? "⚠️ CRITICAL" : "✓ NORMAL"}
            </p>
          </div>
          <div className="studio-panel p-3.5 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Thermal Load</span>
            <p className={`text-xs font-bold mt-1 ${analytics.violations.temp ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.violations.temp ? "⚠️ HEAT SPIKE" : "✓ STABLE"}
            </p>
          </div>
          <div className="studio-panel p-3.5 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Air Humidity</span>
            <p className={`text-xs font-bold mt-1 ${analytics.violations.humidity ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {analytics.violations.humidity ? "⚠️ WARNING" : "✓ NORMAL"}
            </p>
          </div>
          <div className="studio-panel p-3.5 text-center bg-slate-900/10">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Fungal Activity</span>
            <p className={`text-xs font-bold mt-1 ${analytics.riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
              {analytics.riskLevel === 'HIGH' ? "⚠️ PROLIFERATION" : "✓ DORMANT"}
            </p>
          </div>
        </section>
      </div>

      {/* HISTORICAL TIMELINE DATABASE RECORD TRAIL */}
      <div className="studio-container py-4">
        <section className="space-y-4">
          <div className="text-left"><span className="studio-label">{UI.ledgerLabel}</span></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="studio-panel p-4 bg-slate-900/20">
              <span className="text-[10px] font-bold font-mono text-cyan-400 block">June 21 — Realtime Assessment</span>
              <p className="text-xs font-medium text-slate-300 mt-1">Batch parameter telemetry ledger logs mapped cleanly for validation loops.</p>
            </div>
            <div className="studio-panel p-4 bg-slate-900/20">
              <span className="text-[10px] font-bold font-mono text-slate-500 block">June 10 — Aeration Forced Cycle</span>
              <p className="text-xs font-medium text-slate-500 mt-1">Ventilation and baseline processing logs filed safely on active context register.</p>
            </div>
          </div>
        </section>
      </div>

      {/* COMPILER EXPORT BUTTON CONTROLS ROW */}
      <div className="studio-container py-6">
        <section className="studio-panel p-6 bg-slate-900/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
          <div className="text-left">
            <h4 className="font-bold text-xs text-slate-200 tracking-wide">Aggregated Verification Analytics Compiler</h4>
            <p className="text-[11px] text-slate-500 mt-1">Generates complete quality check metrics certificate for presentation and records.</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-white text-slate-950 font-bold text-xs font-mono tracking-wider px-5 py-2.5 rounded-md hover:bg-slate-200 transition uppercase shadow-xl"
          >
            {UI.downloadCta}
          </button>
        </section>
      </div>

    </div>
  );
}
