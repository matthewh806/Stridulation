const path = require('path');
const AWS = require("aws-sdk");
const merge = require('webpack-merge');
const s3Plugin = require('webpack-s3-plugin');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	optimization: {
		minimizer: [new UglifyJsPlugin()]
	},

	plugins: [
		new s3Plugin({
			s3Options: {
				credentials: new AWS.SharedIniFileCredentials(),
				// directory: path.resolve(__dirname, 'build'),
				basePath: '',
				region: 'us-west-2'
			},
			s3UploadOptions: {
				Bucket: 'matthewdharris.net'
			}
		})
	]
});