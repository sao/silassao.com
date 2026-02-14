import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="text-xl font-medium lowercase mb-4 mt-8" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-lg font-medium lowercase mb-3 mt-6" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-base font-medium lowercase mb-2 mt-4" {...props} />
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-fg-subtle underline-offset-3 hover:decoration-fg transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="underline decoration-fg-subtle underline-offset-3 hover:decoration-fg transition-colors"
        {...props}
      >
        {children}
      </Link>
    );
  },
};
