var express = require("express");
var app = express();
var bodyParser = require('body-parser')

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

var mongoose = require('mongoose');
var mongodbUri = 'mongodb://skverma:skverma@ds139425.mlab.com:39425/wishlist';
mongoose.connect(mongodbUri);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {});

  var movieSchema = new mongoose.Schema({
    uid: String,
    title: String,
    release:{ type : Date, default: Date.now },
    cast: String,
    director: String,
    producer: String,
    music_director: String,
    poduction_house: String
  } , {collection : 'moviecollection'});

  var actorSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String
  } , {collection : 'actorcollection'});
  
  var directorSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String
  } , {collection : 'directorcollection'});

  var producerSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String
  } , {collection : 'producercollection'});

  var musicDirectorSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String
  } , {collection : 'musicdirectorcollection'});

  var productionHouseSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String
  } , {collection : 'productionhousecollection'});

  var countSchema = new mongoose.Schema({
    movie: Number,
    actor: Number,
    director: Number,
    producer: Number,
    musicdirector: Number,
    productionhouse: Number
  } , {collection : 'countcollection'});

  var Movie = mongoose.model('moviecollection', movieSchema);
  var Actor = mongoose.model('actorcollection', actorSchema);
  var Director = mongoose.model('directorcollection', directorSchema);
  var Producer = mongoose.model('producercollection', producerSchema);
  var MusicDirector = mongoose.model('musicdirectorcollection', musicDirectorSchema);
  var ProductionHouse = mongoose.model('productionhousecollection', productionHouseSchema);
  var Count = mongoose.model('countcollection', countSchema);

app.get('/', function (req, res) {

    res.end("<html><body><h1>Welcome to wishlist app...</h1><br/>\
                          <a href='/add' />Add Items to Database</a>\
                   <body></html>");
});

app.get('/:action', function (req, res) {
   
   var action= req.params.action;
/*
     if(action== "home")
    {
       res.end("<html><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script></head>\
                  <title>Wishlist</title>\
                  <body><p>Welcome</p>\
                    <input type='text'  onchange='searchByTitle(this)' placeholder='Search By Movie Title'><br/><br/>\
                    <input type='text'  onchange='searchByActor(this)' placeholder='Search By Actor'><br/><br/>\
                    <input type='text'  onchange='searchByDirector(this)' placeholder='Search By Director'><br/><br/>\
                    <input type='text'  onchange='searchByProducer(this)' placeholder='Search By Producer'><br/><br/>\
                    <input type='text'  onchange='searchByMusicDirector(this)' placeholder='Search By Music Director'><br/><br/>\
                    <input type='text'  onchange='searchByProductionHouse(this)' placeholder='Search By Production House'><br/><br/>\
                    <p id='search_output'>result</p>\
                    <script>function searchByTitle(obj){ showResult ('title', obj.value);}\
                      function searchByActor(obj){ showResult ('actor', obj.value);}\
                      function searchByDirector(obj){ showResult ('director', obj.value);}\
                      function searchByProducer(obj){ showResult ('producer', obj.value);}\
                      function searchByMusicDirector(obj){ showResult ('music_director', obj.value);}\
                      function searchByProductionHouse(obj){ showResult ('production_house', obj.value);}\
                      function showResult( searchType, searchString)\
                        {  var searchUrl='/search?'+searchType+'='+ searchString;\
                           $.ajax(\
                                  {type: 'GET', url: searchUrl, success:function(result)\
                                                                        { \
                                                                          $('#search_output').html(result); \
                                                                        }\
                                  });\
                        }\
                    </script></body></html>");
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
    else*/ if(action== "add")
    {
          res.end('<html><head><style>select{onmousedown="if(this.options.length>8){this.size=8;}"  onchange="this.size=0;" onblur="this.size=0;"}</style>\
                              <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>\
                              <script>\
                                 function addActor()\
                                 {\
                                  $.post( "/add", {"Actor": document.getElementById("actorName").value} ,function(result){ alert(result);refresh();});\
                                 }\
                                 function addDirector()\
                                 {\
                                   $.post( "/add", {"Director": document.getElementById("directorName").value} ,function(result){ alert(result);refreshSelects();});\
                                 }\
                                 function addProducer()\
                                 {\
                                  $.post( "/add", {"Producer": document.getElementById("producerName").value} ,function(result){ alert(result);refreshSelects();});\
                                 }\
                                 function addMusicDirector()\
                                 {\
                                   $.post( "/add", {"MusicDirector": document.getElementById("musicDirectorName").value} ,function(result){ alert(result);refreshSelects();});\
                                 }\
                                 function addProductionHouse()\
                                 {\
                                   $.post( "/add", {"ProductionHouse": document.getElementById("productionHouseName").value} ,function(result){ alert(result);refreshSelects();});\
                                 }\
                                 function refresh()\
                                 {\
                                    removeOptions(movieActor);\
                                    $.ajax({type:"GET", url:"/getdbvalues?get=actors", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieActor", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieDirector);\
                                    $.ajax({type:"GET", url:"/getdbvalues?get=directors", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieDirector", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieProducer);\
                                    $.ajax({type:"GET", url:"/getdbvalues?get=producers", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieProducer", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieMusicDirector);\
                                    $.ajax({type:"GET", url:"/getdbvalues?get=musicdirectors", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieMusicDirector", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieProductionHouse);\
                                    $.ajax({type:"GET", url:"/getdbvalues?get=productionhouses", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieProductionHouse", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                 }\
                                 function addSelectOption(selectList, addItem)\
                                 {\
                                    var x = document.getElementById(selectList);\
                                    var option = document.createElement("option");\
                                    option.text = addItem;\
                                    x.add(option);\
                                 }\
                                 function removeOptions(selectbox)\
                                  {\
                                      var i;\
                                      for(i = selectbox.options.length - 1 ; i >= 0 ; i--)\
                                      {\
                                          selectbox.remove(i);\
                                      }\
                                  }\
                                  $(function() {\
                                      refresh();\
                                    });\
                              </script>\
                          </head>\
                          <body>\
                          <table>\
                          <tr><td>\
                            <div style="width:auto;">\
                               <fieldset>\
                                  <legend style="color:blue;font-weight:bold;">Add New Entries in Database</legend>\
                                  <table>\
                                     <tr>\
                                        <td>Add Actor:</td>\
                                        <td><input type="text" id="actorName" placeholder="Actor Name"/></td>\
                                        <td><input type="button" value="Add" onclick="addActor()"/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Add Director:</td>\
                                        <td><input type="text" id="directorName" placeholder="Director Name"/></td>\
                                        <td><input type="button" value="Add" onclick="addDirector()"/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Add Producer:</td>\
                                        <td><input type="text" id="producerName" placeholder="Producer Name"/></td>\
                                        <td><input type="button" value="Add" onclick="addProducer()"/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Add Music Director:</td>\
                                        <td><input type="text" id="musicDirectorName" placeholder="Music Director Name"/></td>\
                                        <td><input type="button" value="Add" onclick="addMusicDirector()"/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Add Production House:</td>\
                                        <td><input type="text" id="productionHouseName" placeholder="Production House Name"/></td>\
                                        <td><input type="button" value="Add" onclick="addProductionHouse()"/></td>\
                                     </tr>\
                                  </table>\
                               </fieldset>\
                            </div></td><td>\
                            <div style="width:auto;">\
                               <fieldset>\
                                  <legend style="color:blue;font-weight:bold;">Add New Movie in Database</legend>\
                                  <table>\
                                     <tr>\
                                        <td>Movie Name:</td>\
                                        <td><input type="text" id="movieName" placeholder="Movie Name"/></td>\
                                        </tr>\
                                     <tr>\
                                        <td>Select Actor:</td>\
                                        <td><select id="movieActor" multiple/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Select Director:</td>\
                                        <td><select id="movieDirector" multiple multiple/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Select Producer:</td>\
                                        <td><select id="movieProducer" multiple/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Select Music Director:</td>\
                                        <td><select id="movieMusicDirector" multiple/></td>\
                                     </tr>\
                                     <tr>\
                                        <td>Select Production House:</td>\
                                        <td><select id="movieProductionHouse" multiple/></td>\
                                        <td><input type="button" value="Add Movie" onclick="addMovie()"/></td>\
                                     </tr>\
                                  </table>\
                               </fieldset>\
                            </div></td>\
                          </table>\
                          </body></html>');        
    }
    else if(action== "getdbvalues")
    {
      if( req.query.get == "actors")
        {
          Actor.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list));
            });
        }

      if( req.query.get == "directors")
        {
          Director.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list));
            });
        }

      if( req.query.get == "producers")
        {
          Producer.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list));
            });
        }

      if( req.query.get == "musicdirectors")
        {
          MusicDirector.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list));
            });
        }

      if( req.query.get == "productionhouses")
        {
          ProductionHouse.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list));
            });
        }
    }
})

app.use(bodyParser.json() );  
app.use(bodyParser.urlencoded({extended: true}));

app.post("/add", function (req, res) {
    
    Count.findOne({}, function (err, count) { 

    if(req.body["Actor"]!= undefined)
    {
        var actor = new Actor({
              uid: "ACT100000" + count.actor,
              title: req.body["Actor"]
              });
          actor.save();

          count.actor= count.actor+1;
          count.save();

        res.end("Added Actor: "+ req.body["Actor"]);

    }
    else if(req.body["Director"]!= undefined)
    {
        var director = new Director({
              uid: "DIR100000" + count.director,
              title: req.body["Director"]
              });
          director.save();

          count.director= count.director+1;
          count.save();

        res.end("Added Director: "+ req.body["Director"]);

    }
    else if(req.body["Producer"]!= undefined)
    {

      var producer = new Producer({
              uid: "PRO100000" + count.producer,
              title: req.body["Producer"]
              });
          producer.save();

          count.producer= count.producer+1;
          count.save();

        res.end("Added Producer: "+ req.body["Producer"]);

    }
    else if(req.body["MusicDirector"]!= undefined)
    {
      var musicdirector = new MusicDirector({
              uid: "MDR100000" + count.musicdirector,
              title: req.body["MusicDirector"]
              });
          musicdirector.save();

          count.musicdirector= count.musicdirector+1;
          count.save();

        
        res.end("Added Music Director: "+ req.body["MusicDirector"]);

    }
    else if(req.body["ProductionHouse"]!= undefined)
    {
      var productionhouse = new ProductionHouse({
              uid: "PRH100000" + count.productionhouse,
              title: req.body["ProductionHouse"]
              });
          productionhouse.save();

          count.productionhouse= count.productionhouse+1;
          count.save();
        
        res.end("Added Production House: "+ req.body["ProductionHouse"]);

    }
  });
});