import React, { useState } from "react";
import { 
  MessageSquare, Heart, ThumbsUp, Send, CheckCircle, AlertCircle, Plus, X, User
} from "lucide-react";
import { ForumPost, User as UserType } from "../types";

interface ForumViewProps {
  currentUser: UserType;
  forumPosts: ForumPost[];
  onAddPost: (title: string, content: string, category: string) => Promise<boolean>;
  onAddComment: (postId: string, content: string) => Promise<boolean>;
}

export default function ForumView({ currentUser, forumPosts, onAddPost, onAddComment }: ForumViewProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(forumPosts[0]?.id || null);
  const [commentVal, setCommentVal] = useState("");
  
  // Create New Post modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Member Standards");

  // Local feedback operations
  const [txSuccess, setTxSuccess] = useState("");
  const [txError, setTxError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activePost = forumPosts.find(f => f.id === selectedPostId) || forumPosts[0];

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      setTxError("Title or Content are empty.");
      return;
    }
    setSubmitting(true);
    setTxError("");
    setTxSuccess("");
    try {
      const res = await onAddPost(newTitle, newContent, newCategory);
      if (res) {
        setTxSuccess("Forum thread created successfully!");
        setNewTitle("");
        setNewContent("");
        setTimeout(() => {
          setShowCreateModal(false);
          setTxSuccess("");
        }, 1500);
      } else {
        setTxError("Failed to publish forum post.");
      }
    } catch {
      setTxError("Lead connection server forum error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentVal || !activePost) return;
    setSubmitting(true);
    try {
      const res = await onAddComment(activePost.id, commentVal);
      if (res) {
        setCommentVal("");
      }
    } catch {
      alert("Error posting comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: forum list of topics */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-display">MEMBER BULLETIN BOARD</span>
            <h2 className="text-2xl font-extrabold text-white font-display mt-1">Cooperative Forums</h2>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer transition uppercase tracking-wider font-display"
          >
            <Plus className="w-4 h-4 shrink-0" /> Start Thread
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {forumPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => setSelectedPostId(post.id)}
              className={`p-4.5 rounded-2xl border transition cursor-pointer text-left ${selectedPostId === post.id ? "bg-slate-900/40 border-indigo-500/80 shadow-md backdrop-blur-md" : "bg-slate-900/20 border-slate-850 hover:bg-slate-950/40 hover:border-slate-800"}`}
            >
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest bg-slate-950/60 border border-slate-850 text-slate-400 px-2 py-0.5 rounded-md">{post.category}</span>
                <span className="text-[10px] text-slate-500 font-mono">{post.createdAt}</span>
              </div>

              <h4 className="font-extrabold text-slate-200 text-xs truncate mb-1.5 font-display">{post.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">{post.content}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-850/60">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-350">{post.authorName}</span>
                </div>
                
                <span className="flex items-center gap-1 font-mono"><MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount} comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: active forum discussion details & comments timeline */}
      <div className="lg:col-span-7">
        {activePost ? (
          <div className="bg-slate-900/40 rounded-3xl border border-slate-850 p-6 space-y-6 shadow-md backdrop-blur-md">
            {/* Header profile author block */}
            <div className="flex justify-between items-start border-b border-slate-850/60 pb-4">
              <div>
                <span className="text-[10px] bg-indigo-950/60 border border-indigo-900/35 text-indigo-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">{activePost.category}</span>
                <h3 className="font-extrabold text-white mt-3 text-lg font-display">{activePost.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1">Written by <strong className="text-slate-300 font-display">{activePost.authorName}</strong> on {activePost.createdAt}</p>
              </div>
            </div>

            {/* Post full body message content */}
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
              "{activePost.content}"
            </p>

            {/* Comments Lists section */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-400 text-2xs uppercase tracking-wider font-mono">Discussion Comments Timeline ({activePost.commentsCount})</h4>
              
              <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {activePost.comments.map((comm, index) => (
                  <div key={index} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-300 font-display">{comm.author}</span>
                      <span className="text-slate-500 font-mono text-[9px]">{comm.date}</span>
                    </div>
                    <p className="text-xs text-slate-405 leading-relaxed font-sans">{comm.content}</p>
                  </div>
                ))}

                {activePost.comments.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4 font-sans">No comments registered. Start the conversation below!</p>
                )}
              </div>
            </div>

            {/* Comment write entry */}
            <form onSubmit={handlePostComment} className="border-t border-slate-850/60 pt-4 flex gap-3">
              <input 
                type="text" 
                placeholder="Write a message to add to the co-op circle discussion..." 
                value={commentVal}
                onChange={(e) => setCommentVal(e.target.value)}
                className="flex-1 bg-slate-955 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500/40"
                required
              />
              <button 
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1 transition cursor-pointer font-display"
              >
                <Send className="w-3.5 h-3.5 shrink-0" /> Share
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-850 backdrop-blur-md">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
            <p className="text-slate-400 text-xs mt-2">Choose an active thread from the left menu bar list to join co-op discussion.</p>
          </div>
        )}
      </div>

      {/* Initialize Start Forum post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreatePost} className="bg-slate-900 border border-slate-850 rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl relative">
            <button type="button" onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 p-1.5 bg-slate-950 text-slate-400 rounded-full hover:bg-slate-850 hover:text-white transition cursor-pointer"><X className="w-5 h-5" /></button>
            
            <span className="text-xs font-bold uppercase text-indigo-400 tracking-widest block mb-1 font-display">Cooperative Bulletin board</span>
            <h4 className="text-xl font-bold mb-4 text-white font-display">Start New Forum Thread</h4>

            {txError && (
              <div className="bg-red-955/70 text-red-305 text-xs p-3.5 rounded-xl border border-red-900/40 flex items-center gap-2 mb-4 animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{txError}</span>
              </div>
            )}

            {txSuccess && (
              <div className="bg-teal-955/70 text-teal-300 text-xs p-3.5 rounded-xl border border-teal-950/40 flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-[#14B8A6] shrink-0" />
                <span>{txSuccess}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-display">Thread Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Standard practices for booking and scheduling review"
                  className="w-full bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5 font-display">Bulletin Classification / Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500/40"
                >
                  <option value="Member Standards" className="bg-slate-950 text-white">Member Standards & Escrow Rules</option>
                  <option value="Success Stories" className="bg-slate-950 text-white">General Success Stories</option>
                  <option value="Local Campaigns" className="bg-slate-950 text-white">NGO Local Campaigns</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5 font-display">Content Post</label>
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Write details explaining co-op considerations..."
                  className="w-full bg-slate-955 border border-slate-850 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500/40"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submitting || !!txSuccess}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer font-display"
              >
                {submitting ? "Publishing thread..." : "Publish Forum Post Thread"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
