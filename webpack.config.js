module.exports = {
  module: {
    target: 'electron-renderer',
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ]
  }
}
