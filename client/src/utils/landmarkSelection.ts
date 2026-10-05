import type { Landmark } from '../types/cart';

export interface LandmarkCandidate {
  landmark: Landmark;
  // 1 = major landmarks (schools, stations, hospitals...), 2 = everyday places (banks, shops...)
  tier: 1 | 2;
  // Kinds of place that serve the same purpose for a rider (school/college -> 'education')
  group: string;
  lat: number;
  lng: number;
}

// A second landmark from the same group is only worth showing if it is clearly a different place
const MIN_SECOND_LANDMARK_GAP_M = 75;
// Words that don't help tell two names apart ("Darus Salam Maha Vidyalaya" vs "Darus Salam Vidyalaya")
const NAME_FILLER = new Set(['the', 'of', 'and', 'maha', 'vidyalaya', 'vidyalayam', 'school', 'college', 'university']);

export const distanceInMetres = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
};

const nameTokens = (name: string): Set<string> => {
  const words = name
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean);
  const meaningful = words.filter(word => !NAME_FILLER.has(word));
  // A name made only of filler words ("Maha Vidyalaya") falls back to its own words
  return new Set(meaningful.length > 0 ? meaningful : words);
};

// True when one name's distinctive words are all contained in the other's
const areSimilarNames = (a: string, b: string): boolean => {
  const tokensA = nameTokens(a);
  const tokensB = nameTokens(b);
  if (tokensA.size === 0 || tokensB.size === 0) return false;
  return [...tokensA].every(t => tokensB.has(t)) || [...tokensB].every(t => tokensA.has(t));
};

// Picks the most useful few landmarks from everything found near the pin:
// 1. drops repeats - identical names, and near-identical names within the same group
// 2. keeps only the nearest landmark of each group, so a rider gets different anchors
//    (a school, a mosque, a bank) rather than two schools side by side
export const selectLandmarks = (candidates: LandmarkCandidate[], max = 3): Landmark[] => {
  const byDistance = [...candidates].sort((a, b) => a.landmark.distance - b.landmark.distance);

  // Rule 1: walking nearest-first means the nearest of any duplicate group survives
  const distinct: LandmarkCandidate[] = [];
  for (const candidate of byDistance) {
    const isRepeat = distinct.some(kept =>
      kept.landmark.name.toLowerCase() === candidate.landmark.name.toLowerCase() ||
      (kept.group === candidate.group && areSimilarNames(kept.landmark.name, candidate.landmark.name))
    );
    if (!isRepeat) distinct.push(candidate);
  }

  const ranked = distinct.sort((a, b) => a.tier - b.tier || a.landmark.distance - b.landmark.distance);

  // Rule 2: one per group
  const picked: LandmarkCandidate[] = [];
  const usedGroups = new Set<string>();
  for (const candidate of ranked) {
    if (picked.length >= max) break;
    if (usedGroups.has(candidate.group)) continue;
    picked.push(candidate);
    usedGroups.add(candidate.group);
  }

  // Too few distinct groups around: allow a second landmark of a group, but only a clearly separate one
  if (picked.length < 2) {
    for (const candidate of ranked) {
      if (picked.length >= 2) break;
      if (picked.includes(candidate)) continue;
      const farFromSameGroup = picked
        .filter(p => p.group === candidate.group)
        .every(p => distanceInMetres(p, candidate) > MIN_SECOND_LANDMARK_GAP_M);
      if (farFromSameGroup) picked.push(candidate);
    }
  }

  return picked
    .sort((a, b) => a.tier - b.tier || a.landmark.distance - b.landmark.distance)
    .map(candidate => candidate.landmark);
};
