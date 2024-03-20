import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

export default (env) => {
    return {
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
                    { from: './public/img/*.*', to: './img/[name][ext]' },
                    { from: './src/music/music.json', to: '../music/music.json' },
                    { from: './src/music/pieces/*.md', to: '../music/pieces/[name][ext]' }
                ]
            })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: "public/tsconfig.json",
                            projectReferences: true
                        }
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
            main: './public/index.js'
        },
        resolve: {
            extensions: ['.*', '.js', '.jsx', '.ts', '.tsx'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(import.meta.dirname, 'dist/public'),
        }
    }
};