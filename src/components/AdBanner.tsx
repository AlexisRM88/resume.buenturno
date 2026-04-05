"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet — silent fail
    }
  }, []);

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8427212204766807"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Fallback visual mientras no se tiene cuenta AdSense aprobada
export function AdPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-xs text-gray-400 ${className}`}
      style={{ minHeight: 80 }}
    >
      Publicidad
    </div>
  );
}
