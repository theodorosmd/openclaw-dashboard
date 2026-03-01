import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { logActivity } from '@/lib/log-activity';

export async function POST(request: NextRequest) {
  try {
    const { file, content } = await request.json();

    if (!file || content === undefined) {
      return NextResponse.json({ error: 'File and content required' }, { status: 400 });
    }

    const workspacePath = '/data/.openclaw/workspace';
    const filePath = path.join(workspacePath, file);

    // Security: ensure file is within workspace
    if (!filePath.startsWith(workspacePath)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, content, 'utf8');

    // Log activity
    await logActivity({
      type: 'file_write',
      action: `Updated ${file}`,
      details: {
        file,
        size: content.length,
      },
      result: 'File saved successfully',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to write file:', error);
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
