const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// react-native-screens ~4.23.0 has props typed as `undefined` in its
// Fabric component TypeScript definitions (e.g. `onAttached: undefined`,
// `iosPreventReattachmentOfDismissedScreens: undefined`).
// @react-native/codegen in RN 0.83.x rejects `undefined` as an unknown
// prop type. We fix this by stripping those lines before codegen runs.
config.transformer = {
  ...config.transformer,
  babelTransformerPath: path.resolve(__dirname, 'rn-screens-transformer.js'),
};

module.exports = config;
