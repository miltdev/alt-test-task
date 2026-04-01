// @ts-check

import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(eslint.configs.recommended, ...tsEslint.configs.recommended, {
    rules: {
        semi: 'off',
        '@/semi': ['error', 'always'],
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'no-trailing-spaces': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
    },
});
