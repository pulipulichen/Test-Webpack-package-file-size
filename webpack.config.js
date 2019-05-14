const path = require('path')
var glob = require("glob")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
//const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const WebpackShellPlugin = require('webpack-shell-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/**
 * 列出檔案清單
 * @author Pulipuli Chen 20190303
 **/
function getFilelist (dir) {
  let filelist = glob.sync(path.join(dir, '**/*.css'))
      .concat(glob.sync(path.join(dir, '**/*.js')))
      .concat(glob.sync(path.join(dir, '**/*.less')))
      .filter((file) => {
        return (!file.endsWith('entry.js') 
          && !file.endsWith('.mocha-test.js')
          && !file.endsWith('.mocha-test-skip.js')
          && !file.endsWith('.selenium-test.js')
          && !file.endsWith('.selenium-test-skip.js')
          && (file.indexOf('/tmp/') === -1)
          && (file.indexOf('/ignore/') === -1))
      })
      .map(item => './' + item)
  return filelist
}

let webpackConfig  = {
  //cache: true,
  devtool: 'source-map',
  entry: {
    'import-from-file': './src/import-from-file.js',
    'import-from-module': './src/import-from-module.js',
    'require-from-file': './src/require-from-file.js',
    'require-from-module': './src/require-from-module.js',
    
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
        use: [
          'style-loader', // 這個會後執行 (順序很重要)
          'css-loader?sourceMap', // 這個會先執行
          'postcss-loader?sourceMap',
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', // Step 3
          'css-loader?sourceMap', // Step 2再執行這個
          'postcss-loader?sourceMap',
          'less-loader?sourceMap' // Step 1 要先執行這個
        ]
      },
      { 
        test: /\.(eot|woff|woff2|svg|png|ttf)([\?]?.*)$/, 
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'asset',
              publicPath: '//pulipulichen.github.io/Pulipuli-Blog/lib-for-link/dist/asset'
            }
          }
        ]
      },
    ]
  }
}


module.exports = (env, argv) => {
  
  //console.log(argv.mode)

  if (argv.mode === 'production') {
    webpackConfig.devtool = false
    
    webpackConfig.module.rules[0] = {
      test: /\.css$/, // 針對所有.css 的檔案作預處理，這邊是用 regular express 的格式
      use: [
        'style-loader', // 這個會後執行 (順序很重要)
        'css-loader', // 這個會先執行
        'postcss-loader',
      ]
    }
    webpackConfig.module.rules[1] = {
      test: /\.less$/,
      use: [
        'style-loader', // Step 3
        'css-loader', // Step 2再執行這個
        'postcss-loader',
        'less-loader' // Step 1 要先執行這個
      ]
    }
    webpackConfig.module.rules.push({
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    })
    webpackConfig.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        })
      ]
    }
  }
  if (argv.mode === 'development') {

  }

  return webpackConfig
}