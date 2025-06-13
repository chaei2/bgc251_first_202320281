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
// 아니, CORS 정책 문제로 화면 사라짐..
let video;
let faceMesh;
let faces = [];
let lipStemp;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  lipStemp = createGraphics(windowWidth, windowHeight);
  lipStemp.clear();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // faceMesh 초기화 (ml5@0.6.0 방식)
  // faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true })이게 안되네..
  // faceMash 웹 캠 적용
  faceMesh = ml5.facemesh(video, () => {
    console.log('faceMesh ready');
  });

  faceMesh.on('predict', (results) => {
    faces = results;
  });
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
  // 비디오 비율 맞추기

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
    // 키 포인트들을 얼굴 스케일
    let keypoints = face.scaledMesh;

    // 왜 안되냐..
    // 입술 좌표들..입술 왜 하란대로 했는데.. 안나오냐 입술 숫자 다니엘 데니쉬분 보면서 적음..주댕이..힘드네

    // 주딩이 밖 값들
    let lipsExterior = [
      267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61,
      185, 40, 39, 37, 0,
    ];

    // 주딩이 안 값들
    let lipsInterior = [
      13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78,
      191, 80, 81, 82,
    ];

    // 입술 크게
    let lipBig = 3.5;

    // 주댕이 색
    // if (frameCount % 45 === 0) {
    // 중심좌표 계산
    let cX = 0,
      cY = 0;
    for (let centers = 0; centers < lipsExterior.length; centers++) {
      // 좌표는 키 포인트[립의 계산 값을 가지는 [조건을 달성한 숫자들]] 키 포인트들의 일부인 립 바깥에

      cX += keypoints[lipsExterior[centers]][0];
      cY += keypoints[lipsExterior[centers]][1];
    }
    cX /= lipsExterior.length;
    cY /= lipsExterior.length;

    // 외곽 주딩이 그리기
    lipStemp.fill(250, 50, 30);
    // lipStemp.stroke(255, 0, 0);
    lipStemp.strokeWeight(1);
    lipStemp.beginShape();

    for (let aSum = 0; aSum < lipsExterior.length; aSum++) {
      // 좌표는 키 포인트[립의 계산 값을 가지는 [해당 조건을 달성한 숫자들]]
      let pt = keypoints[lipsExterior[aSum]];
      // x의 위치는 () * 크기 + 해당 숫자
      // pt[0] - cX: 각 점에서 중심까지의 거리
      // 각점 중심까지 거리 * 배수 + 해당 거리 더 가기
      let x = (pt[0] - cX) * lipBig + cX;
      let y = (pt[1] - cY) * lipBig + cY;
      x = map(x, 0, video.width, zeroX, zeroX + newWidth);
      y = map(y, 0, video.height, zeroY, zeroY + newHeight);

      // vertex()는 지정 점들로 도형 만들기 위해 사용함
      lipStemp.vertex(x, y);
    }

    // 내곽 주딩이 그리기
    lipStemp.beginContour();

    // 꼭 입술 안에 색 없애려면 반대로 순회하는 구조 만들어야함
    // 기존 구조에서 반대로 가게 만들면 (시계 반향 반대로) 애가 뚫리는 구조로 인식
    for (let cnt = lipsInterior.length - 1; cnt >= 0; cnt--) {
      let pt = keypoints[lipsInterior[cnt]];
      let x = (pt[0] - cX) * lipBig + cX;
      let y = (pt[1] - cY) * lipBig + cY;
      x = map(x, 0, video.width, zeroX, zeroX + newWidth);
      y = map(y, 0, video.height, zeroY, zeroY + newHeight);
      lipStemp.vertex(x, y);
    }
    // endContour()입술 구멍 만들떄 필요함
    lipStemp.endContour();

    lipStemp.endShape(CLOSE);
    // }
    // 얼굴에 점(키포인트) 그리기 위치가 얼굴 고정 안되고 정수리에 그려짐
    // for (let cnt = 0; cnt < keypoints.length; cnt++) {
    //   let pt = keypoints[cnt];
    //   stroke(255, 255, 0);
    //   strokeWeight(5);
    //   point(pt[0], pt[1]);
    // }
  }
}
