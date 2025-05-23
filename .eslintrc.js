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
        type: 'api',
        pattern: './src/shared/api/**',
      },
      {
        type: 'hooks',
        pattern: './src/shared/hooks/**',
      },
      {
        type: 'lib',
        pattern: './src/shared/lib/**',
      },
      {
        type: 'services',
        pattern: './src/shared/services/**',
      },
      {
        type: 'stores',
        pattern: './src/shared/stores/**',
      },
      {
        type: 'themes',
        pattern: './src/shared/themes/**',
      },
      {
        type: 'types',
        pattern: './src/shared/types/**',
      },
      {
        type: 'ui',
        pattern: './src/shared/ui/**',
      },
      {
        type: 'features',
        pattern: './src/features/**',
      },
      {
        type: 'widgets',
        pattern: './src/widgets/**',
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
        devDependencies: false,
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
            from: ['ui'],
            allow: ['themes', 'types', 'hooks', 'lib'],
            disallow: [
              'api',
              'services',
              'stores',
              'translations',
              'features',
              'widgets',
              'screens',
              'navigation',
            ],
            message:
              'UI components are restricted to import only themes, types, hooks.',
          },
          {
            from: ['services'],
            allow: ['types', 'translations', 'themes'],
            disallow: [
              'api',
              'lib',
              'stores',
              'translations',
              'features',
              'widgets',
              'screens',
              'navigation',
            ],
            message:
              'Services are restricted to import only types, translations, themes.',
          },
          {
            from: ['types'],
            allow: [
              'api',
              'services',
              'hooks',
              'lib',
              'stores',
              'translations',
              'themes',
            ],
          },
          {
            from: ['api'],
            allow: ['hooks', 'types', 'stores', 'services'],
            disallow: [
              'lib',
              'ui',
              'themes',
              'translations',
              'features',
              'widgets',
              'screens',
              'navigation',
            ],
            message:
              'API layer is restricted to import only hooks, types, stores, services.',
          },
          {
            from: ['hooks'],
            allow: ['types', 'services', 'lib'],
            disallow: [
              'api',
              'translations',
              'themes',
              'stores',
              'ui',
              'features',
              'widgets',
              'screens',
              'navigation',
            ],
            message:
              'Hooks are restricted to import only types, themes, services.',
          },
          {
            from: ['lib'],
            allow: ['types', 'services'],
            disallow: [
              'api',
              'hooks',
              'lib',
              'translations',
              'stores',
              'ui',
              'features',
              'widgets',
              'screens',
              'navigation',
            ],
            message: 'Lib layer is restricted to import only types, services.',
          },
          {
            from: ['stores'],
            allow: ['types'],
            disallow: [
              'api',
              'hooks',
              'lib',
              'services',
              'translations',
              'themes',
              'ui',
              'features',
              'widgets',
              'screens',
              'navigation',
            ],
            message: 'Stores layer is restricted to import only types.',
          },
          {
            from: ['themes'],
            allow: ['types'],
            disallow: [
              'api',
              'hooks',
              'lib',
              'services',
              'translations',
              'stores',
              'ui',
              'features',
              'widgets',
              'screens',
              'navigation',
            ],
            message: 'Themes layer is restricted to import only types.',
          },
          {
            from: ['features'],
            allow: [
              'api',
              'hooks',
              'lib',
              'services',
              'stores',
              'themes',
              'translations',
              'types',
              'ui',
            ],
            disallow: ['widgets', 'screens', 'navigation'],
            message:
              'Features layer is restricted to import everything from shared layer.',
          },
          {
            from: ['widgets'],
            allow: [
              'features',
              'hooks',
              'lib',
              'services',
              'stores',
              'themes',
              'translations',
              'types',
              'ui',
            ],
            disallow: ['screens', 'navigation'],
            message:
              'Widgets layer is restricted to import everything from shared/features layers.',
          },
          {
            from: ['screens'],
            allow: [
              'features',
              'widgets',
              'hooks',
              'lib',
              'services',
              'stores',
              'themes',
              'translations',
              'types',
              'ui',
            ],
            disallow: ['navigation'],
            message:
              'Screens layer is restricted to import everything from shared/features/widgets layers.',
          },
          {
            from: ['navigation'],
            allow: [
              'features',
              'widgets',
              'screens',
              'hooks',
              'lib',
              'services',
              'stores',
              'themes',
              'translations',
              'types',
              'ui',
            ],
            disallow: [],
            message:
              'Navigation layer is restricted to import everything from shared/features/widgets/screens layers.',
          },
        ],
      },
    ],
  },
};
