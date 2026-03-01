import { activityLogger } from "@/lib/activity-logger";
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export default async function Memory() {
  const memoryFiles = await getMemoryFiles();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Memory Browser</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-medium mb-3">Files</h2>
            <div className="space-y-1">
              {memoryFiles.map((file) => (
                <a
                  key={file.path}
                  href={`#${file.path}`}
                  className="block px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {file.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            {memoryFiles.map((file) => (
              <MemoryFileCard key={file.path} file={file} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function getMemoryFiles() {
  const workspacePath = '/data/.openclaw/workspace';
  const files = [];

  try {
    // MEMORY.md
    try {
      const content = await fs.readFile(`${workspacePath}/MEMORY.md`, 'utf8');
      files.push({
        path: 'MEMORY.md',
        name: 'MEMORY.md',
        content,
        size: content.length,
      });
    } catch (e) {
      // File doesn't exist
    }

    // Daily logs
    try {
      const memoryDir = await fs.readdir(`${workspacePath}/memory`);
      for (const file of memoryDir) {
        if (file.endsWith('.md')) {
          const content = await fs.readFile(`${workspacePath}/memory/${file}`, 'utf8');
          files.push({
            path: `memory/${file}`,
            name: file,
            content,
            size: content.length,
          });
        }
      }
    } catch (e) {
      // Directory doesn't exist
    }
  } catch (error) {
    console.error('Error reading memory files:', error);
  }

  return files.sort((a, b) => b.name.localeCompare(a.name));
}

function MemoryFileCard({ file }: { file: any }) {
  return (
    <div id={file.path} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-lg">{file.name}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {(file.size / 1024).toFixed(1)} KB
        </span>
      </div>
      <pre className="text-sm whitespace-pre-wrap overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
        {file.content}
      </pre>
    </div>
  );
}
