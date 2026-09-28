/**
 * Utility for uploading large video files in 20MB chunks.
 * Bypasses Cloudflare's 100MB body limit and prevents connection dropouts.
 */
export async function uploadVideoInChunks(
  file: File,
  onProgress?: (text: string, percent: number) => void
): Promise<{ url: string; fileName: string; fileSize: number; qualities: any[] }> {
  // 20MB chunks to stay safely below Cloudflare's 100MB limit and Nginx buffers
  const CHUNK_SIZE = 20 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = `upl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  let finalResult: any = null;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunkBlob = file.slice(start, end);

    const chunkFormData = new FormData();
    chunkFormData.append("chunk", chunkBlob, file.name);
    chunkFormData.append("uploadId", uploadId);
    chunkFormData.append("chunkIndex", String(chunkIndex));
    chunkFormData.append("totalChunks", String(totalChunks));
    chunkFormData.append("fileName", file.name);
    chunkFormData.append("fileSize", String(file.size));

    const percent = Math.round((chunkIndex / totalChunks) * 100);
    const uploadedMB = (start / (1024 * 1024)).toFixed(1);
    const totalMB = (file.size / (1024 * 1024)).toFixed(1);

    if (onProgress) {
      onProgress(
        `Wgrywanie wideo: część ${chunkIndex + 1}/${totalChunks} • ${percent}% (${uploadedMB} MB / ${totalMB} MB)...`,
        percent
      );
    }

    const res = await fetch("/api/upload/chunk", {
      method: "POST",
      body: chunkFormData,
    });

    if (!res.ok) {
      let errMsg = "Błąd podczas przesyłania fragmentu wideo";
      try {
        const data = await res.json();
        if (data.error) errMsg = data.error;
      } catch {
        if (res.status === 413) {
          errMsg = "Fragment pliku przekracza limit serwera (Błąd 413).";
        } else if (res.status === 504) {
          errMsg = "Przekroczono limit czasu oczekiwania serwera (Błąd 504).";
        } else {
          errMsg = `Błąd serwera (${res.status}) podczas przesyłania części ${chunkIndex + 1}`;
        }
      }
      throw new Error(errMsg);
    }

    const data = await res.json();
    if (data.completed) {
      finalResult = data;
    }
  }

  if (!finalResult?.url) {
    throw new Error("Nie udało się złożyć pliku wideo po przesłaniu wszystkich części.");
  }

  if (onProgress) {
    onProgress("Przetwarzanie wideo i zapisywanie...", 100);
  }

  return finalResult;
}
