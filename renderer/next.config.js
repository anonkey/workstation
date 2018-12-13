require('module-alias/register');

exports.webpack = config => {
  return Object.assign(config, {
    target: 'electron-renderer',
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
          {
            test: /\.js?$/,
            use: {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward'
              },
            }
          },
      ]
    }
  })
}

exports.exportPathMap = () => ({
  '/start': { page: '/start' }
})
