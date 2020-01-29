const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: 'main.js',
    chunkFilename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // mode: 'production',
  // optimization: {
  //   minimizer: [new TerserPlugin({ /* additional options here */ })],
  // },
  module: {
    // 當 webpack 包裝 js 檔案，採用 babel-loader 來做編譯
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
};