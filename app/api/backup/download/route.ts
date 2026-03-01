import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { logActivity } from '@/lib/log-activity';

const execAsync = promisify(exec);

export async function GET() {
  const workspacePath = '/data/.openclaw/workspace';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const zipName = `openclaw-backup-${timestamp}.zip`;
  const zipPath = path.join('/tmp', zipName);

  try {
    // Create ZIP excluding large/unnecessary files
    await execAsync(`cd ${workspacePath} && zip -r ${zipPath} . \
      -x "node_modules/*" \
      -x ".git/*" \
      -x ".next/*" \
      -x "*.log" \
      -x ".DS_Store" \
      2>&1`);

    // Read the ZIP file
    const fileBuffer = await fs.readFile(zipPath);

    // Log activity
    await logActivity({
      type: 'file_read',
      action: 'Downloaded workspace backup',
      details: {
        filename: zipName,
        size: fileBuffer.length,
      },
      result: 'Backup created successfully',
    });

    // Clean up
    await fs.unlink(zipPath).catch(() => {});

    // Return as download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Backup failed:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}
