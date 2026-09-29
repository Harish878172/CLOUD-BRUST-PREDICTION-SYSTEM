import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { GlassCard } from "@/components/GlassCard";
import { ShieldAlert, Sparkles, Zap, Droplets, CloudRain, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Alert History — CloudShield AI" },
      { name: "description", content: "Historical timeline of AI alerts, weather events and system notifications." },
      { property: "og:title", content: "Alert History" },
      { property: "og:description", content: "Timeline of weather and AI events." },
    ],
  }),
  component: HistoryPage,
});

const alerts = [
  { tone: "danger", icon: CloudRain, title: "Cloudburst risk peaked", desc: "Risk score reached 78. Localized rainfall likely.", time: "Today · 14:32" },
  { tone: "warning", icon: ShieldAlert, title: "Humidity threshold crossed", desc: "Humidity above 75% for 20 min.", time: "Today · 14:20" },
  { tone: "primary", icon: Sparkles, title: "AI Recommendation", desc: "Secure outdoor equipment within 90 min.", time: "Today · 13:58" },
  { tone: "success", icon: CheckCircle2, title: "System check passed", desc: "All 5 sensors nominal after reboot.", time: "Today · 09:10" },
  { tone: "primary", icon: Droplets, title: "Humidity spike detected", desc: "Rapid +6% over 5 min.", time: "Yesterday · 22:41" },
  { tone: "warning", icon: Zap, title: "Power fluctuation", desc: "ESP32 rebooted after voltage dip.", time: "Yesterday · 18:03" },
] as const;

const toneMap = {
  danger: "bg-danger/15 text-danger border-danger/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  primary: "bg-primary/15 text-primary-glow border-primary/30",
  success: "bg-success/15 text-success border-success/30",
} as const;

function HistoryPage() {
  return (
    <AppShell>
      <TopBar connected />
      <div className="px-5">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Alert History</h1>
        <p className="text-sm text-white/50">Timeline of events & AI actions</p>
      </div>

      <div className="mt-4 px-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All", "AI", "Weather", "System"].map((f, i) => (
            <button key={f} className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              i === 0 ? "bg-gradient-to-r from-primary to-primary-glow text-white" : "border border-white/10 bg-white/5 text-white/70"
            }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3 px-5">
        {alerts.map((a, i) => {
          const Icon = a.icon;
          return (
            <GlassCard key={i} className="flex gap-3 p-4">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border ${toneMap[a.tone]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <span className="shrink-0 text-[10px] text-white/40">{a.time}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-white/60">{a.desc}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-6 px-5">
        <GlassCard>
          <p className="text-sm font-semibold text-white">Safety Instructions</p>
          <ul className="mt-2 space-y-2 text-xs text-white/70">
            <li className="flex gap-2"><span className="text-primary-glow">•</span> Move to elevated ground if flood alerts trigger.</li>
            <li className="flex gap-2"><span className="text-primary-glow">•</span> Unplug non-essential electronics during storms.</li>
            <li className="flex gap-2"><span className="text-primary-glow">•</span> Keep power banks charged for outages.</li>
          </ul>
        </GlassCard>
      </div>
    </AppShell>
  );
}
