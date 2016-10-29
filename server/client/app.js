var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
    return $window._;
}]);

var movwishAdminApp = angular.module('movwish', ['ngRoute', 'underscore']);

//UI routes
movwishAdminApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })
        .when('/movies', {
            templateUrl : 'pages/movie.html',
            controller  : 'movieController'
        })
        .when('/artists', {
            templateUrl : 'pages/artist.html',
            controller  : 'artistController'
        })
        .when('/productionHouses', {
            templateUrl : 'pages/productionHouse.html',
            controller  : 'productionHouseController'
        })
});

movwishAdminApp.controller('mainController', function($scope) {
    $scope.message = 'Everyone come and see how good I look!';
});

movwishAdminApp.controller('movieController', function($scope, $http, _) {
    var artists = [], productionHouses=[];
    $scope.movie = {};
    $http.get('/api/artists?select=["name","tags"]').then(function (result) {
        artists = result.data;
        $scope.actors = [], $scope.directors = [], $scope.musicDirectors = [], $scope.producers = [];
        for(var i=0; i< artists.length; i++){
            var artist = artists[i];
            if(artist.tags.indexOf('actor') > -1) $scope.actors.push(artist);
            if(artist.tags.indexOf('director') > -1) $scope.directors.push(artist);
            if(artist.tags.indexOf('musicDirector') > -1) $scope.musicDirectors.push(artist);
            if(artist.tags.indexOf('producer') > -1) $scope.producers.push(artist);
        };
    });
    $http.get('/api/productionHouses').then(function (result) {
        $scope.productionHouses = result.data;
    });
    $scope.addMovie = function () {
        var movie = _.clone($scope.movie);
        movie.cast = [], movie.director = [], movie.musicDirector = [], movie.producer = [], movie.productionHouse = [];
        _.forEach(['cast', 'director', 'musicDirector', 'producer' ], function (skill) {
            _.forEach($scope.movie[skill], function(id){
                var artist = _.clone(_.find(artists, {_id:id}));
                artist[skill+'Id'] = artist._id; delete artist.tags; delete artist._id;
                movie[skill].push(artist);
            });
        });
        _.forEach($scope.movie.productionHouse, function(id){
            var productionHouse = _.clone(_.find($scope.productionHouses, {_id:id}));
            movie.productionHouse.push({productionHouseId:productionHouse._id, name:productionHouse.name});
        });
        $http.post('/api/movies', movie).then(function () {
            $scope.movie = {};
            alert('Movie added');
        }, function (err) {
            alert('Error in adding movie.');
        });
    };
});

movwishAdminApp.controller('artistController', function($scope, $http) {
    $scope.genders = ['Male', 'Female'];
    $scope.skills = [{_id:'actor', name:'Actor'}, {_id:'director', name:'Director'}, {_id:'musicDirector', name:'Music Director'}, {_id:'producer', name:'Producer'}];
    $scope.artist = {name:'Naveen', dob: new Date(), gender:'Male', tags:['Actor']};
    $scope.addArtist = function () {
        $http.post('/api/artists', $scope.artist).then(function () {
            $scope.artist = {};
            alert('Artist added');
        }, function (err) {
            alert('Error in adding artist.');
        });
    }
});
movwishAdminApp.controller('productionHouseController', function($scope, $http) {
    $scope.tags = ['Comedy', 'Horror', 'Love'];
    $scope.productionHouse = {name:'Naveen Films'};
    $scope.addProductionHouse = function () {
        $http.post('/api/productionHouses', $scope.productionHouse).then(function () {
            $scope.artist = {};
            alert('ProductionHouse added');
        }, function (err) {
            alert('Error in adding ProductionHouse.');
        });
    }
});