var globalCommand = "A1off";
var start,stop;
var sky_colors;

// the only colleciton which stores the values which are sent from arduino:
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

    //dividing the code in to parts:

    //Subscription to the Collection which will fetch data from the serial port:
    Meteor.subscribe("tasks",
                   {
                        onReady: function(){console.log(Tasks.find().fetch());}
                   });

    //The timer check to constantly poll the data coming from the arduino: We will also control to bg color of the webpage.
    Meteor.setInterval(function() {
      //Meteor.call('start', function(err,response){return null;});
      var task = Tasks.findOne({ type: 'color' });
      if (task) {
        Meteor.call('fetchSkyColor',task.name,
          function(err,response){
            //document.body.style.backgroundColor = response;
            $("body").css("background", response);
          });
        console.log(task.name);
      }
    }, 100);

    //Template events for the buttons which are showing up on the Client side:
    Template.Auto.events({
                         "click button": function()
                         {
                         //enter the main function here
                         globalCommand = "Auto";
                         Meteor.call('command', function(err,response){return null;});
                         }
                         });

    Template.Manual.events({
                           "click button": function()
                           {
                           //enter the main function here
                           globalCommand = "Manual";
                           Meteor.call('command', function(err,response){return null;});
                           }
                           });

    Template.AllOn.events({
                          "click button": function()
                          {
                          //enter the main function here
                          globalCommand = "AllOn";
                          Meteor.call('command', function(err,response){return null;});
                          }
                          });

    Template.AllOff.events({
                           "click button": function()
                           {
                           //enter the main function here
                           globalCommand = "AllOff";
                           Meteor.call('command', function(err,response){return null;});
                           }
                           });

    Template.LivOn.events({
                          "click button": function()
                          {
                          //enter the main function here
                          globalCommand = "A1on";
                          Meteor.call('command', 'A1on', function(err,response){return null;});
                          }
                          });

    Template.LivOff.events({
                           "click button": function()
                           {
                           //enter the main function here
                           globalCommand = "A1off";
                           Meteor.call('command','A1off', function(err,response){return null;});
                           }
                           });

//isClient ends here
}


if (Meteor.isServer) {

    Meteor.startup(function () {
                   Tasks.remove({});
                   Tasks.upsert({type: 'color'}, {type: 'color', name:0});
                   Meteor.methods({
                                  //calls to the arduino to stop:
                                  command : function(data)
                                  {
                                  //serialPort.write(data); //SERIAL PORT DATA WRITING TO ARDUINO.
                                  console.log(data);
                                  },
                                  fetchSkyColor : function(atLength)
                                  {
                                  return sky_colors[atLength];
                                  }
                                  });
                   });

    sky_colors = JSON.parse(Assets.getText("json/sky.json"));
    console.log(sky_colors[135]);

    /*
        SERIAL PORT CONNECTION IS DONE HERE:
     */

    if (Meteor.settings.useSerialPort) {
//    //connect to serial port:
        var serialPort = new SerialPort.SerialPort("/dev/tty.usbmodem1421", {
            baudrate: 9600,
            parser: SerialPort.parsers.readline('\r\n')
        });
//Get the data from the port:

        serialPort.on('data', Meteor.bindEnvironment(function(data) {
            console.log('message ' + data);
            Tasks.upsert({type:'color'}, {type: 'color', name:data});
        }));
    } else {
        var sData = 0;

//faking the arduino output
        Meteor.setInterval(function()
                       {
                            sData+=1;
                            if (sData >= sky_colors.length) {
                              sData = 0;
                            }
                            Tasks.upsert({type:'color'}, {type:'color', name:sData});
                       },200
                       );
    }

  Meteor.publish("tasks", function () {
         return Tasks.find();
   });
}
