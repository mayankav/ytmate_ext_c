const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");
function getHTMLPlugins(chunks) {
  return chunks.map(
    (c) =>
      new HTMLPlugin({
        title: "YT Mate",
        filename: `${c}.html`,
        chunks: [c],
      })
  );
}
module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.resolve("./src/popup/index.tsx"),
    options: path.resolve("./src/options/index.tsx"),
    background: path.resolve("./src/background/index.ts"),
    contentScript: path.resolve("src/content/index.ts"),
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // Adds CSS to the DOM by injecting a `<style>` tag
          "css-loader", // Translates CSS into CommonJS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      // {
      //   type: "assets/resource",
      //   test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
      // },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHTMLPlugins(["popup", "options"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      root_css: path.resolve(__dirname, "src/popup/root"),
    },
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
  },
  optimization: {
    splitChunks: {
      // include all types of chunks - creates separate chunks for bigger dependencies like react and react-dom
      // so that they can be reused
      chunks: "all",
    },
  },
};
