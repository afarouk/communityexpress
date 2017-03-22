'use strict';

var path = require('path'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	themesConfig = [],
	themesCount = 1;

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
	themesConfig.push(themeConfig);
}

module.exports = themesConfig;