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
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
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
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
