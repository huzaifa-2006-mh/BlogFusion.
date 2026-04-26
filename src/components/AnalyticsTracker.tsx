'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const visitorIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Get or Generate Visitor ID
    let vid = localStorage.getItem('blog_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('blog_visitor_id', vid);
    }
    visitorIdRef.current = vid;

    // 2. Initial Ping
    const logVisit = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: vid,
            path: pathname,
            duration: 0,
            email: localStorage.getItem('user_email') || null
          })
        });
      } catch (err) {
        console.error('Failed to log visit', err);
      }
    };

    logVisit();

    // 3. Heartbeat every 30 seconds
    const interval = setInterval(async () => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: vid,
            path: pathname,
            duration: elapsed,
            email: localStorage.getItem('user_email') || null
          })
        });
      } catch (err) {
        // Silent fail
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      startTimeRef.current = Date.now(); // Reset for path change
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}
