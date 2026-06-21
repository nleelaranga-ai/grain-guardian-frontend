"use client";

import React, { useState, useEffect } from "react";

// 1. TypeScript ఇంటర్‌ఫేస్ టైప్‌ను స్పష్టంగా డిఫైన్ చేయడం
interface UIText {
  title: string;
  tagline: string;
  cta: string;
  heroHead: string;
  heroSub: string;
  readinessLabel: string;
  safe: string;
  unsafe: string;
  ghiLabel: string;
  conditionExcellent: string;
  conditionWarning: string;
  riskLabel: string;
  riskDesc: string;
  riskDescHigh: string;
  financialLabel: string;
  weightLoss: string;
  controlsLabel: string;
  actionsLabel: string;
  ledgerLabel: string;
  downloadCta: string;
  farmerMode: string; // Vercel లోపం నివారణకు జోడించబడింది
  expertMode: string;  // Vercel లోపం నివారణకు జోడించబడింది
}

export default function PremiumProductExperience() {
  // అప్లికేషన్ కంట్రోల్ స్టేట్స్
  const [isTelugu, setIsTelugu] = useState<boolean>(false);
  const [isExpertMode, setIsExpertMode] = useState<boolean>(false);

  // సిమ్యులేషన్ పారామితుల స్టేట్స్
  const [cropType, setCropType] = useState<string>("Paddy (Rice)");
  const [moisture, setMoisture] = useState<number>(14.0);
  const [temperature, setTemperature] = useState<number>(34.0);
  const [humidity, setHumidity] = useState<number>(65.0);
  const [mass, setMass] = useState<number>(12000);

  // బ్యాకెండ్ అనలిటిక్స్ రెస్పాన్స్ స్టేట్
  const [metrics, setMetrics] = useState({
    ghi: 92,
    lossInr: 12540,
    lossKg: 240,
    riskLevel: "LOW",
    advisories: [] as string[],
    violations: { moisture: false, temp: false, humidity: false }
  });

  // 2. ఖచ్చితమైన తెలుగు అనువాద డిక్షనరీ (ట్రాన్స్లిటరేషన్ కాదు)
  const lexicons: { en: UIText; te: UIText } = {
    en: {
      title: "GRAINGUARDIAN",
      tagline: "Storage Intelligence for Post-Harvest Decisions",
      cta: "Start Assessment",
      heroHead: "Know when to store.\nKnow when to act.",
      heroSub: "Assess grain conditions, understand storage risks, and receive clear recommendations.",
      readinessLabel: "Storage Readiness",
      safe: "Safe to Store",
      unsafe: "Continue Drying",
      ghiLabel: "Grain Health Score",
      conditionExcellent: "Excellent Condition",
      conditionWarning: "Action Recommended",
      riskLabel: "Storage Risk",
      riskDesc: "Current conditions indicate low probability of storage deterioration.",
      riskDescHigh: "Immediate thermal and moisture stabilization protocols required.",
      financialLabel: "Potential Financial Impact",
      weightLoss: "Estimated weight loss:",
      controlsLabel: "Storage Assessment",
      actionsLabel: "Recommended Actions",
      ledgerLabel: "Recent Assessments",
      downloadCta: "Download Assessment Report",
      farmerMode: "Farmer",
      expertMode: "Expert"
    },
    te: {
      title: "ధాన్యసంరక్షకుడు",
      tagline: "పంట అనంతర నిల్వ నిర్ణయాల కోసం తెలివైన వేదిక",
      cta: "అంచనాను ప్రారంభించండి",
      heroHead: "ఎప్పుడు నిల్వ చేయాలో తెలుసుకోండి.\nఎప్పుడు చర్య తీసుకోవాలో తెలుసుకోండి.",
      heroSub: "ధాన్య పరిస్థితులను అంచనా వేసి, నిల్వ ప్రమాదాలను అర్థం చేసుకొని, స్పష్టమైన సూచనలు పొందండి.",
      readinessLabel: "నిల్వ సంసిద్ధత",
      safe: "నిల్వకు సురక్షితం",
      unsafe: "ఆరబెట్టడం కొనసాగించండి",
      ghiLabel: "ధాన్య ఆరోగ్య సూచిక",
      conditionExcellent: "అద్భుతమైన పరిస్థితి",
      conditionWarning: "చర్య తీసుకో వలసి ఉంది",
      riskLabel: "నిల్వ ప్రమాదం",
      riskDesc: "ప్రస్తుత పరిస్థితులు ధాన్య నిల్వ క్షీణతకు తక్కువ సంభావ్యతను సూచిస్తున్నాయి.",
      riskDescHigh: "వెంటనే ఉష్ణోగ్రత మరియు తేమ స్థిరీకరణ నిబంధనలు అవసరం.",
      financialLabel: "సాధ్యమయ్యే ఆర్థిక నష్టం",
      weightLoss: "అంచనా వేసిన బరువు నష్టం:",
      controlsLabel: "నిల్వ పారామితుల పరిశీలన",
      actionsLabel: "సిఫార్సు చేయబడిన చర్యలు",
      ledgerLabel: "ఇటీవలి పరిశీలనలు",
      downloadCta: "ధాన్య మూల్యాంకన నివేదికను డౌన్‌లోడ్ చేయండి",
      farmerMode: "రైతు",
      expertMode: "నిపుణుడు"
    }
  };

  const UI = isTelugu ? lexicons.te : lexicons.en;

  // FastAPI బ్యాకెండ్ ఇంజిన్‌కు కనెక్ట్ చేసే లైవ్ ఎఫెక్ట్ పైప్‌లైన్
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
          setMetrics({
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
    <div className="min-h-screen bg-slate-950 text-white scroll-smooth overflow-x-hidden">
      
      {/* 3. మినిమలిస్టిక్ ఆపిల్-ఇన్‌స్పెక్టెడ్ నావిగేషన్ క్రోమ్ */}
      <nav className="fixed top-0 left-0 w-full h-[72px] border-b border-white/5 bg-slate-950/60 backdrop-blur-2xl z-50 px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-widest text-white">{UI.title}</span>
          <span className="text-[10px] text-slate-500 font-medium tracking-tight hidden sm:block">{UI.tagline}</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsTelugu(!isTelugu)} 
            className="text-xs font-bold tracking-wider text-slate-400 hover:text-white font-mono transition"
          >
            {isTelugu ? "ENGLISH" : "తెలుగు"}
          </button>
          
          <div className="h-4 w-[1px] bg-white/10" />

          {/* ఇప్పుడు ఎర్రర్ లేకుండా కరెక్ట్‌గా పనిచేసే డ్యూయల్ మోడ్ స్విచ్ */}
          <button 
            onClick={() => setIsExpertMode(!isExpertMode)} 
            className="text-xs font-bold tracking-wider text-slate-400 hover:text-white transition"
          >
            {isExpertMode ? UI.farmerMode : UI.expertMode}
          </button>

          <a href="#assess" className="hidden md:inline-block bg-white text-slate-950 text-xs font-bold px-5 py-2.5 rounded-full hover:bg-slate-200 transition">
            {UI.cta}
          </a>
        </div>
      </nav>

      {/* సెక్షన్ 1: హేరో పేజీ */}
      <section className="min-h-screen container max-w-[1600px] mx-auto px-6 flex flex-col justify-center items-center text-center space-y-8 pt-20">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight whitespace-pre-line leading-[0.95] text-white">
            {UI.heroHead}
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            {UI.heroSub}
          </p>
        </div>
        <a href="#assess" className="bg-emerald-400 text-slate-950 text-sm font-bold px-8 py-4 rounded-full hover:scale-105 transition duration-300">
          {UI.cta}
        </a>
      </section>

      {/* సెక్షన్ 2: స్టోరేజ్ సంసిద్ధత (READINESS) */}
      <section className="premium-section min-h-[90vh] bg-slate-900/10 text-center px-6 border-t border-white/5">
        <span className="story-label">{UI.readinessLabel}</span>
        <h2 className={`text-6xl md:text-8xl font-black tracking-tighter mt-6 transition duration-500 ${
          metrics.ghi > 85 ? "text-emerald-400" : "text-red-400"
        }`}>
          {metrics.ghi > 85 ? UI.safe : UI.unsafe}
        </h2>
        <p className="text-slate-400 mt-4 max-w-md text-sm md:text-base font-medium">
          {isExpertMode && Object.values(metrics.violations).some(Boolean)
            ? `Active Parameters: ${metrics.violations.moisture ? 'Moisture Spikes ' : ''}${metrics.violations.temp ? 'Thermal Overload' : ''}`
            : UI.riskDesc}
        </p>
      </section>

      {/* సెక్షన్ 3: ధాన్య ఆరోగ్య స్కోర్ */}
      <section className="premium-section text-center px-6">
        <span className="story-label">{UI.ghiLabel}</span>
        <div className="giant-stat text-emerald-400 mt-4 font-black">{metrics.ghi}</div>
        <span className="text-slate-400 text-lg font-bold tracking-wide mt-2">
          {metrics.ghi > 85 ? UI.conditionExcellent : UI.conditionWarning}
        </span>
      </section>

      {/* సెక్షన్ 4: స్టోరేజ్ రిస్క్ అంచనా */}
      <section className="premium-section text-center bg-slate-900/10 px-6 border-y border-white/5">
        <span className="story-label">{UI.riskLabel}</span>
        <h2 className={`text-7xl md:text-9xl font-black tracking-tight mt-4 ${
          metrics.riskLevel === "HIGH" ? "text-red-400" : "text-cyan-400"
        }`}>{metrics.riskLevel}</h2>
        <p className="text-slate-400 text-sm max-w-sm mt-4 font-medium">
          {metrics.riskLevel === "HIGH" ? UI.riskDescHigh : UI.riskDesc}
        </p>
      </section>

      {/* సెక్షన్ 5: ఆర్థిక నష్టం అంచనా */}
      <section className="premium-section text-center px-6">
        <span className="story-label">{UI.financialLabel}</span>
        <div className="giant-stat text-red-400 mt-4 font-black">
          ₹{metrics.lossInr.toLocaleString("en-IN")}
        </div>
        <p className="text-slate-400 text-base font-medium mt-4">
          {UI.weightLoss} <span className="font-mono text-white font-bold">{metrics.lossKg} kg</span>
        </p>
      </section>

      {/* సెక్షన్ 6: ఇంటరాక్టివ్ కంట్రోల్స్ స్లైడర్స్ */}
      <section id="assess" className="premium-section px-6 border-t border-white/5 scroll-mt-20">
        <div className="w-full max-w-3xl space-y-12">
          <div className="text-center">
            <span className="story-label">{UI.controlsLabel}</span>
          </div>

          <div className="glass-card-subtle p-8 md:p-12 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-slate-400 uppercase font-mono">Crop Classification Profile</label>
              <select 
                value={cropType} 
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-400 transition"
              >
                <option value="Paddy (Rice)">Paddy (Rice)</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-300">Moisture Content</span>
                <span className="font-mono text-emerald-400 font-bold">{moisture}%</span>
              </div>
              <input type="range" min="5" max="35" step="0.1" value={moisture} onChange={(e) => setMoisture(parseFloat(e.target.value))} className="w-full accent-emerald-400 bg-slate-800 h-1 rounded-lg appearance-none" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-300">Core Temperature</span>
                <span className="font-mono text-cyan-400 font-bold">{temperature}°C</span>
              </div>
              <input type="range" min="10" max="65" step="0.5" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-cyan-400 bg-slate-800 h-1 rounded-lg appearance-none" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-300">Ambient Relative Humidity</span>
                <span className="font-mono text-yellow-400 font-bold">{humidity}%</span>
              </div>
              <input type="range" min="20" max="95" step="1" value={humidity} onChange={(e) => setHumidity(parseFloat(e.target.value))} className="w-full accent-yellow-400 bg-slate-800 h-1 rounded-lg appearance-none" />
            </div>

            {/* ఎక్స్‌పర్ట్ మోడ్‌లో మాత్రమే కనిపించే అధునాతన మాస్ స్లైడర్ */}
            {isExpertMode && (
              <div className="space-y-3 pt-4 border-t border-white/5 animate-fade-in">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-400">Total Batch Volumetric Mass</span>
                  <span className="font-mono text-slate-300">{mass.toLocaleString()} kg</span>
                </div>
                <input type="range" min="1000" max="50000" step="500" value={mass} onChange={(e) => setMass(parseInt(e.target.value))} className="w-full accent-slate-500 bg-slate-800 h-1 rounded-lg appearance-none" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* సెక్షన్ 7: సిఫార్సు చేయబడిన నిర్ధారణ ప్యానెల్ */}
      <section className="premium-section px-6 bg-slate-900/10 border-t border-white/5">
        <div className="w-full max-w-4xl space-y-12">
          <div className="text-center">
            <span className="story-label">{UI.actionsLabel}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {metrics.advisories.length > 0 ? (
              metrics.advisories.map((advice, index) => (
                <div key={index} className="glass-card-subtle p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">➔</span>
                    <h4 className="font-bold text-sm tracking-wide text-slate-200">
                      {advice.split(":")[0] || "Action Guideline"}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {advice.split(":")[1] || advice}
                  </p>
                </div>
              ))
            ) : (
              <div className="glass-card-subtle p-6 col-span-2 text-center text-sm text-slate-400">
                🟢 All parameters are stable. No corrective actions are required.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* సెక్షన్ 8: ఇటీవలి రికార్డుల టైమ్‌లైన్ */}
      <section className="premium-section px-6">
        <div className="w-full max-w-xl space-y-10">
          <div className="text-center">
            <span className="story-label">{UI.ledgerLabel}</span>
          </div>

          <div className="space-y-8 relative before:absolute before:top-2 before:left-[11px] before:w-[1px] before:h-[80%] before:bg-white/10">
            <div className="flex gap-6 relative">
              <div className="w-6 h-6 rounded-full bg-slate-950 border-2 border-emerald-400 z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold font-mono text-slate-500">June 21</span>
                <p className="text-sm font-medium text-slate-300 mt-1">Realtime Storage Assessment Logged</p>
              </div>
            </div>

            <div className="flex gap-6 relative">
              <div className="w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-700 z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
              <div>
                <span className="text-xs font-bold font-mono text-slate-500">June 10</span>
                <p className="text-sm font-medium text-slate-400 mt-1">Mechanical Bulk Drying Run Recorded</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* సెక్షన్ 9: నివేదికను డౌన్‌లోడ్ చేసే బటన్ */}
      <section className="premium-section text-center px-6 border-t border-white/5 bg-slate-900/20">
        <button className="bg-white text-slate-950 font-bold text-xs tracking-widest px-8 py-4 rounded-xl hover:bg-slate-200 transition-all uppercase font-mono shadow-xl shadow-white/5">
          {UI.downloadCta}
        </button>
      </section>

    </div>
  );
}
