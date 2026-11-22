import type { MetadataRoute } from "next";
import { site } from "./content";

export const dynamic = "force-static";

// Everyone, including AI crawlers, is welcome. Archived versions opt out of
// search on their own pages (see app/v1/page.tsx).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
