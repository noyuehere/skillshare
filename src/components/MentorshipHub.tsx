import React, { useState } from "react";
import { 
  Sparkles, CheckCircle, GraduationCap, Calendar, Clock, Star, 
  MessageSquare, Users, Award, ShieldCheck, Heart, MapPin, X
} from "lucide-react";
import { User, SkillListing } from "../types";

interface MentorshipHubProps {
  currentUser: User;
  listings: SkillListing[];
  onBook: (listingId: string, date: string, time: string) => Promise<boolean>;
}

export default function MentorshipHub({ currentUser, listings, onBook }: MentorshipHubProps) {
  const [selectedMentor, setSelectedMentor] = useState<SkillListing | null>(null);
  const [bookDate, setBookDate] = useState("2026-06-08");
  const [bookTime, setBookTime] = useState("2:00 PM EST");
  const [bookSuccess, setBookSuccess] = useState("");
  const [bookError, setBookError] = useState("");
  const [booking, setBooking] = useState(false);

  // Filter listings representing technology mentorship or complex business skills to represent mentors
  const mentors = listings.filter(l => 
    l.category === "Technology" || l.category === "Business Skills" || l.category === "Career Guidance"
  );

  const handleBook = async (m: SkillListing) => {
    setSelectedMentor(m);
    setBookSuccess("");
    setBookError("");
  };

  const handleBookingConfirm = async () => {
    if (!selectedMentor) return;
    setBooking(true);
    setBookError("");
    setBookSuccess("");
    try {
      if (currentUser.id === selectedMentor.providerId) {
        setBookError("You are already registered on this mentor listing snapshot.");
        setBooking(false);
        return;
      }
      
      const res = await onBook(selectedMentor.id, bookDate, bookTime);
      if (res) {
        setBookSuccess("Mentorship booking submitted! Waiting for review.");
        setTimeout(() => {
          setSelectedMentor(null);
          setBookSuccess("");
        }, 1500);
      } else {
        setBookError("Failed to book session. Please verify available Unity hours.");
      }
    } catch {
      setBookError("Lead ledger error matching scheduled slot.");
    } finally {
      setBooking(false);
    }
  };

  // Determine if logged-in user has mentor widgets (e.g., Marcus Chen)
  const isCurrentUserMentor = currentUser.role === "Mentor" || currentUser.role === "Platform Admin";

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      
      {/* Mentor Hub Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest font-display">Cooperative Academics</span>
          <h2 className="text-3xl font-extrabold text-white font-display mt-1">Specialized Mentorship Network</h2>
          <p className="text-slate-400 text-xs">Access high-end industry leadership lessons, code review sessions, and legal advising.</p>
        </div>

        {isCurrentUserMentor && (
          <div className="bg-teal-950/60 border border-teal-900/40 px-4 py-3 rounded-2xl flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-455" />
            <div className="text-xs">
              <span className="font-bold text-teal-300 block font-display">Contributor Status Active</span>
              <span className="text-slate-400">Your profile guides 2 pending student cohorts</span>
            </div>
          </div>
        )}
      </div>

      {/* Mentor Specialist Dashboard Summary (Only visible if currentUser is Mentor or Admin) */}
      {isCurrentUserMentor && (
        <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-850 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in backdrop-blur-md">
          <div className="bg-slate-950/60 border border-slate-850/60 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Students Guided</span>
            <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">18 Members</h4>
            <p className="text-[9px] text-teal-400 mt-0.5">Across 4 university networks</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/60 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Hours Contributed</span>
            <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">42.0 UH</h4>
            <p className="text-[9px] text-teal-400 mt-0.5 font-display">Top 5% contributor status</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/60 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Peer Impact Score</span>
            <h4 className="text-2xl font-extrabold text-white mt-1 font-mono">99% Health</h4>
            <p className="text-[9px] text-teal-400 mt-0.5">Based on 14 positive reviews</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-850/60 p-4 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-display">Active Achievements</span>
            <div className="flex gap-1.5 mt-2">
              <span className="text-[9px] bg-amber-950/60 border border-amber-900/45 text-amber-400 px-1.5 py-0.5 rounded font-extrabold font-display" title="Has done 10+ exchanges">⭐ Mentor Star</span>
              <span className="text-[9px] bg-red-950/60 border border-red-900/45 text-red-400 px-1.5 py-0.5 rounded font-extrabold font-display">🏆 Champion</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid List of Mentors in marketplace */}
      <h3 className="font-bold text-white mb-6 text-sm font-display">Recognized Advising Sessions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        {mentors.map((m) => (
          <div key={m.id} className="bg-slate-900/40 rounded-3xl border border-slate-850 shadow-sm overflow-hidden flex flex-col justify-between hover:border-slate-800 transition">
            <div className="p-6 space-y-4">
              {/* Profile Card heading */}
              <div className="flex items-center gap-3">
                <img src={m.providerAvatar} alt={m.providerName} className="w-12 h-12 rounded-full object-cover border-2 border-slate-800" />
                <div>
                  <h4 className="font-bold text-sm text-slate-200 mt-0.5">{m.providerName}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{m.providerBadge}</p>
                </div>
              </div>

              {/* Title / Description info */}
              <div>
                <span className="inline-block bg-teal-950/70 border border-teal-900/45 text-teal-400 text-[9px] font-bold px-2 py-0.5 rounded-md mb-2 uppercase font-mono">{m.category} Specialist</span>
                <h5 className="font-extrabold text-white text-xs line-clamp-2 leading-snug">{m.title}</h5>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">{m.description}</p>
              </div>

              {/* Trust parameters */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850/60 font-mono font-semibold">
                <span>⭐ {m.rating} Rating score</span>
                <span className="font-bold text-teal-450 font-mono">Score: {m.providerTrustScore}%</span>
              </div>
            </div>

            {/* Book slot box */}
            <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-850/80 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-550 font-mono tracking-wider">Contribution Value</span>
                <h5 className="font-mono font-extrabold text-sm text-white mt-0.5">{m.cost.toFixed(1)} UH <span className="text-[10px] font-normal text-slate-500 font-sans">/ session</span></h5>
              </div>

              <button 
                id={`book-mentor-${m.id}`}
                onClick={() => handleBook(m)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 font-black text-slate-950 text-xs rounded-xl cursor-pointer transition"
              >
                Schedule slot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Session Schedule Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-6 max-w-md w-full border border-slate-850 shadow-2xl relative text-white">
            <button onClick={() => setSelectedMentor(null)} className="absolute top-4 right-4 p-1 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 rounded-full cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            
            <span className="text-xs font-bold uppercase text-teal-400 tracking-wider block mb-1">Cooperative Mentorship</span>
            <h4 className="text-xl font-bold mb-4 font-display">Book Advising Session</h4>

            {bookError && (
              <div className="bg-red-955/70 text-red-300 text-xs p-3.5 rounded-xl border border-red-900/40 flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{bookError}</span>
              </div>
            )}

            {bookSuccess && (
              <div className="bg-teal-950/70 text-teal-300 text-xs p-3.5 rounded-xl border border-teal-900/40 flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{bookSuccess}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850/80 flex items-center gap-3">
                <img src={selectedMentor.providerAvatar} alt={selectedMentor.providerName} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                <div>
                  <h5 className="font-bold text-xs text-white">{selectedMentor.providerName}</h5>
                  <p className="text-[10px] text-slate-500 font-semibold font-mono mt-0.5">Trust Score: {selectedMentor.providerTrustScore}% verified status</p>
                </div>
              </div>

              <div className="bg-teal-950/60 border border-teal-900/35 p-4 rounded-xl text-slate-350 text-xs space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Selected Program:</span>
                  <span className="text-white text-right truncate max-w-xs">{selectedMentor.title}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>Required Unity Hours:</span>
                  <span className="font-extrabold text-teal-400">{selectedMentor.cost.toFixed(1)} UH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-550 mb-1.5 font-display">Target Date</label>
                  <input 
                    type="date" 
                    value={bookDate} 
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-550 mb-1.5 font-display">Time Slot</label>
                  <input 
                    type="text" 
                    value={bookTime} 
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500/40" 
                  />
                </div>
              </div>

              <button 
                onClick={handleBookingConfirm}
                disabled={booking || !!bookSuccess}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer"
              >
                {booking ? "Locking Escrow..." : "Authorize Unity Hours Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
