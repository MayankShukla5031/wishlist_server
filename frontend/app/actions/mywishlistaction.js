import dispatcher from "../dispatchers/dispatcher";
import MyWishListWebApiUtils from "../utils/mywishlistwebapiutils";

module.exports = {

	_getMyWishList : function(inpulvalues){
		MyWishListWebApiUtils._getMyWishList(inpulvalues);
	},

	_addToWishList : function(inpulvalues){
		MyWishListWebApiUtils._addToWishList(inpulvalues);
	},

	_removeFromWishList: function(inpulvalues){
		MyWishListWebApiUtils._removeFromWishList(inpulvalues);
	},

	_addToMyShows : function(inpulvalues){
		MyWishListWebApiUtils._addToMyShows(inpulvalues);
	}
}