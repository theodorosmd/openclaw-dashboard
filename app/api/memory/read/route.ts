import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
  }

  const workspacePath = '/data/.openclaw/workspace';
  const filePath = path.join(workspacePath, file);

  // Security: ensure file is within workspace
  if (!filePath.startsWith(workspacePath)) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return NextResponse.json({ content });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ content: '' });
    }
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
