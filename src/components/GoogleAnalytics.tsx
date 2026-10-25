'use client';

import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    let scriptLoaded = false;

    const loadScript = () => {
      if (scriptLoaded) return;
      scriptLoaded = true;

      // Clean up interaction triggers
      window.removeEventListener('scroll', loadScript);
      window.removeEventListener('mousemove', loadScript);
      window.removeEventListener('touchstart', loadScript);
      window.removeEventListener('keydown', loadScript);

      // Inject gtag.js asynchronously
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      const w = window as unknown as {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
      };
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer.push(arguments);
      };
      w.gtag('js', new Date());
      w.gtag('config', gaId, {
        page_path: window.location.pathname,
      });
    };

    // Trigger on first user interaction for accurate analytics without slowing down initial page render
    window.addEventListener('scroll', loadScript, { passive: true, once: true });
    window.addEventListener('mousemove', loadScript, { passive: true, once: true });
    window.addEventListener('touchstart', loadScript, { passive: true, once: true });
    window.addEventListener('keydown', loadScript, { passive: true, once: true });

    // Idle fallback after 4 seconds for non-interactive sessions
    const timeoutId = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadScript);
      } else {
        loadScript();
      }
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', loadScript);
      window.removeEventListener('mousemove', loadScript);
      window.removeEventListener('touchstart', loadScript);
      window.removeEventListener('keydown', loadScript);
    };
  }, [gaId]);

  return null;
}
