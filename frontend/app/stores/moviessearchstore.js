import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class MovieListStore extends EventEmitter{
	constructor(){
		super();
		this.searchResults = [];
	}

	_setMovieList(data){
		this.searchResults = data;
		this.emit('change','MovieSearchResults');
	}

	_getMovieList(){
		return this.searchResults;
	}
	

	_handleActions(action){
		switch(action.type){
			case 'MOVIE_SEARCH_RESULTS' : {
				this._setMovieList(action.data);
				break;
			}
		}
	}
}

const movieliststore = new MovieListStore;
dispatcher.register(movieliststore._handleActions.bind(movieliststore));
export default movieliststore;

