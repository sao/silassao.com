// Every version of the site, newest first. The first entry is what "/" shows.
//
// Naming: a major number is a new concept (v1, v2); a minor number is a
// meaningful refinement of that concept worth comparing (v2.1). Copy edits and
// fixes update a version in place and don't get a new number.
export type Version = {
  id: string; // "2", "2.1"
  name: string; // one word, shown in the switcher
  date: string; // when it shipped, e.g. "nov 2026"
};

export const versions: Version[] = [
  { id: "2", name: "smoke", date: "nov 2026" },
  { id: "1", name: "init", date: "oct 2026" },
];

export const latest = versions[0];

// "/v2/", "/v2.1/". The newest version also lives at "/".
export function versionPath(v: Version) {
  return `/v${v.id}/`;
}
