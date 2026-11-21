import { V2Home } from "./_versions/v2/home";
import { VersionSwitcher } from "./version-switcher";

// The homepage always shows the newest version (see versions.ts).
export default function Page() {
  return (
    <>
      <V2Home />
      <VersionSwitcher current="2" />
    </>
  );
}
