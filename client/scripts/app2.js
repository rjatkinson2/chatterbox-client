var escape = function(data){
  return _.map(data,function(message){
    for(var key in message){
      if(typeof(message[key]) === "string"){
        console.log("test");
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
