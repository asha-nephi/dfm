"use client";

import { useRef, useState } from "react";

async function compressImage(file: File, maxDim = 1600, quality = 0.75): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width > maxDim || height > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // Compression is a nice-to-have — never block the upload over it.
    return file;
  }
}

// Drop-in replacement for <input type="file" multiple>. Compresses each
// selected image (resized + re-encoded as JPEG) client-side before the
// surrounding <form action={serverAction}> submits — the server action
// itself is untouched, since this just rewrites input.files in place.
export function CompressedFileInput({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleChange() {
    const input = inputRef.current;
    if (!input?.files || input.files.length === 0) return;

    setBusy(true);
    try {
      const compressed = await Promise.all(Array.from(input.files).map((f) => compressImage(f)));
      const dataTransfer = new DataTransfer();
      compressed.forEach((f) => dataTransfer.items.add(f));
      input.files = dataTransfer.files;
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple
        required
        onChange={handleChange}
        className={className}
      />
      {busy && <span className="text-xs text-navy-black/50">Compressing...</span>}
    </span>
  );
}
