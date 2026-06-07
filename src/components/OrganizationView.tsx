import React, { useState } from "react";
import { 
  Building, Users, ArrowUpRight, CheckCircle, TrendingUp, AlertCircle, 
  PlusCircle, BookOpen, Download, ShieldCheck, Heart, Sparkles, Activity
} from "lucide-react";
import { Organization, User } from "../types";

interface OrganizationViewProps {
  currentUser: User;
  organizations: Organization[];
  onSponsor: (orgId: string, sponsorName: string, amount: number, targetTask: string) => Promise<boolean>;
}

export default function OrganizationView({ currentUser, organizations, onSponsor }: OrganizationViewProps) {
  // Current designated organization context
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || "org-1");
  const [sponsorName, setSponsorName] = useState("Google AI Studio Labs");
  const [amount, setAmount] = useState(100);
  const [targetTask, setTargetTask] = useState("STEM Hackathon Support");
  
  // Local operation state
  const [txSuccess, setTxSuccess] = useState("");
  const [txError, setTxError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || amount <= 0) return;
    setSubmitting(true);
    setTxError("");
    setTxSuccess("");
    try {
      const ok = await onSponsor(selectedOrgId, sponsorName, amount, targetTask);
      if (ok) {
        setTxSuccess(`Success! Sponsored +${amount} Unity Hours directly to ${activeOrg.name}'s active projects pool.`);
        setAmount(50);
        setTargetTask("");
        setTimeout(() => setTxSuccess(""), 4000);
      } else {
        setTxError("Sponsorship transfer declined by server co-op rules.");
      }
    } catch {
      setTxError("Failed to book sponsorship values.");
    } finally {
      setSubmitting(false);
    }
  };

  const isCurrentUserOrgAdmin = currentUser.role === "Organization Admin" || currentUser.role === "Platform Admin";

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      
      {/* Selector and Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-display">Institution Portal Snapshots</span>
          <h2 className="text-3xl font-extrabold text-white font-display mt-1">Organizations & Schools Analytics</h2>
          <p className="text-slate-400 text-xs">Analyze student tutoring statistics, compliance tracking, and community health index metrics.</p>
        </div>

        {/* Dynamic Organization select context switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase font-mono">Viewing:</span>
          <select 
            value={selectedOrgId} 
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs font-bold text-white cursor-pointer"
          >
            {organizations.map(o => (
              <option key={o.id} value={o.id} className="bg-slate-950 text-white">{o.name} ({o.type})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Stat Matrix container matching specific organization */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">Affiliated Cohorts</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">{activeOrg.membersCount} Members</h4>
          <p className="text-[10px] text-teal-400 mt-1">94% active tutor matches</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Time Hours Exchanged</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">{activeOrg.hoursExchanged.toFixed(1)} UH</h4>
          <p className="text-[10px] text-blue-400 mt-1">Boosts regional resilience</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">Member Participation Rate</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">{activeOrg.participationRate}% Active</h4>
          <p className="text-[10px] text-purple-400 mt-1">Standard dev is ±2%</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">Community Health Index</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">{activeOrg.healthScore}% Grade A</h4>
          <p className="text-[10px] text-amber-400 mt-1">Continuous peer support status</p>
        </div>
      </div>

      {/* Split layout: Admin Compliance details (Left) / Corporate Sponsorship desk (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: School admin workspace lists */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-850 shadow-sm backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-white text-sm font-display">Organization Description & Mandates</h4>
                <p className="text-[10px] text-slate-500">Mission parameters registered for school co-ops.</p>
              </div>
              <button 
                onClick={() => alert("Simulation: Report exported in PDF/CSV format.")}
                className="px-3 py-1.5 border border-slate-850 bg-slate-950 hover:bg-slate-855 text-slate-350 hover:text-white font-bold rounded-lg text-2xs uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Compliance PDF
              </button>
            </div>
            
            <p className="text-xs text-slate-350 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
              {activeOrg.description}
            </p>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-850 shadow-sm backdrop-blur-md">
            <h4 className="font-bold text-white text-sm mb-4 font-display">Active Sponsoring Campaigns list</h4>
            <div className="space-y-3">
              {activeOrg.activeSponsorships.map((s) => (
                <div key={s.id} className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-850/80 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] bg-teal-950/60 border border-teal-900/45 text-teal-400 font-extrabold px-1.5 py-0.5 rounded-md uppercase mr-2 font-mono">COMMUNITY TRUST BOOST</span>
                    <h5 className="font-bold text-slate-200 mt-1.5 font-display">{s.corporateSponsor}</h5>
                    <p className="text-[10px] text-slate-500">Target allocation: {s.target}</p>
                  </div>

                  <span className="font-mono font-bold text-blue-400">+{s.hoursContribution.toFixed(0)} UH sponsored</span>
                </div>
              ))}

              {activeOrg.activeSponsorships.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">This organization holds no current corporate sponsorship channels. Sponsoring directly adds time-capital to help students.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Hand: Sponsor Input Deck */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-850 shadow-sm backdrop-blur-md">
            <span className="text-xs font-bold text-blue-450 uppercase tracking-widest block mb-1 font-display">Corporate Direct Philanthropy</span>
            <h4 className="text-lg font-bold text-white mb-4 font-display">Sponsor Project Hours</h4>

            {txSuccess && (
              <div className="bg-teal-955/70 text-teal-305 text-xs p-3.5 rounded-xl border border-teal-900/40 flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{txSuccess}</span>
              </div>
            )}

            {txError && (
              <div className="bg-red-955/70 text-red-305 text-xs p-3.5 rounded-xl border border-red-900/40 flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{txError}</span>
              </div>
            )}

            <form onSubmit={handleSponsorSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-display">Sponsor Brand Entity</label>
                <input 
                  type="text" 
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/40" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-555 mb-1.5 font-display">Target project / focus</label>
                <input 
                  type="text" 
                  placeholder="e.g. Free Senior Prep Tutoring"
                  value={targetTask}
                  onChange={(e) => setTargetTask(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40" 
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-555 mb-1.5 font-display">Hours contribution (UH Time Capital)</label>
                <input 
                  type="number" 
                  min="10" 
                  max="500" 
                  step="10" 
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 100)}
                  className="w-full bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/40" 
                  required
                />
              </div>

              <button 
                id="org-sponsor-submit"
                type="submit"
                disabled={submitting || !amount}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer font-display"
              >
                {submitting ? "Allocating Credits..." : "Broadside Sponsorship Credits"}
              </button>
            </form>
          </div>

          {/* Compliance statement info */}
          <div className="bg-indigo-950/20 p-6 rounded-[2rem] border border-indigo-900/30 text-white space-y-3">
            <Activity className="w-6 h-6 text-indigo-400" />
            <h5 className="font-bold text-xs text-indigo-300 uppercase tracking-widest font-display">Graduation Integration Compliance</h5>
            <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
              Each hour spent tutoring counts towards high school student graduation status criteria in supported regions. This enables institutions to replace manual logs with validated electronic ledger checks.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
