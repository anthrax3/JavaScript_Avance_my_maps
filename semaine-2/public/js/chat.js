var Chat;

Chat = (function() {
  Chat.templates = {};

  Chat.templates.greetings = Handlebars.compile("Hello {{username}}");

  Chat.templates.users = Handlebars.compile('<li id="{{id}}" class="user-item"> <a href="#" class="sender" data-id="{{id}}" data-user="{{username}}"> <img class="thumbnail" width="45px" src="{{avatar}}" alt="{{username}}" /> <span class="user-body">{{username}}</span> </a> </li>');

  Chat.templates.mes = Handlebars.compile('<li class="chat-message"> <span class="message-date">{{hours h m}}</span> <span class="sender btn-link" data-id="{{user.id}}" data-user="{{user.username}}"> {{user.username}} </span> <p>{{message}}</p> </li>');

  function Chat(username, socket, containerId) {
    this.socket = socket;
    this.user = {
      name: username
    };
    this.createChatWindow(containerId);
    this.socket.emit('login', {
      username: $('#name').val(),
      mail: $('#email').val()
    });
    this.socket.on('logged', this.logged);
    this.socket.on('newUser', this.newUser);
    this.socket.on('recevMessage', this.recevMessage);
    this.socket.on('logout', this.logout);
  }

  Chat.prototype.createChatWindow = function(containerId) {
    $('textarea').attr("placeholder", "Message...");
    return $('button').on('click', this.sendMessage);
  };

  Chat.prototype.sendMessage = function(event) {
    var message;
    event.preventDefault();
    message = $('#message');
    if (message.val() === '') {
      return false;
    }
    socket.emit('sendMessage', {
      message: message.val()
    });
    return $('#message').val('');
  };

  Chat.prototype.recevMessage = function(msg) {
    $('.chat-messages-list').append(Chat.templates.mes(msg));
    $('.chat-message').last().addClass('animated bounceInLeft');
    msg = $('#message-container');
    return msg.animate({
      scrollTop: msg.prop("scrollHeight")
    }, 50);
  };

  Chat.prototype.logged = function(user) {
    $(".login").addClass('animated fadeOutRightBig');
    $('.login').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(".logged").show().addClass('animated fadeInLeftBig');
      $("#users").removeClass('hidden').addClass('animated fadeInDown');
    });
    $('#message').val('');
    return $("#userGreeting").addClass('animated fadeInDown').text(Chat.templates.greetings(user));
  };

  Chat.prototype.newUser = function(user) {
    $("#users-item").append(Chat.templates.users(user));
    $('#count').addClass('animated flash').text($("#users-item").children().length);
    return $('#count').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      return $(this).removeClass('animated flash');
    });
  };

  Chat.prototype.logout = function(user) {
    $('#' + user.id).remove();
    $('#count').addClass('animated flash').text($("#users-item").children().length);
    return $('#count').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      return $(this).removeClass('animated flash');
    });
  };

  return Chat;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsSUFBQTs7QUFBQTtBQUNDLEVBQUEsSUFBSSxDQUFDLFNBQUwsR0FBaUIsRUFBakIsQ0FBQTs7QUFBQSxFQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixHQUEyQixVQUFVLENBQUMsT0FBWCxDQUFtQixvQkFBbkIsQ0FEM0IsQ0FBQTs7QUFBQSxFQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBZixHQUF1QixVQUFVLENBQUMsT0FBWCxDQUFtQiw0T0FBbkIsQ0FGdkIsQ0FBQTs7QUFBQSxFQVVBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBZixHQUFxQixVQUFVLENBQUMsT0FBWCxDQUNwQixpTkFEb0IsQ0FWckIsQ0FBQTs7QUFvQmEsRUFBQSxjQUFDLFFBQUQsRUFBWSxNQUFaLEVBQW9CLFdBQXBCLEdBQUE7QUFDWixJQUR1QixJQUFDLENBQUEsU0FBQSxNQUN4QixDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRO0FBQUEsTUFBRSxJQUFBLEVBQU0sUUFBUjtLQUFSLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixXQUFsQixDQURBLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLE9BQWIsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFXLENBQUEsQ0FBRSxPQUFGLENBQVUsQ0FBQyxHQUFYLENBQUEsQ0FBWDtBQUFBLE1BQ0EsSUFBQSxFQUFRLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxHQUFaLENBQUEsQ0FEUjtLQURGLENBSEEsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsUUFBWCxFQUFxQixJQUFDLENBQUEsTUFBdEIsQ0FQQSxDQUFBO0FBQUEsSUFRQSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLElBQUMsQ0FBQSxPQUF2QixDQVJBLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixDQUFXLGNBQVgsRUFBMkIsSUFBQyxDQUFBLFlBQTVCLENBVkEsQ0FBQTtBQUFBLElBV0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLENBQVcsUUFBWCxFQUFxQixJQUFDLENBQUEsTUFBdEIsQ0FYQSxDQURZO0VBQUEsQ0FwQmI7O0FBQUEsaUJBbUNBLGdCQUFBLEdBQWtCLFNBQUMsV0FBRCxHQUFBO0FBQ2pCLElBQUEsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsYUFBbkIsRUFBa0MsWUFBbEMsQ0FBQSxDQUFBO1dBQ0EsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEVBQVosQ0FBZSxPQUFmLEVBQXdCLElBQUMsQ0FBQSxXQUF6QixFQUZpQjtFQUFBLENBbkNsQixDQUFBOztBQUFBLGlCQXdDQSxXQUFBLEdBQWEsU0FBQyxLQUFELEdBQUE7QUFDWixRQUFBLE9BQUE7QUFBQSxJQUFBLEtBQUssQ0FBQyxjQUFOLENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQVUsQ0FBQSxDQUFFLFVBQUYsQ0FEVixDQUFBO0FBRUEsSUFBQSxJQUFHLE9BQU8sQ0FBQyxHQUFSLENBQUEsQ0FBQSxLQUFpQixFQUFwQjtBQUE0QixhQUFPLEtBQVAsQ0FBNUI7S0FGQTtBQUFBLElBR0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxhQUFaLEVBQ0M7QUFBQSxNQUFBLE9BQUEsRUFBUyxPQUFPLENBQUMsR0FBUixDQUFBLENBQVQ7S0FERCxDQUhBLENBQUE7V0FLQSxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsR0FBZCxDQUFrQixFQUFsQixFQU5ZO0VBQUEsQ0F4Q2IsQ0FBQTs7QUFBQSxpQkFnREEsWUFBQSxHQUFjLFNBQUMsR0FBRCxHQUFBO0FBQ2IsSUFBQSxDQUFBLENBQUUscUJBQUYsQ0FBd0IsQ0FBQyxNQUF6QixDQUFnQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQWYsQ0FBbUIsR0FBbkIsQ0FBaEMsQ0FBQSxDQUFBO0FBQUEsSUFDQSxDQUFBLENBQUUsZUFBRixDQUFrQixDQUFDLElBQW5CLENBQUEsQ0FBeUIsQ0FBQyxRQUExQixDQUFtQyx1QkFBbkMsQ0FEQSxDQUFBO0FBQUEsSUFFQSxHQUFBLEdBQU0sQ0FBQSxDQUFFLG9CQUFGLENBRk4sQ0FBQTtXQUdBLEdBQUcsQ0FBQyxPQUFKLENBQ0M7QUFBQSxNQUFBLFNBQUEsRUFBVyxHQUFHLENBQUMsSUFBSixDQUFTLGNBQVQsQ0FBWDtLQURELEVBRUUsRUFGRixFQUphO0VBQUEsQ0FoRGQsQ0FBQTs7QUFBQSxpQkF5REEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ1AsSUFBQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsUUFBWixDQUFxQiwwQkFBckIsQ0FBQSxDQUFBO0FBQUEsSUFDQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsR0FBWixDQUFnQiw4RUFBaEIsRUFBZ0csU0FBQSxHQUFBO0FBQy9GLE1BQUEsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLElBQWIsQ0FBQSxDQUFtQixDQUFDLFFBQXBCLENBQTZCLHdCQUE3QixDQUFBLENBQUE7QUFBQSxNQUNBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxXQUFaLENBQXdCLFFBQXhCLENBQWlDLENBQUMsUUFBbEMsQ0FBMkMscUJBQTNDLENBREEsQ0FEK0Y7SUFBQSxDQUFoRyxDQURBLENBQUE7QUFBQSxJQUtBLENBQUEsQ0FBRSxVQUFGLENBQWEsQ0FBQyxHQUFkLENBQWtCLEVBQWxCLENBTEEsQ0FBQTtXQU1BLENBQUEsQ0FBRSxlQUFGLENBQWtCLENBQUMsUUFBbkIsQ0FBNEIscUJBQTVCLENBQWtELENBQUMsSUFBbkQsQ0FBd0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLElBQXpCLENBQXhELEVBUE87RUFBQSxDQXpEUixDQUFBOztBQUFBLGlCQW1FQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUixJQUFBLENBQUEsQ0FBRSxhQUFGLENBQ0MsQ0FBQyxNQURGLENBQ1MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFmLENBQXFCLElBQXJCLENBRFQsQ0FBQSxDQUFBO0FBQUEsSUFFQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsUUFBWixDQUFxQixnQkFBckIsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxDQUFBLENBQUUsYUFBRixDQUFnQixDQUFDLFFBQWpCLENBQUEsQ0FBMkIsQ0FBQyxNQUF4RSxDQUZBLENBQUE7V0FHQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsR0FBWixDQUFnQiw4RUFBaEIsRUFBZ0csU0FBQSxHQUFBO2FBQy9GLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixFQUQrRjtJQUFBLENBQWhHLEVBSlE7RUFBQSxDQW5FVCxDQUFBOztBQUFBLGlCQTJFQSxNQUFBLEdBQVEsU0FBQyxJQUFELEdBQUE7QUFDUCxJQUFBLENBQUEsQ0FBRSxHQUFBLEdBQUssSUFBSSxDQUFDLEVBQVosQ0FBZSxDQUFDLE1BQWhCLENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFDQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsUUFBWixDQUFxQixnQkFBckIsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxDQUFBLENBQUUsYUFBRixDQUFnQixDQUFDLFFBQWpCLENBQUEsQ0FBMkIsQ0FBQyxNQUF4RSxDQURBLENBQUE7V0FFQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsR0FBWixDQUFnQiw4RUFBaEIsRUFBZ0csU0FBQSxHQUFBO2FBQy9GLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixFQUQrRjtJQUFBLENBQWhHLEVBSE87RUFBQSxDQTNFUixDQUFBOztjQUFBOztJQURELENBQUEiLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENoYXRcblx0Q2hhdC50ZW1wbGF0ZXMgPSB7fVxuXHRDaGF0LnRlbXBsYXRlcy5ncmVldGluZ3MgPSBIYW5kbGViYXJzLmNvbXBpbGUoXCJIZWxsbyB7e3VzZXJuYW1lfX1cIilcblx0Q2hhdC50ZW1wbGF0ZXMudXNlcnMgPSBIYW5kbGViYXJzLmNvbXBpbGUoJ1xuXHRcdDxsaSBpZD1cInt7aWR9fVwiIGNsYXNzPVwidXNlci1pdGVtXCI+XG5cdFx0XHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwic2VuZGVyXCIgZGF0YS1pZD1cInt7aWR9fVwiIGRhdGEtdXNlcj1cInt7dXNlcm5hbWV9fVwiPlxuXHRcdFx0XHQ8aW1nIGNsYXNzPVwidGh1bWJuYWlsXCIgd2lkdGg9XCI0NXB4XCIgc3JjPVwie3thdmF0YXJ9fVwiIGFsdD1cInt7dXNlcm5hbWV9fVwiIC8+XG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwidXNlci1ib2R5XCI+e3t1c2VybmFtZX19PC9zcGFuPlxuXHRcdFx0PC9hPlxuXHRcdDwvbGk+XG5cdCcpXG5cdENoYXQudGVtcGxhdGVzLm1lcyA9IEhhbmRsZWJhcnMuY29tcGlsZShcblx0XHQnPGxpIGNsYXNzPVwiY2hhdC1tZXNzYWdlXCI+XG5cdFx0XHQ8c3BhbiBjbGFzcz1cIm1lc3NhZ2UtZGF0ZVwiPnt7aG91cnMgaCBtfX08L3NwYW4+XG5cdFx0XHQ8c3BhbiBjbGFzcz1cInNlbmRlciBidG4tbGlua1wiIGRhdGEtaWQ9XCJ7e3VzZXIuaWR9fVwiIGRhdGEtdXNlcj1cInt7dXNlci51c2VybmFtZX19XCI+XG5cdFx0XHRcdHt7dXNlci51c2VybmFtZX19XG5cdFx0XHQ8L3NwYW4+XG5cdFx0XHQ8cD57e21lc3NhZ2V9fTwvcD5cblx0XHQ8L2xpPidcblx0KVxuXG5cdGNvbnN0cnVjdG9yOiAodXNlcm5hbWUsIEBzb2NrZXQsIGNvbnRhaW5lcklkKSAtPlxuXHRcdEB1c2VyID0geyBuYW1lOiB1c2VybmFtZSB9XG5cdFx0QGNyZWF0ZUNoYXRXaW5kb3cgY29udGFpbmVySWRcblxuXHRcdEBzb2NrZXQuZW1pdCAnbG9naW4nLFxuXHRcdFx0XHR1c2VybmFtZVx0OiAkKCcjbmFtZScpLnZhbCgpXG5cdFx0XHRcdG1haWxcdFx0OiAkKCcjZW1haWwnKS52YWwoKVxuXG5cdFx0QHNvY2tldC5vbiAnbG9nZ2VkJywgQGxvZ2dlZFxuXHRcdEBzb2NrZXQub24gJ25ld1VzZXInLCBAbmV3VXNlclxuXHRcdCNAc29ja2V0Lm9uICdzZW5kTWVzc2FnZScsIEBzZW5kTWVzc2FnZVxuXHRcdEBzb2NrZXQub24gJ3JlY2V2TWVzc2FnZScsIEByZWNldk1lc3NhZ2Vcblx0XHRAc29ja2V0Lm9uICdsb2dvdXQnLCBAbG9nb3V0XG5cblx0IyBBdGFjaGUgbCdldmVuZW1lbnQgZCdlbnZvaSBkdSBtZXNzYWdlXG5cdGNyZWF0ZUNoYXRXaW5kb3c6IChjb250YWluZXJJZCkgLT5cblx0XHQkKCd0ZXh0YXJlYScpLmF0dHIgXCJwbGFjZWhvbGRlclwiLCBcIk1lc3NhZ2UuLi5cIlxuXHRcdCQoJ2J1dHRvbicpLm9uICdjbGljaycsIEBzZW5kTWVzc2FnZVxuXG5cdCMgRW52b2kgZHUgbWVzc2FnZVxuXHRzZW5kTWVzc2FnZTogKGV2ZW50KSAtPlxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRtZXNzYWdlID0gJCgnI21lc3NhZ2UnKVxuXHRcdGlmIG1lc3NhZ2UudmFsKCkgaXMgJycgdGhlbiByZXR1cm4gZmFsc2Vcblx0XHRzb2NrZXQuZW1pdCAnc2VuZE1lc3NhZ2UnLFxuXHRcdFx0bWVzc2FnZTogbWVzc2FnZS52YWwoKVxuXHRcdCQoJyNtZXNzYWdlJykudmFsKCcnKVxuXG5cdHJlY2V2TWVzc2FnZTogKG1zZykgLT5cblx0XHQkKCcuY2hhdC1tZXNzYWdlcy1saXN0JykuYXBwZW5kKENoYXQudGVtcGxhdGVzLm1lcyhtc2cpKVxuXHRcdCQoJy5jaGF0LW1lc3NhZ2UnKS5sYXN0KCkuYWRkQ2xhc3MoJ2FuaW1hdGVkIGJvdW5jZUluTGVmdCcpXG5cdFx0bXNnID0gJCgnI21lc3NhZ2UtY29udGFpbmVyJylcblx0XHRtc2cuYW5pbWF0ZVxuXHRcdFx0c2Nyb2xsVG9wOiBtc2cucHJvcChcInNjcm9sbEhlaWdodFwiKVxuXHRcdCwgNTBcblxuXHQjIENvbm5leGlvblxuXHRsb2dnZWQ6ICh1c2VyKSAtPlxuXHRcdCQoXCIubG9naW5cIikuYWRkQ2xhc3MoJ2FuaW1hdGVkIGZhZGVPdXRSaWdodEJpZycpXG5cdFx0JCgnLmxvZ2luJykub25lICd3ZWJraXRBbmltYXRpb25FbmQgbW96QW5pbWF0aW9uRW5kIE1TQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgYW5pbWF0aW9uZW5kJywgLT5cblx0XHRcdCQoXCIubG9nZ2VkXCIpLnNob3coKS5hZGRDbGFzcygnYW5pbWF0ZWQgZmFkZUluTGVmdEJpZycpXG5cdFx0XHQkKFwiI3VzZXJzXCIpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKS5hZGRDbGFzcygnYW5pbWF0ZWQgZmFkZUluRG93bicpXG5cdFx0XHRyZXR1cm5cblx0XHQkKCcjbWVzc2FnZScpLnZhbCgnJylcblx0XHQkKFwiI3VzZXJHcmVldGluZ1wiKS5hZGRDbGFzcygnYW5pbWF0ZWQgZmFkZUluRG93bicpLnRleHQoQ2hhdC50ZW1wbGF0ZXMuZ3JlZXRpbmdzKHVzZXIpKVxuXG5cdCMgTm91dmVsIHV0aWxpc2F0ZXVyXG5cdG5ld1VzZXI6ICh1c2VyKSAtPlxuXHRcdCQoXCIjdXNlcnMtaXRlbVwiKVxuXHRcdFx0LmFwcGVuZChDaGF0LnRlbXBsYXRlcy51c2Vycyh1c2VyKSlcblx0XHQkKCcjY291bnQnKS5hZGRDbGFzcygnYW5pbWF0ZWQgZmxhc2gnKS50ZXh0KCQoXCIjdXNlcnMtaXRlbVwiKS5jaGlsZHJlbigpLmxlbmd0aClcblx0XHQkKCcjY291bnQnKS5vbmUgJ3dlYmtpdEFuaW1hdGlvbkVuZCBtb3pBbmltYXRpb25FbmQgTVNBbmltYXRpb25FbmQgb2FuaW1hdGlvbmVuZCBhbmltYXRpb25lbmQnLCAtPlxuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQgZmxhc2gnKVxuXG5cdCMgRMOpY29ubmVjdGlvblxuXHRsb2dvdXQ6ICh1c2VyKSAtPlxuXHRcdCQoJyMnKyB1c2VyLmlkKS5yZW1vdmUoKVxuXHRcdCQoJyNjb3VudCcpLmFkZENsYXNzKCdhbmltYXRlZCBmbGFzaCcpLnRleHQoJChcIiN1c2Vycy1pdGVtXCIpLmNoaWxkcmVuKCkubGVuZ3RoKVxuXHRcdCQoJyNjb3VudCcpLm9uZSAnd2Via2l0QW5pbWF0aW9uRW5kIG1vekFuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIGFuaW1hdGlvbmVuZCcsIC0+XG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCBmbGFzaCcpXG4iXX0=