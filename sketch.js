let handpose;
let video;
let predictions = [];
let contents = [
              ['7','8','9','*'],
              ['4','5','6','-'],
              ['1','2','3','+'],
              ['0','/','.','=']]
;
let inverse =  [
              '*','9','8','7',
              '-','6','5','4',
              '+','3','2','1',
              '=','.','/','0']
;
let buttons = []
   let w =65
  let h =w +8
  let x,y
class Button{
  constructor(x,y,w,h, content){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.content = content
  }
  draw(){
      fill(255, 255, 210);
      strokeWeight(3);
      rect(this.x, this.y, this.w, this.h);
    
      fill(255, 0, 0);
      textSize(32);
      textAlign(CENTER);

      text(this.content, this.x + this.w / 2  , this.y  + this.h / 1.5);
    
  }
}



function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    
  });

  // Hide the video element, and just show the canvas
  video.hide();
  



for(i = 0; i<= 3; i++ ){
  for(j = 0; j<= 3; j++ ){
    x =width/3+j*w
    y =height/5+(i+1)*h
   let btn = new Button(x,y,w,h,contents[i][j])
    buttons.push(btn)
  }
}
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
   translate(video.width, 0);

  scale(-1, 1);

  image(video, 0, 0, width, height);


  // We can call both functions to draw all keypoints and the skeletons
 

  fill(255, 255, 210);
  rect(width/3, height/5, w*4, h);
  buttons.forEach((btn, i)=>{
    btn.draw()
  })

  drawKeypoints();
  
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    let x1 = prediction.annotations.indexFinger[3][0]
    let y1 = prediction.annotations.indexFinger[3][1]
    let x2 = prediction.annotations.middleFinger[3][0]
    let y2 = prediction.annotations.middleFinger[3][1]
    
    if(Math.abs(x1 - x2) <= 40){
      buttons.forEach((btn,index)=>{
        if(x1>=btn.x && x1 <= btn.x +btn.w){
          if(y1>=btn.y && y1 <= btn.y +btn.h){
            console.log(btn.content)
            text(btn.content,width/3, height/5)
          }
          
        }
      })
      
    }
    
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}
