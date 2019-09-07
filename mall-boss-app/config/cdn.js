
// const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
// const vue = require('vue');

const externals = { // 包名:全局变量
  jQuery: 'jQuery',
  vue: 'Vue',
  'element-ui': 'ELEMENT',
};

// const assets = [
//   { path: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js', type: 'js' },
//   { path: `https://cdn.bootcss.com/vue/${vue.version}/vue.min.js`, type: 'js' },
//   { path: 'https://cdn.bootcss.com/element-ui/2.2.2/index.js', type: 'js' },
// ];
// { path: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css', type: 'css' }

// const isProd = process.env.NODE_ENV === 'production';

// const plugins = [
//   new HtmlWebpackIncludeAssetsPlugin({
//     assets,
//     append: false,
//   }),
// ];

module.exports = {
  externals,
  // plugins,
};
