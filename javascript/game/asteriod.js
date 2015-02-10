(function (window) {

	function Asteriod(size) {
		this.Shape_constructor(); // super call

		this.activate(size);
	}

	var p = createjs.extend(Asteriod, createjs.Shape);

// static properties:
	Asteriod.MED_ROCK = 30;
	Asteriod.SML_ROCK = 10;

// public properties:

	p.bounds;	//visual radial size
	p.hit;		//average radial disparity
	p.size;		//size value itself
	p.spin;		//spin ammount
	p.score;	//score value

	p.vX;		//velocity X
	p.vY;		//velocity Y


// public methods:

	//handle drawing a spaceRock
	p.getShape = function (size) {
		var angle = 0;
		var radius = size;

		this.size = size;
		this.hit = size;
		this.bounds = 0;

		//setup
		this.graphics.clear();
		this.graphics.beginStroke("#FFFFFF");
		this.graphics.beginFill('rgba(255, 255, 255, 0.2)');
		this.graphics.moveTo(0, size);

		//draw spaceRock
		while (angle < (Math.PI * 2 - .5)) {
			angle += .25 + (Math.random() * 100) / 500;
			radius = size + (size / 2 * Math.random());
			this.graphics.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);

			//track visual depiction for interaction
			if (radius > this.bounds) {
				this.bounds = radius;
			}	//furthest point

			this.hit = (this.hit + radius) / 2;					//running average
		}

		this.graphics.closePath(); // draw the last line segment back to the start point.
		this.hit *= 1.1; //pad a bit
	}

	//handle reinit for poolings sake
	p.activate = function (size) {
		this.getShape(size);

		//pick a random direction to move in and base the rotation off of speed
		var angle = Math.random() * (Math.PI * 2);
		this.x = Math.floor(Math.random() * WIDTH)
		this.y = -Math.floor(Math.random() * HEIGHT * 2.5) - size;
		this.spin = (Math.random() + 0.2 ) * Math.sin(angle) * (5 - size / 15);

		//associate score with size
		this.score = (5 - size / 10) * 100;
	}

	p.hitPoint = function (tX, tY) {
		return this.hitRadius(tX, tY, 0);
	}

	p.hitRadius = function (tX, tY, tHit) {
		//early returns speed it up
		if (tX - tHit > this.x + this.hit) {
			return;
		}
		if (tX + tHit < this.x - this.hit) {
			return;
		}

		if (tY - tHit > this.y + this.hit) {
			return;
		}

		if (tY + tHit < this.y - this.hit) {
			return;
		}

		//now do the circle distance test
		return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2));
	}


	window.Asteriod = createjs.promote(Asteriod, "Shape");

}(window));
