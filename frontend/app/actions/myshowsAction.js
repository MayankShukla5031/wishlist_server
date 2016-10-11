import dispatcher from "../dispatchers/dispatcher";
import MyShowsWebApiUtils from "../utils/myshowsWebApiUtils";


module.exports = {
	_getMyShowsList : function(inputValues){
		MyShowsWebApiUtils._getMyShowsList(inputValues);
	}
}