import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LineChart, Camera, Bell, Settings } from "lucide-react";
import type { ReactNode } from "react";
import skyBg from "@/assets/sky-bg.jpg";

const tabs = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/camera", label: "Camera", icon: Camera },
  { to: "/history", label: "History", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${skyBg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0B1220]/70 via-[#0B1220]/85 to-[#0B1220]" />
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed -left-24 top-40 -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none fixed -right-20 top-[60vh] -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <main className="relative z-0 pb-32 pt-safe">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2">
        <div className="glass-card flex items-center justify-between px-2 py-2">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all duration-300 ${
                  active ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary to-primary-glow opacity-90 shadow-[0_8px_24px_-8px_rgba(37,99,235,0.7)]" />
                )}
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                <span className="text-[10px] font-medium tracking-tight">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
