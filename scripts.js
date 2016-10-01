var map;

var locationData = [
	{
		 title: 'Rogers Centre',
		 location: {lat: 43.6414378, lng: -79.38935320000002},
		 id: 0
	},
	{
		 title: 'Casa Loma',
		 location: {lat: 43.67803709999999, lng: -79.40944389999999},
		 id: 1
	},
	{
		 title: 'Trinity Bellwoods Park',
		 location: {lat: 43.6500371, lng: -79.41693559999999},
		 id: 2
	}
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

	// var currentMarker = {};

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
		}, 2150);
	};

	// open info window for clicked marker
	var populateInfoWindow = function(marker, infowindow) {
            infowindow.marker = marker;
            infowindow.setContent('<h3>' + marker.title + '</h3><p>this is an info window</p>');
            infowindow.open(map, marker);
    };

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
				// remove if the marker is on the map
				if (markerVisible !== null) {
					marker.setMap(null);
				}
			} else { 
				// add if the marker is not on the map
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
			//update list marker based on clicked item
			if (location.id == clickedMarker.id) { 
				location.active(true);
			} else { 
				location.active(false);
			}
		});
		// markers -- for the map
		self.markers.forEach (function (marker) { 
			//open map marker based on clicked item
			if (marker.id == clickedMarker.id) { 
				toggleBounce(marker);
				populateInfoWindow(marker, self.infoWindow);
			} 
		});
	}
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