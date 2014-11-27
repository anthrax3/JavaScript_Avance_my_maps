map = undefined
mapOptions = undefined
pointer = undefined

# https://developers.google.com/maps/documentation/javascript/examples/directions-draggable
# https://github.com/googlemaps/js-store-locator

initialize = ->
	mapOptions = zoom: 15
	map = new google.maps.Map($("#map-canvas")[0], mapOptions)
	data = new PlacesDataSource(map)
	view = new storeLocator.View(map, data);

	google.maps.event.addListener map, "click", (event) ->
		placeMarker event.latLng

	#  geolocation
	if navigator.geolocation
		navigator.geolocation.getCurrentPosition ((position) ->
			pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
			infowindow = new google.maps.InfoWindow(
				map: map
				position: pos
				content: "Vous avez été localisé."
			)
			geocoder = new google.maps.Geocoder();
			geocoder.geocode { latLng: pos }, (results, status) ->
				if status is google.maps.GeocoderStatus.OK
					if results[0]
						$("#debut").val(results[0].formatted_address)
					else
						$("#debut").val(pos)
					return

			map.setCenter pos
			return
		), ->
			handleNoGeolocation true
			return
	else
		handleNoGeolocation false
		return

handleNoGeolocation = (errorFlag) ->
	if errorFlag
		content = "Erreur: Le service de Geolocation à échoué."
	else
		content = "Erreur: Votre navigateur ne gére pas la geolocation."
	options =
		map: map
		position: new google.maps.LatLng(45.757626, 4.858879999999999)
		content: content
	infowindow = new google.maps.InfoWindow(options)
	map.setCenter options.position
	return

calculate = ->
	origin = $("#debut").val() # Le point départ
	destination = $('#arrive').val() # Le point d'arrivé
	travelMode = $('input[name="travelMode"]:checked').val()

	if origin is '' or destination is ''
		initialize()
		return

	map = new google.maps.Map($("#map-canvas")[0], mapOptions)
	data = new PlacesDataSource(map)
	view = new storeLocator.View(map, data);
	$('#panel').empty()
	$('.jumbotron').show()

	direction = new google.maps.DirectionsRenderer(
		map: map
		panel: panel
		draggable: true
	)

	if origin and destination
		request =
			origin: origin
			destination: destination
			travelMode: google.maps.DirectionsTravelMode[travelMode] # Type de transport
	directionsService = new google.maps.DirectionsService() # Service de calcul d'itinéraire
	directionsService.route request, (response, status) -> # Envoie de la requête pour calculer le parcours
		if status is google.maps.DirectionsStatus.OK
			direction.setDirections response
			$('#info').html("Distance: "+ response.routes[0].legs[0].distance['text']+ ", Duration: "+ response.routes[0].legs[0].duration['text'])
		else
			alert "Trajet impossible a calculer: " + status
		return

	# marker = new google.maps.Marker(
	#     position: new google.maps.LatLng(45.757626, 4.858879999999999)
	#     map: map
	#     draggable: true
	#     title:"Drag me!"
	# )
	return

goFullscreen = (id) ->
	element = document.getElementById(id)
	if element.mozRequestFullScreen
		element.mozRequestFullScreen()
	else element.webkitRequestFullScreen()  if element.webkitRequestFullScreen
	return

exitHandler = ->
	google.maps.event.trigger(map, 'resize');
	calculate()
	return

placeMarker = (location) ->
	marker = new google.maps.Marker(
		position: location
		map: map
	)
	infowindow = new google.maps.InfoWindow(content: "Latitude: " + location.lat() + "<br>Longitude: " + location.lng())
	infowindow.open map, marker
	if pointer == undefined
		$('#debut').val location
		pointer = 1
	else
		$('#arrive').val location
		calculate()
	return

# Evenements
google.maps.event.addDomListener window, "load", initialize
$("#debut, #arrive").geocomplete()
$("#search").submit (event) ->
	event.preventDefault()
	calculate()
	return

if localStorage.getItem('input') != null
	$('#save').text 'Restore'
	$('#save').after('<a href="#" id="reset" class="btn btn-danger">Clear</a>')
else
	$('#save').text 'Save'

$('#reset').click (event) ->
	event.preventDefault
	localStorage.clear()
	window.location.reload()

$('#save').click (event) ->
	event.preventDefault
	input = JSON.parse(localStorage.getItem 'input')
	if(input != null)
		$('#debut').val input.debut
		$('#arrive').val input.arrive
		calculate()
	else if $('#debut').val() != '' and $('#arrive').val() != ''
		localStorage.setItem 'input', JSON.stringify
			debut: $('#debut').val()
			arrive:  $('#arrive').val()
		window.location.reload()

$("#fullscreen").click ->
	goFullscreen "map-canvas"
	calculate()
	return

if document.addEventListener
	document.addEventListener "webkitfullscreenchange", exitHandler, false
	document.addEventListener "mozfullscreenchange", exitHandler, false
	document.addEventListener "fullscreenchange", exitHandler, false
	document.addEventListener "MSFullscreenChange", exitHandler, false


# Class PlaceDataSource
PlacesDataSource = (map) ->
	@service_ = new google.maps.places.PlacesService(map)
	return

PlacesDataSource::getStores = (bounds, features, callback) ->
	@service_.search
		bounds: bounds
	, (results, status) ->
		stores = []
		i = 0
		result = undefined

		while result = results[i]
			latLng = result.geometry.location
			store = new storeLocator.Store(result.id, latLng, null,
				title: result.name
				address: result.types.join(", ")
				icon: result.icon
			)
			stores.push store
			i++
		callback stores
		return
	return
