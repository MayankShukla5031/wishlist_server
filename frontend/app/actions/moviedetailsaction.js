import dispatcher from "../dispatchers/dispatcher";
import MovieDetailsWebApiUtils from "../utils/moviedetailswebapiutils";

module.exports = {

	_getMovieDetails : function(inpulvalues){
		MovieDetailsWebApiUtils._getMovieDetails(inpulvalues);
	},

	_cancelMyShow : function(inpulvalues){
		MovieDetailsWebApiUtils._cancelMyShow(inpulvalues);
	}
	
}