var webpack = require('webpack');

if (process.argv.indexOf('-p') !== -1) {
  process.env.NODE_ENV = "production";
}

var debug = process.env.NODE_ENV !== "production";
console.log('NODE_ENV:', process.env.NODE_ENV, " Debugging:"+debug);
// var path = require('path');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: './app/index.js',
  // devtool:"cheap-module-source-map",

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
  // plugins: [
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //       'NODE_ENV': JSON.stringify('production')
  //     }
  //   })
  // ]

  plugins: process.env.NODE_ENV === 'production' ? [
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({minify:true,compress:{warnings:false,side_effects:false},output:{comments:false}})
  ] : [
  ],


}
