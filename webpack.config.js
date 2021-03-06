const {AngularCompilerPlugin} = require('@ngtools/webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './client/app.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client')
  },
  plugins: [
    new AngularCompilerPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: './client/app#AppModule',
      sourceMap: true
    }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ],
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.html/,
        use: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        include: /\.component\.scss/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /\.component\.scss/
      },
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
