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
		MyWishListAction._getMyWishList();
		MyWishListStore.on('change',this._getMovieList); 
	}

	componentWillUnmount(){
		MyWishListStore.removeListener('change', this._getMovieList);
	}

	_getMovieList(type){		
		if(type == 'MyWishList'){
			let myWishList = MyWishListStore._getMyWishList();
			console.log('myWishList', myWishList);
			this.setState({myWishList: myWishList});
		}
	}

	setWishListUi(){		
		let uiItem = [];
		uiItem = this.state.myWishList.map((item, index)=> {
			return(
				<Card key={index} shadow={0} style={{width: '220px', height: '300px', display:'inline-flex', marginLeft: '10px', marginTop: '10px'}}>
				    <CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Movie Name</CardTitle>
				    <CardText>
				        Wish Count: {item}
				    </CardText>
				    <CardActions border>
				        <Button colored><Link to={`moviedetails/${item}`}>View Details</Link></Button>
		     		</CardActions>
				</Card>);
		});

	return uiItem;
		// return(
		// <Card shadow={0} style={{width: '320px', height: '320px'}}>
		//     <CardTitle expand style={{color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/dog.png) bottom right 15% no-repeat #46B6AC'}}>Update</CardTitle>
		//     <CardText>
		//         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		//         Aenan convallis.
		//     </CardText>
		//     <CardActions border>
		//         <Button colored>View Updates</Button>
		//     </CardActions>
		// </Card>);
	}

	render(){
		return(<div>
				{this.setWishListUi()}
			</div>
		);
	}
}

