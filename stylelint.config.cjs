/*
 * @Author: iuukai
 * @Date: 2022-10-24 08:31:54
 * @LastEditors: iuukai
 * @LastEditTime: 2022-11-30 11:28:06
 * @FilePath: \gitsub\stylelint.config.cjs
 * @Description:
 * @QQ/微信: 790331286
 */
module.exports = {
	root: true,
	/* 改用 VSC - CSScomb 插件 */
	// plugins: ['stylelint-order'],
	customSyntax: 'postcss-html',
	extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
	rules: {
		'function-no-unknown': null,
		'selector-class-pattern': null,
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['global']
			}
		],
		'selector-pseudo-element-no-unknown': [
			true,
			{
				ignorePseudoElements: ['v-deep']
			}
		],
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'function',
					'if',
					'each',
					'include',
					'mixin'
				]
			}
		],
		'color-hex-case': 'lower',
		// 'color-function-notation': 'modern',
		'no-empty-source': null,
		'string-quotes': null,
		'named-grid-areas-no-invalid': null,
		'unicode-bom': 'never',
		'no-descending-specificity': null,
		'number-leading-zero': null,
		'font-family-no-missing-generic-family-keyword': null,
		'declaration-colon-space-after': 'always-single-line',
		'declaration-colon-space-before': 'never',
		'declaration-empty-line-before': null,
		// 'declaration-block-trailing-semicolon': 'always',
		'rule-empty-line-before': [
			'always',
			{
				ignore: ['after-comment', 'first-nested']
			}
		],
		'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }]
		/* stylelint-order */
		// 'order/order': [
		// 	[
		// 		'dollar-variables',
		// 		'custom-properties',
		// 		'at-rules',
		// 		'declarations',
		// 		{
		// 			type: 'at-rule',
		// 			name: 'supports'
		// 		},
		// 		{
		// 			type: 'at-rule',
		// 			name: 'media'
		// 		},
		// 		'rules'
		// 	],
		// 	{ severity: 'warning' }
		// ]
	},
	ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
	overrides: [
		{
			files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
			extends: ['stylelint-config-recommended', 'stylelint-config-html'],
			rules: {
				'keyframes-name-pattern': '-',
				'selector-pseudo-class-no-unknown': [
					true,
					{
						ignorePseudoClasses: ['deep', 'global']
					}
				],
				'selector-pseudo-element-no-unknown': [
					true,
					{
						ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
					}
				]
			}
		},
		{
			files: ['*.less', '**/*.less'],
			customSyntax: 'postcss-less',
			extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue']
		}
	]
}
