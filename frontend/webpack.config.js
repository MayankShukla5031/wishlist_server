var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack')
// var path = require('path');

module.exports = {
  context: __dirname,
  // devtool: debug ? "inline-sourcemap" : null,
  entry: './app/index.js',
  devtool:"cheap-module-source-map",

  output: {
    path: __dirname + "/public/",
    filename: "bundle.js"
  },

  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        // include: [
        //   path.resolve(__dirname, "app/assets")
        // ],
        loader: 'babel-loader?presets[]=es2015&presets[]=react' 
      },{
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },

  // add this handful of plugins that optimize the build
  // when we're in production
  plugins: [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
]
}
