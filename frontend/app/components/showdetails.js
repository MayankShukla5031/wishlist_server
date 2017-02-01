import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Grid, Cell} from 'react-mdl';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import Api from '../constants/api';

import * as MovieDetailsAction from '../actions/moviedetailsaction';
// import * as MyWishListAction from '../actions/mywishlistaction';
import MovieDetailsStore from '../stores/moviedetailsstore';
// import MyWishListStore from '../stores/mywishliststore';

const styles = {
	saveButtonStyle:{
		backgroundColor: '#77ADFC',
		color: 'white',
		cursor: 'pointer',
	},
	leftMargin: {
		marginLeft: '10%',
	},
	SearchFieldFontStyling: {
        width: '20%',
        fontSize: '14px',
        padding : '0px',
        fontWeight: 'normal',
        marginLeft: '20px'
    },
    floatingLabelStyle:{
        fontSize: '14px',
        fontWeight: 'normal',
        padding: '0px'
    },
    cancelButtonStyle: {
        backgroundColor: '#ffffff',
        color: 'black'
    },
    checkbox:{
    	display: 'inline-block',
    	width: '30px',
    }
}


export default class TrendingMovies extends React.Component{
	constructor(){
		super();
		this.state = {
			movieDetails : [],
			showId: '',
			movieId: '',
			inMyWishList: false,
			buttonText: '',
			userType : Api._getKey('user_type') ? Api._getKey('user_type') : null,
			openTheatreDialogue : false,
			theatreDetails: {},
			userId: Api._getKey('user_id') ? Api._getKey('user_id') : null, 
			layoutDetails: {},
			bookedTicketLayout: {}
		};
		this._handleTheatreDialogCancel = this._handleTheatreDialogCancel.bind(this);
		this._handleTheatreDetailsDialogSubmit = this._handleTheatreDetailsDialogSubmit.bind(this);
 		this._getMovieDetailsfromStore = this._getMovieDetailsfromStore.bind(this);
		// this._getWishListStoreData = this._getWishListStoreData.bind(this);
	}

	componentWillMount(){
		let id = this.props.params.showId;
		MovieDetailsAction._getMovieDetails({id: id});
		MovieDetailsStore.on('change',this._getMovieDetailsfromStore); 
		// MyWishListStore.on('change', this._getWishListStoreData);
	}

	componentWillUnmount(){
		MovieDetailsStore.removeListener('change', this._getMovieDetailsfromStore);
		// MyWishListStore.removeListener('change', this._getWishListStoreData);
	}

	// componentWillReceiveProps(newKey){
	// 	console.log('no', newKey.params.showId);
	// 	MovieDetailsAction._getMovieDetails({id: newKey.params.showId});
	// }

	_getMovieDetailsfromStore(type){		
		if(type == 'MovieDetails'){
			let text = "";
			let details = MovieDetailsStore._getMovieDetails();
			if(this.state.userType == "theatre"){
				text = details.theatre.userid.uid == this.state.userId ? "Cancel Show" : "";
			}else{
				text = details.in_my_show ? "Cancel Ticket" : "Book Ticket"
			}
			// let text = this.state.userType == "theatre" ? "" : details.in_my_show ? "Cancel" : "Book Ticket"; 
			this.setState({
				showId: this.props.params.showId,
				movieId: details.movie.movieid.uid,
				movieDetails: details,
				inMyShows: details.in_my_show,
				buttonText: text,
				layoutDetails: details.seat_selection,
				bookedTicketLayout: JSON.parse(JSON.stringify(details.seat_selection)),
			});
		}else if(type == 'SCREEN_LAYOUT_DETAILS'){
			let layoutDetails = moviedetailsstore._getScreenLayout();
			this.setState({
				layoutDetails: layoutDetails
			});
		}else if(type == 'TICKET_BOOKED'){
			let id = this.props.params.showId;
			MovieDetailsAction._getMovieDetails({id: id});
			this.setState({
				openTheatreDialogue : false,
			});
		}
	}

	_handleCommonAction(){
		if(this.state.userType == 'theatre'){
			MovieDetailsAction._cancelMyShow({show_id:this.state.showId});
		}else{
			//MovieDetailsAction._getLayout({id: this.state.showId || ''});
			this.setState({
				openTheatreDialogue: true,
			});
			// let query = {id: this.state.showId}
			// if(this.state.buttonText == 'Add to WishList'){
			// 	MyWishListAction._addToWishList(query);
			// }else{
			// 	MyWishListAction._removeFromWishList(query);
			// }
		}
	}

	_handleTheatreDialogCancel(){
		this.setState({
			openTheatreDialogue: false,
		});
	}

	_handleTheatreDetailsDialogSubmit(){
		let bookedTicketLayout = this.state.bookedTicketLayout;
		let query = [];
		bookedTicketLayout.forEach((item, i)=>{
			item.forEach((el, j)=>{
				if(el == 2){
					let a = {row: i, column: j};
					query.push(a);
				}
			});
		});
		MovieDetailsAction._bookTicket({selected_seats: JSON.stringify(query), show_id: this.state.showId});
	}

	_setTheatreDetailsUI(){
		let row = this.state.layoutDetails.length ? this.state.layoutDetails.length : 0;
		let column = this.state.layoutDetails.length ? this.state.layoutDetails[0].length : 0;
		let uiItems = [];
		for(let i = 0; i < row; i++){
			uiItems.push(<p key={'row-' + i} style={{marginRight: '10px', display: 'inline-block',}}>{String.fromCharCode('A'.charCodeAt()+i)}</p>);
			for(let j = 0; j < column; j++){
				uiItems.push(
					<Checkbox
						key={'column-' + i + " - " + j}
						defaultChecked={this.state.layoutDetails[i][j] == "1"? true : false}
						disabled={this.state.layoutDetails[i][j] == '1' || this.state.layoutDetails[i][j] == '-1' ? true : false}
						// key={i + "-" + String.fromCharCode('a'.charCodeAt()+j)}
						// label={i + "-" + String.fromCharCode('a'.charCodeAt()+j)}
				    	style={styles.checkbox}
				    	onCheck={this._handleSeatClick.bind(this,i,j)}
				    />						
				);
			}
			uiItems.push(<br/>);
		}
		return uiItems;
	}

	_handleSeatClick(row, column, event, isInputChecked){
		let bookedTicketLayout = this.state.bookedTicketLayout;
		bookedTicketLayout[row][column] = isInputChecked ? 2 : 0;
		this.setState({bookedTicketLayout});
	}

	render(){
		
		const TheatreAction = [
			<FlatButton style={styles.cancelButtonStyle} hoverColor="#237BFB" label="Cancel" primary={true} onTouchTap={this._handleTheatreDialogCancel}/>,
            <FlatButton style={styles.saveButtonStyle}  label="Book Ticket" primary={true} onTouchTap={this._handleTheatreDetailsDialogSubmit} />,
		];

		return(
			<Paper>
				<Dialog
                    title="Select Seat"
                    actions={TheatreAction}
                    modal={false}
                    open={this.state.openTheatreDialogue}
                    autoScrollBodyContent = {true}
                    onRequestClose={this._handleTheatreDialogCancel}
                    >
                	<div style={{whiteSpace: 'nowrap'}}>{this._setTheatreDetailsUI()}</div>      
                </Dialog>            
				<Grid>					
					<Cell col={6}>
						<img style={{ width: '60%', marginLeft: '10%'}} src={this.state.movieDetails.movie ? this.state.movieDetails.movie.movieid.poster_url : ''}/>
					</Cell>
					<Cell col={6} style={{marginTop: '10px'}}>	
						<p style={styles.leftMargin}>Movie: {this.state.movieDetails.movie ? this.state.movieDetails.movie.movieid.title : ''}</p>									      
					    <p style={styles.leftMargin}>Min Seats: {this.state.movieDetails.min_seats}</p>	
					    <p style={styles.leftMargin}>Total Seats: {this.state.movieDetails.no_of_seats}</p>	
					    <p style={styles.leftMargin}>Ticket Price: {this.state.movieDetails.ticket_price}</p>	
					    <p style={styles.leftMargin}>Show Time: {this.state.movieDetails.show_time ? new Date(this.state.movieDetails.show_time).toDateString() : ""}</p>					   
					    <p style={styles.leftMargin}>Theatre: {this.state.movieDetails.theatre ? this.state.movieDetails.theatre.userid.username : ''}</p>
					    {this.state.buttonText != "" ? <FlatButton style={Object.assign(styles.saveButtonStyle, {marginLeft: '10%'})} label={this.state.buttonText} onClick={this._handleCommonAction.bind(this)}/> : "" }
					</Cell>
				</Grid>
			</Paper>
		);
	}
}

