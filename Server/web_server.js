
var express    = require("express");
var mysql      = require('mysql');
var fs = require("fs");
var app = express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'onshivay',
  database : 'ContentDatabase'
});


connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... ");    
  } else {
      console.log("Error connecting database ... " + err); 
  }
});

app.get('/', function (req, res) {
   
   res.end("<html><title>Wishlist</title><body><p>Welcome</p><a href='http://localhost:8081/list_movies'>List of Movies</a><br/><a href='http://localhost:8081/list_actors'>List of Actors</a><br/><a href='http://localhost:8081/list_producers'>List of Producers</a><br/><a href='http://localhost:8081/list_directors'>List of Directors</a><br/><a href='http://localhost:8081/list_music_directors'>List of Music Directors</a><br/><a href='http://localhost:8081/list_productions'>List of Productions</a><body></html>");

})

app.get('/list_movies', function (req, res) {
   
   res.end("List of all movies");

})

app.get('/list_actors', function (req, res) {
   
   res.end("List of all Actors");

})

app.get('/list_directors', function (req, res) {
   
   res.end("List of all Directors");

})

app.get('/list_music_directors', function (req, res) {
   
   res.end("List of all Music Directors");

})

app.get('/list_producers', function (req, res) {
   
   res.end("List of all Producers");

})

app.get('/list_productions', function (req, res) {
   
   res.end("List of all Productions");

})




var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Wishlist app listening at http://localhost:%s", host, port)

})