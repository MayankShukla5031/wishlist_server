import {EventEmitter} from "events";
import dispatcher from "../dispatchers/dispatcher";

class MyWishListStore extends EventEmitter{
	constructor(){
		super();
		this.MyWishList = [];
	}

	_setMovieList(data){
		this.MyWishList = data;
		this.emit('change','MyWishList');
	}

	_getMyWishList(){
		return this.MyWishList;
	}
	

	_handleActions(action){
		switch(action.type){
			case 'MyWishList' : {
				this._setMovieList(action.data);
				break;
			}
			case 'ADD_TO_WISHLIST_SUCCESS' : {
				console.log('add done');
				this.emit('change', 'AddToWishListSuccess');
				break;
			}
			case 'REMOVE_FROM_WISHLIST_SUCCESS' : {
				console.log('remove done');
				this.emit('change', 'RemoveFromWishListSuccess');
				break;
			}
		}
	}
}

const mywishliststore = new MyWishListStore;
dispatcher.register(mywishliststore._handleActions.bind(mywishliststore));
export default mywishliststore;

