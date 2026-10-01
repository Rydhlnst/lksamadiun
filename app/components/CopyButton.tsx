"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; the number stays selectable on the page
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded border border-slate-200 px-3 py-1.5text-xs font-semibold text-navy transition-colors hover:bg-slate-50"
    >
      <Icon name={copied ? "check" : "copy"} className="size-3.5" />
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}
