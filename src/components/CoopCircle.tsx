import React, { useState } from "react";
import { MessageSquare, Heart, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import { User, ForumPost, SolidarityRequest } from "../types";
import ForumView from "./ForumView";
import SolidarityFundView from "./SolidarityFundView";

interface CoopCircleProps {
  currentUser: User;
  forumPosts: ForumPost[];
  solidarityRequests: SolidarityRequest[];
  onAddPost: (title: string, content: string, category: string) => Promise<boolean>;
  onAddComment: (postId: string, content: string) => Promise<boolean>;
  onApplySolidarity: (formData: {
    category: string;
    description: string;
    hoursRequested: number;
    urgency: string;
  }) => Promise<boolean>;
  onClaimStarter: () => Promise<boolean>;
}

export default function CoopCircle({
  currentUser,
  forumPosts,
  solidarityRequests,
  onAddPost,
  onAddComment,
  onApplySolidarity,
  onClaimStarter,
}: CoopCircleProps) {
  const [activeTab, setActiveTab] = useState<"bulletin" | "mutual-aid">("bulletin");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      {/* Sleek Horizontal Tab Bar for Sub-Views with subtle animations */}
      <div className="h-14 shrink-0 px-6 border-b border-slate-850 bg-slate-900/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("bulletin")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
              activeTab === "bulletin"
                ? "bg-indigo-650 text-white shadow-lg shadow-indigo-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            💬 Co-op Discussions
          </button>
          
          <button
            onClick={() => setActiveTab("mutual-aid")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
              activeTab === "mutual-aid"
                ? "bg-rose-950 border border-rose-900/40 text-rose-350 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ❤️ Solidarity Claims
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          <span>Active Cooperative Node:</span>
          <span className="text-teal-450">Active Circle</span>
        </div>
      </div>

      {activeTab === "bulletin" ? (
        <ForumView
          currentUser={currentUser}
          forumPosts={forumPosts}
          onAddPost={onAddPost}
          onAddComment={onAddComment}
        />
      ) : (
        <SolidarityFundView
          currentUser={currentUser}
          requests={solidarityRequests}
          onApply={onApplySolidarity}
          onClaimStarter={onClaimStarter}
        />
      )}
    </div>
  );
}
