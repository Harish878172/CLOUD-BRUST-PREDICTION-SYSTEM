import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { GlassCard, SectionTitle } from "@/components/GlassCard";
import { TrendChart } from "@/components/TrendChart";
import { TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Sensor Analytics — CloudShield AI" },
      { name: "description", content: "24-hour trend graphs for temperature, humidity and light intensity captured by ESP32 sensors." },
      { property: "og:title", content: "Sensor Analytics" },
      { property: "og:description", content: "Trends for temperature, humidity and light." },
    ],
  }),
  component: AnalyticsPage,
});

const ranges = ["1H", "24H", "7D", "30D"] as const;

function AnalyticsPage() {
  return (
    <AppShell>
      <TopBar connected />
      <div className="px-5">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Analytics</h1>
        <p className="text-sm text-white/50">Sensor trends and AI insights</p>

        <div className="mt-4 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
          {ranges.map((r, i) => (
            <button
              key={r}
              className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition ${
                i === 1 ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow" : "text-white/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4 px-5">
        <ChartCard
          title="Temperature"
          value="28.4°C"
          delta="+1.2°"
          up
          color="#F59E0B"
          data={[22,23,24,25,26,25,27,28,29,28,30,29,28,28]}
          id="g-temp"
        />
        <ChartCard
          title="Humidity"
          value="76%"
          delta="+4%"
          up
          color="#60A5FA"
          data={[60,62,64,66,68,70,72,71,73,75,74,76,77,76]}
          id="g-hum"
        />
        <ChartCard
          title="Light Intensity (LDR)"
          value="412 lux"
          delta="-18%"
          up={false}
          color="#A78BFA"
          data={[820,780,720,650,600,540,500,470,440,420,410,405,410,412]}
          id="g-ldr"
        />

        <SectionTitle title="AI Insights" />
        <GlassCard>
          <p className="text-sm font-medium text-white">Correlation detected</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            Humidity is rising while light intensity is falling — a classic pre-cloudburst signature. Confidence 94%.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Peak Temp" value="30°" />
            <MiniStat label="Avg Humidity" value="72%" />
            <MiniStat label="Low LDR" value="405" />
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function ChartCard({ title, value, delta, up, color, data, id }: {
  title: string; value: string; delta: string; up: boolean; color: string; data: number[]; id: string;
}) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/50">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${up ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {delta}
        </span>
      </div>
      <div className="mt-3">
        <TrendChart data={data} color={color} fillId={id} height={110} />
      </div>
    </GlassCard>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-2">
      <div className="text-[9px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
