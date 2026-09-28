import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";
import { VideoQuality } from "@/types";
import { db } from "@/lib/storage/db";

const execAsync = util.promisify(exec);

interface TargetResolution {
  label: string;
  height: number;
  width: number;
  videoBitrate: string;
  audioBitrate: string;
}

const TARGET_RESOLUTIONS: TargetResolution[] = [
  { label: "1080p", height: 1080, width: 1920, videoBitrate: "4500k", audioBitrate: "192k" },
  { label: "720p", height: 720, width: 1280, videoBitrate: "2500k", audioBitrate: "128k" },
  { label: "480p", height: 480, width: 854, videoBitrate: "1200k", audioBitrate: "128k" },
  { label: "360p", height: 360, width: 640, videoBitrate: "700k", audioBitrate: "96k" },
  { label: "240p", height: 240, width: 426, videoBitrate: "400k", audioBitrate: "64k" },
  { label: "144p", height: 144, width: 256, videoBitrate: "200k", audioBitrate: "64k" },
];

export async function isFfmpegAvailable(): Promise<boolean> {
  try {
    await execAsync("ffmpeg -version");
    return true;
  } catch {
    return false;
  }
}

export async function probeVideo(
  filePath: string
): Promise<{ width: number; height: number; duration: number } | null> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of json "${filePath}"`
    );
    const data = JSON.parse(stdout);
    const stream = data.streams?.[0];
    if (stream?.width && stream?.height) {
      return {
        width: parseInt(stream.width, 10),
        height: parseInt(stream.height, 10),
        duration: stream.duration ? parseFloat(stream.duration) : 0,
      };
    }
  } catch {
    // ffprobe failed or not found
  }
  return null;
}

export async function transcodeVideoInBackground(options: {
  inputFilePath: string;
  originalUrl: string;
  postId?: string;
}): Promise<VideoQuality[]> {
  const { inputFilePath, originalUrl, postId } = options;
  const qualities: VideoQuality[] = [];

  const available = await isFfmpegAvailable();
  if (!available) {
    console.warn(
      "[Transcoder] FFmpeg nie jest zainstalowany. Aby włączyć transkodowanie do wielu jakości, zainstaluj ffmpeg na VPS (sudo apt install ffmpeg)."
    );
    const defaultQuality: VideoQuality = {
      label: "1080p",
      height: 1080,
      width: 1920,
      url: originalUrl,
    };
    qualities.push(defaultQuality);
    if (postId) {
      db.updatePostMediaQualities(postId, qualities);
    }
    db.updatePostQualitiesByUrl(originalUrl, qualities);
    return qualities;
  }

  // Probe source resolution
  const probe = await probeVideo(inputFilePath);
  const sourceHeight = probe?.height || 1080;
  const sourceWidth = probe?.width || 1920;

  // Determine top resolution label
  let topLabel = "1080p";
  if (sourceHeight >= 2160) topLabel = "4K";
  else if (sourceHeight >= 1440) topLabel = "1440p";
  else if (sourceHeight >= 1080) topLabel = "1080p";
  else if (sourceHeight >= 720) topLabel = "720p";
  else if (sourceHeight >= 480) topLabel = "480p";
  else if (sourceHeight >= 360) topLabel = "360p";
  else if (sourceHeight >= 240) topLabel = "240p";
  else topLabel = "144p";

  // Add original video as top quality
  qualities.push({
    label: topLabel,
    height: sourceHeight,
    width: sourceWidth,
    url: originalUrl,
  });

  const parsed = path.parse(inputFilePath);
  const dir = parsed.dir;
  const baseName = parsed.name;

  // Transcode lower resolutions sequentially
  for (const target of TARGET_RESOLUTIONS) {
    if (target.height >= sourceHeight) continue;

    const outputFileName = `${baseName}_${target.label}.mp4`;
    const outputPath = path.join(dir, outputFileName);
    const outputUrl = `/uploads/videos/${outputFileName}`;

    try {
      console.log(`[Transcoder] Rozpoczynam renderowanie jakości ${target.label} dla ${baseName}...`);
      const cmd = `ffmpeg -y -i "${inputFilePath}" -vf "scale=-2:${target.height}" -c:v libx264 -preset veryfast -crf 23 -b:v ${target.videoBitrate} -c:a aac -b:a ${target.audioBitrate} -movflags +faststart "${outputPath}"`;
      await execAsync(cmd);

      if (fs.existsSync(outputPath)) {
        const qualityItem: VideoQuality = {
          label: target.label,
          height: target.height,
          width: target.width,
          url: outputUrl,
          bitrate: target.videoBitrate,
        };
        qualities.push(qualityItem);
        console.log(`[Transcoder] Sukces: jakość ${target.label} gotowa (${outputUrl})`);

        if (postId) {
          db.updatePostMediaQualities(postId, qualities);
        }
        db.updatePostQualitiesByUrl(originalUrl, qualities);
      }
    } catch (err) {
      console.error(`[Transcoder] Błąd generowania jakości ${target.label}:`, err);
    }
  }

  if (postId) {
    db.updatePostMediaQualities(postId, qualities);
  }
  db.updatePostQualitiesByUrl(originalUrl, qualities);

  return qualities;
}
