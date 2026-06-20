'use client';

import React, { useState } from 'react';

export default function FarmerDashboard() {
  const [lang, setLang] = useState<'EN' | 'TE'>('EN');
  const [ghiScore, setGhiScore] = useState<number>(85);
  const [moisture, setMoisture] = useState<number>(13.2);
  const [temp, setTemp] = useState<number>(31.5);
  const [humidity, setHumidity] = useState<number>(68.0);
  const [cropType, setCropType] = useState<string>('Paddy');
  const [lossInr, setLossInr] = useState<number>(0);

  const text = {
    EN: {
      title: "GrainGuardian",
      subtitle: "Intelligent Post-Harvest Decision System",
      welcome: "Welcome Back, Prasad!",
      overallHealth: "GRAIN HEALTH INDEX",
      statusSafe: "EXCELLENT / SAFE TO STORE",
      statusWarning: "WARNING / DRIER NEEDED",
      statusCritical: "CRITICAL / TAKE ACTION NOW",
      moistureLabel: "Grain Moisture",
      tempLabel: "Pile Temperature",
      humidityLabel: "Air Humidity",
      financialRisk: "Financial Loss Risk",
      runScan: "RUN NEW STORAGE SCAN",
      connectProbe: "CONNECT TESTING PROBE VIA BLE",
      activeLots: "Active Storage Lots",
    },
    TE: {
      title: "గ్రెయిన్ గార్డియన్",
      subtitle: "తెలివైన పంట నిల్వ నిర్ణయ వ్యవస్థ",
      welcome: "స్వాగతం, ప్రసాద్!",
      overallHealth: "ధాన్యం ఆరోగ్య సూచిక",
      statusSafe: "అద్భుతం / నిల్వకు సురక్షితం",
      statusWarning: "హెచ్చరిక / ఆరబెట్టడం అవసరం",
      statusCritical: "ప్రమాదం / వెంటనే చర్య తీసుకోండి",
      moistureLabel: "ధాన్యంలో తేమ శాతం",
      tempLabel: "కుప్ప ఉష్ణోగ్రత",
      humidityLabel: "గాలిలో తేమ",
      financialRisk: "ఆర్థిక నష్టం ప్రమాదం",
      runScan: "కొత్త నిల్వ పరీక్షను ప్రారంభించండి",
      connectProbe: "బ్లూటూత్ ప్రోబ్‌ను కనెక్ట్ చేయండి",
      activeLots: "ప్రస్తుత నిల్వ నివేదికలు",
    }
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-500', msg: text[lang].statusSafe };
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-400', msg: text[lang].statusWarning };
    return { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-500', msg: text[lang].statusCritical };
  };

  const status = getStatusColor(ghiScore);

  const handleRunScan = async () => {
    try {
      // Temporarily points to a generic endpoint or tests calculations locally
      const mockGhi = Math.floor(Math.random() * (100 - 30) + 30);
      setGhiScore(mockGhi);
      if (mockGhi < 80) {
        setLossInr((80 - mockGhi) * 150);
      } else {
        setLossInr(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-slate-900 text-white px-6 py-5 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-emerald-400">{text[lang].title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{text[lang].subtitle}</p>
        </div>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button onClick={() => setLang('EN')} className={`px-4 py-2 text-lg font-bold rounded-md transition-colors ${lang === 'EN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>EN</button>
          <button onClick={() => setLang('TE')} className={`px-4 py-2 text-lg font-bold rounded-md transition-colors ${lang === 'TE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>తెలుగు</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{text[lang].welcome}</h2>

        <div className={`bg-white rounded-2xl p-8 shadow-sm border-t-8 ${status.border} mb-8`}>
          <p className="text-center text-sm font-bold tracking-wider text-slate-500 uppercase">{text[lang].overallHealth}</p>
          <div className="flex flex-col items-center my-4">
            <span className={`text-7xl font-black px-6 py-2 rounded-2xl text-white ${status.bg}`}>{ghiScore}</span>
            <p className={`text-xl font-extrabold mt-4 text-center ${status.text}`}>{status.msg}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-500 uppercase">{text[lang].moistureLabel}</p>
            <p className="text-4xl font-black text-slate-800 mt-2">{moisture}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-500 uppercase">{text[lang].tempLabel}</p>
            <p className="text-4xl font-black text-slate-800 mt-2">{temp}°C</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-500 uppercase">{text[lang].humidityLabel}</p>
            <p className="text-4xl font-black text-slate-800 mt-2">{humidity}%</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-rose-800 uppercase tracking-wider">{text[lang].financialRisk}</p>
          </div>
          <p className="text-3xl font-black text-rose-600">₹{lossInr}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button onClick={handleRunScan} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-bold py-5 px-6 rounded-xl shadow transition-colors text-center">
            {text[lang].runScan}
          </button>
        </div>
      </main>
    </div>
  );
}