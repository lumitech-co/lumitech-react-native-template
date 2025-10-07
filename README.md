<div align="center">
 <img width="500" src="https://github.com/user-attachments/assets/5083ad51-e604-4e2f-949a-e29a2be4bd73" />
</div>

# [Lumitech](https://lumitech.co/) React Native Template 🌌

Welcome to the **Lumitech React Native Template (v0.79.0)**! This template is designed to give you a head start on your project by streamlining the setup process and enabling you to focus on building your app faster. 🌟

### About Lumitech

[Lumitech](https://lumitech.co/) is a custom software development company providing professional services worldwide. We partner with technology businesses globally helping them to build successful engineering teams and create innovative software products. We’re a global team of software engineers, AI and ML specialists, product managers, and technology experts who have achieved a 600% growth rate since 2022. When a rocket launches toward the moon, it doesn’t stop halfway. Neither do we

### What’s New?

We’ve integrated the latest features from React Native to ensure your project is future-proof and up to date with the latest industry standards.

- **New Architecture Support**: We are smoothly transitioning to support the **new architecture** in React Native, which will bring significant performance improvements and flexibility in the future. Stay tuned as we continue rolling out more updates to align with React Native’s evolving architecture.
- **Yarn as the Main Package Manager**: From now on, **Yarn** will be the primary package manager for this template. Yarn offers better dependency management and speed, ensuring that your workflows are as efficient as possible.

- **Yoga Engine Updates**: This version includes updates to the **Yoga layout engine**, improving the performance of layout calculations and ensuring compatibility with modern devices and use cases.

### Post-Setup Instructions

After initializing your project using this template, there are a few additional steps needed to fully set up your environment. These will be documented in detail below.

For more information about what’s new in React Native 0.79.0, you can check out the official [release notes](https://reactnative.dev/blog/2025/04/08/react-native-0.79).

By using this template, you’re laying a solid foundation for your project, ready to embrace the future improvements of React Native!

## Yarn 3 for New Projects 🧶

Starting with this template, **Yarn 3** is now the default JavaScript package manager for projects initialized with the React Native Community CLI. This upgrade brings enhanced performance and improved workflows for managing your dependencies.

### Why Yarn 3?

- **Yarn 3.x** is used with the `nodeLinker: node-modules` setting, ensuring compatibility with React Native libraries.
- It replaces **Yarn Classic (1.x)**, which is now deprecated, and offers faster installs and better dependency management.
- The new Yarn version simplifies package management and reduces potential conflicts in your project.

### How to Upgrade to Yarn 3

If you're working on an existing project and want to upgrade to Yarn 3, you can follow the official Yarn [documentation](https://yarnpkg.com/migration/guide) for a smooth transition.

```bash
$ yarn --help
━━━ Yarn Package Manager - 4.10.3 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  $ yarn <command>
```

Enable corepack and prepare Yarn 3 for your project:

```sh
- corepack enable
- corepack prepare yarn@latest --activate
- yarn set version 4.10.3
- yarn --version
- yarn install
```

### Built With

- [react-native 0.79.0](https://reactnative.dev/blog/2025/04/08/react-native-0.79)

- [typescript](https://www.typescriptlang.org/)

- [react-navigation](https://reactnavigation.org/)

- [@legendapp/state](https://legendapp.com/open-source/state/v3/intro/introduction/)

- [@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview)

- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)

- [react-native-keyboard-controller](https://kirillzyusko.github.io/react-native-keyboard-controller/)

- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)

- [react-native-unistyles](https://reactnativeunistyles.vercel.app/)

- [react-native-skia](https://shopify.github.io/react-native-skia/)

- [react-native-modalfy](https://colorfy-software.gitbook.io/react-native-modalfy)

### Inspired by

- [Feature Sliced Architecture](https://feature-sliced.design/en/)

## 📁 Project Structure

The project follows a custom Feature Sliced Design (FSD) architecture, promoting modular design and clear separation of concerns:

#### `src/shared`:

Common resources and utilities used across the entire application.

- **`api`**: API client configuration, base HTTP services, and endpoint definitions
- **`lib`**: Third-party library integrations and abstractions (React Query, MMKV, Reanimated), Helper functions, formatters, validators, and common utilities
- **`ui`**: Reusable UI components and design system elements
- **`common`**: All reusable business logic that can be shared across modules

#### `src/modules`:

Feature-based modules that encapsulate complete business domains. Each module follows a strict layering pattern:

**Module Structure:**

- **`features/`**: Contains all business logic for the module

  - Handles data fetching, state management, and business rules
  - Implements use cases and domain-specific operations
  - Manages module-specific state and side effects

- **`adapters/`**: Data transformation layer that adapts business data to UI format

  - Converts API responses to UI-friendly data structures
  - Handles data mapping and transformation logic
  - Bridges the gap between business logic and presentation

- **`ui/`**: Dumb UI components that focus purely on presentation

  - Stateless components that receive props and render UI
  - Can include local `models.ts` files for component-specific interfaces
  - No business logic or external data fetching

- **`widgets/`**: Composed components that combine features with UI (must use "Compose" naming)

  - Examples: `UserProfileCompose`, `ProductListCompose`, `CartSummaryCompose`
  - Orchestrates features and spreads data to UI components
  - Acts as a bridge between business logic and presentation components

- **`screens/`**: Top-level screen components that can only use widgets
  - Represents complete application screens
  - Composes widgets to create full user interfaces
  - Handles screen-specific navigation and layout

#### `src/navigation`:

Navigation configuration and routing logic.

- Navigation stacks, tab navigators, and routing configuration
- Deep linking setup and navigation utilities
- Screen parameter types and navigation helpers

#### `src/assets`:

Static assets organized by type for easy management and optimization.

- **`fonts/`**: Custom fonts including IcoMoon icon fonts
- **`images/`**: SVG and raster images used throughout the app
- **`resources/`**: Configuration files like IcoMoon selection.json for icon generation
- **`bootsplash/`**: Generated splash screen assets for iOS and Android

#### Project Tree:

```
.
├── App.tsx
├── android/
├── ios/
├── scripts/
│   ├── api-codegen/
│   ├── icons.sh
│   └── modify-endpoints.sh
├── src/
│   ├── shared/
│   │   ├── api/
│   │   │   ├── baseQuery.ts
│   │   │   └── createApi.ts
│   │   ├── hooks/
│   │   │   ├── useAppStateEvent.ts
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── Dates.ts
│   │   │   ├── Environments.ts
│   │   │   ├── index.ts
│   │   ├── ui/
│   │   │   ├── ActivityIndicator/
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   ├── EventEmitterProvider/
│   │   │   ├── LanguageProvider/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── KeyboardService/
│   │   │   ├── RouteService/
│   │   │   └── index.ts
│   ├── modules/
│   │   └── [module-name]/
│   │       ├── features/
│   │       │   ├── [feature-logic].ts
│   │       │   └── index.ts
│   │       ├── adapters/
│   │       │   ├── [data-adapter].ts
│   │       │   └── index.ts
│   │       ├── ui/
│   │       │   ├── components/
│   │       │   ├── models.ts
│   │       │   └── index.ts
│   │       ├── widgets/
│   │       │   ├── [ComponentName]Compose.tsx
│   │       │   └── index.ts
│   │       ├── screens/
│   │       │   ├── [ScreenName].tsx
│   │       │   └── index.ts
│   │       └── index.ts
│   ├── navigation/
│   │   ├── stacks/
│   │   ├── types.ts
│   │   └── index.ts
│   └── assets/
│       ├── fonts/
│       │   └── icomoon.ttf
│       ├── images/
│       ├── resources/
│       │   └── selection.json
│       └── bootsplash/
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── react-native.config.js
```

**Architecture Rules:**

- **Features** contain all business logic and can use shared/common utilities
- **Adapters** transform business data into UI-ready formats
- **UI components** are purely presentational and stateless
- **Widgets** must use "Compose" naming convention and orchestrate features + UI
- **Screens** can only import and use widgets, never features or UI components directly
- **Common** folder contains all reusable logic shared across modules

This architecture ensures:

- **Clear Data Flow**: Features → Adapters → Widgets → UI Components
- **Separation of Concerns**: Business logic, data transformation, and presentation are isolated
- **Reusability**: Common logic and UI components can be shared across modules
- **Maintainability**: Strict layering prevents architectural violations
- **Scalability**: New modules can be added without affecting existing code

## 📚 Recommended Library Usage

This section outlines the preferred libraries and best practices for common React Native development patterns.

### Lists

For optimal performance and user experience, we recommend using these list components instead of React Native's default `FlatList`:

#### 1. FlashList

**[FlashList](https://shopify.github.io/flash-list/)** by Shopify is our primary recommendation for high-performance lists.

**When to use FlashList:**

- Large datasets with hundreds or thousands of items
- Lists with complex item layouts
- When you need consistent performance across different devices
- Default choice for most list implementations

**Key benefits:**

- Up to 10x better performance than FlatList
- Automatic item size calculation
- Better memory management
- Smooth scrolling even with complex items

**Basic usage:**

```tsx
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={data}
  renderItem={({ item }) => <ItemComponent item={item} />}
  estimatedItemSize={100}
/>;
```

#### 2. LegendList

**[LegendList](https://legendapp.com/open-source/list/)** is our recommended choice for lists that require advanced optimization and integration with Legend State.

**When to use LegendList:**

- When using Legend State for state management
- Complex lists with real-time updates
- Lists that need fine-grained reactivity
- Advanced optimization requirements

**Key benefits:**

- Seamless integration with Legend State
- Minimal re-renders with granular reactivity
- Built-in optimization for Legend State observables
- Advanced performance optimizations

**Basic usage:**

```tsx
import { LegendList } from '@legendapp/list';

<LegendList
  data={data$} // Legend State observable
  renderItem={({ item }) => <ItemComponent item={item} />}
/>;
```

**Choosing between FlashList and LegendList:**

- Use **FlashList** as the default choice for most lists
- Use **LegendList** when you're heavily using Legend State and need reactive list updates
- Both libraries offer significant performance improvements over the standard FlatList

### State Management

For state management, we provide two excellent options depending on your preferred approach and application requirements:

#### 1. Legend State (Primary Recommendation)

**[Legend State](https://legendapp.com/open-source/state/)** is our primary choice for state management, offering fine-grained reactivity and excellent performance.

**When to use Legend State:**

- Default choice for most applications
- When you need fine-grained reactivity
- Applications with complex state updates
- When performance is critical
- Integration with LegendList for optimal list performance

**Key benefits:**

- Minimal re-renders with granular reactivity
- Simple and intuitive API
- Excellent TypeScript support
- Built-in persistence capabilities
- Outstanding performance with large datasets
- Seamless integration with React Native

**Basic usage:**

```tsx
import { observable, observer } from '@legendapp/state';

// Create observable state
const user$ = observable({
  name: 'John',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
  },
});

// Use in components
const UserProfile = () => {
  return (
    <View>
      <Text>{user$.name.get()}</Text>
      <Button
        title="Change Theme"
        onPress={() => user$.preferences.theme.set('light')}
      />
    </View>
  );
};
```

#### 2. Zustand

**[Zustand](https://github.com/pmndrs/zustand)** is our recommended alternative for developers who prefer a Redux-like store pattern.

**When to use Zustand:**

- When you prefer Redux-like store architecture
- Team is more familiar with traditional state management patterns
- Need centralized store with actions and reducers
- Smaller applications with simpler state requirements

**Key benefits:**

- Familiar Redux-like API without boilerplate
- Small bundle size and minimal setup
- Great TypeScript support
- Middleware support (persist, devtools, etc.)
- Easy migration from Redux

**Basic usage:**

```tsx
import { create } from 'zustand';

interface UserStore {
  user: {
    name: string;
    email: string;
    preferences: {
      theme: string;
    };
  };
  updateTheme: (theme: string) => void;
  updateUser: (user: Partial<UserStore['user']>) => void;
}

const useUserStore = create<UserStore>(set => ({
  user: {
    name: 'John',
    email: 'john@example.com',
    preferences: {
      theme: 'dark',
    },
  },
  updateTheme: theme =>
    set(state => ({
      user: {
        ...state.user,
        preferences: { ...state.user.preferences, theme },
      },
    })),
  updateUser: userData =>
    set(state => ({
      user: { ...state.user, ...userData },
    })),
}));

// Use in components
const UserProfile = () => {
  const { user, updateTheme } = useUserStore();

  return (
    <View>
      <Text>{user.name}</Text>
      <Button title="Change Theme" onPress={() => updateTheme('light')} />
    </View>
  );
};
```

**Choosing between Legend State and Zustand:**

- Use **Legend State** as the default choice for optimal performance and reactivity
- Use **Zustand** when your team prefers Redux-like patterns or when migrating from Redux
- Both libraries offer excellent TypeScript support and performance
- Legend State excels in fine-grained updates, while Zustand provides familiar store patterns

### Styling

**[React Native Unistyles v3](https://www.unistyl.es/v3/start/introduction)** is our recommended styling library, offering native performance with shadow node updates.

**Why React Native Unistyles v3:**

- **Native Shadow Node Updates**: Style changes happen directly on the native side without React re-renders
- **Familiar API**: Uses `StyleSheet.create` similar to React Native's built-in StyleSheet
- **Zero Re-renders**: Theme changes and dynamic styles update natively without component re-renders
- **TypeScript First**: Excellent TypeScript support with full type safety for themes and breakpoints
- **New Architecture Ready**: Fully compatible with React Native's new architecture (Fabric)
- **Runtime Performance**: All style calculations happen on the native thread

**Key Features:**

- **Native Performance**: Direct shadow node manipulation for optimal performance
- **Theme Support**: Built-in theming with automatic theme switching
- **Breakpoints**: Responsive design with screen size breakpoints
- **Dynamic Styles**: Runtime style updates without JavaScript bridge overhead
- **Web Support**: Seamless React Native Web compatibility
- **No Hook Dependencies**: Direct StyleSheet.create API without additional hooks

**Basic Usage:**

**1. Theme Configuration:**

```tsx
const LightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
    surface: '#F2F2F7',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

const DarkTheme = {
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    text: '#FFFFFF',
    surface: '#1C1C1E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

StyleSheet.configure({
  themes: {
    light: LightTheme,
    dark: DarkTheme,
  },
  breakpoints,
  settings: {
    initialTheme: () => {
      // return intiial theme from global store
    },
  },
});
```

**2. Component Styling (v3 API):**

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const Component = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Card content</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    // Variants for different states
    variants: {
      size: {
        small: {
          padding: theme.spacing.sm,
        },
        large: {
          padding: theme.spacing.xl,
        },
      },
    },
  },
  cardText: {
    color: theme.colors.text,
    fontSize: 16,
  },
}));
```

**3. Responsive and Dynamic Styles:**

```tsx
const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    // Responsive padding using breakpoints
    padding: {
      xs: theme.spacing.sm,
      md: theme.spacing.lg,
      xl: theme.spacing.xl,
    },
  },
  dynamicContainer: {
    // Runtime calculations without re-renders
    width: runtime.screen.width * 0.8,
    height: runtime.screen.height * 0.5,
    backgroundColor:
      runtime.orientation === 'portrait'
        ? theme.colors.primary
        : theme.colors.surface,
  },
}));
```

**4. Theme Switching:**

```tsx
import { UnistylesRuntime } from 'react-native-unistyles';

// Switch theme anywhere in the app
UnistylesRuntime.setTheme('dark'); // Updates all components instantly via shadow nodes
```

**Key Advantages of v3:**

- **No useStyles Hook**: Direct StyleSheet.create API like standard React Native
- **Native Updates**: Theme and breakpoint changes update shadow nodes directly
- **Zero Re-renders**: Style updates don't trigger React component re-renders
- **Better Performance**: All calculations happen on the native thread
- **Familiar API**: Easy migration from React Native StyleSheet
- **Type Safety**: Full TypeScript support for themes, breakpoints, and runtime values

**Migration from React Native StyleSheet:**

```tsx
// Before (React Native StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

// After (Unistyles v3)
const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
```

The migration is seamless - just replace the import and optionally add theme support while keeping the same familiar API.

### Library Selection Guidelines

When choosing third-party libraries for React Native development, prioritize libraries that support the new architecture and offer optimal performance.

#### Performance Hierarchy (Best to Good)

**1. Nitro Modules** ⭐ **Recommended**
Libraries built with **[Nitro Modules](https://nitro.margelo.com/)** offer the best performance and are our top recommendation.

**Why Nitro Modules:**

- **Fastest Performance**: Superior to TurboModules and Fabric in execution speed
- **Better Memory Management**: More efficient memory usage and garbage collection
- **Type Safety**: Full TypeScript support with compile-time type checking
- **Modern Architecture**: Built specifically for React Native's new architecture
- **Cross-Platform**: Single codebase for iOS, Android, and Web

**Examples of Nitro Module libraries:**

- `react-native-nitro-sqlite` - High-performance SQLite database
- `react-native-nitro-image` - Optimized image processing
- Custom Nitro modules for performance-critical operations

**2. Fabric/TurboModules** ✅ **Good Choice**
Libraries supporting React Native's new architecture with TurboModules and Fabric.

**Why TurboModules/Fabric:**

- **New Architecture Support**: Compatible with React Native 0.68+
- **Better Performance**: Improved over bridge-based modules
- **Type Safety**: JSI-based with better TypeScript integration
- **Future Proof**: Standard for React Native's evolution

**Examples:**

- `react-native-reanimated` (v3+) - High-performance animations
- `react-native-gesture-handler` (v2+) - Native gesture recognition
- `@react-native-community/netinfo` - Network connectivity
- `react-native-mmkv` - Fast key-value storage

**3. Expo Modules** ✅ **Acceptable**
Libraries built with Expo Modules API offer good compatibility and ease of use.

**Why Expo Modules:**

- **New Architecture Compatible**: Works with both old and new architecture
- **Easy Development**: Simplified native module development
- **Cross-Platform**: Consistent API across platforms
- **Maintained**: Well-maintained by the Expo team

**Examples:**

- `expo-camera` - Camera functionality
- `expo-location` - Location services
- `expo-notifications` - Push notifications
- `expo-secure-store` - Secure storage

#### Library Selection Checklist

When evaluating libraries, check for:

✅ **New Architecture Support**

- Explicitly states TurboModule/Fabric compatibility
- Works with React Native 0.68+ and new architecture enabled
- No deprecated bridge-based implementations

✅ **Performance Characteristics**

- Nitro Modules > TurboModules/Fabric > Expo Modules > Bridge-based
- Benchmark data available for performance-critical operations
- Efficient memory usage and minimal JavaScript thread blocking

✅ **Maintenance and Community**

- Active maintenance with recent updates
- Good community support and documentation
- Regular compatibility updates with new React Native versions

✅ **TypeScript Support**

- Full TypeScript definitions included
- Type-safe APIs and proper generic support
- Good IDE integration with IntelliSense

#### Libraries to Avoid

❌ **Bridge-based modules** (Legacy architecture)

- Modules that only support the old bridge architecture
- Libraries that haven't been updated for new architecture
- Performance bottlenecks with frequent JavaScript ↔ Native communication

❌ **Unmaintained libraries**

- No updates in the last 12+ months
- No new architecture support roadmap
- Critical issues without responses

#### Migration Strategy

When migrating existing projects:

1. **Audit Current Libraries**: Check new architecture compatibility
2. **Prioritize Performance-Critical**: Replace bridge-based modules for performance-sensitive operations
3. **Gradual Migration**: Replace libraries incrementally during development cycles
4. **Test Thoroughly**: Ensure new architecture modules work correctly in your specific use case

**Example Migration Path:**

```
Old: react-native-async-storage (Bridge)
↓
New: @react-native-async-storage/async-storage (TurboModule)

Old: react-native-sqlite-storage (Bridge)
↓
New: react-native-nitro-sqlite (Nitro Module)
```

By following these guidelines, you ensure optimal performance, future compatibility, and maintainable codebases.

## 🌍 Environment Setup

Before you begin, it’s essential to configure the environment settings for your project. This involves setting up different environment-specific variables for iOS and Android builds, such as API keys, database connections, or other environment-specific configurations.

Example Environment Variable Setup:

```
API_URL=""
```

## 📌 API hooks generation

This template contains C++ scripts for **API code generation**. These scripts generate **React Query hooks** based on API definitions.

🔹 Supported Platforms

```
• Macos ✅
• Linux ✅
• Windows 🛠️ (WIP - Requires additional C++ setup)
```

🔹 Compile Codegen

To compile the C++ code generation scripts:

```bash
yarn run api-codegen:compile
```

```bash
yarn run api-codegen:run
```

## 🛠️ How It Works

The scripts are located in **`scripts/api-codegen`**:

| **Script**               | **Description**                                     |
| ------------------------ | --------------------------------------------------- |
| `compile-all.sh`         | Compiles all C++ codegen scripts                    |
| `run-codegen.sh`         | Runs the code generation process                    |
| `builder-name-check.cpp` | Checks builder names for API endpoints              |
| `check-generics.cpp`     | Ensures proper handling of generics in API requests |
| `merge-query-keys.cpp`   | Merges query keys for better cache management       |
| `query-keys.cpp`         | Generates unique query keys for API hooks           |
| `server-hooks.cpp`       | Generates server-side React Query hooks             |

## 🔄 Rename Project

Switch up the name and bundle ID with a snap using this command, substituting `ExampleApp` and `ExampleBundleIdentifier` with your chosen names. 🛠

```
npx react-native-rename@latest "ExampleApp" -b "ExampleBundleIdentifier"
```

## 🔒 Private Package Setup

Get your project cozy with private packages by adding a `.npmrc` file. This ensures all package installations flow through GitHub Packages, making both scoped and unscoped npmjs.org packages accessible. 🔐

```sh
//npm.pkg.github.com/:_authToken=token
@lumitech-co:registry=https://npm.pkg.github.com/
```

## 🌅 Splash Screen

Refresh the SplashScreen with your brand's assets using this command. Customize it with your desired parameters and assets. ✨

To generate a new Bootsplash, you can replace the splash.png or splash.svg file located in the root of your project with your desired splash image. Ensure that the file is placed correctly before running the commands to generate updated splash screen assets for both Android and iOS.

For more details check [react-native-bootsplash](https://github.com/zoontek/react-native-bootsplash)

```
"splash-android": yarn react-native generate-bootsplash splash.png --platforms=android --logo-width=184 --background=#fff --assets-output=src/assets/bootsplash

"splash-ios": "yarn react-native generate-bootsplash splash.png --platforms=ios --logo-width=264 --background=#fff --assets-output=src/assets/bootsplash",

```

## 🎨 Icon Usage

We use **[IcoMoon](https://icomoon.io/)** for generating custom icons in this project. Follow these steps to update or add new icons to your project.

### Steps for Generating Custom Icons:

1. **Go to the IcoMoon Website**:

   - Navigate to [IcoMoon](https://icomoon.io/) and select or create your custom icon set.

2. **Download the Icon Set**:

   - After selecting your icons, download the zip file. The downloaded archive will include an `icomoon.ttf` file and a `selection.json` file.

3. **Add Files to the Project**:

   - Place the `icomoon.ttf` file in `src/assets/fonts`.
   - Place the `selection.json` file in `src/assets/resources`.

4. **Run the Asset and Icon Script**:

   - Once the files are added, run the following npm script to link the assets and generate the icon types:

   ```bash
     "asset": "npx react-native-asset && scripts/icons.sh"
   ```

## 🖼️ SVG Optimization

To ensure that our app runs efficiently and assets load quickly, we have implemented SVG optimization techniques inspired by the **[Callstack guide](https://www.callstack.com/blog/image-optimization-on-ci-and-local)**. By optimizing our SVG files, we reduce their size and improve overall performance, especially for mobile devices with limited resources.

### Optimization Process:

We use **SVGO** (SVG Optimizer) to automate the compression and optimization of SVG files. This ensures that all SVG assets are minified and optimized without sacrificing visual quality.

### NPM Script:

To run SVG optimization, we’ve set up the following npm script:

```bash
"svgo": "svgo -f ./src/assets/images -o ./src/assets/images"
```

## 🎬 React Native Reanimated Usage

Our project utilizes **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** to create high-performance, smooth animations, along with custom animated components developed by **Lumitech** using **[react-native-skia](https://shopify.github.io/react-native-skia/)**. These components are designed to enhance the visual experience and provide seamless animations within the app.

### Custom Animated Components:

The following custom components, built using Reanimated and Skia, can be found in the `shared/ui` layer of the project:

- **`AnimatedActivityIndicator`**: A polished, animated activity indicator offering a smooth visual during loading states.
- **`Switch`**: A custom toggle switch with smooth, animated transitions, providing a more elegant and flexible alternative to the default switch component.

### Why We Use Reanimated and Skia:

- **Smooth Animations**: React Native Reanimated allows us to implement fluid, performant animations, giving users a seamless experience.
- **Custom Drawing**: With Skia, we can create complex custom drawings and animations, making components like `InfinityCarousel` and `AnimatedActivityIndicator` stand out visually.
- **Performance**: Both Reanimated and Skia run animations on the UI thread, ensuring smooth performance and avoiding frame drops or lag during transitions.

These custom components are integral to our user interface and have been designed for optimal performance and aesthetics. For implementation details, you can explore the `shared/ui` layer in the project.

## 🛠️ Helper Scripts

Our project includes several custom helper scripts designed to automate and streamline tasks related to API endpoints, schema generation, and icon type generation. These scripts enhance efficiency and maintain consistency across the project.

### `modify-endpoints.sh`

This script is used to generate `Endpoints` types from the Swagger API, making it easier to infer types for API services.

#### Script Content:

```bash
#!/bin/bash

openapi_schema_file="src/shared/api/endpoints.ts"

if [[ ! -f "$openapi_schema_file" ]]; then
  echo "File not found!"
  exit 1
fi

paths=$(grep -o '"/[^"]*":' "$openapi_schema_file" | sed 's/"://g' | tr -d '"')

union="export type Endpoints = "

for path in $paths; do
  union+="\"$path\" | "
done

union+="({} & string);"

echo -e "$union" > "$openapi_schema_file"

echo "Endpoints type has been added to $openapi_schema_file with | ({} & string) at the end."
```

This script extracts API routes from the OpenAPI schema file and generates a union type called Endpoints, which is used for type-safe inference in API services.

```
"endpoints": "npx openapi-typescript swagger-link -o src/shared/api/endpoints.ts && ./scripts/modify-endpoints.sh && eslint . --ext .js,.jsx,.ts,.tsx --fix",
```

Once executed, it generates an Endpoints type such as:

```ts
export type Endpoints =
  | '/api/health-check'
  | '/api/auth/sign-up'
  | '/api/auth/sign-in/oauth'
  | '/api/auth/x/request-token'
  | '/api/auth/sign-up/verify'
  | '/api/auth/sign-up/resend-verification'
  | '/api/auth/sign-in'
  | ({} & string);
```

## `icons.sh`

This script generates TypeScript definitions for icon names based on the selection.json file from IcoMoon, ensuring that all icons are properly typed.

```bash
#!/bin/bash
PATTERN="selection.json"
DECL_POSTFIX=".d.ts"
TARGET_DIRECTORY="./src/assets/resources"

echo "Current Directory: $(pwd)"
echo "Checking for files in: $TARGET_DIRECTORY"

JSONS=($(find "$TARGET_DIRECTORY" -type f -name "$PATTERN"))

echo "Files found: ${JSONS[@]}"

if [ ${#JSONS[@]} -eq 0 ]; then
  echo "No files found. Exiting."
  exit 1
fi

for file in "${JSONS[@]}"
do
  echo "Processing file: $file"

  if git check-ignore --quiet "$file"; then
    continue
  fi

  ICON_NAMES=$(jq -r '.icons[].properties.name' "$file" | awk -v ORS=' | ' '{print "\"" $0 "\""}' | sed 's/ | $//')

  printf "/** Generated with \`./icons.sh\` */\nexport type IconName = $ICON_NAMES | (string & {});\n" > "$file$DECL_POSTFIX"
  echo "Generated .d.ts for: $file"
done
```

This script:

    Scans for selection.json files in the src/assets/resources directory.

    Extracts icon names from the JSON file.

    Generates a .d.ts file with the type definition for IconName, which includes all the extracted icon names and a fallback for any string.

## 🐛 Debugging

Previously, we experienced inefficiencies with **Flipper** as a debugging tool in our React Native app. Flipper introduced unnecessary runtime dependencies, leading to poor developer experience and performance issues. For these reasons, we have opted to move away from using Flipper.

### Why Flipper Was Inefficient:

- **Performance Impact**: Flipper added significant overhead to the development environment, slowing down app execution.
- **Runtime Dependencies**: It introduced dependencies that could affect the stability of the app.
- **Poor Dev Experience**: The tool was often sluggish, and many developers reported issues with its usability.

### Alternative: **Rozenite**

We recommend switching to **[Rozenite](https://www.rozenite.dev/docs/introduction)**, which offers a smoother and more efficient experience for debugging React Native applications. Rozenite provides essential debugging tools without the performance hits associated with Flipper.

### ✨ Commits format

Commitlint is used to check if your commit messages meet the [conventional commit format](https://conventionalcommits.org).
In general the pattern mostly looks like this:

```sh
type(scope?): subject
```

Real world examples can look like this:

```
chore: run tests on travis ci
```

```
fix(stepper): update button actions
```

```
feat(passenger): add comment section
```

Common types according to [commitlint-config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum) can be:

- build
- ci
- chore
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test
