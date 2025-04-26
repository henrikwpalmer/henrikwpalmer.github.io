let time = 0, turn = 0, speed = 0.001, shrink = 0.2, send = 0.2, send1 = 0.2;
let boom = 1;
let zoom = 1.7;
let time1 = 0;
let go = false, expand = false, contract = false, kaboom = false, flaps = false;

// coordinates from original .pde sketch
let verts = {
  x1: 0, y1: -258,
  x2: -157.6, y2: -213.3,
  x3: 50, y3: -99.5,
  x4: 213, y4: -152.5,
  x5: -54, y5: 112.5,
  x6: -210, y6: 168.5,
  x7: 0, y7: 257.5,
  x8: 158, y8: 211.5,
  x9: -210, y9: -103,
  x10: -54, y10: -153,
  x11: 50, y11: 161,
  x12: 213, y12: 112.5,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(RADIANS);
}

function draw() {
  background('#002B7C');
  frameRate(150);
  time += 0.1;
  if (flaps) time1 += 1;
  boom = zoom;

  if (go) turn += speed;
  if (expand) boom += speed;
  if (contract) boom -= speed;
  if (kaboom) {
    send1 -= time1;
    send += time1;
  }

  stroke('#C3DEEF');
  noFill();

  push();
  translate(mouseX, mouseY);
  scale(zoom);
  translate(-mouseX, -mouseY);

  translate(width / 2, height / 2);
  rotate(turn);
  translate(-width / 2, -height / 2);

  for (let l = -500; l < 1500; l += 74 * boom) {
    for (let i = -500; i < 2400; i += 100 * boom) {
      push();
      strokeWeight(2);
      translate(i, l);
      rotate(-radians(time));
      fill('#BF7919AA');

      if (flaps) {
        verts.x11 = 120 * cos((-time1 / 50) + HALF_PI) + 50;
        verts.y11 = 260.5 * sin((-time1 / 50) + HALF_PI) - 99.5;
        verts.x12 = 120 * cos((-time1 / 50) + HALF_PI) + 213;
        verts.y12 = 260.5 * sin((-time1 / 50) + HALF_PI) - 152.5;
        verts.x9 = 120 * cos((-time1 / 50) - HALF_PI) - 210;
        verts.y9 = 260.5 * sin((-time1 / 50) - HALF_PI) + 160.5;
        verts.x10 = 120 * cos((-time1 / 50) - HALF_PI) - 54;
        verts.y10 = 260.5 * sin((-time1 / 50) - HALF_PI) + 112.5;
      }

      // side boxes
      quad(
        shrink * verts.x6, send * verts.y6,
        shrink * verts.x5, send * verts.y5,
        shrink * verts.x10, send1 * verts.y10,
        shrink * verts.x9, send1 * verts.y9
      );
      quad(
        shrink * verts.x3, send1 * verts.y3,
        shrink * verts.x4, send1 * verts.y4,
        shrink * verts.x12, send * verts.y12,
        shrink * verts.x11, send * verts.y11
      );

      // prism
      fill('#004C3CCC');
      quad(
        shrink * verts.x1, send1 * verts.y1,
        shrink * verts.x2, send1 * verts.y2,
        shrink * verts.x3, send1 * verts.y3,
        shrink * verts.x4, send1 * verts.y4
      );
      quad(
        shrink * verts.x5, send * verts.y5,
        shrink * verts.x6, send * verts.y6,
        shrink * verts.x7, send * verts.y7,
        shrink * verts.x8, send * verts.y8
      );

      strokeWeight(2);
      line(shrink * verts.x1, send1 * verts.y1, shrink * verts.x5, send * verts.y5);
      line(shrink * verts.x2, send1 * verts.y2, shrink * verts.x6, send * verts.y6);
      line(shrink * verts.x3, send1 * verts.y3, shrink * verts.x7, send * verts.y7);
      line(shrink * verts.x4, send1 * verts.y4, shrink * verts.x8, send * verts.y8);

      pop();
    }
  }

  pop();
}

function mouseWheel(event) {
  zoom *= 1.0 - (event.delta * 0.001);
  zoom = constrain(zoom, 1, 5.0);
}

function keyPressed() {
  if (key === 's') go = !go;
  if (key === 'e') expand = !expand;
  if (key === 'c') contract = !contract;
  if (key === 'x') {
    kaboom = !kaboom;
    time1 = 0;
  }
  if (key === 'f') {
    flaps = !flaps;
    // time1 = 0;
  }
}
