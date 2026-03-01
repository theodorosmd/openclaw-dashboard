'use client';

import { useState, useEffect } from 'react';

export default function PromptsEditor() {
  const [selectedFile, setSelectedFile] = useState('SOUL.md');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const templates = [
    { file: 'SOUL.md', name: 'Soul', description: 'Your identity and personality' },
    { file: 'AGENTS.md', name: 'Agents', description: 'Agent behavior guidelines' },
    { file: 'HEARTBEAT.md', name: 'Heartbeat', description: 'Periodic check tasks' },
    { file: 'TOOLS.md', name: 'Tools', description: 'Local tool notes' },
    { file: 'USER.md', name: 'User', description: 'About your human' },
    { file: 'IDENTITY.md', name: 'Identity', description: 'Who you are' },
  ];

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

  const selectedTemplate = templates.find(t => t.file === selectedFile);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold mb-4">Prompt Templates</h2>
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.file}
              onClick={() => setSelectedFile(template.file)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedFile === template.file
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{selectedTemplate?.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedTemplate?.description}</p>
          </div>
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
