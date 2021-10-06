const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { join } = require('path')

function generateConfig(name) {
  const compress = name.indexOf('min') > -1

  return {
    mode: compress ? 'production' : 'development',
    target: 'web',
    entry: {
      [name]: './src/index.tsx',
    },
    output: {
      path: join(__dirname, 'dist'),
      filename: '[name].js',
      sourceMapFilename: name + '.js.map',
      library: 'source-elements-react',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    devtool: false,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.build.json',
              },
            },
          ],
        },
        {
          test: /\.scss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        runtime: false,
      }),
    ],
  }
}

module.exports = ['elements-react', 'elements-react.min'].map((key) => generateConfig(key))
