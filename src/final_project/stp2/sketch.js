// 얼굴 인식 모델 만들기
// 혹시 몰라 stp3에 같은 코드 파생시킴 망하면 이걸로..
// 다니엘 데니쉬 영상 보며 만든 코드
// 템플릿 화면 사이즈: 715 * 820
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
  createCanvas(1280, 720);
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  // Start detecting faces
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);

  // Ensure at least one face is detected
  if (faces.length > 0) {
    let face = faces[0];

    // Draw keypoints on the detected face
    for (let cnt = 0; cnt < face.keypoints.length; cnt++) {
      let keypoint = face.keypoints[cnt];
      stroke(255, 255, 0);
      strokeWeight(5);
      point(keypoint.x, keypoint.y);
    }
  }
}
