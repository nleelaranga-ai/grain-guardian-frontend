"use client";

import React, { useState, useEffect } from "react";

export default function GrainGuardianSuite() {
  // Application Control Planes
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isTelugu, setIsTelugu] = useState(false);

  // Core Simulation States
  const [cropType, setCropType] = useState("Paddy (Rice)");
  const [moisture, setMoisture] = useState(14.0);
  const [temperature, setTemperature] = useState(34.0);
  const [humidity, setHumidity] = useState(65.0);
  const [mass, setMass] = useState(12000);

  // Decision Pipeline Analytics State
  const [analytics, setAnalytics] = useState({
    ghi: 92,
    lossInr: 12540,
    lossKg: 240,
    fungalRisk: "LOW",
    clp: { moisture: false, temp: false, humidity: false, duration: false, fungal: false },
    advisories: []
  });

  // Translation Dictionaries (Strict Translation, No Transliteration)
  const text = {
    en: {
      title: "GRAIN GUARDIAN",
      ghi: "Grain Health Index",
      clp: "Critical Loss Point Matrix",
      loss: "Economic Loss Prediction",
      farmerMode: "Farmer Mode",
      expertMode: "Expert Mode",
      heroHead: "Know When To Store. Know When To Act.",
      heroSub: "An intelligent post-harvest decision support system powered by Grain Health Index calculations, Critical Loss Point Detection, and Recommendation Intelligence."
    },
    te: {
      title: "ధాన్య సంరక్షకుడు",
      ghi: "ధాన్య ఆరోగ్య సూచిక",
      clp: "కీలక నష్ట నివారణ మాత్రిక",
      loss: "ఆర్థిక నష్ట అంచనా",
      farmerMode: "రైతు మోడ్",
      expertMode: "నిపుణుల మోడ్",
      heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి. ఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
      heroSub: "ధాన్య ఆరోగ్య సూచిక గణనలు, కీలక నష్ట నివారణ గుర్తింపు మరియు సిఫార్సు ఇంటెలిజెన్స్ ద్వారా ఆధారితమైన ఒక తెలివైన పంట అనంతర నిర్ణయ మద్దతు వ్యవస్థ."
    }
  };

  const activeLang = isTelugu ? text.te : text.en;

  // Real-time API Bridge to FastAPI calculations Engine
  useEffect(() => {
    async function executeEnginePass() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v3/analyze`, {
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
        if (response.ok) {
          const res = await response.json();
          setAnalytics({
            ghi: res.grain_health_index,
            lossInr: res.estimated_financial_loss_inr,
            lossKg: res.projected_weight_loss_kg,
            fungalRisk: res.fungal_risk_status,
            clp: {
              moisture: res.clp_matrix.clp_moisture_violation,
              temp: res.clp_matrix.clp_temp_violation,
              humidity: res.clp_matrix.clp_humidity_violation,
              duration: res.clp_matrix.clp_duration_violation,
              fungal: res.clp_matrix.clp_fungal_violation
            },
            advisories: res.action_advisory
          });
        }
      } catch (err) {
        console.error("FastAPI calculation bypass error", err);
      }
    }
    executeEnginePass();
  }, [cropType, moisture, temperature, humidity, mass]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-400 selection:text-slate-950">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-emerald-400 tracking-wider">{activeLang.title}</h1>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md">V3.0</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button onClick={() => setIsTelugu(!isTelugu)} className="text-xs font-bold font-mono px-3 py-2 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-800 transition">
            🌐 {isTelugu ? "ENGLISH" : "తెలుగు"}
          </button>
          
          {/* Mode Switch Plane */}
          <div className="bg-slate-900 p-1 rounded-xl border border-white/5 flex gap-1">
            <button onClick={() => setIsExpertMode(false)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${!isExpertMode ? 'bg-emerald-400 text-slate-950' : 'text-slate-400'}`}>
              {activeLang.farmerMode}
            </button>
            <button onClick={() => setIsExpertMode(true)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${isExpertMode ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'}`}>
              {activeLang.expertMode}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* SECTION 1: HERO CONTAINER */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-bold text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full uppercase">
            {isTelugu ? "పరిశోధన ఆధారిత నిర్ణయ వేదిక" : "Research-Driven Innovation Platform"}
          </span>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-none">
            {activeLang.heroHead}
          </h1>
          <p className="text-slate-400 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {activeLang.heroSub}
          </p>
        </section>

        {/* SECTION 2: IEEE & RESEARCH CREDIBILITY SUITE */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-white/5 py-8 text-center bg-slate-900/20 rounded-3xl px-4">
          <div><h4 className="text-2xl font-black text-white">1,269+</h4><p className="text-xs text-slate-500 mt-1">Papers Reviewed</p></div>
          <div><h4 className="text-2xl font-black text-white">20,412+</h4><p className="text-xs text-slate-500 mt-1">Patents Analyzed</p></div>
          <div><h4 className="text-2xl font-black text-white">FAO</h4><p className="text-xs text-slate-500 mt-1">Guidelines Referenced</p></div>
          <div><h4 className="text-2xl font-black text-white">Govt</h4><p className="text-xs text-slate-500 mt-1">Storage Standards Match</p></div>
        </section>

        {/* SECTION 4 & 6: CORE PERFORMANCE METRICS */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* GHI Showcase */}
          <div className="glass-panel p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{activeLang.ghi}</h3>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-6xl font-black text-emerald-400 tracking-tight">{analytics.ghi}</span>
              <span className="text-slate-500 font-mono text-sm">/100</span>
            </div>
            <div className="mt-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-md ${analytics.ghi > 85 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {analytics.ghi > 85 ? "EXCELLENT" : "CRITICAL WARNING"}
            </span></div>
          </div>

          {/* Economic Loss Intelligence */}
          <div className="glass-panel p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{activeLang.loss}</h3>
            <div className="mt-6">
              <span className="text-5xl font-black text-red-400 tracking-tight">₹{analytics.lossInr.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-xs text-slate-500 mt-4">Projected Weight Deficit: <strong className="text-slate-300 font-mono">{analytics.lossKg} kg</strong></p>
          </div>

          {/* Fungal Growth Prediction */}
          <div className="glass-panel p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fungal Proliferation Risk</h3>
            <div className="mt-6">
              <span className={`text-5xl font-black tracking-tight ${analytics.fungalRisk === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
                {analytics.fungalRisk}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-4">Calculated via Biological Activity Index curves</p>
          </div>
        </section>

        {/* INTERACTIVE SIMULATION CONTAINER */}
        <section className="grid lg:grid-cols-12 gap-8">
          <div className="glass-panel p-8 lg:col-span-5 space-y-6 bg-slate-900/30">
            <h3 className="text-base font-bold text-white tracking-tight">Parameters Assessment Input</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400">CROP CLASSIFICATION</label>
                <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full mt-1 bg-slate-950 border border-white/10 rounded-xl p-2.5 text-sm focus:border-emerald-400 text-white outline-none">
                  <option value="Paddy (Rice)">Paddy (Rice)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400"><span>MOISTURE</span><span className="text-emerald-400">{moisture}%</span></div>
                <input type="range" min="5" max="40" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} className="w-full mt-1 accent-emerald-400" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400"><span>TEMPERATURE</span><span className="text-cyan-400">{temperature}°C</span></div>
                <input type="range" min="0" max="75" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full mt-1 accent-cyan-400" />
              </div>
            </div>
          </div>

          {/* SECTION 7: ACTIONABLE RECOMMENDATION ENGINE */}
          <div className="glass-panel p-8 lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Recommendation Decision Engine</h3>
            <div className="space-y-3">
              {analytics.advisories.map((advice, i) => (
                <div key={i} className={`p-4 rounded-xl border text-sm leading-relaxed ${advice.includes("CRITICAL") ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-slate-900 border-white/5 text-slate-300'}`}>
                  {advice}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: CRITICAL LOSS POINT MATRIX */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">{activeLang.clp}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { code: "CLP-1", name: "Moisture Ceiling", active: analytics.clp.moisture },
              { code: "CLP-2", name: "Thermal Hotspot", active: analytics.clp.temp },
              { code: "CLP-3", name: "Relative Humidity", active: analytics.clp.humidity },
              { code: "CLP-4", name: "Duration Vault", active: analytics.clp.duration },
              { code: "CLP-5", name: "Fungal Incursion", active: analytics.clp.fungal },
            ].map((node) => (
              <div key={node.code} className={`glass-panel p-5 text-center border ${node.active ? 'border-red-500/30 bg-red-950/10' : 'border-white/5'}`}>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">{node.code}</span>
                <p className="text-xs font-bold mt-3 text-slate-300">{node.name}</p>
                <p className={`text-xs mt-1 font-mono font-bold ${node.active ? 'text-red-400' : 'text-slate-600'}`}>
                  {node.active ? "⚠️ CRITICAL" : "🟢 NOMINAL"}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
