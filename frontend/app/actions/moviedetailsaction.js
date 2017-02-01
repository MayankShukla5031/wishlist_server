import dispatcher from "../dispatchers/dispatcher";
import MovieDetailsWebApiUtils from "../utils/moviedetailswebapiutils";

module.exports = {

	_getMovieDetails : function(query){
		MovieDetailsWebApiUtils._getMovieDetails(query);
	},

	_cancelMyShow : function(query){
		MovieDetailsWebApiUtils._cancelMyShow(query);
	},

	_addScreen(query){
		MovieDetailsWebApiUtils._addScreen(query);
	},

	_removeScreen(query){
		MovieDetailsWebApiUtils._removeScreen(query);
	},
	
	_getScreenDetails(query){
		MovieDetailsWebApiUtils._getScreenDetails(query);
	},

	_getLayout(query){
		MovieDetailsWebApiUtils._getLayout(query);
	},

	_bookTicket(query){
		MovieDetailsWebApiUtils._bookTicket(query);	
	}
}