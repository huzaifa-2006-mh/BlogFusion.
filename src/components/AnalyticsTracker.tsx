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

    // 2. Initial Visit Log
    const logVisit = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: vid,
            path: pathname,
            duration: 0,
            email: localStorage.getItem('user_email') || null,
          }),
        });
      } catch (err) {
        // Silently catch analytics failures
      }
    };

    logVisit();

    // Close mobile menu on navigation
    const toggle = document.getElementById('nav-toggle') as HTMLInputElement;
    if (toggle) toggle.checked = false;

    // 3. Capture final duration on unload
    const handleUnload = () => {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      const data = JSON.stringify({
        visitorId: vid,
        path: pathname,
        duration: elapsed,
        email: localStorage.getItem('user_email') || null,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', data);
      } else {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true,
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      startTimeRef.current = Date.now();
    };
  }, [pathname]);

  return null;
}
