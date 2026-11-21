"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { latest, versionPath, versions } from "./versions";

// A small black pill in the bottom-right corner showing the current version.
// It opens a menu of every version so visitors can move between them.
export function VersionSwitcher({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);

  // Close on a click outside.
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Focus the current version when the menu opens.
  useEffect(() => {
    if (!open) return;
    const i = Math.max(
      versions.findIndex((v) => v.id === current),
      0,
    );
    items.current[i]?.focus();
  }, [open, current]);

  function onMenuKey(e: KeyboardEvent) {
    const list = items.current.filter(Boolean) as HTMLAnchorElement[];
    const i = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      list[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1]?.focus();
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Escape") e.preventDefault();
      setOpen(false);
      if (e.key === "Escape") button.current?.focus();
    }
  }

  return (
    <div ref={root} className="fixed right-4 bottom-4 z-50 font-mono text-xs lowercase">
      {open && (
        <div
          role="menu"
          aria-label="Site versions"
          onKeyDown={onMenuKey}
          className="absolute right-0 bottom-full mb-2 w-56 rounded-md border border-white/10 bg-black p-1 shadow-2xl"
        >
          {versions.map((v, i) => {
            const isCurrent = v.id === current;
            return (
              <Link
                key={v.id}
                ref={(el) => {
                  items.current[i] = el;
                }}
                href={v.id === latest.id ? "/" : versionPath(v)}
                role="menuitem"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded px-2.5 py-2 outline-none transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] ${
                  isCurrent ? "text-bright" : "text-muted"
                }`}
              >
                <span className="w-8">v{v.id}</span>
                <span className="flex-1">{v.name}</span>
                <span className="text-faint">{v.date}</span>
              </Link>
            );
          })}
        </div>
      )}
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Site version ${current}. Switch version`}
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-white/10 bg-black px-3 py-1.5 text-bright outline-none transition-colors hover:border-white/25 focus-visible:border-white/40"
      >
        v{current}
      </button>
    </div>
  );
}
