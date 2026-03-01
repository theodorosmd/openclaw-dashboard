import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw Dashboard",
  description: "Control center for Volt ⚡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <div className="flex h-screen bg-[#0a0a0a]">
          {/* Sidebar */}
          <aside className="w-64 bg-[#1a1a1a] border-r border-[#262626]">
            <div className="p-6 border-b border-[#262626]">
              <h1 className="text-xl font-semibold text-white">⚡ Volt</h1>
              <p className="text-xs text-gray-500 mt-1">Control Center</p>
            </div>
            
            <nav className="px-3 py-4 space-y-0.5">
              <NavLink href="/" icon="📊">Overview</NavLink>
              <NavLink href="/activity" icon="📝">Activity</NavLink>
              <NavLink href="/cron" icon="⏰">Cron Jobs</NavLink>
              <NavLink href="/calendar" icon="📅">Calendar</NavLink>
              <NavLink href="/search" icon="🔍">Search</NavLink>
              <NavLink href="/memory" icon="🧠">Memory</NavLink>
              <NavLink href="/prompts" icon="✏️">Prompts</NavLink>
              <NavLink href="/skills" icon="🛠️">Skills</NavLink>
              <NavLink href="/settings" icon="⚙️">Settings</NavLink>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 rounded-md hover:bg-[#262626] hover:text-white transition-colors"
    >
      <span className="text-base">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
