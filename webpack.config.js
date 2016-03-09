const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common =  {
  entry: {
    app: PATHS.app
  },
  // add resolve extensions
  // '' is needed to allow imports without an extension
  // Note the .'s before extensions as it will fail to match without!
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ],
    loaders: [
      {
        // Test expected a RegExp! Note the slashes!
        test: /\.css$/,
        loaders: ['style', 'css'],
        // include accepts either a path or an array of paths.
        include: PATHS.app
      },
      {
        test: /\.jsx$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  }
};

// default configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,

      devtool: 'eval-source-map',
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // display only errors to reduce the amount of output
      stats: 'errors-only',

      // parse host and port from env so this is easy to customize
      //
      // if you use Vagrant or Cloud9, set
      // host: process.env.HOST || '0.0.0.0'
      //
      // 0.0.0.0 is acailable to all network devices unlike default
      // localhost
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
