/**
 * Rig data for the characters taken from the provided picture pack.
 * Coordinates are fractions of the cut-out PNG (0..1).
 */
export type FaceRig = {
	eyes: [number, number][];
	erx: number; // eye half-width  (fraction of image width)
	ery: number; // eye half-height (fraction of image height)
	mouth: [number, number];
	mw: number; // mouth width (fraction of image width)
	skin: string; // patch colour around the mouth
	lid: string; // eyelid colour
	line: string; // outline colour
};

export type Rig = {
	src: string;
	w: number;
	h: number;
	neck: number; // y of the head/body cut
	neckX?: number;
	face?: FaceRig;
	/** custom head polygon (drawn layer) and hole (removed from body) */
	head?: [number, number][];
	hole?: [number, number][];
	pivot?: [number, number];
	/** extra drawing on the head (e.g. police cap) */
	hat?: 'policeFront' | 'policeSide';
};

export type CharDef = {
	name: string; // Bangla name for captions
	color: string;
	height: number; // standing height on stage in px
	front?: Rig;
	side?: Rig;
	svg?: 'dog' | 'hen' | 'cat' | 'frog';
};

const OUT = '#2a1810';

export const CHARS: Record<string, CharDef> = {
	kalam: {
		name: 'কালাম চাচা',
		color: '#b8742f',
		height: 600,
		front: {
			src: 'chars/kalam_front.png', w: 240, h: 873, neck: 0.3,
			face: {eyes: [[0.33, 0.155], [0.66, 0.155]], erx: 0.098, ery: 0.031, mouth: [0.48, 0.258], mw: 0.15,
				skin: 'rgb(191,145,103)', lid: 'rgb(176,128,90)', line: OUT},
		},
		side: {src: 'chars/kalam_side.png', w: 238, h: 877, neck: 0.305, neckX: 0.5},
	},
	suman: {
		name: 'সুমন ভাই (পুলিশ)',
		color: '#2d4f9e',
		height: 615,
		front: {
			src: 'chars/suman_front.png', w: 270, h: 882, neck: 0.31,
			face: {eyes: [[0.34, 0.188], [0.65, 0.188]], erx: 0.088, ery: 0.029, mouth: [0.49, 0.256], mw: 0.3,
				skin: 'rgb(230,152,86)', lid: 'rgb(230,148,80)', line: OUT},
			hat: 'policeFront',
		},
		side: {src: 'chars/suman_side.png', w: 228, h: 880, neck: 0.313, neckX: 0.5, hat: 'policeSide'},
	},
	ayesha: {
		name: 'আয়েশা',
		color: '#c0392b',
		height: 425,
		front: {
			src: 'chars/ayesha_front.png', w: 262, h: 878, neck: 0.281,
			face: {eyes: [[0.333, 0.15], [0.667, 0.15]], erx: 0.1, ery: 0.034, mouth: [0.5, 0.236], mw: 0.2,
				skin: 'rgb(214,144,96)', lid: 'rgb(214,144,96)', line: OUT},
		},
		side: {src: 'chars/ayesha_side.png', w: 224, h: 876, neck: 0.273, neckX: 0.5},
	},
	tanim: {
		name: 'তানিম',
		color: '#13897d',
		height: 435,
		front: {
			src: 'chars/tanim_front.png', w: 315, h: 828, neck: 0.356,
			face: {eyes: [[0.335, 0.235], [0.665, 0.235]], erx: 0.078, ery: 0.027, mouth: [0.5, 0.31], mw: 0.2,
				skin: 'rgb(186,115,69)', lid: 'rgb(184,112,66)', line: OUT},
		},
		side: {src: 'chars/tanim_side.png', w: 321, h: 828, neck: 0.36, neckX: 0.5},
	},
	nanu: {
		name: 'নানু',
		color: '#2a9d8f',
		height: 520,
		front: {
			src: 'chars/nanu.png', w: 456, h: 998, neck: 0.37, neckX: 0.52,
			face: {eyes: [[0.373, 0.235], [0.669, 0.235]], erx: 0.072, ery: 0.031, mouth: [0.53, 0.315], mw: 0.17,
				skin: 'rgb(205,122,91)', lid: 'rgb(222,132,100)', line: OUT},
		},
	},
	lali: {
		name: 'লালি',
		color: '#b5562b',
		height: 470,
		front: {
			src: 'chars/lali.png', w: 772, h: 723, neck: 0.42,
			face: {eyes: [[0.725, 0.203], [0.872, 0.203]], erx: 0.021, ery: 0.019, mouth: [0.8, 0.348], mw: 0.085,
				skin: 'rgb(214,150,140)', lid: 'rgb(186,96,52)', line: '#3a1a0c'},
			head: [[0.55, 0], [1, 0], [1, 0.42], [0.9, 0.5], [0.8, 0.54], [0.7, 0.52], [0.64, 0.4], [0.6, 0.28], [0.54, 0.14]],
			hole: [[0.57, 0], [1, 0], [1, 0.4], [0.88, 0.44], [0.8, 0.46], [0.74, 0.4], [0.68, 0.3], [0.62, 0.2], [0.56, 0.14]],
			pivot: [0.74, 0.43],
		},
	},
	bhola: {name: 'ভোলা', color: '#d4892f', height: 215, svg: 'dog'},
	kukku: {name: 'কুক্কু', color: '#e0562b', height: 165, svg: 'hen'},
	mini: {name: 'মিনি', color: '#7e6bb3', height: 185, svg: 'cat'},
	frog: {name: 'ব্যাঙ', color: '#3d9a3d', height: 90, svg: 'frog'},
	all: {name: 'সবাই', color: '#e67e22', height: 0},
	kids: {name: 'তানিম ও আয়েশা', color: '#16a085', height: 0},
	narrator: {name: '', color: '#444', height: 0},
};
