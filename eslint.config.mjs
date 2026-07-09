import domdomegg from 'eslint-config-domdomegg';
import next from '@next/eslint-plugin-next';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
	{
		ignores: ['.next/**', 'out/**', 'next-env.d.ts'],
	},
	{
		plugins: {
			'@next/next': next,
		},
		rules: {
			...next.configs.recommended.rules,
			...next.configs['core-web-vitals'].rules,
		},
	},
	...domdomegg,
	{
		rules: {
			'react-hooks/exhaustive-deps': ['warn', {
				additionalHooks: '(useButtonListener)',
			}],
		},
	},
];
