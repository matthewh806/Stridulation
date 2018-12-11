'use strict';

const webpack = require('webpack');
const path = require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const writeFilePlugin = require('write-file-webpack-plugin');

module.exports = {

    entry: './src/app.js',

    mode: 'development',
    devtool: 'inline-source-map',
    
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

    devServer: {
        contentBase: path.resolve(__dirname, 'build')
    },

    plugins: [
        new cleanWebpackPlugin(['dist']),
        new writeFilePlugin(),
        new copyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'index.html'),
                to: path.resolve(__dirname, 'build')
            },
            {
                from: path.resolve(__dirname, 'assets', '**', '*'),
                to: path.resolve(__dirname, 'build')
            }
        ])
    ]
};