import React from 'react';
import {Link, hashhistory} from 'react-router';

import {Grid, Cell, Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import * as UpcomingShowsAction from '../actions/upcomingshowsAction';
import UpcomingShowsStore from '../stores/upcomingshowsStore';


export default class UpcomingShows extends React.Component{

	constructor(){
		super();
		this.state = {
			UpcomingShowsList : [],
		};
		this._upcomingShowsStoreChange = this._upcomingShowsStoreChange.bind(this);
	}


	componentWillMount(){
		UpcomingShowsAction._getUpcomingShowsList("");
		UpcomingShowsStore.on('change', this._upcomingShowsStoreChange);
	}

	componentWillUnmount(){
		UpcomingShowsStore.removeListener('change', this._upcomingShowsStoreChange);	
	}

	_upcomingShowsStoreChange(type){
		if(type=="Upcoming_Shows"){
			let upcomingShows = UpcomingShowsStore._getUpcomingShowsList();
			console.log('UpcomingShowsList', upcomingShows);
			this.setState({
				UpcomingShowsList : upcomingShows || [],
			});
		}
	}

	_setMyShowsUI(){		
		let uiItem = [];
		let movieName = '';
		let imageUrl;
		let uid, theatre;
		uiItem = this.state.UpcomingShowsList.map((item, index)=> {
			movieName = item.title || "Movie Name";
			imageUrl = item.poster_url || "http://www.getmdl.io/assets/demos/dog.png";
			uid = item.uid || item;
			theatre = item.theatre || "";
			
			return(
				<Card key={index} shadow={0} style={{width: '220px', height: '300px', display:'inline-flex', marginLeft: '10px', marginTop: '10px'}}>
				    <CardTitle expand style={{color: '#fff', background: `url(${imageUrl}) no-repeat #46B6AC `}}/>
				    <CardText  style = {{'fontSize': '12px'}}>
				    	{movieName}<br/>
				    	Theatre: {theatre}<br/>
				        Show Time: {new Date(item.show_time).toDateString() || ""}
				    </CardText>
				    <CardActions border>
				        <Button colored><Link to={`showdetails/${uid}`}>View Details</Link></Button>
		     		</CardActions>
				</Card>);
		});
		return uiItem;
	}


	render(){
		return(
			<div>
				{this._setMyShowsUI()}
			</div>
		);
	}
}