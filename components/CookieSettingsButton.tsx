"use client";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new Event("toollane-open-consent-settings")
        );
      }}
      className="text-sm text-white/70 transition hover:text-white"
    >
      Cookie Settings
    </button>
  );
}