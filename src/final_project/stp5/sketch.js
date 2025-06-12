// 얼굴 인식겸 영상따라 민들어
// 입술 주딩이 노리기
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
let lipStemp;

// preload()는 setup() 전에 딱 한 번 로드되게 하는 함수
function preload() {
  // ml5.faceMesh: 얼굴 인식 불러오는 함수 | maxFaces = 얼굴 인식 최대 갯수
  faceMesh = ml5.faceMesh({ maxFaces: 3, flipped: true });
}

// 얼굴 인식, 저장
function gotFaces(results) {
  faces = results;
}

// 윈도우 리사이즈로 아래 캔버스 설정한거 따라가기
// 창 크기 바뀔때 쓰는 windowResized()
function windowResized() {
  // 윈도우 기존에 있던 715*820 사이즈 하니 템플릿처럼 안 나와서 windowWidth로 탈바꿈
  resizeCanvas(windowWidth, windowHeight);
  // 입술도 같이 변경해야함
  lipStemp = createGraphics(windowWidth, windowHeight);
  // 캔버스 투명 초기화 이전 데이터 삭제
  lipStemp.clear();
}

function setup() {
  // 템플릿 내부 좌표계
  const canvas = createCanvas(windowWidth, windowHeight);

  // HTML div에 붙여야함

  canvas.parent('canvas-container');
  lipStemp = createGraphics(windowWidth, windowHeight);
  lipStemp.clear();

  // 비디오 캡처 설정
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // 얼굴 인식 시작
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background('black');
  image(lipStemp, 0, 0);

  textStyle(BOLDITALIC);
  textSize(70);
  textAlign(CENTER);
  fill('white');
  text('Lips', width / 2, height / 7);

  lipStemp.fill(0, 0, random(0, 200), 10);
  lipStemp.noStroke();
  lipStemp.rect(0, 0, width, height);

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

  noStroke();

  // cover로 인한 비율 문제로 얼굴 점도 비율에 맞춘 코드(정상화)
  if (faces.length > 0) {
    let face = faces[0];
    // 왜 안되냐..
    // 입술 좌표들..입술 왜 하란대로 했는데.. 안나오냐 입술 숫자 다니엘 데니쉬분 보면서 적음..주댕이..힘드네
    let lipsExterior = [
      267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61,
      185, 40, 39, 37, 0,
    ];
    let lipsInterior = [
      13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78,
      191, 80, 81, 82,
    ];

    // 입술 크게
    let lipBig = 3.5;

    // 주댕이 색
    // if (frameCount % 45 === 0) {
    let cX = 0,
      cY = 0;
    for (let centers of lipsExterior) {
      cX += face.keypoints[centers].x;
      cY += face.keypoints[centers].y;
    }
    cX /= lipsExterior.length;
    cY /= lipsExterior.length;

    // 외곽 주딩이 그리기
    lipStemp.fill(250, 50, 30);
    // lipStemp.stroke(255, 0, 0);
    lipStemp.strokeWeight(1);
    lipStemp.beginShape();

    for (let aSum of lipsExterior) {
      let pt = face.keypoints[aSum];
      let x = (pt.x - cX) * lipBig + cX;
      let y = (pt.y - cY) * lipBig + cY;
      x = map(x, 0, video.width, zeroX, zeroX + newWidth);
      y = map(y, 0, video.height, zeroY, zeroY + newHeight);
      lipStemp.vertex(x, y);
    }

    // 내곽 주딩이 그리기
    lipStemp.beginContour();

    // 꼭 입술 안에 색 없애려면 반대로 순회하는 구조 만들어야함
    for (let add = lipsInterior.length - 1; add >= 0; add--) {
      let pt = face.keypoints[lipsInterior[add]];
      let x = (pt.x - cX) * lipBig + cX;
      let y = (pt.y - cY) * lipBig + cY;
      x = map(x, 0, video.width, zeroX, zeroX + newWidth);
      y = map(y, 0, video.height, zeroY, zeroY + newHeight);
      lipStemp.vertex(x, y);
    }
    lipStemp.endContour();

    lipStemp.endShape(CLOSE);
    // }
    // 얼굴에 점(키포인트) 그리기 위치가 얼굴 고정 안되고 정수리에 그려짐
    // for (let cnt = 0; cnt < face.keypoints.length; cnt++) {
    //   let keypoint = face.keypoints[cnt];
    //   stroke(255, 255, 0);
    //   strokeWeight(5);
    //   point(keypoint.x, keypoint.y);
    // }
  }
}
