const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/scripts/dashboard.js',
    output: {
        filename: 'bundle[chunkhash].js',
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        port: 3000
    },
    plugins: [
        new HTMLPlugin({
            template: './src/dashboard.html'
        }),
        new CleanWebpackPlugin(),
        new Dotenv({
            systemvars: true}),
        new webpack.ProvidePlugin({
            underscore:'underscore'
          })
    ],
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
    }
}