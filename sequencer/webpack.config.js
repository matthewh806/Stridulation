'use strict';

const webpack = require('webpack');
const path = require('path');

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    DEBUG: false
})

module.exports = {

    entry: './src/app.js',

    mode: 'development',
    devtool: 'inline-source-map',

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'bundle.js'
    },

    module: {
        rules: [
          {
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
        definePlugin
    ]

};