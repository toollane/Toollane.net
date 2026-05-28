"use client";

import { useMemo, useState } from "react";

export default function YoutubeThumbnailDownloaderClient() {
  const [url, setUrl] =
    useState("");

  const videoId = useMemo(() => {
    try {
      const parsedUrl =
        new URL(url);

      if (
        parsedUrl.hostname.includes(

        )
      ) {
        return parsedUrl.pathname.replace(

          ""
        );
      }

      return parsedUrl.searchParams.get(

      );
    } catch {
      return null;
    }
  }, [url]);

  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          YouTube Thumbnail Downloader
        </h2>

        <p className="text-black/60 leading-7">
          Download YouTube thumbnails
          instantly in high quality.
        </p>
      </div>

      <input
        value={url}
        onChange={(event) =>
          setUrl(event.target.value)
        }
        placeholder="Paste YouTube URL"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      {thumbnailUrl && (
        <div className="grid gap-6">
          <div className="bg-white border border-black/10 rounded-3xl overflow-hidden">
            <img
              src={thumbnailUrl}
              alt="YouTube Thumbnail"
              className="w-full h-auto"
            />
          </div>

          <a
            href={thumbnailUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
          >
            Download Thumbnail
          </a>
        </div>
      )}
    </div>
  );
}