(function Simulator($) {
  if (typeof window.getComputedStyle === "undefined") {
    return;
  };

  // normalize the size of the grid we're going to fill
  var canvas = $('#canvas')[0],
      cs = getComputedStyle(canvas);

  var CANVAS_WIDTH = parseInt(cs.getPropertyValue('width'), 10),
      CANVAS_HEIGHT = parseInt(cs.getPropertyValue('height'), 10);

  var COLOUR = {
    TREE_ALIVE: 'rgba(0, 92, 42, 1)',
    TREE_DEAD: 'rgba(92, 15, 7, 1)',
    FIRE: 'rgba(248, 53, 42, 1)',
    GRASS: 'rgba(25, 169, 91, 1)'
  }

  var ACTOR_LIST = {};

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // assume 5 pixel squares for grid cells
  var PIXEL_WIDTH = PIXEL_HEIGHT = 10,
      context = canvas.getContext('2d');

  function drawPixel(x, y, actor) {
    // determine the actor, if none given, randomize
    var actor = actor ? actor : Math.random() <= density ? Tree() : Grass();
    ACTOR_LIST[x] = typeof ACTOR_LIST[x] !== 'undefined' ? ACTOR_LIST[x] : {};
    ACTOR_LIST[x][y] = actor;

    context.fillStyle = actor.colour;
    context.fillRect(x, y, PIXEL_WIDTH, PIXEL_HEIGHT);
  }

  var wetness = parseInt($('#tree-wetness').val(), 10);
  var FIRE_INTENSITY = parseInt($('#fire-intensity').val(), 10);

  function Tree() {
    return {
      colour: COLOUR.TREE_ALIVE,
      behaviour: function(x, y) {
        if (this.dead) {
          return;
        };
        var left = x - PIXEL_WIDTH,
            right = x + PIXEL_WIDTH,
            up = y - PIXEL_HEIGHT,
            down = y + PIXEL_HEIGHT;
        if (ACTOR_LIST[left] && ACTOR_LIST[left][y] && ACTOR_LIST[left][y].fire) {
          this.wetness -= FIRE_INTESITY;
        }
        if (ACTOR_LIST[right] && ACTOR_LIST[right][y] && ACTOR_LIST[right][y].fire) {
          this.wetness -= FIRE_INTESITY;
        }
        if (ACTOR_LIST[x] && ACTOR_LIST[x][up] && ACTOR_LIST[x][up].fire) {
          this.wetness -= FIRE_INTESITY;
        }
        if (ACTOR_LIST[x] && ACTOR_LIST[x][down] && ACTOR_LIST[x][down].fire) {
          this.wetness -= FIRE_INTESITY;
        }
        if (ACTOR_LIST[right] && ACTOR_LIST[right][down] && ACTOR_LIST[right][down].fire) {
          this.wetness -= FIRE_INTESITY;
        }
        if (ACTOR_LIST[left] && ACTOR_LIST[left][down] && ACTOR_LIST[left][down].fire) {
          this.wetness -= FIRE_INTESITY;
        }
        if (ACTOR_LIST[right] && ACTOR_LIST[right][up] && ACTOR_LIST[right][up].fire) {
          this.wetness -= FIRE_INTESITY;
        }
        if (ACTOR_LIST[left] && ACTOR_LIST[left][up] && ACTOR_LIST[left][up].fire) {
          this.wetness -= FIRE_INTESITY;
        }
      },
      wetness: wetness,
      tree: true,
      alive: true,
      flammable: function() {
        return this.alive && this.wetness <= 0;
      }
    }
  }

  function Fire() {
    return {
      colour: COLOUR.FIRE,
      behaviour: function(x, y) {
        // lifepoints < 1 => dead tree
        // lifepoint > 1 => neighboring field dry? => fire!
        if (this.lifepoints > 0) {
          var left = x - PIXEL_WIDTH,
              right = x + PIXEL_WIDTH,
              up = y - PIXEL_HEIGHT,
              down = y + PIXEL_HEIGHT;

          function burn(x, y) {
            ACTOR_LIST[x][y] = Fire();
          }

          if (ACTOR_LIST[left] && ACTOR_LIST[left][y] && ACTOR_LIST[left][y].tree && ACTOR_LIST[left][y].flammable()) {
            burn(left, y);
          }
          if (ACTOR_LIST[right] && ACTOR_LIST[right][y] && ACTOR_LIST[right][y].tree && ACTOR_LIST[right][y].flammable()) {
            burn(right, y);
          }
          if (ACTOR_LIST[x] && ACTOR_LIST[x][up] && ACTOR_LIST[x][up].tree && ACTOR_LIST[x][up].flammable()) {
            burn(x, up);
          }
          if (ACTOR_LIST[x] && ACTOR_LIST[x][down] && ACTOR_LIST[x][down].tree && ACTOR_LIST[x][down].flammable()) {
            burn(x, down);
          }
          if (ACTOR_LIST[right] && ACTOR_LIST[right][down] && ACTOR_LIST[right][down].tree && ACTOR_LIST[right][down].flammable()) {
            burn(right, down);
          }
          if (ACTOR_LIST[left] && ACTOR_LIST[left][down] && ACTOR_LIST[left][down].tree && ACTOR_LIST[left][down].flammable()) {
            burn(left, down);
          }
          if (ACTOR_LIST[right] && ACTOR_LIST[right][up] && ACTOR_LIST[right][up].tree && ACTOR_LIST[right][up].flammable()) {
            burn(right, up);
          }
          if (ACTOR_LIST[left] && ACTOR_LIST[left][up] && ACTOR_LIST[left][up].tree && ACTOR_LIST[left][up].flammable()) {
            burn(left, up);
          }
        } else {
          var deadTree = Tree();
          deadTree.alive = false;
          deadTree.colour = COLOUR.TREE_DEAD;
          ACTOR_LIST[x][y] = deadTree;
        }
        this.lifepoints -= 1;

      },
      lifepoints: 3,
      fire: true
    }
  }

  function Grass() {
    return {
      colour: COLOUR.GRASS,
      behaviour: $.noop,
      grass: true
    }
  }

  function drawCanvas() {
    density = parseInt($('#tree-density').val(), 10);
    density = density > 100 ? 100 : density;
    density /= 100;
    wetness = parseInt($('#tree-wetness').val(), 10);
    wetness = wetness > 100 ? 100 : wetness;
    for (var k = 0; k <= CANVAS_HEIGHT; k += PIXEL_HEIGHT) {
      for (var i = 0; i <= CANVAS_WIDTH; i += PIXEL_WIDTH) {
        drawPixel(i, k);
      };
    };
    calculateStatus();
  }

  function setFire(event) {
    var x = event.pageX - $(canvas).offset().left,
        y = event.pageY - $(canvas).offset().top,
        coordX = Math.floor(x / PIXEL_WIDTH) * PIXEL_WIDTH,
        coordY = Math.floor(y / PIXEL_HEIGHT) * PIXEL_HEIGHT;
    var existingActor = ACTOR_LIST[coordX][coordY];

    if (!existingActor.fire) {
      drawPixel(coordX, coordY, Fire());
      calculateStatus();
    }
  }

  var fireCount = 0;
  function calculateStatus() {
    var treeCount = 0,
        aliveCount = 0,
        deadCount = 0;

    fireCount = 0; // reset each time because shared with other functions

    for (var i = 0; i <= CANVAS_WIDTH; i += PIXEL_WIDTH) {
      for (var k = 0; k <= CANVAS_HEIGHT; k += PIXEL_HEIGHT) {
        var actor = ACTOR_LIST[i][k];

        if (actor.grass) {
          continue;
        }

        if (actor.fire) {
          fireCount += 1;
        };

        if (actor.tree && actor.alive) {
          treeCount += 1;
          aliveCount += 1;
        };

        if (actor.tree && !actor.alive) {
          treeCount += 1;
          deadCount += 1;
        };
      };
    };

    $('#trees-totals').text(treeCount);
    $('#trees-burning').text(fireCount);
    $('#trees-alive').text(aliveCount);
    $('#trees-dead').text(deadCount);
  }
  
  var timer = null;
  var MIN_ROUND_LENGTH = 0.25; // tick length in seconds
  function startSimulation() {
    // do stuff
    // do next stuff;
    FIRE_INTESITY = parseInt($('#fire-intensity').val(), 10);
    var computeGrid = function() {
      timer = setTimeout(function doCompute() {
        if (fireCount === 0) {
          clearTimeout(timer);
          pause.trigger('click');
          updateCounter(true); // reset the current counter to 0
          return;
        };
        for (var i = 0; i <= CANVAS_WIDTH; i += PIXEL_WIDTH) {
          for (var k = 0; k <= CANVAS_HEIGHT; k += PIXEL_HEIGHT) {
            ACTOR_LIST[i][k].behaviour(i, k);
          }
        }
        drawCanvasFromActors();
        calculateStatus();
        updateCounter();
        timer = setTimeout(doCompute, MIN_ROUND_LENGTH * 1000);
      }, MIN_ROUND_LENGTH * 1000);
    }
    computeGrid();
  }

  function drawCanvasFromActors() {
    for (var i = 0; i <= CANVAS_WIDTH; i += PIXEL_WIDTH) {
      for (var k = 0; k <= CANVAS_HEIGHT; k += PIXEL_HEIGHT) {
        if (ACTOR_LIST[i][k].grass) {
          continue;
        }
        drawPixel(i, k, ACTOR_LIST[i][k]);
      }
    }
  }

  var currentRound = parseInt($('#current-round').text(), 10);
  function updateCounter(count) {
    if (count === true) {
      currentRound = 0;
    } else {
      currentRound += 1;
    }
    $('#current-round').text(currentRound);
  }

  function stopSimulation() {
    clearTimeout(timer);
  }

  // initially draw the canvas
  drawCanvas();

  // draw the canvas when clicking on regenerate
  $('#regenerate').on('click', drawCanvas);

  // when clicked on the canvas, set fire
  $(canvas).on('click', setFire);

  // when clicking on play, start the simulation
  var play = $('#play'),
      pause = $('#pause');

  play.on('click', function() {
    play.attr('disabled', true);
    pause.removeAttr('disabled');
    $('.user-input').attr('disabled', true);
    startSimulation();
  });

  pause.on('click', function() {
    pause.attr('disabled', true);
    play.removeAttr('disabled');
    $('.user-input').removeAttr('disabled');
    stopSimulation();
  })
}(jQuery));
