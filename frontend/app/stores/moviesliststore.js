import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class MovieListStore extends EventEmitter{
	constructor(){
		super();
		this.moviesList = [];
	}

	_setMovieList(data){
		this.moviesList = data;
		this.emit('change','MOVIES');
	}

	_getMovieList(){
		return this.moviesList;
	}
	

	_handleActions(action){
		switch(action.type){
			case 'MOVIES' : {
				this._setMovieList(action.data);
				break;
			}
		}
	}
}

const movieliststore = new MovieListStore;
dispatcher.register(movieliststore._handleActions.bind(movieliststore));
export default movieliststore;

