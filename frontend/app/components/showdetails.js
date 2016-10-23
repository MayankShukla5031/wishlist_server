import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Grid, Cell} from 'react-mdl';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Api from '../constants/api';

import * as MovieDetailsAction from '../actions/moviedetailsaction';
import * as MyWishListAction from '../actions/mywishlistaction';
import MovieDetailsStore from '../stores/moviedetailsstore';
import MyWishListStore from '../stores/mywishliststore';

const styles = {
	saveButtonStyle:{
		backgroundColor: '#77ADFC',
		color: 'white',
		marginLeft: '20px',
		cursor: 'pointer',
		marginLeft: '10%',
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
		};
		this._handleTheatreDialogCancel = this._handleTheatreDialogCancel.bind(this);
		this._handleTheatreDetailsDialogSubmit = this._handleTheatreDetailsDialogSubmit.bind(this);
 		this._getMovieDetailsfromStore = this._getMovieDetailsfromStore.bind(this);
		this._getWishListStoreData = this._getWishListStoreData.bind(this);
	}

	componentWillMount(){
		let id = this.props.params.showId;
		MovieDetailsAction._getMovieDetails({id: id});
		MovieDetailsStore.on('change',this._getMovieDetailsfromStore); 
		MyWishListStore.on('change', this._getWishListStoreData);
	}

	componentWillUnmount(){
		MovieDetailsStore.removeListener('change', this._getMovieDetailsfromStore);
		MyWishListStore.removeListener('change', this._getWishListStoreData);
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
				buttonText: text
			});
		}
	}

	_getWishListStoreData(type){
		let text;
		let closeDialoge = this.state.openTheatreDialogue;
		if(type == 'AddToWishListSuccess'){
			text = 'Remove from WishList';
		}else if(type == 'RemoveFromWishListSuccess'){
			text = "Add to WishList"; 
		}else if(type == 'Movie_Added_in_MyShows'){
			text = "Cancle the Show";
			closeDialoge = false;
		}
		this.setState({
			buttonText: text,
			openTheatreDialogue: closeDialoge,
		});
	}

	_handleCommonAction(){
		if(this.state.userType == 'theatre'){
			MovieDetailsAction._cancelMyShow({show_id:this.state.showId});
		}else{
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
		let data = Object.assign(this.state.theatreDetails);
		data['movie_id'] = this.state.movieId;
		MyWishListAction._addToMyShows(data);
	}

	_handleCommonDetailChange(type, event, value){
		let theatreDetails = this.state.theatreDetails;
        theatreDetails[type] = value;
        this.setState({
            theatreDetails: theatreDetails,
        });
    }

	_setTheatreDetailsUI(){
		return(
                <Grid>
                   <Cell col={12}>
                        <TextField
                            hintText="e.g- mm-dd-yyyy"
                            floatingLabelText="Show Time"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            fullWidth={true}
                            value={this.state.theatreDetails.show_time || ''}
                            onChange={this._handleCommonDetailChange.bind(this, 'show_time')}                                  
                        />
                    </Cell>
                    <Cell col={12}>
                        <TextField
                            hintText="e.g- 100"
                            floatingLabelText="Ticket Price"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            fullWidth={true}
                            value={this.state.theatreDetails.ticket_price || ''}
                            onChange={this._handleCommonDetailChange.bind(this, 'ticket_price')}                                  
                        />
                    </Cell>
                     <Cell col={12}>
                         <TextField
                            hintText="e.g- 50"
                            floatingLabelText="Min Seats"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            fullWidth={true}
                            value={this.state.theatreDetails.min_seats || ''}
                            onChange={this._handleCommonDetailChange.bind(this, 'min_seats')}                                  
                        />
                    </Cell>
                    <Cell col={12}>
                         <TextField
                            hintText="e.g- 50"
                            floatingLabelText="Total Seats"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            fullWidth={true}
                            value={this.state.theatreDetails.no_of_seats || ''}
                            onChange={this._handleCommonDetailChange.bind(this, 'no_of_seats')}                                  
                        />
                    </Cell>
                </Grid>
            );
	}

	render(){
		
		const TheatreAction = [
			<FlatButton style={styles.cancelButtonStyle} hoverColor="#237BFB" label="Cancel" primary={true} onTouchTap={this._handleTheatreDialogCancel}/>,
            <FlatButton style={styles.saveButtonStyle}  label="Add to MyShows" primary={true} onTouchTap={this._handleTheatreDetailsDialogSubmit} />,
		];

		return(
			<Paper>
				<Dialog
                    title="Details"
                    actions={TheatreAction}
                    modal={false}
                    open={this.state.openTheatreDialogue}
                    autoScrollBodyContent = {true}
                    onRequestClose={this._handleTheatreDialogCancel}
                    >
                	{this._setTheatreDetailsUI()}       
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
					    <p style={styles.leftMargin}>Show Time: {new Date(this.state.movieDetails.show_time).toDateString() || ""}</p>					   
					    <p style={styles.leftMargin}>Theatre: {this.state.movieDetails.theatre ? this.state.movieDetails.theatre.userid.username : ''}</p>
					    {this.state.buttonText != "" ? <FlatButton style={styles.saveButtonStyle} label={this.state.buttonText} onClick={this._handleCommonAction.bind(this)}/> : "" }
					</Cell>
				</Grid>
			</Paper>
		);
	}
}

