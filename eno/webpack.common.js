'use strict';

const webpack = require('webpack');
const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    DEBUG: false
})

module.exports = {

    entry: './src/app.js',

    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'eno.bundle.js'
    },

    module: {
        rules: [
          {
            test : /\.jsx?$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        new cleanWebpackPlugin(['dist']),
        definePlugin
    ]

};