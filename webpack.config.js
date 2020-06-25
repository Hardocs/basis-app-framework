// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [
//           "style-loader",
//           { loader: "css-loader", options: { importLoaders: 1 } },
//           "postcss-loader",
//         ],
//       },
//     ],
//   },
// }
module.exports = {
  // ...
  module: {
    rules: [
      {
        // ...
        test: /\.css$/,
        use: [
          // ...
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        ],
      }
    ],
  }
}
