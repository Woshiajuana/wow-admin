const path = require('path');

const resolve = dir => path.join(__dirname, dir);

const isCdn = true;

const vueConfig = {
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port: 8080,
    https: false,
    before: (app) => {
      // eslint-disable-next-line global-require
      require('./mock').mock(app);
    },
  },
  baseUrl: '',
  // crossorigin: 'anonymous',
  // integrity: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
  },
};

if (isCdn) {
  // eslint-disable-next-line global-require
  const cdn = require('./config/cdn');

  vueConfig.configureWebpack = {
    externals: cdn.externals,
    // plugins: [
    //   ...cdn.plugins,
    // ],
  };
}


module.exports = vueConfig;
