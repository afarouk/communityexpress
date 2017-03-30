'use strict';

var path = require('path'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	config = [],
	themesCount = 2,
	desktopConfig = {
		name: 'desktop_config',
		entry: './app/app_sitelette/sitelette-desktop.js',
		output: {
			path: './app/app_sitelette/build/',
			filename: 'desktop.js'
		},
		devtool: 'cheap-module-eval-source-map',
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
				},
				{
				    test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				    loader: "url-loader?limit=10000&minetype=application/font-woff"
				},
				{
				    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				    loader: "file-loader"
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('desktop.css'),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery',
				'_': 'underscore',
				'Backbone': 'backbone',
				'Mn': 'backbone.marionette'
			}),
		],
		resolve: {
			modulesDirectories: ['node_modules'],
			extensions: ['', '.js', '.es6', '.jsx'],
			alias: {
			},
		}
	};
	config.push(desktopConfig);
for (var counter = 1; counter <= themesCount; counter ++) {
	var themeConfig = {
		name: 'desktop_theme_' + counter,
		entry: './app/app_sitelette/themes/' + counter + '/desktop/_scss/app.scss',
		module: {
			loaders: [
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					loaders: [
						'file?hash=sha512&digest=hex&name=[name].[ext]',
						'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
					]
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader?sourceMap'),
					exclude: /node_modules/
				}
			]
		},
		output: {
			path: path.resolve(__dirname, './app/app_sitelette/themes/' + counter + '/desktop/styles'),
			filename: "[name].css"
		},
		plugins: [
			new ExtractTextPlugin('[name].css')
		]
	};
	config.push(themeConfig);
}

module.exports = config;
//sudo npm rebuild node-sass
//http://chalkboardstoday.com/template