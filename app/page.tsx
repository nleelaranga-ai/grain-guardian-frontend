'use client';

import React, { useState } from 'react';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import CLPGrid from './components/CLPGrid';
import HistoryTable from './components/HistoryTable';
import ReportPanel from './components/ReportPanel';
import { useTelemetry } from './hooks/useTelemetry';
import { useHistory } from './hooks/useHistory';
import { useAnalysis } from './hooks/useAnalysis';

export default function App() {
  const [platformLaunched, setPlatformLaunched] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'clp' | 'history' | 'reports' | 'help' | 'settings'>('dashboard');
  const [lang, setLang] = useState<'EN' | 'TE'>('EN');

  const {
    selectedCropIndex,
    setSelectedCropIndex,
    bleConnected,
    setBleConnected,
    isStorageMode,
    setIsStorageMode,
    tempT1,
    setTempT1,
    tempT2,
    setTempT2,
    tempT3,
    setTempT3,
    interGranularHumidity,
    setInterGranularHumidity,
    ambientTemp,
    setAmbientTemp,
    ambientHumidity,
    setAmbientHumidity,
    activeCrop,
    currentEMC,
    tempGradient,
    bai,
    fungalRiskStatus,
    forceScenario
  } = useTelemetry();

  const {
    farmerName,
    setFarmerName,
    fpoName,
    setFpoName,
    activeBatchId,
    setActiveBatchId,
    initialMassKg,
    setInitialMassKg,
    storageDurationDays,
    setStorageDurationDays,
    historyLog,
    executeInspectionLog
  } = useHistory(activeCrop, isStorageMode, currentEMC, tempT2, tempT3, ambientTemp);

  const {
    ghiScore,
    lossInr,
    weightLossKg,
    apiStatus,
    handleRunScan,
    violations,
    currentStatus // Successfully bound from calculation context
  } = useAnalysis(
    activeCrop, 
    currentEMC, 
    isStorageMode, 
    tempT1, 
    tempT2, 
    tempT3, 
    interGranularHumidity, 
    ambientTemp, 
    ambientHumidity, 
    initialMassKg, 
    storageDurationDays, 
    fungalRiskStatus
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans">
      {!platformLaunched ? (
        <Hero 
          lang={lang} 
          setLang={setLang} 
          setPlatformLaunched={setPlatformLaunched} 
          ghiScore={ghiScore} 
          currentEMC={currentEMC} 
          lossInr={lossInr} 
          activeCrop={activeCrop} 
        />
      ) : (
        <div className="flex-1 flex flex-col xl:flex-row min-h-screen">
          <Sidebar 
            lang={lang} 
            setLang={setLang} 
            currentScreen={currentScreen} 
            setCurrentScreen={setCurrentScreen} 
            setPlatformLaunched={setPlatformLaunched} 
            bleConnected={bleConnected} 
            setBleConnected={setBleConnected} 
            tempT3={tempT3} 
            interGranularHumidity={interGranularHumidity} 
            isStorageMode={isStorageMode} 
          />

          <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-w-6xl mx-auto w-full">
            {currentScreen === 'dashboard' && (
              <Home
                lang={lang}
                activeCrop={activeCrop}
                selectedCropIndex={selectedCropIndex}
                setSelectedCropIndex={setSelectedCropIndex}
                isStorageMode={isStorageMode}
                setIsStorageMode={setIsStorageMode}
                tempT1={tempT1}
                setTempT1={setTempT1}
                tempT2={tempT2}
                setTempT2={setTempT2}
                tempT3={tempT3}
                setTempT3={setTempT3}
                interGranularHumidity={interGranularHumidity}
                setInterGranularHumidity={setInterGranularHumidity}
                ambientTemp={ambientTemp}
                setAmbientTemp={setAmbientTemp}
                ambientHumidity={ambientHumidity}
                setAmbientHumidity={setAmbientHumidity}
                currentEMC={currentEMC}
                ghiScore={ghiScore}
                apiStatus={apiStatus}
                lossInr={lossInr}
                weightLossKg={weightLossKg}
                fungalRiskStatus={fungalRiskStatus}
                bai={bai}
                historyLog={historyLog}
                tempGradient={tempGradient}
                forceScenario={forceScenario}
                handleRunScan={handleRunScan}
                executeInspectionLog={executeInspectionLog}
                currentStatus={currentStatus}
              />
            )}

            {currentScreen === 'clp' && (
              <CLPGrid
                lang={lang}
                violations={violations}
                currentEMC={currentEMC}
                activeCrop={activeCrop}
                tempGradient={tempGradient}
                tempT1={tempT1}
                tempT2={tempT2}
                tempT3={tempT3}
                storageDurationDays={storageDurationDays}
                bai={bai}
                fungalRiskStatus={fungalRiskStatus}
              />
            )}

            {currentScreen === 'history' && (
              <HistoryTable
                lang={lang}
                historyLog={historyLog}
              />
            )}

            {currentScreen === 'reports' && (
              <ReportPanel
                lang={lang}
                fpoName={fpoName}
                activeBatchId={activeBatchId}
                farmerName={farmerName}
                ghiScore={ghiScore}
                currentEMC={currentEMC}
                fungalRiskStatus={fungalRiskStatus}
                currentStatus={currentStatus}
                violations={violations}
                weightLossKg={weightLossKg}
                lossInr={lossInr}
                initialMassKg={initialMassKg}
                activeCrop={activeCrop}
                tempT1={tempT1}
                tempT2={tempT2}
                tempT3={tempT3}
                tempGradient={tempGradient}
                storageDurationDays={storageDurationDays}
                bai={bai}
              />
            )}

            {currentScreen === 'help' && (
              <div className="space-y-4 text-left animate-fade-in font-sans">
                <h3 className="text-xl font-black text-white uppercase">Hardware Calibration Center</h3>
                <div className="bg-slate-900 border border-white/5 p-6 rounded-xl space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase">Dallas Sensor Stack Calibration Formula</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Our lances rely on standard 1-Wire thermal sensors mapped cleanly inside a structural steel enclosure. Before deployment, submerge the complete assembly probe inside an ice-water solution (0.0°C) to correct structural skews within strict ±0.2°C bounds.</p>
                </div>
              </div>
            )}

            {currentScreen === 'settings' && (
              <div className="space-y-4 text-left animate-fade-in font-sans">
                <h3 className="text-xl font-black text-white uppercase font-sans">Console Settings</h3>
                <div className="bg-slate-900 border border-white/5 p-6 rounded-xl max-w-xl space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">Farmer Identity Title</label>
                    <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00FF9D]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase">FPO Organization Name</label>
                    <input type="text" value={fpoName} onChange={(e) => setFpoName(e.target.value)} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00FF9D]" />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
