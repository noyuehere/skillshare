import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Resolve paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini Client initialized successfully on server-side.");
  } else {
    console.log("No GEMINI_API_KEY found. Server will run in heuristic-matching fallback mode.");
  }
} catch (err) {
  console.error("Failed to initialize Gemini client:", err);
}

// DATABASE SYSTEM SCHEMA (In-Memory Database store with Seed Data)

let users = [
  {
    id: "u-1",
    name: "Elena Rostova",
    email: "elena.r@coop.org",
    role: "Member",
    unityHours: 15.0,
    hoursEarned: 24.0,
    hoursSpent: 9.0,
    trustScore: 98,
    verificationLevel: "Verified", // Basic, Verified, Community Leader, Institution Verified
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    skills: ["Language Tutoring", "Copywriting", "Urban Gardening"],
    needs: ["React Native Integration", "Figma Prototyping"],
    joinedAt: "2026-01-12",
    badges: ["Starter Bonus", "Active Neighbor", "Trusted Exchanger"]
  },
  {
    id: "u-2",
    name: "Marcus Chen",
    email: "marcus.dev@gmail.com",
    role: "Mentor",
    unityHours: 8.5,
    hoursEarned: 42.0,
    hoursSpent: 33.5,
    trustScore: 99,
    verificationLevel: "Community Leader",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    skills: ["React Development", "Figma Prototyping", "Backend System Architecture"],
    needs: ["Spanish Conversation", "Tax Preparation Help"],
    joinedAt: "2025-11-04",
    badges: ["Community Champion", "Mentor Star", "5-Star Host"]
  },
  {
    id: "u-3",
    name: "Principal Sarah Jenkins",
    email: "sjenkins@hightechhigh.edu",
    role: "Organization Admin",
    organizationName: "Oakwood High School",
    unityHours: 120.0,
    hoursEarned: 450.0,
    hoursSpent: 330.0,
    trustScore: 100,
    verificationLevel: "Institution Verified",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    skills: ["Youth Mentorship", "Event Organizing", "Grant Writing"],
    needs: ["STEM Mentors", "Web Redesign", "Community Cleanups"],
    joinedAt: "2025-08-15",
    badges: ["Sovereign School", "Impact Driver"]
  },
  {
    id: "u-4",
    name: "Alex Mercer",
    email: "urnotdeva@gmail.com", // Current developer email for seamless experience
    role: "Platform Admin",
    unityHours: 50.0,
    hoursEarned: 100.0,
    hoursSpent: 50.0,
    trustScore: 100,
    verificationLevel: "Community Leader",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    skills: ["Cybersecurity", "Database Optimization", "SaaS Growth"],
    needs: ["Italian Cooking Class", "Yoga Coach"],
    joinedAt: "2025-05-10",
    badges: ["Core System Architect", "Solidarity Guardian"]
  }
];

let skillsList = [
  "React Development", "Figma Prototyping", "Language Tutoring", "Spanish Conversation", 
  "Urban Gardening", "Public Speaking", "Tax Preparation Help", "Youth Mentorship", 
  "Copywriting", "Video Editing", "Cooking Classes", "Car Maintenance", "Yoga Coaching"
];

let skillListings = [
  {
    id: "l-1",
    providerId: "u-2",
    providerName: "Marcus Chen",
    providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    providerTrustScore: 99,
    providerBadge: "Community Leader",
    title: "1-on-1 React & TypeScript Mentorship",
    description: "Struggling with states, hooks, or setting up Node? I am offering one-hour structured sessions to debug code, explain compiler principles, and guide your React apps.",
    category: "Technology",
    skillLevel: "Advanced",
    availability: "Tuesdays & Thursdays, 6PM - 9PM EST",
    cost: 1.0, // Unity Hour per Session
    rating: 4.9,
    reviewsCount: 18,
    reviews: [
      { reviewerName: "Elena Rostova", rating: 5, comment: "Incredibly patient! Cleared out my React context issues in 30 minutes! Highly recommended.", date: "2026-05-18" },
      { reviewerName: "Tim Vance", rating: 4.8, comment: "Superb debugger! Showed me how esbuild bundling operates.", date: "2026-04-20" }
    ]
  },
  {
    id: "l-2",
    providerId: "u-1",
    providerName: "Elena Rostova",
    providerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    providerTrustScore: 98,
    providerBadge: "Verified",
    title: "Russian & German Conversational Practice",
    description: "Interactive conversation covering travel, business idioms, or general pronunciation coaching. Accessible to all fluency levels.",
    category: "Languages",
    skillLevel: "Expert / Native",
    availability: "Weekends, All Day",
    cost: 1.0,
    rating: 4.8,
    reviewsCount: 12,
    reviews: [
      { reviewerName: "Marcus Chen", rating: 5, comment: "Extremely fun and well paced. We practiced daily situations.", date: "2026-05-10" }
    ]
  },
  {
    id: "l-3",
    providerId: "u-3",
    providerName: "Principal Sarah Jenkins",
    providerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    providerTrustScore: 100,
    providerBadge: "Institution Verified",
    title: "Strategic Grant Writing for Non-Profits",
    description: "Learn how to formulate compelling community impacts, budget allocations, and structure letters of intent to unlock philanthropic sponsorships.",
    category: "Business Skills",
    skillLevel: "Advanced",
    availability: "Mondays, 4PM - 6PM",
    cost: 2.0,
    rating: 5.0,
    reviewsCount: 5,
    reviews: [
      { reviewerName: "Alex Mercer", rating: 5, comment: "Helped our community group draft an application that raised 50 solidarity credits! True expert.", date: "2026-03-01" }
    ]
  },
  {
    id: "l-4",
    providerId: "u-1",
    providerName: "Elena Rostova",
    providerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    providerTrustScore: 98,
    providerBadge: "Verified",
    title: "Urban Vegetable Harvesting on Small Balconies",
    description: "Max out your space! I show you how to generate organic tomatoes, fresh basil, and microgreens using recycled cartons, structural planters, and custom soil solutions.",
    category: "Community Services",
    skillLevel: "Intermediate",
    availability: "Friday Afternoon",
    cost: 1.0,
    rating: 4.7,
    reviewsCount: 8,
    reviews: []
  },
  {
    id: "l-5",
    providerId: "u-4",
    providerName: "Alex Mercer",
    providerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    providerTrustScore: 100,
    providerBadge: "Community Leader",
    title: "Web Security Audit & OWASP Top 10 Safeguarding",
    description: "We review your Node/Express endpoints or React input sanitize filters together. Protect your database from injection attacks and ensure secure session cookies.",
    category: "Technology",
    skillLevel: "Expert",
    availability: "By Appointment",
    cost: 1.5,
    rating: 4.9,
    reviewsCount: 22,
    reviews: []
  }
];

let bookings = [
  {
    id: "b-1",
    listingId: "l-1",
    listingTitle: "1-on-1 React & TypeScript Mentorship",
    providerId: "u-2",
    providerName: "Marcus Chen",
    providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    borrowerId: "u-1",
    borrowerName: "Elena Rostova",
    hours: 1.0,
    status: "completed", // pending, completed, cancelled
    scheduledDate: "2026-05-18",
    scheduledTime: "19:00 EST",
    completedAt: "2026-05-18",
    feedback: "Cleared out my React Context issues."
  },
  {
    id: "b-2",
    listingId: "l-2",
    listingTitle: "Russian & German Conversational Practice",
    providerId: "u-1",
    providerName: "Elena Rostova",
    providerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    borrowerId: "u-2",
    borrowerName: "Marcus Chen",
    hours: 1.0,
    status: "completed",
    scheduledDate: "2026-05-10",
    scheduledTime: "10:00 AM",
    completedAt: "2026-05-10"
  },
  {
    id: "b-3",
    listingId: "l-3",
    listingTitle: "Strategic Grant Writing for Non-Profits",
    providerId: "u-3",
    providerName: "Principal Sarah Jenkins",
    providerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    borrowerId: "u-4",
    borrowerName: "Alex Mercer",
    hours: 2.0,
    status: "pending",
    scheduledDate: "2026-06-08",
    scheduledTime: "16:00 EST"
  },
  {
    id: "b-4",
    listingId: "l-1",
    listingTitle: "1-on-1 React & TypeScript Mentorship",
    providerId: "u-2",
    providerName: "Marcus Chen",
    providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    borrowerId: "u-4",
    borrowerName: "Alex Mercer",
    hours: 1.0,
    status: "pending",
    scheduledDate: "2026-06-05",
    scheduledTime: "18:00 EST"
  }
];

let transactions = [
  {
    id: "t-1",
    fromUser: "Elena Rostova",
    fromUserId: "u-1",
    toUser: "Marcus Chen",
    toUserId: "u-2",
    amount: 1.0,
    purpose: "React & TypeScript Mentorship Co-op session",
    date: "2026-05-18T19:30:00Z"
  },
  {
    id: "t-2",
    fromUser: "Marcus Chen",
    fromUserId: "u-2",
    toUser: "Elena Rostova",
    toUserId: "u-1",
    amount: 1.0,
    purpose: "German Speaking Practice Exchange",
    date: "2026-05-10T11:00:00Z"
  },
  {
    id: "t-3",
    fromUser: "System (Solidarity Fund)",
    fromUserId: "solidarity",
    toUser: "Elena Rostova",
    toUserId: "u-1",
    amount: 5.0,
    purpose: "Starter Member Credit Allocation",
    date: "2026-01-12T10:00:00Z"
  },
  {
    id: "t-4",
    fromUser: "System (Solidarity Fund)",
    fromUserId: "solidarity",
    toUser: "Alex Mercer",
    toUserId: "u-4",
    amount: 5.0,
    purpose: "Starter Member Credit Allocation",
    date: "2025-05-10T10:00:00Z"
  }
];

let solidarityRequests = [
  {
    id: "sr-1",
    requesterName: "Oakwood High School Co-op",
    requesterId: "u-3",
    category: "Educational Supplies Support",
    details: "We are seeking 30 Unity Hours to sponsor local math tutoring for disadvantaged high school students ahead of upcoming university entrance examinations.",
    hoursRequested: 30.0,
    hoursApproved: 30.0,
    status: "approved", // pending, approved, declining
    urgency: "High",
    createdAt: "2026-05-12",
  },
  {
    id: "sr-2",
    requesterName: "Elena Rostova",
    requesterId: "u-1",
    category: "Emergency Laptop Service",
    details: "My micro-gardening research laptop screen broke. I need an active hardware hobbyist to help replace my hardware components. I am requesting 3 solidarity hours to cover this exchange.",
    hoursRequested: 3.0,
    hoursApproved: 0.0,
    status: "pending",
    urgency: "Medium",
    createdAt: "2026-06-01",
  }
];

let organizations = [
  {
    id: "org-1",
    name: "Oakwood High School",
    adminId: "u-3",
    membersCount: 84,
    hoursExchanged: 412.0,
    participationRate: 92, // 92%
    healthScore: 98, // Co-op engagement healthy status
    type: "School",
    description: "Equipping young minds through project-based peer-learning and collaborative neighborhood service circles.",
    activeSponsorships: [
      { id: "s-1", corporateSponsor: "Google AI Studio Labs", hoursContribution: 100.0, target: "STEM Mentors" }
    ]
  },
  {
    id: "org-2",
    name: "Greenwood Eco-Alliance",
    adminId: "u-2",
    membersCount: 45,
    hoursExchanged: 185.5,
    participationRate: 78,
    healthScore: 85,
    type: "NGO",
    description: "Re-wilding community alleyways, designing rooftop farms, and distributing local seed stocks to improve neighborhood resilience.",
    activeSponsorships: []
  }
];

let forumPosts = [
  {
    id: "f-1",
    authorName: "Marcus Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    title: "How to set boundaries on Unity hours expectations?",
    content: "When offering software mentorship, some students request 2-3 extra hours of offline async reviews. Let's list some cooperative standards we can adopt! I suggest limiting prep-work to 15 mins per credit.",
    category: "Member Standards",
    likes: 14,
    commentsCount: 3,
    createdAt: "2026-05-28",
    comments: [
      { author: "Elena Rostova", content: "Agreed! It helps to be explicit about scope in the Skill listing before the booking is confirmed.", date: "2026-05-29" },
      { author: "Sarah Jenkins", content: "In school networks we define fixed 1-hour sessions, this is safe and repeatable.", date: "2026-05-30" }
    ]
  },
  {
    id: "f-2",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    title: "Launch of the Balcony Harvest Solidarity Scheme",
    content: "We've officially distributed microgreen starter trays to 15 families on our block. Shoutout to Sarah Jenkins for granting the Solidarity Hours to coordinate transportation! Post your photos here.",
    category: "Success Stories",
    likes: 28,
    commentsCount: 1,
    createdAt: "2026-05-15",
    comments: [
      { author: "Alex Mercer", content: "This is exactly what the Solidarity Co-op is about!", date: "2026-05-16" }
    ]
  }
];

let notifications = [
  { id: "n-1", userId: "u-1", text: "Your booking for Strategic Grant Writing was booked successfully.", unread: true, date: "2026-06-02" },
  { id: "n-2", userId: "u-2", text: "You have a new session request from Alex Mercer.", unread: true, date: "2026-06-02" },
  { id: "n-3", userId: "u-4", text: "Welcome to SkillShare Cooperative! You have received 5 Starter Unity Hours.", unread: false, date: "2026-05-10" }
];

let activeCurrentUserIndex = 3; // Default to Alex Mercer (Platform Admin / urnotdeva@gmail.com) for full-power showcase

// Helper function to add transaction logs
function addTransaction(fromUserId: string, toUserId: string, amount: number, purpose: string) {
  const fromUser = users.find(u => u.id === fromUserId);
  const toUser = users.find(u => u.id === toUserId);
  
  if (!toUser) return false;
  
  const fromName = fromUser ? fromUser.name : "System (Solidarity Fund)";
  const toName = toUser.name;
  
  if (fromUser) {
    if (fromUser.unityHours < amount) return false;
    fromUser.unityHours -= amount;
    fromUser.hoursSpent += amount;
  }
  
  toUser.unityHours += amount;
  toUser.hoursEarned += amount;
  
  const newTx = {
    id: `t-${transactions.length + 1}`,
    fromUser: fromName,
    fromUserId,
    toUser: toName,
    toUserId,
    amount,
    purpose,
    date: new Date().toISOString()
  };
  
  transactions.unshift(newTx);
  return true;
}

// REST API ROUTES

// Get current database state for the logged-in profile
app.get("/api/state", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  res.json({
    currentUser,
    users,
    skillsList,
    skillListings,
    bookings: bookings.filter(b => b.providerId === currentUser.id || b.borrowerId === currentUser.id || currentUser.role === "Platform Admin"),
    allBookings: bookings, // For admin dashboard
    transactions: transactions.filter(t => t.fromUserId === currentUser.id || t.toUserId === currentUser.id || currentUser.role === "Platform Admin"),
    allTransactions: transactions, // For admin
    solidarityRequests,
    organizations,
    forumPosts,
    notifications: notifications.filter(n => n.userId === currentUser.id)
  });
});

// Switch Active Mock User Profiles
app.post("/api/auth/switch-role", (req, res) => {
  const { role } = req.body;
  const foundIndex = users.findIndex(u => u.role === role);
  if (foundIndex !== -1) {
    activeCurrentUserIndex = foundIndex;
    return res.json({ success: true, user: users[foundIndex] });
  }
  res.status(404).json({ error: "Role profile snapshot not found" });
});

// Post a new listing
app.post("/api/listings/create", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  const { title, description, category, skillLevel, availability, cost } = req.body;
  
  if (!title || !description || !category || !cost) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newListing = {
    id: `l-${skillListings.length + 1}`,
    providerId: currentUser.id,
    providerName: currentUser.name,
    providerAvatar: currentUser.avatar,
    providerTrustScore: currentUser.trustScore,
    providerBadge: currentUser.verificationLevel,
    title,
    description,
    category,
    skillLevel: skillLevel || "Intermediate",
    availability: availability || "Anytime",
    cost: parseFloat(cost) || 1.0,
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  };

  skillListings.unshift(newListing);
  
  // Update provider skills list if not present
  if (!currentUser.skills.includes(title)) {
    currentUser.skills.push(title);
  }
  if (!skillsList.includes(title)) {
    skillsList.push(title);
  }

  // Create notification
  notifications.unshift({
    id: `n-${notifications.length + 1}`,
    userId: currentUser.id,
    text: `Your listing "${title}" has been successfully broadcast to the Cooperative network!`,
    unread: true,
    date: new Date().toISOString().split('T')[0]
  });

  res.json({ success: true, listing: newListing });
});

// Book a session
app.post("/api/bookings/create", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  const { listingId, scheduledDate, scheduledTime } = req.body;
  
  const listing = skillListings.find(l => l.id === listingId);
  if (!listing) return res.status(404).json({ error: "Skill Listing not found" });
  
  if (currentUser.id === listing.providerId) {
    return res.status(400).json({ error: "You cannot book your own skill listing" });
  }

  if (currentUser.unityHours < listing.cost) {
    return res.status(400).json({ 
      error: `Insufficient Unity Hours balance! This booking costs ${listing.cost} UH, but you only have ${currentUser.unityHours} UH.` 
    });
  }

  const newBooking = {
    id: `b-${bookings.length + 1}`,
    listingId,
    listingTitle: listing.title,
    providerId: listing.providerId,
    providerName: listing.providerName,
    providerAvatar: listing.providerAvatar,
    borrowerId: currentUser.id,
    borrowerName: currentUser.name,
    hours: listing.cost,
    status: "pending",
    scheduledDate,
    scheduledTime
  };

  bookings.unshift(newBooking);

  // Auto-debit the hours immediately (hold in escrow/pending)
  currentUser.unityHours -= listing.cost;
  currentUser.hoursSpent += listing.cost;

  // Add notification to Provider
  notifications.unshift({
    id: `n-${notifications.length + 1}`,
    userId: listing.providerId,
    text: `${currentUser.name} has requested structured support: "${listing.title}". Action needed!`,
    unread: true,
    date: new Date().toISOString().split('T')[0]
  });

  res.json({ success: true, booking: newBooking, balance: currentUser.unityHours });
});

// Complete booking and release funds to provider + increase trust scores
app.post("/api/bookings/complete", (req, res) => {
  const { bookingId } = req.body;
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return res.status(404).json({ error: "Booking node not found" });

  if (booking.status !== "pending") {
    return res.status(400).json({ error: "Booking is already processed or completed" });
  }

  booking.status = "completed";
  booking.completedAt = new Date().toISOString().split('T')[0];

  // Transfer pending hours to the provider
  const provider = users.find(u => u.id === booking.providerId);
  if (provider) {
    provider.unityHours += booking.hours;
    provider.hoursEarned += booking.hours;
    
    // Boost trust scores for both users for carrying out credit exchanges
    provider.trustScore = Math.min(100, provider.trustScore + 2);
    const borrower = users.find(u => u.id === booking.borrowerId);
    if (borrower) {
      borrower.trustScore = Math.min(100, borrower.trustScore + 1);
    }

    // Record formal transaction transfer
    transactions.unshift({
      id: `t-${transactions.length + 1}`,
      fromUser: booking.borrowerName,
      fromUserId: booking.borrowerId,
      toUser: booking.providerName,
      toUserId: booking.providerId,
      amount: booking.hours,
      purpose: `Completed skill-exchange: ${booking.listingTitle}`,
      date: new Date().toISOString()
    });

    // Notify provider of credits cleared
    notifications.unshift({
      id: `n-${notifications.length + 1}`,
      userId: provider.id,
      text: `Unity Hours verified! You have earned +${booking.hours} UH from ${booking.borrowerName} for "${booking.listingTitle}". Your trust score is now ${provider.trustScore}!`,
      unread: true,
      date: new Date().toISOString().split('T')[0]
    });
  }

  res.json({ success: true, booking });
});

// Apply for Solidarity Support / Emergency Hours
app.post("/api/solidarity/apply", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  const { category, details, hoursRequested, urgency } = req.body;

  if (!category || !details || !hoursRequested) {
    return res.status(400).json({ error: "Please fill out all solidarity fields." });
  }

  const newRequest = {
    id: `sr-${solidarityRequests.length + 1}`,
    requesterName: currentUser.name,
    requesterId: currentUser.id,
    category,
    details,
    hoursRequested: parseFloat(hoursRequested),
    hoursApproved: 0,
    status: "pending",
    urgency: urgency || "Low",
    createdAt: new Date().toISOString().split('T')[0]
  };

  solidarityRequests.unshift(newRequest);

  notifications.unshift({
    id: `n-${notifications.length + 1}`,
    userId: currentUser.id,
    text: `Your support claim of ${hoursRequested} Unity Hours has been registered. Trustees will analyze it shortly.`,
    unread: true,
    date: new Date().toISOString().split('T')[0]
  });

  res.json({ success: true, request: newRequest });
});

// Instant Starter Claim (Every member gets 5 starter hours if they are running low or just registered)
app.post("/api/solidarity/claim-starter", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  
  // To allow continuous UI onboarding experience, we let them claim it once per session if balance drops below 5
  if (currentUser.unityHours >= 5) {
    return res.status(400).json({ error: "You already have starter hours. Starter hours can be requested when your balance is less than 5 UH." });
  }

  const claimAmt = 5.0;
  currentUser.unityHours += claimAmt;
  currentUser.hoursEarned += claimAmt;

  transactions.unshift({
    id: `t-${transactions.length + 1}`,
    fromUser: "System (Solidarity Fund)",
    fromUserId: "solidarity",
    toUser: currentUser.name,
    toUserId: currentUser.id,
    amount: claimAmt,
    purpose: "Co-op Starter Grant Injection",
    date: new Date().toISOString()
  });

  notifications.unshift({
    id: `n-${notifications.length + 1}`,
    userId: currentUser.id,
    text: `Claim approved! You have been granted +5.0 Solidarity credits to jumpstart your exchanges.`,
    unread: true,
    date: new Date().toISOString().split('T')[0]
  });

  res.json({ success: true, user: currentUser });
});

// Donate Direct Credits to Solidarity Fund or another peer
app.post("/api/wallet/transfer", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  const { toUserId, amount, purpose } = req.body;

  const amtNum = parseFloat(amount);
  if (isNaN(amtNum) || amtNum <= 0) {
    return res.status(400).json({ error: "Invalid transfer amount" });
  }

  if (currentUser.unityHours < amtNum) {
    return res.status(400).json({ error: "Insufficient Unity Hours buffer." });
  }

  if (toUserId === "solidarity") {
    // Donate to Solidarity Fund pot
    currentUser.unityHours -= amtNum;
    currentUser.hoursSpent += amtNum;
    
    transactions.unshift({
      id: `t-${transactions.length + 1}`,
      fromUser: currentUser.name,
      fromUserId: currentUser.id,
      toUser: "System (Solidarity Fund Pool)",
      toUserId: "solidarity",
      amount: amtNum,
      purpose: purpose || "Voluntary Solidarity Mutual-aid donation",
      date: new Date().toISOString()
    });

    return res.json({ success: true, balance: currentUser.unityHours });
  }

  // Peer to peer transfer
  const recipient = users.find(u => u.id === toUserId);
  if (!recipient) {
    return res.status(404).json({ error: "Recipient co-op member not found" });
  }

  if (recipient.id === currentUser.id) {
    return res.status(400).json({ error: "You cannot transfer credits to yourself" });
  }

  currentUser.unityHours -= amtNum;
  currentUser.hoursSpent += amtNum;
  recipient.unityHours += amtNum;
  recipient.hoursEarned += amtNum;

  transactions.unshift({
    id: `t-${transactions.length + 1}`,
    fromUser: currentUser.name,
    fromUserId: currentUser.id,
    toUser: recipient.name,
    toUserId: recipient.id,
    amount: amtNum,
    purpose: purpose || "P2P Co-op Tip / Shared Service Credit",
    date: new Date().toISOString()
  });

  // Notify recipient
  notifications.unshift({
    id: `n-${notifications.length + 1}`,
    userId: recipient.id,
    text: `You have received +${amtNum} UH from ${currentUser.name} for: "${purpose || 'Contribution tip'}"`,
    unread: true,
    date: new Date().toISOString().split('T')[0]
  });

  res.json({ success: true, balance: currentUser.unityHours });
});

// NGO/Sponsor Route: Allocate hours as Corporate Sponsor
app.post("/api/organizations/sponsor", (req, res) => {
  const { orgId, sponsorName, amount, targetTask } = req.body;
  const org = organizations.find(o => o.id === orgId);
  if (!org) return res.status(404).json({ error: "Organization node not found" });

  const creditAmt = parseFloat(amount);
  if (isNaN(creditAmt) || creditAmt <= 0) return res.status(400).json({ error: "Invalid sponsor credits amount" });

  org.hoursExchanged += creditAmt;
  org.activeSponsorships.push({
    id: `s-${org.activeSponsorships.length + 1}`,
    corporateSponsor: sponsorName || "Sovereigned Enterprise Partners",
    hoursContribution: creditAmt,
    target: targetTask || "All Services Boost"
  });

  res.json({ success: true, organization: org });
});

// Admin Route: Mutate claim status in Solidarity requests
app.post("/api/admin/resolve-fund", (req, res) => {
  const { requestId, status } = req.body; // status: approved, declined
  const request = solidarityRequests.find(r => r.id === requestId);
  if (!request) return res.status(404).json({ error: "Request node not found" });

  request.status = status;
  if (status === "approved") {
    request.hoursApproved = request.hoursRequested;
    // Credit requester
    const requester = users.find(u => u.id === request.requesterId);
    if (requester) {
      requester.unityHours += request.hoursRequested;
      requester.hoursEarned += request.hoursRequested;
      
      transactions.unshift({
        id: `t-${transactions.length + 1}`,
        fromUser: "System (Solidarity Fund)",
        fromUserId: "solidarity",
        toUser: requester.name,
        toUserId: requester.id,
        amount: request.hoursRequested,
        purpose: `Fund cleared: ${request.category}`,
        date: new Date().toISOString()
      });

      notifications.unshift({
        id: `n-${notifications.length + 1}`,
        userId: requester.id,
        text: `Victory! Your solidarity support request of ${request.hoursRequested} UH has been audited and approved!`,
        unread: true,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

  res.json({ success: true, request });
});

// Admin Route: Force simulate high activity count reset
app.post("/api/admin/reset", (req, res) => {
  // Re-seed state to simple defaults
  users[0].unityHours = 15.0;
  users[0].hoursEarned = 24.0;
  users[0].hoursSpent = 9.0;
  users[0].trustScore = 98;
  
  users[1].unityHours = 8.5;
  users[1].hoursEarned = 42.0;
  users[1].hoursSpent = 33.5;
  users[1].trustScore = 99;

  users[3].unityHours = 50.0;
  users[3].hoursEarned = 100.0;

  bookings = bookings.slice(0, 4);
  bookings.forEach(b => { if(b.id === 'b-3' || b.id === 'b-4') b.status = 'pending'; });
  
  solidarityRequests = solidarityRequests.slice(0, 2);
  solidarityRequests[1].status = 'pending';

  res.json({ success: true, message: "System state has been reset to defaults." });
});

// Forum Post Thread
app.post("/api/forum/post", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: "Missing title, content, or category classification." });
  }

  const newPost = {
    id: `f-${forumPosts.length + 1}`,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    title,
    content,
    category,
    likes: 0,
    commentsCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
    comments: []
  };

  forumPosts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

// Forum Add Comment
app.post("/api/forum/comment", (req, res) => {
  const currentUser = users[activeCurrentUserIndex];
  const { postId, content } = req.body;

  if (!postId || !content) {
    return res.status(400).json({ error: "Missing content filter criteria." });
  }

  const post = forumPosts.find(f => f.id === postId);
  if (!post) return res.status(404).json({ error: "Forum thread node not found" });

  const newComment = {
    author: currentUser.name,
    content,
    date: new Date().toISOString().split('T')[0]
  };

  post.comments.push(newComment);
  post.commentsCount = post.comments.length;

  res.json({ success: true, post });
});

// AI SKill Match Route utilizing Gemini 3.5-flash with proper error fallback
app.post("/api/ai-match", async (req, res) => {
  const { skillsOffered, skillsNeeded } = req.body;
  if (!skillsOffered || !skillsNeeded) {
    return res.status(400).json({ error: "Offerings and needs are required to formulate an intelligence match." });
  }

  // Create prompt listing current system listings and evaluating compatibility with offerings / needs
  const listingsSummary = skillListings.map(l => 
    `- [ID: ${l.id}] Title: "${l.title}" by ${l.providerName} (Category: ${l.category}, Cost: ${l.cost} UH). Info: ${l.description}`
  ).join("\n");

  const prompt = `You are the AI Matchmaker of "SkillShare Cooperative", a platform where people swap tools and advice using Time Credits called "Unity Hours".
Evaluate this member's profile parameters to find matches:
- Offerings (Skills they can teach/contribute): "${skillsOffered}"
- Needs (Skills they want to acquire/redeem): "${skillsNeeded}"

Below are the active listings currently posted in the cooperative marketplace:
${listingsSummary}

Analyze these parameters and output a JSON array of precisely three item objects describing optimal match strategies.
The JSON output must be a standard valid JSON object containing a property "matches" which is an array of objects. Each object should follow this schema:
{
  "matchedListingId": "the ID of the matched listing if relevant, else null",
  "matchType": "Provider Match" | "Borrower Match" | "Learning Path suggestion",
  "title": "Clear short match title (e.g. Spanish Conversational Exchange with Elena)",
  "compatibility": integer between 75 and 99 representing compatibility percentage,
  "justification": "Short, inspiring 2-sentence rationale of how their expertise bridges this gap",
  "suggestedStep": "Actionable next action step"
}

Format output strictly as clean JSON under "matches":[...] and nothing else. Just return the JSON object structure. Do not wrap in markdown markup ticks or conversational wrappers.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an analytical parser specializing in mutual economic synergy and peer co-operative matchmaking. Speak constructively, focusing on community solidarity."
        }
      });

      const responseText = response.text || "{}";
      const cleaned = responseText.replace(/```json/i, "").replace(/```/g, "").trim();
      const resultObj = JSON.parse(cleaned);
      return res.json({ success: true, source: "gemini", matches: resultObj.matches || resultObj });
    } catch (err: any) {
      console.error("Gemini Match error, generating heuristic matches:", err.message);
      // Fallback below
    }
  }

  // Pure state matching fallback logic if Gemini is offline or API key is absent
  console.log("Using heuristic local match solver.");
  const localMatched = [
    {
      matchedListingId: "l-1",
      matchType: "Learning Path suggestion",
      title: "React & TypeScript Mentorship with Marcus Chen",
      compatibility: 96,
      justification: `Since you represent an interest in coding ("${skillsNeeded}"), Marcus's Advanced program bridges development bottlenecks instantly.`,
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
      justification: `Your offered skills match high-level data security priorities within Alex's direct learning cohort pipeline.`,
      suggestedStep: "Propose an equivalent hour swap directly with the Platform Admin."
    }
  ];

  res.json({ success: true, source: "heuristic", matches: localMatched });
});

// Integrate Vite dev middleware OR static serving in production
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
  console.log("Vite development server middleware mounted.");
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  console.log(`Serving static production files from: ${distPath}`);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
