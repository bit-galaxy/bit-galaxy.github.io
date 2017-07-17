require('webpack');
const path    = require('path');
const plugins = require('webpack-load-plugins')({
  rename: {
    'html-webpack-plugin': 'Html',
    'favicons-webpack-plugin': 'Favicons',
    'extract-text-webpack-plugin': 'ExtractText',
  },
});

const APP_DIR     = path.resolve(__dirname, 'src');
const MODULES_DIR = path.resolve(__dirname, 'node_modules');

const config = {
  entry: [
    `${APP_DIR}/main.js`,
  ],
  output: {
    path: __dirname,
    filename: 'build/bundle.js',
    publicPath: '/',
  },
  plugins: [
    new plugins.Html({
      template: `${APP_DIR}/index.html`,
      minify: {
        collapseWhitespace: true,
        minifyJS: { mangle: false },
      },
    }),
    new plugins.Favicons({
      logo: `${APP_DIR}/favicon.png`,
      prefix: 'build/icons/',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new plugins.ExtractText('build/bundle.css'),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2'],
        },
        exclude: [MODULES_DIR],
      },
      { test: /\.inline\.css$/, loader: 'css-loader' },
      { test: /^(?!.+\.inline\.css$).+\.css$/, loader: plugins.ExtractText.extract('css-loader') },
    ],
  },
};

module.exports = config;
