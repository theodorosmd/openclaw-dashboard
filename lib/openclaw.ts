/**
 * OpenClaw API Client
 * Communicates with local OpenClaw gateway
 */

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:18789';

export interface OpenClawStatus {
  gateway: {
    version: string;
    uptime: number;
  };
  sessions: number;
  model: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  command: string;
  nextRun: string;
  enabled: boolean;
}

export interface MemoryFile {
  path: string;
  content: string;
  lastModified: string;
}

export class OpenClawAPI {
  private baseURL: string;

  constructor(baseURL: string = GATEWAY_URL) {
    this.baseURL = baseURL;
  }

  async getStatus(): Promise<OpenClawStatus> {
    // Mock for now - will implement real API calls
    return {
      gateway: {
        version: '2026.2.26',
        uptime: 86400,
      },
      sessions: 3,
      model: 'claude-sonnet-4-5',
    };
  }

  async getCronJobs(): Promise<CronJob[]> {
    // Mock data
    return [];
  }

  async getMemoryFiles(): Promise<MemoryFile[]> {
    // Mock data
    return [];
  }

  async searchWorkspace(query: string): Promise<any[]> {
    // Mock data
    return [];
  }
}

export const openclaw = new OpenClawAPI();
