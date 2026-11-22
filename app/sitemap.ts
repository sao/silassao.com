import type { MetadataRoute } from "next";
import { site } from "./content";

export const dynamic = "force-static";

// Only the homepage: /v2/ points search engines at "/" and /v1/ is archived.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.url}/` }];
}
