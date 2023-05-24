const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/HspSearch.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'hsp-fo-search.js',
    chunkFilename: 'hsp-fo-search.[contenthash].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          onlyCompileBundledFiles: true,
        }
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'img'),
          to: path.resolve(__dirname, 'dist/img')
        },
      ]
    }),
  ],
  devtool: 'source-map',
}
