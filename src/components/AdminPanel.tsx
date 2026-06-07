import React, { useState } from "react";
import { 
  ShieldAlert, Users, Award, Trash, CheckCircle, RefreshCw, XCircle, 
  TrendingUp, AlertTriangle, ShieldCheck, Mail, Database, DollarSign, Terminal
} from "lucide-react";
import { User, Booking, SolidarityRequest, Transaction } from "../types";

interface AdminPanelProps {
  currentUser: User;
  users: User[];
  bookings: Booking[];
  solidarityRequests: SolidarityRequest[];
  transactions: Transaction[];
  onResolveFundRequest: (requestId: string, status: "approved" | "declined") => Promise<boolean>;
  onResetDatabase: () => Promise<boolean>;
}

export default function AdminPanel({ 
  currentUser, users, bookings, solidarityRequests, transactions, onResolveFundRequest, onResetDatabase 
}: AdminPanelProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [systemResetting, setSystemResetting] = useState(false);

  const handleResolveFund = async (requestId: string, status: "approved" | "declined") => {
    setLoadingId(requestId);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await onResolveFundRequest(requestId, status);
      if (res) {
        setSuccessMsg(`Petition ticket resolved as ${status.toUpperCase()}! Balances updated.`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Failed to resolve solidarity ticket.");
      }
    } catch {
      setErrorMsg("Solidarity ledger execution failure.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSystemReset = async () => {
    setSystemResetting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const ok = await onResetDatabase();
      if (ok) {
        setSuccessMsg("System successfully purged back to standard seed vectors.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("System reset rejected.");
      }
    } catch {
      setErrorMsg("Error communicating with Node subsystem.");
    } finally {
      setSystemResetting(false);
    }
  };

  // SaaS simulated billing dashboard
  const saasRevenues = [
    { title: "School Subscriptions", value: "$4,250", target: "Oakwood Higher", status: "Active" },
    { title: "NGO Subscriptions", value: "$1,850", target: "Eco-Alliance", status: "Active" },
    { title: "Corporate Sponsorship Fees", value: "$12,400", target: "Labs Spons", status: "Active" },
    { title: "Premium Verification Services", value: "$950", target: "Direct user checks", status: "Active" }
  ];

  // Fraud protection simulation logs
  const fraudLogs = [
    { id: "FL-01", desc: "User Marcus C. initiated 2 concurrent sessions with same peer", threat: "Low - Same host", status: "Audited OK" },
    { id: "FL-02", desc: "Elena R. holds negative escrow projection variance", threat: "Clean - Starter Bonus buffer", status: "Verified" },
    { id: "FL-03", desc: "Alex M. triggered multiple admin switches", threat: "Low - Local workspace host", status: "Bypassed" }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
      
      {/* Admin Title Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1 font-mono">
            <ShieldCheck className="w-4 h-4 text-red-500 animate-pulse" /> Authorized Co-op Trustee Workspace
          </span>
          <h2 className="text-3xl font-extrabold text-white font-display mt-1">SaaS Administration Dashboard</h2>
          <p className="text-slate-400 text-xs">Manage public claims, monitor exchange fraud prevention logs, and oversee billing pipelines.</p>
        </div>

        {/* Database reset */}
        <button
          onClick={handleSystemReset}
          disabled={systemResetting}
          className="px-5 py-3 bg-red-500 hover:bg-red-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer font-display tracking-widest uppercase"
        >
          <RefreshCw className={`w-4 h-4 ${systemResetting ? "animate-spin" : ""}`} />
          {systemResetting ? "Purging ledger..." : "Re-seed System Variables"}
        </button>
      </div>

      {successMsg && (
        <div className="bg-teal-950/70 text-teal-350 text-xs p-4 rounded-xl border border-teal-900/40 animate-pulse">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-955/70 text-red-305 text-xs p-4 rounded-xl border border-red-900/40 animate-pulse">
          {errorMsg}
        </div>
      )}

      {/* Corporate SaaS Revenue Dashboard Section */}
      <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-850 shadow-md backdrop-blur-md animate-fade-in">
        <h4 className="font-bold text-white text-sm mb-4 font-display">SaaS Monthly Corporate Revenue Pipeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {saasRevenues.map((rev, i) => (
            <div key={i} className="bg-slate-955/65 p-4 rounded-2xl border border-slate-850/60 flex flex-col justify-between h-28">
              <div>
                <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider font-display block mb-1">{rev.title}</span>
                <span className="text-2xl font-black text-white font-mono">{rev.value}</span>
              </div>
              <span className="text-[10px] text-teal-400 font-semibold font-mono">{rev.target} status cleared</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Admin Core tasks - Left side is Solidarity ticket resolutions, Right side is fraud logs & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Span-8: Solidarity request panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-850 shadow-md backdrop-blur-md">
            <h4 className="font-bold text-white text-sm mb-2 font-display">Lead Solidarity Claims Audits</h4>
            <p className="text-[10px] text-slate-500 mb-6 font-sans">Review emergency time credit requests and commit grants directly out of the pool.</p>

            <div className="space-y-4">
              {solidarityRequests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-955/60 rounded-2xl border border-slate-850/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-800 transition">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${req.urgency === "High" ? "bg-red-950/60 border border-red-900/40 text-red-400" : "bg-slate-900 border border-slate-850 text-slate-400"}`}>{req.urgency} Priority</span>
                      <span className="text-[9px] bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 font-bold px-1.5 rounded font-mono uppercase tracking-wide">{req.category}</span>
                    </div>

                    <h5 className="font-bold text-slate-200 text-xs font-display">{req.requesterName} filed support tickets</h5>
                    <p className="text-[11px] text-slate-450 italic max-w-md">"{req.details}"</p>
                    <p className="text-[10px] text-slate-500 font-semibold font-mono">Volume target: <strong className="text-white">{req.hoursRequested.toFixed(1)} UH</strong> • Status: {req.status}</p>
                  </div>

                  {/* Approve Deny controls */}
                  <div className="flex gap-2 shrink-0">
                    {req.status === "pending" ? (
                      <>
                        <button
                          id={`admin-approve-solidarity-${req.id}`}
                          onClick={() => handleResolveFund(req.id, "approved")}
                          disabled={loadingId === req.id}
                          className="px-3 py-1.5 bg-[#14B8A6] hover:bg-teal-600 text-slate-950 rounded-lg text-2xs uppercase tracking-wider font-extrabold flex items-center gap-1 cursor-pointer transition"
                        >
                          Approve Claim
                        </button>
                        <button
                          onClick={() => handleResolveFund(req.id, "declined")}
                          disabled={loadingId === req.id}
                          className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg text-2xs uppercase tracking-wider font-extrabold cursor-pointer transition"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg ${req.status === "approved" ? "bg-teal-950/60 text-[#14B8A6] border border-[#0d9488]/40" : "bg-slate-950 border border-slate-850 text-slate-500"}`}>
                        resolved: {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Users Oversight lists */}
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-850 shadow-md backdrop-blur-md">
            <h4 className="font-bold text-white text-sm mb-4 font-display">User Registry Overview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-400">
                <thead>
                  <tr className="border-b border-slate-850 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                    <th className="pb-3">Name / Role</th>
                    <th className="pb-3 text-center">Cleared UH Balance</th>
                    <th className="pb-3 text-center">TrustScore Status</th>
                    <th className="pb-3 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 font-sans">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-950/40 transition">
                      <td className="py-3.5 flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-800" />
                        <div>
                          <span className="font-bold text-slate-200 text-xs block font-display">{u.name}</span>
                          <span className="text-[9px] text-blue-400 font-semibold uppercase">{u.role}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-mono font-bold text-white">
                        {u.unityHours.toFixed(1)} UH
                      </td>
                      <td className="py-3.5 text-center font-mono text-teal-400 font-semibold">
                        {u.trustScore}% ({u.verificationLevel})
                      </td>
                      <td className="py-3.5 text-right text-slate-500 font-mono text-[10px]">
                        {u.joinedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Span-4: Threat Logs & Moderation lists */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-950 p-6 rounded-[2rem] text-slate-300 font-mono text-xs space-y-4 shadow-xl border border-slate-850/80">
            <div className="flex justify-between items-center text-red-400 font-bold border-b border-slate-850 pb-3">
              <span className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-wider">
                <Terminal className="w-4 h-4 animate-pulse text-red-500" /> Threat Intrusion Logs
              </span>
              <span className="text-[10px] bg-red-950/60 text-red-400 px-2 rounded-full border border-red-900/30">3 WARNINGS</span>
            </div>

            <div className="space-y-3 font-mono">
              {fraudLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold text-amber-500">{log.id}</span>
                    <span className="text-slate-400 font-sans">{log.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-snug">{log.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-600 text-center font-sans tracking-tight">Systems checks nominal. Node server state synced.</p>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-850 shadow-md backdrop-blur-md space-y-4">
            <h4 className="font-bold text-white text-sm font-display">System Moderation Rules</h4>
            <div className="space-y-3 text-xs text-slate-350 font-sans">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-550 accent-indigo-500 bg-slate-950 border-slate-800" />
                <span>Enforce 1.0 UH peer hourly standards</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-550 accent-indigo-500 bg-slate-950 border-slate-800" />
                <span>Auto-debit escrow holdings at booking</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-550 accent-indigo-500 bg-slate-950 border-slate-800" />
                <span>Decline empty descriptions</span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
