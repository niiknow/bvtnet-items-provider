const webpack      = require('webpack');
const path         = require('path');
const mix          = require('laravel-mix');
const pkg          = require('./package.json');
const fs           = require('fs');
const ESLintPlugin = require('eslint-webpack-plugin');
const isBuild      = ((process.env.MY_BUILD || '').trim() === 'true')
const buildPath    = path.resolve(path.normalize(isBuild || mix.inProduction() ? 'dist' : 'example'));

mix.setPublicPath(buildPath);

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
        test: /\.tpl$/i,
        exclude: /(node_modules|bower_components)/,
        use: 'raw-loader'
      }
    ]
  },
  output: {
    path: path.resolve(buildPath),
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
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'es6-promise'
    }),
    new ESLintPlugin()
  ]
};

if (isBuild) {
  console.log('build');
  mix.webpackConfig(config);
  mix.js(`src/index.js`, `${ buildPath }`);
  mix.then(function () {
    const data   = fs.readFileSync(`${ buildPath }/${ fileName }`);
    const fd     = fs.openSync(`${ buildPath }/${ fileName }`, 'w+');
    const insert = new Buffer(banner);
    fs.writeSync(fd, insert, 0, insert.length, 0)
    fs.writeSync(fd, data, 0, data.length, insert.length)
    fs.close(fd, (err) => {
      if (err) throw err;
    });

  });
  mix.disableNotifications();
} else if (mix.inProduction()) {
  // this should be run after build above
  mix.minify(`${ buildPath }/index.js`);
} else {
  // only run during mix watch
  mix.webpackConfig(config);
  mix.js(`example/app.js`, `${ buildPath }`).vue();
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

