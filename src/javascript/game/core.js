$(function() {
  // Gobal Variables
  window.SPEED = 30
  window.DIFFICULTY = 10
  window.ROCK_TIME = 110
  window.ROCK_COUNT = 10
  window.ROCK_BELT = []
  window.ACTIVE = false
  window.DRILLING = false

  window.KEYCODE_ENTER = 13
  window.KEYCODE_SPACE = 32
  window.KEYCODE_UP = 38
  window.KEYCODE_LEFT = 37
  window.KEYCODE_RIGHT = 39
  window.KEYCODE_DOWN = 36

  window.GO_LEFT = false
  window.GO_RIGHT = false
  window.GO_SPACE = false

  window.WIDTH = $(window).width()
  window.HEIGHT = $(window).height()

  window.canvas = $("#game #canvas").width(WIDTH).height(HEIGHT)
  window.context = canvas[0].getContext("2d")

  window.stage = new createjs.Stage(canvas[0])
  window.ship = new createjs.Bitmap("images/ship.png")
  window.game = $("#game")
  window.starter = $("#starter")
  window.starterScores = $("#starter #highscores")
  window.starterPlay = $("#starter #play")
  window.energyBox = $("#game #energy-bar")
  window.energyBar = $("#game #energy-bar #bar")
  window.energy = 100
  window.score = 0
  window.scoreBox = $("#game #score span")
  window.time = 0
  window.drill = 100
  window.drillBox = $("#game #drilling")
  window.drillBar = $("#game #drilling #drill")
  window.drillRock = null

  // Configure Canvas
	canvas[0].width = WIDTH;
	canvas[0].height = HEIGHT;

	// Configure Ship
	ship.image.onload = function() {
  	stage.addChildAt(ship, 0)
  }

  // Create GamePlay
  createLayout()
  createBackground()
  registerEvents()
})

function registerEvents() {
  $(window).resize(resize)
  $(document).keydown(keyDown)
  $(document).keyup(keyUp)
  starterPlay.click(startGame)
  createjs.Ticker.addEventListener("tick", tick)
}

function resize() {
  WIDTH = $(window).width()
  HEIGHT = $(window).height()
  canvas = canvas.width(WIDTH).height(HEIGHT)
  canvas[0].width = WIDTH
	canvas[0].height = HEIGHT
  ship.y = HEIGHT - ship.image.height*1.5
}

function startGame() {
  starter.fadeOut(500)
  drillBox.hide()
  canvas.show()

  setTimeout(function() {
    game.show()
    createGame()
    ACTIVE = true
    DRILLING = false
  }, 550)
}

function startDrilling(rock) {
  canvas.fadeOut(250)

  setTimeout(function() {
    drill = 100
    drillRock = rock
    DRILLING = true
    drillBox
      .fadeIn(250)
      .hAlign()
      .vAlign()
      .find("#space")
      .vAlign()
  }, 250)
}

function stopDrilling() {
  drillRock.drilled = true
  drillBox.fadeOut(250)

  setTimeout(function() {
    DRILLING = false
    canvas.fadeIn(250)
  }, 250)
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
  name = prompt("Game Over!, Enter your name for high scores...")

  game.fadeOut(500)
  starterScores.show().append("                                         \
    <div class='score'>                                                 \
      <div class='name'>" + name + "</div>                              \
      <div class='cors'>" + score + "</div>                             \
    </div>                                                              \
  ")

  setTimeout(function() {
    starter.fadeIn(500)
  }, 550)

  ROCK_BELT.forEach(function(rock) {
    stage.removeChild(rock)
  })

  ROCK_BELT = []
}

function tick(event) {
  if(ACTIVE) {
    if(DRILLING) {
      // Check if to stop drilling
      if(GO_SPACE) return stopDrilling()

      // Update Drill
      drillBox.removeClass("mid low depleted")

      if(drill % 5 == 0) {
        newEnergy = energy + Math.ceil((100 - drill)/100) + 2
        energy = Math.min(newEnergy, 100)
        score += Math.ceil((100 - drill)/100) + 1
      }

      if(drill < 0) {
      	return endGame()
    	} else if(drill < 10) {
        drillBox.addClass("depleted")
    	} else if(drill < 20) {
    	  drillBox.addClass("low")
    	} else if(drill < 60) {
        drillBox.addClass("mid")
    	}

      // Decrease Drill
      drill -= DIFFICULTY * (0.4 + ((Asteriod.MAX_VALUE - drillRock.size)/200))
      drillBar.height(drill + "%")
    } else {
      // Move Ship
      if(GO_LEFT && ship.x - 20 > 0) ship.x -= SPEED
      if(GO_RIGHT && ship.x + ship.image.width + 20 < WIDTH) ship.x += SPEED

      // Move Rocks
      var hitX = ship.image.width/2
      var hitY = ship.image.height/2
      var centerX = ship.x + hitX
      var centerY = ship.y + hitY

      for(i = 0; i < ROCK_BELT.length; i++) {
    		ROCK_BELT[i].y += Math.floor(SPEED / 2)
    		ROCK_BELT[i].rotation += ROCK_BELT[i].spin

        // Remove Old Rocks
    		if(ROCK_BELT[i].y - ROCK_BELT[i].size > HEIGHT) {
      		stage.removeChild(ROCK_BELT[i]);
      		ROCK_BELT.splice(i, 1)
    		}

    		// Check For Collision
    		if(ROCK_BELT[i]) {
      		if(!ROCK_BELT[i].drilled && ROCK_BELT[i].hitRadius(centerX, centerY, hitX, hitY)) {
      		  return startDrilling(ROCK_BELT[i])
    		  }
    		}
    	}

    	// Create New Rocks
    	for(i = 0; i < ROCK_COUNT - ROCK_BELT.length; i++) {
      	var sizes = [Asteriod.SML_ROCK, Asteriod.MED_ROCK]
      	var rock = new Asteriod(sizes[Math.floor(Math.random() * sizes.length)])

      	ROCK_BELT.push(rock)
      	stage.addChildAt(rock, i);
    	}
    }

  	// Decrease Energy
  	energy -= DIFFICULTY * 0.04
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
  	if(time % 50 == 0) score++
  	scoreBox.text(score)

    // Update Stage
    stage.update(event)
  } else {
    if(GO_SPACE) return startGame()
  }
}

function keyDown(event) {
  switch(event.keyCode) {
    case KEYCODE_ENTER:
    case KEYCODE_SPACE:
      GO_SPACE = true
      break

    case KEYCODE_LEFT:
      GO_LEFT = true
      break

    case KEYCODE_RIGHT:
      GO_RIGHT = true
      break
  }
}

function keyUp(event) {
  switch(event.keyCode) {
    case KEYCODE_ENTER:
    case KEYCODE_SPACE:
      GO_SPACE = false
      break

    case KEYCODE_LEFT:
      GO_LEFT = false
      break

    case KEYCODE_RIGHT:
      GO_RIGHT = false
      break
  }
}
