const path = require('path')

module.exports = {
  entry: './client/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client')
  },
  devtool: 'cheap-sourcemap',
  module: {
    loaders: [
      {
        test: /.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
