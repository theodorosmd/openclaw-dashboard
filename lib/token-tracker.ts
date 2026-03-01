/**
 * Token usage tracker
 * Stores historical token usage data
 */

import fs from 'fs/promises';

const TOKEN_HISTORY_PATH = '/data/.openclaw/workspace/token-history.jsonl';

export interface TokenSnapshot {
  timestamp: string;
  used: number;
  total: number;
  percentage: number;
  sessions: number;
  model: string;
}

export class TokenTracker {
  async track(snapshot: Omit<TokenSnapshot, 'timestamp'>): Promise<void> {
    const fullSnapshot: TokenSnapshot = {
      timestamp: new Date().toISOString(),
      ...snapshot,
    };

    const line = JSON.stringify(fullSnapshot) + '\n';
    
    try {
      await fs.appendFile(TOKEN_HISTORY_PATH, line, 'utf8');
    } catch (error) {
      console.error('Failed to track tokens:', error);
    }
  }

  async getHistory(hours: number = 24): Promise<TokenSnapshot[]> {
    try {
      const content = await fs.readFile(TOKEN_HISTORY_PATH, 'utf8');
      const lines = content.trim().split('\n').filter(Boolean);
      
      const snapshots = lines.map(line => JSON.parse(line) as TokenSnapshot);
      
      // Filter to last N hours
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
      return snapshots.filter(s => new Date(s.timestamp) > cutoff);
    } catch (error) {
      return [];
    }
  }

  async getLatest(): Promise<TokenSnapshot | null> {
    try {
      const content = await fs.readFile(TOKEN_HISTORY_PATH, 'utf8');
      const lines = content.trim().split('\n').filter(Boolean);
      
      if (lines.length === 0) return null;
      
      return JSON.parse(lines[lines.length - 1]);
    } catch (error) {
      return null;
    }
  }
}

export const tokenTracker = new TokenTracker();
