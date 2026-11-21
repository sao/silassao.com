import type { Metadata } from "next";
import { V2Home } from "../_versions/v2/home";
import { VersionSwitcher } from "../version-switcher";

// Same as "/" while v2 is the newest; point search engines at "/".
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Page() {
  return (
    <>
      <V2Home />
      <VersionSwitcher current="2" />
    </>
  );
}
