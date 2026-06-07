export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Member, Mentor, Organization Admin, Platform Admin
  unityHours: number;
  hoursEarned: number;
  hoursSpent: number;
  trustScore: number;
  verificationLevel: string; // Basic, Verified, Community Leader, Institution Verified
  avatar: string;
  skills: string[];
  needs: string[];
  joinedAt: string;
  badges: string[];
  organizationName?: string;
}

export interface Review {
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SkillListing {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerTrustScore: number;
  providerBadge: string;
  title: string;
  description: string;
  category: string;
  skillLevel: string;
  availability: string;
  cost: number;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  borrowerId: string;
  borrowerName: string;
  hours: number;
  status: string; // pending, completed, cancelled
  scheduledDate: string;
  scheduledTime: string;
  completedAt?: string;
  feedback?: string;
}

export interface Transaction {
  id: string;
  fromUser: string;
  fromUserId: string;
  toUser: string;
  toUserId: string;
  amount: number;
  purpose: string;
  date: string;
}

export interface SolidarityRequest {
  id: string;
  requesterName: string;
  requesterId: string;
  category: string;
  details: string;
  hoursRequested: number;
  hoursApproved: number;
  status: string; // pending, approved, declined
  urgency: string; // Low, Medium, High
  createdAt: string;
}

export interface OrgSponsorship {
  id: string;
  corporateSponsor: string;
  hoursContribution: number;
  target: string;
}

export interface Organization {
  id: string;
  name: string;
  adminId: string;
  membersCount: number;
  hoursExchanged: number;
  participationRate: number;
  healthScore: number;
  type: string;
  description: string;
  activeSponsorships: OrgSponsorship[];
}

export interface Comment {
  author: string;
  content: string;
  date: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  comments: Comment[];
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  unread: boolean;
  date: string;
}

export interface AiMatch {
  matchedListingId: string | null;
  matchType: string;
  title: string;
  compatibility: number;
  justification: string;
  suggestedStep: string;
}
