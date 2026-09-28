import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { transcodeVideoInBackground } from "@/lib/media/transcoder";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chunk = formData.get("chunk") as File | null;
    const uploadId = formData.get("uploadId") as string;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string, 10);
    const totalChunks = parseInt(formData.get("totalChunks") as string, 10);
    const originalFileName = (formData.get("fileName") as string) || "video.mp4";
    const totalFileSize = parseInt(formData.get("fileSize") as string, 10) || 0;

    if (!chunk || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
      return NextResponse.json({ error: "Nieprawidłowe dane fragmentu pliku" }, { status: 400 });
    }

    // Temporary directory for this chunked upload session
    const safeUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, "");
    const tempDir = path.join(process.cwd(), "public", "uploads", "temp", safeUploadId);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const chunkPath = path.join(tempDir, `chunk_${chunkIndex}`);
    const chunkBytes = await chunk.arrayBuffer();
    await fs.promises.writeFile(chunkPath, Buffer.from(chunkBytes));

    // Check if this was the final chunk
    if (chunkIndex === totalChunks - 1) {
      const videosDir = path.join(process.cwd(), "public", "uploads", "videos");
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }

      let ext = "mp4";
      if (originalFileName.includes(".")) {
        ext = originalFileName.split(".").pop()?.toLowerCase() || "mp4";
      }

      const finalFileName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const finalFilePath = path.join(videosDir, finalFileName);

      const writeStream = fs.createWriteStream(finalFilePath);

      for (let i = 0; i < totalChunks; i++) {
        const partPath = path.join(tempDir, `chunk_${i}`);
        if (!fs.existsSync(partPath)) {
          throw new Error(`Brakujący fragment pliku: część ${i + 1} z ${totalChunks}`);
        }
        const partBuffer = await fs.promises.readFile(partPath);
        await new Promise<void>((resolve) => {
          if (!writeStream.write(partBuffer)) {
            writeStream.once("drain", resolve);
          } else {
            resolve();
          }
        });
      }

      await new Promise<void>((resolve, reject) => {
        writeStream.end((err?: Error | null) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Cleanup temp chunk files
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (rmErr) {
        console.warn("Could not remove temp chunk dir:", rmErr);
      }

      const publicUrl = `/uploads/videos/${finalFileName}`;

      // Trigger background transcoding for standard qualities
      transcodeVideoInBackground({
        inputFilePath: finalFilePath,
        originalUrl: publicUrl,
      }).catch((err) => {
        console.error("Background transcode error:", err);
      });

      const defaultQualities = [
        { label: "1080p", height: 1080, width: 1920, url: publicUrl },
      ];

      return NextResponse.json({
        success: true,
        completed: true,
        url: publicUrl,
        fileName: finalFileName,
        fileSize: totalFileSize,
        qualities: defaultQualities,
      });
    }

    return NextResponse.json({
      success: true,
      completed: false,
      chunkIndex,
      totalChunks,
    });
  } catch (error: any) {
    console.error("Chunk upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Błąd podczas łączenia fragmentów pliku wideo" },
      { status: 500 }
    );
  }
}
