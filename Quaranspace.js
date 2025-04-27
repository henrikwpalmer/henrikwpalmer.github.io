let time = 0;
let photoCount = 0;
let totalPhotos = 4;
let testFile, finalPhoto;
let testPhoto;
let photoFiles = [];
let photosArray = [];
let stop = true, check = true, display = false, blur = false;
let b = 0;

function preload() {
  for (let i = 0; i < totalPhotos; i++) {
    photoFiles[i] = loadImage('RUN' + i + '.jpeg'); // Make sure you have RUN0.jpeg, RUN1.jpeg, etc.
  }
}

function setup() {
  let canvas = createCanvas(1100, 700, WEBGL);
  canvas.parent('sketch-holder');
  background(0);
  frameRate(60);

  for (let i = 0; i < photoFiles.length; i++) {
    photosArray[i] = new Edits(photoFiles[i]);
    photosArray[i].clearing();
    photosArray[i].averaging();
  }

  // (Optional) setup file drop
  // let canvas = document.getElementById('defaultCanvas0');
  // canvas.addEventListener('drop', gotFile);
}

function draw() {
  if (blur) {
    background(0);
  }

  if (testFile != null && check) {
    // You can add processing logic here if you want to handle new files
  }

  for (let i = 0; i < photosArray.length; i++) {
    photosArray[i].display();
  }
}

function mouseReleased() {
  check = true;
}

function keyPressed() {
  if (key === ' ') {
    blur = !blur;
  }
  if (key === 'r' || key === 'R') {
    resetSketch();
  }
}

function resetSketch() {
  background(0);
  time = 0;
  testFile = null;
  for (let edit of photosArray) {
    edit.clearing();
    edit.averaging();
  }
  console.log('Sketch reset.');
}

function gotFile(e) {
  e.preventDefault();
  let file = e.dataTransfer.files[0];
  if (file.type.startsWith('image')) {
    let reader = new FileReader();
    reader.onload = function(event) {
      loadImage(event.target.result, img => {
        testFile = img;
        check = true;
      });
    };
    reader.readAsDataURL(file);
  }
}

// --- Class Definition ---
class Edits {
  constructor(img) {
    this.run = img;
    this.interRun = createImage(this.run.width, this.run.height);
    this.scaleFactor = random(0.25, 0.8);
    this.xAverage = 0;
    this.yAverage = 0;
    this.randOffsetX = random(-2, 2);
    this.randOffsetY = random(-2, 2);
    this.randOffsetZ = random(-2, 2);
    this.randTint = this.pickTint(this.randOffsetX);
    this.matrix3 = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ];
  }

  pickTint(offsetX) {
    if (offsetX <= -0.75) {
      return lerpColor(color('#71B35B'), color('#ABFF8F'), abs(offsetX) / 2);
    } else if (offsetX > -0.75 && offsetX <= 0.75) {
      return lerpColor(color('#D09BFF'), color('#BB66FF'), abs(offsetX) / 2);
    } else {
      return lerpColor(color('#FFE673'), color('#B3A259'), abs(offsetX) / 2);
    }
  }

  display() {
    if (stop) {
      time += 0.0008;
    }
    push();
    translate(0, 0, 0);
    rotateX(time * this.randOffsetX);
    rotateZ(time * this.randOffsetZ);
    rotateY(time * this.randOffsetY);
    scale(this.scaleFactor);
    tint(this.randTint);
    image(this.interRun, -this.xAverage, -this.yAverage);
    pop();
  }

  clearing() {
    this.run.loadPixels();
    this.interRun.loadPixels();
    for (let x = 0; x < this.run.width; x++) {
      for (let y = 0; y < this.run.height; y++) {
        let loc = x + y * this.run.width;
        this.clearingBackground(loc);
      }
    }
    this.interRun.updatePixels();
  }

  clearingBackground(loc) {
    let r = red(this.run.pixels[loc]);
    let g = green(this.run.pixels[loc]);
    let b = blue(this.run.pixels[loc]);
    let bright = brightness(this.run.pixels[loc]);

    if (r > 90 && g > 90 && b > 90) {
      this.interRun.pixels[loc] = color(255);
    } else if (bright > 100) {
      this.interRun.pixels[loc] = color(255);
    } else {
      this.interRun.pixels[loc] = color(0, 0, 0, 0);
    }
  }

  averaging() {
    let xTotal = 0, yTotal = 0, numberPixels = 0;
    let xCalc = Array(this.run.width).fill(0);
    let yCalc = Array(this.run.height).fill(0);

    this.interRun.loadPixels();
    for (let x = 0; x < this.run.width; x++) {
      for (let y = 0; y < this.run.height; y++) {
        let loc = x + y * this.run.width;
        let bright = brightness(this.interRun.pixels[loc]);
        if (bright > 10) {
          xCalc[x]++;
          yCalc[y]++;
          numberPixels++;
        }
      }
    }

    for (let i = 0; i < this.run.width; i++) {
      xTotal += (i + 1) * xCalc[i];
    }
    for (let i = 0; i < this.run.height; i++) {
      yTotal += (i + 1) * yCalc[i];
    }

    this.xAverage = xTotal / numberPixels;
    this.yAverage = yTotal / numberPixels;
    console.log('averaged', this.xAverage, this.yAverage);
  }
}
