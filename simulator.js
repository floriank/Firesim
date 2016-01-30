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
  var PIXEL_WIDTH = PIXEL_HEIGHT = 5,
      context = canvas.getContext('2d');

  function drawPixel(x, y, actor) {
    // determine the actor, if none given, randomize
    var actor = typeof actor === 'function' ? actor() : Math.random() <= density ? Tree() : Grass();
    ACTOR_LIST[x] = typeof ACTOR_LIST[x] !== 'undefined' ? ACTOR_LIST[x] : {}
    ACTOR_LIST[x][y] = actor;
    context.fillStyle = actor.colour;
    context.fillRect(x, y, PIXEL_WIDTH, PIXEL_HEIGHT);
  }

  var wetness = parseInt($('#tree-wetness').val(), 10);
  function Tree() {
    return {
      colour: COLOUR.TREE_ALIVE,
      behaviour: function() {},
      wetness: wetness,
      tree: true,
      alive: true
    }
  }

  function Fire() {
    return {
      colour: COLOUR.FIRE,
      behaviour: function() {},
      lifepoints: 3,
      fire: true
    }
  }

  function Grass() {
    return {
      colour: COLOUR.GRASS,
      behaviour: function() {},
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
      drawPixel(coordX, coordY, Fire);
      calculateStatus();
    }
  }

  function calculateStatus() {
    var treeCount = 0,
        fireCount = 0,
        aliveCount = 0,
        deadCount = 0;

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
  });

  pause.on('click', function() {
    pause.attr('disabled', true);
    play.removeAttr('disabled');
  })
}(jQuery));
