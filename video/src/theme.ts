import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Palette and type from the Kesh Atelier website itself.
export const C = {
  ink: '#171412',
  ink2: '#1f1b18',
  paper: '#f6f2eb',
  gold: '#c6a165',
  goldDeep: '#8a6a34',
  fg: '#f2ece4',
  mist: '#aaa197',
  line: 'rgba(242,236,228,.14)',
  bad: '#e0806a',
};
export const F = {
  display: '"Playfair Display", Georgia, serif',
  body: '"Instrument Sans", "Helvetica Neue", Arial, sans-serif',
  mono: '"DM Mono", ui-monospace, Menlo, monospace',
};

const faces: [string, string, string, string][] = [
  ['Playfair Display', 'playfair-display-latin-400-normal.woff2', '400', 'normal'],
  ['Playfair Display', 'playfair-display-latin-500-normal.woff2', '500', 'normal'],
  ['Playfair Display', 'playfair-display-latin-400-italic.woff2', '400', 'italic'],
  ['Playfair Display', 'playfair-display-latin-500-italic.woff2', '500', 'italic'],
  ['Instrument Sans', 'instrument-sans-latin-400-normal.woff2', '400', 'normal'],
  ['Instrument Sans', 'instrument-sans-latin-500-normal.woff2', '500', 'normal'],
  ['Instrument Sans', 'instrument-sans-latin-600-normal.woff2', '600', 'normal'],
  ['DM Mono', 'dm-mono-latin-400-normal.woff2', '400', 'normal'],
  ['DM Mono', 'dm-mono-latin-500-normal.woff2', '500', 'normal'],
];
faces.forEach(([family, file, weight, style]) => {
  loadFont({family, url: staticFile(`fonts/${file}`), weight, style});
});
