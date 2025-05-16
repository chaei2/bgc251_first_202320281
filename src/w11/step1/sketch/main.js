let balls = [];

function setup() {
  createCanvas(400, 400);
  for (let n = 0; n < 30; n++) {
    let randomR = random(20, 50);
    let randomX = random(randomR, width - randomR);
    let randomY = random(-2 * randomR, height - randomR);
    let aBall = new Ball(randomX, randomY, randomR);
    balls.push(aBall);
  }
}

function draw() {
  background('red');
  for (let idx = 0; idx < balls.length; idx++) {
    let aBall = balls[idx];
    aBall.applyGravity(0, 1);
    for (let suvIdx = idx + 1; suvIdx < balls.length; suvIdx++) {
      let other = balls[suvIdx];
      aBall.collide(other, 0.9);
    }
    aBall.update();
    aBall.wall();
    aBall.render();
  }
}
