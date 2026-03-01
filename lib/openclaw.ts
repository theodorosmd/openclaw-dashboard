/**
 * OpenClaw API Client
 * Executes OpenClaw CLI commands and parses output
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface OpenClawStatus {
  gateway: {
    version: string;
    uptime: number;
  };
  sessions: number;
  model: string;
  tokenUsage?: {
    used: number;
    total: number;
  };
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  command: string;
  nextRun: string;
  enabled: boolean;
}

export interface Skill {
  name: string;
  version: string;
  description: string;
  location: string;
}

export class OpenClawAPI {
  async getStatus(): Promise<OpenClawStatus> {
    try {
      const { stdout } = await execAsync('openclaw status 2>&1');
      
      // Parse text output
      const lines = stdout.split('\n');
      let version = '2026.2.26';
      let model = 'claude-sonnet-4-5';
      let sessions = 0;
      let tokenUsed = 0;
      let tokenTotal = 200000;
      
      for (const line of lines) {
        if (line.includes('Update') && line.includes('npm')) {
          const match = line.match(/npm update (\S+)/);
          if (match) version = match[1];
        }
        if (line.includes('default') && line.includes('claude')) {
          const match = line.match(/(claude-[a-z0-9-]+)/);
          if (match) model = match[1];
        }
        if (line.includes('Sessions') && line.includes('active')) {
          const match = line.match(/(\d+) active/);
          if (match) sessions = parseInt(match[1]);
        }
        if (line.includes('Tokens')) {
          const match = line.match(/(\d+)k\/(\d+)k/);
          if (match) {
            tokenUsed = parseInt(match[1]) * 1000;
            tokenTotal = parseInt(match[2]) * 1000;
          }
        }
      }
      
      return {
        gateway: { 
          version, 
          uptime: 0 
        },
        sessions,
        model,
        tokenUsage: tokenUsed > 0 ? { used: tokenUsed, total: tokenTotal } : undefined,
      };
    } catch (error) {
      console.error('Failed to get OpenClaw status:', error);
      return {
        gateway: { version: 'unknown', uptime: 0 },
        sessions: 0,
        model: 'unknown',
      };
    }
  }

  async getCronJobs(): Promise<CronJob[]> {
    try {
      const { stdout } = await execAsync('openclaw cron list --json 2>/dev/null || openclaw cron list');
      
      try {
        const data = JSON.parse(stdout);
        return data.jobs || data || [];
      } catch {
        // Parse text output
        const jobs: CronJob[] = [];
        const lines = stdout.split('\n').filter(l => l.trim());
        
        for (const line of lines) {
          if (line.includes('│') || line.includes('─')) continue; // Skip table borders
          
          const parts = line.split(/\s{2,}/); // Split on 2+ spaces
          if (parts.length >= 4) {
            jobs.push({
              id: parts[0]?.trim() || '',
              name: parts[1]?.trim() || '',
              schedule: parts[2]?.trim() || '',
              command: parts[3]?.trim() || '',
              nextRun: '',
              enabled: true,
            });
          }
        }
        
        return jobs;
      }
    } catch (error) {
      console.error('Failed to get cron jobs:', error);
      return [];
    }
  }

  async getSkills(): Promise<Skill[]> {
    try {
      // Check installed OpenClaw skills
      const { stdout: skillDirs } = await execAsync('ls -1 /usr/local/lib/node_modules/openclaw/skills/ 2>/dev/null || echo ""');
      const skills: Skill[] = [];
      
      for (const dir of skillDirs.split('\n').filter(Boolean)) {
        try {
          const { stdout: skillMd } = await execAsync(`cat /usr/local/lib/node_modules/openclaw/skills/${dir}/SKILL.md 2>/dev/null || echo ""`);
          
          // Parse SKILL.md front matter
          const nameMatch = skillMd.match(/^name:\s*(.+)$/m);
          const descMatch = skillMd.match(/^description:\s*(.+)$/m);
          
          skills.push({
            name: nameMatch?.[1] || dir,
            version: '1.0.0',
            description: descMatch?.[1] || 'No description',
            location: `/usr/local/lib/node_modules/openclaw/skills/${dir}`,
          });
        } catch {
          skills.push({
            name: dir,
            version: '1.0.0',
            description: 'No description',
            location: `/usr/local/lib/node_modules/openclaw/skills/${dir}`,
          });
        }
      }
      
      return skills;
    } catch (error) {
      console.error('Failed to get skills:', error);
      return [];
    }
  }
}

export const openclaw = new OpenClawAPI();
