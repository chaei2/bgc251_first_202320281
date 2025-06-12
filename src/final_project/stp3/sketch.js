// 얼굴 인식겸 영상따라 민들어
// 얼굴 부분 비율 안깨지게 성공, 얼굴 인식은 덤
// 다니엘 데니쉬 영상 보며 만든 코드랑 손교수님 코드 섞어짜면서 만드는중
// 템플릿 화면 사이즈: 715 * 820
// 근데 템플릿 화면에 나오는 실제 사이즈는 맥에 화면 최대 범위-> fill로 인해 width: 1332px, height: 958px임
// padding: 0px
// margin: 0px
// border: 0px
//   canvas {
//   width: 100%;
//   height: 100%;
//   object-fit: fill; /* 비율 무시하고 꽉 채우기 */
// }
// <canvas>가 들어갈 부모 div에 id="canvas-container"를 부여하고, CSS에서 꽉 채우도록 설정해야함.

// 실제 html 구조(body 안에 넣기)
// <div id="canvas-container">
// css도 추가함

//js도 수정해야하는데, createCanvas() 후에 캔버스를 #canvas-container에 붙여줘함

let video;
let faceMesh;
let faces = [];

// preload()는 setup() 전에 딱 한 번 로드되게 하는 함수
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

// 윈도우 리사이즈로 아래 캔버스 설정한거 따라가기
function windowResized() {
  // 윈도우 기존에 있던 715*820 사이즈 하니 템플릿처럼 안 나와서 windowWidth로 탈바꿈
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  // 템플릿 내부 좌표계
  const canvas = createCanvas(windowWidth, windowHeight);
  // HTML div에 붙여야함
  canvas.parent('canvas-container');

  // 비디오 캡처 설정
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // 얼굴 인식 시작
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);
  // 손교수님 수업 video stp1 부분 cover()
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

  // cover로 인한 비율 문제로 얼굴 점도 비율에 맞춘 코드(정상화)
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

    // 얼굴에 점(키포인트) 그리기 위치가 얼굴 고정 안되고 정수리에 그려짐
    // for (let cnt = 0; cnt < face.keypoints.length; cnt++) {
    //   let keypoint = face.keypoints[cnt];
    //   stroke(255, 255, 0);
    //   strokeWeight(5);
    //   point(keypoint.x, keypoint.y);
    // }
  }
}
