import React, { useState, useEffect } from "react";
import { 
  Plus, Users, Sparkles, BookOpen, Heart, Activity, ShieldCheck, 
  MessageSquare, User as UserIcon, Globe, PieChart, Info, HelpCircle, 
  Settings, LogIn, Award, ListFilter, AlertCircle, RefreshCw, Layers,
  Sun, Moon
} from "lucide-react";

// Local Subcomponents
import LandingPage from "./components/LandingPage";
import Marketplace from "./components/Marketplace";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import CoopCircle from "./components/CoopCircle";

import { User, SkillListing, Booking, Transaction, SolidarityRequest, Organization, ForumPost, Notification, AiMatch } from "./types";

export default function App() {
  // Navigation tabs state
  // "landing" | "dashboard" | "marketplace" | "wallet" | "solidarity" | "mentorship" | "organizations" | "admin" | "forums" | "ai-match"
  const [currentTab, setCurrentTab] = useState<string>("landing");

  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("coop-theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("coop-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  // State loaded from server-side database storage
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [listings, setListings] = useState<SkillListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [solidarityRequests, setSolidarityRequests] = useState<SolidarityRequest[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Page loading indicators
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Sync state from `/api/state`
  const syncState = async () => {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.currentUser);
        setAllUsers(data.users);
        setSkillsList(data.skillsList);
        setListings(data.skillListings);
        setBookings(data.bookings);
        setAllBookings(data.allBookings || []);
        setTransactions(data.transactions);
        setAllTransactions(data.allTransactions || []);
        setSolidarityRequests(data.solidarityRequests);
        setOrganizations(data.organizations);
        setForumPosts(data.forumPosts);
        setNotifications(data.notifications);
        setApiError("");
      } else {
        setApiError("Failure to sync from server ledger.");
      }
    } catch (err) {
      console.error("Ledger sync failure:", err);
      setApiError("Connection timed out. Retrying co-op pool...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncState();
  }, []);

  // Post dynamic actions wrapper syncing instantly to server

  // SWITCH USER SNAPSHOT PROFILE
  const handleSwitchUserRole = async (role: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        await syncState();
        // Redirect client index to dashboard context
        setCurrentTab("dashboard");
      } else {
        alert("Failed to access targeted co-op snapshot directory.");
      }
    } catch {
      alert("Error switching snap context");
    } finally {
      setLoading(false);
    }
  };

  // POST NEW SKILL LISTING
  const handleCreateListing = async (formData: {
    title: string;
    description: string;
    category: string;
    skillLevel: string;
    availability: string;
    cost: number;
  }) => {
    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // BOOK AN OFFERED SESSION
  const handleBookSession = async (listingId: string, date: string, time: string) => {
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, scheduledDate: date, scheduledTime: time })
      });
      if (res.ok) {
        await syncState();
        return true;
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed session booking escrow lock.");
      }
    } catch (err: any) {
      alert(err.message || "Failed booking transaction process.");
      return false;
    }
  };

  // RELEASE ESCROW & COMPLETE BOOKING
  const handleCompleteBooking = async (bookingId: string) => {
    try {
      const res = await fetch("/api/bookings/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // APPLY FOR SOLIDARITY PETITION claim
  const handleApplySolidarity = async (formData: {
    category: string;
    description: string;
    hoursRequested: number;
    urgency: string;
  }) => {
    try {
      const res = await fetch("/api/solidarity/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          details: formData.description,
          hoursRequested: formData.hoursRequested,
          urgency: formData.urgency
        })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // INSTANT STARTER CLAIM ALLOCATION
  const handleClaimStarter = async () => {
    try {
      const res = await fetch("/api/solidarity/claim-starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // DIRECT WALLET/AID TRANSFER
  const handleTransfer = async (toUserId: string, amount: number, purpose: string) => {
    try {
      const res = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId, amount, purpose })
      });
      if (res.ok) {
        await syncState();
        return true;
      } else {
        const errObj = await res.json();
        throw new Error(errObj.error || "Transfer rejected");
      }
    } catch (err: any) {
      throw err;
    }
  };

  // SPONSOR AN NGO/SCHOOL DIRECT TIME CAPITAL
  const handleSponsorOrg = async (orgId: string, sponsorName: string, amount: number, targetTask: string) => {
    try {
      const res = await fetch("/api/organizations/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, sponsorName, amount, targetTask })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // PLATFORM TRUSTEE RESOLUTION: SOLIDARITY ACTION
  const handleResolveFundRequest = async (requestId: string, status: "approved" | "declined") => {
    try {
      const res = await fetch("/api/admin/resolve-fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // RESET SYSTEM DATABASE variables
  const handleResetDatabase = async () => {
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // START FORUM THREAD
  const handleAddForumPost = async (title: string, content: string, category: string) => {
    try {
      const res = await fetch("/api/forum/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // ADD FORUM COMMENT
  const handleAddForumComment = async (postId: string, content: string) => {
    try {
      const res = await fetch("/api/forum/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content })
      });
      if (res.ok) {
        await syncState();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // COMPUTE GEMINI COMPATIBILITY INTERACTIVE SWAPS
  const handleFetchAiMatches = async (offered: string, needed: string): Promise<AiMatch[] | null> => {
    try {
      const res = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillsOffered: offered, skillsNeeded: needed })
      });
      if (res.ok) {
        const data = await res.json();
        return data.matches;
      }
    } catch (err) {
      console.error("AI Match error:", err);
    }
    return null;
  };

  // Quick Action Dashboard callback triggers
  const executeTriggerAction = (actionType: "marketplace" | "mentors" | "solidarity" | "create") => {
    if (actionType === "marketplace") setCurrentTab("marketplace");
    if (actionType === "mentors") setCurrentTab("marketplace"); // Embedded in directory space
    if (actionType === "solidarity") setCurrentTab("forums"); // Co-op Circle
    if (actionType === "create") setCurrentTab("marketplace"); // Open marketplace to trigger creation modal
  };

  // Helper properties
  const globalImpactStats = {
    users: allUsers.length * 3120, // Scale for beautiful visual startup statistics
    skillsShared: listings.length * 16840 + 84200,
    hoursEarned: allTransactions.length * 24200 + 98402,
    communities: organizations.length + 18
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 flex flex-col antialiased transition-colors duration-300">
      
      {/* Top Banner Warning if synchronization error is active */}
      {apiError && (
        <div className="bg-amber-500 text-slate-950 p-2 text-center text-xs font-bold leading-none flex items-center justify-center gap-1.5 transition">
          <AlertCircle className="w-4 h-4" />
          <span>Platform status warning: {apiError}</span>
        </div>
      )}

      {/* Navigation matching Sleek Layout mockup styling */}
      <nav className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/75 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-extrabold select-none cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.25)]" onClick={() => setCurrentTab("landing")}>S</div>
          <span className="font-bold text-xl tracking-tight text-white cursor-pointer" onClick={() => setCurrentTab("landing")}>
            SkillShare <span className="text-blue-400 tracking-wide font-medium italic">Co-op</span>
          </span>
        </div>

        {/* Mid-sized viewport navigation links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <button onClick={() => setCurrentTab("landing")} className={`hover:text-slate-50 transition-colors relative py-1 ${currentTab === "landing" ? "text-slate-50 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500" : ""}`}>Explore</button>
          
          {currentUser && (
            <>
              <button onClick={() => setCurrentTab("dashboard")} className={`hover:text-slate-50 transition-colors relative py-1 ${currentTab === "dashboard" ? "text-slate-50 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500" : ""}`}>Dashboard</button>
              <button onClick={() => setCurrentTab("marketplace")} className={`hover:text-slate-50 transition-colors relative py-1 ${currentTab === "marketplace" ? "text-slate-50 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500" : ""}`}>Marketplace</button>
              <button onClick={() => setCurrentTab("forums")} className={`hover:text-slate-50 transition-colors relative py-1 ${currentTab === "forums" ? "text-slate-50 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500" : ""}`}>Co-op Circle</button>
              
              {(currentUser.role === "Platform Admin" || currentUser.role === "Organization Admin") && (
                <button onClick={() => setCurrentTab("admin")} className={`hover:text-red-500 dark:hover:text-red-400 font-bold transition-colors relative py-1 ${currentTab === "admin" ? "text-red-650 dark:text-red-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500" : ""}`}>TRUSTEE ADMIN</button>
              )}
            </>
          )}
        </div>

        {/* User Snapshot Profiler selection dropdown and dynamic actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full border border-slate-700 hover:rotate-12 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-md shrink-0"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="font-bold text-xs text-slate-100 block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider">{currentUser.role}</span>
              </div>
              <img 
                src={currentUser.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-800 hover:border-blue-500/85 cursor-pointer transition-all"
                title={`Logged in role: ${currentUser.role}`}
                onClick={() => setCurrentTab("dashboard")}
              />
              <button 
                id="btn-nav-dashboard"
                onClick={() => setCurrentTab(currentTab === "dashboard" ? "landing" : "dashboard")}
                className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-full shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all font-display"
              >
                {currentTab === "dashboard" ? "Land page Explorer" : "Go to App Dashboard"}
              </button>
            </div>
          ) : (
            <button onClick={() => handleSwitchUserRole("Member")} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-full text-xs font-bold shadow-md transition-all">
              Sign In Co-op
            </button>
          )}
        </div>
      </nav>

      {/* Tiny Inline Tabs bar for smaller mobile viewports */}
      {currentUser && (
        <div className="flex lg:hidden bg-slate-900/90 border-b border-slate-800/80 overflow-x-auto gap-2 px-4 py-2.5 scrollbar-none sticky top-16 z-40 backdrop-blur-md">
          <button onClick={() => setCurrentTab("dashboard")} className={`px-3 py-1.5 rounded-lg text-2xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${currentTab === "dashboard" ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/15" : "bg-slate-800/60 hover:bg-slate-800 text-slate-300"}`}>Dashboard</button>
          <button onClick={() => setCurrentTab("marketplace")} className={`px-3 py-1.5 rounded-lg text-2xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${currentTab === "marketplace" ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/15" : "bg-slate-800/60 hover:bg-slate-800 text-slate-300"}`}>Marketplace</button>
          <button onClick={() => setCurrentTab("forums")} className={`px-3 py-1.5 rounded-lg text-2xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${currentTab === "forums" ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/15" : "bg-slate-800/60 hover:bg-slate-800 text-slate-300"}`}>Co-op Circle</button>
          {(currentUser.role === "Platform Admin" || currentUser.role === "Organization Admin") && (
            <button onClick={() => setCurrentTab("admin")} className={`px-3 py-1.5 rounded-lg text-2xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${currentTab === "admin" ? "bg-red-650 text-white shadow-md" : "bg-red-950/40 text-red-300 border border-red-900/50"}`}>Trustee admin</button>
          )}
        </div>
      )}

      {/* Loading overlay state spinner */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading SkillShare Cooperative balance records...</p>
        </div>
      ) : (
        <main className="flex-1 flex flex-col min-h-0 bg-grid-pattern bg-slate-950">
          
          {/* Main conditional rendering of pages/tabs */}
          {currentTab === "landing" && (
            <LandingPage 
              onGetStarted={() => {
                if (currentUser) setCurrentTab("dashboard");
                else handleSwitchUserRole("Member");
              }} 
              onExploreSkills={() => setCurrentTab("marketplace")} 
              onSwitchUser={(role) => handleSwitchUserRole(role)}
              stats={globalImpactStats}
            />
          )}

          {currentUser && currentTab === "dashboard" && (
            <Dashboard 
              currentUser={currentUser}
              bookings={bookings}
              users={allUsers}
              transactions={transactions}
              organizations={organizations}
              notifications={notifications}
              onCompleteBooking={handleCompleteBooking}
              onTriggerAction={executeTriggerAction}
              onSwitchUser={handleSwitchUserRole}
              onClaimStarter={handleClaimStarter}
              onTransfer={handleTransfer}
              onSponsor={handleSponsorOrg}
            />
          )}

          {currentUser && currentTab === "marketplace" && (
            <Marketplace 
              listings={listings}
              currentUser={currentUser}
              onBook={handleBookSession}
              onCreateListing={handleCreateListing}
              onFetchAiMatches={handleFetchAiMatches}
            />
          )}

          {currentUser && currentTab === "admin" && (
            <AdminPanel 
              currentUser={currentUser}
              users={allUsers}
              bookings={allBookings}
              solidarityRequests={solidarityRequests}
              transactions={allTransactions}
              onResolveFundRequest={handleResolveFundRequest}
              onResetDatabase={handleResetDatabase}
            />
          )}

          {currentUser && currentTab === "forums" && (
            <CoopCircle 
              currentUser={currentUser}
              forumPosts={forumPosts}
              solidarityRequests={solidarityRequests}
              onAddPost={handleAddForumPost}
              onAddComment={handleAddForumComment}
              onApplySolidarity={handleApplySolidarity}
              onClaimStarter={handleClaimStarter}
            />
          )}
          
        </main>
      )}

      {/* Footer matching standard design instructions */}
      <footer className="h-14 px-6 md:px-8 border-t border-slate-800 bg-slate-900/60 text-[10px] text-slate-400 font-semibold uppercase tracking-widest flex items-center justify-between gap-4 mt-auto">
        <div>© 2026 SkillShare Cooperative</div>
        <div className="hidden sm:flex gap-6">
          <button onClick={() => setCurrentTab("forums")} className="hover:text-blue-400 transition-colors bg-transparent border-0">Solidarity Fund</button>
          <button onClick={() => setCurrentTab("dashboard")} className="hover:text-blue-400 transition-colors bg-transparent border-0">Console</button>
        </div>
        <div className="text-slate-500 text-[10px] font-sans font-medium tracking-tight normal-case">
          Cooperative mutual-aid exchange network
        </div>
      </footer>

    </div>
  );
}
