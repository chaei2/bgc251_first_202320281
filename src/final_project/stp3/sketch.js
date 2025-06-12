// 얼굴 인식겸 영상따라 민들어, 실험보기
let video;
let faceMesh;
let faces = [];

// preload는 set up 전에
function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
}

function mousePressed() {
  // Log detected face data tothe console
  console.log(faces);
}

function gotFaces(results) {
  faces = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting faces
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);

  if (faces.length > 0) {
    let face = faces[0];
    let lEyeBrow = face.leftEyeBrow;
    // Draw keypoints on the detected face
    for (let i = 0; i < face.keypoints.length; i++) {
      let keypoint = face.keypoints[i];
      stroke(255, 255, 0);
      strokeWeight(5);
      point(keypoint.x, keypoint.y);
    }
  }
}
