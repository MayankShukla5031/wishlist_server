import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class MovieDetailsStore extends EventEmitter{
	constructor(){
		super();
		this.moviesDetails = [];
	}

	_setMovieDetails(data){
		//console.log(data);
		this.moviesDetails = data;
		this.emit('change','MovieDetails');
	}

	_getMovieDetails(){
		return this.moviesDetails;
	}
	

	_handleActions(action){
		switch(action.type){
			case 'MOVIE_DETAILS' : {
				this._setMovieDetails(action.data);
				break;
			}
		}
	}
}

const moviedetailsstore = new MovieDetailsStore;
dispatcher.register(moviedetailsstore._handleActions.bind(moviedetailsstore));
export default moviedetailsstore;

