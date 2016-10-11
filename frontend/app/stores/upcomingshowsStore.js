import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class UpcomingShowsStore extends EventEmitter{
	constructor(){
		super();
		this.UpcomingShowsList = {};
	}	

	_setUpcomingShowsList(data){
		this.UpcomingShowsList = data;
		this.emit('change', 'Upcoming_Shows');
	}

	_getUpcomingShowsList(){
		return this.UpcomingShowsList;
	}

	_handleActions(action){
		switch(action.type){
			case 'UPCOMING_SHOWS' : {
				this._setUpcomingShowsList(action.data);				
				break;
			}			
		}
	}
}

const upcomingshowsstore = new UpcomingShowsStore;
dispatcher.register(upcomingshowsstore._handleActions.bind(upcomingshowsstore));
export default upcomingshowsstore;

