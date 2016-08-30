import dispatcher from "../dispatchers/dispatcher";
import MyWishListWebApiUtils from "../utils/mywishlistwebapiutils";

module.exports = {

	_getMyWishList : function(){
		MyWishListWebApiUtils._getMyWishList("");
	},

	_addToWishList : function(inpulvalues){
		MyWishListWebApiUtils._addToWishList(inpulvalues);
	},

	_removeFromWishList: function(inpulvalues){
		MyWishListWebApiUtils._removeFromWishList(inpulvalues);
	}
}