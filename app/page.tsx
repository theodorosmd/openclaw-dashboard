import { openclaw } from "@/lib/openclaw";

export default async function Home() {
  const status = await openclaw.getStatus();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Gateway Version"
          value={status.gateway.version}
          icon="🔧"
        />
        <StatCard
          title="Uptime"
          value={formatUptime(status.gateway.uptime)}
          icon="⏱️"
        />
        <StatCard
          title="Active Sessions"
          value={status.sessions.toString()}
          icon="👥"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Current Model">
          <p className="text-2xl font-mono">{status.model}</p>
        </Card>

        <Card title="Quick Stats">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Token Usage</span>
              <span className="font-mono">23.5k / 200k</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Memory Files</span>
              <span className="font-mono">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Scheduled Tasks</span>
              <span className="font-mono">3</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
