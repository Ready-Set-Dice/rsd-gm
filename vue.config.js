// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: 9091,
  },
  configureWebpack: {
    // plugins: [new BundleAnalyzerPlugin()]
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
        '@root': path.resolve(__dirname, '.')
      }
    }
  },
  chainWebpack: config => {
    // if (process.env.NODE_ENV === 'development') {
    //   config.module
    //     .rule('vue')
    //     .use('vue-loader')
    //       .loader('vue-loader')
    //       .tap(options => {
    //         options.prettify = false
    //         return options
    //       })
    // }
  }
}
