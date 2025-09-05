module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'boundaries'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      typescript: {},
    },
    'boundaries/elements': [
      {
        type: 'shared',
        pattern: './src/shared/**',
      },
      {
        type: 'common',
        pattern: './src/modules/Common/**',
      },
      {
        type: 'modules',
        pattern: './src/modules/**',
      },
      {
        type: 'features',
        pattern: './src/modules/*/features/**',
      },
      {
        type: 'adapters',
        pattern: './src/modules/*/adapters/**',
      },
      {
        type: 'models',
        pattern: './src/modules/*/models.ts',
      },
      {
        type: 'ui',
        pattern: './src/modules/*/ui/**',
      },
      {
        type: 'widgets',
        pattern: './src/modules/*/widgets/**',
      },
      {
        type: 'screens',
        pattern: './src/screens/**',
      },
      {
        type: 'navigation',
        pattern: './src/navigation/**',
      },
    ],
  },
  rules: {
    'no-console': 'warn',
    'no-param-reassign': 'off',
    'global-require': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'default-case': 'off',
    'consistent-return': 'off',
    curly: ['error', 'all'],
    'no-negated-condition': 'error',
    'no-unneeded-ternary': 'error',
    'require-await': 'error',
    'func-style': ['error', 'expression'],
    'id-denylist': ['error', 'e', 'cb', 'i', 'err', 'el'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      { blankLine: 'always', prev: ['case', 'default'], next: '*' },
    ],
    'linebreak-style': 0,
    'import/prefer-default-export': 0,
    'react/function-component-definition': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.*',
          '**/*.spec.*',
          '**/test/**',
          '**/tests/**',
          '**/__tests__/**',
          '**/scripts/**',
          '**/src/shared/hooks/useDebug.ts',
        ],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-underscore-dangle': 0,
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-shadow': ['off'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: ['modules'],
            allow: ['shared', 'common'],
            message: 'Modules can import from shared and common',
          },
          {
            from: ['common'],
            allow: ['shared'],
            message: 'Common can import from shared',
          },
          {
            from: ['navigation'],
            allow: ['modules'],
            message: 'Navigation can import from modules',
          },
          {
            from: ['ui'],
            disallow: ['features'],
            message: 'Only Compose components can use feature hooks',
          },
          {
            from: ['widgets'],
            allow: ['features'],
            message: 'Only Compose components can use feature hooks',
          },
          {
            from: [
              'features',
              'adapters',
              'models',
              'ui',
              'widgets',
              'screens',
              'navigation',
            ],
            allow: ['shared'],
            message: 'Modules can import from shared',
          },
          {
            from: [
              'features',
              'adapters',
              'models',
              'ui',
              'widgets',
              'screens',
              'navigation',
            ],
            allow: ['common'],
            message: 'Modules can import from modules/Common',
          },
          {
            from: [
              'features',
              'adapters',
              'models',
              'ui',
              'widgets',
              'screens',
            ],
            disallow: ['modules'],
            message:
              'Modules cannot import submodules from other modules except Common',
          },
          {
            from: ['features'],
            allow: ['shared', 'adapters'],
            message:
              'Features can only use shared modules and adapters for data transformation',
          },
          {
            from: ['adapters'],
            allow: ['shared'],
            message:
              'Adapters can only use shared modules for data transformation',
          },
          {
            from: ['models'],
            disallow: [
              'shared',
              'features',
              'adapters',
              'ui',
              'widgets',
              'screens',
              'navigation',
            ],
            message:
              'Models can only contain UI interfaces/types with UI prefix and cannot import from other layers',
          },
          {
            from: ['ui'],
            allow: ['models'],
            disallow: [
              'shared',
              'features',
              'adapters',
              'widgets',
              'screens',
              'navigation',
            ],
            message:
              'UI components can only use local models and cannot use features or other modules',
          },
          {
            from: ['widgets'],
            allow: ['ui', 'features', 'models'],
            disallow: ['adapters', 'screens', 'navigation'],
            message:
              'Widgets can use UI components, features, and models, but not adapters',
          },
          {
            from: ['screens'],
            allow: ['widgets'],
            disallow: ['ui', 'features', 'adapters', 'models'],
            message: 'Screens can only use widgets',
          },
          {
            from: ['navigation'],
            allow: ['screens', 'shared'],
            disallow: ['ui', 'features', 'adapters', 'models', 'widgets'],
            message: 'Navigation can only use screens and shared modules',
          },
          {
            from: ['shared'],
            allow: ['shared'],
            message: 'Shared modules can only use other shared modules',
          },
        ],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '../features',
              '../features/*',
              './features',
              './features/*',
              '**/features',
              '**/features/*',
            ],
            message:
              'Only Compose components and module index files can use feature hooks',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*Compose*.tsx'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      files: ['**/modules/*/index.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      files: ['**/modules/*/@*/index.ts'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
