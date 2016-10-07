import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class TrendingMoviesStore extends EventEmitter{
	constructor(){
		super();
		this.trendingMovies = [];
	}

	_setTrendingMovies(value){
		this.trendingMovies = value;
		this.emit('change', 'Trending_Movies');
	}

	_getTrendingMovies(){
		return this.trendingMovies;
	}


	_handleActions(action){
		switch(action.type){
			case 'TRENDING_MOVIES' : {
				this._setTrendingMovies(action.data);
				break;
			}
		}
	}
}

const trendingmoviesstore = new TrendingMoviesStore;
dispatcher.register(trendingmoviesstore._handleActions.bind(trendingmoviesstore));
export default trendingmoviesstore;

