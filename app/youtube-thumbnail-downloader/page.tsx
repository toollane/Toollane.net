import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeThumbnailDownloaderClient from "./YoutubeThumbnailDownloaderClient";

export const metadata: Metadata = {
  title:
    "YouTube Thumbnail Downloader | Toollane",

  description:
    "Download YouTube thumbnails instantly with Toollane's free online YouTube thumbnail downloader.",
};

const faqs = [
  {
    question:
      "What does a YouTube thumbnail downloader do?",

    answer:

  },

  {
    question:
      "Can I download thumbnails in HD?",

    answer:

  },

  {
    question:
      "Do I need to install anything?",

    answer:

  },
];

export default function YoutubeThumbnailDownloaderPage() {
  return (
    <ToolPageLayout
      title="YouTube Thumbnail Downloader"
      description="Download YouTube thumbnails instantly online."


      href="/youtube-thumbnail-downloader"
      faqs={faqs}
    >
      <YoutubeThumbnailDownloaderClient />
    </ToolPageLayout>
  );
}