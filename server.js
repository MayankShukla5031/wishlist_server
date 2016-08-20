var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var session = require('client-sessions');

app.use(cookieParser('secret'));
app.use(expressSession());
app.use(session({
  cookieName: 'session',
  secret: 'onshivay',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
    production_house: String,
    poster_url: String
  } , {collection : 'moviecollection'});

  var actorSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'actorcollection'});
  
  var directorSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'directorcollection'});

  var producerSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'producercollection'});

  var musicDirectorSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'musicdirectorcollection'});

  var productionHouseSchema = new mongoose.Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'productionhousecollection'});

  var countSchema = new mongoose.Schema({
    movie: Number,
    actor: Number,
    director: Number,
    producer: Number,
    musicdirector: Number,
    productionhouse: Number,
    poster_url: String
  } , {collection : 'countcollection'});

  var userSchema = new mongoose.Schema({
    uid: String,
    username: String,
    wishlist: String
  } , {collection : 'usercollection'});

  var Movie = mongoose.model('moviecollection', movieSchema);
  var Actor = mongoose.model('actorcollection', actorSchema);
  var Director = mongoose.model('directorcollection', directorSchema);
  var Producer = mongoose.model('producercollection', producerSchema);
  var MusicDirector = mongoose.model('musicdirectorcollection', musicDirectorSchema);
  var ProductionHouse = mongoose.model('productionhousecollection', productionHouseSchema);
  var Count = mongoose.model('countcollection', countSchema);
  var User = mongoose.model('usercollection', userSchema);

app.get('/', function (req, res) {

	if (req.session!=undefined && req.session.userid!=undefined)	    
		res.writeHead(301, {'Location': '/index'});
	else
		res.writeHead(301, {'Location': '/login'});


res.end();
});

app.get('/login', function (req, res) {
res.end( "<html>\
			<body><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script>\
				  <h1>User is not Signed in...</h1>\
	        <a href='javascript:DoPost()'>Sign in as SK</a>\
				  <script language='javascript'>\
				  		function DoPost(){\
				  			 $.post('/login', { user: 'SK', password: 'onshivay'} ,function( data ) {  if(data!='Unauthorized') window.location.assign( data); else alert(data);});\
				  				}\
				  </script></body></html>");
});

app.get('/:action', function (req, res) {

   var action= req.params.action;
   console.log('Received GET Req:' + action);

    if(action== "logout")
    {
      delete req.session.userid;
      res.writeHead(301, {'Location': '/login'});
      res.end();
    }
    else if(action=="index")
    {
    	console.log(req.session.userid);
        fs.readFile('public/index.html' , function(err, contents) {

		res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(contents);
      });
    }
    else if(action== "home")
    {
       res.end("<html><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script></head>\
                  <body>\
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

          Movie.find({'title' : new RegExp(req.query.title, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title};});          
          res.end(JSON.stringify(list));
            });

        }
        if( req.query.actor != undefined)
        {
           
          Movie.find({'cast' : new RegExp(req.query.actor, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title};});          
          res.end(JSON.stringify(list));
            });
           
        }
        if( req.query.director != undefined)
        {
           
          Movie.find({'director' : new RegExp(req.query.director, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title};});          
          res.end(JSON.stringify(list));
            });

        }
        if( req.query.producer != undefined)
        {
           
          Movie.find({'producer' : new RegExp(req.query.producer, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title};});          
          res.end(JSON.stringify(list));
            });

        }
        if( req.query.music_director != undefined)
        {
           
          Movie.find({'music_director' : new RegExp(req.query.music_director, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title};});          
          res.end(JSON.stringify(list));
            });

        }
        if( req.query.production_house != undefined)
        {
            
          Movie.find({'production_house' : new RegExp(req.query.production_house, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title};});          
          res.end(JSON.stringify(list));
            });
           
        }
    }
    else if(action== "add")
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
                                   $.post( "/add", {"Director": document.getElementById("directorName").value} ,function(result){ alert(result);refresh();});\
                                 }\
                                 function addProducer()\
                                 {\
                                  $.post( "/add", {"Producer": document.getElementById("producerName").value} ,function(result){ alert(result);refresh();});\
                                 }\
                                 function addMusicDirector()\
                                 {\
                                   $.post( "/add", {"MusicDirector": document.getElementById("musicDirectorName").value} ,function(result){ alert(result);refresh();});\
                                 }\
                                 function addProductionHouse()\
                                 {\
                                   $.post( "/add", {"ProductionHouse": document.getElementById("productionHouseName").value} ,function(result){ alert(result);refresh();});\
                                 }\
                                 function addMovie()\
                                 {\
                                    var obj={};\
                                    \
                                    obj.MovieName=document.getElementById("movieName").value;\
                                    obj.MovieCast=getValue("movieActor");\
                                    obj.MovieDirector=getValue("movieDirector");\
                                    obj.MovieProducer=getValue("movieProducer");\
                                    obj.MovieMusicDirector=getValue("movieMusicDirector");\
                                    obj.MovieProductionHouse=getValue("movieProductionHouse");\
                                    obj.MoviePoster=document.getElementById("moviePoster").value;\
                                    $.post( "/add", obj ,function(result){ alert(result);refresh();});\
                                 }\
                                 function getValue(selectId)\
                                 {\
                                  var obj=[];\
                                  var x=document.getElementById(selectId);\
                                  if(x!=null)\
                                  for (var i = 0; i < x.options.length; i++) {\
                                     if(x.options[i].selected ==true)\
                                          obj.push(x.options[i].value);\
                                      }\
                                  else alert("ID:"+ selectId + "is null");\
                                  return obj;\
                                  }\
                                function refresh()\
                                 {\
                                    removeOptions(movieActor);\
                                    $.ajax({type:"GET", url:"/getlist?get=actors", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieActor", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieDirector);\
                                    $.ajax({type:"GET", url:"/getlist?get=directors", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieDirector", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieProducer);\
                                    $.ajax({type:"GET", url:"/getlist?get=producers", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieProducer", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieMusicDirector);\
                                    $.ajax({type:"GET", url:"/getlist?get=musicdirectors", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieMusicDirector", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    removeOptions(movieProductionHouse);\
                                    $.ajax({type:"GET", url:"/getlist?get=productionhouses", success:function(result){\
                                                                                                                var list=JSON.parse(result);\
                                                                                                               for(var k in list) {\
                                                                                                                  addSelectOption( "movieProductionHouse", list[k]);\
                                                                                                                  }\
                                                                                                             }});\
                                    document.getElementById("actorName").value="";\
                                    document.getElementById("directorName").value="";\
                                    document.getElementById("producerName").value="";\
                                    document.getElementById("musicDirectorName").value="";\
                                    document.getElementById("productionHouseName").value="";\
                                    document.getElementById("movieName").value="";\
                                    document.getElementById("moviePoster").value="";\
                                    $("#movieActor").val([]);\
                                    $("#movieDirector").val([]);\
                                    $("#movieProducer").val([]);\
                                    $("#movieMusicDirector").val([]);\
                                    $("#movieProductionHouse").val([]);\
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
                                        <td>Add Movie Poster URL:</td>\
                                        <td><input type="text" id="moviePoster"  placeholder="Movie Poster URL"/></td>\
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
    else if(action== "getlist")
    {
      if( req.query.get == "actors")
        {
          Actor.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list.sort()));
            });
        }

      if( req.query.get == "directors")
        {
          Director.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list.sort()));
            });
        }

      if( req.query.get == "producers")
        {
          Producer.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list.sort()));
            });
        }

      if( req.query.get == "musicdirectors")
        {
          MusicDirector.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list.sort()));
            });
        }

      if( req.query.get == "productionhouses")
        {
          ProductionHouse.find({}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return a.title;});
          res.end(JSON.stringify(list.sort()));
            });
        }
    }
    else if(action== "getdetails")
    {
    	if( req.query.movieid != undefined)
        {
			Movie.find({'uid' : req.query.movieid}, function (err, item) {		          
			          
					if(err) res.end("{}");
			        else  res.end(JSON.stringify(item));
			            
			         });
	    }
    }
    else if(action== "getmywishlist")
    {

      console.log('Entered getmywishlist:');

    	if( req.session.userid != undefined)
        {

        console.log('User present:'+req.session.userid);

			   User.find({'username' : req.session.userid}, function (err, item) {		          
			          
					if(err) res.end("{}");
			        else  res.end(JSON.stringify(item.wishlist));
			            
			         });
  	    }
      else 
      {
        console.log('User not present, redirecting to login');
        res.writeHead(301, {'Location': '/login'});
        res.end(); 
      }			       
    }
    else if(action.endsWith(".css") || action.endsWith(".js") || action.endsWith(".css.map") || action.endsWith(".ico") )
    {
    	fs.readFile('public/'+ action, function(err, contents) {

	        if (err) console.log(err);
	        else 
	        	{
			        if(action.endsWith(".css") || action.endsWith("css.map"))
			        	res.writeHead(200, {'Content-Type': 'text/css'});

			        else if(action.endsWith(".js"))
			        	res.writeHead(200, {'Content-Type': 'text/javascript'});

			        res.write(contents);
			        res.end();
	    		}
        });	
    }
    else
    {
    	res.end("unknown request" );
    }

})

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

app.post("/:action", function (req, res)
{
  var action= req.params.action;

  console.log('Received POST Req:' + action);

  if(action=="add")
  {
	    Count.findOne({}, function (err, count) 
	    {
		    if(req.body["Actor"]!= undefined)
		    {
		      if(req.body["Actor"]!="")
		        {
		          var actor = new Actor({
		                uid: "ACT100000" + count.actor,
		                title: req.body["Actor"]
		                });
		            actor.save(function(err, user) {
		                  if (err)
		                      console.log(err);
		                    });

		            count.actor= count.actor+1;
		            count.save(function(err, user) {
		                  if (err)
		                      console.log(err);
		                    });

		          res.end("Added Actor: "+ req.body["Actor"]);
		        }
		      else
		            res.end("Can not add BLANK Actor");

		    }
		    else if(req.body["Director"]!= undefined)
		    {
		      if(req.body["Director"]!="")
		        {
		          var director = new Director({
		                uid: "DIR100000" + count.director,
		                title: req.body["Director"]
		                });
		            director.save(function(err, user) {
		                  if (err)
		                      console.log(err);
		                    });

		            count.director= count.director+1;
		            count.save(function(err, user) {
		                  if (err)
		                      console.log(err);
		                    });

		          res.end("Added Director: "+ req.body["Director"]);
		        }
		      else
		            res.end("Can not add BLANK Director");

		    }
		    else if(req.body["Producer"]!= undefined)
		    {
		      if(req.body["Producer"]!="")
		        {
		          var producer = new Producer({
		                  uid: "PRO100000" + count.producer,
		                  title: req.body["Producer"]
		                  });
		              producer.save(function(err, user) {
		                    if (err)
		                        console.log(err);
		                      });

		              count.producer= count.producer+1;
		              count.save(function(err, user) {
		                    if (err)
		                        console.log(err);
		                      });

		            res.end("Added Producer: "+ req.body["Producer"]);
		        }
		              else
		                    res.end("Can not add BLANK Producer");
		    
		    }
		    else if(req.body["MusicDirector"]!= undefined)
		    {

		      if(req.body["MusicDirector"]!="")
		        {
		          var musicdirector = new MusicDirector({
		                  uid: "MDR100000" + count.musicdirector,
		                  title: req.body["MusicDirector"]
		                  });
		              musicdirector.save(function(err, user) {
		                    if (err)
		                        console.log(err);
		                      });

		              count.musicdirector= count.musicdirector+1;
		              count.save(function(err, user) {
		                    if (err)
		                        console.log(err);
		                      });

		            
		            res.end("Added Music Director: "+ req.body["MusicDirector"]);
		        }
		              else
		                    res.end("Can not add BLANK Music Director");
		    }
		    else if(req.body["ProductionHouse"]!= undefined)
		    {
		      if(req.body["ProductionHouse"]!="")
		        {
		          var productionhouse = new ProductionHouse({
		                  uid: "PRH100000" + count.productionhouse,
		                  title: req.body["ProductionHouse"]
		                  });
		              productionhouse.save(function(err, user) {
		                    if (err)
		                        console.log(err);
		                      });

		              count.productionhouse= count.productionhouse+1;
		              count.save(function(err, user) {
		                    if (err)
		                        console.log(err);
		                      });

		            res.end("Added Production House: "+ req.body["ProductionHouse"]);
		        }
		              else
		                    res.end("Can not add BLANK Production House");
		    }
		    else if(req.body["MovieName"]!= undefined)
		    {
		      if(req.body["MovieName"]!="")
		        {
		          var movie = new Movie({
		                  uid: "MVI100000" + count.movie,
		                  title: req.body["MovieName"],
		                  cast: JSON.stringify(req.body["MovieCast"]),
		                  director: JSON.stringify(req.body["MovieDirector"]),
		                  producer: JSON.stringify(req.body["MovieProducer"]),
		                  music_director: JSON.stringify(req.body["MovieMusicDirector"]),
		                  production_house: JSON.stringify(req.body["MovieProductionHouse"]),
		                  poster_url: JSON.stringify(req.body["MoviePoster"])
		                  });
		              movie.save(function(err, user) {
		                    if (err)
		                        console.log(err);                
		                });

		              count.movie= count.movie+1;
		              count.save(function(err, user) {
		                    if (err)
		                        console.log(err);
		                      });
		            
		            res.end("Added Movie: "+ req.body["MovieName"]);
		        }
		              else
		                    res.end("Can not add BLANK Movie Name");
		    }
	  	});
  }
  else if (action=="login")
  {
	    var post = req.body;
	    if (post.user === 'SK' && post.password === 'onshivay') {
	      req.session.userid = 'SK';
	      //res.writeHead(301, {'Location': '/home'});
	      res.end('/index');
	    } 
	    else {
	      res.writeHead(301, {'Location': '/login'});
	      res.end(); 
	    }
  }
  else if (action=="addtowishlist")
  {

		console.log('Adding to wishlist');

	    if (req.session!=undefined && req.session.userid!=undefined)
	    {
	    	try
	    	{

		  		console.log('Adding to wishlist of user:' + req.session.userid);

		        User.findOne({'username' : req.session.userid}, function (err, item) {		          
		    			          
	    					if(err) 
	    						{
	    							console.log("Error getting wishlist");
	    							res.end("Error");
	    						}
	    			        else  
	    			        {

	    			        	console.log("Added movie to wishlist");
	    			        	console.log('Item:'+JSON.stringify(item));

	    			        	var wish= [];

	    			        	wish= item.wishlist;

	    			        	console.log('wish='+JSON.stringify(wish));
	    			        	var movie = JSON.parse(req.body["movieid"]);
	    			        	if(wish!= undefined)
	    			        	{
	    			        		wish.push(movie);
	    			        		item.wishlist= wish;
								}
								else
									console.log('wishlist is undefined');

	    			        	item.save(function(err, item2) {
				                  if (err)
				                      console.log(err);
				                    });
	    			        	res.end("Added movie to wishlist");
	    			         }
	    			         });
	    	}
	    	catch(e)
	    	{
	    		console.log('Error caught:'+ e);
	    	}
	      
	    }
	    else
	    {
	  	  console.log('User not available');
	      res.writeHead(301, {'Location': '/login'});
	      res.end(); 
	    }
 }
});
