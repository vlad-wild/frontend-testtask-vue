const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "development",
    target: "browserslist",
    entry: "./src/index.ts",
    output: {
        filename: "js/[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: "assets/[ext]/[hash][ext][query]",
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
        }),
        new VueLoaderPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "swc-loader",
                },
            },
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, "src"),
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.vue$/,
                use: "vue-loader",
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.svg$/,
                use: "svg-vue3-loader",
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js", ".vue", ".tsx", ".scss", ".css"],
        alias: {
            vue: "vue/dist/vue.esm-bundler.js",
            "@": path.resolve(__dirname, "src"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@components": path.resolve(__dirname, "src/components"),
            "@assets": path.resolve(__dirname, "src/assets"),
        },
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    devServer: {
        port: 3039,
        historyApiFallback: true,
        // open: true,
    },
};
