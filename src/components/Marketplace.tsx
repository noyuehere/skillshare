import React, { useState } from "react";
import { 
  Search, Grid, List as ListIcon, Star, BadgeCheck, Clock, Check, Plus, AlertCircle, X, ChevronRight, User, Sparkles, Cpu, BookOpen
} from "lucide-react";
import { SkillListing, User as UserType } from "../types";
import AiMatchingSystem from "./AiMatchingSystem";

interface MarketplaceProps {
  listings: SkillListing[];
  currentUser: UserType;
  onBook: (listingId: string, date: string, time: string) => Promise<boolean>;
  onCreateListing: (formData: {
    title: string;
    description: string;
    category: string;
    skillLevel: string;
    availability: string;
    cost: number;
  }) => Promise<boolean>;
  onFetchAiMatches: (offered: string, needed: string) => Promise<any[] | null>;
}

export default function Marketplace({ 
  listings, 
  currentUser, 
  onBook, 
  onCreateListing,
  onFetchAiMatches
}: MarketplaceProps) {
  // Inner Sub-tab: "directory" | "ai-matchmaker"
  const [activeTab, setActiveTab] = useState<"directory" | "ai-matchmaker">("directory");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("All");
  const [maxCost, setMaxCost] = useState(3.0);
  const [showMentorsOnly, setShowMentorsOnly] = useState(false);
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    category: "Technology",
    skillLevel: "Intermediate",
    availability: "Weekdays, evenings",
    cost: 1.0
  });

  // Book Modal State
  const [bookingListing, setBookingListing] = useState<SkillListing | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-06-05");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  
  // Local operation states
  const [txError, setTxError] = useState("");
  const [txSuccess, setTxSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listing Reviews Details drawer State
  const [inspectListing, setInspectListing] = useState<SkillListing | null>(null);

  const categories = [
    "All", "Tutoring", "Technology", "Languages", "Career Guidance", 
    "Creative Arts", "Business Skills", "Health & Wellness", "Community Services"
  ];

  // Filtering Logic
  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesLevel = selectedSkillLevel === "All" || item.skillLevel === selectedSkillLevel;
    const matchesCost = item.cost <= maxCost;
    
    // Mentor filtering logic: match technology, business development, or career services
    const matchesMentor = !showMentorsOnly || (
      item.category === "Technology" || item.category === "Business Skills" || item.category === "Career Guidance"
    );

    return matchesSearch && matchesCategory && matchesLevel && matchesCost && matchesMentor;
  });

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title || !newListing.description || !newListing.cost) {
      setTxError("Please complete all fields correctly.");
      return;
    }
    setIsSubmitting(true);
    setTxError("");
    try {
      const res = await onCreateListing(newListing);
      if (res) {
        setTxSuccess("Successfully published your cooperative skill listing!");
        setNewListing({
          title: "",
          description: "",
          category: "Technology",
          skillLevel: "Intermediate",
          availability: "Weekdays, evenings",
          cost: 1.0
        });
        setTimeout(() => {
          setShowCreateModal(false);
          setTxSuccess("");
        }, 1500);
      } else {
        setTxError("Failed to broadcast listing. Try again.");
      }
    } catch {
      setTxError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Booking Submit
  const handleBookingSubmit = async () => {
    if (!bookingListing) return;
    setIsSubmitting(true);
    setTxError("");
    try {
      if (currentUser.id === bookingListing.providerId) {
        setTxError("You cannot exchange skills with yourself! Browse other member resources.");
        setIsSubmitting(false);
        return;
      }
      
      const res = await onBook(bookingListing.id, bookingDate, bookingTime);
      if (res) {
        setTxSuccess("Booking completed successfully! Credits held in Escrow.");
        setTimeout(() => {
          setBookingListing(null);
          setTxSuccess("");
        }, 1500);
      } else {
        setTxError("Booking failed. Please check your current Unity Hours liquidity.");
      }
    } catch (err: any) {
      setTxError(err.message || "Failed booking transaction process.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      {/* Sub-NavigationBar for Marketplace elements */}
      <div className="h-14 shrink-0 px-6 border-b border-slate-850 bg-slate-900/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
              activeTab === "directory"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📁 Browse Skills Bulletin
          </button>
          
          <button
            onClick={() => setActiveTab("ai-matchmaker")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
              activeTab === "ai-matchmaker"
                ? "bg-indigo-650 text-white shadow-lg shadow-indigo-500/15"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🤖 AI Swap Matchmaking
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-teal-400 font-extrabold uppercase bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-900/30">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span>Gemini Match Enabled</span>
        </div>
      </div>

      {activeTab === "ai-matchmaker" ? (
        <AiMatchingSystem
          currentUser={currentUser}
          onFetchAiMatches={onFetchAiMatches}
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Header with Search and Create CTA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-none font-display">Time Banking Registry</span>
              <h2 className="text-2xl font-extrabold text-white font-display mt-1">
                The Co-op Skill Marketplace
              </h2>
              <p className="text-slate-400 text-xs">
                Directly browse offered professional expertise or book advisory sessions.
              </p>
            </div>

            <button
              id="btn-create-listing"
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all font-display cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Broadcast Your Skill Listing
            </button>
          </div>

          {/* Main Filter Suite */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 space-y-4 mb-8 shadow-sm">
            {/* Search Bar & Categorizations */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search by topic, keyword, or community provider name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/65 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2.5 items-center">
                {/* Skill Level Filter */}
                <select 
                  value={selectedSkillLevel} 
                  onChange={(e) => setSelectedSkillLevel(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-750 cursor-pointer"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert / Native</option>
                </select>

                {/* Mentors Toggle Segment */}
                <button
                  type="button"
                  onClick={() => setShowMentorsOnly(!showMentorsOnly)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition ${
                    showMentorsOnly
                      ? "bg-amber-950 border-amber-900 text-amber-300 shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-205"
                  }`}
                >
                  🎓 Specialists & Mentors Only
                </button>

                {/* Price slider */}
                <div className="bg-slate-955 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 justify-between shrink-0">
                  <span className="text-[10px] text-slate-505 font-bold uppercase">Max cost:</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="5.0" 
                    step="0.5" 
                    value={maxCost} 
                    onChange={(e) => setMaxCost(parseFloat(e.target.value))}
                    className="w-16 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-blue-400">{maxCost} UH</span>
                </div>
              </div>
            </div>

            {/* Categories Horizon scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/40 pt-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]" 
                      : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count & Wallet Warning */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-400">{filteredListings.length} matching listings available</span>
            <div className="text-[11px] bg-amber-950/40 border border-amber-900/40 text-amber-300 font-bold px-3 py-1 rounded-lg shadow-sm">
              Current Available Hours: <span className="text-slate-100 font-mono font-extrabold">{currentUser.unityHours.toFixed(1)} UH</span>
            </div>
          </div>

          {/* Grid List of listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredListings.map((listing) => {
              // Highlight mentor category matches
              const isTechnologyOrMentor = 
                listing.category === "Technology" || 
                listing.category === "Business Skills" || 
                listing.category === "Career Guidance";

              return (
                <div key={listing.id} className="bg-slate-900/40 rounded-3xl border border-slate-800/85 backdrop-blur-sm shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group">
                  
                  {/* Top area */}
                  <div className="p-6 space-y-4">
                    {/* Profile Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={listing.providerAvatar} alt={listing.providerName} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                        <div>
                          <h5 className="font-bold text-slate-205 text-xs">{listing.providerName}</h5>
                          <div className="flex items-center gap-1">
                            <BadgeCheck className={`w-3.5 h-3.5 ${
                              listing.providerBadge === "Community Leader" ? "text-amber-500" : listing.providerBadge === "Institution Verified" ? "text-teal-500" : "text-blue-500"
                            }`} />
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{listing.providerBadge}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating & Trust badge */}
                      <div className="text-right">
                        <div className="flex items-center gap-0.5 justify-end">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-slate-200">{listing.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Score: {listing.providerTrustScore}%</span>
                      </div>
                    </div>

                    {/* Title and Category */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        <span className="inline-block bg-slate-800 text-slate-350 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {listing.category}
                        </span>
                        {isTechnologyOrMentor && (
                          <span className="inline-block bg-amber-950/55 border border-amber-900/40 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                            🎓 SPECIALIST
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition truncate">{listing.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed h-[54px] overflow-hidden">{listing.description}</p>
                    </div>

                    {/* Badges/Metadata */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-950/65 px-2 py-1 rounded border border-slate-850/60">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {listing.availability}
                      </span>
                      <span className="bg-slate-950/65 px-2 py-1 rounded border border-slate-850/60">Level: {listing.skillLevel}</span>
                    </div>
                  </div>

                  {/* Bottom cost and Booking CTA */}
                  <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Direct Exchange</span>
                      <p className="text-sm font-extrabold text-white">{listing.cost.toFixed(1)} <span className="text-xs font-medium text-slate-500">UH / session</span></p>
                    </div>

                    <div className="flex gap-1.5">
                      {listing.reviewsCount > 0 && (
                        <button 
                          onClick={() => setInspectListing(listing)}
                          className="p-2 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-bold font-display cursor-pointer"
                          title="Read reviews"
                        >
                          Reviews ({listing.reviewsCount})
                        </button>
                      )}
                      <button
                        id={`book-mentor-${listing.id}`}
                        onClick={() => setBookingListing(listing)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition cursor-pointer font-display"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {ifEmptyList()}

          {/* Reviews view Modal/Drawer Drawer */}
          {inspectListing && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-900 rounded-[2rem] border border-slate-800 max-w-lg w-full p-6 shadow-2xl relative">
                <button onClick={() => setInspectListing(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
                <h4 className="font-bold text-lg text-white mb-2 truncate">Reviews for "{inspectListing.title}"</h4>
                <p className="text-xs text-slate-400 mb-4 uppercase font-bold text-blue-400">Offered by {inspectListing.providerName}</p>
                
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {inspectListing.reviews.map((rev, i) => (
                    <div key={i} className="bg-slate-955 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-200">{rev.reviewerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                      </div>
                      <div className="flex mb-1.5">
                        {Array.from({ length: 5 }).map((_, stIdx) => (
                          <Star key={stIdx} className={`w-3 h-3 ${stIdx < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-800"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
                
                <button onClick={() => setInspectListing(null)} className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-750 border border-slate-705 text-white rounded-xl text-xs font-bold transition">
                  Dismiss Reviews Panel
                </button>
              </div>
            </div>
          )}

          {/* Book Session Scheduling Modal */}
          {bookingListing && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-905 rounded-[2.5rem] border border-slate-800 p-6 max-w-md w-full shadow-2xl relative">
                <button onClick={() => setBookingListing(null)} className="absolute top-4 right-4 p-1.5 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300 cursor-pointer"><X className="w-4 h-4" /></button>
                
                <span className="text-xs font-bold uppercase text-blue-405 tracking-wider block mb-1">Escrow Mutual Lock</span>
                <h4 className="text-xl font-bold text-white mb-4 font-display">Schedule Swaps Session</h4>

                {txError && (
                  <div className="bg-red-955 p-3.5 rounded-xl border border-red-900/30 flex items-center gap-2 mb-4 text-xs text-red-300 leading-normal animate-pulse">
                    <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
                    <span>{txError}</span>
                  </div>
                )}

                {txSuccess && (
                  <div className="bg-emerald-950/70 text-emerald-300 text-xs p-3.5 rounded-xl border border-emerald-900/40 flex items-center gap-2 mb-4 animate-pulse">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{txSuccess}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <img src={bookingListing.providerAvatar} alt={bookingListing.providerName} className="w-10 h-10 rounded-full object-cover border border-slate-850" />
                    <div>
                      <h5 className="font-bold text-xs text-white">{bookingListing.providerName}</h5>
                      <p className="text-[10px] text-slate-500">Advising Status Score: {bookingListing.providerTrustScore}% rating</p>
                    </div>
                  </div>

                  <div className="bg-blue-950/20 p-4 rounded-xl text-slate-300 border border-blue-900/30 text-xs space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>Selected Program:</span>
                      <span className="text-white text-right truncate max-w-xs">{bookingListing.title}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Prerequisites cost:</span>
                      <span className="font-extrabold text-blue-400">{bookingListing.cost.toFixed(1)} UH</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-900/50 pt-2 text-[10px] text-slate-500 font-mono">
                      <span>Your Buffer: {currentUser.unityHours.toFixed(1)} UH</span>
                      <span>Security Held in Co-op Escrow</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5 font-display">Target Date</label>
                      <input 
                        type="date" 
                        value={bookingDate} 
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-blue-550 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5 font-display">Proposed TimeSlot</label>
                      <input 
                        type="text" 
                        value={bookingTime} 
                        onChange={(e) => setBookingTime(e.target.value)}
                        placeholder="e.g. 10:00 AM EST"
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 text-slate-205 placeholder-slate-600 rounded-xl text-xs focus:ring-1 focus:ring-blue-555 focus:outline-none" 
                      />
                    </div>
                  </div>

                  <button 
                    id="submit-book"
                    disabled={isSubmitting || !!txSuccess}
                    onClick={handleBookingSubmit}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-550 hover:to-teal-450 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all font-display cursor-pointer"
                  >
                    {isSubmitting ? "Locking Escrow..." : "Authorize Unity Hours Booking"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Skill Listing Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleCreateSubmit} className="bg-slate-900 rounded-[2.5rem] p-6 max-w-lg w-full border border-slate-800 shadow-2xl relative text-white">
                <button type="button" onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 p-1.5 bg-slate-800 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition"><X className="w-4 h-4" /></button>
                
                <span className="text-xs font-bold uppercase text-teal-400 tracking-wider block mb-1">Broaden Regional Capabilities</span>
                <h4 className="text-xl font-bold text-white mb-4 font-display">Broadcast Skill Offering Listing</h4>

                {txError && (
                  <div className="bg-red-955 text-red-300 text-xs p-3.5 rounded-xl border border-red-900/40 flex items-center gap-2 mb-4 animate-pulse leading-normal">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{txError}</span>
                  </div>
                )}

                {txSuccess && (
                  <div className="bg-emerald-950/70 text-emerald-300 text-xs p-3.5 rounded-xl border border-emerald-900/40 flex items-center gap-2 mb-4 animate-pulse">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{txSuccess}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-display">Listing Title (What are you offering?)</label>
                    <input 
                      type="text" 
                      value={newListing.title}
                      onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                      placeholder="e.g. 1-on-1 Cybersecurity & SSL Certificate Security setup" 
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 px-4 py-3 rounded-xl text-xs focus:ring-1 focus:ring-teal-500" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-display">Description (Target outcomes / structure)</label>
                    <textarea 
                      value={newListing.description}
                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                      rows={3}
                      placeholder="Explain details on co-op sessions lessons, target lengths, or material prerequisites..." 
                      className="w-full bg-slate-950 border border-slate-800 px-4 py-3 text-slate-100 placeholder-slate-650 rounded-xl text-xs focus:ring-1 focus:ring-teal-500" 
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-display">Category Pill</label>
                      <select 
                        value={newListing.category}
                        onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-xl text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Tutoring">Tutoring</option>
                        <option value="Technology">Technology</option>
                        <option value="Languages">Languages</option>
                        <option value="Career Guidance">Career Guidance</option>
                        <option value="Creative Arts">Creative Arts</option>
                        <option value="Business Skills">Business Skills</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Community Services">Community Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-display">Target Skill Level</label>
                      <select 
                        value={newListing.skillLevel}
                        onChange={(e) => setNewListing({ ...newListing, skillLevel: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-xl text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Beginner">Beginner Space</option>
                        <option value="Intermediate">Intermediate Experience</option>
                        <option value="Advanced">Advanced Pro</option>
                        <option value="Expert">Expert / Native Specialist</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-display">Availability Slots</label>
                      <input 
                        type="text" 
                        value={newListing.availability}
                        onChange={(e) => setNewListing({ ...newListing, availability: e.target.value })}
                        placeholder="e.g. Saturdays, 9-1 PM" 
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-650 px-3 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-teal-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-display">Unity Hour Cost (Hour value)</label>
                      <input 
                        type="number" 
                        min="0.5" 
                        max="5.0" 
                        step="0.5"
                        value={newListing.cost}
                        onChange={(e) => setNewListing({ ...newListing, cost: parseFloat(e.target.value) || 1.0 })}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-teal-555" 
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !!txSuccess}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-450 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all mt-4 font-display cursor-pointer"
                  >
                    {isSubmitting ? "Broadcasting..." : "Publish Skill Listing to Cooperative"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function ifEmptyList() {
    if (filteredListings.length === 0) {
      return (
        <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-850 max-w-xl mx-auto mt-6">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-slate-205">No skill offerings found matching that search query.</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">Try selecting a different skill level, category pill, toggling specialists off, or broadening your keywords.</p>
        </div>
      );
    }
    return null;
  }
}
