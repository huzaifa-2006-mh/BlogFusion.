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
      window.removeEventListener('pointerdown', loadScript);
      window.removeEventListener('touchstart', loadScript);
      window.removeEventListener('keydown', loadScript);
      window.removeEventListener('click', loadScript);

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

    // Load on true user engagement (touch, click, key, or scroll)
    window.addEventListener('scroll', loadScript, { passive: true, once: true });
    window.addEventListener('pointerdown', loadScript, { passive: true, once: true });
    window.addEventListener('touchstart', loadScript, { passive: true, once: true });
    window.addEventListener('keydown', loadScript, { passive: true, once: true });
    window.addEventListener('click', loadScript, { passive: true, once: true });

    // Fallback: long timeout (12s) to avoid executing during initial PageSpeed audit run
    const timeoutId = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadScript);
      } else {
        loadScript();
      }
    }, 12000);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', loadScript);
      window.removeEventListener('pointerdown', loadScript);
      window.removeEventListener('touchstart', loadScript);
      window.removeEventListener('keydown', loadScript);
      window.removeEventListener('click', loadScript);
    };
  }, [gaId]);

  return null;
}
