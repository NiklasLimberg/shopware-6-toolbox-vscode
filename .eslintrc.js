module.exports = {
    'root': true,
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
    },
    'plugins': [
        '@typescript-eslint',
    ],
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'ignorePatterns': [
        'out',
        'dist',
        '**/*.d.ts',
    ],
    'rules': {
        quotes: ['error', 'single', { 'avoidEscape': true }],
        'comma-dangle': ['error', 'always-multiline'],
        'semi': ['error', 'always'],
        'max-len': ['error', 125],
        'no-extra-semi': 'error',
        indent: ['error', 4],
        'no-undef': 0,
    },
};
