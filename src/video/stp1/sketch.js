// 교수님 수업 코드인데, 실수로 과제하다가 건들임 수정해야함

let video;

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();
  console.log(video);
  video.size(64, 48);
}

function draw() {
  // background(220);

  let aspectRatioCanvas = width / height;
  let aspectRatioVideo = video.width / video.height;
  let newWidth, newHeight;
  let zeroX, zeroY;

  if (aspectRatioCanvas > aspectRatioVideo) {
    newWidth = width;
    newHeight = newWidth / aspectRatioVideo;
  } else {
    newHeight = height;
    newWidth = newHeight * aspectRatioVideo;
  }
  zeroX = (width - newWidth) / 2;
  zeroY = (height - newHeight) / 2;

  image(video, zeroX, zeroY, newWidth, newHeight);

  noStroke();
  fill('red');
  circle(mouseX, mouseY, 50);
}
