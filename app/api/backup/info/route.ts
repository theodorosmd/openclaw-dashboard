import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  const workspacePath = '/data/.openclaw/workspace';

  try {
    // Get workspace size
    const { stdout: sizeOutput } = await execAsync(`du -sh ${workspacePath} 2>/dev/null || echo "0K"`);
    const size = sizeOutput.trim().split('\t')[0];

    // Count files
    const { stdout: fileCount } = await execAsync(`find ${workspacePath} -type f | wc -l`);

    // List main directories
    const { stdout: dirList } = await execAsync(`ls -1 ${workspacePath} 2>/dev/null || echo ""`);
    const directories = dirList.trim().split('\n').filter(Boolean);

    return NextResponse.json({
      size,
      fileCount: parseInt(fileCount.trim()),
      directories,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get backup info' }, { status: 500 });
  }
}
