const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    },
};