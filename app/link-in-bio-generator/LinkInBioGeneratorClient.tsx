"use client";

import { useState } from "react";

export default function LinkInBioGeneratorClient() {
  const [title, setTitle] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [links, setLinks] =
    useState([
      {
        label: "",
        url: "",
      },
    ]);

  const addLink = () => {
    setLinks((current) => [
      ...current,
      {
        label: "",
        url: "",
      },
    ]);
  };

  const updateLink = (
    index: number,
    field: "label" | "url",
    value: string
  ) => {
    setLinks((current) =>
      current.map((link, i) =>
        i === index
          ? {
              ...link,
              [field]: value,
            }
          : link
      )
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Link in Bio Generator
        </h2>

        <p className="text-black/60 leading-7">
          Create a simple mobile link
          hub for Instagram, TikTok
          and social media profiles.
        </p>
      </div>

      <input
        value={title}
        onChange={(event) =>
          setTitle(
            event.target.value
          )
        }
        placeholder="Profile Name"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <textarea
        value={bio}
        onChange={(event) =>
          setBio(
            event.target.value
          )
        }
        placeholder="Short Bio"
        rows={3}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid gap-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="grid gap-3 bg-white border border-black/10 rounded-2xl p-4"
          >
            <input
              value={link.label}
              onChange={(event) =>
                updateLink(
                  index,

                  event.target.value
                )
              }
              placeholder="Button Label"
              className="w-full border border-black/10 rounded-xl px-4 py-3"
            />

            <input
              value={link.url}
              onChange={(event) =>
                updateLink(
                  index,

                  event.target.value
                )
              }
              placeholder="https://..."
              className="w-full border border-black/10 rounded-xl px-4 py-3"
            />
          </div>
        ))}
      </div>

      <button
        onClick={addLink}
        className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
      >
        Add Link
      </button>

      <div className="bg-white border border-black/10 rounded-[2rem] p-6 max-w-md mx-auto w-full">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {title || "Your Name"}
          </div>

          <div className="text-black/60 mt-2">
            {bio ||
              "Your bio appears here"}
          </div>
        </div>

        <div className="grid gap-3 mt-8">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url || "#"}
              target="_blank"
              className="bg-black text-white rounded-2xl px-5 py-4 text-center font-semibold"
            >
              {link.label ||
                "Your Link"}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}