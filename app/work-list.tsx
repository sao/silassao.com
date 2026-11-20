"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import { useRef, type FocusEvent } from "react";
import { CompanyLogo } from "./company-logo";

type Role = {
  company: string;
  title: string;
  years: string;
  href: string;
};

const CIRCLE = 36; // logo circle diameter
const INSET = 12; // row's horizontal padding, where the circle sits

// One fill is shared by the whole list. It spills out of the logo circle of the
// row you enter, slides between rows as you move (leading edge first, trailing
// edge catching up, so it stretches like liquid), and drains back into the
// circle of the last row when you leave.
export function WorkList({ roles }: { roles: Role[] }) {
  const rows = useRef<(HTMLAnchorElement | null)[]>([]);
  const current = useRef<number | null>(null);
  const expanded = useRef(false);
  const reduce = useReducedMotion();

  const top = useMotionValue(0);
  const bottom = useMotionValue(0);
  const left = useMotionValue(0);
  const width = useMotionValue(0);
  const radius = useMotionValue(CIRCLE / 2);
  const opacity = useMotionValue(0);
  const height = useTransform(() => bottom.get() - top.get());

  const spring = (stiffness: number, damping: number): Transition =>
    reduce ? { duration: 0 } : { type: "spring", stiffness, damping };

  function rowBox(i: number) {
    const el = rows.current[i]!;
    return { t: el.offsetTop, h: el.offsetHeight, l: el.offsetLeft, w: el.offsetWidth };
  }

  function circleBox(i: number) {
    const r = rowBox(i);
    const t = r.t + r.h / 2 - CIRCLE / 2;
    return { t, b: t + CIRCLE, l: r.l + INSET, w: CIRCLE };
  }

  function enter(i: number) {
    const prev = current.current;
    const wasExpanded = expanded.current;

    // Coming in from outside the list: start from this row's own circle.
    if (!wasExpanded && prev !== i) {
      const c = circleBox(i);
      top.jump(c.t);
      bottom.jump(c.b);
      left.jump(c.l);
      width.jump(c.w);
      radius.jump(CIRCLE / 2);
    }
    opacity.jump(1);
    current.current = i;
    expanded.current = true;

    const r = rowBox(i);
    const movingDown = wasExpanded && prev !== null && i > prev;
    const movingUp = wasExpanded && prev !== null && i < prev;
    const lead = spring(520, 42);
    const trail = spring(200, 24);
    const settle = spring(320, 32);

    animate(top, r.t, movingUp ? lead : movingDown ? trail : settle);
    animate(bottom, r.t + r.h, movingDown ? lead : movingUp ? trail : settle);
    animate(left, r.l, spring(140, 22));
    animate(width, r.w, spring(90, 18));
    animate(radius, 4, spring(220, 30));
  }

  function leave() {
    if (current.current === null || !expanded.current) return;
    expanded.current = false;
    const c = circleBox(current.current);
    const drain = spring(380, 40);
    animate(top, c.t, drain);
    animate(bottom, c.b, drain);
    animate(left, c.l, drain);
    animate(width, c.w, drain);
    animate(radius, CIRCLE / 2, drain);
  }

  function blur(e: FocusEvent<HTMLAnchorElement>) {
    // Tabbing between rows should glide, not drain and refill.
    if (rows.current.includes(e.relatedTarget as HTMLAnchorElement)) return;
    leave();
  }

  return (
    <ul onPointerLeave={leave} className="relative isolate space-y-1">
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 bg-raised"
        style={{ top, left, width, height, borderRadius: radius, opacity }}
      />
      {roles.map((r, i) => (
        <li key={r.company}>
          <a
            ref={(el) => {
              rows.current[i] = el;
            }}
            href={r.href}
            target="_blank"
            onPointerEnter={() => enter(i)}
            onFocus={() => enter(i)}
            onBlur={blur}
            className="-mx-3 flex items-center gap-4 rounded py-3 pr-5 pl-3 outline-none"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-raised text-bright">
              <CompanyLogo company={r.company} className="h-[18px] w-[18px]" />
            </span>
            <span className="flex flex-1 items-center justify-between gap-4">
              <span className="flex flex-col">
                <span className="text-sm text-bright">{r.company}</span>
                <span className="text-sm text-muted">{r.title}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">{r.years}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
