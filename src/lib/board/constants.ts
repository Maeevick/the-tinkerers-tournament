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

export const ROWS = [
	'',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'24',
	''
];
export const COLUMNS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', ''];

type GridDimension = {
	width: number;
	height: number;
};

export const GRID_DIMENSIONS: GridDimension = {
	width: COLUMNS.length - 2,
	height: ROWS.length - 2
};
