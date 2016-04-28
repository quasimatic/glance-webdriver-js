var webpack = require('webpack');
var WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
    entry: "./src/glance-selector",
    output: {
        path: './lib',
        filename: 'glance-selector.js'
    },
    plugins: [
        new WrapperPlugin({
            header: 'module.exports = function() {',
            footer: '}'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: false
        })
    ],
    module: {
        loaders: [
            {test: /glance-selector.js/, loaders: ['babel-loader']}
        ]
    }
};