var webpack = require('webpack');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    //页面入口文件配置
    entry: {
        'ourpalm-tabset': ['./src/ourpalm-tabset.js', './src/ourpalm-tabset.css']
    },
    //入口文件输出配置
    output: {
        path: 'dist/',
        filename: '[name].min.js'
    },
    module: {
        //加载器配置
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a valid name to reference
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }],
        htmlLoader: {
            ignoreCustomFragments: [/\{\{.*?}}/]
        }
    },
    postcss: [autoprefixer({
        browsers: ['> 0%', 'last 5 versions']
    })],
    plugins: [
        new webpack.NoErrorsPlugin(),
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new ExtractTextPlugin("[name].min.css")
    ]
};