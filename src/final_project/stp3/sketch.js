// 얼굴 인식겸 영상따라 민들어, 실험보기
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
  createCanvas(715, 820);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // 얼굴 인식 시작
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);

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

  if (faces.length > 0) {
    let face = faces[0];
    let lEyeBrow = face.leftEyeBrow;
    for (let pt of face.keypoints) {
      let x = map(pt.x, 0, video.width, zeroX, zeroX + newWidth);
      let y = map(pt.y, 0, video.height, zeroY, zeroY + newHeight);
      stroke(255, 255, 0);
      strokeWeight(5);
      point(x, y);
    }

    // 얼굴에 점(키포인트) 그리기 위치가 고정 안됨
    // for (let cnt = 0; cnt < face.keypoints.length; cnt++) {
    //   let keypoint = face.keypoints[cnt];
    //   stroke(255, 255, 0);
    //   strokeWeight(5);
    //   point(keypoint.x, keypoint.y);
    // }
  }
}
