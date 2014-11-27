class Chat
	Chat.templates = {}
	Chat.templates.greetings = Handlebars.compile("Hello {{username}}")
	Chat.templates.users = Handlebars.compile('
		<li id="{{id}}" class="user-item">
			<a href="#" class="sender" data-id="{{id}}" data-user="{{username}}">
				<img class="thumbnail" width="45px" src="{{avatar}}" alt="{{username}}" />
				<span class="user-body">{{username}}</span>
			</a>
		</li>
	')
	Chat.templates.mes = Handlebars.compile(
		'<li class="chat-message">
			<span class="message-date">{{hours h m}}</span>
			<span class="sender btn-link" data-id="{{user.id}}" data-user="{{user.username}}">
				{{user.username}}
			</span>
			<p>{{message}}</p>
		</li>'
	)

	constructor: (username, @socket, containerId) ->
		@user = { name: username }
		@createChatWindow containerId

		@socket.emit 'login',
				username	: $('#name').val()
				mail		: $('#email').val()

		@socket.on 'logged', @logged
		@socket.on 'newUser', @newUser
		#@socket.on 'sendMessage', @sendMessage
		@socket.on 'recevMessage', @recevMessage
		@socket.on 'logout', @logout

	# Atache l'evenement d'envoi du message
	createChatWindow: (containerId) ->
		$('textarea').attr "placeholder", "Message..."
		$('button').on 'click', @sendMessage

	# Envoi du message
	sendMessage: (event) ->
		event.preventDefault()
		message = $('#message')
		if message.val() is '' then return false
		socket.emit 'sendMessage',
			message: message.val()
		$('#message').val('')

	recevMessage: (msg) ->
		$('.chat-messages-list').append(Chat.templates.mes(msg))
		$('.chat-message').last().addClass('animated bounceInLeft')
		msg = $('#message-container')
		msg.animate
			scrollTop: msg.prop("scrollHeight")
		, 50

	# Connexion
	logged: (user) ->
		$(".login").addClass('animated fadeOutRightBig')
		$('.login').one 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ->
			$(".logged").show().addClass('animated fadeInLeftBig')
			$("#users").removeClass('hidden').addClass('animated fadeInDown')
			return
		$('#message').val('')
		$("#userGreeting").addClass('animated fadeInDown').text(Chat.templates.greetings(user))

	# Nouvel utilisateur
	newUser: (user) ->
		$("#users-item")
			.append(Chat.templates.users(user))
		$('#count').addClass('animated flash').text($("#users-item").children().length)
		$('#count').one 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ->
			$(this).removeClass('animated flash')

	# Déconnection
	logout: (user) ->
		$('#'+ user.id).remove()
		$('#count').addClass('animated flash').text($("#users-item").children().length)
		$('#count').one 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ->
			$(this).removeClass('animated flash')
