import React, { useState } from "react";
import { 
  CheckCircle, ArrowUpRight, TrendingUp, AlertCircle, Clock, Calendar, 
  PlusCircle, BookOpen, Shield, HelpCircle, ArrowRightLeft, User, Sparkles, LogOut, Check, Building
} from "lucide-react";
import { User as UserType, Booking, Notification, Transaction, Organization } from "../types";
import WalletView from "./WalletView";
import OrganizationView from "./OrganizationView";

interface DashboardProps {
  currentUser: UserType;
  bookings: Booking[];
  users: UserType[];
  transactions: Transaction[];
  organizations: Organization[];
  notifications: Notification[];
  onCompleteBooking: (bookingId: string) => Promise<boolean>;
  onTriggerAction: (actionType: "marketplace" | "mentors" | "solidarity" | "create") => void;
  onSwitchUser: (role: string) => void;
  onClaimStarter: () => Promise<boolean>;
  onTransfer: (toUserId: string, amount: number, purpose: string) => Promise<boolean>;
  onSponsor: (orgId: string, sponsorName: string, amount: number, targetTask: string) => Promise<boolean>;
}

export default function Dashboard({ 
  currentUser, 
  bookings, 
  users, 
  transactions, 
  organizations, 
  notifications, 
  onCompleteBooking, 
  onTriggerAction, 
  onSwitchUser, 
  onClaimStarter,
  onTransfer,
  onSponsor
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"workspace" | "wallet" | "organizations">("workspace");
  const [completeError, setCompleteError] = useState("");
  const [completeSuccess, setCompleteSuccess] = useState("");
  const [claiming, setClaiming] = useState(false);

  // Quick Switch Roles
  const roles = ["Member", "Mentor", "Organization Admin", "Platform Admin"];

  const handleComplete = async (bId: string) => {
    setCompleteError("");
    setCompleteSuccess("");
    try {
      const success = await onCompleteBooking(bId);
      if (success) {
        setCompleteSuccess("Session validated! Credits transferred safely out of escrow.");
        setTimeout(() => setCompleteSuccess(""), 3000);
      } else {
        setCompleteError("Failed to release Escrow.");
      }
    } catch {
      setCompleteError("Error resolving booking.");
    }
  };

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const completedBookings = bookings.filter(b => b.status === "completed");

  const handleStarterClaim = async () => {
    setClaiming(true);
    try {
      const ok = await onClaimStarter();
      if (ok) {
        setCompleteSuccess("Bonus Starter Credits approved by Solidarity Fund!");
        setTimeout(() => setCompleteSuccess(""), 3000);
      } else {
        setCompleteError("Starter credits are for accounts with less than 5.0 UH.");
        setTimeout(() => setCompleteError(""), 3000);
      }
    } catch {
      setCompleteError("Error claiming starter credit.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 font-sans">
      {/* Dynamic Sub-tab Ribbon matching highly aligned navbar parameters */}
      <div className="h-14 px-6 border-b border-slate-850 bg-slate-900/40 backdrop-blur-md flex items-center shrink-0 justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
              activeTab === "workspace"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            💻 Workspace Console
          </button>
          
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
              activeTab === "wallet"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            💳 Unity Ledger Wallet
          </button>

          <button
            onClick={() => setActiveTab("organizations")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
              activeTab === "organizations"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🏛️ School & NGO Portals
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <span>Cooperative Dashboard</span>
        </div>
      </div>

      {activeTab === "wallet" && (
        <WalletView
          currentUser={currentUser}
          users={users}
          bookings={bookings}
          transactions={transactions}
          onTransfer={onTransfer}
        />
      )}

      {activeTab === "organizations" && (
        <OrganizationView
          currentUser={currentUser}
          organizations={organizations}
          onSponsor={onSponsor}
        />
      )}

      {activeTab === "workspace" && (
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Action alerts inside Workspace View */}
          {completeSuccess && (
            <div className="bg-teal-950/50 text-teal-300 text-xs p-4 rounded-xl border border-teal-500/35 flex items-center gap-2 mb-6 shadow-xl backdrop-blur-md animate-fade-in">
              <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
              <span>{completeSuccess}</span>
            </div>
          )}

          {completeError && (
            <div className="bg-red-955/50 text-red-300 text-xs p-4 rounded-xl border border-red-500/35 flex items-center gap-2 mb-6 shadow-xl backdrop-blur-md animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{completeError}</span>
            </div>
          )}

          {/* Top Welcome Panel */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 border border-slate-850 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl mb-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none text-right"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider bg-teal-950/60 border border-teal-900/40 text-teal-300 px-2.5 py-1 rounded-full font-bold">✓ {currentUser.verificationLevel}</span>
                </div>
                <h2 className="text-3xl font-extrabold font-display text-white mt-1">Welcome Back, {currentUser.name}!</h2>
                <p className="text-slate-400 text-xs mt-1 max-w-lg leading-relaxed">
                  You are viewing the platform as a <strong className="text-slate-200">{currentUser.role}</strong>. Swap roles below to simulate other community perspectives.
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0 bg-slate-950/60 border border-slate-850 p-4 rounded-2xl backdrop-blur-md">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Switch System Perspective:</span>
                <div className="flex flex-wrap gap-1.5 max-w-xs justify-end">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => onSwitchUser(r)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        currentUser.role === r ? "bg-teal-400 text-slate-950" : "bg-slate-800 hover:bg-slate-750 text-slate-350"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overview Cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            {/* Card 1: Balance */}
            <div className="bg-slate-900/40 backdrop-blur-xs rounded-3xl p-6 border border-slate-850 shadow-md relative overflow-hidden flex flex-col justify-between h-40 hover:border-slate-800 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1 font-display">Cleared Balance</span>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">
                    {currentUser.unityHours.toFixed(1)} <span className="text-sm font-normal text-slate-500 font-sans">UH</span>
                  </h3>
                </div>
                <div className="bg-blue-950/60 border border-blue-900/40 p-2.5 rounded-xl text-blue-450">
                  <ArrowRightLeft className="w-5 h-5 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[11px] pt-4 border-t border-slate-850">
                <span className="text-slate-450">Starter Reserve Injection</span>
                {currentUser.unityHours < 5.0 ? (
                  <button 
                    onClick={handleStarterClaim} 
                    disabled={claiming}
                    className="text-xs font-bold text-teal-405 hover:text-teal-300 underline cursor-pointer"
                  >
                    {claiming ? "Claiming..." : "Claim +5.0"}
                  </button>
                ) : (
                  <span className="text-green-400 font-semibold flex items-center gap-1 font-display">✔ Credited</span>
                )}
              </div>
            </div>

            {/* Card 2: Hours Earned */}
            <div className="bg-slate-900/40 backdrop-blur-xs rounded-3xl p-6 border border-slate-850 shadow-md relative overflow-hidden flex flex-col justify-between h-40 hover:border-slate-800 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1 font-display">Hours Earned</span>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">
                    {currentUser.hoursEarned.toFixed(1)} <span className="text-sm font-normal text-slate-500 font-sans">HRS</span>
                  </h3>
                </div>
                <div className="bg-teal-950/60 border border-teal-900/40 p-2.5 rounded-xl text-teal-450">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-850">
                Total services contributed to neighbors
              </div>
            </div>

            {/* Card 3: Hours Spent */}
            <div className="bg-slate-900/40 backdrop-blur-xs rounded-3xl p-6 border border-slate-850 shadow-md relative overflow-hidden flex flex-col justify-between h-40 hover:border-slate-800 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1 font-display">Hours Spent</span>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">
                    {currentUser.hoursSpent.toFixed(1)} <span className="text-sm font-normal text-slate-500 font-sans">HRS</span>
                  </h3>
                </div>
                <div className="bg-amber-955/60 border border-amber-900/40 p-2.5 rounded-xl text-amber-450">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-850 font-sans">
                Total time lessons redeemed
              </div>
            </div>

            {/* Card 4: Trust Score */}
            <div className="bg-slate-900/40 backdrop-blur-xs rounded-3xl p-6 border border-slate-850 shadow-md relative overflow-hidden flex flex-col justify-between h-40 hover:border-slate-800 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1 font-display">Trust Rating</span>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">{currentUser.trustScore}%</h3>
                </div>
                <div className="bg-purple-955/60 border border-purple-900/40 p-2.5 rounded-xl text-purple-450">
                  <Shield className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-4 border-t border-slate-850 font-display">
                <span className="font-bold text-slate-505">Verification:</span>
                <span className="text-blue-400 font-extrabold">{currentUser.verificationLevel}</span>
              </div>
            </div>
          </div>

          {/* Double Column grid section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side Workspace bookings lists (col-span-8) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Direct Workspace Quick Buttons */}
              <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-850 shadow-md">
                <h4 className="font-bold text-white text-sm mb-4 font-display">Quick Actions</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    id="btn-quick-create"
                    onClick={() => onTriggerAction("create")}
                    className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:bg-slate-900 hover:border-slate-800 text-left transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5 text-blue-400 mb-2" />
                    <h5 className="font-bold text-xs text-white">Broadcast Offer</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Post a listing</p>
                  </button>

                  <button 
                    onClick={() => onTriggerAction("marketplace")}
                    className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:bg-slate-900 hover:border-slate-800 text-left transition-all cursor-pointer"
                  >
                    <BookOpen className="w-5 h-5 text-teal-400 mb-2" />
                    <h5 className="font-bold text-xs text-white">Browse Market</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Explore all offers</p>
                  </button>

                  <button 
                    onClick={() => onTriggerAction("mentors")}
                    className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:bg-slate-900 hover:border-slate-800 text-left transition-all cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-amber-400 mb-2 animate-pulse" />
                    <h5 className="font-bold text-xs text-white">Mentor Portals</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Specialized guides</p>
                  </button>

                  <button 
                    onClick={() => onTriggerAction("solidarity")}
                    className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:bg-slate-900 hover:border-slate-800 text-left transition-all cursor-pointer"
                  >
                    <HelpCircle className="w-5 h-5 text-red-400 mb-2" />
                    <h5 className="font-bold text-xs text-white">Mutual Aid</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Solidarity desk</p>
                  </button>
                </div>
              </div>

              {/* Bookings Node */}
              <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-850 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-bold text-white text-sm font-display">Pending Exchanges</h4>
                    <p className="text-[10px] text-slate-500 font-sans">Sessions currently in escrow waiting to be conducted and resolved.</p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-955/65 border border-amber-900/45 text-amber-405 px-2.5 py-1 rounded-full">
                    {pendingBookings.length} Active Swaps
                  </span>
                </div>

                {pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map((b) => {
                      const isCurrentUserProvider = b.providerId === currentUser.id;
                      
                      return (
                        <div key={b.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <img src={b.providerAvatar} alt={b.providerName} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                            <div>
                              <span className="inline-block text-[9px] bg-blue-955/60 border border-blue-900/45 text-blue-400 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">{b.hours} UH Held</span>
                              <h5 className="font-bold text-white text-xs mt-1.5">{b.listingTitle}</h5>
                              <div className="flex items-center gap-2.5 mt-1 text-[10px] text-slate-500 font-mono font-semibold">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {b.scheduledDate}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {b.scheduledTime}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {isCurrentUserProvider ? (
                              <button
                                onClick={() => handleComplete(b.id)}
                                className="bg-teal-500 hover:bg-teal-650 text-slate-950 font-black px-4 py-2 rounded-xl text-2xs uppercase tracking-wider transition-all cursor-pointer font-display"
                              >
                                Certify Complete & Claim UH
                              </button>
                            ) : (
                              <span className="text-[11px] text-amber-400 font-extrabold flex items-center gap-1.5 font-display">
                                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                                Secured Escrow • Waiting validation
                              </span>
                            )}
                            <p className="text-[9px] text-slate-500 mt-1">Svc: {b.providerName}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-950/60 rounded-2xl p-8 text-center border border-slate-850 text-slate-500 text-xs">
                    No active escrow lockouts pending. Need support?
                    <button onClick={() => onTriggerAction("marketplace")} className="text-xs font-extrabold text-blue-400 ml-1 hover:underline cursor-pointer">Find cooperative pairings →</button>
                  </div>
                )}
              </div>

              {/* Past bookings list */}
              {completedBookings.length > 0 && (
                <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-850 shadow-md">
                  <h4 className="font-bold text-white text-sm mb-4 font-display">Completed Exchange History</h4>
                  <div className="space-y-3.5">
                    {completedBookings.map((b) => (
                      <div key={b.id} className="flex gap-3 items-start justify-between p-3.5 bg-slate-950/60 border border-slate-850/60 rounded-2xl text-xs">
                        <div>
                          <h5 className="font-bold text-slate-300 font-display">{b.listingTitle}</h5>
                          <p className="text-[10px] text-slate-500">With {b.providerId === currentUser.id ? b.borrowerName : b.providerName} • Completed At {b.completedAt}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-teal-400">+{b.hours.toFixed(1)} UH Cleared</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side notifications and AI Matches dashboard section (col-span-4) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Notifications list */}
              <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-850 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-white text-sm font-display">Community Updates</h4>
                  <span className="text-[9px] bg-red-955/60 border border-red-900/40 text-red-301 font-extrabold px-2 py-0.5 rounded-full">
                    {notifications.filter(n => n.unread).length} ACTIVE
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3.5 rounded-2xl border text-xs leading-relaxed transition ${
                      n.unread ? "bg-blue-955/15 border-blue-900/40 text-slate-350" : "bg-slate-950/20 border-slate-850 text-slate-500"
                    }`}>
                      <p className="font-medium font-sans">{n.text}</p>
                      <span className="text-[9.5px] text-slate-550 font-mono mt-1 w-full block">{n.date}</span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">No recent co-op alerts.</p>
                  )}
                </div>
              </div>

              {/* Recommended matches */}
              <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-850 shadow-sm text-left">
                <div className="flex justify-between items-center mb-4 font-display">
                  <h4 className="font-bold text-white text-sm">Suggested Swaps</h4>
                  <span className="text-[9px] bg-teal-950/60 border border-teal-900/45 text-teal-400 font-extrabold px-2 py-0.5 rounded">AUTO-MATCH</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-slate-955 to-blue-950/15 p-4 rounded-2xl border border-blue-900/35 flex items-start gap-3 text-xs shadow-md">
                    <Sparkles className="w-5 h-5 text-blue-450 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-200">React & TS Advisory Program</h5>
                      <span className="text-[9px] text-slate-500 block">By Marcus Chen • 96% compatible</span>
                      <p className="text-[11px] text-slate-400 leading-normal mt-2">Get hands-on mentorship with modern React and TypeScript architecture.</p>
                      <button onClick={() => onTriggerAction("marketplace")} className="text-[10px] text-blue-400 hover:text-blue-300 font-extrabold mt-2 underline block cursor-pointer">Inquire matches →</button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-955 to-teal-955/15 p-4 rounded-2xl border border-teal-905 flex items-start gap-3 text-xs shadow-md">
                    <BookOpen className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-200">Strategic Grant Writing Lessons</h5>
                      <span className="text-[9px] text-slate-500 block">By Sarah Jenkins • 88% Match</span>
                      <p className="text-[11px] text-slate-400 leading-normal mt-2 border-t border-slate-850 pt-1.5">Learn grant writing strategies to fund and support non-profit programs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
