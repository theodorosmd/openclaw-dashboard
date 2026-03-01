'use client';

import { useState, useEffect } from 'react';

export default function Settings() {
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [theme, setTheme] = useState('auto');
  const [backupInfo, setBackupInfo] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedInterval = localStorage.getItem('refreshInterval');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedInterval) setRefreshInterval(parseInt(savedInterval));
    if (savedTheme) setTheme(savedTheme);

    // Load backup info
    loadBackupInfo();
  }, []);

  const loadBackupInfo = async () => {
    try {
      const response = await fetch('/api/backup/info');
      const data = await response.json();
      setBackupInfo(data);
    } catch (error) {
      console.error('Failed to load backup info:', error);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('refreshInterval', refreshInterval.toString());
    localStorage.setItem('theme', theme);
    setMessage('✓ Settings saved. Reload page to apply.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDownloadBackup = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/backup/download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `openclaw-backup-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage('✓ Backup downloaded');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Failed to download backup');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {message && (
        <div className={`mb-6 p-3 rounded ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Auto-Refresh Settings */}
        <Card title="Auto-Refresh">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            System dashboard auto-refreshes to show real-time data.
          </p>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Refresh interval (seconds):</label>
            <input
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 5)}
              min="1"
              max="300"
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">seconds</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Recommended: 5-10 seconds. Lower values may increase server load.
          </p>
        </Card>

        {/* Theme Settings */}
        <Card title="Appearance">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose your preferred color scheme.
          </p>
          <div className="space-y-2">
            {[
              { value: 'auto', label: 'Auto (system preference)' },
              { value: 'light', label: 'Light mode' },
              { value: 'dark', label: 'Dark mode' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={theme === option.value}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: Theme changes require page reload to take effect.
          </p>
        </Card>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Settings
        </button>

        {/* Backup & Export */}
        <Card title="Backup & Export">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download your entire workspace as a ZIP file.
          </p>
          
          {backupInfo && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Workspace size:</span>
                  <span className="ml-2 font-mono">{backupInfo.size}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total files:</span>
                  <span className="ml-2 font-mono">{backupInfo.fileCount?.toLocaleString()}</span>
                </div>
              </div>
              {backupInfo.directories && (
                <div className="mt-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Directories: {backupInfo.directories.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating backup...
              </>
            ) : (
              <>
                📦 Download Backup
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Excludes: node_modules, .git, .next, log files
          </p>
        </Card>

        {/* Danger Zone */}
        <Card title="Danger Zone">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Dangerous actions that cannot be undone.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                if (confirm('Are you sure? This will clear all activity logs.')) {
                  fetch('/api/activity/clear', { method: 'POST' })
                    .then(() => {
                      setMessage('✓ Activity log cleared');
                      setTimeout(() => setMessage(''), 2000);
                    })
                    .catch(() => setMessage('Failed to clear activity log'));
                }
              }}
              className="px-4 py-2 border border-red-300 text-red-700 dark:border-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
            >
              Clear Activity Log
            </button>
            
            <button
              onClick={() => {
                if (confirm('Are you sure? This will clear all token usage history.')) {
                  fetch('/api/tokens/clear', { method: 'POST' })
                    .then(() => {
                      setMessage('✓ Token history cleared');
                      setTimeout(() => setMessage(''), 2000);
                    })
                    .catch(() => setMessage('Failed to clear token history'));
                }
              }}
              className="ml-3 px-4 py-2 border border-red-300 text-red-700 dark:border-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
            >
              Clear Token History
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
