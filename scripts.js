var map;

var locationData = [
	{
		 title: 'Rogers Centre',
		 location: {lat: 43.6414378, lng: -79.38935320000002}
	},
	{
		 title: 'Casa Loma',
		 location: {lat: 43.67803709999999, lng: -79.40944389999999}
	},
	{
		 title: 'Trinity Bellwoods Park',
		 location: {lat: 43.6500371, lng: -79.41693559999999}
	}
]

var ListMarker = function (data) {
	this.title = ko.observable(data.title);
	this.position = data.location;
	this.visible = ko.observable(true);
};

var ViewModel = function() {
	var self = this;
	// store the map markers
	this.markers = [];
	this.markersList = ko.observableArray([]);
	this.bounds = new google.maps.LatLngBounds();
	
	// push each location to the markersList array
	locationData.forEach(function(location) {
		self.markersList().push(new ListMarker(location));
		//add markers to map
		var marker = new google.maps.Marker({
            map: map,
            position: location.location,
            title: location.title,
            animation: google.maps.Animation.DROP
          });
		// hold each marker that was created in markers[]
		self.markers.push(marker);
		// change the boundaries of the map
		self.bounds.extend(marker.position);
		// click event on marker to bring up info windwo
		marker.addListener('click', function() {
			var infoWindow = new google.maps.InfoWindow();
            self.populateInfoWindow(this, infoWindow);
         });
	});
	//fit map to the new boundaries of the markers
	map.fitBounds(self.bounds);

	// open info window for clicked marker
	this.populateInfoWindow = function(marker, infowindow) {
		// when we get to the API stuff, use marker 
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<h3>' + marker.title + '</h3><p>this is an info window</p>');
            infowindow.open(map, marker);
            // event for closing the info window --> was getting an error when using
            // infowindow.addListener('closeclick', function() {
            //   	infowindow.setMarker(null);
            // });
        }
    };

	// add markers to map
	// this.markers = [];
	// locationData.forEach(function(location) { 
	// 	var marker = new google.maps.Marker({
 //            map: map,
 //            position: location.location,
 //            title: location.title,
 //            animation: google.maps.Animation.DROP
 //          });
	// 	self.markers.push(marker);
	// });

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

}

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
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
}




