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
                        onReady: function(){console.log(Tasks.find().data);}
                   });
    //The timer check to constantly poll the data coming from the arduino: We will also control to bg color of the webpage.
    Meteor.setInterval(function()
                     {
                        //Meteor.call('start', function(err,response){return null;});
                       Meteor.call('fetchSkyColor',Tasks.findOne().name,function(err,response){document.body.style.backgroundColor = response;})
                        console.log(Tasks.findOne().name);
                     },100);
    
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
                   Meteor.methods({
                                  //calls to the arduino to stop:
                                  command : function(data)
                                  {
                                  serialPort.write(data);
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
    

//perfectly workging:
//    Meteor.setInterval(function(){
//                       sData +=1;
//                       if(sData % 2 == 0)
//    {
//        serialPort.write("A1on");
//    }
//    else
//    {
//        serialPort.write("A1off");
//    }
//                       console.log("SData = " + sData);
//                       },5000);
    
    
    
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
