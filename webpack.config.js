const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
//const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const WebpackShellPlugin = require('webpack-shell-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')

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
  },  // module: {
  /*
  optimization: {
    splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
  },
  */
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}

// -----------------------------

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
    
    if (typeof(webpackConfig.optimization) !== 'object') {
      webpackConfig.optimization = {}
    }
    
    webpackConfig.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      })
    ]
  } // if (argv.mode === 'production') {
  
  

  return webpackConfig
}