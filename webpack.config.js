const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

module.exports = {
    entry: './src/index.js',
    watch: true,
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
      compress: true,
      port: 9000,
      watchFiles: ["./src/**/*"]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new MiniCssExtractPlugin(),
        new ImageMinimizerPlugin({
            minimizer: {
                // Implementation
                implementation: ImageMinimizerPlugin.imageminMinify,
                // Options
                options: {
                    plugins: [
                        "imagemin-gifsicle",
                        "imagemin-mozjpeg",
                        "imagemin-pngquant",
                        "imagemin-svgo",
                    ],
                },
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                type: "asset",
            },
        ],
    }
};