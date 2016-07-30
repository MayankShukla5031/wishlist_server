
var express    = require("express");
var app = express();
var port=process.env.PORT || 8080;

var server = app.listen(port, function () {

  console.log("Wishlist app listening ")

})

var handleRequest = require('supertest');
var fs = require("fs");
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

app.get('/', function (req, res) {

res.end('<html><body><a href="/home">Home</a></body></html>');

});

app.get('/:action', function (req, res) {
   
   var action= req.params.action;

    if(action== "home")
    {
       res.end("<html><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script></head><title>Wishlist</title><body><p>Welcome</p><a href='/list_movies'>List of Movies</a><br/><a href='/list_actors'>List of Actors</a><br/><a href='/list_producers'>List of Producers</a><br/><a href='/list_directors'>List of Directors</a><br/><a href='/list_music_directors'>List of Music Directors</a><br/><a href='/list_productions'>List of Productions</a><br/><br/><input type='text'  onchange='searchByTitle(this)' placeholder='Search By Movie Title'><br/><br/><input type='text'  onchange='searchByActor(this)' placeholder='Search By Actor'><br/><br/><input type='text'  onchange='searchByDirector(this)' placeholder='Search By Director'><br/><br/><input type='text'  onchange='searchByProducer(this)' placeholder='Search By Producer'><br/><br/><input type='text'  onchange='searchByMusicDirector(this)' placeholder='Search By Music Director'><br/><br/><input type='text'  onchange='searchByProductionHouse(this)' placeholder='Search By Production House'><br/><br/><p id='search_output'>result</p><script>function searchByTitle(obj){ showResult ('title', obj.value);}function searchByActor(obj){ showResult ('actor', obj.value);}function searchByDirector(obj){ showResult ('director', obj.value);}function searchByProducer(obj){ showResult ('producer', obj.value);}function searchByMusicDirector(obj){ showResult ('music_director', obj.value);}function searchByProductionHouse(obj){ showResult ('production_house', obj.value);}function showResult( searchType, searchString){  var searchUrl='/search?'+searchType+'='+ searchString; $.ajax({type: 'GET', url: searchUrl, success:function(result){ $('#search_output').html(result); }});}</script></body></html>");
    }
     else if(action== "list_movies")
    {
       var queryString= "select moviescollection.title from moviescollection";

       connection.query(queryString, function(err, rows, fields) {
        if (err)  { res="Error"; throw err;}
         res.end(JSON.stringify(rows));
        });    
     }
     else if(action== "list_actors")
     {
        var queryString= "select actorscollection.title from actorscollection";

         connection.query(queryString, function(err, rows, fields) {
          if (err)  { res="Error"; throw err;}
           res.end(JSON.stringify(rows));
          });    
     }
     else if(action== "list_directors")
     {
        var queryString= "select directorscollection.title from directorscollection";

         connection.query(queryString, function(err, rows, fields) {
          if (err)  { res="Error"; throw err;}
           res.end(JSON.stringify(rows));
          });  
     }
    else if(action== "list_music_directors")
     {
        var queryString= "select musicdirectorscollection.title from musicdirectorscollection";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; throw err;}
             res.end(JSON.stringify(rows));
            });
     }

    else if(action== "list_producers")
     {
        var queryString= "select producerscollection.title from producerscollection";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; throw err;}
             res.end(JSON.stringify(rows));
            });
        
     }

     else if(action== "list_productions")
     {
         var queryString= "select productionscollection.title from productionscollection";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; throw err;}
             res.end(JSON.stringify(rows));
            });
    }
    else if(action== "search")
     {

        if( req.query.title != undefined)
        {
            var queryString= "select moviescollection.title from moviescollection where moviescollection.title LIKE '%"+ req.query.title+"%'";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; console.log("Errror"); throw err;}

             res.end(JSON.stringify(rows));
            });
        }
        if( req.query.actor != undefined)
        {
            var queryString= "select moviescollection.title from moviescollection  join actorscollection where moviescollection.cast LIKE CONCAT('%', actorscollection.uid ,'%') && actorscollection.title LIKE '%"+ req.query.actor+"%'";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; console.log("Errror"); throw err;}

             res.end(JSON.stringify(rows));
            });            
        }
        if( req.query.director != undefined)
        {
           var queryString= "select moviescollection.title from moviescollection join directorscollection where moviescollection.director LIKE CONCAT('%', directorscollection.uid ,'%')  && directorscollection.title LIKE '%"+ req.query.director+"%'";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; console.log("Errror"); throw err;}

             res.end(JSON.stringify(rows));
            });
        }
        if( req.query.producer != undefined)
        {
           var queryString= "select moviescollection.title from moviescollection join producerscollection where moviescollection.producer LIKE CONCAT('%', producerscollection.uid ,'%')  && producerscollection.title LIKE '%"+ req.query.producer+"%'";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; console.log("Errror"); throw err;}

             res.end(JSON.stringify(rows));
            });
        }
        if( req.query.music_director != undefined)
        {
           var queryString= "select moviescollection.title from moviescollection join musicdirectorscollection where moviescollection.music_director LIKE CONCAT('%', musicdirectorscollection.uid ,'%')  && musicdirectorscollection.title LIKE '%"+ req.query.music_director+"%'";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; console.log("Errror"); throw err;}

             res.end(JSON.stringify(rows));
            });
        }
        if( req.query.production_house != undefined)
        {
            var queryString= "select moviescollection.title from moviescollection join productionscollection where moviescollection.production LIKE CONCAT('%', productionscollection.uid ,'%')  && productionscollection.title LIKE '%"+ req.query.production_house+"%'";

           connection.query(queryString, function(err, rows, fields) {
            if (err)  { res="Error"; console.log("Errror"); throw err;}

             res.end(JSON.stringify(rows));
            });            
        }
    }

})