import dispatcher from "../dispatchers/dispatcher";
import SearchWebApiUtils from "../utils/searchwebapiutils";

module.exports = {

	_searchMovie : function(inputValue){
		//console.log('action', inputValue);
		SearchWebApiUtils._searchMovie(inputValue);
	},

}