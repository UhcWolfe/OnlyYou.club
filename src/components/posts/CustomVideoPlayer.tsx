"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Check,
  Loader2,
} from "lucide-react";
import { VideoQuality } from "@/types";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  qualities?: VideoQuality[];
  autoPlay?: boolean;
  className?: string;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  poster,
  qualities = [],
  autoPlay = false,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to build distinct quality URLs
  const getQualityUrl = (originalUrl: string, label: string): string => {
    if (label === "1080p") return originalUrl;
    const dotIndex = originalUrl.lastIndexOf(".");
    if (dotIndex > 0) {
      const base = originalUrl.substring(0, dotIndex);
      const ext = originalUrl.substring(dotIndex);
      return `${base}_${label}${ext}`;
    }
    return originalUrl;
  };

  const availableQualities: VideoQuality[] =
    qualities && qualities.length > 0 && qualities.some((q) => q.url !== src)
      ? qualities
      : [
          { label: "1080p", height: 1080, width: 1920, url: src },
          { label: "720p", height: 720, width: 1280, url: getQualityUrl(src, "720p") },
          { label: "480p", height: 480, width: 854, url: getQualityUrl(src, "480p") },
          { label: "360p", height: 360, width: 640, url: getQualityUrl(src, "360p") },
          { label: "240p", height: 240, width: 426, url: getQualityUrl(src, "240p") },
          { label: "144p", height: 144, width: 256, url: getQualityUrl(src, "144p") },
        ];

  const [currentQuality, setCurrentQuality] = useState<string>(
    availableQualities[0]?.label || "1080p"
  );
  const [currentSrc, setCurrentSrc] = useState<string>(
    availableQualities[0]?.url || src
  );
  const [qualityToast, setQualityToast] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Handle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    const doc = document as any;
    const isFs = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isFs) {
      const el = containerRef.current as any;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Quality switch handler (preserves playback position)
  const handleSelectQuality = (quality: VideoQuality) => {
    if (!videoRef.current) return;

    const savedTime = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;

    setIsBuffering(true);
    setCurrentQuality(quality.label);
    setCurrentSrc(quality.url);
    setShowQualityMenu(false);
    setQualityToast(`Jakość: ${quality.label}`);
    setTimeout(() => setQualityToast(null), 3000);

    // Apply new src and restore time seamlessly
    const video = videoRef.current;
    video.src = quality.url;

    const onCanPlay = () => {
      video.currentTime = savedTime;
      if (wasPlaying) {
        video.play().catch(() => {});
      }
      setIsBuffering(false);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onCanPlay);
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onCanPlay);
    video.load();
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Hide controls on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showQualityMenu) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !showQualityMenu && setShowControls(false)}
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden group select-none ${
        isFullscreen ? "!max-h-none !max-w-none !w-full !h-full" : ""
      } ${className}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className={`w-full h-full object-contain cursor-pointer transition-all ${
          isFullscreen ? "!max-h-none !h-full !w-full" : "max-h-[640px]"
        }`}
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[2px] z-10">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
        </div>
      )}

      {/* Big Center Play/Pause Button overlay */}
      {!isPlaying && !isBuffering && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-brand-primary border border-white/20 hover:border-brand-primary flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-2xl z-10"
        >
          <Play className="w-7 h-7 fill-white translate-x-0.5" />
        </button>
      )}

      {/* Quality change indicator toast */}
      {qualityToast && (
        <div className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xl pointer-events-none flex items-center gap-1.5 animate-fade-in">
          <Settings className="w-3.5 h-3.5 text-brand-primary" />
          <span>{qualityToast}</span>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 ${
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Scrub Bar */}
        <div className="relative mb-2 sm:mb-3 flex items-center group/scrub">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 hover:h-2.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-primary transition-all"
            style={{
              background: `linear-gradient(to right, #8b5cf6 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
        </div>

        {/* Control Buttons Bar */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left: Play/Pause, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isPlaying ? "Wstrzymaj (Spacja)" : "Odtwórz (Spacja)"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={isMuted ? "Wyłącz wyciszenie" : "Wycisz"}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-primary hidden sm:block"
              />
            </div>

            {/* Time Display */}
            <span className="text-xs font-mono text-zinc-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right: Quality Selector & Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Quality Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition-colors"
                title="Zmień jakość wideo"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-300" />
                <span>{currentQuality}</span>
              </button>

              {/* Quality Dropdown Popover */}
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-44 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 z-30 space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/5 mb-1">
                    Jakość odtwarzania
                  </div>
                  {availableQualities.map((q) => {
                    const isSelected = currentQuality === q.label;
                    return (
                      <button
                        key={q.label}
                        onClick={() => handleSelectQuality(q)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-brand-primary/20 text-brand-primary font-bold"
                            : "text-zinc-200 hover:bg-white/10"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {q.label}
                          {q.height >= 720 && (
                            <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-red-600 text-white leading-none">
                              HD
                            </span>
                          )}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isFullscreen ? "Wyjdź z pełnego ekranu (F)" : "Pełny ekran (F)"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
