"use client";

import Sidebar from "./Sidebar";
import Hero from "./Hero";
import MetricCards from "./MetricCards";
import SimulatorPanel from "./SimulatorPanel";
import AdvisoryPanel from "./AdvisoryPanel";
import CLPGrid from "./CLPGrid";
import HistoryTable from "./HistoryTable";
import ReportPanel from "./ReportPanel";

import { useTelemetry } from "../hooks/useTelemetry";
import { useAnalysis } from "../hooks/useAnalysis";

export default function Home() {
  const telemetry = useTelemetry();

  const analysis = useAnalysis({
    moisture: telemetry.moisture,
    temperature: telemetry.tempT3,
    humidity: telemetry.humidity,
    cropIndex: telemetry.cropIndex,
    massKg: telemetry.massKg,
    storageDays: telemetry.storageDays,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-auto">
        <Hero />

        <MetricCards analysis={analysis} />

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <SimulatorPanel telemetry={telemetry} />
          </div>

          <div className="lg:col-span-7">
            <AdvisoryPanel analysis={analysis} />
          </div>
        </div>

        <CLPGrid analysis={analysis} />

        <HistoryTable />

        <ReportPanel analysis={analysis} />
      </main>
    </div>
  );
}
