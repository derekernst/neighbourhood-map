var map;

var initLocations = [
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

var Markers = function (data) {
	this.title = ko.observable(data.title);
	//use observable to bind which locations are visible
	this.visible = ko.observable(true);
	//not observable since the location won't be changing?????
	this.position = data.location;
	//set marker for map
	this.marker = null;

}

var ViewModel = function() {
	var self = this;

    //set the initial locations to an observable array
	this.locationsList = ko.observableArray([]);

	//push all initLocations to locationsList
	initLocations.forEach(function(location) {
		self.locationsList.push(new Markers(location));
	});

	//set filter field for user input
	this.filter = ko.observable('');

	// apply filter when enter key is hit
	this.filterMarkers = function () {
		var filter = this.filter().toUpperCase();
		this.locationsList().forEach(function(location) {
			if (location.title().toUpperCase().indexOf(filter) === -1){
				location.visible(false);
			} else {
				location.visible(true);
			}
		});
	};

	this.getMarkers = function() {

	};

}

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {
            lat: 38.3401967,
            lng: -81.6032057
        }
    });
};

var mapsError = function() {
  window.alert("ERROR!");
}

ko.applyBindings(new ViewModel);

