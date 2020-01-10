const webpack = require('webpack');
const path    = require('path');
const mix     = require('laravel-mix');
const pkg     = require('./package.json');
const fs      = require('fs');
const public  = process.env.NODE_ENV.trim() === 'build' ? 'dist' : 'example';

mix.setPublicPath(path.normalize(public));

const libraryName = pkg.name;
const banner  = `/*!
 * ${pkg.name}
 * ${pkg.description}\n
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @homepage ${pkg.homepage}
 * @repository ${pkg.repository.url}
 */\n`;

const fileName = 'index.js';

const config = {
  externals: {
    'vue': 'Vue'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/i,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
        options: {
          fix: false,
          cache: false,
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.tpl$/i,
        exclude: /(node_modules|bower_components)/,
        use: 'raw-loader'
      }
    ]
  },
  output: {
    path: path.resolve(public),
    filename: fileName,
    library: libraryName,
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  devServer: {
    overlay: true,
    inline: true,
    quiet: false
  },
  devtool: 'cheap-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'es6-promise'
    })
  ]
};

mix.webpackConfig(config).sourceMaps();

if (process.env.NODE_ENV.trim() === 'build') {
  mix.js(`src/index.js`, `${ public }`);
  mix.then(function () {
    const data   = fs.readFileSync(`${ public }/${ fileName }`);
    const fd     = fs.openSync(`${ public }/${ fileName }`, 'w+');
    const insert = new Buffer(banner);
    fs.writeSync(fd, insert, 0, insert.length, 0)
    fs.writeSync(fd, data, 0, data.length, insert.length)
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });
  mix.version();
  mix.disableNotifications();
} else {
  mix.js(`example/app.js`, `${ public }`);
  mix.browserSync({
    proxy: false,
    port: 3000,
    files: [
      'src/*',
      'dist/*'
    ],
    browser: 'firefox',
    open: 'local',
    server: {
      baseDir: './'
    }
  });
}

