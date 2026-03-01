/**
 * Activity logging wrapper for server actions
 * Use this to automatically log any OpenClaw action
 */

'use server';

import { activityLogger, ActivityEntry } from './activity-logger';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Execute a command and log it
 */
export async function executeAndLog(
  command: string,
  description: string,
  details: Record<string, any> = {}
): Promise<{ success: boolean; output: string; error?: string }> {
  const startTime = Date.now();
  
  try {
    const { stdout, stderr } = await execAsync(command);
    const duration = Date.now() - startTime;
    
    await activityLogger.log({
      type: 'command',
      action: description,
      details: {
        command,
        ...details,
      },
      result: stdout.slice(0, 500), // Limit output
      duration_ms: duration,
    });
    
    return {
      success: true,
      output: stdout,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    await activityLogger.log({
      type: 'error',
      action: `Failed: ${description}`,
      details: {
        command,
        error: error.message,
        ...details,
      },
      result: error.message,
      duration_ms: duration,
    });
    
    return {
      success: false,
      output: '',
      error: error.message,
    };
  }
}

/**
 * Log any activity manually
 */
export async function logActivity(
  entry: Omit<ActivityEntry, 'timestamp'>
): Promise<void> {
  await activityLogger.log(entry);
}

/**
 * Sample activities for demo
 */
export async function seedSampleActivities() {
  const activities: Array<Omit<ActivityEntry, 'timestamp'>> = [
    {
      type: 'task_complete',
      action: 'Built OpenClaw Dashboard v2.0',
      details: {
        features: ['Activity Feed', 'Calendar View', 'Global Search', 'Memory Browser', 'Skill Manager', 'System Dashboard'],
      },
      result: 'Successfully deployed to Vercel',
    },
    {
      type: 'command',
      action: 'Checked OpenClaw status',
      details: { command: 'openclaw status' },
      result: 'Gateway online, 1 active session',
      duration_ms: 234,
    },
    {
      type: 'file_read',
      action: 'Read USER.md',
      details: { path: '/data/.openclaw/workspace/USER.md', size: 2456 },
      result: 'Successfully loaded user context',
      duration_ms: 12,
    },
    {
      type: 'web_search',
      action: 'Searched for "Next.js deployment Vercel"',
      details: { query: 'Next.js deployment Vercel', results: 10 },
      result: 'Found deployment documentation',
      duration_ms: 1234,
    },
  ];
  
  for (const activity of activities) {
    await activityLogger.log(activity);
    // Small delay between entries
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
