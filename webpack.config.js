module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'azing-search.min.js',
    library: 'azingSearch',
    libraryExport: 'default',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".scss"],
  },
  module: {
    rules: [{
      test: /\.scss$/i,
      use: [
        'raw-loader',
        "sass-loader" // compiles Sass to CSS, using Node Sass by default
      ]
    }, {
      test: /\.tsx?$/,
      use: 'ts-loader',
    }],
  },
};