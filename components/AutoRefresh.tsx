'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AutoRefreshProps {
  interval?: number; // milliseconds (default, can be overridden by settings)
}

export function AutoRefresh({ interval = 5000 }: AutoRefreshProps) {
  const router = useRouter();
  const [actualInterval, setActualInterval] = useState(interval);

  useEffect(() => {
    // Read from localStorage
    const savedInterval = localStorage.getItem('refreshInterval');
    if (savedInterval) {
      setActualInterval(parseInt(savedInterval) * 1000); // Convert seconds to ms
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    }, actualInterval);

    return () => clearInterval(timer);
  }, [actualInterval, router]);

  return null; // This component doesn't render anything
}
