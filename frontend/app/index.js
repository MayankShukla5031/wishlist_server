import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const darkMuiTheme = getMuiTheme({});


import HomePage from './pages/homePage';
import TrendingMovies from './components/trendingmovies';
import MovieDetails from './components/moviedetails';
import MyWishList from './components/mywishlist';

//import injectTapEventPlugin from 'react-tap-event-plugin';
//injectTapEventPlugin();

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();


ReactDOM.render((
	<MuiThemeProvider muiTheme={darkMuiTheme}>
		<Router history={hashHistory}>
		    <Route path="/" component={HomePage}>
		    	<IndexRoute component={TrendingMovies}/>
		    	<Route path="/moviedetails/:movieId" component={MovieDetails}/>
		    	<Route path="/mywishlist" component={MyWishList}/>
		    </Route>
		</Router>
	</MuiThemeProvider>
), document.getElementById('app'));