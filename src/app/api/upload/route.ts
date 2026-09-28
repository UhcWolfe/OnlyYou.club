import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { transcodeVideoInBackground } from "@/lib/media/transcoder";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Allow sufficient time for large 2GB uploads

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) || "auto";

    if (!file) {
      return NextResponse.json({ error: "Nie przesłano pliku" }, { status: 400 });
    }

    const videoExtensions = ["mp4", "webm", "mov", "mkv", "avi", "wmv", "flv", "m4v", "ts", "3gp"];
    const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif", "bmp", "svg"];

    const fileExt = file.name && file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase() || ""
      : "";

    const isVideo = (file.type && file.type.startsWith("video/")) || videoExtensions.includes(fileExt);
    const isImage = (file.type && file.type.startsWith("image/")) || imageExtensions.includes(fileExt);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Dozwolone są wyłącznie pliki graficzne (zdjęcia) oraz pliki wideo" },
        { status: 400 }
      );
    }

    // Validate size (max 2GB for video, 15MB for image)
    const MAX_SIZE = isVideo ? 2 * 1024 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Rozmiar pliku przekracza dopuszczalny limit (${isVideo ? "2GB" : "15MB"})` },
        { status: 400 }
      );
    }

    // Determine subfolder and extension
    const subfolder = isVideo ? "videos" : uploadType === "banner" ? "banners" : "images";
    let ext = isVideo ? (fileExt || "mp4") : (fileExt || "png");

    const prefix = isVideo ? "video" : "media";
    const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // Stream file to disk efficiently without keeping full 2GB in memory
    try {
      if (typeof file.stream === "function") {
        const nodeReadable = Readable.fromWeb(file.stream() as any);
        const nodeWritable = fs.createWriteStream(filePath);
        await pipeline(nodeReadable, nodeWritable);
      } else {
        const bytes = await file.arrayBuffer();
        await fs.promises.writeFile(filePath, Buffer.from(bytes));
      }
    } catch (streamErr) {
      console.warn("Streaming to disk failed, trying fallback arrayBuffer:", streamErr);
      const bytes = await file.arrayBuffer();
      await fs.promises.writeFile(filePath, Buffer.from(bytes));
    }

    const publicUrl = `/uploads/${subfolder}/${fileName}`;

    if (isVideo) {
      // Trigger background transcoding for 1080p, 720p, 480p, 360p, 240p, 144p
      transcodeVideoInBackground({
        inputFilePath: filePath,
        originalUrl: publicUrl,
      }).catch((err) => {
        console.error("Background transcode error:", err);
      });
    }

    const defaultQualities = isVideo
      ? [{ label: "1080p", height: 1080, width: 1920, url: publicUrl }]
      : undefined;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      mimeType: file.type || (isVideo ? "video/mp4" : "image/png"),
      fileSize: file.size,
      isVideo,
      qualities: defaultQualities,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Błąd podczas przesyłania pliku na serwer" },
      { status: 500 }
    );
  }
}
