"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function InfluencerEngagementRateCalculatorClient() {
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [shares, setShares] = useState("");
  const [followers, setFollowers] = useState("");

  const result = useMemo(() => {
    const likesNumber = parseFloat(likes || "0");
    const commentsNumber = parseFloat(comments || "0");
    const sharesNumber = parseFloat(shares || "0");
    const followersNumber = parseFloat(followers);

    if (
      isNaN(likesNumber) ||
      isNaN(commentsNumber) ||
      isNaN(sharesNumber) ||
      isNaN(followersNumber) ||
      likesNumber < 0 ||
      commentsNumber < 0 ||
      sharesNumber < 0 ||
      followersNumber <= 0
    ) {
      return {
        engagementRate: "",
        totalEngagements: "",
      };
    }

    const totalEngagements = likesNumber + commentsNumber + sharesNumber;
    const engagementRate = (totalEngagements / followersNumber) * 100;

    return {
      engagementRate: engagementRate.toFixed(2),
      totalEngagements: totalEngagements.toFixed(0),
    };
  }, [likes, comments, shares, followers]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Influencer Engagement Rate
        </h2>

        <p className="text-black/60 leading-7">
          Measure engagement rate based on likes, comments, shares and follower count.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Likes"
          value={likes}
          onChange={setLikes}
          placeholder="2500"
        />

        <NumberInput
          label="Comments"
          value={comments}
          onChange={setComments}
          placeholder="150"
        />

        <NumberInput
          label="Shares"
          value={shares}
          onChange={setShares}
          placeholder="50"
        />

        <NumberInput
          label="Followers"
          value={followers}
          onChange={setFollowers}
          placeholder="100000"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Engagement Rate
          </div>

          <div className="text-3xl font-bold">
            {result.engagementRate || "0"}%
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Engagements
          </div>

          <div className="text-3xl font-bold">
            {result.totalEngagements || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}