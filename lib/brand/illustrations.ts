// Re-export of the illustration pack from the synced design system.
//
// This file used to be a hand-maintained copy of the pack. It is now a binding:
// the drawings live in brand/brand.ts, which `npm run brand:sync` owns and
// `npm run brand:verify` checksums. Do not add marks here — add them to the
// pack in mustard-bio-brand, then bump the SHA in scripts/brand.manifest.json.
export { ILLO } from '@/brand/brand';
export type { IlloKind } from '@/brand/brand';
