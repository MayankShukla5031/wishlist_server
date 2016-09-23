var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var session = require('client-sessions');
var fs = require('fs');

app.use(session({
  cookieName: 'session',
  secret: 'onshivay',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: true,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  res.header("Access-Control-Expose-Headers", "Authorization");
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
var Schema = mongoose.Schema;
var ObjectId= Schema.Types.ObjectId;

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

var jwt= require('jsonwebtoken');
var secret= process.env.JWT_SECRET || "tokengeneratorsecret";

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {});

  var movieSchema = new Schema({
    uid: String,
    title: String,
    release:{ type : Date, default: Date.now },
    cast: { type : Array , default : [] },
    director: { type : Array , default : [] },
    producer: { type : Array , default : [] },
    music_director: { type : Array , default : [] },
    production_house: { type : Array , default : [] },
    poster_url: { type : String, default: "" },
    inmywishlist: Boolean,
    wishcount:{ type : Number, default: 0 }
  } , {collection : 'moviecollection'});

  var Movie = mongoose.model('moviecollection', movieSchema);

  var actorSchema = new Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'actorcollection'});

  var Actor = mongoose.model('actorcollection', actorSchema);
  
  var directorSchema = new Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'directorcollection'});

  var Director = mongoose.model('directorcollection', directorSchema);

  var producerSchema = new Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'producercollection'});

  var Producer = mongoose.model('producercollection', producerSchema);

  var musicDirectorSchema = new Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'musicdirectorcollection'});

  var MusicDirector = mongoose.model('musicdirectorcollection', musicDirectorSchema);

  var productionHouseSchema = new Schema({
    uid: String,
    title: String,
    dob: { type : Date, default: Date.now },
    tags: String,
    poster_url: String
  } , {collection : 'productionhousecollection'});

  var ProductionHouse = mongoose.model('productionhousecollection', productionHouseSchema);

  var countSchema = new Schema({
    movie: Number,
    actor: Number,
    director: Number,
    producer: Number,
    musicdirector: Number,
    productionhouse: Number,
    user: Number
  } , {collection : 'countcollection'});

  var Count = mongoose.model('countcollection', countSchema);

  var userSchema = new Schema({
    uid: String,
    username: String,
    password: String,
    email_id: String,
    phone_number: String,
    wishlist:[{movieid:{ type : ObjectId, ref: 'moviecollection' }}]
  } , {collection : 'usercollection'});

var User = mongoose.model('usercollection', userSchema);

app.get('/', function (req, res) 
{
		res.writeHead(301, {'Location': '/index'});	
	 res.end();
});

app.get('/:action', function (req, res) 
{
   var action= req.params.action;
   console.log('Received GET Req:' + action);

	  if(action== "login")
    {
      res.end( "<html>\
			<body><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script>\
				  <h1>User is not Signed in...</h1>\
	        <a href='javascript:DoPost()'>Sign in as SK</a>\
				  <script language='javascript'>\
				  		function DoPost(){\
				  			 $.post('/login', { user: 'SK', password: 'onshivay'} ,function( data ) {  if(data!='Unauthorized') window.location.assign( data); else alert(data);});\
				  				}\
				  </script></body></html>");
    }
    else if(action== "logout")
    {
      delete req.session.user;
      sendResponse(res, 200, "success");
    }
    else if(action=="index")
    {
      fs.readFile('frontend/public/index.html' , function(err, contents) {

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
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'count':a.wishcount, 'poster_url': a.poster_url};}); 
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
          validateToken(req);
      
			    Movie.findOne({'uid' : req.query.movieid}, function (err, movie) {		          
			          
					if(err) 
            {
              res.end("{}");
            }
			     else  
			      {
			        		var moviePresent = false;

                  if(req.session.user != undefined)
                  {
  			        	  User.findOne({'uid' : req.session.user}, function (err, user) {
  		    			          
    	    					if(err)
    	    						{
    	    							sendResponse(res, 500, "Error getting user");  
    	    						}
    	    			      else
    	    			      {
            									if(containsMovie(movie, user['wishlist']))
            									{
            										    movie.inmywishlist= true;                                    
                                    res.end(JSON.stringify(movie));
            		    			    }
            		    			     else
            		    			    {
            		    			        	movie.inmywishlist= false;
            			        					res.end(JSON.stringify(movie));
            		    			    }            										    			        	
  					          }	
  					    	  });		
                  }
                  else
                  {
                   res.end(JSON.stringify(movie));  
                  }
			      }			            
			         });
	       }
    }
    else if(action== "getmywishlist")
    {
        validateToken(req);
      
      	if( req.session.user != undefined)
          {
    			   User.findOne({'uid' : req.session.user}).populate({path:'wishlist.movieid'}).exec(function(err, user)
                   {
                    var list=[];
                    list= user.wishlist.map(function(a) {return { uid:a.movieid.uid, title:a.movieid.title, poster_url:a.movieid.poster_url, count:a.movieid.wishcount};});
                    res.end(JSON.stringify(list));             
                    
                  });              
      	  }
  	      else 
  	      {
  	       sendResponse(res, 401, "Unauthorized"); 
  	      }			             
    }
    else if(action.endsWith(".css") || action.endsWith(".js") || action.endsWith(".css.map") || action.endsWith(".js.map") || action.endsWith(".ico") || action.endsWith(".min.css"))
    {
    	fs.readFile('frontend/public/'+ action, function(err, contents) {

	        if (err) console.log(err);
	        else 
	        	{
			        if(action.endsWith(".css") || action.endsWith("css.map") || action.endsWith(".min.css"))
			        	res.writeHead(200, {'Content-Type': 'text/css'});

			        else if(action.endsWith(".js")|| action.endsWith("js.map"))
			        	res.writeHead(200, {'Content-Type': 'text/javascript'});

			        res.write(contents);
			        res.end();
	    		}
        });	
    }
    else if(action== "getuserprofile")
    {
      validateToken(req);
      
      if( req.session.user != undefined)
        {
          User.findOne({'uid' : req.session.user }, function (err, user) {          
        
          res.end(JSON.stringify(user));          });
        }
    }
    else if(action== "trendingmovies")
    {
      Movie.find().sort({wishcount: -1}).limit(10).exec( 
          function(err, movies) {
             
          var list=[];
          list= movies.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'count':a.wishcount, 'poster_url': a.poster_url};}); 
          res.end(JSON.stringify(list));
                     });      
    }
    else
    {
    	 res.end("unknown request" );
    }
})

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
		                  cast: req.body["MovieCast"],
		                  director: req.body["MovieDirector"],
		                  producer: req.body["MovieProducer"],
		                  music_director: req.body["MovieMusicDirector"],
		                  production_house: req.body["MovieProductionHouse"],
		                  poster_url: req.body["MoviePoster"]
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
  if(action=="register")
  {

    if(req.body["username"]== undefined || req.body["username"]=="")
    {
      sendResponse(res, 500, "error: username can not be blank");  
    }
    else if(req.body["password"]== undefined || req.body["password"]=="")
    {
      sendResponse(res, 500, "error: password can not be blank");  
    }
    else if(req.body["email_id"]== undefined || req.body["email_id"]=="")
    {
       sendResponse(res, 500, "error: emailid can not be blank");  
    }
    else if(req.body["phone_number"]== undefined || req.body["phone_number"]=="")
    {
      sendResponse(res, 500, "error: phone number can not be blank");  
    }
    else{

          User.findOne({username:req.body["username"]}, function (err, user1) 
                {
                    if(user1)
                    {                       
                      sendResponse(res, 500, "error: username already taken");  
                    }
                    else
                    {
                      User.findOne({email_id:req.body["email_id"]}, function (err, user2) 
                      {
                          if(user2)
                          {                            
                           sendResponse(res, 500, "error: emailid already taken");   
                          }
                          else
                          {
                            User.findOne({phone_number:req.body["phone_number"]}, function (err, user3) 
                            {
                                if(user3)
                                {                                    
                                  sendResponse(res, 500, "error: phone number already taken");                   
                                }
                                else
                                {
                                  Count.findOne({}, function (err, count)
                                  {
                                      var user = new User({
                                                uid: "USR100000"+ count.user,
                                                username: req.body["username"],
                                                password: req.body["password"],
                                                email_id: req.body["email_id"],
                                                phone_number: req.body["phone_number"]
                                                });

                                            user.save(function(err, user) {
                                                  if (err)
                                                      console.log(err);
                                                    else console.log('user added');
                                                    });

                                            count.user= count.user+1;
                                            count.save(function(err, user) {
                                                  if (err)
                                                      console.log(err);
                                                    });

                                          sendResponse(res, 200, "success");        
                                  });
                                }

                            });

                          }
                      });

                    }
                });
        }     
  }
  else if (action=="login")
  {
    var usr = req.body["user"];
    var pwd= req.body["password"];

    if(usr== undefined || usr=="")
    {
       sendResponse(res, 500, "error: username/emailid/phonenumber can not be blank");  
    }
    else if(pwd== undefined || pwd=="")
    {
       sendResponse(res, 500, "error: password can not be blank");  
    }
    else
    {
      User.findOne( { $and:[{ $or:[ {'username':usr}, {'email_id':usr}, {'phone_number':usr}] },{'password':pwd}]} , 
        function(err,user){

          if(user!=undefined && user!={}) 
            {
              var ret= {};
              ret.result={};
              ret.result.username= user.username;
              var token= generateToken(req, user.uid);
              res.set('Authorization', token);
              res.end(JSON.stringify(ret));
            }
            else
            {
              sendResponse(res, 500, "error: username or password is invalid");  
            }
      });
    }	    
  }
  else if (action=="addtowishlist")
  {
      validateToken(req);
      
	    if (req.session.user !=undefined)
	    {
		  		console.log('Adding to wishlist of user:' + req.session.user);

		        User.findOne({'uid' : req.session.user}, function (err, user) {		          
		    			          
	    					  if(err) 
	    						{
                    sendResponse(res, 500, "Error getting user");
	    						}
	    			      else
	    			      {
                      if(user==null)
                      {
                        console.log('Null user');
                        res.end("Null user");
                        return;
                      }
		    			        	var movieid = req.body["movieid"];	

        								try
        								{        									
                           Movie.findOne({'uid' : movieid}, function (err, movie) 
                                  {
                                        if(movie!=null)
                                        {                                          
                                            var movieObject={};
                                            movieObject.movieid = movie._id 	;	

                                              if(movieObject!=null)
                                              {
                            										user['wishlist'].push(movieObject);
                            			    			        	
                            			    			        	user.save(function(err, item2) 
                                                      {
                            						                  if (err)
                            						                      console.log('save error:'+err);
                              			    			        	  else 
                              			    			        	  {

                                                            movie.wishcount++;
                                                            movie.save(function(err, item3) 
                                                              {
                                                                  if (err)
                                                                      console.log('save error:'+err);
                                                                  else 
                                                                  {
                                                                    console.log('Movie added to wishlist');                                                                    
                                                                    sendResponse(res, 200, "success");  
                                                                  }
                                                              }); 

                              			    			        	  }
                            						              }); 
                                                    
                                              }
                                              else
                                                res.end('null id');                                            
                                        }                            
                                      
                                  }); 
        		    			        	        		    			        	
        								}
        								catch(e)
        								{
        									console.log(e);
        								}			    			        	
					        }	
					    });
	    }
	    else
	    {
	  	  sendResponse(res, 401, "Unauthorized"); 
	    }
  }
  else if (action=="removefromwishlist")
  {
      validateToken(req);

	    if (req.session.user!=undefined)
	    {
		  		console.log('Removing from wishlist of user:' + req.session.user);

		        User.findOne({'uid' : req.session.user}, function (err, user) {		          
		    			          
	    					if(err) 
	    						{
                    sendResponse(res, 500, "Error getting user");
	    						}
	    			        else  
	    			        {
        								try
        								{
                                  Movie.findOne({'uid' : req.body["movieid"]}, function (err, movie) 
                                  {                                    
                                            
                                                user['wishlist']= removeMovie(movie, user['wishlist']);
                                                            
                                                user.save(function(err, item2) {

                                                  if (err)
                                                    console.log('save error:'+err);
                                                  else 
                                                  {
                                                    movie.wishcount--;
                                                    movie.save(function(err, item3) 
                                                      {
                                                          if (err)
                                                              console.log('save error:'+err);
                                                          else 
                                                            {
                                                               console.log('Movie removed from wishlist');
                                                               
                                                               sendResponse(res, 200, "success");  
                                                             }
                                                      }); 
                                                    
                                                  }
                                                      });
                                                       
                                  });       									
        		    			        	
        								}
        								catch(e)
        								{
        									console.log(e);
        								}
			    			        	
					        }	
					    });
	    }
	    else
	    {
	  	  sendResponse(res, 401, "Unauthorized"); 
	    }
  }
});

function containsMovie(movie, list) 
{
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].movieid.equals(movie._id)) {

            return true;
        }
    }         
    return false;
}

function removeMovie(movie, list) 
{
    var i;
    var newList=[];
    for (i = 0; i < list.length; i++) {
        if (!list[i].movieid.equals(movie._id)) {
            newList.push(list[i]);
        }
    }
    return newList;
}

// generate the JWT 
function generateToken(req, tokenUser)
{
  var token = jwt.sign({
    auth: tokenUser,
    agent: req.get['user-agent'],
    exp:   Math.floor(new Date().getTime()/1000) + 24*60*60 // Note: in seconds! 
  }, secret); 
  return token;
}

// validate the token supplied in request header 
function validateToken(req) 
{
  try 
  {
    var token="";

    if(req.get('token') != undefined )
    {
      token= req.get('token');
    }

    if(token!= "")
    {
      var decoded = jwt.verify(token, secret);

      if(decoded.auth!=undefined)
      {
        req.session.user = decoded.auth;
        console.log('User:'+decoded.auth);
      }
    }

    } 
    catch (e) {
    console.log('error'+e);
    }  
}

function sendResponse(res, status, message)
{
  var ret= {};
  ret.result= message;
  res.status(status);
  res.end(JSON.stringify(ret)); 
}
