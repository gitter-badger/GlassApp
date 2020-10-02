const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const outputPath = path.resolve(__dirname, "dist");

const { execSync } = require("child_process");
const { EnvironmentPlugin } = require("webpack");

module.exports = (env, args) => {
    const MODE = args.mode || "development";
    const PUBLIC_PATH = process.env.PUBLIC_PATH || "/";
    const GIT_HASH = process.env.GIT_HASH || getGitHash();
    const TIMESTAMP = new Date().toUTCString();

    const isDevMode = MODE === "development";

    console.log("Mode:        ", MODE);
    console.log("Public Path: ", PUBLIC_PATH);
    console.log("Git Hash:    ", GIT_HASH);
    console.log("Timestamp:   ", TIMESTAMP);

    const styleLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            esModule: true,
            hmr: isDevMode,
        },
    };

    return {
        entry: {
            index: "./src/index.tsx",
        },
        mode: MODE,
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        styleLoader,
                        // Translates CSS into CommonJS
                        "css-loader",
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        styleLoader,
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg|ttf|eot)$/i,
                    use: [{ loader: "file-loader", options: { esModule: false } }],
                },
            ],
        },
        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".jsx"],
            alias: {},
        },
        output: {
            filename: isDevMode ? "[name].bundle.js" : "[name].[contenthash].bundle.js",
            chunkFilename: isDevMode ? "[name].bundle.js" : "[name].[contenthash].bundle.js",
            publicPath: PUBLIC_PATH,
            path: outputPath,
        },
        devtool: isDevMode ? "eval-source-map" : "none",
        plugins: [
            new MiniCssExtractPlugin({
                filename: isDevMode ? "[name].css" : "[name].[hash].css",
                chunkFilename: isDevMode ? "[id].css" : "[id].[hash].css",
            }),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
            new ForkTsCheckerPlugin(),
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: isDevMode ? "server" : "static",
                analyzerPort: 1234,
            }),
            new EnvironmentPlugin([]),
            new CleanWebpackPlugin(),
            isDevMode && new ReactRefreshWebpackPlugin(),
            isDevMode && new webpack.HotModuleReplacementPlugin(),
        ].filter(Boolean),
        watchOptions: {
            ignored: /node_modules/,
        },
        devServer: {
            contentBase: outputPath,
            host: "0.0.0.0",
            hot: isDevMode,
        },
    };
};

function getGitHash() {
    try {
        return execSync("git rev-parse HEAD").toString().replace(/\s/g, "");
    } catch (e) {
        return undefined;
    }
}
