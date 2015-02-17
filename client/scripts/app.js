// YOUR CODE HERE:
// Figure out what format data comes as.
// Write a function that takes in the data and display in DOM.
// Write out the AJAX request to get data and call function.


var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function(){
  //initiate
  app.fetch();

  // //refresh
  // setInterval(function(){
  //   return app.init();
  // },1000);
  $("#refresh").on("click", function(){
    app.fetch();
  });

  $("#form").on("submit",function(event){

    event.preventDefault();
    var text = $("#text").val();
    var name = $("#username").val();
    var newMessage = {};
    newMessage.username = name;
    newMessage.text = text;
    newMessage.roomname = "HR25";
    app.send(newMessage);
    app.fetch();
  });



};

app.refreshEventHandlers = function(){
  $("#rooms").change(function(){
    var selectedRooms = [];
    $("#rooms option:selected").each(function(){
      selectedRooms.push(this.innerHTML);
    });
    // console.log(selectedRooms);
    app.fetch(selectedRooms);
  });

  $("a").on("click", function(event){
    event.preventDefault();
  });
};

app.escape = function(data){
  return _.map(data,function(message){
    for(var key in message){
      if(typeof(message[key]) === "string"){
        message[key] = message[key].replace(/&/g, '&amp');
        message[key] = message[key].replace(/</g, '&lt');
        message[key] = message[key].replace(/>/g, '&gt');
        message[key] = message[key].replace(/"/g, '&quot');
        message[key] = message[key].replace(/'/g, '&#x27');
        message[key] = message[key].replace(/\//g, '&#x2F');
      }
    }
    return message;
  });
};

app.refresh = function(data, callback){
  console.log(data);
  var chatBox = $('#chat');
  var allMessages = data.results;
  allMessages = app.escape(allMessages);
  var createMessage = function(message){
    var innerHtml = "<div><div>username: " +"<a class = 'username' href='#'>" + message.username + "</a>"+ "</div><div>text: "+ message.text + "</div><div>room: "+ message.roomname +"</div><div>createdAt: "+ message.createdAt +   "</div></div><br />";
    return innerHtml;
  };
  var createMessageFriends = function(message){
    var innerHtml = "<div><div>username: " +"<a class = 'username' href='#'>" + message.username + "</a>"+ "</div><div class = 'friend'>text: "+ message.text + "</div><div>room: "+ message.roomname +"</div><div>createdAt: "+ message.createdAt +   "</div></div><br />";
    console.log("It works");
    return innerHtml;
  };

  chatBox.html('');
  for (var i = 0; i < allMessages.length; i++){
    if(_.contains(app.friends, allMessages[i].username)){
      var innerHtml = createMessageFriends(allMessages[i]);
    } else {
      var innerHtml = createMessage(allMessages[i]);
    }
    chatBox.append(innerHtml);
    app.rooms[allMessages[i].roomname] = 1;
  }
  app.createRooms();


  $("#rooms").change(function(){
    var selectedRooms = [];
    $("#rooms option:selected").each(function(){
      selectedRooms.push(this.innerHTML);
    });
    // console.log(selectedRooms);
    app.fetch(selectedRooms);
  });

  $("a").on("click", function(event){
    event.preventDefault();
    app.friends.push(this.innerHTML);
  });

};

app.rooms ={};
app.createRooms = function(){
  for( key in this.rooms){
    // var option = $("<option>")
    $("#rooms").append('<option>' + key + '</option>');
  }
};

app.friends = [];

app.send = function(message){
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(room, users){
  // var options ={order:"-createdAt", where:{"roomname":"lobby"}};
  var options ={order:"-createdAt"};
  if(room && users){
    options.where = {"roomname":room, "username":{"$in":users}};
  }
  else if(room){
    options.where = {"roomname":{"$in":room}};
  }
  else if (users){
    options.where = {"username":{"$in":users}};
  }
  $.ajax({
    url: app.server,
    type: 'GET',
    data: options,
    success: this.refresh,
    error: function (data) {
      console.log("FAIL");
    }
  });
};

$(document).ready(function(){
  app.init();
});
// Data return type
// createdAt: "2013-10-07T17:24:40.668Z"
// objectId: "8noEr4Pu8J"
// roomname: "lobby"
// text: "hello"
// updatedAt: "2013-10-07T17:24:40.668Z"
// username: "jillian"

