var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var session = require('client-sessions');

app.use(cookieParser('secret'));
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
var Schema = mongoose.Schema;
var ObjectId= Schema.Types.ObjectId;

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
    poster_url: String,
    inmywishlist:Boolean
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
    poster_url: String
  } , {collection : 'countcollection'});

  var Count = mongoose.model('countcollection', countSchema);

  var userSchema = new Schema({
    uid: String,
    username: String,
    wishlist:[movieSchema]//[{ type : ObjectId, ref: 'moviecollection' }]
  } , {collection : 'usercollection'});

  var User = mongoose.model('usercollection', userSchema);


app.get('/', function (req, res) {

	req.session.userid = 'SK';
	if (req.session!=undefined && req.session.userid!=undefined)	    
		res.writeHead(301, {'Location': '/index'});
	else
		res.writeHead(301, {'Location': '/login'});

	res.end();
});

app.get('/:action', function (req, res) {

	req.session.userid = 'SK';
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
      delete req.session.userid;
      res.writeHead(301, {'Location': '/login'});
      res.end();
    }
    else if(action=="index")
    {
    	console.log(req.session.userid);
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
})

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

app.post("/:action", function (req, res)
{
  req.session.userid = 'SK';
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
  if(action=="adduser")
  {
    var user = new User({
                    uid: "USR1000000",
                    username: 'SK'
                    });
                user.save(function(err, user) {
                      if (err)
                          console.log(err);
                        else console.log('user added');
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
	    if (req.session!=undefined && req.session.userid !=undefined)
	    {
	    	
		  		console.log('Adding to wishlist of user:' + req.session.userid);

		        User.findOne({'username' : req.session.userid}, function (err, user) {		          
		    			          
	    					if(err) 
	    						{
	    							console.log("Error getting wishlist");
	    							res.end("Error");
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
                        console.log(movieid);					

        								try
        								{
        									
                           Movie.findOne({'uid' : movieid}, function (err, movie) {    

                                        console.log(movie);  

                                        if(movie!=null)
                                        { 
                                          if(user['wishlist'].indexOf(movie) == -1)
                                          {                                       
                                                            										
                          										user['wishlist'].push(movie);
                          			    			        	
                          			    			        	user.save(function(err, item2) {
                          						                  if (err)
                          						                      console.log('save error:'+err);
                          			    			        	  else 
                          			    			        	  {
                          			    			        	  	console.log('Movie added to wishlist');
                          			    			        	  	var ret= {};
                          			    			        	  	ret.result="success";
                          			    			        	  	res.end(JSON.stringify(ret));
                          			    			        	  }
                          						                    });  
                                            }
                                            else
                                            console.log('Movie is already present in wishlist');

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
	  	  console.log('User not available');
	      res.writeHead(301, {'Location': '/login'});
	      res.end(); 
	    }
 }
  else if (action=="removefromwishlist")
  {
	    if (req.session!=undefined && req.session.userid!=undefined)
	    {
	    	
		  		console.log('Removing from wishlist of user:' + req.session.userid);

		        User.findOne({'username' : req.session.userid}, function (err, item) {		          
		    			          
	    					if(err) 
	    						{
	    							console.log("Error getting wishlist");
	    							res.end("Error");
	    						}
	    			        else  
	    			        {	    			        	
		    			        	var movie = req.body["movieid"];									
									var wish= item['wishlist'];

								try
								{
									if(wish.indexOf(movie) != -1)
									{
										wish.pop(movie);
										item['wishlist']= wish;
			    			        	
			    			        	item.save(function(err, item2) {
						                  if (err)
						                      console.log('save error:'+err);
			    			        	  else 
			    			        	  {
			    			        	  	console.log('Movie removed from wishlist');
			    			        	  	var ret= {};
			    			        	  	ret.result="success";
			    			        	  	res.end(JSON.stringify(ret));
			    			        	  }
						                    });   
		    			        	}
		    			        	else
										console.log('Movie is not present in wishlist');
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
	  	  console.log('User not available');
	      res.writeHead(301, {'Location': '/login'});
	      res.end(); 
	    }
 }
});
