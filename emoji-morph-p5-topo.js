let leftEmoji = "😀";
let rightEmoji = "🎉";
let transitionEmojis = [];

let leftPos;
let rightPos;
let dragPos;

let isDragging = false;
let progress = 0;

let emojiSize = 80;
let state = "select";
let selectedInput = 0;
let inputTexts = ["😀", "🎉"];
let inputCursor = 0;
let cursorBlink = 0;

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
  
  if (state === "select") {
    drawEmojiSelector();
  } else if (state === "loading") {
    drawLoading();
  } else if (state === "game") {
    drawGame();
  }
}

function drawEmojiSelector() {
  // 绘制标题
  push();
  textSize(32);
  fill(50);
  text("选择两边的 Emoji", width / 2, 80);
  pop();
  
  // 绘制输入框
  let inputWidth = 120;
  let inputHeight = 80;
  let leftX = width / 2 - inputWidth - 30;
  let rightX = width / 2 + 30;
  let y = height / 2 - inputHeight / 2;
  
  // 左侧输入框
  drawInputBox(leftX, y, inputWidth, inputHeight, 0);
  
  // 右侧输入框
  drawInputBox(rightX, y, inputWidth, inputHeight, 1);
  
  // 绘制标签
  push();
  textSize(16);
  fill(100);
  text("左侧 Emoji", leftX + inputWidth / 2, y - 30);
  text("右侧 Emoji", rightX + inputWidth / 2, y - 30);
  pop();
  
  // 绘制开始按钮
  let buttonX = width / 2;
  let buttonY = y + inputHeight + 50;
  let buttonWidth = 200;
  let buttonHeight = 50;
  
  push();
  fill(76, 175, 80);
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
  fill(255);
  textSize(18);
  text("开始变形", buttonX, buttonY);
  pop();
  
  // 绘制提示
  push();
  textSize(14);
  fill(120);
  text("按空格键切换输入框，按回车键确认", width / 2, height - 50);
  text("输入emoji或复制粘贴", width / 2, height - 30);
  pop();
}

function drawInputBox(x, y, w, h, index) {
  push();
  rectMode(CORNER);
  if (selectedInput === index) {
    stroke(76, 175, 80);
    strokeWeight(3);
  } else {
    stroke(200);
    strokeWeight(2);
  }
  fill(255);
  rect(x, y, w, h, 8);
  
  // 绘制emoji
  textSize(40);
  fill(0);
  text(inputTexts[index], x + w / 2, y + h / 2);
  
  // 绘制光标
  if (selectedInput === index) {
    cursorBlink = (cursorBlink + 0.1) % 1;
    if (cursorBlink < 0.5) {
      fill(0);
      rect(x + w - 15, y + 15, 2, h - 30);
    }
  }
  pop();
}

function drawLoading() {
  push();
  textSize(24);
  fill(50);
  text("AI 正在生成过渡态...", width / 2, height / 2);
  
  // 绘制加载动画
  let radius = 30;
  let angle = frameCount * 0.1;
  push();
  translate(width / 2, height / 2 + 50);
  for (let i = 0; i < 8; i++) {
    let a = angle + i * TWO_PI / 8;
    let r = map(sin(angle + i * 0.5), -1, 1, 5, radius);
    let x = cos(a) * r;
    let y = sin(a) * r;
    fill(76, 175, 80);
    ellipse(x, y, 8, 8);
  }
  pop();
  pop();
}

function drawGame() {
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
    text(leftEmoji, 0, 0);
    
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
    text(rightEmoji, 0, 0);
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
  if (transitionEmojis.length === 0) {
    return leftEmoji;
  }
  
  if (progress < 0.33) {
    return transitionEmojis[0] || leftEmoji;
  } else if (progress < 0.66) {
    return transitionEmojis[1] || leftEmoji;
  } else {
    return transitionEmojis[2] || rightEmoji;
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
  if (state === "select") {
    // 检查是否点击了输入框
    let inputWidth = 120;
    let inputHeight = 80;
    let leftX = width / 2 - inputWidth - 30;
    let rightX = width / 2 + 30;
    let y = height / 2 - inputHeight / 2;
    
    if (mouseX > leftX && mouseX < leftX + inputWidth && 
        mouseY > y && mouseY < y + inputHeight) {
      selectedInput = 0;
    } else if (mouseX > rightX && mouseX < rightX + inputWidth && 
               mouseY > y && mouseY < y + inputHeight) {
      selectedInput = 1;
    }
    
    // 检查是否点击了开始按钮
    let buttonX = width / 2;
    let buttonY = y + inputHeight + 50;
    let buttonWidth = 200;
    let buttonHeight = 50;
    
    if (mouseX > buttonX - buttonWidth / 2 && mouseX < buttonX + buttonWidth / 2 && 
        mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2) {
      startGame();
    }
  } else if (state === "game") {
    let d = dist(mouseX, mouseY, leftPos.x, leftPos.y);
    if (d < emojiSize) {
      isDragging = true;
      dragPos = leftPos.copy();
      progress = 0;
    }
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

function keyPressed() {
  if (state === "select") {
    if (keyCode === 32) {
      // 空格键切换输入框
      selectedInput = (selectedInput + 1) % 2;
    } else if (keyCode === 13) {
      // 回车键开始游戏
      startGame();
    } else if (key.length === 1 && key !== " ") {
      // 输入字符
      inputTexts[selectedInput] = key;
    }
  }
}

function startGame() {
  leftEmoji = inputTexts[0];
  rightEmoji = inputTexts[1];
  
  state = "loading";
  
  // 模拟AI生成过渡态
  setTimeout(() => {
    transitionEmojis = generateAITransitionEmojis(leftEmoji, rightEmoji);
    state = "game";
  }, 2000);
}

function generateAITransitionEmojis(left, right) {
  // 简单的AI过渡态生成逻辑
  const transitions = {
    '😀🎉': ['😄', '😃', '😆'],
    '😀😢': ['😐', '😔', '😢'],
    '😀😡': ['😐', '😒', '😡'],
    '😀😎': ['😃', '😅', '😎'],
    '🎉🎂': ['🎊', '🎁', '🎂'],
    '😢😊': ['😐', '🙂', '😊'],
    '😡😀': ['😒', '😐', '😀'],
    '🐶🐱': ['🐾', '🐹', '🐱'],
    '🍎🍌': ['🍏', '🍐', '🍌'],
    '🌞🌙': ['🌅', '🌇', '🌙']
  };
  
  const key = left + right;
  if (transitions[key]) {
    return transitions[key];
  }
  
  // 默认过渡态
  return [left, left, right];
}