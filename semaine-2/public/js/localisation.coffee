class Localisation
    Localisation.map = ''
    Localisation.markers = {}
    Localisation.myMarker = {}
    Localisation.chat = {}
    constructor: (@socket, chat, mapId) ->

        defaultPosition = new google.maps.LatLng(-34.397, 150.644)
        mapOptions =
            zoom: 8
            panControl: false
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            }
            center: defaultPosition
            mapTypeId: google.maps.MapTypeId.ROADMAP

        Localisation.map = new google.maps.Map(document.getElementById(mapId), mapOptions)
        Localisation.markers = {1}
        Localisation.chat = chat
        @geolocation(@showPosition)

        socket.on 'updateLocation', updateMarker
        socket.on 'logout', removeMarker
        socket.emit 'requestLocations', loadMarkers

    # Vérifie si la geolocalisation est possible
    geolocation: (successHandler, errorHandler) ->
        errorHandler = errorHandler || @geolocationErrorHandler

        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(successHandler, errorHandler)
        else
            alert("La géolocalisation n'est pas supporté par ce navigateur.")

    # envoi la geolocalisation au server
    showPosition: (position) ->
        data =
            lat : position.coords.latitude
            lng : position.coords.longitude

        Localisation.myMarker = getMarker(data.lat, data.lng, 'Me')
        Localisation.map.setCenter(Localisation.myMarker.getPosition())
        socket.emit("sendLocation", data)

    # Défini l'erreur de geolocalisation
    geolocationErrorHandler: (error) ->
        switch error.code
            when error.PERMISSION_DENIED
                alert "Votre position ne sera pas partagée avec d'autres utilisateurs."
            when error.POSITION_UNAVAILABLE
                alert "Les informations de geolocalisation sont indisponible."
            when error.TIMEOUT
                alert "La demande pour obtenir votre position à expiré."
            when error.UNKNOWN_ERROR
                alert "Une erreur inconnue est survenue."

    # Place un marker sur la map
    getMarker = (lat, lng, title) ->
        new google.maps.Marker(
            title: title
            map: Localisation.map
            position: new google.maps.LatLng(lat, lng)
        )

    # Met a jour la position d'un marker sur la map
    updateMarker = (data) ->
        marker = Localisation.markers[data.id]
        if marker
            marker.setPosition new google.maps.LatLng(data.lat, data.lng)
        else
            Localisation.markers[data.id] = getMarker(data.lat, data.lng, data.username)
        console.log Localisation.markers, "updateMarker"
        $('.sender').click showUserLocation
        return

    # charge un nouveau marker sur la map
    loadMarkers = (data) ->
        for key of data
            user = data[key]
            Localisation.markers[key] = getMarker(user.lat, user.lng, user.username)
        console.log Localisation.markers, "loadMarkers"
        $('.sender').click showUserLocation
        return

    # supprime un marker sur la map
    removeMarker = (user) ->
        marker = Localisation.markers[user.id]
        if marker
            marker.setMap null
            delete Localisation.markers[user.id]
        console.log user, Localisation.markers, "removeMarker"
        return

    # centre la map sur la position d'un utilisateur
    showUserLocation = (event) ->
        event.preventDefault()
        console.log 'showUserLocation'
        key = $(this).data("id")
        username = $(this).data("user")
        console.log key, username, Localisation.chat.user.name
        if username is Localisation.chat.user.name
            Localisation.map.setCenter Localisation.myMarker.getPosition()
        else
            userMarker = Localisation.markers[key]
            if userMarker
                Localisation.map.setCenter userMarker.getPosition()
            else
                alert "L'utilisateur n'est plus connecté."
        return
