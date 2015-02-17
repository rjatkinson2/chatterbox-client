// YOUR CODE HERE:
// Figure out what format data comes as.
// Write a function that takes in the data and display in DOM.
// Write out the AJAX request to get data and call function.


var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function(){
  //initiate
  app.fetch();
  // debugger;
  //refresh
  setInterval(function(){
    return app.init();
  },1000);

};

app.refresh = function(data){
  debugger;
  var chatBox = $('#chat');
  var allMessages = data.results;
  var createMessage = function(message){
    var innerHtml = "<div><div>username: " + message.username
      + "</div><div>text: "+ message.text + "</div><div>room: "+ message.roomname + "</div></div><br />";
    return innerHtml;
  };
  chatBox.html('');
  for (var i = data.results.length - 1; i >= 0; i--){
    var innerHtml = createMessage(data.results[i]);
    chatBox.append(innerHtml);
  }
  console.log(data);
};

app.send = function(){};

app.fetch = function(){
  $.ajax({
    url: app.server,
    type: 'GET',
    success: this.refresh,
    error: function (data) {
      console.log("FAIL");
    }
  });
};

app.init();
// Data return type
// createdAt: "2013-10-07T17:24:40.668Z"
// objectId: "8noEr4Pu8J"
// roomname: "lobby"
// text: "hello"
// updatedAt: "2013-10-07T17:24:40.668Z"
// username: "jillian"

