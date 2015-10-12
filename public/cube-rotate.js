if (Meteor.isClient) {

   var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
                          window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
                          function(c) {window.setTimeout(c, 15)};
   /**
      Phoria
      pho·ri·a (fôr-)
      n. The relative directions of the eyes during binocular fixation on a given object
   */

   // bind to window onload event
   window.addEventListener('load', onloadHandler, false);

   function onloadHandler()
   {
      // get the canvas DOM element and the 2D drawing context
      var canvas = document.getElementById('canvas');

      // create the scene and setup camera, perspective and viewport
      var scene = new Phoria.Scene();
      scene.camera.position = {x:0.0, y:5.0, z:-15.0};
      scene.perspective.aspect = canvas.width / canvas.height;
      scene.viewport.width = canvas.width;
      scene.viewport.height = canvas.height;

      // create a canvas renderer
      var renderer = new Phoria.CanvasRenderer(canvas);

      // add a grid to help visualise camera position etc.
      var plane = Phoria.Util.generateTesselatedPlane(8,8,0,20);
      scene.graph.push(Phoria.Entity.create({
         points: plane.points,
         edges: plane.edges,
         polygons: plane.polygons,
         style: {
            drawmode: "wireframe",
            shademode: "plain",
            linewidth: 0.5,
            objectsortmode: "back"
         }
      }));
      var c = Phoria.Util.generateUnitCube();
      var cubes = [];

      for (var i = 0; i < 4; i++) {
         var cube = Phoria.Entity.create({
            points: c.points,
            edges: c.edges,
            polygons: c.polygons
         });
         cubes.push(cube);
      }
      scene.graph.push(cubes[0]);
      cubes[1].translateX(2.5);
      scene.graph.push(cubes[1]);
      cubes[2].translateZ(-2.5);
      scene.graph.push(cubes[2]);
      cubes[3].translateX(2.5).translateZ(-2.5);
      scene.graph.push(cubes[3]);

      scene.graph.push(new Phoria.DistantLight());

      var mouse = Phoria.View.addMouseEvents(canvas, function() {
      // pick object detection on mouse click
      var cpv = Phoria.View.calculateClickPointAndVector(scene, mouse.clickPositionX, mouse.clickPositionY);
      var lastPicked = null;
      var intersects = Phoria.View.getIntersectedObjects(scene, cpv.clickPoint, cpv.clickVector);
      var timer = null;

      document.getElementById("picked").innerHTML = "Selected: " + (intersects.length !== 0 ? intersects[0].entity.id : "[none]");

      if (lastPicked !== null)
      {
         lastPicked.style.color = lastPicked.oldcolor;
         lastPicked.style.emit = 0;
         lastPicked = null;
      }
      if (intersects.length !== 0)
      {
         var obj = intersects[0].entity;
         obj.oldcolor = obj.style.color;
         obj.style.color = [255,255,255];
         obj.style.emit = 0.5;
         lastPicked = obj;
         clearInterval(timer);
         timer = setTimeout(function() {
            if (lastPicked !== null)
            {
               lastPicked.style.color = lastPicked.oldcolor;
               lastPicked.style.emit = 0;
               lastPicked = null;
            }
         },300);
      }
   });


      var pause = false;
      var fnAnimate = function() {
         if (!pause)
         {
            // rotate local matrix of the cube
            //cube.rotateY(0.5*Phoria.RADIANS);

            // execute the model view 3D pipeline and render the scene
            scene.modelView();
            renderer.render(scene);
         }
         requestAnimFrame(fnAnimate);
      };

      // key binding
      document.addEventListener('keydown', function(e) {
         switch (e.keyCode)
         {
            case 27: // ESC
               pause = !pause;
               break;
         }
      }, false);

      // start animation
      requestAnimFrame(fnAnimate);
   }

}

