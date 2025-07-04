// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Get the current platform from an environment variable set by Expo CLI
const platform = process.env.EXPO_PLATFORM || process.env.PLATFORM;

// Mock out @react-native-firebase modules for web by pointing them to an empty module or false
if (platform === 'web') {
  const rnFirebaseMockPath = path.resolve(__dirname, 'empty-module.js');

  // Create an empty module file if it doesn't exist (Metro needs a valid file path)
  const fs = require('fs');
  if (!fs.existsSync(rnFirebaseMockPath)) {
    fs.writeFileSync(rnFirebaseMockPath, 'module.exports = {};');
  }

  const firebaseModulesToMock = [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/firestore',
    // Add any other @react-native-firebase/* modules your app might indirectly reference
  ];

  // Method 1: Using resolver.extraNodeModules to substitute the modules
  // This is often more reliable for complete module replacement.
  defaultConfig.resolver = defaultConfig.resolver || {};
  defaultConfig.resolver.extraNodeModules = defaultConfig.resolver.extraNodeModules || {};

  for (const moduleName of firebaseModulesToMock) {
    defaultConfig.resolver.extraNodeModules[moduleName] = rnFirebaseMockPath;
  }

  // Method 2: Using resolver.resolveRequest (more complex, usually for conditional resolution)
  // We'll stick with extraNodeModules for this case as it's simpler for direct mocking.
  // defaultConfig.resolver.resolveRequest = (context, moduleName, platformInternal) => {
  //   if (platformInternal === 'web' && firebaseModulesToMock.includes(moduleName)) {
  //     return {
  //       filePath: rnFirebaseMockPath, // Point to an empty module
  //       type: 'sourceFile',
  //     };
  //   }
  //   // Allow Metro to resolve anything else normally
  //   return context.resolveRequest(context, moduleName, platformInternal);
  // };

  console.log('INFO: Metro config customized for WEB: Mocking @react-native-firebase modules.');
}

module.exports = defaultConfig;
