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
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h1 className="text-2xl font-bold">⚡ Volt</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
            
            <nav className="px-4 space-y-1">
              <NavLink href="/" icon="📊">System</NavLink>
              <NavLink href="/activity" icon="📝">Activity Feed</NavLink>
              <NavLink href="/calendar" icon="📅">Calendar</NavLink>
              <NavLink href="/search" icon="🔍">Search</NavLink>
              <NavLink href="/memory" icon="🧠">Memory</NavLink>
              <NavLink href="/prompts" icon="✏️">Prompts</NavLink>
              <NavLink href="/skills" icon="🛠️">Skills</NavLink>
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
      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}
