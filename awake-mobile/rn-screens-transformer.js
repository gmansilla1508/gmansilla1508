/**
 * Custom Metro transformer that patches react-native-screens Fabric
 * component TypeScript definitions before @react-native/babel-plugin-codegen
 * processes them.
 *
 * Problem: react-native-screens ~4.23.0 declares some props with TypeScript
 * type `undefined` (e.g. `onAttached: undefined`). The codegen in RN 0.83.x
 * throws "Unknown prop type: undefined" for these. Since those props are
 * typed as `undefined` they cannot be set from JS anyway, so removing them
 * from the codegen input is safe and correct.
 */
const upstreamTransformer = require('@expo/metro-config/build/babel-transformer');

module.exports = {
  transform(params) {
    const { filename, src } = params;

    if (
      filename.includes('react-native-screens') &&
      filename.includes('/src/fabric/') &&
      (filename.endsWith('.ts') || filename.endsWith('.tsx'))
    ) {
      // Remove prop lines typed as `: undefined;` or `?: undefined;`
      // Matches patterns like:
      //   propName: undefined;
      //   propName?: undefined;
      const patchedSrc = src
        .split('\n')
        .filter(line => !/^\s+\w[\w]*\s*\??\s*:\s*undefined\s*;/.test(line))
        .join('\n');

      return upstreamTransformer.transform({ ...params, src: patchedSrc });
    }

    return upstreamTransformer.transform(params);
  },
};
