function createLayout() {
  $("#loading, #starter, #game #drilling").hAlign().vAlign()
  $("#game #drilling #space").vAlign()

  $("#loading").fadeIn(500)

  setTimeout(function() {
    $("#loading").fadeOut(500)

    setTimeout(function() {
      $("#starter").fadeIn(500)
    }, 600)
  }, 1500)
}

function createBackground() {
	createjs.CSSPlugin.install(createjs.Tween)

	createjs.Ticker.setFPS(20)
	var count = 600
  var container = $("#background").fadeIn(500)[0]

	while (--count >= 0) {
    var box = document.createElement("div")
		box.style.width = "6px"
		box.style.height = "2px"
		box.style.position = "absolute"
		box.style.borderRadius = "50%"
		box.style.backgroundColor = "#0F0"
		container.appendChild(box)
		var a = (Math.random() * Math.PI * 2 * 16 | 0) / 16
		box.style.webkitTransform = "rotate(" + a + "rad)"
		var d = 30
		box.style.left = window.innerWidth / 2 + Math.cos(a - 0.2 - Math.random()) * d + "px"
		box.style.top = window.innerHeight / 2 + Math.sin(a - 0.2 - Math.random()) * d + "px"
		d = (window.innerWidth - 16) / 2 * (Math.random() * 0.3 + 0.7)
		var x = window.innerWidth / 2 + Math.cos(a) * d
		var y = window.innerHeight / 2 + Math.sin(a) * d
		createjs.Tween.get(box, {
  		loop: true
    }, true)
      .set({
        opacity: "0"
      }, box.style)
      .wait(Math.random() * 1000 + 1 | 0)
      .call(updateColor)
      .to({
        top: y,
        left: x,
        width: 16,
        height: 4,
        opacity: 1
      }, Math.random() * 1500 + 1000, easeIn)
	}

	// tween the base color that divs will be assigned when they start moving:
	createjs.Tween.get(this, {
  	loop: true
  }).to({
    colorSeed: 360
  }, 5000)
}

function updateColor(tween) {
	// grab the tween's target (the style object), and update it's color
	tween._target.style.backgroundColor = "hsl(" + (Math.random() * 60 | 0) + ",100%,50%)"
}

// very simple easing equation:
function easeIn(ratio) {
	return ratio * ratio
}
