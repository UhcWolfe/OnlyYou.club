"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { hasAdminBadge } from "@/config/badges";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  isAdultVerified: boolean;
  followingIds: string[];
  likedPostIds: string[];
  notificationSettings: Record<string, boolean>;
  loginWithDiscord: () => void;
  logout: () => void;
  verifyAge: () => void;
  toggleFollow: (creatorId: string) => void;
  toggleLike: (postId: string) => void;
  toggleNotifications: (creatorId: string) => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 1. Immediately read client-side cookie to prevent flash of logged-out state
    try {
      const match = document.cookie.match(/(?:^|;\s*)onlyyou_session=([^;]+)/);
      if (match && match[1]) {
        let raw = match[1];
        if (raw.startsWith("%7B") || raw.includes("%22") || raw.includes("%")) {
          try {
            raw = decodeURIComponent(raw);
          } catch {}
        }
        const cachedUser = JSON.parse(raw);
        if (cachedUser && (cachedUser.id || cachedUser.discordId)) {
          setUser((prev) => prev || cachedUser);
        }
      }
    } catch {}

    // 2. Fetch authoritative session from /api/auth/me
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const isLoggedIn = !!user;
  const isCreator = Boolean(user?.badges && user.badges.includes("creator"));
  const isAdmin = (user?.badges && user.badges.includes("admin")) || user?.role === "ADMIN" || hasAdminBadge(user);
  const isAdultVerified = true;

  const loginWithDiscord = () => {
    // Real Discord OAuth2 flow redirect
    window.location.href = "/api/auth/discord";
  };

  const logout = () => {
    setUser(null);
    window.location.href = "/api/auth/logout";
  };

  const verifyAge = () => {
    if (user) {
      const updated = {
        ...user,
        isAdultVerified: true,
        adultVerifiedAt: new Date().toISOString(),
      };
      setUser(updated);

      if (typeof document !== "undefined") {
        const cookieData = {
          id: updated.id,
          discordId: updated.discordId || updated.id,
          username: updated.username,
          displayName: updated.displayName,
          avatarUrl: updated.avatarUrl,
          role: updated.role,
          badges: updated.badges,
        };
        const host = window.location.hostname;
        const domainAttr = host.includes("onlyyouhub.com")
          ? "; domain=.onlyyouhub.com"
          : host.includes("onlyyou.club")
          ? "; domain=.onlyyou.club"
          : "";
        document.cookie = `onlyyou_session=${encodeURIComponent(JSON.stringify(cookieData))}; path=/${domainAttr}; max-age=2592000; SameSite=Lax`;
      }
    }
  };

  const toggleFollow = (creatorId: string) => {
    setFollowingIds((prev) =>
      prev.includes(creatorId) ? prev.filter((id) => id !== creatorId) : [...prev, creatorId]
    );
  };

  const toggleLike = (postId: string) => {
    setLikedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleNotifications = (creatorId: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId],
    }));
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;

    let mergedCreator = user.creator;
    if (updatedFields.creator !== undefined) {
      if (updatedFields.creator) {
        mergedCreator = {
          ...(user.creator || {
            id: `creator_${user.id}`,
            userId: user.id,
            discordId: user.discordId,
            name: user.displayName || user.username,
            bio: "",
            contentType: "Mixed",
            avatarUrl: user.avatarUrl,
            bannerUrl: user.customBannerUrl || user.bannerUrl || null,
            followerCount: 0,
            postCount: 0,
            totalViews: 0,
            totalLikes: 0,
            trendingScore: 0,
            status: "ACTIVE" as const,
            webConsent: true,
            webConsentAt: user.createdAt,
            createdAt: user.createdAt,
            badges: ["creator"],
          }),
          ...updatedFields.creator,
          bannerUrl:
            updatedFields.customBannerUrl !== undefined
              ? updatedFields.customBannerUrl || user.discordBannerUrl || user.bannerUrl || null
              : updatedFields.creator?.bannerUrl !== undefined
              ? updatedFields.creator.bannerUrl
              : user.creator?.bannerUrl || null,
        };
      } else {
        mergedCreator = null;
      }
    } else if (user.creator && updatedFields.customBannerUrl !== undefined) {
      mergedCreator = {
        ...user.creator,
        bannerUrl: updatedFields.customBannerUrl || user.discordBannerUrl || user.bannerUrl || null,
      };
    }

    const updated: User = {
      ...user,
      ...updatedFields,
      creator: mergedCreator,
      updatedAt: new Date().toISOString(),
    };

    setUser(updated);

    if (typeof document !== "undefined") {
      const cookieData = {
        id: updated.id,
        discordId: updated.discordId || updated.id,
        username: updated.username,
        displayName: updated.displayName,
        avatarUrl: updated.avatarUrl,
        role: updated.role,
        badges: updated.badges,
      };
      const host = window.location.hostname;
      const domainAttr = host.includes("onlyyouhub.com")
        ? "; domain=.onlyyouhub.com"
        : host.includes("onlyyou.club")
        ? "; domain=.onlyyou.club"
        : "";
      document.cookie = `onlyyou_session=${encodeURIComponent(JSON.stringify(cookieData))}; path=/${domainAttr}; max-age=2592000; SameSite=Lax`;
    }

    fetch("/api/auth/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: updated }),
    }).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isCreator,
        isAdmin,
        isAdultVerified,
        followingIds,
        likedPostIds,
        notificationSettings,
        loginWithDiscord,
        logout,
        verifyAge,
        toggleFollow,
        toggleLike,
        toggleNotifications,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
