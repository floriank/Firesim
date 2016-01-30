(function Simulator($) {
  if (typeof window.getComputedStyle === "undefined") {
    return;
  };

  // normalize the size of the grid we're going to fill
  var canvas = $('#canvas')[0],
      cs = getComputedStyle(canvas);

  var CANVAS_WIDTH = parseInt(cs.getPropertyValue('width'), 10),
      CANVAS_HEIGHT = parseInt(cs.getPropertyValue('height'), 10);

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // assume 5 pixel squares for grid cells
  var PIXEL_WIDTH = PIXEL_HEIGHT = 5,
      context = canvas.getContext('2d');

  function randomValue() {
    return Math.floor(Math.random() * (255 + 1));
  }

  function randomColor() {
    return 'rgba(' + randomValue() + ',' + randomValue() + ',' + randomValue() + ',1)';
  }

  function drawPixel(x, y) {
    context.fillStyle = randomColor();
    context.fillRect(x, y, PIXEL_WIDTH, PIXEL_HEIGHT);
  }

  for (var i = 0; i <= CANVAS_WIDTH; i += PIXEL_WIDTH) {
    for (var k = 0; k < CANVAS_HEIGHT; k += PIXEL_HEIGHT) {
      drawPixel(i, k);
    };
  };

}(jQuery));
