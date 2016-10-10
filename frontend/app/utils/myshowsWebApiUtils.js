import {hashHistory} from 'react-router';
import Api from '../constants/api';
import Url from '../constants/urls';
import dispatcher from "../dispatchers/dispatcher";

module.exports = {

	_getMyShowsList: function(query){
		Api._callAPI(Url.GET_MY_SHOWS, 'GET',query,(type,data)=> {
            if(type == 'success'){  
                dispatcher.dispatch({
                    type:'MY_SHOWS_LIST',
                    data: data
                });
            }
            else{   
                dispatcher.dispatch({
                    type: 'SNACKBAR',
                    msg:  data.responseJSON.result || 'Something went wrong, Kindly try after some time'
                });
            }
	    });
	}	

}
