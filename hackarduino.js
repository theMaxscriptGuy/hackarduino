
if (Meteor.isClient) {
  Meteor.subscribe("tasks",
  {
    onReady: function(){console.log(Tasks.find().data);}
  }
)
  Meteor.setInterval(function()
  {
    //console.log("Hello World!");
    console.log(Tasks.findOne().name)
  },5000);
}

Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  Tasks.remove({});
//connect to serial port:
  var serialPort = new SerialPort.SerialPort("/dev/tty.usbmodemfd1311", {
                                                baudrate: 9600,
                                                parser: SerialPort.parsers.readline('\r\n')
                                               });
//Get the data from the port:

  serialPort.on('data', Meteor.bindEnvironment(function(data) {
  console.log('message ' + data);
  Tasks.remove({});
  Tasks.upsert({_id: 0}, {name:data});
  }));

  Meteor.publish("tasks", function () {
         return Tasks.find();
   });
}
