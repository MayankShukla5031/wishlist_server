import React from 'react';
import {Link, hashhistory} from 'react-router';
//import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import * as MyWishListAction from '../actions/mywishlistaction';
import MyWishListStore from '../stores/mywishliststore';

export default class MyWishList extends React.Component{
	constructor(){
		super();
		this.state = {
			myWishList : [],
		};
		this._getMovieList = this._getMovieList.bind(this);
	}

	componentWillMount(){
		MyWishListAction._getMyWishList("");
		MyWishListStore.on('change',this._getMovieList); 
	}

	componentWillUnmount(){
		MyWishListStore.removeListener('change', this._getMovieList);
	}

	_getMovieList(type){		
		if(type == 'MyWishList'){
			let myWishList = MyWishListStore._getMyWishList();
			//console.log('myWishList', myWishList);
			// let data = [{title: 'A', id: 1, count: 1}, {title: 'B', id: 2, count: 2}, {title: 'C', id: 3, count: 3}];
			this.setState({myWishList: myWishList});
			// this.setState({myWishList: data});
		}
	}

	_setWishListUI(){		
		let uiItem = [];
		let movieName = '';
		let wishCount = 0;
		let imageUrl;
		let uid;
		uiItem = this.state.myWishList.map((item, index)=> {
			movieName = item.title || "Movie Name";
			wishCount = item.count || 0;
			imageUrl = item.poster_url || "http://www.getmdl.io/assets/demos/dog.png";
			uid = item.uid || item;			
			return(
				<Card key={index} shadow={0} style={{width: '220px', height: '300px', display:'inline-flex', marginLeft: '10px', marginTop: '10px'}}>
				    <CardTitle expand style={{color: '#fff',  background: `url(${imageUrl})  no-repeat #46B6AC `}}/>
				    <CardText>
				    	{movieName}<br/>
				        Wish Count: {wishCount}
				    </CardText>
				    <CardActions border>
				        <Button colored><Link to={`moviedetails/${uid}`}>View Details</Link></Button>
		     		</CardActions>
				</Card>);
		});
		return uiItem;
	}

	render(){
		return(<div>
				{this._setWishListUI()}
			</div>
		);
	}
}

/*

<Card key={index} shadow={0} style={{width: '220px', height: '300px', display:'inline-flex', marginLeft: '10px', marginTop: '10px'}}>
				    <CardTitle expand style={{color: '#fff', height: 'inherit', width: 'inherit' , background: `url(${imageUrl}) bottom right 15% no-repeat #46B6AC `}}>{movieName}</CardTitle>
				    <CardText>
				        Wish Count: {wishCount}
				    </CardText>
				    <CardActions border>
				        <Button colored><Link to={`moviedetails/${uid}`}>View Details</Link></Button>
		     		</CardActions>
				</Card>);*/