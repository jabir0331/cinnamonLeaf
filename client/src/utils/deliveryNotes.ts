import type { Landmark } from '../types/cart';

const LANDMARK_HEADER = 'Nearby landmarks:';

// Writes the landmarks into the delivery notes as a marked block at the top,
// replacing any block written for a previous pin. Text the user typed is left alone.
export const withLandmarkNote = (notes: string, landmarks: Landmark[]): string => {
  const lines = notes.split('\n');
  const kept: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === LANDMARK_HEADER) {
      while (i + 1 < lines.length && lines[i + 1].startsWith('• ')) i++;
      continue;
    }
    kept.push(lines[i]);
  }

  const userText = kept.join('\n').replace(/^\n+|\n+$/g, '');
  if (landmarks.length === 0) return userText;

  const block = [
    LANDMARK_HEADER,
    ...landmarks.map(l => `• ${l.name} (${l.kind}, ~${l.distance} m)`),
  ].join('\n');

  return userText ? `${block}\n\n${userText}` : block;
};
