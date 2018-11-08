const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [
    {
        name: 'client',
        target: 'web',
        entry: './src/client.js',
        output: {
            path: path.join(__dirname, 'dist-prod'),
            filename: 'client.js',
            publicPath: '/',
        },
        mode: 'production',
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            modules: [
                path.resolve('./assets'),
                path.resolve('./node_modules')
            ]
        },
        devtool: false,
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules\/)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                // Make sure cacheDirectory is disabled so that Babel
                                // always rebuilds dependent modules for production use
                                cacheDirectory: false // default
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
                                localIdentName: '[hash:base64:10]',
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
            new CopyWebpackPlugin([
                {
                    context: 'assets/',
                    from: './**/*',
                    to: ''
                }
            ]),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            new BundleAnalyzerPlugin()
        ]
    }
];