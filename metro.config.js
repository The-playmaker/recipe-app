// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
// const path = require('path'); // No longer needed for this simplified version

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Get the current platform from an environment variable set by Expo CLI
// const platform = process.env.EXPO_PLATFORM || process.env.PLATFORM;

// Temporarily disabling web-specific mocks to isolate the issue.
// If all imports are correct (using the '@/lib/firebase' barrel file),
// lib/firebase.native.ts and its @react-native-firebase/* imports
// should not be pulled into the web bundle anyway.

// if (platform === 'web') {
//   const rnFirebaseMockPath = path.resolve(__dirname, 'firebase-native-web-mock.js');

//   const fs = require('fs');
//   if (!fs.existsSync(rnFirebaseMockPath)) {
//     fs.writeFileSync(rnFirebaseMockPath, `
//       const handler = {
//         get: function(target, prop) {
//           if (prop === 'apps') return [];
//           if (prop === 'app') return () => ({ auth: () => null, firestore: () => null });
//           if (prop === 'auth') return () => null;
//           if (prop === 'firestore') return () => null;
//           return null;
//         },
//         apply: function() { return null; }
//       };
//       module.exports = new Proxy({}, handler);
//     `);
//   }

//   const firebaseModulesToMock = [
//     '@react-native-firebase/app',
//     '@react-native-firebase/auth',
//     '@react-native-firebase/firestore',
//   ];

//   defaultConfig.resolver = defaultConfig.resolver || {};
//   defaultConfig.resolver.extraNodeModules = defaultConfig.resolver.extraNodeModules || {};

//   for (const moduleName of firebaseModulesToMock) {
//     defaultConfig.resolver.extraNodeModules[moduleName] = rnFirebaseMockPath;
//   }
//   console.log('INFO: Metro config for WEB: Mocking @react-native-firebase modules (temporarily simplified/disabled for testing).');
// }

console.log('INFO: Metro config is using default settings (web mocks temporarily disabled for testing).');

module.exports = defaultConfig;
