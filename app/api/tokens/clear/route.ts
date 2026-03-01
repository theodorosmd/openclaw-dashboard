import { NextResponse } from 'next/server';
import fs from 'fs/promises';

const TOKEN_HISTORY_PATH = '/data/.openclaw/workspace/token-history.jsonl';

export async function POST() {
  try {
    await fs.writeFile(TOKEN_HISTORY_PATH, '', 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear token history' }, { status: 500 });
  }
}
