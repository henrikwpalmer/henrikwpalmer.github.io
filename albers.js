let albersSketch = (p) => {

  let time = 0, turn = 0, speed = 0.001, shrink = 0.2, send = 0.2, send1 = 0.2;
  let boom = 1;
  let zoom = 3;
  let time1 = 0;
  let go = true, expand = false, contract = false, kaboom = false, flaps = true;

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

  p.setup = function() {
    let canvas = p.createCanvas(250, p.windowHeight);
    canvas.parent(p._userNode);
    p.rectMode(p.CENTER);
    p.angleMode(p.RADIANS);
  };

  p.windowResized = function() {
    p.resizeCanvas(250, p.windowHeight);
  };
  
  p.draw = function() {
    p.background('#002B7C');
    p.frameRate(150);
    time += 0.2;
    if (flaps) time1 += 0.5;
    boom = zoom;

    if (go) turn += speed;
    if (expand) boom += speed;
    if (contract) boom -= speed;
    if (kaboom) {
      send1 -= time1;
      send += time1;
    }

    p.stroke('#C3DEEF');
    p.noFill();

    // p.push();
    // p.translate(p.mouseX, p.mouseY);
    p.scale(zoom);
    // p.translate(-p.mouseX, -p.mouseY);

    p.translate(p.width / 2, p.height / 2);
    p.rotate(turn);
    p.translate(-p.width / 2, -p.height / 2);

    for (let l = -500; l < 1500; l += 74 * boom) {
      for (let i = -500; i < 2400; i += 100 * boom) {
        p.push();
        p.strokeWeight(2);
        p.translate(i, l);
        p.rotate(-p.radians(time));
        p.fill('#BF7919AA');

        if (flaps) {
          verts.x11 = 120 * p.cos((-time1 / 50) + p.HALF_PI) + 50;
          verts.y11 = 260.5 * p.sin((-time1 / 50) + p.HALF_PI) - 99.5;
          verts.x12 = 120 * p.cos((-time1 / 50) + p.HALF_PI) + 213;
          verts.y12 = 260.5 * p.sin((-time1 / 50) + p.HALF_PI) - 152.5;
          verts.x9 = 120 * p.cos((-time1 / 50) - p.HALF_PI) - 210;
          verts.y9 = 260.5 * p.sin((-time1 / 50) - p.HALF_PI) + 160.5;
          verts.x10 = 120 * p.cos((-time1 / 50) - p.HALF_PI) - 54;
          verts.y10 = 260.5 * p.sin((-time1 / 50) - p.HALF_PI) + 112.5;
        }

        // Side boxes
        p.quad(
          shrink * verts.x6, send * verts.y6,
          shrink * verts.x5, send * verts.y5,
          shrink * verts.x10, send1 * verts.y10,
          shrink * verts.x9, send1 * verts.y9
        );
        p.quad(
          shrink * verts.x3, send1 * verts.y3,
          shrink * verts.x4, send1 * verts.y4,
          shrink * verts.x12, send * verts.y12,
          shrink * verts.x11, send * verts.y11
        );

        // Prism
        p.fill('#004C3CCC');
        p.quad(
          shrink * verts.x1, send1 * verts.y1,
          shrink * verts.x2, send1 * verts.y2,
          shrink * verts.x3, send1 * verts.y3,
          shrink * verts.x4, send1 * verts.y4
        );
        p.quad(
          shrink * verts.x5, send * verts.y5,
          shrink * verts.x6, send * verts.y6,
          shrink * verts.x7, send * verts.y7,
          shrink * verts.x8, send * verts.y8
        );

        p.strokeWeight(2);
        p.line(shrink * verts.x1, send1 * verts.y1, shrink * verts.x5, send * verts.y5);
        p.line(shrink * verts.x2, send1 * verts.y2, shrink * verts.x6, send * verts.y6);
        p.line(shrink * verts.x3, send1 * verts.y3, shrink * verts.x7, send * verts.y7);
        p.line(shrink * verts.x4, send1 * verts.y4, shrink * verts.x8, send * verts.y8);

        p.pop();
      }
    }

    p.pop();
  };

  p.mouseWheel = function(event) {
    zoom *= 1.0 - (event.delta * 0.0001);
    zoom = p.constrain(zoom, 0.9, 5.0);
  };

  p.keyPressed = function() {
    if (p.key === 's') go = !go;
    if (p.key === 'e') expand = !expand;
    if (p.key === 'c') contract = !contract;
    if (p.key === 'x') {
      kaboom = !kaboom;
      time1 = 0;
    }
    if (p.key === 'f') {
      flaps = !flaps;
    }
  };
};
// window.onload = function() {
//   new p5(albersSketch);
// };