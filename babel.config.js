const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return ({
    babelrcRoots: [
      'apps/*',
      'renderer/*'
    ],
    presets: ['@babel/preset-env', 'next/babel'],
    plugins: [
      ['styled-components', {
        displayName: true,
        ssr: true,
      }],
      ['react-native-web', { commonjs: true }],
      [
        'module-resolver', {
          alias: {
            'react-native': 'react-native-web',
          },
        },
      ],
    ],
  });
}
