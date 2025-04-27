let quaranSketch = (p) => {

  // === All your variables now have to be prefixed with "p." ===
  let time = 0;
  let photoCount = 0;
  let totalPhotos = 4;
  let testFile, finalPhoto;
  let testPhoto;
  let photoFiles = [];
  let photosArray = [];
  let stop = true, check = true, display = false, blur = false;
  let b = 0;

  let palette = [
    '#A8C3A0', '#5A7383', '#E5D8B0', '#D94B4B'
  ];

  p.preload = function() {
    for (let i = 0; i < totalPhotos; i++) {
      photoFiles[i] = p.loadImage('RUN' + i + '.jpeg');
    }
  };

  p.setup = function() {
    let canvas = p.createCanvas(1100, 700, p.WEBGL);
    canvas.parent('quaran_sketch');
    p.background(0);
    p.frameRate(60);

    palette = p.shuffle(palette, true);

    for (let i = 0; i < photoFiles.length; i++) {
      photosArray[i] = new Edits(photoFiles[i], palette[i]);
      photosArray[i].clearing();
      photosArray[i].averaging();
    }
  };

  p.draw = function() {
    if (blur) {
      p.background(0);
    }

    for (let i = 0; i < photosArray.length; i++) {
      photosArray[i].display();
    }
  };

  p.mouseReleased = function() {
    check = true;
  };

  p.keyPressed = function() {
    if (p.key === ' ') {
      blur = !blur;
    }
    if (p.key === 'r' || p.key === 'R') {
      resetSketch();
    }
  };

  function resetSketch() {
    p.background(0);
    time = 0;
    testFile = null;
    for (let edit of photosArray) {
      edit.clearing();
      edit.averaging();
    }
  }

  // --- Class Definition ---
  class Edits {
    constructor(img, assignedColor) {
      this.run = img;
      this.interRun = p.createImage(this.run.width, this.run.height);
      this.scaleFactor = p.random(0.25, 0.8);
      this.xAverage = 0;
      this.yAverage = 0;
      this.randOffsetX = p.random(-2, 2);
      this.randOffsetY = p.random(-2, 2);
      this.randOffsetZ = p.random(-2, 2);
      this.randTint = p.color(assignedColor);
      this.matrix3 = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ];
    }

    display() {
      if (stop) {
        time += 0.001;
      }
      p.push();
      p.translate(0, 0, 0);
      p.rotateX(time * this.randOffsetX);
      p.rotateZ(time * this.randOffsetZ);
      p.rotateY(time * this.randOffsetY);
      p.scale(this.scaleFactor);
      p.tint(this.randTint);
      p.image(this.interRun, -this.xAverage, -this.yAverage);
      p.pop();
    }

    clearing() {
      this.run.loadPixels();
      this.interRun.loadPixels();

      for (let x = 0; x < this.run.width; x++) {
        for (let y = 0; y < this.run.height; y++) {
          let loc = (x + y * this.run.width) * 4;
          let r = this.run.pixels[loc];
          let g = this.run.pixels[loc + 1];
          let b = this.run.pixels[loc + 2];

          let bright = (r + g + b) / 3;

          if (r > 90 && g > 90 && b > 90) {
            this.interRun.pixels[loc] = 255;
            this.interRun.pixels[loc + 1] = 255;
            this.interRun.pixels[loc + 2] = 255;
            this.interRun.pixels[loc + 3] = 255;
          } else if (bright > 100) {
            this.interRun.pixels[loc] = 255;
            this.interRun.pixels[loc + 1] = 255;
            this.interRun.pixels[loc + 2] = 255;
            this.interRun.pixels[loc + 3] = 255;
          } else {
            this.interRun.pixels[loc] = 0;
            this.interRun.pixels[loc + 1] = 0;
            this.interRun.pixels[loc + 2] = 0;
            this.interRun.pixels[loc + 3] = 0;
          }
        }
      }
      this.interRun.updatePixels();
    }

    averaging() {
      let xTotal = 0, yTotal = 0, numberPixels = 0;
      let xCalc = Array(this.run.width).fill(0);
      let yCalc = Array(this.run.height).fill(0);

      this.interRun.loadPixels();
      for (let x = 0; x < this.run.width; x++) {
        for (let y = 0; y < this.run.height; y++) {
          let loc = x + y * this.run.width;
          let bright = p.brightness(this.interRun.pixels[loc]);
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
    }
  }
};

// window.onload = function() {
//   new p5(quaranSketch);
// };