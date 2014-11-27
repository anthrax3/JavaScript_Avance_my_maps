# Handlebars helper convert to heure:min
Handlebars.registerHelper 'hours', (hours, minutes) ->
	if hours <= 9 then hours = "0"+hours
	if minutes <= 9 then minutes = "0"+minutes
	hours+":"+minutes
