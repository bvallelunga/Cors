$(function() {
  // Gobal Variables
  window.SPEED = 10
  window.DIFFICULTY = 5
  window.ROCK_TIME = 110
  window.ROCK_COUNT = 50
  window.ROCK_BELT = []
  window.ACTIVE = false

  window.KEYCODE_SPACE = 32
  window.KEYCODE_UP = 38
  window.KEYCODE_LEFT = 37
  window.KEYCODE_RIGHT = 39
  window.KEYCODE_DOWN = 36

  window.GO_LEFT = false
  window.GO_RIGHT = false

  window.WIDTH = $(window).width()
  window.HEIGHT = $(window).height()

  window.canvas = $("#canvas").width(WIDTH).height(HEIGHT)[0]
  window.context = canvas.getContext("2d")

  window.stage = new createjs.Stage(canvas)
  window.ship = new createjs.Bitmap("images/ship.png")
  window.energyBox = $("#energy-bar")
  window.energyBar = $("#energy-bar #bar")
  window.energy = 100
  window.score = 0
  window.scoreBox = $("#score span")
  window.time = 0

  // Configure Canvas
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	// Configure Ship
	ship.image.onload = function() {
  	stage.addChild(ship)
  }

  // Create GamePlay
  createLanding()
  createBackground()
  registerEvents()
})

function registerEvents() {
  $(window).resize(resize)
  $(document).keydown(keyDown)
  $(document).keyup(keyUp)
  $("#starter #play").click(startGame)
  createjs.Ticker.addEventListener("tick", tick)
}

function resize() {
  WIDTH = $(window).width()
  HEIGHT = $(window).height()
  canvas = $("#canvas").width(WIDTH).height(HEIGHT)[0]
  canvas.width = WIDTH
	canvas.height = HEIGHT
  ship.y = HEIGHT - ship.image.height*1.5
}

function startGame() {
  $("#starter").fadeOut(500)

  setTimeout(function() {
    $("#game").show();
    createGame();
    ACTIVE = true
  }, 550)
}

function createGame() {
  score = 0
  time = 0
  energy = 100
  ship.x = WIDTH/2 - ship.image.width/2
  ship.y = HEIGHT - ship.image.height*1.5
  stage.update()
}

function endGame() {
  ACTIVE = false

  $("#game").fadeOut(500)

  setTimeout(function() {
    $("#starter").fadeIn(500)
  }, 550)

  ROCK_BELT.forEach(function(rock) {
    stage.removeChild(rock)
  })

  ROCK_BELT = []
}

function tick(event) {
  if(ACTIVE) {
    // Move Ship
    if(GO_LEFT && ship.x - 20 > 0) ship.x -= SPEED
    if(GO_RIGHT && ship.x + ship.image.width + 20 < WIDTH) ship.x += SPEED

    // Move Rocks
    var hit = Math.max(ship.image.width, ship.image.height)
    for(i = 0; i < ROCK_BELT.length; i++) {
  		ROCK_BELT[i].y += Math.floor(SPEED / 2)
  		ROCK_BELT[i].rotation += ROCK_BELT[i].spin

      // Remove Old Rocks
  		if(ROCK_BELT[i].y - ROCK_BELT[i].size > HEIGHT) {
    		stage.removeChild(ROCK_BELT[i]);
    		ROCK_BELT.splice(i, 1)
  		}

  		// Check For Collision
  		if(ROCK_BELT[i].hitRadius(ship.x, ship.y, 0)) {
  		  return endGame()
		  }
  	}

  	// Create New Rocks
  	for(i = 0; i < ROCK_COUNT - ROCK_BELT.length; i++) {
    	var sizes = [Asteriod.SML_ROCK, Asteriod.MED_ROCK]
    	var rock = new Asteriod(sizes[Math.floor(Math.random() * sizes.length)])

    	ROCK_BELT.push(rock)
    	stage.addChild(rock)
  	}

  	// Decrease Energy
  	energy -= DIFFICULTY * 0.02
  	energyBar.width(energy + "%")
  	energyBox.removeClass("mid low")

  	if(energy < 0) {
    	return endGame()
    	energyBox.addClass("low")
  	} else if(energy < 20) {
      energyBox.addClass("low")
  	} else if(energy < 60) {
      energyBox.addClass("mid")
  	}

  	// Increase Time
  	time++

  	// Update Score
  	if(time % 50 == 0) {
    	score++
  	}

  	scoreBox.text(score)

    // Update Stage
    stage.update(event)
  }
}

function keyDown(event) {
  switch(event.keyCode) {
    case KEYCODE_LEFT:
      GO_LEFT = true
      break;

    case KEYCODE_RIGHT:
      GO_RIGHT = true
      break;
  }
}

function keyUp(event) {
  switch(event.keyCode) {
    case KEYCODE_LEFT:
      GO_LEFT = false
      break;

    case KEYCODE_RIGHT:
      GO_RIGHT = false
      break;
  }
}
