import React, { useState } from "react";
import { 
  Heart, AlertCircle, CheckCircle, ArrowRight, ShieldAlert, Sparkles, 
  DollarSign, FileText, Check, Award, ChevronRight, X
} from "lucide-react";
import { User, SolidarityRequest } from "../types";

interface SolidarityFundViewProps {
  currentUser: User;
  requests: SolidarityRequest[];
  onApply: (formData: {
    category: string;
    description: string;
    hoursRequested: number;
    urgency: string;
  }) => Promise<boolean>;
  onClaimStarter: () => Promise<boolean>;
}

export default function SolidarityFundView({ currentUser, requests, onApply, onClaimStarter }: SolidarityFundViewProps) {
  // Apply solidarity form state
  const [category, setCategory] = useState("Tutoring Assistance");
  const [details, setDetails] = useState("");
  const [hoursRequested, setHoursRequested] = useState(2.0);
  const [urgency, setUrgency] = useState("Medium");
  
  // Local transaction state
  const [txSuccess, setTxSuccess] = useState("");
  const [txError, setTxError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || hoursRequested <= 0) {
      setTxError("Please supply valid description and hours volume.");
      return;
    }
    setSubmitting(true);
    setTxError("");
    setTxSuccess("");
    try {
      const ok = await onApply({
        category,
        description: details,
        hoursRequested,
        urgency
      });

      if (ok) {
        setTxSuccess("Your Solidarity support petition has been recorded in the public audits database.");
        setDetails("");
        setHoursRequested(2.0);
        setTimeout(() => {
          setShowApplyModal(false);
          setTxSuccess("");
        }, 1500);
      } else {
        setTxError("Audit failure. Please verify your claim parameters.");
      }
    } catch {
      setTxError("Lead ledger rejection. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarterClaim = async () => {
    try {
      setTxError("");
      setTxSuccess("");
      const success = await onClaimStarter();
      if (success) {
        setTxSuccess("Successfully injected 5 Starter Unity Hours into your wallet.");
        setTimeout(() => setTxSuccess(""), 4000);
      } else {
        setTxError("Your wallet must hold less than 5.0 UH to claim a Starter Solidarity allocation.");
      }
    } catch {
      setTxError("Internal fund connection failure.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      
      {/* Solidarity Banner Header */}
      <div className="bg-gradient-to-r from-red-950 via-rose-950 to-pink-950 border border-red-900/30 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest bg-rose-900/60 border border-rose-800/40 text-rose-300 px-3 py-1 rounded-full font-bold">Mutual Aid Safety Rail</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">
            The Emergency Solidarity Fund
          </h2>
          <p className="text-slate-350 text-sm leading-relaxed">
            Because a community's resilience is measured by how it guards the vulnerable. We sponsor starter credits for new active members, emergency technical services, and NGOs hosting municipal campaigns.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              id="solidarity-apply-trigger"
              onClick={() => setShowApplyModal(true)}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
            >
              Apply for support hours
            </button>
            <button 
              onClick={handleStarterClaim}
              className="px-6 py-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Claim +5.0 UH Starter Credit
            </button>
          </div>
        </div>
      </div>

      {/* Statistics board grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">Emergency Reserves Pool</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">1,850.0 UH</h4>
          <p className="text-[10px] text-teal-400 mt-1">Backed by corporate sponsorships</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">Claims Handled ytd</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">248 Claims</h4>
          <p className="text-[10px] text-slate-400 mt-1">100% transparent public archives</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">Starter Credits Allocated</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">4,120.0 UH</h4>
          <p className="text-[10px] text-blue-400 mt-1">Distributed to 824 newcomers</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-850 shadow-md hover:border-slate-800 transition-all">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-display">Sponsoring Corps & NGOs</span>
          <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">18 Partners</h4>
          <p className="text-[10px] text-amber-400 mt-1">Local councils & tech organizations</p>
        </div>
      </div>

      {/* Main Content Split: Left (Pending solidarity claims) / Right (Starter hours details & Impact stories) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (col-span-8): Active emergency requests */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-sm font-display">Active Community Solidarity Requests</h3>
              <p className="text-[10px] text-slate-500">Claims posted under mutual check systems by active members.</p>
            </div>
          </div>

          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-850 shadow-sm space-y-4 hover:border-slate-800 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold font-mono text-rose-450 uppercase bg-rose-950/60 border border-rose-900/40 px-2 py-0.5 rounded-lg mr-2">{r.urgency} Urgency</span>
                    <span className="bg-slate-950 border border-slate-850 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">{r.category}</span>
                    <h4 className="font-extrabold text-slate-200 mt-2 text-sm">{r.requesterName} Profile Ticket</h4>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CLAIM VOLUME</p>
                    <p className="text-sm font-extrabold font-mono text-white mt-0.5">{r.hoursRequested.toFixed(1)} UH</p>
                    <p className="text-[9px] text-[#14B8A6] font-bold uppercase mt-0.5">{r.status}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-350 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  "{r.details}"
                </p>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-850 font-semibold">
                  <span>Filed At: {r.createdAt}</span>
                  <div className="flex gap-2.5">
                    {r.status === "approved" ? (
                      <span className="text-[#14B8A6] font-bold flex items-center gap-1">✔ Audit Passed</span>
                    ) : r.status === "declined" ? (
                      <span className="text-slate-500 font-bold">Closed Ticket</span>
                    ) : (
                      <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse"><AlertCircle className="w-3.5 h-3.5" /> Pending Board Resolution</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side (col-span-4): Starter credit claims details & Impact story visuals */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-[2rem] shadow-sm backdrop-blur-md">
            <h4 className="font-extrabold text-rose-400 text-xs uppercase mb-3 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Universal Starter Grant
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To bootstrap our local network exchange velocity, your profile is eligible for an instant starter subsidy injection if your cleared holdings sit below 5.0 UH.
            </p>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850 text-xs space-y-2 mb-4 font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Starter Allowance:</span>
                <span className="font-extrabold text-white">+5.0 UH</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Charge:</span>
                <span className="text-teal-400 font-semibold">0.0 UH (Sponsorship)</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Current Holder:</span>
                <span>{currentUser.name}</span>
              </div>
            </div>

            <button 
              onClick={handleStarterClaim}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer"
            >
              Direct Claim Starter Credit
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-[2rem] shadow-sm text-center space-y-4 backdrop-blur-md">
            <Heart className="w-8 h-8 text-rose-500 mx-auto animate-pulse" />
            <h4 className="font-bold text-white text-sm">Stories Of Micro-Impact</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              "When Greenwood's garden truck broke, we didn't have capital to pay commercial mechanics. A claim of 12 Unity Hours matched us with a local hobbyist who had the tools. A beautiful exchange that strengthened our bonds!"
            </p>
            <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">— Representative Greenwood Eco-Alliance</div>
          </div>

        </div>
      </div>

      {/* Apply for Support Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 rounded-[2.5rem] p-6 max-w-md w-full border border-slate-850 shadow-2xl relative">
            <button type="button" onClick={() => setShowApplyModal(false)} className="absolute top-4 right-4 p-1 bg-slate-950 border border-slate-800 rounded-full text-slate-400 hover:bg-slate-850"><X className="w-5 h-5" /></button>
            
            <span className="text-xs font-bold uppercase text-rose-400 tracking-wider block mb-1">Mutual-Aid Claims Desk</span>
            <h4 className="text-xl font-bold mb-4 text-white font-display">Submit Emergency Hours Claim</h4> 

            {txError && (
              <div className="bg-red-955/70 text-red-300 text-xs p-3.5 rounded-xl border border-red-900/40 flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{txError}</span>
              </div>
            )}

            {txSuccess && (
              <div className="bg-teal-950/70 text-teal-300 text-xs p-3.5 rounded-xl border border-teal-900/40 flex items-center gap-2 mb-4">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{txSuccess}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-display">Help Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-white p-2.5 rounded-xl text-xs focus:outline-none focus:border-rose-500/40 cursor-pointer"
                >
                  <option value="Tutoring Assistance" className="bg-slate-950 text-white">Student Tutoring Assistance</option>
                  <option value="Emergency Laptop Support" className="bg-slate-950 text-white">Emergency Computer Service</option>
                  <option value="Municipal Transit Aid" className="bg-slate-950 text-white">Local Transit Service</option>
                  <option value="Micro Gardening Seeds" className="bg-slate-950 text-white">Rooftop Gardening Seed swap</option>
                  <option value="Legal & Admin Aid" className="bg-slate-950 text-white">Co-op Legal Consulting</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-display">Please provide details describing circumstances</label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  placeholder="Explain exactly how this support helps you or the junior cohorts in your circle..."
                  className="w-full bg-slate-950 border border-slate-850 text-white px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-rose-500/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-display">Hours Needed</label>
                  <input 
                    type="number" 
                    min="1.0" 
                    max="10.0" 
                    step="1.0" 
                    value={hoursRequested}
                    onChange={(e) => setHoursRequested(parseFloat(e.target.value) || 2.0)}
                    className="w-full bg-slate-950 border border-slate-850 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-rose-500/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-display">Urgency State</label>
                  <select 
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-white p-2 rounded-xl text-xs focus:outline-none focus:border-rose-500/40 cursor-pointer"
                  >
                    <option value="Low" className="bg-slate-950 text-white">Low Priority</option>
                    <option value="Medium" className="bg-slate-950 text-white">Medium Priority</option>
                    <option value="High" className="bg-slate-950 text-white">Emergency / High Priority</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting || !!txSuccess}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer"
              >
                {submitting ? "Broadcasting audit..." : "Broadcast Claim to Cooperative"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
