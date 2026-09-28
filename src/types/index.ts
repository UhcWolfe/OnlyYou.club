export type SupportedLanguage = "pl" | "en";

export type Language = "PL" | "EN";

export type CreatorStatus =
  | "ACTIVE"
  | "UNDER_REVIEW"
  | "SUSPENDED"
  | "BANNED"
  | "ARCHIVED";

export type PostStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REMOVED"
  | "UNDER_REVIEW";

export type StorageProvider = "LOCAL" | "S3" | "CLOUDFLARE_R2";

export type NotificationStatus = "QUEUED" | "DELIVERED" | "FAILED" | "DM_CLOSED";

export type ReportTargetType = "POST" | "CREATOR_HUB" | "USER";

export type ReportReason =
  | "ILLEGAL_CONTENT"
  | "NON_CONSENSUAL"
  | "COPYRIGHT"
  | "IMPERSONATION"
  | "SPAM"
  | "INAPPROPRIATE"
  | "OTHER";

export type ReportStatus = "PENDING" | "RESOLVED" | "REJECTED" | "ACTIONED";

export interface User {
  id: string;
  discordId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  language: Language;
  xp: number;
  level: number;
  warningsCount: number;
  isAdultVerified: boolean;
  adultVerifiedAt: string | null;
  isRestricted: boolean;
  restrictionReason: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: Creator | null;
  badges?: string[];
  role?: "USER" | "CREATOR" | "ADMIN";
  bannerUrl?: string | null;
  discordBannerUrl?: string | null;
  customBannerUrl?: string | null;
  bannerColor?: string | null;
  accessToken?: string;
  bio?: string | null;
  gender?: string | null;
  orientation?: string | null;
}

export interface CreatorHub {
  id: string;
  creatorId: string;
  channelId: string;
  channelName?: string;
  categoryId: string | null;
  panelMessageId: string | null;
  isPaused: boolean;
  notificationsEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Creator {
  id: string;
  userId: string;
  discordId: string;
  name: string;
  bio: string | null;
  category?: string;
  tags?: string[];
  gender?: string | null;
  orientation?: string | null;
  contentType: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  followerCount: number;
  postCount: number;
  totalViews: number;
  totalLikes: number;
  trendingScore: number;
  status: CreatorStatus;
  webConsent: boolean;
  webConsentAt: string | null;
  createdAt: string;
  updatedAt?: string;
  hub?: CreatorHub | null;
  user?: User | null;
  badges?: string[];
  _count?: {
    posts: number;
    followers: number;
  };
}

export interface VideoQuality {
  label: string; // e.g. "1080p", "720p", "480p", "360p", "240p", "144p"
  height: number;
  width: number;
  url: string;
  bitrate?: string;
}

export interface Media {
  id: string;
  postId: string;
  storageProvider: StorageProvider;
  storageKey: string;
  cdnUrl: string | null;
  originalFilename: string | null;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  duration?: number | null;
  thumbnailUrl: string | null;
  qualities?: VideoQuality[];
  transcodingStatus?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export interface Post {
  id: string;
  creatorId: string;
  creator: {
    id: string;
    name: string;
    avatarUrl: string | null;
    category: string;
    tags?: string[];
  };
  discordMessageId?: string | null;
  channelId: string;
  title?: string | null;
  caption: string | null;
  category: string | null;
  categories?: string[];
  tags: string[];
  views: number;
  likes: number;
  reportsCount: number;
  status: PostStatus;
  createdAt: string;
  updatedAt?: string;
  media: Media[];
  isLiked?: boolean;
  requiresAdultVerification?: boolean;
}

export interface Follow {
  id: string;
  userId: string;
  creatorId: string;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PlatformMetrics {
  totalUsers: number;
  totalCreators: number;
  totalHubs: number;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  updatedAt: string;
}

export interface AuthSession {
  user: User | null;
  isLoggedIn: boolean;
  token?: string;
}

export interface ReportCreateInput {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  postId?: string;
  reason: ReportReason;
  details?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporter?: User | null;
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
  postId?: string | null;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  actionTaken?: string | null;
  createdAt: string;
  updatedAt: string;
}

