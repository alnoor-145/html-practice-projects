import timeline from '../data/timeline.json';

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export type Word = [string, number, number];
export type Line = {speaker: string; text: string; start: number; end: number; words: Word[]};

export const LINES = timeline.lines as Line[];
export const MOUTH = timeline.mouth as string;
export const TOTAL_FRAMES = timeline.durationInFrames as number;
export const PART2_FRAME = Math.round((timeline.part2Offset as number) * FPS);

/** first frame of line i */
export const ls = (i: number) => Math.round(LINES[i].start * FPS);
/** last frame of line i */
export const le = (i: number) => Math.round(LINES[i].end * FPS);
/** start frame of word w of line i (negative w counts from the end) */
export const ws = (i: number, w: number) => {
	const words = LINES[i].words;
	const k = w < 0 ? words.length + w : w;
	return Math.round(words[Math.max(0, Math.min(words.length - 1, k))][1] * FPS);
};

/** group lines spoken by several characters at once */
export const GROUPS: Record<string, string[]> = {
	all: ['tanim', 'ayesha', 'kalam', 'suman'],
	kids: ['tanim', 'ayesha'],
};

const speaks = (line: Line, who: string) => line.speaker === who || (GROUPS[line.speaker]?.includes(who) ?? false);

export const lineAt = (g: number): Line | null => {
	const t = g / FPS;
	for (const l of LINES) {
		if (t >= l.start && t <= l.end) return l;
	}
	return null;
};

export const isSpeaking = (who: string, g: number) => {
	const l = lineAt(g);
	return !!l && speaks(l, who);
};

/** 0..1 mouth opening from the voice track for this character at global frame g */
export const mouthOf = (who: string, g: number) => {
	if (!isSpeaking(who, g)) return 0;
	const c = MOUTH.charCodeAt(Math.max(0, Math.min(MOUTH.length - 1, g))) - 48;
	return Math.max(0, Math.min(1, c / 9));
};

export const currentSpeaker = (g: number) => lineAt(g)?.speaker ?? null;
