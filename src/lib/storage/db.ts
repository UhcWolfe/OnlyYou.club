import { Creator, Post, Report, User, VideoQuality } from "@/types";

function getFs(): typeof import("fs") | null {
  if (typeof window !== "undefined") return null;
  try {
    return require("fs");
  } catch {
    return null;
  }
}

function getPath(): typeof import("path") | null {
  if (typeof window !== "undefined") return null;
  try {
    return require("path");
  } catch {
    return null;
  }
}

function getDataDir(): string {
  const p = getPath();
  return p ? p.join(process.cwd(), "data") : "/data";
}

function getFilePath(filename: string): string {
  const p = getPath();
  const dir = getDataDir();
  return p ? p.join(dir, filename) : `/data/${filename}`;
}

function ensureDataDir(): void {
  const fs = getFs();
  if (!fs) return;
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to ensure data dir:", err);
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  const fs = getFs();
  if (!fs) return fallback;
  try {
    ensureDataDir();
    const filePath = getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filename, fallback);
      return fallback;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    if (!content.trim()) return fallback;
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  const fs = getFs();
  if (!fs) return;
  try {
    ensureDataDir();
    const filePath = getFilePath(filename);
    const tempFile = `${filePath}.tmp_${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, filePath);
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    try {
      const filePath = getFilePath(filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch {}
  }
}

export const OFFICIAL_ONLYYOU_CREATOR: Creator = {
  id: "creator_onlyyou_official",
  userId: "user_onlyyou_official",
  discordId: "onlyyou_official",
  name: "OnlyYou | Club",
  bio: "Oficjalne konto platformy OnlyYou | Club. Najnowsze produkcje, zwiastuny i oficjalne materiały.",
  category: "Oficjalne",
  tags: ["official", "onlyyou", "creator", "admin"],
  gender: null,
  orientation: null,
  contentType: "Mixed",
  avatarUrl: "/logo.png",
  bannerUrl: "/logo.png",
  followerCount: 0,
  postCount: 0,
  totalViews: 0,
  totalLikes: 0,
  trendingScore: 1000,
  status: "ACTIVE",
  webConsent: true,
  webConsentAt: "2026-09-01T00:00:00.000Z",
  createdAt: "2026-09-01T00:00:00.000Z",
  badges: ["admin", "creator"],
  user: {
    id: "user_onlyyou_official",
    discordId: "onlyyou_official",
    username: "onlyyou",
    displayName: "OnlyYou | Club",
    avatarUrl: "/logo.png",
    language: "PL",
    xp: 10000,
    level: 100,
    warningsCount: 0,
    isAdultVerified: true,
    adultVerifiedAt: "2026-09-01T00:00:00.000Z",
    isRestricted: false,
    restrictionReason: null,
    role: "ADMIN",
    badges: ["admin", "creator"],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
};

export const db = {
  // === POSTS ===
  getPosts(): Post[] {
    return readJsonFile<Post[]>("posts.json", []);
  },

  getCreatorPosts(creatorId: string): Post[] {
    const posts = this.getPosts();
    const cleanId = creatorId.toLowerCase().replace(/^(creator_)/, "").replace(/[\s_]+/g, "");
    const isOfficialQuery = cleanId === "onlyyou" || cleanId === "onlyyouclub" || cleanId === "onlyyouofficial";
    return posts.filter((p) => {
      if (p.status !== "APPROVED") return false;
      if (p.creatorId === creatorId || p.creator?.id === creatorId) return true;
      if (isOfficialQuery && (p.creatorId === "creator_onlyyou_official" || p.creator?.id === "creator_onlyyou_official")) return true;
      const pCleanCreatorId = (p.creatorId || "").toLowerCase().replace(/^(creator_)/, "").replace(/[\s_]+/g, "");
      const pCleanName = (p.creator?.name || "").toLowerCase().replace(/[\s_]+/g, "");
      return (
        (pCleanCreatorId && pCleanCreatorId === cleanId) ||
        (pCleanName && pCleanName === cleanId) ||
        (p.creator?.id && p.creator.id.toLowerCase().replace(/^(creator_)/, "") === cleanId)
      );
    });
  },

  getPostById(id: string): Post | null {
    const posts = this.getPosts();
    return posts.find((p) => p.id === id) || null;
  },

  savePost(post: Post): Post {
    const posts = this.getPosts();
    const existingIndex = posts.findIndex((p) => p.id === post.id);
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.unshift(post);
    }
    writeJsonFile("posts.json", posts);

    // Sync or create real creator profile in creators.json
    if (post.creatorId || post.creator?.name) {
      const creators = this.getCreators();
      const existingCreator = creators.find(
        (c) =>
          (post.creatorId && (c.id === post.creatorId || c.userId === post.creatorId || c.id === `creator_${post.creatorId}`)) ||
          (post.creator?.name && c.name.toLowerCase() === post.creator.name.toLowerCase())
      );

      const targetCreatorId = post.creatorId || (existingCreator ? existingCreator.id : "");
      const creatorPosts = this.getCreatorPosts(targetCreatorId);
      const creatorPostsCount = Math.max(creatorPosts.length, 1);
      const totalViews = creatorPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
      const totalLikes = creatorPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);

      if (existingCreator) {
        existingCreator.name = post.creator?.name || existingCreator.name;
        if (post.creator?.avatarUrl) {
          existingCreator.avatarUrl = post.creator.avatarUrl;
        }
        existingCreator.postCount = creatorPostsCount;
        existingCreator.totalViews = Math.max(existingCreator.totalViews || 0, totalViews);
        existingCreator.totalLikes = Math.max(existingCreator.totalLikes || 0, totalLikes);
        this.saveCreator(existingCreator);
      } else if (post.creator) {
        const newCreator: Creator = {
          id: post.creatorId || `creator_${Date.now()}`,
          userId: post.creatorId?.replace(/^creator_/, "") || `user_${Date.now()}`,
          discordId: post.creatorId?.replace(/^creator_/, "") || "",
          name: post.creator.name,
          bio: null,
          category: post.category || "Ogólne",
          tags: post.tags || [],
          contentType: "Mixed",
          avatarUrl: post.creator.avatarUrl || null,
          bannerUrl: null,
          followerCount: 0,
          postCount: creatorPostsCount,
          totalViews: totalViews,
          totalLikes: totalLikes,
          trendingScore: 100,
          status: "ACTIVE",
          webConsent: true,
          webConsentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          badges: ["creator"],
        };
        this.saveCreator(newCreator);
      }
    }

    return post;
  },

  deletePost(id: string): boolean {
    const posts = this.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    if (filtered.length !== posts.length) {
      writeJsonFile("posts.json", filtered);
      return true;
    }
    return false;
  },

  toggleLikePost(postId: string, userId?: string): { liked: boolean; likes: number } {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return { liked: false, likes: 0 };

    post.likes = (post.likes || 0) + 1;
    writeJsonFile("posts.json", posts);
    return { liked: true, likes: post.likes };
  },

  updatePostMediaQualities(postId: string, qualities: VideoQuality[]): void {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (post && post.media && post.media.length > 0) {
      post.media[0].qualities = qualities;
      post.media[0].transcodingStatus = "COMPLETED";
      writeJsonFile("posts.json", posts);
    }
  },

  updatePostQualitiesByUrl(videoUrl: string, qualities: VideoQuality[]): void {
    const posts = this.getPosts();
    let updated = false;
    for (const post of posts) {
      if (post.media) {
        for (const m of post.media) {
          if (m.cdnUrl === videoUrl) {
            m.qualities = qualities;
            m.transcodingStatus = "COMPLETED";
            updated = true;
          }
        }
      }
    }
    if (updated) {
      writeJsonFile("posts.json", posts);
    }
  },

  // === CREATORS ===
  getCreators(): Creator[] {
    let creators = readJsonFile<Creator[]>("creators.json", []);

    // Clean up any legacy dummy "Wolfe" placeholder without avatar
    const beforeCount = creators.length;
    creators = creators.filter((c) => !(c.name === "Wolfe" && !c.avatarUrl));
    if (creators.length !== beforeCount) {
      writeJsonFile("creators.json", creators);
    }

    const officialPosts = this.getCreatorPosts("creator_onlyyou_official");
    const officialViews = officialPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
    const officialLikes = officialPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
    const officialCreator: Creator = {
      ...OFFICIAL_ONLYYOU_CREATOR,
      postCount: officialPosts.length,
      totalViews: officialViews,
      totalLikes: officialLikes,
    };

    if (!creators.some((c) => c.id === "creator_onlyyou_official")) {
      creators.unshift(officialCreator);
    } else {
      const idx = creators.findIndex((c) => c.id === "creator_onlyyou_official");
      creators[idx] = {
        ...officialCreator,
        ...creators[idx],
        postCount: officialPosts.length,
        totalViews: Math.max(creators[idx].totalViews || 0, officialViews),
        totalLikes: Math.max(creators[idx].totalLikes || 0, officialLikes),
      };
    }

    return creators;
  },

  deleteCreator(identifier: string): boolean {
    const cleanId = identifier.toLowerCase().replace(/^(creator_)/, "");
    if (identifier === "creator_onlyyou_official" || cleanId === "onlyyouofficial" || cleanId === "onlyyou") {
      return false;
    }
    const creators = this.getCreators();
    const filtered = creators.filter(
      (c) =>
        c.id !== identifier &&
        c.userId !== identifier &&
        c.discordId !== identifier &&
        c.id.replace(/^(creator_)/, "").toLowerCase() !== cleanId &&
        (c.userId ? c.userId.toLowerCase() !== cleanId : true) &&
        (c.discordId ? c.discordId.toLowerCase() !== cleanId : true)
    );
    if (filtered.length !== creators.length) {
      writeJsonFile("creators.json", filtered);
      return true;
    }
    return false;
  },

  getCreatorByIdOrUsername(identifier: string): Creator | null {
    const clean = identifier.toLowerCase().replace(/[\s_]+/g, "");
    if (
      clean === "onlyyou" ||
      clean === "onlyyouclub" ||
      clean === "onlyyouofficial" ||
      identifier === "creator_onlyyou_official" ||
      identifier === "user_onlyyou_official"
    ) {
      const officialPosts = this.getCreatorPosts("creator_onlyyou_official");
      const calculatedViews = officialPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
      const calculatedLikes = officialPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
      return {
        ...OFFICIAL_ONLYYOU_CREATOR,
        postCount: officialPosts.length,
        totalViews: calculatedViews,
        totalLikes: calculatedLikes,
      };
    }

    const creators = this.getCreators();
    let creator = creators.find(
      (c) =>
        c.id === identifier ||
        c.userId === identifier ||
        c.discordId === identifier ||
        c.name.toLowerCase().replace(/[\s_]+/g, "") === clean ||
        (c.user?.username && c.user.username.toLowerCase().replace(/[\s_]+/g, "") === clean)
    );

    const users = this.getUsers();
    const matchingUser = users.find(
      (u) =>
        u.id === identifier ||
        u.discordId === identifier ||
        u.username.toLowerCase().replace(/[\s_]+/g, "") === clean ||
        (u.displayName && u.displayName.toLowerCase().replace(/[\s_]+/g, "") === clean) ||
        (creator && (u.id === creator.userId || u.discordId === creator.discordId || (creator.id && creator.id.includes(u.id))))
    );

    const posts = this.getPosts();

    if (!creator && matchingUser && (matchingUser.creator || matchingUser.role === "ADMIN" || matchingUser.id === "1003433567155671183")) {
      const creatorPosts = this.getCreatorPosts(matchingUser.id);
      const calculatedViews = creatorPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
      const calculatedLikes = creatorPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
      const userBadges = Array.isArray(matchingUser.badges) ? matchingUser.badges : (matchingUser.role === "ADMIN" ? ["admin"] : []);
      creator = {
        id: matchingUser.creator?.id || `creator_${matchingUser.id}`,
        userId: matchingUser.id,
        discordId: matchingUser.discordId,
        name: matchingUser.displayName || matchingUser.username,
        bio: matchingUser.bio || matchingUser.creator?.bio || (matchingUser.role === "ADMIN" ? "Administrator OnlyYou" : "Użytkownik OnlyYou"),
        category: matchingUser.creator?.category || "Ogólne",
        tags: (matchingUser.creator?.tags || ["official", "admin"]).filter((t) => t !== "creator" || userBadges.includes("creator")),
        gender: matchingUser.creator?.gender || matchingUser.gender || null,
        orientation: matchingUser.creator?.orientation || matchingUser.orientation || null,
        contentType: "Mixed",
        avatarUrl: matchingUser.avatarUrl,
        bannerUrl:
          matchingUser.customBannerUrl ||
          matchingUser.creator?.bannerUrl ||
          matchingUser.bannerUrl ||
          matchingUser.discordBannerUrl ||
          null,
        followerCount: matchingUser.creator?.followerCount || 0,
        postCount: creatorPosts.length,
        totalViews: Math.max(matchingUser.creator?.totalViews || 0, calculatedViews),
        totalLikes: Math.max(matchingUser.creator?.totalLikes || 0, calculatedLikes),
        trendingScore: 100,
        status: "ACTIVE",
        webConsent: true,
        webConsentAt: matchingUser.createdAt,
        createdAt: matchingUser.createdAt,
        badges: userBadges,
        user: matchingUser,
      };
      // Do not save to creators.json here to avoid re-granting creator status to non-creators
    } else if (!creator && (clean === "uhcwolfe" || identifier === "1003433567155671183" || identifier.includes("1003433567155671183"))) {
      const creatorPosts = this.getCreatorPosts("1003433567155671183");
      const calculatedViews = creatorPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
      const calculatedLikes = creatorPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
      const ownerBadges = matchingUser && Array.isArray(matchingUser.badges)
        ? matchingUser.badges
        : ["admin"];
      creator = {
        id: "creator_1003433567155671183",
        userId: "1003433567155671183",
        discordId: "1003433567155671183",
        name: "UhcWolfe",
        bio: "Administrator OnlyYou",
        category: "Ogólne",
        tags: ["official", "admin"],
        gender: "Mężczyzna",
        orientation: "Biseksualna",
        contentType: "Mixed",
        avatarUrl: null,
        bannerUrl: null,
        followerCount: 0,
        postCount: creatorPosts.length,
        totalViews: calculatedViews,
        totalLikes: calculatedLikes,
        trendingScore: 100,
        status: "ACTIVE",
        webConsent: true,
        webConsentAt: new Date().toISOString(),
        createdAt: "2026-09-09T00:00:00.000Z",
        badges: ownerBadges,
        user: matchingUser || undefined,
      };
      // Do not save to creators.json here
    } else if (creator && matchingUser) {
      const creatorPosts = this.getCreatorPosts(creator.id || matchingUser.id);
      const calculatedViews = creatorPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
      const calculatedLikes = creatorPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
      creator = {
        ...creator,
        name: matchingUser.displayName || matchingUser.username || creator.name,
        avatarUrl: matchingUser.avatarUrl || creator.avatarUrl,
        bannerUrl:
          matchingUser.customBannerUrl ||
          matchingUser.creator?.bannerUrl ||
          matchingUser.bannerUrl ||
          matchingUser.discordBannerUrl ||
          creator.bannerUrl,
        bio: matchingUser.bio || matchingUser.creator?.bio || creator.bio,
        gender: matchingUser.creator?.gender || matchingUser.gender || creator.gender,
        orientation: matchingUser.creator?.orientation || matchingUser.orientation || creator.orientation,
        badges: matchingUser.badges !== undefined ? matchingUser.badges : creator.badges,
        postCount: creatorPosts.length,
        totalViews: Math.max(creator.totalViews || 0, matchingUser.creator?.totalViews || 0, calculatedViews),
        totalLikes: Math.max(creator.totalLikes || 0, matchingUser.creator?.totalLikes || 0, calculatedLikes),
        user: matchingUser,
      };
    } else if (creator) {
      const creatorPosts = this.getCreatorPosts(creator.id);
      const calculatedViews = creatorPosts.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
      const calculatedLikes = creatorPosts.reduce((sum, p) => sum + (Number(p.likes) || 0), 0);
      creator = {
        ...creator,
        postCount: creatorPosts.length,
        totalViews: Math.max(creator.totalViews || 0, calculatedViews),
        totalLikes: Math.max(creator.totalLikes || 0, calculatedLikes),
      };
    }

    return creator || null;
  },

  saveCreator(creator: Creator): Creator {
    const creators = this.getCreators();
    const existingIndex = creators.findIndex(
      (c) => c.id === creator.id || (c.userId && creator.userId && c.userId === creator.userId)
    );
    if (existingIndex >= 0) {
      creators[existingIndex] = {
        ...creators[existingIndex],
        ...creator,
        updatedAt: new Date().toISOString(),
      };
    } else {
      creators.push(creator);
    }
    writeJsonFile("creators.json", creators);
    return creator;
  },

  // === USERS ===
  getUsers(): User[] {
    return readJsonFile<User[]>("users.json", []);
  },

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.id === id || u.discordId === id) || null;
  },

  saveUser(user: User): User {
    const users = this.getUsers();
    const existingIndex = users.findIndex(
      (u) => u.id === user.id || (u.discordId && user.discordId && u.discordId === user.discordId)
    );
    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...users[existingIndex],
        ...user,
        updatedAt: new Date().toISOString(),
      };
    } else {
      users.push(user);
    }
    writeJsonFile("users.json", users);

    // If user has creator object and has creator badge, sync it into creators.json as well
    if (user.creator && (user.badges || []).includes("creator")) {
      this.saveCreator({
        ...user.creator,
        userId: user.id,
        discordId: user.discordId,
      });
    }

    return user;
  },

  updateCreatorStatus(creatorId: string, status: "ACTIVE" | "UNDER_REVIEW" | "BANNED"): Creator | null {
    const creators = this.getCreators();
    const cleanId = creatorId.toLowerCase().replace(/^(creator_)/, "");
    const creator = creators.find(
      (c) =>
        c.id === creatorId ||
        c.userId === creatorId ||
        (c.id && c.id.replace(/^(creator_)/, "") === cleanId) ||
        (c.userId && c.userId === cleanId)
    );

    if (!creator) return null;

    creator.status = status;
    if (status === "ACTIVE") {
      creator.webConsent = true;
      creator.badges = Array.from(new Set([...(creator.badges || []), "creator"]));
    } else if (status === "BANNED") {
      creator.webConsent = false;
    }
    creator.updatedAt = new Date().toISOString();
    this.saveCreator(creator);

    // Also update corresponding user
    const users = this.getUsers();
    const user = users.find(
      (u) =>
        u.id === creator.userId ||
        u.discordId === creator.discordId ||
        u.id === cleanId ||
        u.discordId === cleanId
    );
    if (user) {
      if (status === "ACTIVE") {
        user.badges = Array.from(new Set([...(user.badges || []), "creator"]));
        user.isRestricted = false;
        if (user.creator) {
          user.creator.status = "ACTIVE";
          user.creator.webConsent = true;
        }
      } else if (status === "BANNED") {
        user.isRestricted = true;
        user.restrictionReason = "Zablokowany przez administratora";
        if (user.creator) {
          user.creator.status = "BANNED";
          user.creator.webConsent = false;
        }
      }
      this.saveUser(user);
    }

    return creator;
  },

  toggleUserBadge(userId: string, badgeId: string): User | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId || u.discordId === userId);
    if (!user) return null;

    const currentBadges = user.badges || [];
    const hasBadge = currentBadges.includes(badgeId);
    const updatedBadges = hasBadge
      ? currentBadges.filter((b) => b !== badgeId)
      : [...currentBadges, badgeId];

    user.badges = updatedBadges;
    if (updatedBadges.includes("admin")) {
      user.role = "ADMIN";
    } else if (updatedBadges.includes("creator")) {
      user.role = "CREATOR";
    } else {
      user.role = "USER";
    }

    if (!updatedBadges.includes("creator")) {
      user.creator = undefined;
      this.deleteCreator(user.id);
      this.deleteCreator(`creator_${user.id}`);
      if (user.discordId) {
        this.deleteCreator(user.discordId);
        this.deleteCreator(`creator_${user.discordId}`);
      }
    } else {
      // If creator badge granted, sync/create creator profile
      const creators = this.getCreators();
      const cleanUId = user.id.toLowerCase().replace(/^(creator_)/, "");
      let matchedCreator = false;
      for (const c of creators) {
        if (
          c.userId === user.id ||
          c.discordId === user.discordId ||
          c.id === user.id ||
          c.id === `creator_${user.id}` ||
          (c.id && c.id.replace(/^(creator_)/, "") === cleanUId) ||
          (c.userId && c.userId.replace(/^(creator_)/, "") === cleanUId)
        ) {
          c.badges = updatedBadges;
          c.user = user;
          c.status = "ACTIVE";
          c.webConsent = true;
          this.saveCreator(c);
          matchedCreator = true;
        }
      }

      if (!matchedCreator) {
      const newCreator: Creator = {
        id: `creator_${user.id}`,
        userId: user.id,
        discordId: user.discordId,
        name: user.displayName || user.username,
        bio: user.bio || "",
        category: "Ogólne",
        tags: ["creator"],
        gender: user.gender || null,
        orientation: user.orientation || null,
        contentType: "Mixed",
        avatarUrl: user.avatarUrl,
        bannerUrl: user.customBannerUrl || user.bannerUrl || null,
        followerCount: 0,
        postCount: this.getCreatorPosts(user.id).length,
        totalViews: 0,
        totalLikes: 0,
        trendingScore: 100,
        status: "ACTIVE",
        webConsent: true,
        webConsentAt: new Date().toISOString(),
        createdAt: user.createdAt,
        badges: updatedBadges,
      };
      this.saveCreator(newCreator);
      user.creator = newCreator;
      }
    }

    this.saveUser(user);
    return user;
  },

  // === REPORTS ===
  getReports(): Report[] {
    return readJsonFile<Report[]>("reports.json", []);
  },

  getReportById(id: string): Report | null {
    const reports = this.getReports();
    return reports.find((r) => r.id === id) || null;
  },

  saveReport(report: Report): Report {
    const reports = this.getReports();
    const existingIndex = reports.findIndex((r) => r.id === report.id);
    if (existingIndex >= 0) {
      reports[existingIndex] = {
        ...reports[existingIndex],
        ...report,
        updatedAt: new Date().toISOString(),
      };
    } else {
      reports.unshift(report);
    }
    writeJsonFile("reports.json", reports);
    return report;
  },

  updateReportStatus(
    reportId: string,
    status: Report["status"],
    actionTaken?: string
  ): Report | null {
    const reports = this.getReports();
    const report = reports.find((r) => r.id === reportId);
    if (!report) return null;

    report.status = status;
    report.actionTaken =
      actionTaken || (status === "ACTIONED" ? "Zastosowano karę / usunięto treść" : "Rozpatrzono");
    report.updatedAt = new Date().toISOString();
    writeJsonFile("reports.json", reports);
    return report;
  },

  // === VISITORS & ANALYTICS ===
  getVisitors(): string[] {
    return readJsonFile<string[]>("visitors.json", []);
  },

  recordUniqueVisitor(visitorId: string): { totalUniqueVisitors: number; isNew: boolean } {
    if (!visitorId || typeof visitorId !== "string") {
      const visitors = this.getVisitors();
      return { totalUniqueVisitors: visitors.length, isNew: false };
    }

    const visitors = this.getVisitors();
    const cleanId = visitorId.trim();

    if (!visitors.includes(cleanId)) {
      visitors.push(cleanId);
      writeJsonFile("visitors.json", visitors);
      return { totalUniqueVisitors: visitors.length, isNew: true };
    }

    return { totalUniqueVisitors: visitors.length, isNew: false };
  },

  getGlobalStats(): {
    uniqueVisitorsCount: number;
    registeredUsersCount: number;
    creatorsCount: number;
    videosCount: number;
    totalPostsCount: number;
    photosCount: number;
    totalViews: number;
    totalLikes: number;
  } {
    const visitors = this.getVisitors();
    const users = this.getUsers();
    const creators = this.getCreators().filter(
      (c) => (c.badges || []).includes("creator") || (c.user?.badges || []).includes("creator") || c.status === "ACTIVE"
    );
    const posts = this.getPosts();

    let videosCount = 0;
    let photosCount = 0;
    let totalViews = 0;
    let totalLikes = 0;

    for (const post of posts) {
      totalViews += Number(post.views) || 0;
      totalLikes += Number(post.likes) || 0;

      let isVideo = false;
      if (post.media && post.media.length > 0) {
        for (const m of post.media) {
          if (
            m.mimeType?.startsWith("video/") ||
            (m.originalFilename && /\.(mp4|mov|avi|webm|mkv)$/i.test(m.originalFilename)) ||
            (m.cdnUrl && /\.(mp4|mov|avi|webm|mkv)$/i.test(m.cdnUrl)) ||
            (m.qualities && m.qualities.length > 0)
          ) {
            isVideo = true;
            break;
          }
        }
      }
      if (isVideo) {
        videosCount++;
      } else {
        photosCount++;
      }
    }

    return {
      uniqueVisitorsCount: visitors.length,
      registeredUsersCount: users.length,
      creatorsCount: creators.length,
      videosCount,
      totalPostsCount: posts.length,
      photosCount,
      totalViews,
      totalLikes,
    };
  },
};
