import type { Metadata } from "next";
import { V1Home } from "../_versions/v1/home";
import { VersionSwitcher } from "../version-switcher";

// An archived version: viewable and shareable, but kept out of search results.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <>
      <V1Home />
      <VersionSwitcher current="1" />
    </>
  );
}
