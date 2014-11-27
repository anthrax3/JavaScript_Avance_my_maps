socket = io.connect(window.location.hostname)
$("#createChannel").on "click", ->
	username = $("#name").val()
	email = $("#email").val()
	if username is '' or email is '' then return false;
	chat = new Chat(username, socket, "chatContainer")
	new Localisation(socket, chat, "map_canvas")
	return
