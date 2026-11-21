"use client";

import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { latest, versionPath, versions } from "./versions";

// Opening is unhurried; closing gets out of the way faster.
const openSpring: Transition = { type: "spring", duration: 0.45, bounce: 0 };
const closeSpring: Transition = { type: "spring", duration: 0.28, bounce: 0 };

// The results grow open as their lines fade in top to bottom. On close the
// same thing runs backwards: the results collapse while their lines fade out
// bottom to top, so the query line glides down as each one goes.
const results: Variants = {
  hidden: {
    height: 0,
    transition: {
      ...closeSpring,
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
  shown: {
    height: "auto",
    transition: { ...openSpring, delayChildren: 0.1, staggerChildren: 0.06 },
  },
};
const row: Variants = {
  hidden: { opacity: 0, y: 4, transition: { duration: 0.1 } },
  shown: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

// open: panel out. closing: results collapsing, panel still full width.
// shrinking: panel narrowing back to the query pill. closed: the pill, which
// types between the version and the query as hover comes and goes.
type Phase = "closed" | "open" | "closing" | "shrinking";

// A small black pill in the bottom-right corner showing the current version.
// Hovering "types" it into a query, `SELECT * FROM versions;`: a caret
// backspaces the version and types the query out. Clicking "runs"
// it: the pill grows upward into a panel, the query rises to the top like a
// submitted command, and the versions come back underneath as its result.
// Closing plays the same steps backwards, then the query is "deleted" and the
// version retyped in its place.
export function VersionSwitcher({ current }: { current: string }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const open = phase === "open";
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const typing = phase === "shrinking" || phase === "closed";

  const close = () => setPhase((p) => (p === "open" ? "closing" : p));

  // Touch has no hover, so a tap plays the whole thing at once: type the
  // query quickly, then "run" it. Tapping again while it types skips ahead.
  const [tapping, setTapping] = useState(false);
  const pointerType = useRef("");
  const openMenu = () => {
    setTapping(false);
    setPhase("open");
  };
  function onButtonClick() {
    if (open) return close();
    if (pointerType.current === "touch" && !reduce && !tapping) {
      setTapping(true);
    } else {
      openMenu();
    }
  }

  const afterShrink = (p: Phase): Phase => (p === "shrinking" ? "closed" : p);

  // Fallback in case the narrowing animation never reports that it finished.
  useEffect(() => {
    if (phase !== "shrinking") return;
    const t = setTimeout(() => setPhase(afterShrink), 500);
    return () => clearTimeout(t);
  }, [phase]);

  // Close on a click outside.
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) close();
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
      close();
      if (e.key === "Escape") button.current?.focus();
    }
  }

  // On phones the pill is taller (42px) to be easier to tap, and sits 11px up
  // so its text lines up with the footer's copyright line once you scroll to
  // the bottom (that line is 16px tall and 24px up, so centered 32px up).
  return (
    <MotionConfig
      transition={open ? openSpring : closeSpring}
      reducedMotion="user"
    >
      <motion.div
        ref={root}
        layout
        style={{ borderRadius: 4 }}
        onLayoutAnimationComplete={() => setPhase(afterShrink)}
        className={`fixed right-4 bottom-[11px] z-50 sm:bottom-4 flex flex-col overflow-hidden border border-white/10 bg-black font-mono text-xs shadow-2xl ${
          open || phase === "closing" ? "w-64" : "w-auto"
        }`}
      >
        <motion.button
          ref={button}
          layout="position"
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Site version ${current}. Switch version`}
          onClick={onButtonClick}
          onPointerDown={(e) => (pointerType.current = e.pointerType)}
          onPointerEnter={(e) => {
            if (e.pointerType === "touch") return;
            setHovered(true);
          }}
          onPointerLeave={() => setHovered(false)}
          onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
          onBlur={() => setFocused(false)}
          className="px-4 py-3 text-left sm:px-3 sm:py-1.5 whitespace-nowrap text-bright outline-none"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={typing ? "typing" : "query"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="block"
            >
              {typing ? (
                <Retype
                  to={`v${current}`}
                  // Mounted while shrinking: starts on the query. Mounted
                  // closed (page load): starts on the version, unless the
                  // pill is already hovered or focused.
                  startOnQuery={phase === "shrinking" || hovered || focused}
                  run={phase === "closed"}
                  forward={!hovered && !focused && !tapping}
                  instant={!!reduce}
                  fast={tapping}
                  onQueryTyped={tapping ? openMenu : undefined}
                />
              ) : (
                QUERY.map((part) => (
                  <span key={part.text} className={part.className}>
                    {part.text}
                  </span>
                ))
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence
          initial={false}
          onExitComplete={() =>
            setPhase((p) =>
              p !== "closing" ? p : reduce ? "closed" : "shrinking",
            )
          }
        >
          {open && (
            <motion.div
              key="results"
              variants={results}
              initial="hidden"
              animate="shown"
              exit="hidden"
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 p-1 lowercase">
                <motion.div
                  variants={row}
                  aria-hidden="true"
                  className="flex gap-3 px-2.5 pt-1.5 pb-1 text-faint"
                >
                  <span className="w-8">id</span>
                  <span className="flex-1">name</span>
                  <span>date</span>
                </motion.div>
                <div
                  role="menu"
                  aria-label="Site versions"
                  onKeyDown={onMenuKey}
                >
                  {versions.map((v, i) => {
                    const isCurrent = v.id === current;
                    return (
                      <motion.div key={v.id} variants={row}>
                        <Link
                          ref={(el) => {
                            items.current[i] = el;
                          }}
                          href={v.id === latest.id ? "/" : versionPath(v)}
                          role="menuitem"
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={() => close()}
                          className={`flex items-center gap-3 rounded px-2.5 py-2 outline-none transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] ${
                            isCurrent ? "text-bright" : "text-muted"
                          }`}
                        >
                          <span className="w-8">v{v.id}</span>
                          <span className="flex-1">{v.name}</span>
                          <span className="text-faint">{v.date}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.div
                  variants={row}
                  aria-hidden="true"
                  className="px-2.5 pt-1 pb-1.5 text-faint"
                >
                  {versions.length} {versions.length === 1 ? "row" : "rows"}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}

// The query with its syntax colors. Keywords inherit the bright text color.
const QUERY = [
  { text: "SELECT ", className: undefined },
  { text: "*", className: "text-muted" },
  { text: " FROM ", className: undefined },
  { text: "versions", className: "text-muted" },
  { text: ";", className: "text-faint" },
];
const QUERY_CHARS = QUERY.flatMap((part) =>
  part.text.split("").map((ch) => ({ ch, className: part.className })),
);

// Typing toward the query (hover, tap) is the slower, deliberate direction.
const OPEN_CARET_MS = 450; // caret blinks before deleting the version
const OPEN_ERASE_MS = 70; // per character, backspacing the version
const OPEN_PAUSE_MS = 120; // empty line before typing the query
const OPEN_TYPE_MS = 30; // per character, typing the query

// Typing back to the version (close, hover out) is quicker.
const CLOSE_CARET_MS = 200; // caret blinks before deleting the query
const CLOSE_ERASE_MS = 22; // per character, backspacing the query
const CLOSE_PAUSE_MS = 80; // empty line before typing the version
const CLOSE_TYPE_MS = 35; // per character, typing the version

const HOLD_MS = 500; // caret blinks after typing, then goes away
const RESUME_MS = 200; // caret blinks when interrupted, before changing course

// A tap types the query at opening speed, with a shorter lead-in, then runs it.
const TAP_CARET_MS = 100;
const TAP_ENTER_MS = 120; // solid caret, as if Enter was pressed

// The pill's label, typed like a terminal. Going forward (not hovered), a
// block caret backspaces the query and types `to`; going backward (hovered or
// focused), it backspaces `to` and types the query. Flipping direction
// mid-way pauses where it is and heads the other way from there.
//
// Before `run` (while the panel is still narrowing), the caret's cell is
// reserved but invisible, so the pill stops one character short and the caret
// appears exactly where the text stopped. Characters are shown and hidden
// directly in the DOM rather than through React state, so the pill's width
// follows the text without a layout animation per keystroke.
function Retype({
  to,
  startOnQuery,
  run,
  forward,
  instant,
  fast,
  onQueryTyped,
}: {
  to: string;
  startOnQuery: boolean;
  run: boolean;
  forward: boolean;
  instant: boolean;
  fast: boolean;
  onQueryTyped?: () => void;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const total = QUERY_CHARS.length + to.length;
  // Read once: the starting text and caret must not change on re-render.
  const [onQueryAtMount] = useState(startOnQuery);
  // Keystrokes in: 0 is the full query, `total` is the full version.
  const pos = useRef(onQueryAtMount ? 0 : total);
  const queryTyped = useRef(onQueryTyped);
  useEffect(() => {
    queryTyped.current = onQueryTyped;
  });

  useEffect(() => {
    const el = root.current;
    if (!el || !run) return;
    const from = Array.from(el.querySelectorAll<HTMLElement>("[data-from]"));
    const next = Array.from(el.querySelectorAll<HTMLElement>("[data-to]"));
    const q = from.length;
    const caret = (state: "blink" | "solid" | "off") =>
      (el.dataset.caret = state);
    const show = (n: number) => {
      const k = Math.round(n);
      from.forEach((c, i) => (c.hidden = i >= q - k));
      next.forEach((c, i) => (c.hidden = i >= k - q));
    };

    const target = forward ? total : 0;
    if (instant || Math.round(pos.current) === target) {
      pos.current = target;
      show(target);
      caret("off");
      if (target === 0) queryTyped.current?.();
      return;
    }

    let cancelled = false;
    const stops: (() => void)[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        stops.push(() => clearTimeout(t));
      });
    const keystrokes = (end: number, msPerChar: number) => {
      const controls = animate(pos.current, end, {
        duration: (Math.abs(end - pos.current) * msPerChar) / 1000,
        ease: "linear",
        onUpdate: (n) => {
          pos.current = n;
          show(n);
        },
      });
      stops.push(() => controls.stop());
      return controls;
    };

    (async () => {
      caret("blink");
      const fresh = forward ? pos.current === 0 : pos.current === total;
      await wait(
        fast
          ? TAP_CARET_MS
          : !fresh
            ? RESUME_MS
            : forward
              ? CLOSE_CARET_MS
              : OPEN_CARET_MS,
      );
      if (cancelled) return;
      caret("solid");
      if (forward) {
        if (pos.current < q) {
          await keystrokes(q, CLOSE_ERASE_MS);
          if (cancelled) return;
          await wait(CLOSE_PAUSE_MS);
          if (cancelled) return;
        }
        await keystrokes(total, CLOSE_TYPE_MS);
      } else {
        if (pos.current > q) {
          await keystrokes(q, OPEN_ERASE_MS);
          if (cancelled) return;
          await wait(OPEN_PAUSE_MS);
          if (cancelled) return;
        }
        await keystrokes(0, OPEN_TYPE_MS);
        if (cancelled) return;
        if (fast) {
          await wait(TAP_ENTER_MS);
          if (cancelled) return;
          queryTyped.current?.();
          return;
        }
      }
      if (cancelled) return;
      caret("blink");
      await wait(HOLD_MS);
      if (cancelled) return;
      caret("off");
    })();

    return () => {
      cancelled = true;
      stops.forEach((stop) => stop());
    };
  }, [run, forward, instant, fast, total]);

  return (
    <span
      ref={root}
      data-caret={onQueryAtMount ? "waiting" : "off"}
      className="group/caret whitespace-pre"
    >
      {QUERY_CHARS.map((c, i) => (
        <span
          key={`f${i}`}
          data-from=""
          hidden={!onQueryAtMount}
          className={c.className}
        >
          {c.ch}
        </span>
      ))}
      {to.split("").map((ch, i) => (
        <span key={`t${i}`} data-to="" hidden={onQueryAtMount}>
          {ch}
        </span>
      ))}
      <span
        aria-hidden="true"
        className="ml-px inline-block h-[1.1em] w-[1ch] bg-muted align-[-0.2em] group-data-[caret=blink]/caret:animate-[caret-blink_0.8s_step-end_infinite] group-data-[caret=off]/caret:hidden group-data-[caret=waiting]/caret:invisible"
      />
    </span>
  );
}
