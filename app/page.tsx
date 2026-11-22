import { V2Home } from "./_versions/v2/home";
import { personJsonLd } from "./content";
import { VersionSwitcher } from "./version-switcher";

// The homepage always shows the newest version (see versions.ts).
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <V2Home />
      <VersionSwitcher current="2" />
    </>
  );
}
