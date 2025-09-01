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
━━━ Yarn Package Manager - 4.6.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  $ yarn <command>
```

Enable corepack and prepare Yarn 3 for your project:

```sh
- corepack enable
- corepack prepare yarn@latest --activate
- yarn set version 4.6.0
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

| **Script**                  | **Description**                                        |
|-----------------------------|--------------------------------------------------------|
| `compile-all.sh`            | Compiles all C++ codegen scripts                       |
| `run-codegen.sh`            | Runs the code generation process                       |
| `builder-name-check.cpp`    | Checks builder names for API endpoints                 |
| `check-generics.cpp`        | Ensures proper handling of generics in API requests    |
| `merge-query-keys.cpp`      | Merges query keys for better cache management          |
| `query-keys.cpp`            | Generates unique query keys for API hooks              |
| `server-hooks.cpp`          | Generates server-side React Query hooks                |

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

### Alternative: **Reactotron**

We recommend switching to **[Reactotron](https://github.com/infinitered/reactotron)**, which offers a smoother and more efficient experience for debugging React Native applications. Reactotron provides essential debugging tools without the performance hits associated with Flipper.

#### Benefits of Reactotron:

- **Lightweight and Fast**: Reactotron adds minimal overhead to the app, improving runtime performance during development.
- **Better Developer Experience**: It provides easy-to-use features for inspecting network requests, state changes, actions, and more, all without causing the sluggish behavior of Flipper.
- **No Extra Runtime Dependencies**: Unlike Flipper, Reactotron doesn't require additional runtime libraries, keeping your project cleaner and more stable.

### How to Set Up Reactotron:

1. **Install Reactotron**:

   Follow the official setup guide [here](https://github.com/infinitered/reactotron/blob/master/docs/quick-start-react-native.md) to integrate Reactotron into your project.

2. **Configure Reactotron in Your Project**:

   Add the necessary configuration files and settings for Reactotron in your React Native project as described in their documentation.

3. **Run Reactotron**:

   Start Reactotron alongside your development server to begin debugging your app with improved performance and developer experience.

For more insights into why switching from Flipper to Reactotron is beneficial, you can check out [this article](https://shift.infinite.red/why-you-dont-need-flipper-in-your-react-native-app-and-how-to-get-by-without-it-3af461955109) for a detailed comparison and explanation of the advantages Reactotron brings to the table.

By switching to Reactotron, you’ll notice improved app performance during development and a more pleasant overall debugging experience.

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
