"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/auth-context";
import { formatNumber, formatDate } from "@/lib/utils/formatters";
import { VIDEO_CATEGORIES } from "@/config/categories";
import {
  Upload,
  Plus,
  Loader2,
  X,
  Check,
  Video,
  Film,
  Image as ImageIcon,
  Tag,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Post } from "@/types";
import { uploadVideoInChunks } from "@/lib/media/chunk-uploader";

export default function DashboardPostsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const creator = user?.creator;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload modal state (6 steps)
  const [showUploadModal, setShowUploadModal] = useState(false);
  // Step 1: Video file
  const [videoFile, setVideoFile] = useState<File | null>(null);
  // Step 2: Title
  const [title, setTitle] = useState("");
  // Step 3: Description
  const [description, setDescription] = useState("");
  // Step 4: Thumbnail
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  // Step 5: Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Step 6: Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStepText, setUploadStepText] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!creator?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/posts?creatorId=${encodeURIComponent(creator.id)}&limit=100`)
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        setPosts(data.data || []);
      })
      .catch(() => setPosts([]))
      .finally(() => setIsLoading(false));
  }, [creator?.id]);

  const resetForm = () => {
    setVideoFile(null);
    setTitle("");
    setDescription("");
    setThumbnailFile(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    setSelectedCategories([]);
    setTags([]);
    setTagInput("");
    setUploadError(null);
    setUploadSuccess(false);
    setUploadStepText(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const handleCloseModal = () => {
    if (isUploading) return;
    setShowUploadModal(false);
    resetForm();
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setUploadError("Wybrany plik nie jest prawidłowym plikiem wideo");
        return;
      }
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setUploadError("Rozmiar pliku wideo przekracza limit 2GB");
        return;
      }
      setVideoFile(file);
      setUploadError(null);
      if (!title.trim()) {
        const defaultName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(defaultName);
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Miniaturka musi być plikiem graficznym (JPG, PNG, WebP)");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("Rozmiar miniaturki nie może przekraczać 15MB");
        return;
      }
      setThumbnailFile(file);
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setThumbnailPreview(URL.createObjectURL(file));
      setUploadError(null);
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      setUploadError("Krok 1: Wybierz plik wideo do publikacji");
      return;
    }

    if (!title.trim()) {
      setUploadError("Krok 2: Wpisz nazwę filmu");
      return;
    }

    if (selectedCategories.length === 0) {
      setUploadError("Krok 5: Wybierz co najmniej jedną kategorię dla filmu");
      return;
    }

    let finalTags = [...tags];
    if (tagInput.trim()) {
      const clean = tagInput.trim().replace(/^#/, "").replace(/,/g, "");
      if (clean && !finalTags.includes(clean)) {
        finalTags.push(clean);
      }
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Upload Video File in chunks (bypasses Cloudflare 100MB limit & timeouts)
      const videoData = await uploadVideoInChunks(videoFile, (text) => {
        setUploadStepText(text);
      });
      const mediaUrl = videoData.url;

      // 2. Upload Thumbnail if chosen
      let thumbnailUrl: string | null = null;
      if (thumbnailFile) {
        setUploadStepText("Wgrywanie miniaturki...");
        const thumbFormData = new FormData();
        thumbFormData.append("file", thumbnailFile);
        thumbFormData.append("type", "thumbnail");

        const thumbRes = await fetch("/api/upload", {
          method: "POST",
          body: thumbFormData,
        });

        if (thumbRes.ok) {
          const thumbData = await thumbRes.json();
          thumbnailUrl = thumbData.url;
        }
      }

      // 3. Create post
      setUploadStepText("Publikowanie filmu...");
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: creator?.id || `creator_${user?.id}`,
          creatorName: creator?.name || user?.displayName || user?.username,
          creatorAvatar: user?.avatarUrl,
          channelId: creator?.hub?.channelId || "default",
          title: title.trim(),
          caption: description.trim() || title.trim(),
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
        throw new Error("Błąd podczas zapisywania filmu");
      }

      const postData = await postRes.json();
      if (postData.post) {
        setPosts((prev) => [postData.post, ...prev]);
      }

      setUploadSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 1200);
    } catch (err: any) {
      setUploadError(err.message || "Wystąpił błąd podczas dodawania filmu");
    } finally {
      setIsUploading(false);
      setUploadStepText(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h2 className="text-base font-bold text-white">{t("dashboard.nav_posts")}</h2>
            <p className="text-xs text-zinc-400">Filmy i materiały publikowane w Twoim profilu</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="brand" className="text-xs">
              Łącznie: {posts.length} filmów
            </Badge>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowUploadModal(true)}
              className="gap-2 text-xs shadow-lg shadow-brand-primary/25 px-4 py-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Dodaj film</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
            <span>Wczytywanie filmów...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Film / Tytuł</th>
                  <th className="pb-3 font-semibold">Kategorie</th>
                  <th className="pb-3 font-semibold">Tagi</th>
                  <th className="pb-3 font-semibold">Wyświetlenia</th>
                  <th className="pb-3 font-semibold">Polubienia</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-zinc-500">
                      Brak filmów do wyświetlenia. Kliknij <b>Dodaj film</b>, aby opublikować swój pierwszy materiał!
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => {
                    const postCategories =
                      post.categories && post.categories.length > 0
                        ? post.categories
                        : post.category
                        ? [post.category]
                        : ["Ogólne"];

                    const thumb = post.media?.[0]?.thumbnailUrl;

                    return (
                      <tr key={post.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3 max-w-sm">
                            <div className="w-14 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 relative group">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt="Thumb"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Film className="w-5 h-5 text-zinc-600" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate font-semibold text-zinc-200">
                                {post.title || post.caption || "Brak tytułu"}
                              </span>
                              {post.caption && post.caption !== post.title && (
                                <span className="truncate text-[11px] text-zinc-400">
                                  {post.caption}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {postCategories.map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-0.5 rounded text-[10px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 whitespace-nowrap font-medium"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {post.tags && post.tags.length > 0 ? (
                              post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800/80 text-zinc-400 border border-zinc-700/40 whitespace-nowrap"
                                >
                                  #{tag}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-600 text-[11px]">-</span>
                            )}
                            {post.tags && post.tags.length > 3 && (
                              <span className="text-[10px] text-zinc-500 self-center">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-zinc-300 font-semibold whitespace-nowrap">
                          {formatNumber(post.views)}
                        </td>
                        <td className="py-3 text-zinc-300 font-semibold whitespace-nowrap">
                          {formatNumber(post.likes)}
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <Badge variant="success" className="text-[10px]">
                            {post.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-zinc-500 whitespace-nowrap">
                          {formatDate(post.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Upload Video Modal with 6 Distinct Ordered Steps */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-md shadow-brand-primary/20">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Dodawanie nowego filmu</h3>
                  <p className="text-xs text-zinc-400">
                    Wypełnij poszczególne kroki, aby opublikować materiał na platformie
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isUploading}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Form */}
            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* KROK 1: Upload filmiku */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm shadow-brand-primary/30">
                      1
                    </span>
                    <h4 className="text-sm font-bold text-white">Upload filmiku</h4>
                    <span className="text-xs text-red-400 font-medium">*Wymagane</span>
                  </div>
                  {videoFile && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Wybrano plik
                    </span>
                  )}
                </div>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoChange}
                  className="hidden"
                />

                <div
                  onClick={() => videoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    videoFile
                      ? "border-emerald-500/40 bg-emerald-950/10 hover:bg-emerald-950/20"
                      : "border-zinc-700/80 hover:border-brand-primary bg-zinc-900/50 hover:bg-zinc-900/80"
                  }`}
                >
                  {videoFile ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary flex-shrink-0">
                          <Film className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100 break-all">{videoFile.name}</p>
                          <p className="text-xs text-zinc-400">
                            Rozmiar: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB • {videoFile.type || "Wideo"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          videoInputRef.current?.click();
                        }}
                        className="text-xs"
                      >
                        Zmień plik wideo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto text-zinc-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">
                          Kliknij, aby wybrać plik wideo z dysku
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Obsługiwane formaty: MP4, WebM, MOV (maksymalnie 2GB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* KROK 2: Ustawienie nazwy */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm shadow-brand-primary/30">
                    2
                  </span>
                  <h4 className="text-sm font-bold text-white">Ustawienie nazwy</h4>
                  <span className="text-xs text-red-400 font-medium">*Wymagane</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Podaj chwytliwy i czytelny tytuł swojego materiału.
                </p>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="np. Mój pierwszy film w plenerze..."
                  className="text-sm bg-zinc-950/80 border-zinc-800"
                  maxLength={120}
                />
              </div>

              {/* KROK 3: Ustawienie opisu */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm shadow-brand-primary/30">
                      3
                    </span>
                    <h4 className="text-sm font-bold text-white">Ustawienie opisu</h4>
                    <span className="text-xs text-zinc-500">(opcjonalnie)</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">{description.length}/1000</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Opisz swój film, przekaż fanom szczegóły lub dodatkowe informacje.
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Dodaj szczegółowy opis filmu..."
                  className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-brand-primary resize-none transition-colors"
                />
              </div>

              {/* KROK 4: Upload miniaturki */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm shadow-brand-primary/30">
                      4
                    </span>
                    <h4 className="text-sm font-bold text-white">Upload miniaturki</h4>
                    <span className="text-xs text-zinc-500">(opcjonalnie)</span>
                  </div>
                  {thumbnailFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveThumbnail}
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 h-7 px-2 gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Usuń miniaturkę</span>
                    </Button>
                  )}
                </div>
                <p className="text-xs text-zinc-400">
                  Dodaj własną, atrakcyjną okładkę dla filmu (formaty: JPG, PNG, WebP do 15MB).
                </p>

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />

                {thumbnailPreview ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-zinc-950/70 rounded-xl border border-zinc-800">
                    <div className="w-28 h-20 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700/50 flex-shrink-0">
                      <img
                        src={thumbnailPreview}
                        alt="Podgląd miniaturki"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <p className="text-xs font-semibold text-zinc-200">
                        {thumbnailFile?.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Rozmiar: {thumbnailFile ? (thumbnailFile.size / 1024).toFixed(1) : 0} KB
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="text-xs mt-1"
                      >
                        Zmień grafikę okładki
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="border border-dashed border-zinc-700/80 hover:border-brand-primary rounded-xl p-4 text-center cursor-pointer transition-colors bg-zinc-900/30 hover:bg-zinc-900/60"
                  >
                    <div className="flex items-center justify-center gap-2 text-zinc-400">
                      <ImageIcon className="w-4 h-4 text-brand-primary" />
                      <span className="text-xs font-medium text-zinc-300">
                        Kliknij, aby wybrać grafikę miniaturki
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      W przypadku braku miniatury, platforma wygeneruje klatkę podglądu z pliku wideo.
                    </p>
                  </div>
                )}
              </div>

              {/* KROK 5: Wybór kategorii */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm shadow-brand-primary/30">
                      5
                    </span>
                    <h4 className="text-sm font-bold text-white">Wybór kategorii</h4>
                    <span className="text-xs text-red-400 font-medium">*Wymagane</span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    Wybrano:{" "}
                    <b
                      className={
                        selectedCategories.length > 0
                          ? "text-brand-primary font-bold"
                          : "text-zinc-500 font-normal"
                      }
                    >
                      {selectedCategories.length}
                    </b>
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Wybierz jedną lub kilka kategorii, które najlepiej opisują Twój film:
                </p>

                <div className="p-3.5 bg-zinc-950/70 rounded-xl border border-zinc-800/80">
                  <div className="flex flex-wrap gap-2">
                    {VIDEO_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold shadow-md shadow-brand-primary/20 scale-[1.02]"
                              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedCategories.length === 0 && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Zaznacz co najmniej 1 kategorię, aby kontynuować publikację.</span>
                  </p>
                )}
              </div>

              {/* KROK 6: Możliwość wypisania tagów */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm shadow-brand-primary/30">
                    6
                  </span>
                  <h4 className="text-sm font-bold text-white">Możliwość wypisania tagów</h4>
                  <span className="text-xs text-zinc-500">(opcjonalnie)</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Wpisz dodatkowe słowa kluczowe (tagi) oddzielone przecinkami lub zatwierdzane klawiszem Enter:
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="np. blondynka, plener, 4k (naciśnij Enter)..."
                      className="text-xs pl-8 bg-zinc-950/80 border-zinc-800"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addTag(tagInput)}
                    disabled={!tagInput.trim()}
                    className="text-xs h-9 px-3 gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dodaj</span>
                  </Button>
                </div>

                {/* Tags preview chips */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-primary/15 text-brand-primary border border-brand-primary/25 font-medium"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-brand-primary/70 hover:text-brand-primary hover:bg-brand-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Error feedback */}
              {uploadError && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Success feedback */}
              {uploadSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>Film został pomyślnie opublikowany! Zamykanie okna...</span>
                </div>
              )}
            </form>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/60 flex-shrink-0">
              <div className="text-xs text-zinc-400">
                {uploadStepText && (
                  <span className="flex items-center gap-2 text-brand-primary font-medium animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {uploadStepText}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  disabled={isUploading}
                  className="text-xs text-zinc-400"
                >
                  Anuluj
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleUploadSubmit}
                  disabled={isUploading || !videoFile || !title.trim() || selectedCategories.length === 0}
                  isLoading={isUploading}
                  className="text-xs gap-1.5 px-5 shadow-lg shadow-brand-primary/20"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Publikowanie..." : "Opublikuj film"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
