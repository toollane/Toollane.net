import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeThumbnailDownloaderClient from "./YoutubeThumbnailDownloaderClient";

export const metadata: Metadata = {
  title:
    "YouTube Thumbnail Downloader | Toollane",

  description:
    "Download YouTube thumbnails instantly with Toollane's free online YouTube thumbnail downloader.",


  alternates: {
    canonical: "/youtube-thumbnail-downloader",
  },
};

export default function YoutubeThumbnailDownloaderPage() {
  return (
    <ToolPageLayout
      title="YouTube Thumbnail Downloader"
      description="Download YouTube thumbnails instantly online."


      href="/youtube-thumbnail-downloader"
    >
      <YoutubeThumbnailDownloaderClient />
    </ToolPageLayout>
  );
}