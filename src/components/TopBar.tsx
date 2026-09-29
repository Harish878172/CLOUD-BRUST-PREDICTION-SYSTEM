import { MapPin, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar({ connected = true, location = "Mumbai, IN" }: { connected?: boolean; location?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now
    ? now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    : "";
  const timeStr = now
    ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <header className="px-5 pb-4 pt-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-[0_8px_20px_-8px_rgba(37,99,235,0.9)]">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">CloudShield AI</h1>
              <p className="text-[11px] text-white/50">Weather Intelligence</p>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-md ${
            connected
              ? "border-success/40 bg-success/15 text-success"
              : "border-danger/40 bg-danger/15 text-danger"
          }`}
        >
          {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          ESP32 {connected ? "Connected" : "Offline"}
          {connected && <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-success" />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-white/70">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary-glow" />
          <span className="text-sm font-medium text-white/90">{location}</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/90">{dateStr}</div>
          <div className="text-[11px] text-white/50">{timeStr}</div>
        </div>
      </div>
    </header>
  );
}
