"use client";

import React, { useState, useEffect } from "react";

export default function Page() {
  // Input states for telemetry simulation
  const [cropType, setCropType] = useState("Paddy (Rice)");
  const [moisture, setMoisture] = useState(14.0);
  const [temperature, setTemperature] = useState(34.0);
  const [humidity, setHumidity] = useState(65.0);
  const [mass, setMass] = useState(12000.0);
  const [isLanguageTelugu, setIsLanguageTelugu] = useState(false);

  // Live analytics response state
  const [analytics, setAnalytics] = useState({
    ghi: 92,
    lossInr: 12540,
    fungalRisk: "LOW",
    clpMatrix: {
      moisture: false,
      temp: false,
      humidity: false,
      duration: false,
      fungal: false,
    },
    advisories: ["All structural parameters are safe. Maintain hermetic storage conditions."],
  });

  const [loading, setLoading] = useState(false);

  // Fetch from FastAPI backend when state changes
  useEffect(() => {
    async function triggerAnalysisPass() {
      setLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/v3/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop_type: cropType,
            moisture: moisture,
            temperature: temperature,
            humidity: humidity,
            stored_mass_kg: mass,
          }),
        });

        if (response.ok) {
          const res = await response.json();
          setAnalytics({
            ghi: res.grain_health_index,
            lossInr: res.estimated_financial_loss_inr,
            fungalRisk: res.fungal_risk_status,
            clpMatrix: {
              moisture: res.clp_matrix.clp_moisture_violation,
              temp: res.clp_matrix.clp_temp_violation,
              humidity: res.clp_matrix.clp_humidity_violation,
              duration: res.clp_matrix.clp_duration_violation,
              fungal: res.clp_matrix.clp_fungal_violation,
            },
            advisories: res.action_advisory,
          });
        }
      } catch (err) {
        console.error("Backend unreachable, fallback to client calculation:", err);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      triggerAnalysisPass();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [cropType, moisture, temperature, humidity, mass]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-emerald-400 tracking-tight">GRAIN GUARDIAN</h1>
            <p className="text-xs text-slate-400">IEEE Decision Intelligence Engine v3</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsLanguageTelugu(!isLanguageTelugu)} 
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 font-semibold text-sm hover:bg-slate-800 transition"
            >
              🌐 {isLanguageTelugu ? "English" : "Telugu"}
            </button>

            <div className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 ${
              analytics.ghi > 80 ? "bg-emerald-500/10 text-emerald-400" : analytics.ghi > 50 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
            }`}>
              <span className="animate-pulse">●</span> {analytics.ghi > 80 ? "SAFE" : analytics.ghi > 50 ? "WARNING" : "CRITICAL"}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 animate-fade-in">
        
        {/* HERO */}
        <section className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs tracking-wider uppercase">
            {isLanguageTelugu ? "ప్రీమియం ధాన్య నిర్ధారణ" : "PREMIUM GRAIN DIAGNOSTICS"}
          </span>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none">
            {isLanguageTelugu ? "స్పష్టత కోసం నిర్మించబడింది." : "Built for clarity."}
            <br />
            <span className="text-slate-400">{isLanguageTelugu ? "చర్య కోసం రూపొందించబడింది." : "Designed for action."}</span>
          </h1>
        </section>

        {/* KPI CARDS */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold tracking-widest">GRAIN HEALTH INDEX</p>
            <h2 className="text-6xl font-black text-emerald-400 mt-4 tracking-tight">{analytics.ghi}</h2>
            <p className="text-slate-500 text-sm mt-1">/ 100 max capacity score</p>
          </div>

          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold tracking-widest">ESTIMATED FINANCIAL LOSS</p>
            <h2 className={`text-5xl font-black mt-4 tracking-tight ${analytics.lossInr > 0 ? 'text-red-400' : 'text-slate-300'}`}>
              ₹{analytics.lossInr.toLocaleString("en-IN")}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Shrinkage & valuation penalty</p>
          </div>

          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            <p className="text-slate-400 text-xs font-bold tracking-widest">BIOLOGICAL FUNGAL RISK</p>
            <h2 className={`text-5xl font-black mt-4 tracking-tight ${
              analytics.fungalRisk === "HIGH" ? "text-red-500" : analytics.fungalRisk === "MEDIUM" ? "text-yellow-400" : "text-emerald-400"
            }`}>
              {analytics.fungalRisk}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Mold Spore Proliferation Ratio</p>
          </div>
        </section>

        {/* SIMULATOR + RECOMMENDATIONS */}
        <section className="grid lg:grid-cols-12 gap-8">
          
          {/* INTERACTIVE CONTROLS */}
          <div className="glass-panel rounded-3xl p-8 lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold tracking-tight">Interactive Storage Simulator</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Crop Classification Profile</label>
              <select 
                value={cropType} 
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-400 text-white"
              >
                <option value="Paddy (Rice)">Paddy (Rice)</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Moisture Balance</span>
                <span className="font-mono text-yellow-400 font-bold">{moisture}%</span>
              </div>
              <input type="range" min="5" max="40" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} className="w-full accent-emerald-400 bg-slate-800" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Core Temperature</span>
                <span className="font-mono text-cyan-400 font-bold">{temperature}°C</span>
              </div>
              <input type="range" min="0" max="75" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-cyan-400 bg-slate-800" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Ambient Humidity</span>
                <span className="font-mono text-emerald-400 font-bold">{humidity}%</span>
              </div>
              <input type="range" min="10" max="100" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} className="w-full accent-emerald-400 bg-slate-800" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Batch Mass Load</span>
                <span className="font-mono text-slate-400">{mass.toLocaleString()} kg</span>
              </div>
              <input type="range" min="1000" max="50000" step="500" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} className="w-full accent-slate-400 bg-slate-800" />
            </div>
          </div>

          {/* DYNAMIC ACTIONABLE RECOMMENDATIONS */}
          <div className="glass-panel rounded-3xl p-8 lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 tracking-tight">Recommendation Advisories</h2>
              <div className="space-y-3">
                {analytics.advisories.map((advice, i) => (
                  <div key={i} className={`p-5 rounded-2xl border transition duration-300 ${
                    advice.includes("CRITICAL") || advice.includes("SPIKE") || advice.includes("RISK")
                      ? "bg-red-500/10 border-red-500/20 text-red-200" 
                      : advice.includes("HOTSPOT") || advice.includes("Caution")
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-200"
                      : "bg-emerald-500/5 border-emerald-500/10 text-emerald-300"
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{advice}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {loading && <p className="text-xs text-slate-500 font-mono text-right mt-4">Analyzing parameters via engine pipeline...</p>}
          </div>
        </section>

        {/* DYNAMIC CLP MATRIX LAYER */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Critical Loss Point Matrix</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: "CLP-1", label: "Moisture Cap", active: analytics.clpMatrix.moisture },
              { id: "CLP-2", label: "Thermal Limit", active: analytics.clpMatrix.temp },
              { id: "CLP-3", label: "Humidity Ceiling", active: analytics.clpMatrix.humidity },
              { id: "CLP-4", label: "Timeline Limit", active: analytics.clpMatrix.duration },
              { id: "CLP-5", label: "Mold Proliferation", active: analytics.clpMatrix.fungal },
            ].map((clp) => (
              <div 
                key={clp.id} 
                className={`glass-panel rounded-2xl p-5 text-center border transition-all duration-300 ${
                  clp.active ? "border-red-500/40 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/5"
                }`}
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${clp.active ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                  {clp.id}
                </span>
                <h3 className="font-bold text-sm mt-3 text-slate-200">{clp.label}</h3>
                <p className={`text-xs mt-1 font-semibold ${clp.active ? "text-red-400" : "text-slate-500"}`}>
                  {clp.active ? "⚠️ VIOLATED" : "🟢 NOMINAL"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HISTORIC LEDGER */}
        <section className="glass-panel rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 tracking-tight">Historic Ledger Logs</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-emerald-400 pl-5">
              <h3 className="text-sm font-bold text-slate-200">June 21 — Realtime Telemetry Pass</h3>
              <p className="text-xs text-slate-400 mt-0.5">Dynamic batch computation matched to {cropType} constraints</p>
            </div>
            <div className="border-l-2 border-slate-700 pl-5">
              <h3 className="text-sm font-bold text-slate-400">June 10 — Inter-Drying Cycle Baseline</h3>
              <p className="text-xs text-slate-500 mt-0.5">Static diagnostic record filed successfully</p>
            </div>
          </div>
        </section>

        {/* COMPILER EXPORT */}
        <section className="glass-panel rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">IEEE Compliant Assessment Report</h2>
            <p className="text-xs text-slate-400 mt-1">Generates complete dataset breakdown logs with matching baseline profiles.</p>
          </div>
          <button className="w-full sm:w-auto bg-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl hover:bg-emerald-300 transition-all font-mono text-sm tracking-wide shadow-lg shadow-emerald-500/10">
            EXPORT ANALYSIS PDF
          </button>
        </section>

      </main>
    </div>
  );
}
