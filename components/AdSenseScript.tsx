"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const STORAGE_KEY = "toollane-consent-v1";

type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

function hasMarketingConsent() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return false;
    }

    const parsed = JSON.parse(saved) as ConsentState;

    return parsed.marketing === true;
  } catch {
    return false;
  }
}

export default function AdSenseScript() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasMarketingConsent());

    function handleConsentUpdated() {
      setAllowed(hasMarketingConsent());
    }

    window.addEventListener("toollane-consent-updated", handleConsentUpdated);

    return () => {
      window.removeEventListener(
        "toollane-consent-updated",
        handleConsentUpdated
      );
    };
  }, []);

  if (!ADSENSE_CLIENT || !allowed) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}