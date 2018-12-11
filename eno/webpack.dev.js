const merge = require('webpack-merge');
const common = require('./webpack.common.js');

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    DEBUG: true
})

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',

    plugins: [
        definePlugin
    ]
});