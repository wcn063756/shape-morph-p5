let leftEmoji = "😀";
let rightEmoji = "🎉";

let leftPos;
let rightPos;
let dragPos;

let isDragging = false;
let progress = 0;

let emojiSize = 80;

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(emojiSize);
  
  leftPos = createVector(150, height / 2);
  rightPos = createVector(width - 150, height / 2);
  dragPos = leftPos.copy();
}

function draw() {
  background(240, 245, 250);
  
  drawGuideLine();
  
  if (isDragging) {
    let targetX = constrain(mouseX, leftPos.x, rightPos.x);
    dragPos.x = targetX;
    
    progress = map(dragPos.x, leftPos.x, rightPos.x, 0, 1);
  }
  
  drawRightEmoji();
  drawLeftEmoji();
  drawDraggingEmoji();
  
  drawInstructions();
}

function drawGuideLine() {
  stroke(200, 200, 200);
  strokeWeight(2);
  setLineDash([10, 10]);
  line(leftPos.x, leftPos.y, rightPos.x, rightPos.y);
  setLineDash([]);
}

function setLineDash(pattern) {
  drawingContext.setLineDash(pattern);
}

function drawLeftEmoji() {
  if (!isDragging || progress < 0.3) {
    push();
    translate(leftPos.x, leftPos.y);
    
    let pulse = sin(frameCount * 0.1) * 3;
    textSize(emojiSize + pulse);
    
    noStroke();
    text("😀", 0, 0);
    
    if (!isDragging) {
      textSize(16);
      fill(100);
      text("按住拖动", 0, emojiSize / 2 + 30);
    }
    pop();
  }
}

function drawRightEmoji() {
  push();
  translate(rightPos.x, rightPos.y);
  
  if (progress > 0.7) {
    let rightAlpha = map(progress, 0.7, 1, 0, 255);
    textSize(emojiSize);
    fill(0, rightAlpha);
    noStroke();
    text("🎉", 0, 0);
  }
  pop();
}

function drawDraggingEmoji() {
  if (isDragging) {
    push();
    translate(dragPos.x, dragPos.y);
    
    let currentSize = map(progress, 0, 1, emojiSize, emojiSize * 1.2);
    textSize(currentSize);
    
    let blendedEmoji = blendEmojis(progress);
    
    fill(0);
    noStroke();
    text(blendedEmoji, 0, 0);
    
    textSize(14);
    fill(80);
    let percent = Math.round(progress * 100);
    text(percent + "%", 0, emojiSize / 2 + 25);
    
    pop();
  }
}

function blendEmojis(progress) {
  if (progress < 0.5) {
    return "😀";
  } else if (progress < 0.7) {
    return "😄";
  } else if (progress < 0.85) {
    return "😃";
  } else {
    return "🎉";
  }
}

function drawInstructions() {
  if (!isDragging && progress === 0) {
    push();
    textSize(14);
    fill(120);
    noStroke();
    textAlign(CENTER);
    text("← 向右拖动emoji使其变形 →", width / 2, height - 50);
    pop();
  }
}

function mousePressed() {
  let d = dist(mouseX, mouseY, leftPos.x, leftPos.y);
  if (d < emojiSize) {
    isDragging = true;
    dragPos = leftPos.copy();
    progress = 0;
  }
}

function mouseReleased() {
  if (isDragging) {
    isDragging = false;
    
    if (progress < 0.3) {
      dragPos = leftPos.copy();
      progress = 0;
    }
  }
}

function mouseDragged() {
  if (isDragging) {
    let targetX = constrain(mouseX, leftPos.x, rightPos.x);
    dragPos.x = targetX;
    progress = map(dragPos.x, leftPos.x, rightPos.x, 0, 1);
  }
}