let stepSize = 100;
let squareSize = 80;
let colorPalette = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
let maxOffset = 20;
let speed = 0.02;
let seed;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('sketch-holder');
      rectMode(CENTER);
        noStroke();
	  seed = random(1000);
	  }

	  function draw() {
	    background(255);
	      randomSeed(seed); // keep grid static across frames

	        for (let x = stepSize / 2; x < width; x += stepSize) {
		    for (let y = stepSize / 2; y < height; y += stepSize) {
		          push();
			        translate(x, y);

				      // Dynamic offset based on noise and time
				            let time = millis() * speed;
					          let offset = map(noise(x * 0.005, y * 0.005, time), 0, 1, -maxOffset, maxOffset);

						        for (let i = 0; i < 3; i++) {
							        let size = squareSize - i * 20;
								        let col = colorPalette[int(random(colorPalette.length))];

									        fill(col);
										        rect(offset, offset, size, size);
											      }

											            pop();
												        }
													  }
													  }

