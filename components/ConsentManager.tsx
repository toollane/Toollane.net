"use client";

import { useEffect, useState } from "react";

type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "toollane-consent-v1";

const defaultConsent: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ConsentManager() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

useEffect(() => {
  function openSettings() {
    setVisible(true);
    setSettingsOpen(true);
  }

  window.addEventListener("toollane-open-consent-settings", openSettings);

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    applyConsent(defaultConsent);
    setVisible(true);
  } else {
    try {
      const parsed = JSON.parse(saved) as ConsentState;
      setConsent(parsed);
      applyConsent(parsed);
    } catch {
      applyConsent(defaultConsent);
      setVisible(true);
    }
  }

  return () => {
    window.removeEventListener("toollane-open-consent-settings", openSettings);
  };
}, []);

  function applyConsent(value: ConsentState) {
    window.gtag?.("consent", "update", {
      analytics_storage: value.analytics ? "granted" : "denied",
      ad_storage: value.marketing ? "granted" : "denied",
      ad_user_data: value.marketing ? "granted" : "denied",
      ad_personalization: value.marketing ? "granted" : "denied",
    });

    window.dispatchEvent(
      new CustomEvent("toollane-consent-updated", {
        detail: value,
      })
    );
  }

  function saveConsent(value: ConsentState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    applyConsent(value);
    setVisible(false);
    setSettingsOpen(false);
  }

  function acceptAll() {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
  }

  function rejectOptional() {
    saveConsent(defaultConsent);
  }

  function saveCustom() {
    saveConsent(consent);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-black/40 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-black/10 bg-white p-6 shadow-2xl sm:p-8">
        {!settingsOpen ? (
          <>
            <div className="mb-6 inline-flex rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
              Privacy Preferences
            </div>

            <h2 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
              We respect your privacy
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/65">
              Toollane uses essential storage to keep the website working. With
              your permission, we may also use analytics and advertising
              technologies to improve Toollane and keep our tools free.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={rejectOptional}
                className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-bold text-black transition hover:bg-black/5"
              >
                Reject optional
              </button>

              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4 text-sm font-bold text-black transition hover:bg-black/5"
              >
                Customize
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Accept all
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-black tracking-tight text-black">
              Cookie preferences
            </h2>

            <div className="mt-6 space-y-4">
              <ConsentOption
                title="Essential"
                description="Required for basic website functionality. These cannot be disabled."
                checked
                disabled
                onChange={() => {}}
              />

              <ConsentOption
                title="Analytics"
                description="Helps us understand how visitors use Toollane so we can improve performance, UX and content quality."
                checked={consent.analytics}
                onChange={(checked) =>
                  setConsent((current) => ({
                    ...current,
                    analytics: checked,
                  }))
                }
              />

              <ConsentOption
                title="Marketing"
                description="Allows advertising and ad measurement technologies such as Google AdSense in the future."
                checked={consent.marketing}
                onChange={(checked) =>
                  setConsent((current) => ({
                    ...current,
                    marketing: checked,
                  }))
                }
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-2xl border border-black/10 px-5 py-4 text-sm font-bold text-black transition hover:bg-black/5"
              >
                Back
              </button>

              <button
                type="button"
                onClick={saveCustom}
                className="rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Save preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ConsentOption({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
      <div>
        <div className="font-bold text-black">{title}</div>
        <p className="mt-2 text-sm leading-6 text-black/60">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-black"
      />
    </label>
  );
}