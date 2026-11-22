import { llmsTxt } from "../content";

// Written to /llms.txt at build time (the site is a static export).
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
