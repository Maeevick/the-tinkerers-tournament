type Colors = {
	home: {
		light: string;
		dark: string;
	};
	away: {
		light: string;
		dark: string;
	};
	field: {
		light: string;
		dark: string;
		highlight: string;
	};
	stands: string;
};

export const COLORS: Colors = {
	home: {
		light: '#00a1de',
		dark: '#0081b1'
	},
	away: {
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

type GridDimension = {
	width: number;
	height: number;
};

export const GRID_DIMENSIONS: GridDimension = {
	width: 9,
	height: 24
};

export const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
