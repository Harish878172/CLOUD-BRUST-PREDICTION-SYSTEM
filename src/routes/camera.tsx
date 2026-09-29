import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { GlassCard, SectionTitle } from "@/components/GlassCard";
import { Camera, Sparkles, Download, RefreshCw, Eye } from "lucide-react";

export const Route = createFileRoute("/camera")({
  head: () => ({
    meta: [
      { title: "ESP32 Camera — CloudShield AI" },
      { name: "description", content: "Live ESP32-CAM feed with AI-driven cloud and sky analysis." },
      { property: "og:title", content: "ESP32 Camera Feed" },
      { property: "og:description", content: "Live camera preview and AI analysis." },
    ],
  }),
  component: CameraPage,
});

function CameraPage() {
  return (
    <AppShell>
      <TopBar connected />
      <div className="px-5">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Camera</h1>
        <p className="text-sm text-white/50">ESP32-CAM live preview</p>
      </div>

      <div className="mt-5 px-5">
        <GlassCard className="p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            <div className="absolute inset-0 opacity-60"
              style={{ background: "radial-gradient(circle at 30% 30%, rgba(96,165,250,0.6), transparent 55%), radial-gradient(circle at 75% 70%, rgba(167,139,250,0.5), transparent 55%), radial-gradient(circle at 50% 90%, rgba(34,197,94,0.15), transparent 60%)" }}
            />
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-danger/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
            </div>
            <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur">
              720p · 24fps
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <Eye className="h-14 w-14 text-white/30" />
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl bg-black/40 p-2.5 text-[10px] text-white/80 backdrop-blur">
              <span>Cloud cover: 82%</span>
              <span>Sky score: 6.2</span>
              <span>SNR: 34dB</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <CamBtn icon={<RefreshCw className="h-4 w-4" />} label="Refresh" />
            <CamBtn icon={<Camera className="h-4 w-4" />} label="Capture" primary />
            <CamBtn icon={<Download className="h-4 w-4" />} label="Save" />
          </div>
          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary-glow py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.9)]">
            <Sparkles className="h-4 w-4" /> Analyze with AI
          </button>
        </GlassCard>
      </div>

      <div className="mt-6 px-5">
        <SectionTitle title="Recent Captures" />
        <div className="grid grid-cols-3 gap-2">
          {[
            "from-blue-500/50 to-indigo-800",
            "from-purple-500/50 to-slate-800",
            "from-sky-400/50 to-slate-900",
            "from-orange-400/40 to-slate-800",
            "from-emerald-400/40 to-slate-800",
            "from-red-400/40 to-slate-900",
          ].map((g, i) => (
            <div key={i} className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${g} border border-white/10`}>
              <div className="absolute bottom-1 left-1 rounded-md bg-black/40 px-1.5 py-0.5 text-[9px] text-white/80 backdrop-blur">
                {i + 1}h
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function CamBtn({ icon, label, primary }: { icon: React.ReactNode; label: string; primary?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 rounded-2xl py-3 text-[11px] font-semibold transition ${
      primary
        ? "bg-white text-slate-900"
        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
    }`}>
      {icon}
      {label}
    </button>
  );
}
