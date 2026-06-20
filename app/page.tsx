'use client';

import React, { useState, useEffect } from 'react';

interface ClpMatrix {
  clp_moisture_violation: boolean;
  clp_temp_violation: boolean;
  clp_humidity_violation: boolean;
  clp_duration_violation: boolean;
  clp_fungal_violation: boolean;
}

interface AnalyticsResult {
  grain_health_index: number;
  fungal_risk_status: string;
  biological_activity_index: number;
  projected_weight_loss_kg: number;
  estimated_financial_loss_inr: number;
  clp_matrix: ClpMatrix;
  action_advisory: string[];
}

export default function DeepSaaSPremiumDashboard() {
  const [lang, setLang] = useState<'EN' | 'TE'>('EN');
  const [activeLot, setActiveLot] = useState<string>('dd7e099a-75d2-49c9-957d-15b3ae0441a4');
  
  const [moisture, setMoisture] = useState<number>(14.2);
  const [temperature, setTemperature] = useState<number>(31.4);
  const [humidity, setHumidity] = useState<number>(62.5);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);

  // Native UI historical state matrix for pure SVG trend generation
  const [historyPoints, setHistoryPoints] = useState<number[]>([92, 88, 85, 78, 82, 74, 64]);

  const uiText = {
    EN: {
      title: "GRAINGUARDIAN AI",
      badge: "V3 PRO INTELLIGENCE",
      lotLabel: "MONITORED BATCH REGISTRY",
      runScan: "EXECUTE LIVE CLOUD COMPUTATION",
      ghiTitle: "GRAIN HEALTH COMPOSITE INDEX",
      financialRisk: "ESTIMATED LOSS EXPOSURE",
      fungalRisk: "FUNGAL ACTIVITY PROFILE",
      advisoryTitle: "DECISION SUPPORT RECOMMENDATIONS",
    },
    TE: {
      title: "గ్రెయిన్ గార్డియన్ AI",
      badge: "V3 ప్రో ఇంటెలిజెన్స్",
      lotLabel: "పర్యవేక్షించబడే నిల్వ లాట్లు",
      runScan: "లైవ్ క్లౌడ్ కంప్యూటేషన్ రన్ చేయండి",
      ghiTitle: "ధాన్యం ఆరోగ్య సూచిక సంకలనం",
      financialRisk: "అంచనా వేసిన ఆర్థిక నష్టం ముప్పు",
      fungalRisk: "శిలీంద్రాల క్రియాశీలత ప్రొఫైల్",
      advisoryTitle: "నిర్ణయ మద్దతు సిఫార్సులు",
    }
  };

  const executeLiveSaaSAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://grain-guardian-backend.onrender.com/api/v3/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: activeLot,
          moisture: moisture,
          temperature: temperature,
          humidity: humidity
        })
      });
      const data = await response.json();
      setAnalytics(data);

      // Append fresh index metrics dynamically into the track list
      setHistoryPoints(prev => [...prev.slice(1), data.grain_health_index]);

    } catch (err) {
      console.error("Critical Ingestion Pipeline Failure: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeLiveSaaSAnalysis();
  }, [activeLot]);

  // Compute dynamic SVG geometric string map based on index arrays
  const generateSvgPath = () => {
    const width = 500;
    const height = 150;
    const spacing = width / (historyPoints.length - 1);
    return historyPoints.map((val, idx) => {
      const x = idx * spacing;
      const y = height - ((val / 100) * height * 0.8 + 15); // Map to bounding layout box
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* NAVIGATION PANEL */}
      <header className="sticky top-0 z-50 bg-[#090d16]/70 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
          <h1 className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">{uiText[lang].title}</h1>
          <span className="text-[10px] font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{uiText[lang].badge}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-900/80 p-0.5 rounded-lg border border-white/5 flex">
            <button onClick={() => setLang('EN')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'EN' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400'}`}>EN</button>
            <button onClick={() => setLang('TE')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'TE' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400'}`}>తెలుగు</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN METRICS CONTROLS */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{uiText[lang].lotLabel}</label>
            <select value={activeLot} onChange={(e) => setActiveLot(e.target.value)} className="w-full bg-[#111c35] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer">
              <option value="dd7e099a-75d2-49c9-957d-15b3ae0441a4">Batch-09A (Paddy Standard) - Warehouse Block 1</option>
              <option value="maize-lot-uuid-placeholder-v3">Batch-02B (Hybrid Maize) - Silo Cluster 4</option>
            </select>
          </div>

          <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400">REAL-TIME SENSOR OVERRIDES</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-300">Grain Moisture Content</span>
                <span className="text-emerald-400 font-mono">{moisture.toFixed(1)}%</span>
              </div>
              <input type="range" min="10" max="22" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-300">Core Pile Temperature</span>
                <span className="text-cyan-400 font-mono">{temperature.toFixed(1)}°C</span>
              </div>
              <input type="range" min="20" max="48" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-300">Ambient Canopy Humidity</span>
                <span className="text-purple-400 font-mono">{humidity.toFixed(1)}%</span>
              </div>
              <input type="range" min="45" max="95" step="0.1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400" />
            </div>

            <button onClick={executeLiveSaaSAnalysis} disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold tracking-wide text-xs py-4 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.15)] uppercase">
              {loading ? "COMPUTING MATRIX..." : uiText[lang].runScan}
            </button>
          </div>

          <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">CRITICAL LOSS POINT (CLP) MATRIX STATUS</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: "CLP-1: Ingress Moisture Fault", val: analytics?.clp_matrix.clp_moisture_violation },
                { name: "CLP-2: Thermal Boundary Deficit", val: analytics?.clp_matrix.clp_temp_violation },
                { name: "CLP-3: Canopy Ambient Overflow", val: analytics?.clp_matrix.clp_humidity_violation },
                { name: "CLP-4: Lifespan Longevity Exceeded", val: analytics?.clp_matrix.clp_duration_violation },
                { name: "CLP-5: Micro-Organic Infection Vector", val: analytics?.clp_matrix.clp_fungal_violation },
              ].map((clp, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#111c35]/50 border border-white/5 p-3 rounded-xl">
                  <span className="text-xs font-medium text-slate-300">{clp.name}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${clp.val ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {clp.val ? "VIOLATION" : "NOMINAL"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN ANALYTICS ROW DISPLAY */}
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{uiText[lang].ghiTitle}</h4>
                <p className="text-4xl font-black font-mono tracking-tight text-white mt-4">{analytics?.grain_health_index ?? "--"}<span className="text-xs font-normal text-slate-500">/100</span></p>
              </div>
              <div className="mt-4">
                <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md ${
                  (analytics?.grain_health_index ?? 100) >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {(analytics?.grain_health_index ?? 100) >= 80 ? "EXCELLENT STATUS" : "DEGRADED CONDITION"}
                </span>
              </div>
            </div>

            <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{uiText[lang].financialRisk}</h4>
                <p className="text-3xl font-black font-mono text-red-400 mt-5">₹{analytics?.estimated_financial_loss_inr.toLocaleString('en-IN') ?? "0.00"}</p>
              </div>
              <p className="text-[11px] text-slate-400 mt-4">Calculated mass deficit weight: <span className="text-slate-200 font-mono font-bold">{analytics?.projected_weight_loss_kg ?? "0.0"} kg</span></p>
            </div>

            <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{uiText[lang].fungalRisk}</h4>
                <p className={`text-3xl font-black mt-4 tracking-wide ${analytics?.fungal_risk_status === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>{analytics?.fungal_risk_status ?? "LOW"}</p>
              </div>
              <div className="bg-[#111c35]/60 rounded-lg p-2 flex justify-between items-center mt-2 border border-white/5">
                <span className="text-[11px] text-slate-400">Biological Index:</span>
                <span className="text-xs font-mono font-bold text-slate-200">{analytics?.biological_activity_index ?? "0.0"}</span>
              </div>
            </div>
          </div>

          {/* ZERO-DEPENDENCY PURE NATIVE SVG TIMELINE INDEX CHART */}
          <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">CHRONOLOGICAL TREND INTERSECTION MATRIX</h3>
            <p className="text-[11px] text-slate-500 mb-6 uppercase tracking-wider">Real-Time Core Grain Health Index (GHI) Vector Path</p>
            
            <div className="w-full bg-[#060b13]/80 p-4 rounded-xl border border-white/5">
              <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                {/* Horizontal Baseline Grids */}
                <line x1="0" y1="15" x2="500" y2="15" stroke="#1f2937" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#1f2937" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="135" x2="500" y2="135" stroke="#1f2937" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Smooth Vector Curve Fill */}
                <path d={generateSvgPath()} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                
                {/* Vector Nodes */}
                {historyPoints.map((val, idx) => {
                  const spacing = 500 / (historyPoints.length - 1);
                  const cx = idx * spacing;
                  const cy = 150 - ((val / 100) * 150 * 0.8 + 15);
                  return (
                    <g key={idx} className="group/node">
                      <circle cx={cx} cy={cy} r="4" fill="#030712" stroke="#10b981" strokeWidth="2.5" />
                      <text x={cx} y={cy - 10} textAnchor="middle" fill="#6b7280" className="text-[9px] font-mono font-bold">{val}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="bg-[#0b1324]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl border-l-4 border-emerald-500">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">{uiText[lang].advisoryTitle}</h3>
            <div className="space-y-3">
              {analytics?.action_advisory.map((adv, index) => (
                <div key={index} className="flex gap-3 items-start bg-[#111c35]/40 border border-white/5 p-4 rounded-xl">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <p className="text-sm font-medium text-slate-200 leading-relaxed">{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}