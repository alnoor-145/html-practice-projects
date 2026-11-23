import {continueRender, delayRender, staticFile} from 'remotion';

export const FONT = "'Baloo Da 2', 'Noto Sans Bengali', sans-serif";
const BN = 'U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1';

let started = false;
export const loadFonts = () => {
	if (started || typeof window === 'undefined') return;
	started = true;
	const handle = delayRender('Loading Baloo Da 2 font');
	const faces: FontFace[] = [];
	for (const w of ['600', '800']) {
		faces.push(new FontFace('Baloo Da 2', `url(${staticFile(`fonts/baloo-da-2-bengali-${w}-normal.woff2`)}) format('woff2')`, {weight: w, unicodeRange: BN}));
		faces.push(new FontFace('Baloo Da 2', `url(${staticFile(`fonts/baloo-da-2-latin-${w}-normal.woff2`)}) format('woff2')`, {weight: w}));
	}
	Promise.all(faces.map((f) => f.load().then((ff) => (document.fonts as unknown as {add: (x: FontFace) => void}).add(ff))))
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
};
