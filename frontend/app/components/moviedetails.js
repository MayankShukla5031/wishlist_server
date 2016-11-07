import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Grid, Cell} from 'react-mdl';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import Api from '../constants/api';
import LoginStore from '../stores/loginstore';

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
			movieId: '',
			inMyWishList: false,
			buttonText: 'Add',
			userType : Api._getKey('user_type') ? Api._getKey('user_type') : null,
			openTheatreDialogue : false,
			theatreDetails: {},
			ScreenValue: null,
			userInfo: LoginStore._getUserInfo() || {},
		};
		this._handleTheatreDialogCancel = this._handleTheatreDialogCancel.bind(this);
		this._handleTheatreDetailsDialogSubmit = this._handleTheatreDetailsDialogSubmit.bind(this);
 		this._getMovieDetailsfromStore = this._getMovieDetailsfromStore.bind(this);
		this._getWishListStoreData = this._getWishListStoreData.bind(this);
	}

	componentWillMount(){
		let id = this.props.params.movieId;
		MovieDetailsAction._getMovieDetails({id: id});
		MovieDetailsStore.on('change',this._getMovieDetailsfromStore); 
		MyWishListStore.on('change', this._getWishListStoreData);
		LoginStore.on('change',this._loginStoreChange); 
	}

	componentWillUnmount(){
		MovieDetailsStore.removeListener('change', this._getMovieDetailsfromStore);
		MyWishListStore.removeListener('change', this._getWishListStoreData);
		LoginStore.removeListener('change', this._loginStoreChange);
	}

	componentWillReceiveProps(newKey){
		MovieDetailsAction._getMovieDetails({id: newKey.params.movieId});
	}

	_loginStoreChange(type){
		if(type == 'User_Info'){
			let userInfo = LoginStore._getUserInfo();
			this.setState({
				userInfo: userInfo,
			});
		}
	}

	_getMovieDetailsfromStore(type){		
		if(type == 'MovieDetails'){
			let details = MovieDetailsStore._getMovieDetails();
			let text = this.state.userType == "theatre" ? "Create a Show" : details.inmywishlist ? "Remove from WishList" : "Add to WishList"; 
			this.setState({
				movieId: this.props.params.movieId,
				movieDetails: details,
				inMyWishList: details.inmywishlist,
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
			text = "Hidden";
			closeDialoge = false;
		}
		this.setState({
			buttonText: text,
			openTheatreDialogue: closeDialoge,
		});
	}

	_addToWishList(){
		if(this.state.userType == 'theatre'){
			this.setState({
				openTheatreDialogue: true,
				theatreDetails: {},
			});
		}else{
			let query = {movieid: this.state.movieId}
			if(this.state.buttonText == 'Add to WishList'){
				MyWishListAction._addToWishList(query);
			}else{
				MyWishListAction._removeFromWishList(query);
			}
		}
	}

	_handleTheatreDialogCancel(){
		this.setState({
			openTheatreDialogue: false,
		});
	}

	_handleTheatreDetailsDialogSubmit(){
		let data = Object.assign(this.state.theatreDetails);
		data['movie_id'] = this.props.params.movieId;
		data['screen_id'] = this.state.ScreenValue;
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
                    <Cell col={12}>
                    	<SelectField 
                    		fullWidth={true}
						    value={this.state.ScreenValue} 
						    floatingLabelText={"Select Screen"}
						    floatingLabelStyle={styles.floatingLabelStyle}
					        onChange={(event, index, value)=>{this.setState({ScreenValue: value});}}>	        	
				    		{this._setScreenName()}
				        </SelectField>
                   	</Cell>
                </Grid>
            );
	}

	_setScreenName(){
		let screensName = this.state.userInfo.screens || [];
		let uiItems = screensName.map((item, index)=>{
			return(<MenuItem key={index} value={item.uid} primaryText={item.uid} />)
		});
		return uiItems;
	}

	render(){
		
		const TheatreAction = [
			<FlatButton style={styles.cancelButtonStyle} hoverColor="#237BFB" label="Cancel" primary={true} onTouchTap={this._handleTheatreDialogCancel}/>,
            <FlatButton style={styles.saveButtonStyle}  label="Create a Show" primary={true} onTouchTap={this._handleTheatreDetailsDialogSubmit} />,
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
							<img style={{ width: '60%', marginLeft: '10%'}} src={this.state.movieDetails.poster_url}/>
						</Cell>
						<Cell col={6} style={{marginTop: '10px'}}>	
							<p style={styles.leftMargin}>Movie: {this.state.movieDetails.title}</p>									      
						    <p style={styles.leftMargin}>Cast: {this.state.movieDetails.cast ? this.state.movieDetails.cast.join(', ') : []}</p>
						    <p style={styles.leftMargin}>Released: {this.state.movieDetails.release}</p>
						    <p style={styles.leftMargin}>Director: {this.state.movieDetails.director ? this.state.movieDetails.director.join(', '): []}</p>
						    <p style={styles.leftMargin}>Producer: {this.state.movieDetails.producer ? this.state.movieDetails.producer.join(', ') : []}</p>
						    <p style={styles.leftMargin}>Music Director: {this.state.movieDetails.music_director ? this.state.movieDetails.music_director.join(',') : []}</p>
						    <p style={styles.leftMargin}>Production House: {this.state.movieDetails.production_house ? this.state.movieDetails.production_house.join(', ') : []}</p>
						    <p style={styles.leftMargin}>Likes: {this.state.movieDetails.wishcount}</p>			   
						    {this.state.buttonText != "Hidden" ? <FlatButton style={styles.saveButtonStyle} label={this.state.buttonText} onClick={this._addToWishList.bind(this)}/> : ""}
						</Cell>
					</Grid>				
			</Paper>
		);
	}
}

