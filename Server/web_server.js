
var express    = require("express");
var mysql      = require('mysql');
var $ = require('jQuery');
var handleRequest = require('supertest');
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
   
   res.end("<html><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script></head><title>Wishlist</title><body><p>Welcome</p><a href='http://localhost:8081/list_movies'>List of Movies</a><br/><a href='http://localhost:8081/list_actors'>List of Actors</a><br/><a href='http://localhost:8081/list_producers'>List of Producers</a><br/><a href='http://localhost:8081/list_directors'>List of Directors</a><br/><a href='http://localhost:8081/list_music_directors'>List of Music Directors</a><br/><a href='http://localhost:8081/list_productions'>List of Productions</a><br/><br/><input type='text' id='search_string' onchange='showResult()'><br/><p id='search_output'>result</p><script>function showResult(){  var searchUrl='http://localhost:8081/search_movies?search_query='+ document.getElementById('search_string').value; $.ajax({type: 'GET', url: searchUrl, success:function(result){ $('#search_output').html(result); }});}</script></body></html>");

})

app.get('/list_movies', function (req, res) {
   
    var queryString= "select * from moviescollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });    

})

app.get('/list_actors', function (req, res) {
   
   var queryString= "select * from actorscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/list_directors', function (req, res) {

   var queryString= "select * from directorscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });    

})

app.get('/list_music_directors', function (req, res) {
   
   var queryString= "select * from musicdirectorscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/list_producers', function (req, res) {
   
   var queryString= "select * from producerscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/list_productions', function (req, res) {
   
   var queryString= "select * from productionscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/search_movies', function (req, res) {
   
  var query= $.urlParam('search_query',req.url);

   var queryString= "select * from moviescollection where title LIKE '%"+ query+"%'";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; console.log("Errror"); throw err;}

     //console.log(JSON.stringify(rows));
     res.end(JSON.stringify(rows));
    });
    
})

$.urlParam = function(name , url){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
  return results[1] || 0;
}

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Wishlist app listening at http://localhost:%s", host, port)

})