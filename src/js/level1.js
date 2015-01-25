(function() {
  'use strict';

  function Level1() {
    this.player = null;
  }

  Level1.prototype = {

    create: function() {
      // Set stage background color
      this.game.stage.backgroundColor = 0x010101;

      // Add the light
      this.lightGroup = this.game.add.group();

      this.Player1Light = this.game.add.sprite(this.game.width/2, this.game.height/2, 'light');
      this.Player1Light.anchor.setTo(0.5, 0.5);
      this.Player1Light.blendMode = Phaser.blendModes.ADD;

      this.Player2Light = this.game.add.sprite(50, this.game.height - 50, 'light');
      this.Player2Light.anchor.setTo(0.5, 0.5);
      this.Player2Light.blendMode = Phaser.blendModes.ADD;

      this.lightGroup.add(this.Player1Light);
      this.lightGroup.add(this.Player2Light);

      // Create a bitmap texture for drawing light cones
      this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
      this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
      this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
      var lightBitmap = this.game.add.image(0, 0, this.bitmap);

      // This bitmap is drawn onto the screen using the MULTIPLY blend mode.
      // Since this bitmap is over the background, dark areas of the bitmap
      // will make the background darker. White areas of the bitmap will allow
      // the normal colors of the background to show through. Blend modes are
      // only supported in WebGL. If your browser doesn't support WebGL then
      // you'll see gray shadows and white light instead of colors and it
      // generally won't look nearly as cool. So use a browser with WebGL.
      lightBitmap.blendMode = Phaser.blendModes.ADD;

      // Create a bitmap for drawing rays
      this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
      this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
      this.rayBitmapImage.visible = false;

      // Setup function for hiding or showing rays
      this.game.input.onTap.add(this.toggleRays, this);

      // Build some walls. These will block line of sight.
      var NUMBER_OF_WALLS = 4;
      this.walls = this.game.add.group();
      var i, x, y;
      for(i = 0; i < NUMBER_OF_WALLS; i++) {
          x = i * this.game.width/NUMBER_OF_WALLS + 50;
          y = this.game.rnd.integerInRange(50, this.game.height - 200);
          this.game.add.image(x, y, 'block', 0, this.walls).scale.setTo(3, 3);
      }

      // Simulate a pointer click/tap input at the center of the stage
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
      // Move the light to the pointer/touch location
      this.Player1Light.x = this.game.input.activePointer.x;
      this.Player1Light.y = this.game.input.activePointer.y;

      // Next, fill the entire light bitmap with a dark shadow color.
      this.bitmap.context.fillStyle = 'rgba(0, 0, 0, 1)';
      this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);
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
      this.lightFunc(light2, 'rgba(0, 255, 0, .5)', stageCorners);

      var light1 = this.Player1Light;
      this.lightFunc(light1, 'rgba(255, 0, 0, .5)', stageCorners);


      // This just tells the engine it should update the texture cache
      this.bitmap.dirty = true;
      this.rayBitmap.dirty = true;
    },

    lightFunc: function(light, rgbaColor, stageCorners) {
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
              var corners = [
                  new Phaser.Point(wall.x+0.1, wall.y+0.1),
                  new Phaser.Point(wall.x-0.1, wall.y-0.1),

                  new Phaser.Point(wall.x-0.1 + wall.width, wall.y+0.1),
                  new Phaser.Point(wall.x+0.1 + wall.width, wall.y-0.1),

                  new Phaser.Point(wall.x-0.1 + wall.width, wall.y-0.1 + wall.height),
                  new Phaser.Point(wall.x+0.1 + wall.width, wall.y+0.1 + wall.height),

                  new Phaser.Point(wall.x+0.1, wall.y-0.1 + wall.height),
                  new Phaser.Point(wall.x-0.1, wall.y+0.1 + wall.height)
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
          this.bitmap.context.beginPath();
          this.bitmap.context.fillStyle = rgbaColor;
          this.bitmap.context.moveTo(points[0].x, points[0].y);
          for(var j = 0; j < points.length; j++) {
              this.bitmap.context.lineTo(points[j].x, points[j].y);
          }
          this.bitmap.context.closePath();
          this.bitmap.context.fill();

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
    }
  }

  // Setup level
  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Level1 = Level1;

}());
