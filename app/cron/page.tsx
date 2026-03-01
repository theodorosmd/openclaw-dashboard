'use client';

import { useState, useEffect } from 'react';
import { RefreshButton } from '@/components/RefreshButton';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  command: string;
  nextRun?: string;
  enabled: boolean;
}

export default function CronManager() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<CronJob | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron/list');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      setMessage('Failed to load cron jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch('/api/cron/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setMessage('✓ Job deleted');
        loadJobs();
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('Failed to delete job');
      }
    } catch (error) {
      setMessage('Failed to delete job');
    }
  };

  const handleEdit = (job: CronJob) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleFormClose = (success: boolean) => {
    setShowForm(false);
    setEditingJob(null);
    if (success) {
      loadJobs();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cron Job Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and delete scheduled tasks</p>
        </div>
        <div className="flex gap-2">
          <RefreshButton />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + New Job
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No scheduled jobs yet.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={() => handleEdit(job)}
              onDelete={() => handleDelete(job.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <CronJobForm
          job={editingJob}
          onClose={handleFormClose}
          onSave={(success) => {
            if (success) {
              setMessage(editingJob ? '✓ Job updated' : '✓ Job created');
              setTimeout(() => setMessage(''), 2000);
            }
            handleFormClose(success);
          }}
        />
      )}
    </div>
  );
}

function JobCard({ job, onEdit, onDelete }: { job: CronJob; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-lg">{job.name}</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              job.enabled 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {job.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Schedule: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{job.schedule}</code>
          </p>
          {job.nextRun && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Next run: {new Date(job.nextRun).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
        <code className="text-xs">{job.command}</code>
      </div>
    </div>
  );
}

function CronJobForm({ job, onClose, onSave }: { job: CronJob | null; onClose: (success: boolean) => void; onSave: (success: boolean) => void }) {
  const [name, setName] = useState(job?.name || '');
  const [schedule, setSchedule] = useState(job?.schedule || '0 0 * * *');
  const [command, setCommand] = useState(job?.command || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = job ? '/api/cron/edit' : '/api/cron/add';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: job?.id,
          name,
          schedule,
          command,
        }),
      });

      if (response.ok) {
        onSave(true);
      } else {
        alert('Failed to save job');
        onSave(false);
      }
    } catch (error) {
      alert('Failed to save job');
      onSave(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">{job ? 'Edit Job' : 'New Job'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., daily-backup"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Schedule (Cron Expression)</label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              required
              placeholder="0 0 * * * (midnight daily)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Examples: <code>0 9 * * 1</code> (Monday 9am), <code>*/30 * * * *</code> (every 30 min)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Command</label>
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              required
              placeholder="openclaw status"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
