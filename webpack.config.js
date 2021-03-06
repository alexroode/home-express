const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
        })
    ],
    module: {
        rules: [
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
    entry: [ './src/public/index.js', './src/public/scss/style.scss' ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist/public'),
    }
};