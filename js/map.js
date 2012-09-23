var map;
var infowindow;
  
function initialize() {
    var mapOptions = {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = new google.maps.Marker({
				position:pos,
				map: map,
				title: '現在地'
			});


            var request = {
				location: pos,
				radius: 500,
				// keyword: 'トイレ'
				types: ['store']
			};

			infowindow = new google.maps.InfoWindow();	
			var service = new google.maps.places.PlacesService(map);
			service.search(request, callback);

            // var infowindow = new google.maps.InfoWindow({
				//  map: map,
				//  position: pos,
				//  content: 'Location found using HTML5.'
            // });

            map.setCenter(pos);
        }, function() {
			handleNoGeolocation(true);
        });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

		google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

function handleNoGeolocation(errorFlag) {
	var content = '';
	if (errorFlag) {
		content = 'Error: The Geolocation service failed.';
	} else {
		content = 'Error: Your browser doesn\'t support geolocation.';
	}

	var options = {
		map: map,
		position: new google.maps.LatLng(35.689488, 139.691706),
		content: content
	};

	var infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);
