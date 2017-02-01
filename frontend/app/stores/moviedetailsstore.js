import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class MovieDetailsStore extends EventEmitter{
	constructor(){
		super();
		this.moviesDetails = [];
		this.ScreenDetails = {};
		this.ScreenLayout = {};
	}

	_setMovieDetails(data){
		this.moviesDetails = data;
		this.emit('change','MovieDetails');
	}

	_getMovieDetails(){
		return this.moviesDetails;
	}

	_setScreenDetail(data){
		this.ScreenDetails = data;
		this.emit('change', 'SCREEN_DETAILS');
	}
	
	_getScreenDetail(){
		return this.ScreenDetails;
	}

	_setScreenLayout(data){
		this.ScreenLayout = data;
		this.emit('change', 'SCREEN_LAYOUT_DETAILS');
	}

	_getScreenLayout(){
		return this.ScreenLayout;
	}

	_handleActions(action){
		switch(action.type){
			case 'MOVIE_DETAILS' : {
				this._setMovieDetails(action.data);
				break;
			}
			case 'ADD_SCREEN_SUCCESS' : {
				this.emit('change', 'ADD_SCREEN_SUCCESS');
				break;
			}
			case 'SCREEN_DETAILS' : {
				this._setScreenDetail(action.data);
				break;
			}
			case 'SCREEN_LAYOUT_DETAILS' : {
				this._setScreenLayout(action.data);
				break;
			}
			case 'TICKET_BOOKED' : {
				this.emit('change', 'TICKET_BOOKED');
				break;
			}
		}
	}
}

const moviedetailsstore = new MovieDetailsStore;
dispatcher.register(moviedetailsstore._handleActions.bind(moviedetailsstore));
export default moviedetailsstore;

