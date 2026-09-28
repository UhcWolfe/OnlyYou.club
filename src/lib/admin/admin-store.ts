import { Creator, Report, User } from "@/types";

export interface AdminUserItem {
  id: string;
  discordId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  badges: string[];
  role: "USER" | "CREATOR" | "ADMIN";
  isCreator: boolean;
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
  createdAt: string;
}

export interface AdminGlobalStats {
  uniqueVisitorsCount: number;
  registeredUsersCount: number;
  creatorsCount: number;
  videosCount: number;
  totalPostsCount: number;
  photosCount: number;
  totalViews: number;
  totalLikes: number;
}

const STORAGE_KEY_CREATORS = "onlyyou_admin_creators";
const STORAGE_KEY_REPORTS = "onlyyou_admin_reports";
const STORAGE_KEY_USERS = "onlyyou_admin_users";
const STORAGE_KEY_STATS = "onlyyou_admin_stats";

const INITIAL_ADMIN_USERS: AdminUserItem[] = [];
const INITIAL_ADMIN_CREATORS: Creator[] = [];
const INITIAL_ADMIN_REPORTS: Report[] = [];
const INITIAL_ADMIN_STATS: AdminGlobalStats = {
  uniqueVisitorsCount: 0,
  registeredUsersCount: 0,
  creatorsCount: 0,
  videosCount: 0,
  totalPostsCount: 0,
  photosCount: 0,
  totalViews: 0,
  totalLikes: 0,
};

export class AdminStore {
  // --- SYNC LOCAL CACHE ACCESSORS ---
  public static getCreators(): Creator[] {
    if (typeof window === "undefined") return INITIAL_ADMIN_CREATORS;
    const stored = localStorage.getItem(STORAGE_KEY_CREATORS);
    if (!stored) return INITIAL_ADMIN_CREATORS;
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : INITIAL_ADMIN_CREATORS;
    } catch {
      return INITIAL_ADMIN_CREATORS;
    }
  }

  public static saveCreators(creators: Creator[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(creators));
  }

  public static getUsers(): AdminUserItem[] {
    if (typeof window === "undefined") return INITIAL_ADMIN_USERS;
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (!stored) return INITIAL_ADMIN_USERS;
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  }

  public static saveUsers(users: AdminUserItem[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  public static getReports(): Report[] {
    if (typeof window === "undefined") return INITIAL_ADMIN_REPORTS;
    const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!stored) return INITIAL_ADMIN_REPORTS;
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : INITIAL_ADMIN_REPORTS;
    } catch {
      return INITIAL_ADMIN_REPORTS;
    }
  }

  public static saveReports(reports: Report[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  }

  public static getStats(): AdminGlobalStats {
    if (typeof window === "undefined") return INITIAL_ADMIN_STATS;
    const stored = localStorage.getItem(STORAGE_KEY_STATS);
    if (!stored) return INITIAL_ADMIN_STATS;
    try {
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? { ...INITIAL_ADMIN_STATS, ...parsed } : INITIAL_ADMIN_STATS;
    } catch {
      return INITIAL_ADMIN_STATS;
    }
  }

  public static saveStats(stats: AdminGlobalStats): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }

  // --- ASYNC API METHODS CONNECTED TO BACKEND ---
  public static async fetchAll(): Promise<{
    creators: Creator[];
    users: AdminUserItem[];
    reports: Report[];
    stats: AdminGlobalStats;
  }> {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const json = await res.json();
        const creators: Creator[] = json.creators || [];
        const users: AdminUserItem[] = json.users || [];
        const reports: Report[] = json.reports || [];
        const stats: AdminGlobalStats = json.stats || this.getStats();

        this.saveCreators(creators);
        this.saveUsers(users);
        this.saveReports(reports);
        this.saveStats(stats);

        return { creators, users, reports, stats };
      }
    } catch (err) {
      console.error("AdminStore.fetchAll failed:", err);
    }

    return {
      creators: this.getCreators(),
      users: this.getUsers(),
      reports: this.getReports(),
      stats: this.getStats(),
    };
  }

  public static async verifyCreator(creatorId: string): Promise<{
    creators: Creator[];
    users: AdminUserItem[];
  }> {
    try {
      const res = await fetch("/api/admin/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", creatorId }),
      });
      if (res.ok) {
        const json = await res.json();
        const creators: Creator[] = json.creators || [];
        const users: AdminUserItem[] = json.users || [];
        this.saveCreators(creators);
        this.saveUsers(users);
        return { creators, users };
      }
    } catch (err) {
      console.error("verifyCreator failed:", err);
    }

    // Fallback locally
    const creators = this.getCreators().map((c) => {
      if (c.id === creatorId) {
        return {
          ...c,
          status: "ACTIVE" as const,
          webConsent: true,
          webConsentAt: new Date().toISOString(),
          badges: Array.from(new Set([...(c.badges || []), "creator"])),
        };
      }
      return c;
    });
    this.saveCreators(creators);
    return { creators, users: this.getUsers() };
  }

  public static async banCreator(
    creatorId: string,
    reason?: string
  ): Promise<{
    creators: Creator[];
    users: AdminUserItem[];
  }> {
    try {
      const res = await fetch("/api/admin/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ban", creatorId, reason }),
      });
      if (res.ok) {
        const json = await res.json();
        const creators: Creator[] = json.creators || [];
        const users: AdminUserItem[] = json.users || [];
        this.saveCreators(creators);
        this.saveUsers(users);
        return { creators, users };
      }
    } catch (err) {
      console.error("banCreator failed:", err);
    }

    const creators = this.getCreators().map((c) => {
      if (c.id === creatorId) {
        return { ...c, status: "BANNED" as const, webConsent: false };
      }
      return c;
    });
    this.saveCreators(creators);
    return { creators, users: this.getUsers() };
  }

  public static async unbanCreator(creatorId: string): Promise<{
    creators: Creator[];
    users: AdminUserItem[];
  }> {
    try {
      const res = await fetch("/api/admin/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unban", creatorId }),
      });
      if (res.ok) {
        const json = await res.json();
        const creators: Creator[] = json.creators || [];
        const users: AdminUserItem[] = json.users || [];
        this.saveCreators(creators);
        this.saveUsers(users);
        return { creators, users };
      }
    } catch (err) {
      console.error("unbanCreator failed:", err);
    }

    const creators = this.getCreators().map((c) => {
      if (c.id === creatorId) {
        return { ...c, status: "ACTIVE" as const, webConsent: true };
      }
      return c;
    });
    this.saveCreators(creators);
    return { creators, users: this.getUsers() };
  }

  public static async toggleBadge(
    userId: string,
    badgeId: string
  ): Promise<{
    users: AdminUserItem[];
    creators: Creator[];
  }> {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, badgeId }),
      });
      if (res.ok) {
        const json = await res.json();
        const users: AdminUserItem[] = json.users || [];
        const creators: Creator[] = json.creators || [];
        this.saveUsers(users);
        this.saveCreators(creators);
        return { users, creators };
      }
    } catch (err) {
      console.error("toggleBadge failed:", err);
    }

    const users = this.getUsers().map((u) => {
      if (u.id === userId) {
        const currentBadges = u.badges || [];
        const has = currentBadges.includes(badgeId);
        const updatedBadges = has ? currentBadges.filter((b) => b !== badgeId) : [...currentBadges, badgeId];
        return { ...u, badges: updatedBadges };
      }
      return u;
    });
    this.saveUsers(users);
    const creators = this.getCreators().map((c) => {
      if (c.userId === userId || c.id === userId || c.discordId === userId) {
        const currentBadges = c.badges || [];
        const has = currentBadges.includes(badgeId);
        const updatedBadges = has ? currentBadges.filter((b) => b !== badgeId) : [...currentBadges, badgeId];
        return {
          ...c,
          badges: updatedBadges,
          status: updatedBadges.includes("creator") ? ("ACTIVE" as const) : ("UNDER_REVIEW" as const),
        };
      }
      return c;
    });
    this.saveCreators(creators);
    return { users, creators };
  }

  public static async updateReportStatus(
    reportId: string,
    action: "RESOLVED" | "REJECTED" | "ACTIONED",
    actionDesc?: string
  ): Promise<Report[]> {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action, actionDesc }),
      });
      if (res.ok) {
        const json = await res.json();
        const reports: Report[] = json.reports || [];
        this.saveReports(reports);
        return reports;
      }
    } catch (err) {
      console.error("updateReportStatus failed:", err);
    }

    const reports = this.getReports().map((r) => {
      if (r.id === reportId) {
        return {
          ...r,
          status: action,
          actionTaken: actionDesc || (action === "ACTIONED" ? "Zastosowano karę" : "Rozpatrzono"),
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    this.saveReports(reports);
    return reports;
  }
}
