import dispatcher from "../dispatchers/dispatcher";
import UpcomingShowsWebApiUtils from "../utils/upcomingshowsWebApiUtils";

module.exports = {

	_getUpcomingShowsList : function(inputValue){
		UpcomingShowsWebApiUtils._getUpcomingShowsList(inputValue);
	}
	
}