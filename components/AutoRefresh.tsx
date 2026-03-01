'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AutoRefreshProps {
  interval?: number; // milliseconds
}

export function AutoRefresh({ interval = 5000 }: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [interval, router]);

  return null; // This component doesn't render anything
}
