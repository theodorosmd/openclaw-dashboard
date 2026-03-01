import { openclaw } from "@/lib/openclaw";
import { AutoRefresh } from "@/components/AutoRefresh";
import { TokenUsageChart } from "@/components/TokenUsageChart";
import { tokenTracker } from "@/lib/token-tracker";

export default async function Home() {
  const status = await openclaw.getStatus();
  
  // Track token usage
  if (status.tokenUsage) {
    await tokenTracker.track({
      used: status.tokenUsage.used,
      total: status.tokenUsage.total,
      percentage: (status.tokenUsage.used / status.tokenUsage.total) * 100,
      sessions: status.sessions,
      model: status.model,
    });
  }

  return (
    <div className="p-6">
      <AutoRefresh interval={5000} />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Overview</h1>
        <p className="text-sm text-gray-500">Gateway status, usage statistics, and health metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="SESSIONS"
          value={status.sessions.toString()}
          sublabel="Powered sessions on the last 3 months"
        />
        <StatCard
          label="GATEWAY"
          value={status.gateway.version}
          sublabel="System is running smoothly"
          statusColor="green"
        />
        {status.tokenUsage && (
          <StatCard
            label="TOKENS"
            value={`${(status.tokenUsage.used / 1000).toFixed(1)}k / ${(status.tokenUsage.total / 1000).toFixed(0)}k`}
            sublabel={`${((status.tokenUsage.used / status.tokenUsage.total) * 100).toFixed(1)}% used`}
          />
        )}
        <StatCard
          label="MODEL"
          value={status.model}
          sublabel="Current active model"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Gateway Status">
          <div className="space-y-3">
            <StatusRow label="STATUS" value="Connected" valueColor="text-green-500" />
            <StatusRow label="UPTIME" value={formatUptime(status.gateway.uptime)} />
            <StatusRow label="VERSION" value={status.gateway.version} />
          </div>
        </Card>

        <Card title="System Health">
          <div className="space-y-3">
            <StatusRow label="SESSIONS" value={status.sessions.toString()} />
            <StatusRow label="MODEL" value={status.model} />
            {status.tokenUsage && (
              <StatusRow 
                label="TOKEN USAGE" 
                value={`${((status.tokenUsage.used / status.tokenUsage.total) * 100).toFixed(1)}%`} 
              />
            )}
          </div>
        </Card>
      </div>

      <Card title="Token Usage (Last 24h)">
        <TokenUsageChart />
      </Card>
    </div>
  );
}

function StatCard({ label, value, sublabel, statusColor }: { label: string; value: string; sublabel?: string; statusColor?: string }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#262626] p-4">
      <div className="text-xs text-gray-500 mb-2">{label}</div>
      <div className={`text-2xl font-semibold mb-1 ${statusColor === 'green' ? 'text-green-500' : 'text-white'}`}>
        {value}
      </div>
      {sublabel && <div className="text-xs text-gray-600">{sublabel}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#262626] p-5">
      <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}

function StatusRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#262626] last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-sm font-mono ${valueColor || 'text-gray-300'}`}>{value}</span>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
