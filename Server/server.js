
var express    = require("express");

var app = express();
var $ = require('jQuery');
var handleRequest = require('supertest');
var fs = require("fs");
/*
var mysql      = require('mysql');

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

*/
app.get('/', function (req, res) {
   
res.end("<html><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script></head><title>Wishlist</title><body><p>Welcome</p><a href='/list_movies'>List of Movies</a><br/><a href='/list_actors'>List of Actors</a><br/><a href='/list_producers'>List of Producers</a><br/><a href='/list_directors'>List of Directors</a><br/><a href='/list_music_directors'>List of Music Directors</a><br/><a href='/list_productions'>List of Productions</a><br/><br/><input type='text'  onchange='searchByTitle(this)' placeholder='Search By Movie Title'><br/><br/><input type='text'  onchange='searchByActor(this)' placeholder='Search By Actor'><br/><br/><input type='text'  onchange='searchByDirector(this)' placeholder='Search By Director'><br/><br/><input type='text'  onchange='searchByProducer(this)' placeholder='Search By Producer'><br/><br/><input type='text'  onchange='searchByMusicDirector(this)' placeholder='Search By Music Director'><br/><br/><input type='text'  onchange='searchByProductionHouse(this)' placeholder='Search By Production House'><br/><br/><p id='search_output'>result</p><script>function searchByTitle(obj){ showResult ('search_by_title', obj.value);}function searchByActor(obj){ showResult ('search_by_actor', obj.value);}function searchByDirector(obj){ showResult ('search_by_director', obj.value);}function searchByProducer(obj){ showResult ('search_by_producer', obj.value);}function searchByMusicDirector(obj){ showResult ('search_by_music_director', obj.value);}function searchByProductionHouse(obj){ showResult ('search_by_production_house', obj.value);}function showResult( searchType, searchString){  var searchUrl='/'+searchType+'?search_query='+ searchString; $.ajax({type: 'GET', url: searchUrl, success:function(result){ $('#search_output').html(result); }});}</script></body></html>");
})

/*
app.get('/list_movies', function (req, res) {
   
    var queryString= "select moviescollection.title from moviescollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });    

})

app.get('/list_actors', function (req, res) {
   
   var queryString= "select actorscollection.title from actorscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/list_directors', function (req, res) {

   var queryString= "select directorscollection.title from directorscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });    

})

app.get('/list_music_directors', function (req, res) {
   
   var queryString= "select musicdirectorscollection.title from musicdirectorscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/list_producers', function (req, res) {
   
   var queryString= "select producerscollection.title from producerscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/list_productions', function (req, res) {
   
   var queryString= "select productionscollection.title from productionscollection";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; throw err;}
     res.end(JSON.stringify(rows));
    });
    
})

app.get('/search_by_title', function (req, res) {
   
  var query= $.urlParam('search_query',req.url);

   var queryString= "select moviescollection.title from moviescollection where moviescollection.title LIKE '%"+ query+"%'";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; console.log("Errror"); throw err;}

     res.end(JSON.stringify(rows));
    });
    
})



app.get('/search_by_actor', function (req, res) {
   
  var query= $.urlParam('search_query',req.url);

   var queryString= "select moviescollection.title from moviescollection  join actorscollection where moviescollection.cast LIKE CONCAT('%', actorscollection.uid ,'%') && actorscollection.title LIKE '%"+ query+"%'";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; console.log("Errror"); throw err;}

     res.end(JSON.stringify(rows));
    });
    
})
app.get('/search_by_director', function (req, res) {
   
  var query= $.urlParam('search_query',req.url);

   var queryString= "select moviescollection.title from moviescollection join directorscollection where moviescollection.director LIKE CONCAT('%', directorscollection.uid ,'%')  && directorscollection.title LIKE '%"+ query+"%'";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; console.log("Errror"); throw err;}

     res.end(JSON.stringify(rows));
    });
    
})
app.get('/search_by_producer', function (req, res) {
   
  var query= $.urlParam('search_query',req.url);

   var queryString= "select moviescollection.title from moviescollection join producerscollection where moviescollection.producer LIKE CONCAT('%', producerscollection.uid ,'%')  && producerscollection.title LIKE '%"+ query+"%'";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; console.log("Errror"); throw err;}

     res.end(JSON.stringify(rows));
    });
    
})
app.get('/search_by_music_director', function (req, res) {
   
  var query= $.urlParam('search_query',req.url);

   var queryString= "select moviescollection.title from moviescollection join musicdirectorscollection where moviescollection.music_director LIKE CONCAT('%', musicdirectorscollection.uid ,'%')  && musicdirectorscollection.title LIKE '%"+ query+"%'";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; console.log("Errror"); throw err;}

     res.end(JSON.stringify(rows));
    });
    
})
app.get('/search_by_production_house', function (req, res) {
   
  var query= $.urlParam('search_query',req.url);

   var queryString= "select moviescollection.title from moviescollection join productionscollection where moviescollection.production LIKE CONCAT('%', productionscollection.uid ,'%')  && productionscollection.title LIKE '%"+ query+"%'";

   connection.query(queryString, function(err, rows, fields) {
    if (err)  { res="Error"; console.log("Errror"); throw err;}

     res.end(JSON.stringify(rows));
    });
    
})

$.urlParam = function(name , url){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
  return results[1] || 0;
}

*/

var port = process.env.PORT || 8080;

var server = app.listen(port, function () {

  console.log("Wishlist app listening at http://localhost:%s", port)

})