
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
    
    var sData = 0;
    
//connect to serial port:
  var serialPort = new SerialPort.SerialPort("/dev/tty.usbmodem1421", {
                                                baudrate: 9600,
                                                parser: SerialPort.parsers.readline('\r\n')
                                               });
//Get the data from the port:

  serialPort.on('data', Meteor.bindEnvironment(function(data) {
  console.log('message ' + data);
  Tasks.remove({});
  Tasks.upsert({_id: 0}, {name:data});
  }));


    Meteor.setInterval(function(){
                       sData +=1;
                       if(sData % 2 == 0)
    {
        serialPort.write("A1on");
    }
    else
    {
        serialPort.write("A1off");
    }
                       console.log("SData = " + sData);
                       },5000);
    
    
    
////faking the arduino output
//    Meteor.setInterval(function()
//                       {
//                            sData+=1;
//                            Tasks.remove({});
//                            Tasks.upsert({_id: 0}, {name:sData});
//                       },1000
//                       );

  Meteor.publish("tasks", function () {
         return Tasks.find();
   });
}
