// webpack --config webpack-sitelette.config.js
'use strict';

var path = require('path'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		'bundle': './app/app_sitelette/sitelette.js'
	},
	output: {
		path: './app/app_sitelette/build/',
		filename: '[name].js'
	},
	devtool: 'cheap-module-eval-source-map', // development
	watch: true,
	keepalive: true,
	module: {
		loaders: [
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap'),
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap'),
				exclude: /node_modules/
			},
			{
				test: /vendor\/.+\.(jsx|js)$/,
				loader: 'imports?jQuery=jquery,$=jquery,this=>window',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'_': 'underscore',
			'Backbone': 'backbone'
		}),
	],
	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js', '.es6', '.jsx'],
		alias: {
			'jqm': 'jquery-mobile/dist/jquery.mobile'
		},
	},
};
