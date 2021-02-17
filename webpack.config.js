var path = require("path"),
  CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  fileExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "eot",
    "otf",
    "svg",
    "ttf",
    "woff",
    "woff2",
  ];

module.exports = {
  entry: {
    popup: path.join(__dirname, "src", "popup", "index.js"),
    options: path.join(__dirname, "src", "options", "index.js"),
    background: path.join(__dirname, "src", "background", "index.js"),
    classroom_content_script: path.join(
      __dirname,
      "src",
      "classroom_content_script.js"
    ),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        // react js(x) files
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
        resolve: {
          extensions: [".js", ".jsx"],
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        // regular files, listed above
        test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/manifest.json",
          to: "./manifest.json",
        },
        {
          from: "./src/icons/",
          to: "./icons",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      entry: path.join(__dirname, "src", "popup", "index.js"),
      template: path.join(__dirname, "src", "popup", "template.html"),
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options", "template.html"),
      filename: "options.html",
      chunks: ["options"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "background", "template.html"),
      filename: "background.html",
      chunks: ["background"],
    }),
  ],
};
