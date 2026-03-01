'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TokenSnapshot {
  timestamp: string;
  used: number;
  total: number;
  percentage: number;
}

export function TokenUsageChart() {
  const [data, setData] = useState<TokenSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/tokens/track?hours=24');
      const json = await response.json();
      setData(json.history || []);
    } catch (error) {
      console.error('Failed to load token history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No token usage data yet. Data will appear as you use OpenClaw.
      </div>
    );
  }

  const chartData = data.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    tokens: Math.round(d.used / 1000), // Convert to thousands
    percentage: Math.round(d.percentage),
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            label={{ value: 'Tokens (K)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: any, name: any) => {
              if (!value) return ['', ''];
              if (name === 'tokens') return [`${value}k tokens`, 'Usage'];
              return [`${value}%`, 'Percentage'];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="tokens" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
