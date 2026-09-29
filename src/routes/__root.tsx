import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "@/components/AppShell";

function NotFoundComponent() {
  return (
    <AppShell>
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="glass-card p-8 text-center">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <p className="mt-2 text-sm text-white/60">Page not found</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
            Go home
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <AppShell>
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="glass-card p-8 text-center">
          <h1 className="text-lg font-semibold text-white">This page didn't load</h1>
          <p className="mt-2 text-sm text-white/60">Try again or head home.</p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => { router.invalidate(); reset(); }}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Try again
            </button>
            <a href="/" className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white">
              Home
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0B1220" },
      { title: "CloudShield AI — Cloudburst Risk Monitor" },
      { name: "description", content: "AI-powered weather monitoring and cloudburst risk estimation with real-time ESP32 sensor telemetry." },
      { name: "author", content: "CloudShield AI" },
      { property: "og:title", content: "CloudShield AI" },
      { property: "og:description", content: "AI-powered weather monitoring and cloudburst risk estimation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
