import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { GlassCard, SectionTitle } from "@/components/GlassCard";
import {
  Bell, Wifi, Cpu, Cloud, Shield, Moon, HelpCircle, ChevronRight, LogOut,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CloudShield AI" },
      { name: "description", content: "Configure alerts, ESP32 connection, AI thresholds and account preferences." },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Configure alerts, ESP32 connection and AI thresholds." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [alerts, setAlerts] = useState(true);
  const [ai, setAi] = useState(true);
  const [dark, setDark] = useState(true);

  return (
    <AppShell>
      <TopBar connected />
      <div className="px-5">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-white/50">Personalise CloudShield AI</p>
      </div>

      {/* Profile */}
      <div className="mt-5 px-5">
        <GlassCard className="flex items-center gap-3 p-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-lg font-bold text-white">
            AR
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Arjun R.</p>
            <p className="text-[11px] text-white/50">Pro plan · ESP32 Kit v2</p>
          </div>
          <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white">
            Edit
          </button>
        </GlassCard>
      </div>

      <div className="mt-6 px-5">
        <SectionTitle title="Device" />
        <GlassCard className="divide-y divide-white/5 p-0">
          <Row icon={<Wifi className="h-4 w-4" />} label="ESP32 Connection" value="Connected" tone="success" />
          <Row icon={<Cpu className="h-4 w-4" />} label="Firmware" value="v2.4.1" />
          <Row icon={<Cloud className="h-4 w-4" />} label="Sync Frequency" value="Every 30s" />
        </GlassCard>
      </div>

      <div className="mt-6 px-5">
        <SectionTitle title="Preferences" />
        <GlassCard className="divide-y divide-white/5 p-0">
          <Toggle icon={<Bell className="h-4 w-4" />} label="Push Alerts" on={alerts} onChange={setAlerts} />
          <Toggle icon={<Shield className="h-4 w-4" />} label="AI Auto-Analysis" on={ai} onChange={setAi} />
          <Toggle icon={<Moon className="h-4 w-4" />} label="Dark Mode" on={dark} onChange={setDark} />
        </GlassCard>
      </div>

      <div className="mt-6 px-5">
        <SectionTitle title="Support" />
        <GlassCard className="divide-y divide-white/5 p-0">
          <Row icon={<HelpCircle className="h-4 w-4" />} label="Help Center" value="" chevron />
          <Row icon={<Shield className="h-4 w-4" />} label="Privacy Policy" value="" chevron />
          <Row icon={<LogOut className="h-4 w-4" />} label="Sign out" value="" tone="danger" chevron />
        </GlassCard>
      </div>

      <p className="mt-8 pb-4 text-center text-[10px] text-white/30">CloudShield AI · v1.0.0</p>
    </AppShell>
  );
}

function Row({
  icon, label, value, tone, chevron,
}: {
  icon: React.ReactNode; label: string; value?: string;
  tone?: "success" | "danger"; chevron?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-white/80">
        {icon}
      </div>
      <span className={`flex-1 text-sm font-medium ${tone === "danger" ? "text-danger" : "text-white"}`}>{label}</span>
      {value && (
        <span className={`text-xs font-medium ${tone === "success" ? "text-success" : "text-white/50"}`}>
          {value}
        </span>
      )}
      {chevron && <ChevronRight className="h-4 w-4 text-white/30" />}
    </div>
  );
}

function Toggle({
  icon, label, on, onChange,
}: { icon: React.ReactNode; label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-white/80">{icon}</div>
      <span className="flex-1 text-sm font-medium text-white">{label}</span>
      <button
        onClick={() => onChange(!on)}
        className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-to-r from-primary to-primary-glow" : "bg-white/15"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
