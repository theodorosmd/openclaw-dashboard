/**
 * Activity Logger - Records every action Volt takes
 * Writes to workspace/activity-log.jsonl
 */

import fs from 'fs/promises';
import path from 'path';

export interface ActivityEntry {
  timestamp: string;
  type: 'command' | 'file_write' | 'file_read' | 'web_search' | 'api_call' | 'task_complete' | 'error';
  action: string;
  details: Record<string, any>;
  result?: string;
  duration_ms?: number;
}

const ACTIVITY_LOG_PATH = process.env.ACTIVITY_LOG_PATH || '/data/.openclaw/workspace/activity-log.jsonl';

export class ActivityLogger {
  private logPath: string;

  constructor(logPath: string = ACTIVITY_LOG_PATH) {
    this.logPath = logPath;
  }

  async log(entry: Omit<ActivityEntry, 'timestamp'>): Promise<void> {
    const fullEntry: ActivityEntry = {
      timestamp: new Date().toISOString(),
      ...entry,
    };

    const line = JSON.stringify(fullEntry) + '\n';
    
    try {
      await fs.appendFile(this.logPath, line, 'utf8');
    } catch (error) {
      console.error('Failed to write activity log:', error);
    }
  }

  async getRecent(limit: number = 100): Promise<ActivityEntry[]> {
    try {
      const content = await fs.readFile(this.logPath, 'utf8');
      const lines = content.trim().split('\n').filter(Boolean);
      
      return lines
        .slice(-limit)
        .map(line => JSON.parse(line))
        .reverse();
    } catch (error) {
      // File doesn't exist yet or empty
      return [];
    }
  }

  async search(query: string, limit: number = 50): Promise<ActivityEntry[]> {
    const entries = await this.getRecent(1000);
    const lowerQuery = query.toLowerCase();
    
    return entries
      .filter(entry => 
        entry.action.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(entry.details).toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }
}

export const activityLogger = new ActivityLogger();
