import { activityLogger } from "@/lib/activity-logger";
import { RefreshButton } from "@/components/RefreshButton";
import { seedActivities } from "./actions";

export const dynamic = 'force-dynamic';

export default async function ActivityFeed() {
  const activities = await activityLogger.getRecent(100);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Activity Feed</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time log of every action Volt takes
          </p>
        </div>
        <div className="flex gap-2">
          <RefreshButton />
          {activities.length === 0 && (
            <form action={seedActivities}>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Add Sample Data
              </button>
            </form>
          )}
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No activity logged yet. Actions will appear here as they happen.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <ActivityCard key={idx} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityCard({ activity }: { activity: any }) {
  const typeIcons: Record<string, string> = {
    command: '🖥️',
    file_write: '✏️',
    file_read: '📖',
    web_search: '🔍',
    api_call: '🌐',
    task_complete: '✅',
    error: '❌',
  };

  const typeColors: Record<string, string> = {
    command: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    file_write: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    file_read: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    web_search: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    api_call: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    task_complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[activity.type] || '📝'}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[activity.type] || ''}`}>
                {activity.type}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(activity.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="font-medium mt-1">{activity.action}</p>
          </div>
        </div>
        {activity.duration_ms && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {activity.duration_ms}ms
          </span>
        )}
      </div>

      {Object.keys(activity.details).length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(activity.details, null, 2)}
          </pre>
        </div>
      )}

      {activity.result && (
        <div className="mt-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Result:</span>
          <p className="text-sm mt-1">{activity.result}</p>
        </div>
      )}
    </div>
  );
}
