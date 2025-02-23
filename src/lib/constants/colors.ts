export type Colors = {
	home: {
		highlight: string;
		light: string;
		dark: string;
	};
	away: {
		highlight: string;
		light: string;
		dark: string;
	};
	field: {
		highlight: string;
		light: string;
		dark: string;
	};
	stands: string;
};
export const COLORS: Colors = {
	home: {
		highlight: '#66d6ff',
		light: '#00a1de',
		dark: '#0081b1'
	},
	away: {
		highlight: '#ed78d5',
		light: '#e22fbd',
		dark: '#b5249a'
	},
	field: {
		light: '#9db167',
		dark: '#7a8c52',
		highlight: '#cbd5e0'
	},
	stands: '#f0f0f0'
};
