import React from 'react';
import {Link, hashhistory} from 'react-router';

import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import * as TreandingMoviesAction from '../actions/treandingmoviesaction';
import TrendingMoviesStore from '../stores/treandingmoviesstore';

var intervalID;

export default class TrendingMovies extends React.Component{

	constructor(){
		super();
		this.state = {
			trendingMovies : [],
		};
		this._trendingMovieStoreChange = this._trendingMovieStoreChange.bind(this);
	}


	componentWillMount(){
		TreandingMoviesAction._getTreandingMoviesList();
		TrendingMoviesStore.on('change', this._trendingMovieStoreChange);
		intervalID = setInterval(function(){TreandingMoviesAction._getTreandingMoviesList();}, 10000);
	}

	componentWillUnmount(){
		clearInterval(intervalID);
		TrendingMoviesStore.removeListener('change', this._trendingMovieStoreChange);	
	}

	_trendingMovieStoreChange(type){
		if(type == 'Trending_Movies'){
			let movies = TrendingMoviesStore._getTrendingMovies();
			this.setState({
				trendingMovies: movies,
			});
		}
	}


	_setTrendingMoviesUI(){		
		let uiItem = [];
		let movieName = '';
		let wishCount = 0;
		let imageUrl;
		let uid;
		uiItem = this.state.trendingMovies.map((item, index)=> {
			movieName = item.title || "Movie Name";
			wishCount = item.count || 0;
			imageUrl = item.poster_url || "http://www.getmdl.io/assets/demos/dog.png";
			uid = item.uid || item;
			// console.log('imageUrl', imageUrl);
			return(
				<Card key={index} shadow={0} style={{width: '220px', height: '300px', display:'inline-flex', marginLeft: '10px', marginTop: '10px'}}>
				    <CardTitle expand style={{color: '#fff', background: `url(${imageUrl}) no-repeat #46B6AC `}}/>
				    <CardText>
				    	{movieName}<br/>
				        Wish Count: {wishCount}
				    </CardText>
				    <CardActions border>
				        <Button colored><Link to={`moviedetails/${uid}`}>View Details</Link></Button>
		     		</CardActions>
				</Card>);
		});
		return uiItem;
	}


	render(){
		return(
			<div>
				{this._setTrendingMoviesUI()}
			</div>
		);
	}
}