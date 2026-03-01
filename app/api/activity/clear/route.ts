import { NextResponse } from 'next/server';
import fs from 'fs/promises';

const ACTIVITY_LOG_PATH = '/data/.openclaw/workspace/activity-log.jsonl';

export async function POST() {
  try {
    await fs.writeFile(ACTIVITY_LOG_PATH, '', 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear activity log' }, { status: 500 });
  }
}
