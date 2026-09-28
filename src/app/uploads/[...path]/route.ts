import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const rawPath = params.path || [];
    const baseUploadsDir = path.resolve(process.cwd(), "public", "uploads");
    const targetPath = path.resolve(baseUploadsDir, ...rawPath);

    // Prevent directory traversal
    if (!targetPath.startsWith(baseUploadsDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    let actualTargetPath = targetPath;

    if (!fs.existsSync(actualTargetPath)) {
      // Check if it's a requested quality version of an existing video, e.g. video_abc_144p.mp4
      const qualityMatch = actualTargetPath.match(/_(1080p|720p|480p|360p|240p|144p)\.mp4$/);
      if (qualityMatch) {
        const baseFilePath = actualTargetPath.replace(/_(1080p|720p|480p|360p|240p|144p)\.mp4$/, ".mp4");
        if (fs.existsSync(baseFilePath)) {
          const qualityLabel = qualityMatch[1];
          const heightMap: Record<string, { height: number; bitrate: string }> = {
            "1080p": { height: 1080, bitrate: "4500k" },
            "720p": { height: 720, bitrate: "2500k" },
            "480p": { height: 480, bitrate: "1200k" },
            "360p": { height: 360, bitrate: "700k" },
            "240p": { height: 240, bitrate: "400k" },
            "144p": { height: 144, bitrate: "200k" },
          };
          const cfg = heightMap[qualityLabel];
          if (cfg) {
            try {
              const { execSync } = require("child_process");
              execSync(
                `ffmpeg -y -i "${baseFilePath}" -vf "scale=-2:${cfg.height}" -c:v libx264 -preset ultrafast -crf 23 -b:v ${cfg.bitrate} -c:a aac -b:a 96k -movflags +faststart "${actualTargetPath}"`,
                { stdio: "ignore", timeout: 120000 }
              );
            } catch (err) {
              console.warn(`[Uploads] FFmpeg on-demand transcode error for ${qualityLabel}:`, err);
            }
          }
        }
      }

      // If still doesn't exist, fall back to base video if available
      if (!fs.existsSync(actualTargetPath)) {
        const fallbackBase = actualTargetPath.replace(/_(1080p|720p|480p|360p|240p|144p)\.mp4$/, ".mp4");
        if (fs.existsSync(fallbackBase)) {
          actualTargetPath = fallbackBase;
        } else {
          return new NextResponse("File not found", { status: 404 });
        }
      }
    }

    const stat = fs.statSync(actualTargetPath);
    if (!stat.isFile()) {
      return new NextResponse("Not a file", { status: 400 });
    }

    const ext = path.extname(actualTargetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileSize = stat.size;

    const rangeHeader = request.headers.get("range");

    if (rangeHeader && contentType.startsWith("video/")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse("Requested range not satisfiable", {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const nodeStream = fs.createReadStream(actualTargetPath, { start, end });
      const webStream = Readable.toWeb(nodeStream) as ReadableStream;

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const nodeStream = fs.createReadStream(actualTargetPath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": String(fileSize),
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
