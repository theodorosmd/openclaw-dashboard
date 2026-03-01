'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MemoryEditor() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState('MEMORY.md');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadFile(selectedFile);
  }, [selectedFile]);

  const loadFile = async (filename: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/memory/read?file=${encodeURIComponent(filename)}`);
      const data = await response.json();
      setContent(data.content || '');
    } catch (error) {
      setMessage('Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/memory/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile, content }),
      });
      
      if (response.ok) {
        setMessage('✓ Saved successfully');
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('Failed to save');
      }
    } catch (error) {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const files = [
    'MEMORY.md',
    'memory/2026-03-01.md',
    'memory/2026-02-28.md',
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold mb-4">Memory Files</h2>
        <div className="space-y-1">
          {files.map((file) => (
            <button
              key={file}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                selectedFile === file
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {file}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => router.push('/memory')}
          className="w-full mt-6 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          ← Back to View
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{selectedFile}</h1>
          <div className="flex items-center gap-3">
            {message && (
              <span className={`text-sm ${message.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </span>
            )}
            <button
              onClick={saveFile}
              disabled={saving || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Start writing..."
            />
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>{content.length} characters · {content.split('\n').length} lines</span>
          <span>Ctrl/Cmd + S to save</span>
        </div>
      </div>
    </div>
  );
}
