const VueLoaderplugin = require("vue-loader/lib/plugin"); //vue-loader/lib/plugin
const path = require("path");

// console.log("PATH: " + path.resolve(__dirname, "./src/resources/sass"));
const scssPath = path.resolve(__dirname, "./src/resources/common.scss");
console.log("scssPath: " + scssPath + "\n");

module.exports = {
  target: "node", // web
  //   watch: true,
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/test.ts",
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "test.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue/,
        loader: "vue-loader"
      },
      {
        test: /\.js/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.css/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.scss/,
        use: [
          //   { loader: MiniCssExtractPlugin.loader },
          {
            loader: "vue-style-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true
              //   minimize: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
          // "Make sure 'options.resources' is String or Array of Strings." というのが出るのでいったんコメントアウト。https://github.com/shakacode/sass-resources-loader/issues/35で議論されているがよくわからん。
          //   {
          //     loader: "sass-resources-loader",
          //     options: {
          //       resources: [
          //         path.resolve(__dirname, "./src/resources/common.scss"),
          //         path.resolve(__dirname, "./src/resources/_variables.scss")
          //       ]
          //     }
          //   }
        ],
        exclude: /node_modules/
      }
    ]
  },

  //   externals: ["axios"],
  resolve: {
    extensions: [".ts", ".js", ".vue", ".scss"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },

  plugins: [new VueLoaderplugin()],
  node: {
    fs: "empty",
    net: "empty"
  }
};
