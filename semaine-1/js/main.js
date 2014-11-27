(function() {
  var PlacesDataSource, calculate, exitHandler, goFullscreen, handleNoGeolocation, initialize, map, mapOptions, placeMarker, pointer;

  map = void 0;

  mapOptions = void 0;

  pointer = void 0;

  initialize = function() {
    var data, view;
    mapOptions = {
      zoom: 15
    };
    map = new google.maps.Map($("#map-canvas")[0], mapOptions);
    data = new PlacesDataSource(map);
    view = new storeLocator.View(map, data);
    google.maps.event.addListener(map, "click", function(event) {
      return placeMarker(event.latLng);
    });
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition((function(position) {
        var geocoder, infowindow, pos;
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        infowindow = new google.maps.InfoWindow({
          map: map,
          position: pos,
          content: "Vous avez été localisé."
        });
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          latLng: pos
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              $("#debut").val(results[0].formatted_address);
            } else {
              $("#debut").val(pos);
            }
          }
        });
        map.setCenter(pos);
      }), function() {
        handleNoGeolocation(true);
      });
    } else {
      handleNoGeolocation(false);
    }
  };

  handleNoGeolocation = function(errorFlag) {
    var content, infowindow, options;
    if (errorFlag) {
      content = "Erreur: Le service de Geolocation à échoué.";
    } else {
      content = "Erreur: Votre navigateur ne gére pas la geolocation.";
    }
    options = {
      map: map,
      position: new google.maps.LatLng(45.757626, 4.858879999999999),
      content: content
    };
    infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  };

  calculate = function() {
    var data, destination, direction, directionsService, origin, request, travelMode, view;
    origin = $("#debut").val();
    destination = $('#arrive').val();
    travelMode = $('input[name="travelMode"]:checked').val();
    if (origin === '' || destination === '') {
      initialize();
      return;
    }
    map = new google.maps.Map($("#map-canvas")[0], mapOptions);
    data = new PlacesDataSource(map);
    view = new storeLocator.View(map, data);
    $('#panel').empty();
    $('.jumbotron').show();
    direction = new google.maps.DirectionsRenderer({
      map: map,
      panel: panel,
      draggable: true
    });
    if (origin && destination) {
      request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode[travelMode]
      };
    }
    directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        direction.setDirections(response);
        $('#info').html("Distance: " + response.routes[0].legs[0].distance['text'] + ", Duration: " + response.routes[0].legs[0].duration['text']);
      } else {
        alert("Trajet impossible a calculer: " + status);
      }
    });
  };

  goFullscreen = function(id) {
    var element;
    element = document.getElementById(id);
    if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else {
      if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
    }
  };

  exitHandler = function() {
    google.maps.event.trigger(map, 'resize');
    calculate();
  };

  placeMarker = function(location) {
    var infowindow, marker;
    marker = new google.maps.Marker({
      position: location,
      map: map
    });
    infowindow = new google.maps.InfoWindow({
      content: "Latitude: " + location.lat() + "<br>Longitude: " + location.lng()
    });
    infowindow.open(map, marker);
    if (pointer === void 0) {
      $('#debut').val(location);
      pointer = 1;
    } else {
      $('#arrive').val(location);
      calculate();
    }
  };

  google.maps.event.addDomListener(window, "load", initialize);

  $("#debut, #arrive").geocomplete();

  $("#search").submit(function(event) {
    event.preventDefault();
    calculate();
  });

  if (localStorage.getItem('input') !== null) {
    $('#save').text('Restore');
    $('#save').after('<a href="#" id="reset" class="btn btn-danger">Clear</a>');
  } else {
    $('#save').text('Save');
  }

  $('#reset').click(function(event) {
    event.preventDefault;
    localStorage.clear();
    return window.location.reload();
  });

  $('#save').click(function(event) {
    var input;
    event.preventDefault;
    input = JSON.parse(localStorage.getItem('input'));
    if (input !== null) {
      $('#debut').val(input.debut);
      $('#arrive').val(input.arrive);
      return calculate();
    } else if ($('#debut').val() !== '' && $('#arrive').val() !== '') {
      localStorage.setItem('input', JSON.stringify({
        debut: $('#debut').val(),
        arrive: $('#arrive').val()
      }));
      return window.location.reload();
    }
  });

  $("#fullscreen").click(function() {
    goFullscreen("map-canvas");
    calculate();
  });

  if (document.addEventListener) {
    document.addEventListener("webkitfullscreenchange", exitHandler, false);
    document.addEventListener("mozfullscreenchange", exitHandler, false);
    document.addEventListener("fullscreenchange", exitHandler, false);
    document.addEventListener("MSFullscreenChange", exitHandler, false);
  }

  PlacesDataSource = function(map) {
    this.service_ = new google.maps.places.PlacesService(map);
  };

  PlacesDataSource.prototype.getStores = function(bounds, features, callback) {
    this.service_.search({
      bounds: bounds
    }, function(results, status) {
      var i, latLng, result, store, stores;
      stores = [];
      i = 0;
      result = void 0;
      while (result = results[i]) {
        latLng = result.geometry.location;
        store = new storeLocator.Store(result.id, latLng, null, {
          title: result.name,
          address: result.types.join(", "),
          icon: result.icon
        });
        stores.push(store);
        i++;
      }
      callback(stores);
    });
  };

}).call(this);

//# sourceMappingURL=main.js.map
