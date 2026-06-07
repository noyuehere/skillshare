import React, { useState } from "react";
import { 
  Sparkles, CheckCircle, Brain, AlertTriangle, ArrowRight, Activity, Cpu, HelpCircle
} from "lucide-react";
import { User, AiMatch } from "../types";

interface AiMatchingSystemProps {
  currentUser: User;
  onFetchAiMatches: (offered: string, needed: string) => Promise<AiMatch[] | null>;
}

export default function AiMatchingSystem({ currentUser, onFetchAiMatches }: AiMatchingSystemProps) {
  const [skillsOffered, setSkillsOffered] = useState(currentUser.skills.join(", "));
  const [skillsNeeded, setSkillsNeeded] = useState(currentUser.needs.join(", "));
  const [matches, setMatches] = useState<AiMatch[]>([
    {
      matchedListingId: "l-1",
      matchType: "Learning Path suggestion",
      title: "React & TypeScript Mentorship with Marcus Chen",
      compatibility: 96,
      justification: `Since you represent an interest in coding (${currentUser.needs.join(", ")}), Marcus's Advanced program bridges development bottlenecks instantly.`,
      suggestedStep: "Redeem 1.0 Unity Hour to book an introduction slot with Marcus."
    },
    {
      matchedListingId: "l-2",
      matchType: "Provider Match",
      title: "Conversational Practice with Elena Rostova",
      compatibility: 88,
      justification: "Exchange your expertise to assist Elena with her tech workflow in return for premium foreign vocabulary coaching.",
      suggestedStep: "Send Elena a workspace messaging query on her listing page."
    },
    {
      matchedListingId: "l-5",
      matchType: "Borrower Match",
      title: "OWASP Top-10 Audit sharing with Alex Mercer",
      compatibility: 91,
      justification: `Your offered skills (${currentUser.skills.join(", ")}) match high-level data security priorities within Alex's direct learning cohort pipeline.`,
      suggestedStep: "Propose an equivalent hour swap directly with the Platform Admin."
    }
  ]);

  const [synthesizing, setSynthesizing] = useState(false);
  const [sourceChannel, setSourceChannel] = useState<"cached" | "gemini" | "heuristic">("cached");

  const handleSynthesize = async () => {
    setSynthesizing(true);
    try {
      const result = await onFetchAiMatches(skillsOffered, skillsNeeded);
      if (result && result.length > 0) {
        setMatches(result);
        setSourceChannel("gemini");
      } else {
        // Fallback local simulation logic
        setSourceChannel("heuristic");
      }
    } catch {
      setSourceChannel("heuristic");
    } finally {
      setSynthesizing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      
      {/* AI Hub Header */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-905 to-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-slate-850 shadow-xl mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-wider bg-indigo-950/80 border border-indigo-900/40 text-indigo-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 w-fit">
            <Cpu className="w-4 h-4 text-indigo-400" /> Matchmaker Advisor
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">
            The Intelligent AI Matchmaking Desk
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-sans">
            By evaluating registered member capability parameters and structural learning needs, our model constructs compatibility indexes. Find peer mentors, swap lessons, and form strategic local project dependencies.
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs parameters Left, Matches List Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input parameters */}
        <div className="lg:col-span-5 bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-850 shadow-md backdrop-blur-md space-y-5 h-fit">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1 font-display">Match Filters</span>
          <h4 className="text-lg font-bold text-white mb-2 font-display">Target Skills</h4>

          {/* Offered */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-display">Skills Offered (What you contribute)</label>
            <input 
              type="text" 
              value={skillsOffered}
              onChange={(e) => setSkillsOffered(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40" 
            />
            <span className="text-[9px] text-slate-500 mt-1.5 block">Comma separated list of things you master</span>
          </div>

          {/* Needed */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-505 mb-1.5 font-display">Skills Needed / Learning Goals</label>
            <input 
              type="text" 
              value={skillsNeeded}
              onChange={(e) => setSkillsNeeded(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 px-3 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40" 
            />
            <span className="text-[9px] text-slate-505 mt-1.5 block">Specify things you wish to redeem or acquire</span>
          </div>

          <button 
            id="synthesize-btn"
            onClick={handleSynthesize}
            disabled={synthesizing}
            className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl transition cursor-pointer shadow-xl flex items-center justify-center gap-2 font-display"
          >
            <Brain className="w-4 h-4 text-emerald-950" />
            {synthesizing ? "Finding matches..." : "Compute Match Compatibility"}
          </button>
        </div>

        {/* Right: Matches recommendations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-bold text-white text-sm font-display">Optimal Exchange Recommendations</h4>
              <p className="text-[10px] text-slate-500">Matches calculated based on community skills and learning requests.</p>
            </div>
            {synthesizing && <span className="text-xs font-bold text-indigo-400 animate-pulse">● Searching...</span>}
          </div>

          {matches.map((match, idx) => (
            <div key={idx} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-850 shadow-md backdrop-blur-md space-y-4 hover:border-slate-800 transition">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono mr-2">{match.matchType}</span>
                  <h4 className="font-extrabold text-slate-205 mt-2 text-sm font-display">{match.title}</h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="bg-emerald-955/60 border border-emerald-900/40 text-teal-400 text-2xs font-extrabold px-2.5 py-1 rounded-full font-mono">{match.compatibility}% MATCH</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-xl border border-slate-855 italic">
                "{match.justification}"
              </p>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2.5 border-t border-slate-850/65">
                <span className="font-semibold text-slate-400 font-sans">Action Plan: {match.suggestedStep}</span>
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="bg-slate-905 p-8 rounded-3xl text-center border border-slate-850">
              <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
              <p className="text-xs text-slate-450 mt-2 font-display">No recommendations computed yet. Press Compute Synthesize to start.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
