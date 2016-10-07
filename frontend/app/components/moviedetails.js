import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Grid, Cell} from 'react-mdl';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import * as MovieDetailsAction from '../actions/moviedetailsaction';
import * as MyWishListAction from '../actions/mywishlistaction';
import MovieDetailsStore from '../stores/moviedetailsstore';
import MyWishListStore from '../stores/mywishliststore';

const styles = {
	saveButtonStyle:{
		backgroundColor: '#77ADFC',
		color: 'white',
		marginLeft: '20px',
		cursor: 'pointer',
		marginLeft: '10%',
	},
	leftMargin: {
		marginLeft: '10%',
	}
}


export default class TrendingMovies extends React.Component{
	constructor(){
		super();
		this.state = {
			movieDetails : [],
			movieId: '',
			inMyWishList: false,
			buttonText: 'Add to WishList',
		};
		this._getMovieDetailsfromStore = this._getMovieDetailsfromStore.bind(this);
		this._getWishListStoreData = this._getWishListStoreData.bind(this);
	}

	componentWillMount(){
		let id = this.props.params.movieId;
		MovieDetailsAction._getMovieDetails({movieid: id});
		MovieDetailsStore.on('change',this._getMovieDetailsfromStore); 
		MyWishListStore.on('change', this._getWishListStoreData);
	}

	componentWillUnmount(){
		MovieDetailsStore.removeListener('change', this._getMovieDetailsfromStore);
		MyWishListStore.removeListener('change', this._getWishListStoreData);
	}

	componentWillReceiveProps(newKey){
		MovieDetailsAction._getMovieDetails({movieid: newKey.params.movieId});
	}

	_getMovieDetailsfromStore(type){		
		if(type == 'MovieDetails'){
			let details = MovieDetailsStore._getMovieDetails();
			let text = details.inmywishlist ? "Remove from WishList" : "Add to WishList"; 
			this.setState({
				movieId: this.props.params.movieId,
				movieDetails: details,
				inMyWishList: details.inmywishlist,
				buttonText: text
			});
		}
	}

	_getWishListStoreData(type){
		let text;
		if(type == 'AddToWishListSuccess'){
			text = 'Remove from WishList';
		}else if(type == 'RemoveFromWishListSuccess'){
			text = "Add to WishList"; 
		}
		this.setState({buttonText: text});
	}

	_addToWishList(){
		let query = {movieid: this.state.movieId}
		if(this.state.buttonText == 'Add to WishList'){
			MyWishListAction._addToWishList(query);
		}else{
			MyWishListAction._removeFromWishList(query);
		}
	}

	render(){
		return(<Paper><Grid>
			<Cell col={6}>
				<img style={{ width: '60%', marginLeft: '10%'}} src={this.state.movieDetails.poster_url}/>
			</Cell>
			<Cell col={6} style={{marginTop: '10px'}}>	
				<p style={styles.leftMargin}>Movie: {this.state.movieDetails.title}</p>									      
			    <p style={styles.leftMargin}>Cast: {this.state.movieDetails.cast ? this.state.movieDetails.cast.join(', ') : []}</p>
			    <p style={styles.leftMargin}>Released: {this.state.movieDetails.release}</p>
			    <p style={styles.leftMargin}>Director: {this.state.movieDetails.director ? this.state.movieDetails.director.join(', '): []}</p>
			    <p style={styles.leftMargin}>Producer: {this.state.movieDetails.producer ? this.state.movieDetails.producer.join(', ') : []}</p>
			    <p style={styles.leftMargin}>Music Director: {this.state.movieDetails.music_director ? this.state.movieDetails.music_director.join(',') : []}</p>
			    <p style={styles.leftMargin}>Production House: {this.state.movieDetails.production_house ? this.state.movieDetails.production_house.join(', ') : []}</p>
			    <p style={styles.leftMargin}>Likes: {this.state.movieDetails.wishcount}</p>			   
			    <FlatButton style={styles.saveButtonStyle} label={this.state.buttonText} onClick={this._addToWishList.bind(this)}/>
						
			</Cell></Grid></Paper>
		);
	}
}

