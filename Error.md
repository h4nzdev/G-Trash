PS C:\Users\hanzc\Documents\Gtrash\Resident> npx expo start -c
env: load .env
env: export EXPO_PUBLIC_OPENROUTESERVICE_API_KEY EXPO_PUBLIC_API_URL
Starting project at C:\Users\hanzc\Documents\Gtrash\Resident
React Compiler enabled
Starting Metro Bundler
warning: Bundler cache is empty, rebuilding (this may take a minute)
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄████ █▀█ ▄▄▄▄▄ █
█ █   █ █ ▀█ ▄ █▀ █ █   █ █
█ █▄▄▄█ █▄ ▄▄▀▀█▄▀█ █▄▄▄█ █
█▄▄▄▄▄▄▄█▄▀▄▀▄█ ▀ █▄▄▄▄▄▄▄█
█ ▄▄ █▀▄▀▄▀███▀▀▄▄▄██▄ ▄▀▄█
█▀▀▄   ▄▀███▀▀ ▄█▀█ ▀██▀███
██▀▀▀▀▄▄█▄ ▀ █ █▀▄█ ▄ █ █▀█
█▀▄█▀▄ ▄██▀▀█ ▄██ ▀▀█▀▀█ ▀█
███▄█▄█▄▄  ▄▄▀  ▄ ▄▄▄ ▀▄█▀█
█ ▄▄▄▄▄ ████▄ █▀█ █▄█ █▄ ▄█
█ █   █ █▀  ▄▀▀▀▀▄▄   █▀▀ █
█ █▄▄▄█ █ ▄▄▄▄▀▄▀▄▀▄█▄▄ ▄██
█▄▄▄▄▄▄▄█▄████▄█▄██████▄▄▄█

› Metro waiting on exp://192.168.8.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Web is waiting on http://localhost:8081

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
Android Bundled 29990ms node_modules\expo-router\entry.js (1519 modules)
 WARN  🚨 React Native's New Architecture is always enabled in Expo Go, but it is explicitly disabled in your project's app config. This may lead to unexpected behavior when creating a production or development build. Remove "newArchEnabled": false from your app.json.        
Learn more: https://docs.expo.dev/guides/new-architecture/
 ERROR  [Error: Cannot use `href` and `tabBarButton` together.] 

Call Stack
  screens.map$argument_0 (node_modules\expo-router\build\layouts\TabsClient.js)
  map (<native>)
  <anonymous> (node_modules\expo-router\build\layouts\TabsClient.js)
  <anonymous> (node_modules\expo-router\build\layouts\withLayoutContext.js)
  callComponent.reactStackBottomFrame (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  renderWithHooks (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  updateForwardRef (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  beginWork (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  runWithFiberInDEV (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  performUnitOfWork (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  workLoopSync (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  renderRootSync (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  performWorkOnRoot (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  performSyncWorkOnRoot (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  flushSyncWorkAcrossRoots_impl (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  processRootScheduleInMicrotask (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)
  scheduleMicrotask$argument_0 (node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js)

Call Stack
  Object.assign$argument_0 (node_modules\expo-router\build\layouts\TabsClient.js)
  TabLayout (app\(tabs)\_layout.tsx)
  BaseRoute (node_modules\expo-router\build\useScreens.js)
  SceneView (node_modules\@react-navigation\core\lib\module\SceneView.js)
  render (node_modules\@react-navigation\core\lib\module\useDescriptors.js)
  routes.reduce$argument_0 (node_modules\@react-navigation\core\lib\module\useDescriptors.js)
  reduce (<native>)
  useDescriptors (node_modules\@react-navigation\core\lib\module\useDescriptors.js)
  useNavigationBuilder (node_modules\@react-navigation\core\lib\module\useNavigationBuilder.js)
  NativeStackNavigator (node_modules\expo-router\build\fork\native-stack\createNativeStackNavigator.js)
  <anonymous> (node_modules\expo-router\build\layouts\withLayoutContext.js)
  Object.assign$argument_0 (node_modules\expo-router\build\layouts\StackClient.js)
  RootLayout (app\_layout.tsx)
  BaseRoute (node_modules\expo-router\build\useScreens.js)
  SceneView (node_modules\@react-navigation\core\lib\module\SceneView.js)
  render (node_modules\@react-navigation\core\lib\module\useDescriptors.js)
  routes.reduce$argument_0 (node_modules\@react-navigation\core\lib\module\useDescriptors.js)
  reduce (<native>)
  useDescriptors (node_modules\@react-navigation\core\lib\module\useDescriptors.js)
  useNavigationBuilder (node_modules\@react-navigation\core\lib\module\useNavigationBuilder.js)
  Content (node_modules\expo-router\build\ExpoRoot.js)
  ContextNavigator (node_modules\expo-router\build\ExpoRoot.js)
  ExpoRoot (node_modules\expo-router\build\ExpoRoot.js)
  App (node_modules\expo-router\build\qualified-entry.js)
  WithDevTools (node_modules\expo\src\launch\withDevTools.tsx)
