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
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
