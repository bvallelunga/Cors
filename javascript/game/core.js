$(function() {
  // Gobal Variables
  window.SPEED = 10
  window.DIFFICULTY = 2
  window.ROCK_TIME = 110
  window.SUB_ROCK_COUNT = 4

  window.KEYCODE_SPACE = 32
  window.KEYCODE_UP = 38
  window.KEYCODE_LEFT = 37
  window.KEYCODE_RIGHT = 39
  window.KEYCODE_DOWN = 36

  window.GOLEFT = false
  window.GORIGHT = false

  window.WIDTH = $(window).width()
  window.HEIGHT = $(window).height()

  window.canvas = $("#canvas").width(WIDTH).height(HEIGHT)[0]
  window.context = canvas.getContext("2d")

  window.stage = new createjs.Stage(canvas)
  window.ship = new createjs.Bitmap("images/ship.png")

  // Configure Canvas
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	// Configure Ship
	ship.image.onload = function() {
    ship.regX = -WIDTH/2 + ship.image.width/2
  	ship.regY = -HEIGHT + ship.image.height*2
  	stage.addChild(ship)
  }

  // Create GamePlay
  createLanding()
  createBackground()
  registerEvents()
})

function registerEvents() {
  $(document).keydown(keyDown);
  $(document).keyup(keyUp);
  $("#starter #play").click(startGame);
  createjs.Ticker.addEventListener("tick", tick);
}

function startGame() {
  $("#starter").fadeOut(500)

  setTimeout(function() {
    $("#game").show();
    createGame();
  }, 550)
}

function createGame() {
  ship.regX = -WIDTH/2 + ship.image.width/2
  ship.regY = -HEIGHT + ship.image.height*2
  stage.update()
}

function tick(event) {
  if(GOLEFT) ship.x -= SPEED;
  if(GORIGHT) ship.x += SPEED;
  stage.update(event)
}

function keyDown(event) {
  switch(event.keyCode) {
    case KEYCODE_LEFT:
      GOLEFT = true
      break;

    case KEYCODE_RIGHT:
      GORIGHT = true
      break;
  }
}

function keyUp(event) {
  switch(event.keyCode) {
    case KEYCODE_LEFT:
      GOLEFT = false
      break;

    case KEYCODE_RIGHT:
      GORIGHT = false
      break;
  }
}
