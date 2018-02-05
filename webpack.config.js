const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV || 'development';

module.exports = {
    entry: [
        './src/main.tsx'
    ],

    context: __dirname,

    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js",
        publicPath: ""
    },

    devtool: "eval",

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, "src")
            },
            {
                test: /\.(eot|jpg|png|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            title: 'XO game'
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: env
        })
    ],

    devServer: {
        host: '0.0.0.0',
        port: '3030',
        contentBase: './dist',
    }
};