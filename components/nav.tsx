"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const routes = [
  { key: "1", label: "home", href: "/" },
  { key: "2", label: "work", href: "/work" },
  { key: "3", label: "blog", href: "/blog" },
  { key: "4", label: "about", href: "/about" },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      const route = routes.find((r) => r.key === e.key);
      if (route) {
        router.push(route.href);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [router]);

  return (
    <nav className="mx-auto w-full max-w-[680px] px-5 pt-8 pb-4">
      <div className="flex items-center gap-1 text-sm font-mono text-fg-muted">
        {routes.map((route, i) => (
          <span key={route.key} className="flex items-center gap-1">
            {i > 0 && <span className="text-fg-subtle mx-1">/</span>}
            <Link
              href={route.href}
              className={`transition-colors hover:text-fg ${
                pathname === route.href ||
                (route.href !== "/" && pathname.startsWith(route.href))
                  ? "text-fg"
                  : ""
              }`}
            >
              <kbd className="kbd">{route.key}</kbd>
              <span className="ml-1">{route.label}</span>
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}
