import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const darkMuiTheme = getMuiTheme({});


import WebHomePage from './pages/webhomepage';
import MobileHomePage from './pages/mobilehomepage';
import TrendingMovies from './components/trendingmovies';
import MovieDetails from './components/moviedetails';
import MyWishList from './components/mywishlist';
import MyShows from './components/myshows';
import ShowDetails from './components/showdetails';
import UpcomingShows from './components/upcomingshows';
import Profile from './components/desktop/profile'

//import injectTapEventPlugin from 'react-tap-event-plugin';
//injectTapEventPlugin();

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();


ReactDOM.render((
	<MuiThemeProvider muiTheme={getMuiTheme()}>
		<Router history={hashHistory}>
		    <Route path="/" component={window.innerWidth > 700 ? WebHomePage : MobileHomePage}>
		    	<IndexRoute component={TrendingMovies}/>
		    	<Route path="/moviedetails/:movieId" component={MovieDetails}/>
		    	<Route path="/showdetails/:showId" component={ShowDetails}/>
		    	<Route path="/mywishlist" component={MyWishList}/>
		    	<Route path="/myshows" component={MyShows}/>
		    	<Route path="/upcomingshows" component={UpcomingShows}/>
		    	<route path='/profile' component={Profile}/>
		    </Route>
		</Router>
	</MuiThemeProvider>
), document.getElementById('app'));