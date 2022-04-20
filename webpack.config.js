const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");

module.exports = {
    entry: [
        // Runtime code for hot module replacement
        'webpack/hot/dev-server.js',
        // Dev server client for web socket transport, hot and live reload logic
        'webpack-dev-server/client/index.js?hot=true&live-reload=true',
        path.join(__dirname, "src", "index.js"),
    ],
    output: { path: path.join(__dirname, "build"), filename: "index.bundle.js" },
    mode: process.env.NODE_ENV || "development",
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        client: false,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html"),
        }),
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /nodeModules/,
              use: {
                loader: 'babel-loader'
              }
            },
            {
                test: /\.css|\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            // Prefer `dart-sass`
                            implementation: require("sass"),
                        }
                    }
                ]
            },
            { 
                test: /\.(jpg|jpeg|png|gif|mp3)$/,
                use: ["file-loader", "url-loader"] 
            },
            {
                test: /\.(svg)$/,
                use: ["file-loader"]
            },
         
        ]
    },
};
