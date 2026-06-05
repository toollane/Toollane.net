"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Theme = "light" | "dark" | "cream" | "blue";
type LinkItem = {
  id: string;
  label: string;
  url: string;
};

const THEMES: Record<
  Theme,
  {
    label: string;
    wrapper: string;
    card: string;
    button: string;
    text: string;
    muted: string;
  }
> = {
  light: {
    label: "Light",
    wrapper: "bg-white",
    card: "bg-white border-black/10",
    button: "bg-black text-white",
    text: "text-black",
    muted: "text-black/60",
  },
  dark: {
    label: "Dark",
    wrapper: "bg-black",
    card: "bg-[#111] border-white/10",
    button: "bg-white text-black",
    text: "text-white",
    muted: "text-white/60",
  },
  cream: {
    label: "Cream",
    wrapper: "bg-[#fff8df]",
    card: "bg-white border-black/10",
    button: "bg-black text-white",
    text: "text-black",
    muted: "text-black/60",
  },
  blue: {
    label: "Blue",
    wrapper: "bg-[#eff6ff]",
    card: "bg-white border-blue-200",
    button: "bg-blue-600 text-white",
    text: "text-black",
    muted: "text-black/60",
  },
};

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function LinkInBioGeneratorClient() {
  const [profileName, setProfileName] = useState("Alex Creator");
  const [handle, setHandle] = useState("alexcreator");
  const [bio, setBio] = useState(
    "Creator, strategist and founder sharing useful tools, resources and ideas."
  );
  const [avatarUrl, setAvatarUrl] = useState("");
  const [theme, setTheme] = useState<Theme>("cream");
  const [showBranding, setShowBranding] = useState(true);
  const [links, setLinks] = useState<LinkItem[]>([
    {
      id: crypto.randomUUID(),
      label: "My Website",
      url: "https://example.com",
    },
    {
      id: crypto.randomUUID(),
      label: "Newsletter",
      url: "https://example.com/newsletter",
    },
    {
      id: crypto.randomUUID(),
      label: "Book a Call",
      url: "https://example.com/contact",
    },
  ]);
  const [error, setError] = useState("");

  const selectedTheme = THEMES[theme];

  const slug = useMemo(() => sanitizeSlug(handle || profileName), [handle, profileName]);

  const validLinks = useMemo(() => {
    return links.filter((link) => link.label.trim() && isValidUrl(link.url));
  }, [links]);

  const html = useMemo(() => {
    const avatar = avatarUrl.trim()
      ? `<img src="${avatarUrl}" alt="${profileName}" class="avatar" />`
      : `<div class="avatar-fallback">${profileName.slice(0, 1).toUpperCase()}</div>`;

    const linkHtml = validLinks
      .map(
        (link) =>
          `<a class="bio-link" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
      )
      .join("\n");

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${profileName} | Links</title>
  <meta name="description" content="${bio}" />
  <style>
    body {
      margin: 0;
      font-family: Inter, Arial, sans-serif;
      background: ${theme === "dark" ? "#000" : theme === "blue" ? "#eff6ff" : theme === "cream" ? "#fff8df" : "#fff"};
      color: ${theme === "dark" ? "#fff" : "#000"};
    }
    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 18px;
    }
    .card {
      width: 100%;
      max-width: 460px;
      border: 1px solid ${theme === "dark" ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.1)"};
      border-radius: 32px;
      padding: 28px;
      background: ${theme === "dark" ? "#111" : "#fff"};
      text-align: center;
      box-sizing: border-box;
    }
    .avatar, .avatar-fallback {
      width: 96px;
      height: 96px;
      border-radius: 999px;
      object-fit: cover;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #000;
      color: #fff;
      font-size: 40px;
      font-weight: 900;
    }
    h1 {
      margin: 18px 0 0;
      font-size: 28px;
      line-height: 1.1;
    }
    .handle {
      margin-top: 8px;
      opacity: .6;
      font-size: 14px;
    }
    .bio {
      margin: 18px 0 24px;
      opacity: .75;
      line-height: 1.6;
      font-size: 15px;
    }
    .links {
      display: grid;
      gap: 12px;
    }
    .bio-link {
      display: block;
      border-radius: 18px;
      padding: 16px 18px;
      background: ${theme === "blue" ? "#2563eb" : theme === "dark" ? "#fff" : "#000"};
      color: ${theme === "dark" ? "#000" : "#fff"};
      font-weight: 800;
      text-decoration: none;
    }
    .branding {
      margin-top: 22px;
      opacity: .45;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="card">
      ${avatar}
      <h1>${profileName}</h1>
      <div class="handle">@${handle}</div>
      <p class="bio">${bio}</p>
      <div class="links">
        ${linkHtml}
      </div>
      ${showBranding ? `<div class="branding">Made with Toollane</div>` : ""}
    </section>
  </main>
</body>
</html>`;
  }, [avatarUrl, bio, handle, profileName, showBranding, theme, validLinks]);

  function updateLink(id: string, field: keyof LinkItem, value: string) {
    setLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, [field]: value } : link))
    );
  }

  function addLink() {
    setLinks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label: "New link",
        url: "https://example.com",
      },
    ]);
  }

  function removeLink(id: string) {
    setLinks((current) => current.filter((link) => link.id !== id));
  }

  function moveLink(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= links.length) return;

    const next = [...links];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setLinks(next);
  }

  function validateTool() {
    if (!profileName.trim()) {
      setError("Profile name is required.");
      return false;
    }

    if (!handle.trim()) {
      setError("Handle is required.");
      return false;
    }

    if (!validLinks.length) {
      setError("Add at least one valid link with an https:// URL.");
      return false;
    }

    setError("");
    return true;
  }

  async function copyHtml() {
    if (!validateTool()) return;
    await navigator.clipboard.writeText(html);
  }

  async function copyLinks() {
    if (!validateTool()) return;

    await navigator.clipboard.writeText(
      validLinks.map((link) => `${link.label}: ${link.url}`).join("\n")
    );
  }

  function downloadHtml() {
    if (!validateTool()) return;

    const blob = new Blob([html], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${slug || "link-in-bio"}.html`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setProfileName("Alex Creator");
    setHandle("alexcreator");
    setBio("Creator, strategist and founder sharing useful tools, resources and ideas.");
    setAvatarUrl("");
    setTheme("cream");
    setShowBranding(true);
    setLinks([
      {
        id: crypto.randomUUID(),
        label: "My Website",
        url: "https://example.com",
      },
      {
        id: crypto.randomUUID(),
        label: "Newsletter",
        url: "https://example.com/newsletter",
      },
      {
        id: crypto.randomUUID(),
        label: "Book a Call",
        url: "https://example.com/contact",
      },
    ]);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Link in Bio Generator
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Create a mobile-friendly link in bio page for creators, businesses,
          influencers and personal brands with live preview and exportable HTML.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h2 className="text-lg font-black text-black">Creator-ready bio page</h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Build a clean landing page for Instagram, TikTok, YouTube and X</li>
          <li>• Add unlimited links and rearrange them</li>
          <li>• Export standalone HTML for hosting</li>
          <li>• Mobile-first preview for real social traffic</li>
        </ul>
      </div>

      {error && <ToolErrorBox message={error} />}

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Profile name" value={profileName} onChange={setProfileName} />
          <Input label="Handle" value={handle} onChange={setHandle} />
          <Input label="Avatar image URL" value={avatarUrl} onChange={setAvatarUrl} />
          <label className="block">
            <span className="text-sm font-bold text-black">Theme</span>

            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as Theme)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {Object.entries(THEMES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Textarea label="Bio text" value={bio} onChange={setBio} />

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
          <span className="text-sm font-bold text-black">Show Toollane branding</span>

          <input
            type="checkbox"
            checked={showBranding}
            onChange={(event) => setShowBranding(event.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </label>
      </div>

      <ToolResultBox title="Links">
        <div className="grid gap-4">
          {links.map((link, index) => (
            <div
              key={link.id}
              className="grid gap-3 rounded-[2rem] border border-black/10 bg-white p-4 sm:grid-cols-[1fr_1.4fr_auto]"
            >
              <input
                value={link.label}
                onChange={(event) => updateLink(link.id, "label", event.target.value)}
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="Link label"
              />

              <input
                value={link.url}
                onChange={(event) => updateLink(link.id, "url", event.target.value)}
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="https://example.com"
              />

              <div className="grid grid-cols-3 gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => moveLink(index, "up")}
                  className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black"
                >
                  Up
                </button>

                <button
                  type="button"
                  onClick={() => moveLink(index, "down")}
                  className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black"
                >
                  Down
                </button>

                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addLink}
          className="mt-5 rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Add link
        </button>
      </ToolResultBox>

      <ToolResultBox title="Mobile preview">
        <div className={`mx-auto w-full max-w-sm rounded-[2.5rem] p-4 ${selectedTheme.wrapper}`}>
          <div className={`rounded-[2rem] border p-6 text-center ${selectedTheme.card}`}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profileName}
                className="mx-auto h-24 w-24 rounded-full border border-black/10 object-cover"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-black text-4xl font-black text-white">
                {profileName.slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className={`mt-5 text-2xl font-black ${selectedTheme.text}`}>
              {profileName}
            </div>

            <div className={`mt-1 text-sm ${selectedTheme.muted}`}>@{handle}</div>

            <p className={`mt-5 text-sm leading-6 ${selectedTheme.muted}`}>{bio}</p>

            <div className="mt-6 grid gap-3">
              {validLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`rounded-2xl px-5 py-4 text-sm font-black ${selectedTheme.button}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {showBranding && (
              <div className={`mt-6 text-xs ${selectedTheme.muted}`}>
                Made with Toollane
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ResultCard label="Valid links" value={validLinks.length.toLocaleString()} />
          <ResultCard label="Page slug" value={slug || "link-in-bio"} />
          <ResultCard label="Theme" value={selectedTheme.label} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadHtml}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Download HTML
        </button>

        <button
          type="button"
          onClick={copyHtml}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy HTML
        </button>

        <button
          type="button"
          onClick={copyLinks}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy links
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        A strong link in bio page should load fast, look good on mobile and send
        visitors to your most important offers, content and contact pages.
      </ToolInfoBox>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-[130px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
      />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>
      <div className="mt-2 break-words text-xl font-black text-black">{value}</div>
    </div>
  );
}