import { openclaw } from "@/lib/openclaw";

export const dynamic = 'force-dynamic';

export default async function Calendar() {
  const cronJobs = await openclaw.getCronJobs();

  // Generate next 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Scheduled Tasks</h1>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date) => (
          <DayColumn key={date.toISOString()} date={date} cronJobs={cronJobs} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">All Scheduled Jobs</h2>
        {cronJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No scheduled tasks yet. Use `openclaw cron add` to create one.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cronJobs.map((job) => (
              <CronJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DayColumn({ date, cronJobs }: { date: Date; cronJobs: any[] }) {
  const isToday = date.toDateString() === new Date().toDateString();
  
  const tasksOnThisDay = cronJobs.filter((job) => {
    // Simple check - in real implementation, parse cron schedule
    return job.nextRun && new Date(job.nextRun).toDateString() === date.toDateString();
  });

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border p-4 ${
      isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="text-center mb-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {date.toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
        <div className="text-2xl font-bold">
          {date.getDate()}
        </div>
      </div>

      <div className="space-y-2">
        {tasksOnThisDay.map((job) => (
          <div key={job.id} className="text-xs p-2 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
            <div className="font-medium truncate">{job.name}</div>
            <div className="text-gray-600 dark:text-gray-400">
              {new Date(job.nextRun).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CronJobCard({ job }: { job: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{job.name}</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              job.enabled 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {job.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Schedule: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{job.schedule}</code>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Next run: {job.nextRun ? new Date(job.nextRun).toLocaleString() : 'Not scheduled'}
          </p>
        </div>
      </div>
      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded">
        <code className="text-xs">{job.command}</code>
      </div>
    </div>
  );
}
