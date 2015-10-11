if (Meteor.isClient) {


  Meteor.subscribe("tasks",
  {
    onReady: function(){
      console.log(Tasks.find().data);

    }
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

  var sky_colors;
  var fs = Npm.require('fs');
    fs.readFileSync('/public/sky_color_map.json', 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }

        sky_colors = JSON.parse(data);
        console.log(sky_colors);
    });

//connect to serial port:
//  var serialPort = new SerialPort.SerialPort("/dev/tty.usbmodem1421", {
//                                                baudrate: 9600,
//                                                parser: SerialPort.parsers.readline('\r\n')
//                                               });
////Get the data from the port:
//
//  serialPort.on('data', Meteor.bindEnvironment(function(data) {
//  console.log('message ' + data);
//  Tasks.remove({});
//  Tasks.upsert({_id: 0}, {name:data});
//  serialPort.write("0101");
//  }));
  var sData = 0;
  Meteor.setInterval(function() {
      sData+=1;
      Tasks.remove({});
      console.log(sky_colors[sData]);
      Tasks.upsert({_id: 0}, {name:sky_colors[sData]});
  }, 1000
  );
  Meteor.publish("tasks", function () {
         return Tasks.find();
   });
}
