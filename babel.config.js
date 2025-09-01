module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src/'],
        alias: [
          { navigation: './src/navigation' },
          { screens: './src/screens' },
          { widgets: './src/widgets' },
          { features: './src/features' },
          { types: './src/types' },
          { api: './src/shared/api' },
          { hooks: './src/shared/hooks' },
          { lib: './src/shared/lib' },
          { services: './src/shared/services' },
          { stores: './src/shared/stores' },
          { themes: './src/shared/themes' },
          { translations: './src/shared/translations' },
          { ui: './src/shared/ui' },
          { providers: './src/shared/providers' },
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    [
      'react-native-unistyles/plugin',
      {
        root: 'src',
      },
    ],
  ],
};
