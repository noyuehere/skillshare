import React, { useState, useEffect } from "react";
import { 
  Sparkles, CheckCircle, ArrowRight, Star, Heart, 
  BookOpen, Code, Globe, ShieldCheck, PieChart, Users, Zap
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreSkills: () => void;
  onSwitchUser: (role: string) => void;
  stats: {
    users: number;
    skillsShared: number;
    hoursEarned: number;
    communities: number;
  };
}

export default function LandingPage({ onGetStarted, onExploreSkills, onSwitchUser, stats }: LandingPageProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    users: 1200,
    skillsShared: 250,
    hoursEarned: 82000,
    communities: 12
  });

  // Simple progress count impact stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        users: stats.users || 12480,
        skillsShared: stats.skillsShared || 84200,
        hoursEarned: stats.hoursEarned || 98402,
        communities: stats.communities || 42
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [stats]);

  const testimonials = [
    {
      name: "Marcus Chen",
      role: "Lead React Mentor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      content: "I've exchanged over 40 hours of software architecture advice for native German translation training and organic micro-gardening setup instructions. Unity Hours made it frictionless!",
      rating: 5,
      org: "Greenwood Eco-Alliance Member"
    },
    {
      name: "Elena Rostova",
      role: "Language Coach",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      content: "As a student, I couldn't afford premium masterclasses. By contributing languages translation reviews, I got direct mentorship hours from absolute cybersecurity experts. Incredible model!",
      rating: 5,
      org: "Oakwood High Alumna"
    },
    {
      name: "Principal Sarah Jenkins",
      role: "Oakwood High Admin",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      content: "Embedding SkillShare into our school ecosystem enabled senior students to tutor juniors, earning credits for local community service. Parent engagement increased 70%!",
      rating: 5,
      org: "Oakwood High School Admin"
    }
  ];

  return (
    <div className="flex-1 w-full bg-slate-950 relative overflow-y-auto">
      {/* Absolute Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-950/10 via-teal-950/5 to-transparent pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-950/40 border border-blue-900/40 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold w-fit uppercase tracking-widest shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Strength in Solidarity
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.05] text-slate-50 font-display">
            Turn Skills Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400">
              Opportunity.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
            Earn <span className="font-semibold text-slate-50">Unity Hours</span> by helping others and use them to access valuable support from your community. No cash, just genuine human connection and shared growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              id="hero-get-started"
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-250 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              id="hero-explore"
              onClick={onExploreSkills}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-2xl shadow-sm transition-all text-center"
            >
              Explore Skills Marketplace
            </button>
          </div>

          <div className="pt-6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2.5">Simulate a specific user role perspective:</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => onSwitchUser("Member")} 
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-300 transition"
              >
                👤 Member (Elena)
              </button>
              <button 
                onClick={() => onSwitchUser("Mentor")} 
                className="px-3 py-1.5 bg-teal-950/30 border border-teal-900/40 hover:bg-teal-900/50 rounded-lg text-xs font-medium text-teal-300 transition"
              >
                🎓 Mentor (Marcus)
              </button>
              <button 
                onClick={() => onSwitchUser("Organization Admin")} 
                className="px-3 py-1.5 bg-amber-950/30 border border-amber-900/40 hover:bg-amber-900/40 rounded-lg text-xs font-medium text-amber-300 transition"
              >
                🏫 School (Sarah)
              </button>
              <button 
                onClick={() => onSwitchUser("Platform Admin")} 
                className="px-3 py-1.5 bg-purple-950/30 border border-purple-900/40 hover:bg-purple-900/40 rounded-lg text-xs font-medium text-purple-300 transition"
              >
                ⚡ Platform Admin (Alex)
              </button>
            </div>
          </div>
        </div>

        {/* Hero Right: Interactive Community Network Simulation Illustration */}
        <div className="lg:col-span-5 relative">
          <div className="w-full bg-slate-900/40 rounded-[3rem] border border-slate-800 p-6 relative flex flex-col gap-5 shadow-2xl backdrop-blur-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-display">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span> Live Exchange Stream
              </span>
              <span className="text-[10px] bg-blue-950/80 border border-blue-900/45 text-blue-400 font-bold px-2 py-0.5 rounded-full">ACTIVE NODE</span>
            </div>

            {/* Interactive Network Exchange Representation */}
            <div className="relative h-64 bg-slate-950 rounded-[2rem] overflow-hidden p-6 text-slate-50 shadow-inner flex flex-col justify-between border border-slate-850">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#0f172a,transparent)] opacity-60"></div>
              
              {/* Graphic nodes */}
              <div className="absolute top-1/2 left-32 -translate-y-1/2 w-48 h-1 bg-gradient-to-r from-blue-500 to-teal-400 animate-pulse"></div>
              
              <div className="relative z-10 flex justify-between items-center h-full">
                {/* User Card 1 */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center w-28 shadow-lg">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-blue-500 mb-2 object-cover" />
                  <span className="text-xs font-bold mb-0.5 truncate w-full text-slate-200">Elena R.</span>
                  <span className="text-[9px] text-slate-500 uppercase mb-2">Gardening</span>
                  <div className="bg-blue-950/40 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-900/20">-1.0 UH</div>
                </div>

                {/* Exchange Direction Arrow Animation */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center animate-bounce mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-[9px] text-teal-400 font-mono tracking-widest uppercase animate-pulse">SWAPPING</span>
                </div>

                {/* User Card 2 */}
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center w-28 shadow-lg">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-teal-400 mb-2 object-cover" />
                  <span className="text-xs font-bold mb-0.5 truncate w-full text-slate-200">Marcus C.</span>
                  <span className="text-[9px] text-slate-500 uppercase mb-2">React Dev</span>
                  <div className="bg-teal-900/40 text-teal-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">+1.0 UH</div>
                </div>
              </div>

              {/* Network flow stats overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[10px] text-slate-500 font-mono">
                <span>TXID: UH-874A9B</span>
                <span>ESCROW: CLEARED</span>
              </div>
            </div>

            {/* Micro Wallet Card */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-850 rounded-3xl p-5 text-slate-50 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5 font-display">Co-op National Pool</p>
                  <h3 className="text-2xl font-bold font-mono">142,508 <span className="text-sm font-normal text-slate-500">UH</span></h3>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  <Users className="w-4 h-4 text-teal-400" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"></span>
                Every new user gets <strong>+5 Starter Units</strong> sponsored instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Statistics Section */}
      <section className="bg-slate-950/60 border-y border-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-50 tracking-tight font-mono">
              {animatedStats.users.toLocaleString()}
            </h3>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-normal">Active Cooperative Members</p>
          </div>
          <div className="text-center md:text-left space-y-1 border-l-0 md:border-l md:pl-8 border-slate-900">
            <h3 className="text-4xl md:text-5xl font-extrabold text-blue-400 tracking-tight font-mono">
              {animatedStats.skillsShared.toLocaleString()}
            </h3>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-normal">Skills Exchanged Successfully</p>
          </div>
          <div className="text-center md:text-left space-y-1 border-l-0 md:border-l md:pl-8 border-slate-900">
            <h3 className="text-4xl md:text-5xl font-extrabold text-teal-400 tracking-tight font-mono">
              {animatedStats.hoursEarned.toLocaleString()}
            </h3>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-normal">Unity Hours Earned Together</p>
          </div>
          <div className="text-center md:text-left space-y-1 border-l-0 md:border-l md:pl-8 border-slate-900">
            <h3 className="text-4xl md:text-5xl font-extrabold text-amber-500 tracking-tight font-mono">
              {animatedStats.communities}+
            </h3>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-normal">Sponsored Organizations & NGOs</p>
          </div>
        </div>
      </section>

      {/* Section: How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 font-display">
            The Sustainable Time-Credit Cycle
          </h2>
          <p className="text-slate-400 text-sm">
            No money is exchanged on SkillShare. We measure trust, support, and contribution using Unity Hours. One hour of mentorship is worth exactly one hour of any other community service.
          </p>
        </div>

        {/* Dynamic Animated Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[44px] left-10 right-10 h-0.5 bg-slate-800 -z-10"></div>

          {/* Step 1 */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-sm relative transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-900/45 text-blue-400 font-bold flex items-center justify-center text-lg mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-50 mb-2">Share a Skill</h4>
            <p className="text-xs text-slate-450 leading-relaxed">
              Register topics you master: software debugging, conversational languages, cooking, gardening, or legal consultancy.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-sm relative transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-teal-950/60 border border-teal-900/45 text-teal-400 font-bold flex items-center justify-center text-lg mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-50 mb-2">Earn Unity Hours</h4>
            <p className="text-xs text-slate-450 leading-relaxed">
              When someone books your skill listing, you conduct the session and gain positive time credit straight into your wallet.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-sm relative transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-900/45 text-amber-400 font-bold flex items-center justify-center text-lg mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-50 mb-2">Redeem Support</h4>
            <p className="text-xs text-slate-450 leading-relaxed">
              Spend accrued credits to unlock specialized experts, high school student cohorts, or emergency administrative aid.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-900 border border-slate-800 text-slate-50 p-6 rounded-2xl shadow-xl relative transform hover:scale-105 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-400 text-slate-950 font-extrabold flex items-center justify-center text-lg mb-4">
              4
            </div>
            <h4 className="font-bold mb-2">Build Resilience</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              As skills cycle throughout schools and neighborhoods, local support frameworks stay secure without dependence on capital liquidity.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="bg-slate-950/40 border-y border-slate-900/60 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 font-display">State Of The Art Infrastructure</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 font-display">
              Engineered For Scalable Mutual-Aid
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-slate-850 hover:border-slate-800 transition-all">
              <div className="p-3 bg-blue-950/60 text-blue-400 border border-blue-900/40 rounded-xl w-fit mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-50 mb-2">Skill Exchange Marketplace</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Filter by category, location, and rating. Schedule instantly through beautiful structured interfaces built with mobile-first layout.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-slate-850 hover:border-slate-800 transition-all">
              <div className="p-3 bg-teal-950/60 text-teal-400 border border-teal-900/40 rounded-xl w-fit mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-50 mb-2">AI Matchmaking Optimization</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our server-integrated Gemini models dynamically resolve offerings and learning paths to surface compatibility rates up to 98%.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-slate-850 hover:border-slate-800 transition-all">
              <div className="p-3 bg-amber-950/60 text-amber-400 border border-amber-900/40 rounded-xl w-fit mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-50 mb-2">Unity Hours Escrow Wallet</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transparent transaction histories tracking credits accrued versus spent with fully digitalized audit logs on the platform.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-slate-850 hover:border-slate-800 transition-all">
              <div className="p-3 bg-red-950/60 text-red-400 border border-red-900/40 rounded-xl w-fit mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-50 mb-2">Emergency Solidarity Fund</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Direct safety rails representing public corporate sponsorship hours, peer-donated hours, and structured relief claims.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-slate-850 hover:border-slate-850 transition-all">
              <div className="p-3 bg-green-950/60 text-green-400 border border-green-900/40 rounded-xl w-fit mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-50 mb-2">Trust & Verification Matrix</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Multilevel reputation scoring starting from basic login checks all the way to institution-level verification by schools and NGOs.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/40 p-8 rounded-3xl shadow-sm border border-slate-850 hover:border-slate-850 transition-all">
              <div className="p-3 bg-purple-950/60 text-purple-400 border border-purple-900/40 rounded-xl w-fit mb-5">
                <PieChart className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-50 mb-2">Organization Analytics Portal</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Allows schools, universities, and enterprise network partners to evaluate student engagement metrics and mutual-aid impacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-450 font-display">Stories of Solidarity</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50">
              Approved By Real School Admins and Neighbors
            </h2>
            <p className="text-slate-400 text-sm">
              Read how members around the globe utilize our collaborative time credits system to unlock peer potential without spending money.
            </p>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${activeTestimonial === i ? "bg-teal-400 w-8" : "bg-slate-800"}`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/40 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-850 flex flex-col justify-between min-h-[250px] relative backdrop-blur-xs">
            <div className="absolute top-6 right-8 text-8xl text-slate-800/15 font-serif leading-none select-none">“</div>
            <p className="text-slate-350 md:text-lg italic leading-relaxed relative z-10">
              "{testimonials[activeTestimonial].content}"
            </p>
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-800">
              <img 
                src={testimonials[activeTestimonial].avatar} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full object-cover border border-slate-800" 
              />
              <div>
                <h5 className="font-bold text-slate-50 text-sm">{testimonials[activeTestimonial].name}</h5>
                <p className="text-xs text-slate-500">{testimonials[activeTestimonial].role} • <span className="text-teal-400 font-medium">{testimonials[activeTestimonial].org}</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
