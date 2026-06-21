"use client";

import Navbar from "./Navbar";
import Hero from "./Hero";
import KPICards from "./KPICards";
import AnalyticsSection from "./AnalyticsSection";
import TelemetryGauges from "./TelemetryGauges";
import RecommendationPanel from "./RecommendationPanel";
import CLPMatrix from "./CLPMatrix";
import LedgerTimeline from "./LedgerTimeline";
import ReportCenter from "./ReportCenter";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        <Hero />

        <KPICards />

        <AnalyticsSection />

        <div className="grid lg:grid-cols-2 gap-8">
          <TelemetryGauges />
          <RecommendationPanel />
        </div>

        <CLPMatrix />

        <LedgerTimeline />

        <ReportCenter />

      </main>

      <Footer />

    </div>
  );
}
