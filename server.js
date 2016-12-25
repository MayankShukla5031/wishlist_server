//This is my server
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var session = require('client-sessions');
var fs = require('fs');
var imageServerUrl= "https://wishlist-image-server.herokuapp.com";

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
    user: Number,
    show: Number,
    screen: Number
  } , {collection : 'countcollection'});

  var Count = mongoose.model('countcollection', countSchema);

  var userSchema = new Schema({
    uid: String,
    username: String,
    password: String,
    email_id: String,
    phone_number: String,
    address: String,
    user_type: String,
    wishlist:[{movieid:{ type : ObjectId, ref: 'moviecollection' }}],
    screens:[{screenid:{ type : ObjectId, ref: 'screencollection' }}]
  } , {collection : 'usercollection'});

  var User = mongoose.model('usercollection', userSchema);

  var showsSchema = new Schema({ 
    uid: String,
    theatre:{userid:{ type : ObjectId, ref: 'usercollection' }},
    show_time:{ type : Date, default: Date.now },
    ticket_price: { type : Number , default : 0 },
    no_of_seats: { type : Number , default : 0 },
    min_seats:  { type : Number , default : 0 },
    movie:{movieid:{ type : ObjectId, ref: 'moviecollection' }},
    screen:{screenid:{ type : ObjectId, ref: 'screencollection' }},
    seat_selection:Object
  } , {collection : 'showcollection'});

  var Show = mongoose.model('showcollection', showsSchema);

  var screenSchema = new Schema({ 
    uid: String,
    name:String,
    address:String,
    no_of_seats: { type : Number , default : 0 },
    layout:Object
  } , {collection : 'screencollection'});

  var Screen = mongoose.model('screencollection', screenSchema);

app.get('/', function (req, res) 
{
   res.writeHead(301, {'Location': '/index'});  
   res.end();
});

app.get('/:action', function (req, res) 
{
   var action= req.params.action;
   console.log('Received GET Req:' + action);
   console.log('Req Body: '+ JSON.stringify(req.body));

    if(action=="index")
    {
      fs.readFile('frontend/public/index.html' , function(err, contents) {

      res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(contents);
        });
    }
    else if(action== "search")
    {
      if( req.query.title != undefined && req.query.title !='')
        {
          Movie.find({'title' : new RegExp(req.query.title, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'poster_url':imageServerUrl+"/poster_tiny?movieid="+a.uid };}); 
          res.end(JSON.stringify(list));
            });

        }
        if( req.query.actor != undefined && req.query.actor !='')
        {
           
          Movie.find({'cast' : new RegExp(req.query.actor, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'poster_url':imageServerUrl+"/poster_tiny?movieid="+a.uid };});          
          res.end(JSON.stringify(list));
            });
           
        }
        if( req.query.director != undefined && req.query.director != '')
        {
           
          Movie.find({'director' : new RegExp(req.query.director, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'poster_url':imageServerUrl+"/poster_tiny?movieid="+a.uid };});          
          res.end(JSON.stringify(list));
            });

        }
        if( req.query.producer != undefined &&  req.query.producer != '')
        {
           
          Movie.find({'producer' : new RegExp(req.query.producer, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'poster_url':imageServerUrl+"/poster_tiny?movieid="+a.uid };});          
          res.end(JSON.stringify(list));
            });

        }
        if( req.query.music_director != undefined && req.query.music_director != '')
        {           
          Movie.find({'music_director' : new RegExp(req.query.music_director, 'i')}, function (err, str) {
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'poster_url':imageServerUrl+"/poster_tiny?movieid="+a.uid };});          
          res.end(JSON.stringify(list));
            });
        }
        if( req.query.production_house != undefined)
        {
            
          Movie.find({'production_house' : new RegExp(req.query.production_house, 'i')}, function (err, str) {
          
          var list=[];
          list= str.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'poster_url':imageServerUrl+"/poster_tiny?movieid="+a.uid };}); 
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
      if( req.query.id != undefined)
        {
          if(req.query.id.includes("MVI"))
            {
              validateToken(req);
          
              Movie.findOne({'uid' : req.query.id}, function (err, movie) 
              { 
                    
                if(err) 
                  {
                    res.end("{}");
                  }
                 else  
                  {
                      if(movie== null)
                      {
                        sendResponse(res, 500, "Error getting movie");
                        return;
                      }
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
                                if(containsItem(user['wishlist'], movie, 'movieid'))
                                {
                                            movie.inmywishlist= true;
                                            movie.poster_url= imageServerUrl+"/poster_big?movieid="+movie.uid;                          
                                            res.end(JSON.stringify(movie));
                                   }
                                   else
                                   {
                                      movie.inmywishlist= false;
                                              movie.poster_url= imageServerUrl+"/poster_big?movieid="+movie.uid;  
                                            res.end(JSON.stringify(movie));
                                   }                                                    
                            } 
                          });   
                        }
                        else
                        {
                         movie.poster_url= imageServerUrl+"/poster_big?movieid="+movie.uid; 
                         res.end(JSON.stringify(movie));  
                        }
                  }                 
               });
            }
            else if(req.query.id.includes("SHO"))
            {
              Show.findOne({'uid' : req.query.id}).populate({path:'movie.movieid'}).populate({path:'theatre.userid'}).exec(
              function (err, show) {              
                
                if(err) 
                  {
                    res.end("{}");
                  }
                 else  
                  {     
                    if(show== null)
                        {
                          sendResponse(res, 500, "Error getting show");
                          return;
                        }                  

                        show.movie.movieid.poster_url= imageServerUrl+"/poster_big?movieid="+ show.movie.movieid.uid;
                        show.theatre.userid.password='*******'; 
                        res.end(JSON.stringify(show));                         
                  }                 
               });
            }
            else if(req.query.id.includes("SCR"))
            {
              Screen.findOne({'uid' : req.query.id},
              function (err, screen) {
                
                if(err) 
                  {
                    res.end("{}");
                  }
                 else  
                  {     
                    if(screen== null)
                        {
                          sendResponse(res, 500, "Error getting screen");
                          return;
                        }                  

                        res.end(JSON.stringify(screen));                         
                  }                 
               });
            }
         }
         else 
         {
           sendResponse(res, 400, "Bad Request"); 
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
                    list= user.wishlist.map(function(a) {return { uid:a.movieid.uid, title:a.movieid.title, poster_url:imageServerUrl+"/poster_small?movieid="+a.movieid.uid, count:a.movieid.wishcount};});
                    res.end(JSON.stringify(list));             
                    
                  });              
          }
          else 
          {
           sendResponse(res, 401, "Unauthorized"); 
          }                  
    }
    else if(action.endsWith(".css") || action.endsWith(".js") || action.endsWith(".css.map") || action.endsWith(".js.map") ||action.endsWith(".png") ||action.endsWith(".jpg") || action.endsWith(".ico") || action.endsWith(".min.css"))
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
    else if(action== "userprofile")
    {
      validateToken(req);
      
      if( req.session.user != undefined)
        {
                  
          User.findOne({'uid' : req.session.user } ).populate({path:'screens.screenid'}).exec(
          function(err,user){

          if(user!=undefined && user!={}) 
            {

              var ret= {};
              ret.result={};
              ret.result.username= user.username;
              ret.result.user_type= user.user_type;

              if(user.user_type =='theatre')
              {                
                 ret.result.screens=[];
                 ret.result.screens= user.screens.map(function(a) {return { 'screenid':a.screenid.uid};});                                                      
              }
              
                ret.result.user_id= user.uid;
                console.log(ret);
                res.end(JSON.stringify(ret));             
              
            }        
          });
        }
          else 
          {
           sendResponse(res, 401, "Unauthorized"); 
          } 
    }
    else if(action== "trendingmovies")
    {
        validateToken(req);
      
        if( req.session.user != undefined)
          {
             User.findOne({'uid' : req.session.user}).populate({path:'wishlist.movieid'}).exec(function(err, user)
                   {
                    var wishlist=[];

                      for (i=0; i< user.wishlist.length; i++)
                      {
                        wishlist.push(user.wishlist[i].movieid.uid);
                      }
                                        
                    Movie.find().sort({wishcount: -1}).limit(10).exec( 
                              function(err, movies) {
                                 
                              var list=[];
                              list= movies.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'count':a.wishcount, 'poster_url': imageServerUrl+"/poster_small?movieid="+a.uid };}); 
                              
                              for (i=0; i< list.length; i++)
                              {                        
                                list[i].inmywishlist= listContainsItem(wishlist, list[i].uid);                        
                              }

                              res.end(JSON.stringify(list));
                                         });
                  });              
          }
          else 
          {
            Movie.find().sort({wishcount: -1}).limit(10).exec( 
            function(err, movies) {
               
            var list=[];
            list= movies.map(function(a) {return { 'uid':a.uid, 'title':a.title, 'count':a.wishcount, 'poster_url': imageServerUrl+"/poster_small?movieid="+a.uid};}); 
            
              for (i=0; i< list.length; i++)
                  {                        
                    list[i].inmywishlist= false;                        
                  }
                  
            res.end(JSON.stringify(list));
                       });  
          }          
    }
    else if(action== "getmyshows")
    {
        validateToken(req);
      
        if( req.session.user != undefined)
          {
             User.findOne({'uid' : req.session.user}).exec(function(err, user)
                   {
                                                        
                    console.log('getting shows for theatre:'+ user.uid);    
                    Show.find({'theatre.userid' : user._id}).populate({path:'movie.movieid'}).exec( 
                              function(err, shows) {    

                              var list=[];
                              list= shows.map(function(a) {return { 'uid':a.uid, 'title':a.movie.movieid.title, 'poster_url':imageServerUrl+"/poster_small?movieid="+a.movie.movieid.uid , 'show_time': a.show_time , 'min_seats': a.min_seats};}); 
                                                                   
                              res.end(JSON.stringify(list));
                                         });
                  });              
          }   
          else 
          {
           sendResponse(res, 401, "Unauthorized"); 
          }              
    }
    else if(action== "getupcomingshows")
    { 
       Show.find().populate({path:'movie.movieid'}).populate({path:'theatre.userid'}).exec( 
           function(err, shows) {       

                              var list=[];
                              list= shows.map(function(a) {return { 'show_id':a.uid, 'title':a.movie.movieid.title, 'poster_url':imageServerUrl+"/poster_small?movieid="+a.movie.movieid.uid , 'show_time': a.show_time , 'min_seats': a.min_seats, 'theatre': a.theatre.userid.username, 'thetre_id':a.theatre.userid.uid, 'ticket_price':a.ticket_price};}); 
                                                                   
                              res.end(JSON.stringify(list));
           });       
    } 
    else if(action== "getshowlayout")
    {
          Show.find({'uid' : req.query.id}, function(err, show) {

          console.log(show);
          res.end(show.seat_selection);
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
   console.log('Req Body: '+ JSON.stringify(req.body));

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
  else if(action=="register")
  {
    if(req.body["username"]== undefined || req.body["username"]=="")
    {
      sendResponse(res, 400, "error: username can not be blank");  
    }
    else if(req.body["password"]== undefined || req.body["password"]=="")
    {
      sendResponse(res, 400, "error: password can not be blank");  
    }
    else if(req.body["email_id"]== undefined || req.body["email_id"]=="")
    {
       sendResponse(res, 400, "error: emailid can not be blank");  
    }
    else if(req.body["phone_number"]== undefined || req.body["phone_number"]=="")
    {
      sendResponse(res, 400, "error: phone number can not be blank");  
    }
    else if(req.body["user_type"]== undefined || req.body["user_type"]=="")
    {
      sendResponse(res, 400, "error: user type can not be blank");  
    }
    else
    {

          User.findOne({username:req.body["username"]}, function (err, user1) 
                {
                    if(user1)
                    {                       
                      sendResponse(res, 400, "error: username already taken");  
                    }
                    else
                    {
                      User.findOne({email_id:req.body["email_id"]}, function (err, user2) 
                      {
                          if(user2)
                          {                            
                           sendResponse(res, 400, "error: emailid already taken");   
                          }
                          else
                          {
                            User.findOne({phone_number:req.body["phone_number"]}, function (err, user3) 
                            {
                                if(user3)
                                {                                    
                                  sendResponse(res, 400, "error: phone number already taken");                   
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
                                                phone_number: req.body["phone_number"],
                                                user_type: req.body["user_type"]
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
       sendResponse(res, 400, "error: username/emailid/phonenumber can not be blank");  
    }
    else if(pwd== undefined || pwd=="")
    {
       sendResponse(res, 400, "error: password can not be blank");  
    }
    else
    {
      User.findOne( { $and:[{ $or:[ {'username':usr}, {'email_id':usr}, {'phone_number':usr}] },{'password':pwd}]} ).populate({path:'screens.screenid'}).exec(
        function(err,user){

          if(user!=undefined && user!={}) 
            {
              console.log(user);

              var ret= {};
              ret.result={};
              ret.result.username= user.username;
              ret.result.user_type= user.user_type;

              if(user.user_type =='theatre')
              {                
                  ret.result.screens=[];
                  ret.result.screens= user.screens.map(function(a) {return { 'screenid':a.screenid.uid};});                                                      
              }
              
                ret.result.user_id= user.uid;
                var token= generateToken(req, user.uid);
                res.set('Authorization', token);
                res.end(JSON.stringify(ret));
              
            }
            else
            {
              sendResponse(res, 400, "error: username or password is invalid");  
            }
      });
    }
  }
  else if(action== "logout")
  {
      validateToken(req);
      
      delete req.session.user;
      sendResponse(res, 200, "success");
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
                        sendResponse(res, 500, "null user");
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
                                            movieObject.movieid = movie._id   ; 

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
                                            
                                                user['wishlist']= removeItem(user['wishlist'], movie, 'movieid');
                                                            
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
  else if (action=="addshow")
  {
      validateToken(req);
      
      if (req.session.user !=undefined)
      {
          console.log('Adding show for user:' + req.session.user);

            User.findOne({'uid' : req.session.user}, function (err, user) {             
                        
                  if(err) 
                  {
                    sendResponse(res, 500, "Error getting user");
                  }
                  else
                  {
                      if(user==null)
                      {
                        sendResponse(res, 500, "null user");
                        return;
                      }
                        var movieid = req.body["movie_id"];
                        console.log(movieid);

                        try
                        {                         
                           Movie.findOne({'uid' : movieid}, function (err, movie) 
                              {

                                if(movie!=null)
                                  {

									var screenid = req.body["screen_id"];
			                        console.log(screenid);

									Screen.findOne({'uid' : screenid}, function (err, screen) 
									    {

									      if(screen!=null)
									        {
			                                    Count.findOne({}, function (err, count) 
			                                        {

			                                            var movieObject={};
			                                            movieObject.movieid = movie._id ; 

			                                            var userObject={};
			                                            userObject.userid = user._id   ; 

			                                            var screenObject={};
			                                            screenObject.screenid = screen._id;

                                                    var seats=0;
                                                  for(i=0;i<screen.layout.length;i++)
                                                    for (j=0;j<screen.layout[i].length;j++)
                                                      if(screen.layout[i][j]=='1')
                                                        seats++;

			                                            var show = new Show({
			                                            uid: "SHO100000" + count.show,
			                                            theatre:userObject,
			                                            show_time: new Date(req.body["show_time"]),
			                                            ticket_price: req.body["ticket_price"],
			                                            no_of_seats: seats,
			                                            min_seats:req.body["min_seats"],
			                                            screen:screenObject,
			                                            movie: movieObject,
                                                  seat_selection:screen.layout
			                                            });



			                                            show.save(function(err, user) {
			                                                  if (err)
			                                                      console.log(err);
			                                                    else {
			                                                      console.log('Added Show');

			                                                        count.show= count.show+1;
			                                                        count.save(function(err, user) {
			                                                              if (err)
			                                                                  console.log(err);
			                                                                });

			                                                      sendResponse(res, 200, "success"); 

			                                                      }                                                    
			                                                    });

			                                          });
			                                  }
			                              	
			                            });
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
  else if (action=="cancelshow")
  {
      validateToken(req);
      
      if (req.session.user !=undefined)
      {
        User.findOne({'uid' : req.session.user }, function (err, user) {          
                        

            Show.findOne({'uid' : req.body.show_id, 'theatre.userid': user._id}).remove(function(err, item2) 
                           {
                             if (err)
                                 sendResponse(res, 500, "Error deleting show");
                                else 
                                {
                               console.log('Canceling show:' + req.body.show_id);
                               sendResponse(res, 200, "success");
                             }
                          });
            });
      }
      else
      {
        sendResponse(res, 401, "Unauthorized"); 
      }
  }
  else if (action=="addscreen")
  {
      validateToken(req);
      
      if (req.session.user !=undefined)
      {
          console.log('Adding screen for user:' + req.session.user);

            User.findOne({'uid' : req.session.user}, function (err, user) {             
                        
                  if(err) 
                  {
                    sendResponse(res, 500, "Error getting user");
                  }
                  else
                  {
                      if(user==null)
                      {
                        sendResponse(res, 500, "null user");
                        return;
                      }
                        var screenid = req.body["screen_id"];

                        try
                        {                                                   
                                    Count.findOne({}, function (err, count) 
                                        {

                                            var layout = req.body["layout"];
                                            var seats=0;
                                                  for(i=0;i<layout.length;i++)
                                                    for (j=0;j<layout[i].length;j++)
                                                      if(layout[i][j]=='1')
                                                        seats++;

                                            var screen = new Screen({
                                            uid: "SCR100000" + count.screen,
                                            name:req.body["name"],
                                            address:req.body["address"],
                                            no_of_seats: seats,
                                            layout:layout
                                            });

                                            var screenObject={};
                                            screenObject.screenid = screen._id ; 

                                            screen.save(function(err, screen1) {
                                                  if (err)
                                                      console.log(err);
                                                    else {
                                                                                                            
                                                      if(user['screens']== undefined )
                                                       user['screens']=[];

                                                        user['screens'].push(screenObject);

                                                        user.save(function(err, user1) {

                                                          if (err)
                                                              console.log(err);
                                                            else {

                                                                count.screen= count.screen+1;
                                                                count.save(function(err, item) {
                                                                      if (err)
                                                                          console.log(err);
                                                                      else         
                                                                      {    

                                                                        console.log('Added Screen');                                                       
                                                                       sendResponse(res, 200, "success"); 
                                                                     }
                                                                        });
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
  else if (action=="removescreen")
  {
      validateToken(req);
      
      if (req.session.user !=undefined)
      {
            console.log('Removing screen:' + req.body.screen_id);
             User.findOne({'uid' : req.session.user}, function (err, user) {             
                        
                  if(err) 
                  {
                    sendResponse(res, 500, "Error getting user");
                  }
                  else
                  {
                      if(user==null)
                      {
                        sendResponse(res, 500, "null user");
                        return;
                      }
                        var screenid = req.body["screen_id"];

                        try
                        {                         
                           Screen.findOne({'uid' : screenid}, function (err, screen) {                             
                           
                             if (err)
                                 sendResponse(res, 500, "Error deleting screen");
                              else 
                                {
                                  if(screen==null)
                                  {
                                    sendResponse(res, 500, "null screen");
                                    return;
                                  }

                                user['screens']= removeItem(user['screens'], screen, 'screenid');
                                screen.remove(function(err, item2) {
                                  if (err)
                                       sendResponse(res, 500, "Error deleting screen");
                                    else 
                                     {
                                       user.save(function(err, user1) {
                                                          if (err)
                                                              console.log(err);
                                                            else {

                                                              sendResponse(res, 200, "success");
                                                            }
                                     
                                        });
                                
                                    }
                              
                                });

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
  else if (action=="bookticket")
  { 
    validateToken(req);
      
      if (req.session.user !=undefined)
      {
        User.findOne({'uid' : req.session.user }, function (err, user) {          
                        

            Show.findOne({'uid' : req.body.show_id}, function(err, show) 
                           {
                             if (err)
                                 sendResponse(res, 500, "Error finding show");
                                else 
                                {
                                 var seat_selection= show.seat_selection;

                                 var selected_seats= req.body.selected_seats;

                                  for (i = 0; i < selected_seats.length; i++) {

                                    var rowCol= selected_seats[i];
                                    seat_selection[rowCol[0]][rowCol[1]]= 2;
                                  }

                                 show.seat_selection= seat_selection;
                                                     show.save(function(err, user) {
                                                        if (err)
                                                            console.log(err);
                                                          else {
                                                           
                                                            sendResponse(res, 200, "success"); 

                                                            }                                                    
                                                          });

                                }
                          });
            });
      }
      else
      {
        sendResponse(res, 401, "Unauthorized"); 
      }
  }
  else
  {
    res.end("unknown request" );
  }
});

function containsItem(list, item, itemid) 
{
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i][itemid].equals(item._id)) {

            return true;
        }
    }         
    return false;
}

function removeItem(list, item, itemid) 
{
    var i;
    var newList=[];
    for (i = 0; i < list.length; i++) {
        if (!list[i][itemid].equals(item._id)) {
            newList.push(list[i]);
        }
    }
    return newList;
}

function listContainsItem(list, item) 
{
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i]===item) {
            return true;
        }
    }         
    return false;
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
    req.session.user =null;
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
