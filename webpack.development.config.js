const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

module.exports = [
    {
        name: 'client',
        target: 'web',
        mode: 'development',
        entry: [
            'react-hot-loader/patch',
            './src/client.js',
        ],
        output: {
            path: path.join(__dirname, 'dist-dev/build'),
            filename: 'client.js',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            modules: [
                path.resolve('./assets'),
                path.resolve('./node_modules')
            ]
        },
        devtool: 'source-map',
        devServer: {
            contentBase: "dist-dev",
            hot: true,
            historyApiFallback: true,
            compress: true,
            host: 'localhost',
            port: '8080',
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules\/)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader"
                        }
                    ]
                }
            ],
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new CopyWebpackPlugin([
                {
                    context: 'assets/',
                    from: './**/*',
                    to: ''
                }
            ]),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]
    }
];