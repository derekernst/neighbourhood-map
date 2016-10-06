var map;

var locationData = [
	{
		 title: 'Wilbur Mexicana',
		 location: {lat: 43.64487749999999, lng: -79.39879810000002},
		 id: 0
	},
	{
		 title: 'La Carnita',
		 location: {lat: 43.6558309, lng: -79.40977379999998},
		 id: 1
	},
	{
		 title: 'EL Catrin',
		 location: {lat: 43.6505764, lng: -79.3589594},
		 id: 2
	},
	{
		 title: 'Grand Electric',
		 location: {lat: 43.6417692, lng: -79.43159980000001},
		 id: 3
	},
	{
		 title: 'EL Trompo Taco Bar',
		 location: {lat: 43.652271, lng: -79.40111300000001},
		 id: 4
	},
	{
		 title: 'Seven Lives',
		 location: {lat: 43.6544085, lng: -79.4004334},
		 id: 5
	},
	{
		 title: 'Los Colibris',
		 location: {lat: 43.6472859, lng: -79.38701149999997},
		 id: 6
	},
	{
		 title: 'Playa Cabana',
		 location: {lat: 43.6760424, lng: -79.40123510000001},
		 id: 7
	},
	{
		 title: 'Como En Casa',
		 location: {lat: 43.665329, lng: -79.38454200000001},
		 id: 8
	},
	{
		 title: 'Tortería San Cosme',
		 location: {lat: 43.6547574, lng: -79.40058820000002},
		 id: 9
	},
]

var ListMarker = function (data) { 
	this.title = ko.observable(data.title);
	this.position = data.location;
	this.visible = ko.observable(true);
	this.id = data.id;
	this.active = ko.observable(false);
	this.style = ko.computed(function() { 
		if (this.active() === true) { 
			return 'active-marker';
		} else { 
			return 'filter-item';
		}
	},this)
};

var ViewModel = function() {
	var self = this;
	
	// store the map markersList
	this.markers = [];
	this.markersList = ko.observableArray([]);
	this.bounds = new google.maps.LatLngBounds();
	this.infoWindow = new google.maps.InfoWindow();
	
	// push each location to the markersList array
	locationData.forEach(function(location) {
		self.markersList().push(new ListMarker(location));
		//add markers to map
		var marker = new google.maps.Marker({
            map: map,
            position: location.location,
            title: location.title,
            animation: google.maps.Animation.DROP,
            id: location.id
          });
		// hold each marker that was created in markers[]
		self.markers.push(marker);
		// change the boundaries of the map
		self.bounds.extend(marker.position);
		// click event on marker to bring up info windwo
		marker.addListener('click', function() {
			// var infoWindow = new google.maps.InfoWindow();
			toggleBounce(this);
            populateInfoWindow(this, self.infoWindow);
            activeListMarker(this);
         });
	});
	//fit map to the new boundaries of the markers
	map.fitBounds(self.bounds);


	//animate map marker when clicked on
	var toggleBounce = function(marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		window.setTimeout(function() {
			marker.setAnimation(null);
		}, 1450);
	};

	// open info window with yelp api data for clicked marker 
	var populateInfoWindow = function(marker, infowindow) {
		infowindow.marker = marker;
		var windowContent = '';
        // used https://github.com/bettiolo/oauth-signature-js for OAuth 
		var yelpURL = 'https://api.yelp.com/v2/search/';
		var key = 'u7heClePSCkpwI0d4iU6jw';
		var secret = 'fdb_OXwSA_yKk2B6SX_-OHuMuyg';
		var token = 'LWNzFew973kcJqQe9if8T_tZ7sPoeEvu';
		var secretToken = 'Hp7f-KHgZFzk_i2ESHXjdnGUFaA';
		// lat/long for marker
		var mLat = marker.position.lat();
		var mLng = marker.position.lng();
		// OAuth and search parameters
		var parameters = {
			oauth_consumer_key: key,
			oauth_token: token,
			oauth_nonce: Math.floor(Math.random() * 1e12).toString(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version : '1.0',
			limit: 1,
			term: marker.title,
			location: 'Toronto, ON',
			//ll: mLat + ',' + mLng,
			callback: 'cb'
		};

		var encodedSignature = oauthSignature.generate('GET',yelpURL, parameters, secret, secretToken);
		parameters.oauth_signature = encodedSignature;

		// Settings for AJAX reqeust
		var settings = {
			url: yelpURL,
			data: parameters,
			cache: true,
			dataType: 'jsonp',
		}

		// fire AJAX request 
		$.ajax(settings).done(function(data) {
			var name = data.businesses[0].name;
			var ratingImg = data.businesses[0].rating_img_url;
			var reviews = data.businesses[0].review_count;
			var image = data.businesses[0].image_url;
			var text = data.businesses[0].snippet_text;
			var URL = data.businesses[0].url;

			var infoTitle = '<h2 id="info-title" >' + name + '</h2>';
			var infoImgText = '<div id="info-img-text" ><img src="' + image + '"><div id="info-text"><h4 id="text-title">What people are saying: </h4><p>' + text + '</p><a href="' + URL + '">See more...</a></div></div>';
			var infoRating = '<div id="info-rating-con"><img id="rating-img" src="' + ratingImg + '"><p id="reviews">(' + reviews + ')</p><div id="logo-con"><img id="logo" src="images/yelp.png"></div></div>';

			windowContent = infoTitle + infoImgText + infoRating;

			infowindow.setContent(windowContent);
			infowindow.open(map, marker);
		}).fail (function(e) { 
				windowContent = "Failed to load Yelp details!";
				infowindow.setContent(windowContent);
				infowindow.open(map,marker);
			});
	}

    var activeListMarker = function (marker) { 
    	self.markersList().forEach(function(location) { 
			// update list marker based on clicked map marker
			if (location.id == marker.id) { 
				location.active(true);
			} else { 
				location.active(false);
			}
		});
    };

	// filter markers
	this.filter = ko.observable('');
	this.filterMarkers = function () {
		var filter = this.filter().toUpperCase();
			// filter the markers list
		this.markersList().forEach(function(location) {
			if (location.title().toUpperCase().indexOf(filter) === -1){
				location.visible(false);
			} else {
				location.visible(true);
			}
		});
		// filter the map markers
		this.markers.forEach(function(marker) {
			// check if marker is set in the map
			var markerVisible = marker.map;
			if (marker.title.toUpperCase().indexOf(filter) === -1) {
				if (markerVisible !== null) {
					marker.setMap(null);
				}
			} else { 
				if (markerVisible == null) {
					marker.setMap(map);
				}
			}
		});
	};

	//highlight clicked list and map marker
	this.setMarker = function(clickedMarker) { 
		// markersList()
		self.markersList().forEach(function(location) { 
			if (location.id == clickedMarker.id) { 
				location.active(true);
			} else { 
				location.active(false);
			}
		});
		// markers -- for the map
		self.markers.forEach (function (marker) { 
			if (marker.id == clickedMarker.id) { 
				toggleBounce(marker);
				populateInfoWindow(marker, self.infoWindow);
			} 
		});
	}

	$('#arrow').on('click', function() {
		var arrow = $('#arrow');
		var sidebar = $('#filter-container');
		if (sidebar.hasClass('out')){
			sidebar.fadeOut(500);
			sidebar.removeClass('out');
			arrow.addClass('arrowIn');
		} else {
			sidebar.fadeIn(500);
			sidebar.addClass('out');
			arrow.removeClass('arrowIn');
		}
	})

}

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 43.653226,
            lng: -79.38318429999998
        }
    });
    // start the view model --> put it here to have google defined 
    ko.applyBindings(new ViewModel());
};

var mapsError = function() {
  window.alert("ERROR!");
};