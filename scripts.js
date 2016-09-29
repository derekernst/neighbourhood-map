var locationData = [
	{
		 title: 'Park Ave Penthouse',
		 location: {lat: 40.7713024, lng: -73.9632393}
	},
	{
		 title: 'My House',
		 location: {lat: 40.7713024, lng: -73.9632393}
	},
	{
		 title: 'Your Place',
		 location: {lat: 40.7713024, lng: -73.9632393}
	}
]

var map;
var infowindow;

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 43.653226,
            lng: -79.38318429999998
        }
    });

};

var Marker = function (data) {
	this.title = ko.observable(data.title);
	this.position = data.location;
	this.marker = null;
	this.visible = ko.observable(true);
}

var ViewModel = function() {
	var self = this;

	this.markers = ko.observableArray([]);

	locationData.forEach(function(location) {
		self.markers().push(new Marker(location));
	});

	// filter input
	this.filter = ko.observable('');

	// filter markers
	this.filterMarkers = function () {
		var filter = this.filter().toUpperCase();
		this.markers().forEach(function(marker) {
			if (marker.title().toUpperCase().indexOf(filter) === -1){
				marker.visible(false);
			} else {
				marker.visible(true);
			}
		});
	};

}

var mapsError = function() {
  window.alert("ERROR!");
}

ko.applyBindings(new ViewModel());

