"use client";

import { useRef, useState } from "react";
import { uploadImage } from "../actions";

const MAX_SIDE = 1600;

// Downscale in the browser so uploads stay small regardless of the camera.
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses gambar"))),
      "image/jpeg",
      0.85,
    ),
  );
}

export function ImageField({
  name,
  defaultValue,
  required,
}: {
  name: string;
  defaultValue: string;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const blob = await shrink(file);
      const formData = new FormData();
      formData.set("file", new File([blob], "upload.jpg", { type: "image/jpeg" }));
      const result = await uploadImage(formData);
      if (result.url) setUrl(result.url);
      else setError(result.error ?? "Gagal mengunggah");
    } catch {
      setError("Gagal mengunggah gambar");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <input type="hidden" name={name} value={url} />
      <div className="flex h-24 w-36 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50 text-xs text-slate-400">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- small admin preview
          <img src={url} alt="" className="size-full object-cover" />
        ) : (
          "Belum ada foto"
        )}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {busy ? "Mengunggah…" : url ? "Ganti foto" : "Pilih foto"}
          </button>
          {url && !required && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="rounded px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50"
            >
              Hapus foto
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        {error && <p className="text-sm text-rose-700">{error}</p>}
      </div>
    </div>
  );
}
