// Dependencies
var path = require('path');
var jade = require('jade');
var wp = require('webpack');

// Plugins
var $ = {
	HTML: require('html-webpack-plugin'),
	Clean: require('clean-webpack-plugin'),
	Extract: require('extract-text-webpack-plugin'),
	Define: wp.DefinePlugin,
	Dedupe: wp.optimize.DedupePlugin
};

// Main paths
var __SRC = path.resolve(__dirname, 'src');
var __DIST = path.resolve(__dirname, 'dist');
var __BOWER = path.resolve(__dirname, 'bower_components');

// Enviroment
var ENV = process.env.ENV;
var CFG = require('./env/' + ENV);
var DEV = ENV === 'DEV';

// Webpack config object
var cfg = {
	// Build optimization flags
	cache: DEV,
	debug: DEV,
	devTool: DEV ? 'eval' : undefined,
	// Directory for resolve entries
	context: __SRC,
	// Entries
	entry: {},
	output: {},
	plugins: [],
	resolve: {
		alias: {}
	},
	module: {
		noParse: [],
		loaders: [],
		preLoaders: []
	}
};

// Index page config
var jadeCfg = {pretty: true};
var jadePath = path.resolve(__SRC, 'index.jade');
var jadeLocal = {ENV: CFG};
var indexDest = '../index.html';
var indexHTML = jade.compileFile(jadePath, jadeCfg)(jadeLocal);

// Resolves
cfg.resolve.root = [__BOWER, __SRC];
cfg.resolve.alias['img'] = path.resolve(__SRC, 'assets', 'img');
cfg.resolve.alias['font'] = path.resolve(__SRC, 'assets', 'font');
cfg.resolve.extensions = ['', '.js', '.coffee', '.json'];

// Entry / output
cfg.entry.app = 'app/app.module.js';
cfg.entry.vendor = 'vendor/vendor.module.js';
cfg.output.path = path.resolve(__DIST, 'assets');
cfg.output.publicPath = '/assets/';
if (DEV) {
	cfg.output.filename = '[name].js';
} else {
	cfg.output.filename = '[name]-[chunkhash].js';
};

// Cleaning distribution
cfg.plugins.push(new $.Clean(['dist']));

// Render index page
cfg.plugins.push(new $.HTML({
	inject: true,
	minify: !DEV,
	filename: indexDest,
	templateContent: indexHTML
}));

// Separated styles
if (DEV) {
	cfg.plugins.push(new $.Extract('[name].css'));
} else {
	cfg.plugins.push(new $.Extract('[name]-[chunkhash].css'));
};

// Define enviroment
cfg.plugins.push(new $.Define({
	ENV: JSON.stringify(CFG)
}));

// Optimizations
if (!DEV) {
	cfg.plugins.push(new $.Dedupe());
};

// Loaders
cfg.module.loaders.push({
	test: /\.js$/,
	loader: 'ng-annotate!babel',
	exclude: /node_modules|bower_components/
});

cfg.module.loaders.push({
	test: /\.css$/,
	loader: $.Extract.extract('style', 'css')
});

cfg.module.loaders.push({
	test: /\.styl$/,
	loader: $.Extract.extract('style', 'css!autoprefixer!stylus')
});

cfg.module.loaders.push({
	test: /\.coffee$/,
	loader: 'coffee'
});

cfg.module.loaders.push({
	test: /\.jade$/,
	loader: 'ng-cache?prefix=tpl/[dir]/[dir]!jade-html'
});

cfg.module.loaders.push({
	test: /\.json$/,
	loader: 'json'
});

cfg.module.loaders.push({
	test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
	loader: 'url-loader?limit=10000&name=[name]-[hash].[ext]'
});

// Export
module.exports = cfg;