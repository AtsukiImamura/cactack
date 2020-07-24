const VueLoaderplugin = require("vue-loader/lib/plugin"); //vue-loader/lib/plugin
const path = require("path");
const webpack = require("webpack");

let env = "development";
let target = "web";
let fileName = "index";
let random = "";
let destDir = "./dist";
let outFileName = "";

switch (process.env.NODE_ENV) {
  case "production":
    env = "production";
    random = Math.floor(Math.random() * 10000000000000) + 150000000000000;
    break;
  case "development":
    target = "node";
    fileName = "test";
    break;
  case "test":
    break;
  case "functions":
    env = "production";
    destDir = "./functions";
    target = "node";
    fileName = "functions";
    outFileName = "index";
    break;
  default:
    throw new Error("error!");
}

// const env =
//   process.env.NODE_ENV === "production" ? "production" : "development";
// const target = process.env.NODE_ENV === "development" ? "node" : "web";
// let fileName = target === "web" ? "index" : "test";
// const random =
//   env === "production"
//     ? Math.floor(Math.random() * 10000000000000) + 150000000000000
//     : "";
console.log(
  `env=${env} target=${target} fileName=${fileName} random=${random} destDir=${destDir} outFileName=${outFileName}`
);

const scssPath = path.resolve(__dirname, "./src/resources/common.scss");
console.log("scssPath: " + scssPath + "\n");

module.exports = {
  target: target,
  mode: env,
  devtool: env === "production" ? "" : "inline-source-map",
  entry: `./src/${fileName}.ts`,
  output: {
    path: path.join(__dirname, destDir),
    filename: `${outFileName ? outFileName : fileName}.[name].js`,
    chunkFilename: `[name].bundle.js`,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue/,
        loader: "vue-loader",
      },
      // {
      //   test: /\.js/,
      //   loader: "babel-loader",
      //   exclude: /node_modules/,
      //   query: {
      //     presets: ["es2015"],
      //   },
      // },
      {
        test: /\.css/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.scss/,
        use: [
          //   { loader: MiniCssExtractPlugin.loader },
          {
            loader: "vue-style-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
              //   minimize: true
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                path.resolve(__dirname, "./src/resources/sass/common.scss"),
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },

  //   externals: ["axios"],
  resolve: {
    extensions: [".ts", ".js", ".vue", ".scss"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      config$: path.resolve(`src/env/${target}.ts`),
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    new VueLoaderplugin(),
    new webpack.ProvidePlugin({
      // other modules
      introJs: ["intro.js"],
    }),
  ],
  node: {
    fs: "empty",
    net: "empty",
  },
};
