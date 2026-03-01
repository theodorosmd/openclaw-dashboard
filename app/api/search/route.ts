import { NextRequest, NextResponse } from 'next/server';
import { activityLogger } from '@/lib/activity-logger';
import fs from 'fs/promises';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = [];

  try {
    // Search activity log
    const activities = await activityLogger.search(query, 20);
    results.push(...activities.map(a => ({
      type: 'activity',
      title: a.action,
      path: 'activity-log.jsonl',
      excerpt: JSON.stringify(a.details).slice(0, 150),
      matches: 1,
    })));

    // Search memory files
    const workspacePath = '/data/.openclaw/workspace';
    
    // Search MEMORY.md
    try {
      const memoryContent = await fs.readFile(`${workspacePath}/MEMORY.md`, 'utf8');
      if (memoryContent.toLowerCase().includes(query.toLowerCase())) {
        const lines = memoryContent.split('\n');
        const matchingLines = lines.filter(line => 
          line.toLowerCase().includes(query.toLowerCase())
        );
        results.push({
          type: 'memory',
          title: 'MEMORY.md',
          path: 'MEMORY.md',
          excerpt: matchingLines.slice(0, 3).join('\n'),
          matches: matchingLines.length,
        });
      }
    } catch (e) {
      // File doesn't exist
    }

    // Search daily logs
    try {
      const memoryFiles = await fs.readdir(`${workspacePath}/memory`);
      for (const file of memoryFiles) {
        if (file.endsWith('.md')) {
          const content = await fs.readFile(`${workspacePath}/memory/${file}`, 'utf8');
          if (content.toLowerCase().includes(query.toLowerCase())) {
            const lines = content.split('\n');
            const matchingLines = lines.filter(line =>
              line.toLowerCase().includes(query.toLowerCase())
            );
            results.push({
              type: 'memory',
              title: file,
              path: `memory/${file}`,
              excerpt: matchingLines.slice(0, 2).join('\n'),
              matches: matchingLines.length,
            });
          }
        }
      }
    } catch (e) {
      // Directory doesn't exist
    }

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }

  return NextResponse.json({ results: results.slice(0, 50) });
}
