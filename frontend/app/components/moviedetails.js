import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Grid, Cell} from 'react-mdl';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import * as MovieDetailsAction from '../actions/moviedetailsaction';
import * as MyWishListAction from '../actions/mywishlistaction';
import MovieDetailsStore from '../stores/moviedetailsstore';

const styles = {
	saveButtonStyle:{
		backgroundColor: '#77ADFC',
		color: 'white',
		marginLeft: '20px',
		cursor: 'pointer'
	},
	leftMargin: {
		marginLeft: '20px',
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
	}

	componentWillMount(){
		let id = this.props.params.movieId;
		MovieDetailsAction._getMovieDetails({movieid: id});
		MovieDetailsStore.on('change',this._getMovieDetailsfromStore); 
	}

	componentWillUnmount(){
		MovieDetailsStore.removeListener('change', this._getMovieDetailsfromStore);
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
		}else if(type == 'AddToWishListSuccess'){
			let text = "Add to WishList"; 
			this.setState({buttonText: text});
		}else if(type == 'RemoveFromWishListSuccess'){
			let data = 'Remove from WishList';
			this.setState({buttonText: text});
		}
	}

	_addToWishList(){
		let query = {movieid: this.state.movieId}
		if(!this.state.inMyWishList){
			MyWishListAction._addToWishList(query);
		}else{
			MyWishListAction._removeFromWishList(query);
		}
	}

	render(){
		return(<Paper><Grid>
			<Cell col={6}>
				<img style={{height: '100%', width: '100%'}} src={this.state.movieDetails.poster_url}/>
			</Cell>
			<Cell col={6} style={{marginTop: '10px'}}>	
				<p style={styles.leftMargin}>Movie: {this.state.movieDetails.title}</p>									      
			    <p style={styles.leftMargin}>Cast: {this.state.movieDetails.cast ? this.state.movieDetails.cast.join(', ') : []}</p>
			    <p style={styles.leftMargin}>Released: {this.state.movieDetails.release}</p>
			    <p style={styles.leftMargin}>Director: {this.state.movieDetails.director ? this.state.movieDetails.director.join(', '): []}</p>
			    <p style={styles.leftMargin}>Producer: {this.state.movieDetails.producer ? this.state.movieDetails.producer.join(', ') : []}</p>
			    <p style={styles.leftMargin}>Music Director: {this.state.movieDetails.music_director ? this.state.movieDetails.music_director.join(',') : []}</p>
			    <p style={styles.leftMargin}>Production House: {this.state.movieDetails.production_house ? this.state.movieDetails.production_house.join(', ') : []}</p>			   
			    <FlatButton style={styles.saveButtonStyle} label={this.state.buttonText} onClick={this._addToWishList.bind(this)}/>
						
			</Cell></Grid></Paper>
		);
	}
}

