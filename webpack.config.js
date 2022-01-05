const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/public/img/*.*', to: './img/[name][ext]' },
                { from: './src/music/music.json', to: '../music/music.json' },
                { from: './src/music/pieces/*.md', to: '../music/pieces/[name][ext]' }
            ]
        }),
        new webpack.DefinePlugin({ CONFIG: JSON.stringify(require("config")) })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
        ],
    },
    entry: {
        main: './src/public/index.js',
        cart: './src/ecommerce/client/index.tsx',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/public'),
    }
};