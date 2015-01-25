(function() {
  'use strict';

  function Level1() {
    this.player = null;
  }

  Level1.prototype = {

    create: function() {

      // Define movement constants
      this.MAX_SPEED = 500; // pixels/second
      this.ACCELERATION = 1500; // pixels/second/second
      this.DRAG = 600; // pixels/second
      this.GRAVITY = 2600; // pixels/second/second
      this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

      // Create a player sprites
      this.player1 = Phaser.skeil.Player(this, 'player1')
      this.player2 = Phaser.skeil.Player(this, 'player2')

      // add music
      this.soundtrack = this.game.add.audio('soundtrack', 1, true, true);

      this.redAudio1 = this.game.add.audio('redAudio1', 0.5, true, true);
      this.redAudio2 = this.game.add.audio('redAudio2', 0.5, true, true);

      this.greenAudio1 = this.game.add.audio('greenAudio1', 0.5, true, true);
      this.greenAudio2 = this.game.add.audio('greenAudio2', 0.5, true, true);

      this.blueAudio1 = this.game.add.audio('blueAudio1', 0.5, true, true);
      this.blueAudio2 = this.game.add.audio('blueAudio2', 0.5, true, true);

      this.whiteAudio1 = this.game.add.audio('whiteAudio1', 0.5, true, true);
      this.whiteAudio2 = this.game.add.audio('whiteAudio2', 0.5, true, true);

      this.soundtrack.play();
      this.whiteAudio1.play('', Math.random()*this.whiteAudio1.totalDuration*1000, 0.5);
      this.whiteAudio2.play('', Math.random()*this.whiteAudio2.totalDuration*1000, 0.2);


      // threw it on the ground!
      this.walls = this.game.add.group();

      // ceiling
      Phaser.skeil.createVarWall(this, 0, this.game.height/3, this.game.width, 32, 0xffffff, 1, this.walls)
      // floor
      Phaser.skeil.createVarWall(this, 0, this.game.height-32, 5*32, 32, 0xffffff, 1, this.walls)
      Phaser.skeil.createVarWall(this, 8*32, this.game.height-32, this.game.width-8*32, 32, 0xffffff, 1, this.walls)

      // box1
      Phaser.skeil.createVarWall(this, 4*32, this.game.height-32*2, 32, 32, 0xffffff, 1, this.walls)
      // box2
      Phaser.skeil.createVarWall(this, 32, this.game.height-32*7, 32*2, 32*2, 0xffffff, 1, this.walls)
      // box3
      Phaser.skeil.createVarWall(this, 2*32, this.game.height-32*11, 32*2, 32*2, 0xffffff, 1, this.walls)
      // box4
      Phaser.skeil.createVarWall(this, 7*32, this.game.height-32*8, 32*10, 32, 0xffffff, 1, this.walls)
      // box5
      Phaser.skeil.createVarWall(this, 21*32, this.game.height/3+32, 32, 32*10, 0xffffff, 1, this.walls)

      // obstacles
      this.obstacles = this.game.add.group();

      // obstacle 1
      Phaser.skeil.createVarWall(this, 21*32, this.game.height/3+32*11, 32, 32*4, 0xff0000, 1, this.obstacles);


      // Capture certain keys to prevent their default actions in the browser.
      // This is only necessary because this is an HTML5 game. Games on other
      // platforms may not need code like this.
      this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
        ]);

      Phaser.skeil.setUpInput(this)

      // Add the light
      this.lightGroup = this.game.add.group();

      this.Player1Light = this.game.add.sprite(this.game.width/2, this.game.height/2, 'light');
      this.Player1Light.anchor.setTo(0.5, 0.5);

      this.Player2Light = this.game.add.sprite(50, this.game.height - 82, 'light');
      this.Player2Light.anchor.setTo(0.5, 0.5);

      this.lightGroup.add(this.Player1Light);
      this.lightGroup.add(this.Player2Light);

      // Create a bitmap texture for drawing light cones
      this.bitmap1 = this.game.add.bitmapData(this.game.width, this.game.height);
      this.bitmap1.context.fillStyle = 'rgb(255, 255, 255)';
      this.bitmap1.context.strokeStyle = 'rgb(255, 255, 255)';
      var lightBitmap1 = this.game.add.image(0, 0, this.bitmap1);

      this.bitmap2 = this.game.add.bitmapData(this.game.width, this.game.height);
      this.bitmap2.context.fillStyle = 'rgb(255, 255, 255)';
      this.bitmap2.context.strokeStyle = 'rgb(255, 255, 255)';
      var lightBitmap2 = this.game.add.image(0, 0, this.bitmap2);

      // blendModes
      lightBitmap1.blendMode = Phaser.blendModes.ADD;
      lightBitmap2.blendMode = Phaser.blendModes.ADD;

      // Create a bitmap for drawing rays
      this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
      this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
      this.rayBitmapImage.visible = false;

      // Setup function for hiding or showing rays
      this.game.input.onTap.add(this.toggleRays, this);

      //player colors
      this.playerColorsWHITE = 'rgba(255, 255, 255, 1)';
      this.playerColorsRED = 'rgba(255, 0, 0, 1)';
      this.playerColorsGREEN = 'rgba(0, 255, 0, 1)';
      this.playerColorsBLUE = 'rgba(0, 0, 255, 1)';

      this.player1Color = this.playerColorsWHITE;
      this.player2Color = this.playerColorsWHITE;

      // Simulate a pointer input at the center of the stage
      // when the example begins running.
      this.game.input.activePointer.x = this.game.width/2;
      this.game.input.activePointer.y = this.game.height/2;

    },

    toggleRays: function() {
      // Toggle the visibility of the rays when the pointer is clicked
      if (this.rayBitmapImage.visible) {
          this.rayBitmapImage.visible = false;
      } else {
          this.rayBitmapImage.visible = true;
      }
    },

    // The update() method is called every frame
    update: function() {
      // collision
      this.game.physics.arcade.collide(this.player1, this.walls);
      this.game.physics.arcade.collide(this.player2, this.walls);

      if (this.leftInput1IsActive) {
        // If the LEFT key is down, set the player velocity to move left
        this.player1.left(true)
      } else if (this.rightInput1IsActive) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player1.right(true)
      } else {
        this.player1.left(false)
      }

      // Set a variable that is true when the player is touching the ground
      var onTheGround = this.player1.body.touching.down;

      if (onTheGround && this.upInput1IsActive) {
        // Jump when the player is touching the ground and the up arrow is pressed
        this.player1.jump()
      }

      if (this.leftInput2IsActive) {
        // If the LEFT key is down, set the player velocity to move left
        this.player2.left(true)
      } else if (this.rightInput2IsActive) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player2.right(true)
      } else {
        this.player2.left(false)
      }

      // Set a variable that is true when the player is touching the ground
      var onTheGround = this.player2.body.touching.down;

      if (onTheGround && this.upInput2IsActive) {
        // Jump when the player is touching the ground and the up arrow is pressed
        this.player2.jump()
      }

      // Move the light to pointer location
      this.Player1Light.x = this.player1.body.x+this.player1.body.width/2;
      this.Player1Light.y = this.player1.body.y+this.player1.body.height/2;

      this.Player2Light.x = this.player2.body.x+this.player2.body.width/2;
      this.Player2Light.y = this.player2.body.y+this.player2.body.height/2;

      // Next, fill the entire light bitmap with a dark shadow color.
      this.bitmap1.context.fillStyle = 'rgba(1, 1, 1, 1)';
      this.bitmap1.context.fillRect(0, 0, this.game.width, this.game.height);
      this.rayBitmap.context.clearRect(0, 0, this.game.width, this.game.height);

      // Next, fill the entire light bitmap with a dark shadow color.
      this.bitmap2.context.fillStyle = 'rgba(1, 1, 1, 1)';
      this.bitmap2.context.fillRect(0, 0, this.game.width, this.game.height);
      this.rayBitmap.context.clearRect(0, 0, this.game.width, this.game.height);

      // An array of the stage corners that we'll use later
      var stageCorners = [
          new Phaser.Point(0, 0),
          new Phaser.Point(this.game.width, 0),
          new Phaser.Point(this.game.width, this.game.height),
          new Phaser.Point(0, this.game.height)
      ];



      // Ray casting!
      // Cast rays from each light
      var light2 = this.Player2Light;
      this.lightFunc(this.bitmap1, light2, this.player2Color, stageCorners);


      var light1 = this.Player1Light;
      this.lightFunc(this.bitmap2, light1, this.player1Color, stageCorners);

      // draw obstacles
      //TODO remove obstacles if color matches
/*
      this.obstacles.forEach(function(obstacle) {
        ;
      }, this);
*/

      // This just tells the engine it should update the texture cache
      this.bitmap1.dirty = true;
      this.bitmap2.dirty = true;
      this.rayBitmap.dirty = true;
    },

    lightFunc: function(bitmap, light, rgbaColor, stageCorners) {
          var points = [];
          var ray = null;
          var intersect;
          var i;

          // Cast rays through the corners of each wall towards the stage edge.
          // Save all of the intersection points or ray end points if there was no intersection.
          this.walls.forEach(function(wall) {
              // Create a ray from the light through each corner out to the edge of the stage.
              // This array defines points just inside of each corner to make sure we hit each one.
              // It also defines points just outside of each corner so we can see to the stage edges.
              var offset = 0.1;

              var corners = [
                  new Phaser.Point(wall.x+offset, wall.y+offset),
                  new Phaser.Point(wall.x-offset, wall.y-offset),

                  new Phaser.Point(wall.x-offset + wall.width, wall.y+offset),
                  new Phaser.Point(wall.x+offset + wall.width, wall.y-offset),

                  new Phaser.Point(wall.x-offset + wall.width, wall.y-offset + wall.height),
                  new Phaser.Point(wall.x+offset + wall.width, wall.y+offset + wall.height),

                  new Phaser.Point(wall.x+offset, wall.y-offset + wall.height),
                  new Phaser.Point(wall.x-offset, wall.y+offset + wall.height)
              ];

              // Calculate rays through each point to the edge of the stage
              for(i = 0; i < corners.length; i++) {
                  var c = corners[i];

                  // Here comes the linear algebra.
                  // The equation for a line is y = slope * x + b
                  // b is where the line crosses the left edge of the stage
                  var slope = (c.y - light.y) / (c.x - light.x);
                  var b = light.y - slope * light.x;

                  var end = null;

                  if (c.x === light.x) {
                      // Vertical lines are a special case
                      if (c.y <= light.y) {
                          end = new Phaser.Point(light.x, 0);
                      } else {
                          end = new Phaser.Point(light.x, this.game.height);
                      }
                  } else if (c.y === light.y) {
                      // Horizontal lines are a special case
                      if (c.x <= light.x) {
                          end = new Phaser.Point(0, light.y);
                      } else {
                          end = new Phaser.Point(this.game.width, light.y);
                      }
                  } else {
                      // Find the point where the line crosses the stage edge
                      var left = new Phaser.Point(0, b);
                      var right = new Phaser.Point(this.game.width, slope * this.game.width + b);
                      var top = new Phaser.Point(-b/slope, 0);
                      var bottom = new Phaser.Point((this.game.height-b)/slope, this.game.height);

                      // Get the actual intersection point
                      if (c.y <= light.y && c.x >= light.x) {
                          if (top.x >= 0 && top.x <= this.game.width) {
                              end = top;
                          } else {
                              end = right;
                          }
                      } else if (c.y <= light.y && c.x <= light.x) {
                          if (top.x >= 0 && top.x <= this.game.width) {
                              end = top;
                          } else {
                              end = left;
                          }
                      } else if (c.y >= light.y && c.x >= light.x) {
                          if (bottom.x >= 0 && bottom.x <= this.game.width) {
                              end = bottom;
                          } else {
                              end = right;
                          }
                      } else if (c.y >= light.y && c.x <= light.x) {
                          if (bottom.x >= 0 && bottom.x <= this.game.width) {
                              end = bottom;
                          } else {
                              end = left;
                          }
                      }
                  }

                  // Create a ray
                  ray = new Phaser.Line(light.x, light.y, end.x, end.y);

                  // Check if the ray intersected the wall
                  intersect = this.getWallIntersection(ray);
                  if (intersect) {
                      // This is the front edge of the light blocking object
                      points.push(intersect);
                  } else {
                      // Nothing blocked the ray
                      points.push(ray.end);
                  }
              }
          }, this);

          // Shoot rays at each of the stage corners to see if the corner
          // of the stage is in shadow. This needs to be done so that
          // shadows don't cut the corner.
          for(i = 0; i < stageCorners.length; i++) {
              ray = new Phaser.Line(light.x, light.y,
                  stageCorners[i].x, stageCorners[i].y);
              intersect = this.getWallIntersection(ray);
              if (!intersect) {
                  // Corner is in light
                  points.push(stageCorners[i]);
              }
          }

          // Now sort the points clockwise around the light.
          // Sorting is required so that the points are connected in the right order.
          //
          // This sorting algorithm was copied from Stack Overflow:
          // http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
          //
          // Here's a pseudo-code implementation if you want to code it yourself:
          // http://en.wikipedia.org/wiki/Graham_scan
          var center = { x: light.x, y: light.y };
          points = points.sort(function(a, b) {
              if (a.x - center.x >= 0 && b.x - center.x < 0)
                  return 1;
              if (a.x - center.x < 0 && b.x - center.x >= 0)
                  return -1;
              if (a.x - center.x === 0 && b.x - center.x === 0) {
                  if (a.y - center.y >= 0 || b.y - center.y >= 0)
                      return 1;
                  return -1;
              }

              // Compute the cross product of vectors (center -> a) x (center -> b)
              var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
              if (det < 0)
                  return 1;
              if (det > 0)
                  return -1;

              // Points a and b are on the same line from the center
              // Check which point is closer to the center
              var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
              var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
              return 1;
          });

          // Connect the dots and fill in the shape, which are cones of light,
          // with a bright white color. When multiplied with the background,
          // the white color will allow the full color of the background to
          // shine through.
          bitmap.context.beginPath();
          bitmap.context.fillStyle = rgbaColor;
          bitmap.context.moveTo(points[0].x, points[0].y);
          for(var j = 0; j < points.length; j++) {
              bitmap.context.lineTo(points[j].x, points[j].y);
          }
          bitmap.context.closePath();
          bitmap.context.fill();

          // Draw each of the rays on the rayBitmap
          this.rayBitmap.context.beginPath();
          this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
          this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
          this.rayBitmap.context.moveTo(points[0].x, points[0].y);
          for(var k = 0; k < points.length; k++) {
              this.rayBitmap.context.moveTo(light.x, light.y);
              this.rayBitmap.context.lineTo(points[k].x, points[k].y);
              this.rayBitmap.context.fillRect(points[k].x-2, points[k].y-2, 4, 4);
          }
          this.rayBitmap.context.stroke();

    },

    // Given a ray, this function iterates through all of the walls and
    // returns the closest wall intersection from the start of the ray
    // or null if the ray does not intersect any walls.
    getWallIntersection: function(ray) {
      var distanceToWall = Number.POSITIVE_INFINITY;
      var closestIntersection = null;

      // For each of the walls...
      this.walls.forEach(function(wall) {
          // Create an array of lines that represent the four edges of each wall
          var lines = [
              new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
              new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
              new Phaser.Line(wall.x + wall.width, wall.y,
                  wall.x + wall.width, wall.y + wall.height),
              new Phaser.Line(wall.x, wall.y + wall.height,
                  wall.x + wall.width, wall.y + wall.height)
          ];

          // Test each of the edges in this wall against the ray.
          // If the ray intersects any of the edges then the wall must be in the way.
          for(var i = 0; i < lines.length; i++) {
              var intersect = Phaser.Line.intersects(ray, lines[i]);
              if (intersect) {
                  // Find the closest intersection
                  var distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                  if (distance < distanceToWall) {
                      distanceToWall = distance;
                      closestIntersection = intersect;
                  }
              }
          }
      }, this);

      return closestIntersection;
    },

    onInputDown: function () {
      this.toggleRays();
    },

    onDown: function(button, value) {
      // gamepad
      switch (button) {
        case Phaser.Gamepad.XBOX360_A:
          this.player1Color = this.playerColorsGREEN;

          //change audio
          if(!this.greenAudio1.isPlaying) this.greenAudio1.play('', Math.random()*this.greenAudio1.totalDuration*1000, 0.5);
          this.redAudio1.fadeOut(500);
          this.blueAudio1.fadeOut(500);
          this.whiteAudio1.fadeOut(500);
          break;
        case Phaser.Gamepad.XBOX360_B:
          this.player1Color = this.playerColorsRED;

          //change audio
          if(!this.redAudio1.isPlaying) this.redAudio1.play('', Math.random()*this.redAudio1.totalDuration*1000, 0.5);
          this.greenAudio1.fadeOut(500);
          this.blueAudio1.fadeOut(500);
          this.whiteAudio1.fadeOut(500);
          break;
        case Phaser.Gamepad.XBOX360_X:
          this.player1Color = this.playerColorsBLUE;

          //change audio
          if(!this.blueAudio1.isPlaying) this.blueAudio1.play('', Math.random()*this.blueAudio1.totalDuration*1000, 0.5);
          this.redAudio1.fadeOut(500);
          this.greenAudio1.fadeOut(500);
          this.whiteAudio1.fadeOut(500);
          break;
        case Phaser.Gamepad.XBOX360_Y:
          this.player1Color = this.playerColorsWHITE;

          //change audio
          if(!this.whiteAudio1.isPlaying) this.whiteAudio1.play('', Math.random()*this.whiteAudio1.totalDuration*1000, 0.5);
          this.redAudio1.fadeOut(500);
          this.blueAudio1.fadeOut(500);
          this.greenAudio1.fadeOut(500);
          break;
        case Phaser.Gamepad.XBOX360_DPAD_LEFT:
          this.leftInput1IsActive = true
          break;
        case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
          this.rightInput1IsActive = true
          break;
        case Phaser.Gamepad.XBOX360_LEFT_TRIGGER:
          this.upInput1IsActive = true
          break;
      }

      // keyboard
      switch (button.keyCode) {
        case Phaser.Keyboard.LEFT:
          this.leftInput2IsActive = true;
          break;
        case Phaser.Keyboard.RIGHT:
          this.rightInput2IsActive = true
          break;
        case Phaser.Keyboard.SPACEBAR:
          this.upInput2IsActive = true
          break;
        case Phaser.Keyboard.A:
          // change color of flashlight
          this.player2Color = this.playerColorsGREEN;

          //change audio
          if(!this.greenAudio2.isPlaying) this.greenAudio2.play('', Math.random()*this.greenAudio2.totalDuration*1000, 0.2);
          this.redAudio2.fadeOut(500);
          this.blueAudio2.fadeOut(500);
          this.whiteAudio2.fadeOut(500);
          break;
        case Phaser.Keyboard.S:
          this.player2Color = this.playerColorsRED;

          //change audio
          if(!this.redAudio2.isPlaying) this.redAudio2.play('', Math.random()*this.redAudio2.totalDuration*1000, 0.2);
          this.greenAudio2.fadeOut(500);
          this.blueAudio2.fadeOut(500);
          this.whiteAudio2.fadeOut(500);
          break;
        case Phaser.Keyboard.D:
          this.player2Color = this.playerColorsBLUE;

          //change audio
          if(!this.blueAudio2.isPlaying) this.blueAudio2.play('', Math.random()*this.blueAudio2.totalDuration*1000, 0.2);
          this.redAudio2.fadeOut(500);
          this.greenAudio2.fadeOut(500);
          this.whiteAudio2.fadeOut(500);
          break;
        case Phaser.Keyboard.F:
          this.player2Color = this.playerColorsWHITE;

          //change audio
          if(!this.whiteAudio2.isPlaying) this.whiteAudio2.play('', Math.random()*this.whiteAudio2.totalDuration*1000, 0.2);
          this.redAudio2.fadeOut(500);
          this.blueAudio2.fadeOut(500);
          this.greenAudio2.fadeOut(500);
          break;
      }
    },
    onUp: function(button) {
      // gamepad
      switch (button) {
        case Phaser.Gamepad.XBOX360_DPAD_LEFT:
          this.leftInput1IsActive = false
          break;
        case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
          this.rightInput1IsActive = false
          break;
        case Phaser.Gamepad.XBOX360_LEFT_TRIGGER:
          this.upInput1IsActive = false
          break;
      }

      // keyboard
      switch (button.keyCode) {
        case Phaser.Keyboard.LEFT:
          this.leftInput2IsActive = false;
          break;
        case Phaser.Keyboard.RIGHT:
          this.rightInput2IsActive = false
          break;
        case Phaser.Keyboard.SPACEBAR:
          this.upInput2IsActive = false
          break;
      }
    },

    onFloat: function() {

    },

    onAxis: function(button, index, value) {
      switch (index) {
        case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
          if (value > 0) {
            this.rightInput1IsActive = true
            this.leftInput1IsActive = false
          } else if (value < 0) {
            this.leftInput1IsActive = true
            this.rightInput1IsActive = false
          } else {
            this.leftInput1IsActive = false
            this.rightInput1IsActive = false
          }
          console.log('left sick x', value);
        break;
        // case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
        //   if (value !== 0) {
        //     this.upi
        //   } else {
        //
        //   }
        //   console.log('left sick y', value);
        //   break;
        // case Phaser.Gamepad.XBOX360_STICK_RIGHT_X:
        //   console.log('righ sick x', value);
        //   this.player1_flashlight.x = ( this.game.scale.width / 2 ) * ( value + 1 )
        //   break;
        // case Phaser.Gamepad.XBOX360_STICK_RIGHT_Y:
        //   console.log('righ sick x', value);
        //   this.player1_flashlight.y = ( this.game.scale.height / 2 ) * ( value + 1 )
        //   break;
        // default:
        //   console.log('THAT SHOULDNT HAPPEN!')
        //   alert('WAT')
      }
    },
  }

  // Setup level
  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Level1 = Level1;

}());
