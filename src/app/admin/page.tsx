"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminStore, AdminUserItem, AdminGlobalStats } from "@/lib/admin/admin-store";
import { Creator, Report, Post } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProfileBadgeBar } from "@/components/profile/ProfileBadgeBar";
import { resolveUserBadges, AVAILABLE_BADGES } from "@/config/badges";
import { useAuth } from "@/lib/auth/auth-context";
import { VIDEO_CATEGORIES } from "@/config/categories";
import { formatDate, formatNumber } from "@/lib/utils/formatters";
import { uploadVideoInChunks } from "@/lib/media/chunk-uploader";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  RotateCcw,
  Flag,
  FileText,
  UserCheck,
  Sparkles,
  ExternalLink,
  Loader2,
  BarChart3,
  Film,
  UserPlus,
  Eye,
  Heart,
  TrendingUp,
  Activity,
  RefreshCw,
  Upload,
  Trash2,
  Tag,
  AlertCircle,
  Play,
  Check,
  X,
} from "lucide-react";

export default function AdminPage() {
  const { user: authUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"creators" | "badges" | "reports" | "stats" | "official-publish">("creators");

  // State loaded from AdminStore / API
  const [creators, setCreators] = useState<Creator[]>([]);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<AdminGlobalStats>(AdminStore.getStats());
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [creatorStatusFilter, setCreatorStatusFilter] = useState<string>("ALL");
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("ALL");

  // Feedback banner
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // --- Official Post Publishing State ---
  const [officialPosts, setOfficialPosts] = useState<Post[]>([]);
  const [isLoadingOfficialPosts, setIsLoadingOfficialPosts] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [lastPublishedPost, setLastPublishedPost] = useState<Post | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const fetchOfficialPosts = async () => {
    try {
      setIsLoadingOfficialPosts(true);
      const res = await fetch("/api/admin/official-post");
      if (res.ok) {
        const data = await res.json();
        setOfficialPosts(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load official posts:", err);
    } finally {
      setIsLoadingOfficialPosts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "official-publish") {
      fetchOfficialPosts();
    }
  }, [activeTab]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const addTag = (value: string) => {
    const cleanTag = value.trim().replace(/^#/, "").replace(/,/g, "");
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags((prev) => [...prev, cleanTag]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setPublishError("Wybrany plik nie jest prawidłowym plikiem wideo");
        return;
      }
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setPublishError("Rozmiar pliku wideo przekracza limit 2GB");
        return;
      }
      setVideoFile(file);
      setPublishError(null);
      if (!postTitle.trim()) {
        const defaultName = file.name.replace(/\.[^/.]+$/, "");
        setPostTitle(defaultName);
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setPublishError("Miniaturka musi być plikiem graficznym (JPG, PNG, WebP)");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setPublishError("Rozmiar miniaturki nie może przekraczać 15MB");
        return;
      }
      setThumbnailFile(file);
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setThumbnailPreview(URL.createObjectURL(file));
      setPublishError(null);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const handleOfficialPublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setPublishError("Wybierz plik wideo do publikacji.");
      return;
    }
    if (!postTitle.trim()) {
      setPublishError("Wpisz tytuł filmu.");
      return;
    }
    if (selectedCategories.length === 0) {
      setPublishError("Wybierz przynajmniej jedną kategorię dla filmu.");
      return;
    }

    let finalTags = [...tags];
    if (tagInput.trim()) {
      const clean = tagInput.trim().replace(/^#/, "").replace(/,/g, "");
      if (clean && !finalTags.includes(clean)) {
        finalTags.push(clean);
      }
    }

    setIsPublishing(true);
    setPublishProgress("Wgrywanie pliku wideo...");
    setPublishError(null);
    setLastPublishedPost(null);

    try {
      // 1. Upload video in chunks (bypasses Cloudflare 100MB limit and prevents timeouts)
      const videoData = await uploadVideoInChunks(videoFile, (text) => {
        setPublishProgress(text);
      });
      const mediaUrl = videoData.url;

      // 2. Upload thumbnail if selected
      let thumbnailUrl: string | null = null;
      if (thumbnailFile) {
        setPublishProgress("Wgrywanie miniaturki...");
        const thumbFormData = new FormData();
        thumbFormData.append("file", thumbnailFile);
        thumbFormData.append("type", "thumbnail");

        const thumbRes = await fetch("/api/upload", {
          method: "POST",
          body: thumbFormData,
        });

        if (!thumbRes.ok) {
          let thumbErrMsg = "Błąd podczas wgrywania miniaturki";
          try {
            const thumbErr = await thumbRes.json();
            if (thumbErr?.error) thumbErrMsg = thumbErr.error;
          } catch {
            if (thumbRes.status === 413) {
              thumbErrMsg = "Miniaturka przekracza limit rozmiaru serwera (błąd 413).";
            }
          }
          throw new Error(thumbErrMsg);
        }

        const thumbData = await thumbRes.json();
        thumbnailUrl = thumbData.url;
      }

      // 3. Publish via /api/admin/official-post
      setPublishProgress("Publikowanie jako OnlyYou | Club...");
      const postRes = await fetch("/api/admin/official-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle.trim(),
          caption: postDescription.trim() || postTitle.trim(),
          categories: selectedCategories,
          category: selectedCategories[0],
          tags: finalTags.length > 0 ? finalTags : selectedCategories,
          mediaUrl,
          thumbnailUrl,
          originalFilename: videoFile.name,
          mimeType: videoFile.type || "video/mp4",
          fileSize: videoFile.size,
          qualities: videoData.qualities || [],
        }),
      });

      if (!postRes.ok) {
        const errData = await postRes.json().catch(() => ({}));
        throw new Error(errData.error || "Nie udało się opublikować filmu");
      }

      const postData = await postRes.json();
      if (postData.post) {
        setOfficialPosts((prev) => [postData.post, ...prev]);
        setLastPublishedPost(postData.post);
      }

      triggerFeedback(`Film "${postTitle.trim()}" został pomyślnie opublikowany z oficjalnego konta OnlyYou | Club!`);

      // Reset form fields
      setVideoFile(null);
      setPostTitle("");
      setPostDescription("");
      setThumbnailFile(null);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
      setSelectedCategories([]);
      setTags([]);
      setTagInput("");
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    } catch (err: any) {
      setPublishError(err.message || "Wystąpił błąd podczas publikacji");
    } finally {
      setIsPublishing(false);
      setPublishProgress(null);
    }
  };

  const handleDeleteOfficialPost = async (postId: string, title: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć oficjalny film "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/official-post?id=${encodeURIComponent(postId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOfficialPosts((prev) => prev.filter((p) => p.id !== postId));
        triggerFeedback(`Oficjalny film "${title}" został usunięty.`);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Nie udało się usunąć filmu");
      }
    } catch {
      alert("Błąd połączenia podczas usuwania filmu");
    }
  };

  useEffect(() => {
    // Initial quick read from local storage
    setCreators(AdminStore.getCreators());
    setUsers(AdminStore.getUsers());
    setReports(AdminStore.getReports());
    setStats(AdminStore.getStats());

    // Fetch freshest data from backend API
    AdminStore.fetchAll()
      .then((data) => {
        setCreators(data.creators);
        setUsers(data.users);
        setReports(data.reports);
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.error("Admin fetch error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const triggerFeedback = (message: string) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // --- Creator Actions ---
  const handleVerifyCreator = async (creatorId: string, name: string) => {
    const { creators: updatedCreators, users: updatedUsers } = await AdminStore.verifyCreator(creatorId);
    setCreators(updatedCreators);
    setUsers(updatedUsers);
    triggerFeedback(`Twórca "${name}" został zweryfikowany i aktywowany!`);
  };

  const handleBanCreator = async (creatorId: string, name: string) => {
    const { creators: updatedCreators, users: updatedUsers } = await AdminStore.banCreator(creatorId);
    setCreators(updatedCreators);
    setUsers(updatedUsers);
    triggerFeedback(`Twórca "${name}" został zablokowany.`);
  };

  const handleUnbanCreator = async (creatorId: string, name: string) => {
    const { creators: updatedCreators, users: updatedUsers } = await AdminStore.unbanCreator(creatorId);
    setCreators(updatedCreators);
    setUsers(updatedUsers);
    triggerFeedback(`Twórca "${name}" został przywrócony do stanu aktywnego.`);
  };

  // --- Badge Actions ---
  const handleToggleBadge = async (userId: string, badgeId: string, username: string) => {
    const { users: updatedUsers, creators: updatedCreators } = await AdminStore.toggleBadge(userId, badgeId);
    setUsers(updatedUsers);
    setCreators(updatedCreators);

    const targetUser = updatedUsers.find((u) => u.id === userId || u.discordId === userId);
    if (targetUser && authUser && (authUser.id === userId || authUser.discordId === userId)) {
      updateUser({
        badges: targetUser.badges,
        role: targetUser.role,
      });
    }

    const badgeName = badgeId === "creator" ? "Twórca" : "Administrator";
    const hadBadge = targetUser ? targetUser.badges.includes(badgeId) : false;
    triggerFeedback(`${hadBadge ? "Nadano" : "Odebrano"} odznakę "${badgeName}" dla @${username}.`);
  };

  // --- Report Actions ---
  const handleReportAction = async (
    reportId: string,
    action: "RESOLVED" | "REJECTED" | "ACTIONED",
    targetName?: string
  ) => {
    const actionDesc =
      action === "ACTIONED"
        ? `Zastosowano karę wobec ${targetName || "zgłoszonego obiektu"}`
        : action === "RESOLVED"
        ? "Zgłoszenie oznaczone jako rozwiązane"
        : "Zgłoszenie odrzucone jako bezpodstawne";

    const updated = await AdminStore.updateReportStatus(reportId, action, actionDesc);
    setReports(updated);
    triggerFeedback(actionDesc);
  };

  // Helper to check creator badge
  const hasCreatorBadge = (c: Creator) =>
    Boolean((c.badges && c.badges.includes("creator")) || (c.user?.badges && c.user.badges.includes("creator")));

  // Only consider records that possess creator badge or are banned
  const validCreators = creators.filter((c) => hasCreatorBadge(c) || c.status === "BANNED");

  // Counts
  const pendingCreatorsCount = validCreators.filter((c) => c.status === "UNDER_REVIEW").length;
  const activeCreatorsCount = validCreators.filter((c) => c.status === "ACTIVE").length;
  const bannedCreatorsCount = validCreators.filter((c) => c.status === "BANNED").length;
  const pendingReportsCount = reports.filter((r) => r.status === "PENDING").length;

  // Filtered lists
  const filteredCreators = validCreators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.discordId.includes(searchQuery) ||
      (c.category ? c.category.toLowerCase().includes(searchQuery.toLowerCase()) : false);

    if (!matchesSearch) return false;
    if (creatorStatusFilter === "ALL") return true;
    if (creatorStatusFilter === "ACTIVE") return c.status === "ACTIVE";
    if (creatorStatusFilter === "UNDER_REVIEW") return c.status === "UNDER_REVIEW";
    if (creatorStatusFilter === "BANNED") return c.status === "BANNED";
    return c.status === creatorStatusFilter;
  });

  const filteredUsers = users.filter((u) => {
    return (
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.discordId.includes(searchQuery)
    );
  });

  const filteredReports = reports.filter((r) => {
    if (reportStatusFilter === "ALL") return true;
    return r.status === reportStatusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs sm:text-sm text-emerald-300 flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1 bg-surface border-surface-border">
          <span className="text-xs text-zinc-400">Oczekujące weryfikacje</span>
          <div className="text-2xl font-black text-amber-400">{pendingCreatorsCount}</div>
          <p className="text-[10px] text-zinc-500">Konta do autoryzacji</p>
        </Card>

        <Card className="p-4 space-y-1 bg-surface border-surface-border">
          <span className="text-xs text-zinc-400">Aktywni Twórcy</span>
          <div className="text-2xl font-black text-white">{activeCreatorsCount}</div>
          <p className="text-[10px] text-zinc-500">Z autoryzacją publikacji</p>
        </Card>

        <Card className="p-4 space-y-1 bg-surface border-surface-border">
          <span className="text-xs text-zinc-400">Zgłoszenia (Reporty)</span>
          <div className="text-2xl font-black text-red-400">{pendingReportsCount}</div>
          <p className="text-[10px] text-zinc-500">Oczekujące na moderatora</p>
        </Card>

        <Card className="p-4 space-y-1 bg-surface border-surface-border">
          <span className="text-xs text-zinc-400">Zablokowane Konta</span>
          <div className="text-2xl font-black text-zinc-300">{bannedCreatorsCount}</div>
          <p className="text-[10px] text-zinc-500">Bany i zawieszenia</p>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("creators");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "creators"
              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
              : "text-zinc-400 hover:text-white hover:bg-surface-hover"
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Weryfikacja & Twórcy</span>
          {pendingCreatorsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center">
              {pendingCreatorsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("badges");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "badges"
              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
              : "text-zinc-400 hover:text-white hover:bg-surface-hover"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>System Odznak</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("reports");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "reports"
              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
              : "text-zinc-400 hover:text-white hover:bg-surface-hover"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Centrum Zgłoszeń</span>
          {pendingReportsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("stats");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "stats"
              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
              : "text-zinc-400 hover:text-white hover:bg-surface-hover"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statystyki Platformy</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("official-publish");
            setSearchQuery("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "official-publish"
              ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-pink-500/20"
              : "text-zinc-400 hover:text-white hover:bg-surface-hover"
          }`}
        >
          <Film className="w-4 h-4 text-pink-400" />
          <span>🎬 Publikuj jako OnlyYou</span>
        </button>
      </div>

      {/* Background sync indicator */}
      {isLoading && creators.length === 0 && (
        <div className="flex items-center justify-center py-8 gap-2 text-zinc-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
          <span>Wczytywanie i synchronizacja danych kont z serwerem...</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CREATORS MANAGEMENT & VERIFICATION */}
      {/* ========================================================================= */}
      {activeTab === "creators" && (
        <div className="space-y-4">
          {/* Controls: Search + Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Szukaj twórcy po nazwie, Discord ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface border border-surface-border text-xs text-white placeholder:text-zinc-500 outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { id: "ALL", label: "Wszyscy" },
                { id: "UNDER_REVIEW", label: `Oczekujący (${pendingCreatorsCount})` },
                { id: "ACTIVE", label: `Aktywni (${activeCreatorsCount})` },
                { id: "BANNED", label: `Zbanowani (${bannedCreatorsCount})` },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setCreatorStatusFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    creatorStatusFilter === filter.id
                      ? "bg-surface-hover text-white border border-brand-primary/50"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Creators List Table */}
          <Card className="overflow-hidden border-surface-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-hover/30 text-zinc-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Twórca</th>
                    <th className="py-3 px-3">Discord ID</th>
                    <th className="py-3 px-3">Kategoria</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Odznaki</th>
                    <th className="py-3 px-4 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredCreators.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500">
                        Nie znaleziono twórców spełniających kryteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCreators.map((creator) => {
                      const isCreatorBadgePresent = hasCreatorBadge(creator);
                      const creatorBadges = Array.isArray(creator.badges)
                        ? creator.badges
                        : (creator.user?.badges || []);
                      const badges = resolveUserBadges(
                        {
                          ...(creator.user || {}),
                          badges: creatorBadges,
                        },
                        isCreatorBadgePresent
                      );

                      return (
                        <tr key={creator.id} className="hover:bg-surface-hover/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 min-w-[180px]">
                              {creator.avatarUrl ? (
                                <img
                                  src={creator.avatarUrl}
                                  alt={creator.name}
                                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-surface-hover border border-surface-border flex items-center justify-center text-zinc-400 font-bold">
                                  {creator.name[0]}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-white truncate">{creator.name}</div>
                                <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                                  {creator.bio || "Brak opisu"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono text-zinc-400 whitespace-nowrap">
                            {creator.discordId}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-zinc-300">
                              {creator.category}
                            </span>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            {creator.status === "ACTIVE" && isCreatorBadgePresent && (
                              <Badge variant="success" className="text-[10px]">
                                Aktywny
                              </Badge>
                            )}
                            {(creator.status === "UNDER_REVIEW" || !isCreatorBadgePresent) && creator.status !== "BANNED" && (
                              <Badge variant="warning" className="text-[10px]">
                                Weryfikacja
                              </Badge>
                            )}
                            {creator.status === "BANNED" && (
                              <Badge variant="danger" className="text-[10px]">
                                Zbanowany
                              </Badge>
                            )}
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <ProfileBadgeBar badges={badges} size="sm" />
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              {(creator.status === "UNDER_REVIEW" || !isCreatorBadgePresent) && creator.status !== "BANNED" && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleVerifyCreator(creator.id, creator.name)}
                                  className="gap-1.5 text-xs py-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Zweryfikuj</span>
                                </Button>
                              )}

                              {creator.status === "ACTIVE" && isCreatorBadgePresent && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleBanCreator(creator.id, creator.name)}
                                  className="gap-1.5 text-xs py-1"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Zbanuj</span>
                                </Button>
                              )}

                              {creator.status === "BANNED" && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleUnbanCreator(creator.id, creator.name)}
                                  className="gap-1.5 text-xs py-1 text-emerald-400 border-emerald-500/30"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Odwieś</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BADGE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "badges" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Szukaj konta do nadania odznak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface border border-surface-border text-xs text-white placeholder:text-zinc-500 outline-none focus:border-brand-primary"
              />
            </div>

            <div className="text-xs text-zinc-400">
              Łącznie kont: <strong className="text-white">{filteredUsers.length}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.length === 0 ? (
              <Card className="col-span-1 md:col-span-2 p-8 text-center text-zinc-500 text-xs">
                Nie znaleziono zarejestrowanych użytkowników.
              </Card>
            ) : (
              filteredUsers.map((user) => {
                const hasCreatorBadge = user.badges?.includes("creator");
                const hasAdminBadge = user.badges?.includes("admin");
                const userBadges = resolveUserBadges(user, user.isCreator);

                return (
                  <Card key={user.id} className="p-4 space-y-4 border-surface-border bg-surface">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-hover border border-surface-border flex items-center justify-center text-zinc-400 font-bold">
                            {user.displayName[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm truncate">
                            {user.displayName}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono">@{user.username}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">
                          Rola: {user.role}
                        </span>
                        <ProfileBadgeBar badges={userBadges} size="sm" />
                      </div>
                    </div>

                    {/* Badge Controls */}
                    <div className="pt-2 border-t border-surface-border flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleToggleBadge(user.id, "creator", user.username)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          hasCreatorBadge
                            ? "bg-purple-950/60 text-purple-300 border-purple-600/60 hover:bg-red-950/40 hover:text-red-400 hover:border-red-700/60"
                            : "bg-surface-hover text-zinc-400 border-surface-border hover:text-purple-300 hover:border-purple-600/40"
                        }`}
                      >
                        <img src="/badges/creator.webp" alt="Twórca" className="w-4 h-4 object-contain" />
                        <span>{hasCreatorBadge ? "Odbierz Twórcę" : "Nadaj Twórcę"}</span>
                      </button>

                      <button
                        onClick={() => handleToggleBadge(user.id, "admin", user.username)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          hasAdminBadge
                            ? "bg-red-950/60 text-red-300 border-red-600/60 hover:bg-zinc-900 hover:text-zinc-400 hover:border-zinc-700"
                            : "bg-surface-hover text-zinc-400 border-surface-border hover:text-red-300 hover:border-red-600/40"
                        }`}
                      >
                        <img src="/badges/administrator.webp" alt="Administrator" className="w-4 h-4 object-contain" />
                        <span>{hasAdminBadge ? "Odbierz Admina" : "Nadaj Admina"}</span>
                      </button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REPORTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: "ALL", label: "Wszystkie zgłoszenia" },
                { id: "PENDING", label: `Oczekujące (${pendingReportsCount})` },
                { id: "ACTIONED", label: "Zastosowano karę" },
                { id: "RESOLVED", label: "Rozwiązane" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setReportStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    reportStatusFilter === f.id
                      ? "bg-surface-hover text-white border border-brand-primary/50"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <Card className="p-8 text-center text-zinc-500 text-xs">
                Brak zgłoszeń w tej kategorii.
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="p-5 space-y-4 border-surface-border bg-surface">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center">
                        <Flag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          Zgłoszenie: {report.targetName || report.targetId}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Typ: <strong>{report.targetType}</strong> • Powód:{" "}
                          <span className="text-red-400 font-semibold">{report.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === "PENDING" && (
                        <Badge variant="warning" className="text-[10px]">
                          Oczekuje na decyzję
                        </Badge>
                      )}
                      {report.status === "ACTIONED" && (
                        <Badge variant="danger" className="text-[10px]">
                          Zastosowano karę
                        </Badge>
                      )}
                      {report.status === "RESOLVED" && (
                        <Badge variant="success" className="text-[10px]">
                          Rozwiązane
                        </Badge>
                      )}
                      {report.status === "REJECTED" && (
                        <Badge variant="secondary" className="text-[10px]">
                          Odrzucone
                        </Badge>
                      )}
                      <span className="text-[10px] text-zinc-500">
                        {new Date(report.createdAt).toLocaleDateString("pl-PL")}
                      </span>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="space-y-1 text-xs">
                    <span className="text-zinc-400 font-semibold">Opis zgłoszenia:</span>
                    <p className="p-3 rounded-lg bg-surface-hover/60 border border-surface-border text-zinc-200 leading-relaxed">
                      {report.details || "Brak dodatkowego komentarza."}
                    </p>
                    {report.actionTaken && (
                      <div className="text-[11px] text-emerald-400 pt-1">
                        Podjęte kroki: {report.actionTaken}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {report.status === "PENDING" && (
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReportAction(report.id, "REJECTED")}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        Odrzuć zgłoszenie
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReportAction(report.id, "RESOLVED")}
                        className="text-xs text-emerald-400 border-emerald-500/30"
                      >
                        Oznacz jako rozwiązane
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReportAction(report.id, "ACTIONED", report.targetName)}
                        className="text-xs gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Zastosuj karę</span>
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STATYSTYKI PLATFORMY (METRICS & COUNTERS) */}
      {/* ========================================================================= */}
      {activeTab === "stats" && (
        <div className="space-y-6 animate-in fade-in-0 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-surface to-zinc-900/60 border border-surface-border">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-primary" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Statystyki Globalne Platformy OnlyYou
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Rzeczywiste, automatycznie odświeżane liczniki unikalnych wizyt, użytkowników, twórców oraz wideo
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const data = await AdminStore.fetchAll();
                  setStats(data.stats);
                  triggerFeedback("Statystyki zostały zaktualizowane!");
                } catch {
                  triggerFeedback("Nie udało się odświeżyć statystyk.");
                } finally {
                  setIsLoading(false);
                }
              }}
              className="text-xs gap-1.5 self-start sm:self-auto border-surface-border hover:border-brand-primary/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-brand-primary" : ""}`} />
              <span>Odśwież dane</span>
            </Button>
          </div>

          {/* 4 Primary Requested Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Unikalne Odwiedziny */}
            <Card className="p-5 space-y-3 bg-surface border-surface-border relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Osoby które odwiedziły stronę</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-white tracking-tight">
                  {stats.uniqueVisitorsCount.toLocaleString("pl-PL")}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-400/90 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>Unikalne osoby (nie dubluje wejść)</span>
                </div>
              </div>
            </Card>

            {/* 2. Zarejestrowane Konta */}
            <Card className="p-5 space-y-3 bg-surface border-surface-border relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Zarejestrowane konta</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-white tracking-tight">
                  {stats.registeredUsersCount.toLocaleString("pl-PL")}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-purple-400/90 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Konta Discord & społeczności</span>
                </div>
              </div>
            </Card>

            {/* 3. Ilość Twórców */}
            <Card className="p-5 space-y-3 bg-surface border-surface-border relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Ilość twórców</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Crown className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-amber-400 tracking-tight">
                  {stats.creatorsCount.toLocaleString("pl-PL")}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Zweryfikowani twórcy i modelki</span>
                </div>
              </div>
            </Card>

            {/* 4. Ilość Filmów */}
            <Card className="p-5 space-y-3 bg-surface border-surface-border relative overflow-hidden group hover:border-pink-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Ilość filmów</span>
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                  <Film className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-white tracking-tight">
                  {stats.videosCount.toLocaleString("pl-PL")}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-pink-400/90 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span>Opublikowane wideo w serwisie</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center justify-between bg-surface border-surface-border">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400">Wszystkie posty (wideo + zdjęcia)</span>
                <div className="text-xl font-bold text-white">{stats.totalPostsCount}</div>
                <p className="text-[10px] text-zinc-500">W tym {stats.photosCount} wpisów ze zdjęciami</p>
              </div>
              <Activity className="w-7 h-7 text-zinc-700" />
            </Card>

            <Card className="p-4 flex items-center justify-between bg-surface border-surface-border">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400">Łączna suma wyświetleń filmów i postów</span>
                <div className="text-xl font-bold text-emerald-400">{stats.totalViews.toLocaleString("pl-PL")}</div>
                <p className="text-[10px] text-zinc-500">Rzeczywisty ruch odtworzeń</p>
              </div>
              <TrendingUp className="w-7 h-7 text-emerald-500/40" />
            </Card>

            <Card className="p-4 flex items-center justify-between bg-surface border-surface-border">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400">Oddane polubienia (Reakcje)</span>
                <div className="text-xl font-bold text-pink-400">{stats.totalLikes.toLocaleString("pl-PL")}</div>
                <p className="text-[10px] text-zinc-500">Zaangażowanie społeczności</p>
              </div>
              <Heart className="w-7 h-7 text-pink-500/40" />
            </Card>
          </div>

          {/* Technical Info Box */}
          <div className="p-4 rounded-xl bg-surface/60 border border-surface-border text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <Activity className="w-4 h-4 text-brand-primary" />
              <span>Jak działa licznik unikalnych użytkowników?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Licznik unikalnych odwiedzających jest w pełni zabezpieczony przed wielokrotnym naliczaniem tej samej osoby. Każda przeglądarka otrzymuje trwały, anonimowy identyfikator sesji (`onlyyou_vid`) zapisywany w plikach cookies oraz nagłówkach, a system rejestruje tylko nowe, unikalne wizyty w bazie danych serwera.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PUBLISH AS ONLYYOU | CLUB */}
      {/* ========================================================================= */}
      {activeTab === "official-publish" && (
        <div className="space-y-6">
          {/* Header Info Card */}
          <Card className="p-5 bg-gradient-to-r from-red-950/40 via-surface to-surface border border-red-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-black border-2 border-red-500/40 shrink-0 shadow-lg shadow-red-500/10 flex items-center justify-center">
                  <img src="/logo.png" alt="OnlyYou | Club" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black text-white">OnlyYou | Club</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                      Oficjalne Konto Platformy
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Tylko Administratorzy
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                    Treści opublikowane z tego formularza będą sygnowane oficjalnym kontem platformy{" "}
                    <span className="text-white font-medium">OnlyYou | Club</span>, trafią bezpośrednio do katalogu głównego, na publiczny profil{" "}
                    <a href="/onlyyou" target="_blank" rel="noreferrer" className="text-red-400 hover:underline">
                      /onlyyou
                    </a>{" "}
                    oraz wyślą automatyczne powiadomienie na serwer Discord w kanale{" "}
                    <span className="text-zinc-300 font-mono">📸・ostatnie</span>.
                  </p>
                </div>
              </div>

              <a
                href="/onlyyou"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-hover hover:bg-surface-border text-xs font-semibold text-zinc-300 hover:text-white border border-surface-border transition-colors shrink-0"
              >
                <span>Otwórz profil /onlyyou</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

          {/* Form Card */}
          <Card className="p-6 bg-surface border-surface-border space-y-6">
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-primary" />
                  <span>Nowy oficjalny film platformy</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Wypełnij poniższy formularz i wybierz plik wideo, aby opublikować materiał w serwisie.
                </p>
              </div>
            </div>

            {publishError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{publishError}</span>
              </div>
            )}

            {lastPublishedPost && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Film <strong>&quot;{lastPublishedPost.title}&quot;</strong> został pomyślnie dodany do platformy!
                  </span>
                </div>
                <a
                  href={`/post/${lastPublishedPost.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span>Oglądaj film</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <form onSubmit={handleOfficialPublish} className="space-y-6">
              {/* Step 1: Video File */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  1. Plik wideo <span className="text-red-500">*</span>
                </label>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="admin-official-video-file"
                />

                {!videoFile ? (
                  <label
                    htmlFor="admin-official-video-file"
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-surface-border hover:border-brand-primary bg-surface/50 hover:bg-surface/80 cursor-pointer transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 group-hover:bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-3 transition-colors">
                      <Film className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-200">
                      Kliknij, aby wybrać plik wideo lub przeciągnij go tutaj
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">
                      Obsługiwane formaty: MP4, WebM, MKV, MOV do 2GB (automatyczne generowanie jakości 1080p, 720p itp.)
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-hover border border-surface-border">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate max-w-sm sm:max-w-md">
                          {videoFile.name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} MB • Gotowy do wysłania
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setVideoFile(null);
                        if (videoInputRef.current) videoInputRef.current.value = "";
                      }}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Step 2: Title */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  2. Tytuł filmu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="np. Oficjalna premiera OnlyYou | Club"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl bg-surface-hover border border-surface-border text-xs text-white placeholder:text-zinc-500 outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              {/* Step 3: Description / Caption */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  3. Opis filmu <span className="text-zinc-500 text-[10px] font-normal">(opcjonalnie)</span>
                </label>
                <textarea
                  placeholder="Wprowadź opis, informacje o materiale lub zapowiedź..."
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-surface-hover border border-surface-border text-xs text-white placeholder:text-zinc-500 outline-none focus:border-brand-primary transition-colors resize-y"
                />
              </div>

              {/* Step 4: Thumbnail File */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  4. Własna miniaturka <span className="text-zinc-500 text-[10px] font-normal">(opcjonalnie, format JPG/PNG/WebP do 15MB)</span>
                </label>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="admin-official-thumb-file"
                />

                {!thumbnailPreview ? (
                  <label
                    htmlFor="admin-official-thumb-file"
                    className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-surface-border hover:border-zinc-500 bg-surface/50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-zinc-400">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-zinc-400 hover:text-zinc-200">
                      Wybierz grafikę miniaturki (jeśli nie wybierzesz, system wygeneruje kadr z filmu)
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-hover border border-surface-border">
                    <img
                      src={thumbnailPreview}
                      alt="Podgląd miniaturki"
                      className="w-20 h-12 object-cover rounded-lg border border-surface-border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {thumbnailFile?.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {((thumbnailFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveThumbnail}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Step 5: Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-300">
                    5. Kategorie <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    Wybrano: {selectedCategories.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-surface-hover/50 border border-surface-border max-h-48 overflow-y-auto">
                  {VIDEO_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-brand-primary text-white border border-brand-primary/80 shadow-sm shadow-brand-primary/30"
                            : "bg-surface text-zinc-400 hover:text-white border border-surface-border hover:border-zinc-600"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 6: Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300">
                  6. Tagi <span className="text-zinc-500 text-[10px] font-normal">(zatwierdź Enterem lub przecinkiem)</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-surface-hover border border-surface-border min-h-[44px]">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface text-xs text-zinc-300 border border-surface-border"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={tags.length === 0 ? "Wpisz tag i wciśnij Enter..." : "Dodaj kolejny..."}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 min-w-[140px] bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none px-2"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isPublishing || !videoFile || !postTitle.trim() || selectedCategories.length === 0}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{publishProgress || "Publikowanie..."}</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      <span>Opublikuj jako OnlyYou | Club</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Published Official Videos List */}
          <Card className="p-6 bg-surface border-surface-border space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white">
                  Opublikowane materiały OnlyYou | Club ({officialPosts.length})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchOfficialPosts}
                disabled={isLoadingOfficialPosts}
                className="text-zinc-400 hover:text-white"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOfficialPosts ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {isLoadingOfficialPosts && officialPosts.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs">
                <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                <span>Wczytywanie filmów...</span>
              </div>
            ) : officialPosts.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                Nie opublikowano jeszcze żadnego oficjalnego filmu. Użyj powyższego formularza, aby dodać pierwszy materiał!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {officialPosts.map((post) => {
                  const media = post.media?.[0];
                  const thumb = media?.thumbnailUrl || media?.cdnUrl;
                  return (
                    <div
                      key={post.id}
                      className="group relative rounded-xl bg-surface-hover border border-surface-border overflow-hidden hover:border-zinc-600 transition-colors flex flex-col"
                    >
                      <div className="relative aspect-video bg-black overflow-hidden">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={post.title || "Film"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700">
                            <Film className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider">
                          {post.category || "Oficjalne"}
                        </div>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-2">
                            {post.title || "Bez tytułu"}
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                            {post.caption || "Brak opisu"}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[10px] text-zinc-400">
                          <div className="flex items-center gap-2">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views || 0}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {post.likes || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <a
                              href={`/post/${post.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-surface hover:bg-surface-border text-zinc-300 hover:text-white transition-colors"
                              title="Oglądaj"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteOfficialPost(post.id, post.title || "Film")}
                              className="p-1.5 rounded-lg bg-surface hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                              title="Usuń film"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
