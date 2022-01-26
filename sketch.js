let handpose;
let video;
let predictions = [];
let contents = [
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", "/", ".", "="],
  ["2"],
];
let inverse = [
  "*",
  "9",
  "8",
  "7",
  "-",
  "6",
  "5",
  "4",
  "+",
  "3",
  "2",
  "1",
  "=",
  ".",
  "/",
  "0",
];
let buttons = [];
let w = 65;
let h = w + 1;
let x, y;
class Button {
  constructor(x, y, w, h, content) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.content = content;
  }
  draw(i) {
    // fill("rgba(56, 67, 81, 0.8)");
    // stroke("rgba(55, 65, 81, 0.2)");
    fill(56, 67, 81);
    stroke(55, 65, 81);
    strokeWeight(2);
    let r1,
      r2,
      r3 = 0;

    if (i == 12) {
      r1 = 0;
      r2 = 6;
    } else if (i == 16) {
      r1 = 6;
      r2 = 0;
      r3 = 6;
    }
    rect(this.x, this.y, this.w, this.h, 0, r3, r1, r2);

    fill(255, 255, 255);
    textSize(32);
    textAlign(CENTER);

    text(this.content, this.x + this.w / 2, this.y + this.h / 1.5);
  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  const options = {
    flipHorizontal: true,
  };
  handpose = ml5.handpose(video, options, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", (results) => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  //video.hide();

  for (i = 0; i <= 3; i++) {
    for (j = 0; j <= 3; j++) {
      x = width / 3 + j * w;
      y = (i + 1) * h;
      let btn = new Button(x, y, w, h, contents[i][j]);
      buttons.push(btn);
    }
  }
  x = width / 3 + 4 * w;
  y = (3 + 1) * h;
  btn = new Button(x, y, w, h, "d");
  buttons.push(btn);
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  //const flippedVideo = ml5.flipImage(video);
  image(video, 0, 0, width, height);
  pop();
  // We can call both functions to draw all keypoints and the skeletons
  fill(56, 67, 81);
  rect(width / 3, 0, w * 4, h, 6, 6, 0, 0);
  buttons.forEach((btn, i) => {
    btn.draw(i);
  });

  drawKeypoints();
}
let s = "";
let number = "";
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    // let x1 = prediction.annotations.indexFinger[3][0];
    let y1 = prediction.annotations.indexFinger[3][1];
    // let x2 = prediction.annotations.middleFinger[3][0];
    // let y2 = prediction.annotations.indexFinger[2][1];
    let x1 = prediction.annotations.thumb[3][0];
    let x2 = prediction.annotations.indexFinger[1][0];

    console.log(prediction.annotations);
    console.log(x2 - x1);
    if (x2 - x1 <= 15) {
      buttons.forEach((btn, index) => {
        if (x1 >= btn.x && x1 <= btn.x + btn.w) {
          if (y1 >= btn.y && y1 <= btn.y + btn.h) {
            number = btn.content;
          }
        }
      });
    } else {
      if (number == "=") {
        s = String(eval(s));
        number = "";
      } else if (number == "d") {
        s = "";
      } else {
        s = s + number;
        text(s, width / 3 + w / 2, h / 1.5);
        number = "";
      }
    }
    console.log(number);

    console.log(s);

    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}
