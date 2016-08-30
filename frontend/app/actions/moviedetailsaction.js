import dispatcher from "../dispatchers/dispatcher";
import MovieDetailsWebApiUtils from "../utils/moviedetailswebapiutils";

module.exports = {

	_getMovieDetails : function(inpulvalues){
		MovieDetailsWebApiUtils._getMovieDetails(inpulvalues);
	},

	// _addToWishList : function(inpulvalues){
	// 	MovieDetailsWebApiUtils._addToWishList(inpulvalues);
	// },

	// _removeFromWishList: function(inpulvalues){
	// 	MovieDetailsWebApiUtils._removeFromWishList(inpulvalues);
	// }

}