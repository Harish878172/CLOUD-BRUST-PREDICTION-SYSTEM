import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Thermometer, Droplets, Sun, Radar, Camera as CameraIcon,
  ShieldAlert, Sparkles, ChevronRight, Zap, Eye, TrendingUp, Loader2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { GlassCard, SectionTitle } from "@/components/GlassCard";
import { TrendChart } from "@/components/TrendChart";
import { useSensorData, useRiskAnalysis } from "@/hooks/useSensorData";
import heroCloud from "@/assets/hero-cloud.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CloudShield AI" },
      { name: "description", content: "Live temperature, humidity, LDR, UV and AI-driven cloudburst risk from your ESP32 sensor array." },
      { property: "og:title", content: "CloudShield AI Dashboard" },
      { property: "og:description", content: "Live sensor telemetry and AI cloudburst risk score." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, loading, error, dbPath } = useSensorData();
  const { riskScore, aiConfidence, riskLevel, aiSummary } = useRiskAnalysis();

  // Helper to get risk display data
  const getRiskDisplay = (level: string) => {
    switch (level) {
      case "low":
        return { label: "Low Risk", color: "success" };
      case "moderate":
        return { label: "Moderate Risk", color: "warning" };
      case "high":
        return { label: "High Risk", color: "danger" };
      case "severe":
        return { label: "Severe Risk", color: "danger" };
      default:
        return { label: "Unknown", color: "warning" };
    }
  };

  const riskDisplay = getRiskDisplay(riskLevel);

  // Default values when loading or no data - try multiple field names
  const temp = data?.temperature ?? data?.temp ?? data?.Temperature ?? 28;
  const hum = data?.humidity ?? data?.humid ?? data?.Humidity ?? 76;
  const ldrVal = data?.ldr ?? data?.LDR ?? data?.light ?? data?.lux ?? 412;
  const uv = data?.uvLevel ?? data?.uv ?? data?.UV ?? "Low";
  const irActive = data?.irSensor ?? data?.ir ?? data?.IR ?? data?.infrared ?? true;

  if (error) {
    return (
      <AppShell>
        <TopBar connected={false} location="Offline" />
        <div className="flex h-96 items-center justify-center p-5">
          <div className="text-center text-white/60">
            <ShieldAlert className="mx-auto h-12 w-12 text-danger" />
            <p className="mt-4">Firebase Connection Issue</p>
            <p className="text-sm text-white/40 mt-2">{error}</p>
            <p className="text-xs text-white/30 mt-4">Check console (F12) for Firebase data logs</p>
          </div>
        </div>
      </AppShell>
    );
  }

  {/* Debug: show current data path */}
      {dbPath && !loading && (
        <div className="fixed bottom-2 right-2 bg-success/20 text-success text-xs px-2 py-1 rounded">
          Connected: /{dbPath}
        </div>
      )}

  return (
    <AppShell>
      <TopBar connected={!loading} location={data?.location ?? "Mumbai, IN"} />

      {/* Hero */}
      <section className="px-5">
        <div
          className="relative overflow-hidden rounded-[28px] border border-white/10 p-6"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -right-6 -top-6 h-48 w-48 rounded-full bg-primary/40 blur-3xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                riskLevel === "low" ? "border-success/40 bg-success/15 text-success" :
                riskLevel === "moderate" ? "border-warning/40 bg-warning/15 text-warning" :
                "border-danger/40 bg-danger/15 text-danger"
              }`}>
                <ShieldAlert className="h-3 w-3" /> {riskDisplay.label}
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-7xl font-thin leading-none text-white">{loading ? <Loader2 className="animate-spin h-16 w-16" /> : temp.toFixed(1)}</span>
                <span className="text-2xl font-light text-white/70">°C</span>
              </div>
              <p className="mt-1 text-sm text-white/70">Cloudy · Feels like {loading ? "--" : (temp + 3).toFixed(0)}°</p>
              <div className="mt-4 flex gap-4 text-[11px]">
                <Stat label="Humidity" value={loading ? "--" : `${hum}%`} />
                <Stat label="LDR" value={loading ? "--" : String(ldrVal)} />
                <Stat label="UV" value={loading ? "--" : uv} />
              </div>
            </div>
            <img
              src={heroCloud}
              alt="Cloud"
              width={140}
              height={140}
              className="animate-float drop-shadow-[0_20px_30px_rgba(96,165,250,0.4)]"
            />
          </div>
        </div>
      </section>

      {/* Sensor grid */}
      <section className="mt-6 px-5">
        <SectionTitle title="Live Sensors" />
        <div className="grid grid-cols-2 gap-3">
          <SensorTile icon={Thermometer} label="Temperature" value={loading ? "--" : temp.toFixed(1)} unit="°C" tone="primary" trend="+0.6" />
          <SensorTile icon={Droplets} label="Humidity" value={loading ? "--" : String(hum)} unit="%" tone="accent" trend="+2%" />
          <SensorTile icon={Sun} label="LDR Sensor" value={loading ? "--" : String(ldrVal)} unit="lux" tone="warning" trend="Bright" />
          <SensorTile icon={Radar} label="IR Sensor" value={irActive ? "Active" : "Inactive"} unit="" tone={irActive ? "success" : "warning"} trend={irActive ? "Clear" : "Blocked"} />
          <SensorTile icon={CameraIcon} label="ESP32-CAM" value="Online" unit="" tone="success" trend="720p" wide />
        </div>
      </section>

      {/* AI Prediction */}
      <section className="mt-6 px-5">
        <SectionTitle title="AI Prediction" />
        <GlassCard className="overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Cloudburst Analysis</p>
                <p className="text-[11px] text-white/50">{loading ? "Loading..." : "Live from ESP32"}</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
              riskLevel === "low" ? "bg-success/15 text-success" :
              riskLevel === "moderate" ? "bg-warning/15 text-warning" :
              "bg-danger/15 text-danger"
            }`}>
              {riskDisplay.label}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-6">
            <RiskDial score={loading ? 0 : riskScore} />
            <div className="flex-1 space-y-2">
              <Row k="Risk Score" v={loading ? "--" : `${riskScore} / 100`} />
              <Row k="AI Confidence" v={loading ? "--" : `${aiConfidence}%`} />
              <Row k="Model" v="v2.4 Neural" />
            </div>
          </div>

          <p className="mt-5 rounded-2xl bg-white/5 p-3 text-xs leading-relaxed text-white/70">
            <span className="font-medium text-white">Summary:</span> {loading ? "Fetching data..." : aiSummary}
          </p>
        </GlassCard>
      </section>

      {/* Camera */}
      <section className="mt-6 px-5">
        <SectionTitle
          title="Live Camera"
          action={
            <Link to="/camera" className="flex items-center gap-1 text-[11px] font-medium text-primary-glow">
              Open <ChevronRight className="h-3 w-3" />
            </Link>
          }
        />
        <GlassCard className="p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            <div className="absolute inset-0 opacity-40" style={{
              background: "radial-gradient(circle at 30% 40%, rgba(96,165,250,0.5), transparent 50%), radial-gradient(circle at 70% 60%, rgba(129,140,248,0.4), transparent 50%)"
            }} />
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-danger/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
            </div>
            <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium text-white/80 backdrop-blur">
              ESP32-CAM · 720p
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <Eye className="h-10 w-10 text-white/30" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/10">
              Capture
            </button>
            <button className="rounded-2xl bg-gradient-to-r from-primary to-primary-glow py-3 text-xs font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.9)]">
              Analyze with AI
            </button>
          </div>
        </GlassCard>
      </section>

      {/* Analytics preview */}
      <section className="mt-6 px-5">
        <SectionTitle
          title="Analytics"
          action={
            <Link to="/analytics" className="flex items-center gap-1 text-[11px] font-medium text-primary-glow">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          }
        />
        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/50">Temperature 24h</p>
              <p className="text-2xl font-semibold text-white">28.4°<span className="ml-1 text-xs font-normal text-success">+1.2°</span></p>
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <TrendChart data={[24,25,26,27,26,28,29,28,27,28,29,30,29,28]} color="#60A5FA" fillId="g-home" />
        </GlassCard>
      </section>

      {/* Alerts */}
      <section className="mt-6 px-5">
        <SectionTitle
          title="Alerts & Recommendations"
          action={
            <Link to="/history" className="flex items-center gap-1 text-[11px] font-medium text-primary-glow">
              All <ChevronRight className="h-3 w-3" />
            </Link>
          }
        />
        <div className="space-y-3">
          <AlertRow
            tone="warning"
            icon={<ShieldAlert className="h-4 w-4" />}
            title="Rising humidity detected"
            time="12 min ago"
            desc="Humidity crossed 75% threshold. Monitor closely."
          />
          <AlertRow
            tone="primary"
            icon={<Sparkles className="h-4 w-4" />}
            title="AI Recommendation"
            time="Now"
            desc="Charge devices and secure outdoor equipment within 90 min."
          />
          <AlertRow
            tone="success"
            icon={<Zap className="h-4 w-4" />}
            title="System healthy"
            time="1h ago"
            desc="All 5 sensors reporting within nominal range."
          />
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-white/50">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-xs">
      <span className="text-white/55">{k}</span>
      <span className="font-medium text-white">{v}</span>
    </div>
  );
}

function SensorTile({
  icon: Icon, label, value, unit, tone, trend, wide,
}: {
  icon: any; label: string; value: string; unit: string;
  tone: "primary" | "accent" | "warning" | "success"; trend?: string; wide?: boolean;
}) {
  const toneMap = {
    primary: "from-primary/40 to-primary/10 text-primary-glow",
    accent: "from-cyan-400/40 to-cyan-400/10 text-cyan-300",
    warning: "from-warning/40 to-warning/10 text-warning",
    success: "from-success/40 to-success/10 text-success",
  } as const;
  return (
    <div className={`glass-card p-4 ${wide ? "col-span-2" : ""}`}>
      <div className="flex items-center justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && <span className="text-[10px] font-medium text-white/50">{trend}</span>}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-0.5 text-xl font-semibold text-white">
        {value}<span className="ml-0.5 text-xs font-normal text-white/50">{unit}</span>
      </p>
    </div>
  );
}

function RiskDial({ score }: { score: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
        <defs>
          <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <circle
          cx="50" cy="50" r={r} stroke="url(#riskGrad)" strokeWidth="8"
          fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-xl font-bold text-white">{score}</div>
          <div className="text-[9px] uppercase tracking-wider text-white/50">score</div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({
  tone, icon, title, time, desc,
}: { tone: "warning" | "primary" | "success" | "danger"; icon: React.ReactNode; title: string; time: string; desc: string }) {
  const toneMap = {
    warning: "bg-warning/15 text-warning border-warning/30",
    primary: "bg-primary/15 text-primary-glow border-primary/30",
    success: "bg-success/15 text-success border-success/30",
    danger: "bg-danger/15 text-danger border-danger/30",
  } as const;
  return (
    <div className="glass-card flex gap-3 p-4">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${toneMap[tone]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-white">{title}</p>
          <span className="shrink-0 text-[10px] text-white/40">{time}</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-white/60">{desc}</p>
      </div>
    </div>
  );
}
