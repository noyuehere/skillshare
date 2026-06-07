import React, { useState } from "react";
import { 
  ArrowUpRight, ArrowDownLeft, Send, Sparkles, AlertCircle, CheckCircle, 
  HelpCircle, Trophy, TrendingUp, HelpCircle as InfoIcon, Download, Zap
} from "lucide-react";
import { User, Transaction, Booking } from "../types";

// Recharts imports inside try catch, or we render a stunning custom visual SVG area/bar chart for absolute React 19 compatibility
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface WalletViewProps {
  currentUser: User;
  users: User[];
  bookings: Booking[];
  transactions: Transaction[];
  onTransfer: (toUserId: string, amount: number, purpose: string) => Promise<boolean>;
}

export default function WalletView({ currentUser, users, bookings, transactions, onTransfer }: WalletViewProps) {
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState(1.0);
  const [purpose, setPurpose] = useState("");
  const [txSuccess, setTxSuccess] = useState("");
  const [txError, setTxError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Filter out system users for peer transfer selector, except solidarity system
  const peerUsers = users.filter(u => u.id !== currentUser.id);

  // Compute pending escrow hours sum
  const pendingEscrowTotal = bookings
    .filter(b => b.status === "pending" && b.borrowerId === currentUser.id)
    .reduce((avg, b) => avg + b.hours, 0);

  // Chart data from transactions history
  const chartData = [
    { name: "Jan", Earned: 5.0, Spent: 0 },
    { name: "Feb", Earned: currentUser.hoursEarned * 0.2, Spent: currentUser.hoursSpent * 0.1 },
    { name: "Mar", Earned: currentUser.hoursEarned * 0.4, Spent: currentUser.hoursSpent * 0.3 },
    { name: "Apr", Earned: currentUser.hoursEarned * 0.6, Spent: currentUser.hoursSpent * 0.5 },
    { name: "May", Earned: currentUser.hoursEarned * 0.9, Spent: currentUser.hoursSpent * 0.8 },
    { name: "Jun", Earned: currentUser.hoursEarned, Spent: currentUser.hoursSpent }
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError("");
    setTxSuccess("");
    if (!recipientId || amount <= 0) {
      setTxError("Invalid recipient / amount values.");
      return;
    }
    if (currentUser.unityHours < amount) {
      setTxError("Your wallet's Unity Hour buffer is insufficient for this peer-aid transfer.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await onTransfer(recipientId, amount, purpose);
      if (res) {
        setTxSuccess(`Success! Transfer of ${amount} UH completed successfully.`);
        setRecipientId("");
        setAmount(1.0);
        setPurpose("");
        setTimeout(() => setTxSuccess(""), 4000);
      } else {
        setTxError("Peer transaction rejected by co-op rules engine.");
      }
    } catch (err: any) {
      setTxError(err.message || "An unexpected ledger error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Sort Leaderboard: Top contributors by hours earned
  const sortedChampions = [...users]
    .sort((a, b) => b.hoursEarned - a.hoursEarned)
    .slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: Wallet overview & Ledger lists (col-span-8) */}
      <div className="lg:col-span-8 space-y-8 animate-fade-in">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest font-display">Cooperative Ledger</span>
          <h2 className="text-3xl font-extrabold text-white font-display mt-1">
            The Digital Unity Wallet
          </h2>
          <p className="text-slate-400 text-xs">
            Exchange help, monitor peer escrow pools, and contribute surplus balance directly back to solidarity.
          </p>
        </div>

        {/* Dynamic Balance Hub Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-850 text-white p-6 rounded-3xl relative overflow-hidden shadow-lg h-36 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block mb-1">Cleared Hours</span>
              <h3 className="text-3xl font-extrabold font-mono text-white">{currentUser.unityHours.toFixed(1)} <span className="text-sm font-normal text-slate-500">UH</span></h3>
            </div>
            <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-widest leading-none font-display">Liquid Balance</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-850 shadow-md h-36 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Escrowed Pending</span>
              <h3 className="text-3xl font-extrabold text-white font-mono">{pendingEscrowTotal.toFixed(1)} <span className="text-sm font-normal text-slate-500">UH</span></h3>
            </div>
            <p className="text-[10px] text-amber-400 font-semibold font-display">Locked in booking escrow</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-850 shadow-md h-36 flex flex-col justify-between hover:border-slate-800 transition-all">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Solidarity Yield</span>
              <h3 className="text-3xl font-extrabold text-white font-mono">5.0 <span className="text-sm font-normal text-slate-500">UH</span></h3>
            </div>
            <p className="text-[10px] text-teal-400 font-semibold font-display">Minimum Starter Reserve guaranteed</p>
          </div>
        </div>

        {/* Analytics Section - Earned vs Spent using beautiful Recharts area graph with interactive tooltips */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl backdrop-blur-md shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-white text-sm font-display">Monthly Co-op Contribution Analytics</h4>
              <p className="text-[10px] text-slate-500">Interactive overview of time hours contributed (earned) vs spent.</p>
            </div>
            <span className="text-[10.5px] font-bold text-teal-400 font-mono flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Healthy Flow State
            </span>
          </div>

          <div className="h-48 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0b0f19", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc", fontSize: "11px" }} />
                <Area type="monotone" dataKey="Earned" stroke="#14B8A6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEarned)" name="UH Contributed" />
                <Area type="monotone" dataKey="Spent" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpent)" name="UH Redeemed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Transaction history table of truth */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl backdrop-blur-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-white text-sm font-display">Transaction History Log</h4>
            <span className="text-[10px] font-bold text-slate-500 font-mono tracking-widest">Audit File</span>
          </div>

          <div className="divide-y divide-slate-850 max-h-60 overflow-y-auto pr-1">
            {transactions.map((tx) => {
              const absoluteSpent = tx.fromUserId === currentUser.id;
              
              return (
                <div key={tx.id} className="py-3 flex justify-between items-center gap-4 text-xs border-b border-slate-850/40">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${absoluteSpent ? "bg-red-950/60 border border-red-900/40 text-red-400" : "bg-teal-950/60 border border-teal-900/40 text-teal-400"}`}>
                      {absoluteSpent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <h5 className="font-bold text-white">{tx.purpose}</h5>
                      <p className="text-[10px] text-slate-505">
                        {tx.fromUserId === currentUser.id ? `To: ${tx.toUser}` : `From: ${tx.fromUser}`} • {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`font-mono font-bold ${absoluteSpent ? "text-slate-400" : "text-teal-400"}`}>
                    {absoluteSpent ? `-${tx.amount.toFixed(1)} UH` : `+${tx.amount.toFixed(1)} UH`}
                  </span>
                </div>
              );
            })}
            
            {transactions.length === 0 && (
              <p className="text-xs text-slate-550 text-center py-6">No transaction logs available.</p>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Transfer Desk & Leaderboard (col-span-4) */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Transfer desk form container */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-[2rem] shadow-lg backdrop-blur-md animate-fade-in">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1 font-display">Direct Co-op Transfer</span>
          <h4 className="text-lg font-bold text-white mb-4">Micro-donation & Transfers</h4>

          {txError && (
            <div className="bg-red-950/70 text-red-300 text-xs p-3.5 rounded-xl border border-red-900/40 flex items-center gap-2 mb-4">
              <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
              <span>{txError}</span>
            </div>
          )}

          {txSuccess && (
            <div className="bg-teal-950/70 text-teal-300 text-xs p-3.5 rounded-xl border border-teal-900/40 flex items-center gap-2 mb-4">
              <CheckCircle className="w-4.5 h-4.5 text-teal-400 shrink-0" />
              <span>{txSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            {/* Recipient SELECT */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-550 font-bold mb-1.5 font-display">Recipient Community Member</label>
              <select 
                value={recipientId} 
                onChange={(e) => setRecipientId(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40 cursor-pointer"
                required
              >
                <option value="" className="bg-slate-950 text-white">-- Choose recipient --</option>
                <option value="solidarity" className="bg-slate-950 text-white">💰 Solidarity Fund General Pool</option>
                {peerUsers.map(u => (
                  <option key={u.id} value={u.id} className="bg-slate-950 text-white">{u.name} ({u.role} - Bal: {u.unityHours.toFixed(1)} UH)</option>
                ))}
              </select>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-550 font-bold mb-1.5 font-display">Amount to transfer (Unity Hours)</label>
              <input 
                type="number" 
                min="0.5" 
                max="10.0" 
                step="0.5" 
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 1.0)}
                className="w-full bg-slate-950/70 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40"
                required
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-550 font-bold mb-1.5 font-display">Purpose / Note</label>
              <input 
                type="text" 
                placeholder="e.g. Volunteer tip or custom software help swap"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40"
                required
              />
            </div>

            <button 
              id="wallet-send-button"
              type="submit"
              disabled={submitting || !recipientId}
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-950 shrink-0" />
              {submitting ? "Clearing Ledger..." : "Commit Transfer"}
            </button>
          </form>
        </div>

        {/* Leaderboard widget */}
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-[2rem] shadow-md backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-white text-sm font-display">Community Champions</h4>
            <Trophy className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <p className="text-[10px] text-slate-500 mb-4 leading-relaxed font-display">
            The cooperative champions earning the highest Unity metrics assisting neighborhood circles.
          </p>

          <div className="space-y-4">
            {sortedChampions.map((champ, index) => (
              <div key={champ.id} className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850/80">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-slate-500 w-4">#{index + 1}</span>
                  <img src={champ.avatar} alt={champ.name} className="w-9 h-9 rounded-full object-cover border border-slate-800" />
                  <div>
                    <h5 className="font-bold text-xs text-white truncate max-w-32">{champ.name}</h5>
                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider leading-none mt-1">{champ.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">+{champ.hoursEarned.toFixed(0)}</span>
                  <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider">UH Earned</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
