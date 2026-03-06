let leftShape = "triangle";
let rightShape = "star";
let transitionShapes = [];

let leftPos;
let rightPos;
let dragPos;

let isDragging = false;
let progress = 0;

let shapeSize = 60;
let state = "select";
let selectedSide = 0; // 0: left, 1: right
let showLeftDropdown = false;
let showRightDropdown = false;

// 几何图形库
const shapes = [
  { name: "triangle", display: "三角形" },
  { name: "square", display: "正方形" },
  { name: "circle", display: "圆形" },
  { name: "pentagon", display: "五边形" },
  { name: "hexagon", display: "六边形" },
  { name: "star", display: "五角星" },
  { name: "heart", display: "心形" },
  { name: "diamond", display: "菱形" }
];

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(16);
  
  leftPos = createVector(150, height / 2);
  rightPos = createVector(width - 150, height / 2);
  dragPos = leftPos.copy();
}

function draw() {
  background(240, 245, 250);
  
  if (state === "select") {
    drawShapeSelector();
  } else if (state === "loading") {
    drawLoading();
  } else if (state === "game") {
    drawGame();
  }
}

function drawShapeSelector() {
  // 绘制标题
  push();
  textSize(32);
  fill(50);
  text("选择两边的几何图形", width / 2, 80);
  pop();
  
  // 绘制左侧选择器
  let leftX = width / 2 - 150;
  let y = height / 2;
  drawShapeSelectorUI(leftX, y, 0);
  
  // 绘制右侧选择器
  let rightX = width / 2 + 150;
  drawShapeSelectorUI(rightX, y, 1);
  
  // 绘制开始按钮
  let buttonX = width / 2;
  let buttonY = y + 120;
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
}

function drawShapeSelectorUI(x, y, side) {
  let currentShape = side === 0 ? leftShape : rightShape;
  let showDropdown = side === 0 ? showLeftDropdown : showRightDropdown;
  
  // 绘制标签
  push();
  textSize(16);
  fill(100);
  text(side === 0 ? "左侧图形" : "右侧图形", x, y - 80);
  pop();
  
  // 绘制当前选中的图形
  push();
  translate(x, y - 40);
  drawShape(currentShape, shapeSize);
  pop();
  
  // 绘制选择框
  let boxWidth = 150;
  let boxHeight = 40;
  
  push();
  rectMode(CENTER);
  fill(255);
  stroke(200);
  strokeWeight(2);
  rect(x, y + 20, boxWidth, boxHeight, 8);
  
  // 绘制当前图形名称
  fill(50);
  textSize(14);
  text(getShapeDisplayName(currentShape), x - 40, y + 20);
  
  // 绘制下拉箭头
  fill(100);
  triangle(x + 50, y + 15, x + 60, y + 25, x + 40, y + 25);
  pop();
  
  // 绘制下拉菜单
  if (showDropdown) {
    push();
    rectMode(CENTER);
    fill(255);
    stroke(200);
    strokeWeight(2);
    rect(x, y + 80, boxWidth, shapes.length * 30 + 10, 8);
    
    for (let i = 0; i < shapes.length; i++) {
      let itemY = y + 60 + i * 30;
      
      // 绘制选中状态
      if (shapes[i].name === currentShape) {
        fill(220, 240, 220);
        rect(x, itemY, boxWidth - 10, 25, 4);
      }
      
      // 绘制图形名称
      fill(50);
      textSize(14);
      text(shapes[i].display, x, itemY);
    }
    pop();
  }
}

function getShapeDisplayName(shapeName) {
  const shape = shapes.find(s => s.name === shapeName);
  return shape ? shape.display : shapeName;
}

function drawLoading() {
  push();
  textSize(24);
  fill(50);
  text("生成拓扑变换...", width / 2, height / 2);
  
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
  
  drawRightShape();
  drawLeftShape();
  drawDraggingShape();
  
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

function drawLeftShape() {
  if (!isDragging || progress < 0.3) {
    push();
    translate(leftPos.x, leftPos.y);
    
    let pulse = sin(frameCount * 0.1) * 3;
    let size = shapeSize + pulse;
    
    drawShape(leftShape, size);
    
    if (!isDragging) {
      textSize(14);
      fill(100);
      text("按住拖动", 0, size / 2 + 25);
    }
    pop();
  }
}

function drawRightShape() {
  push();
  translate(rightPos.x, rightPos.y);
  
  if (progress > 0.7) {
    let rightAlpha = map(progress, 0.7, 1, 0, 255);
    fill(0, rightAlpha);
    drawShape(rightShape, shapeSize);
  }
  pop();
}

function drawDraggingShape() {
  if (isDragging) {
    push();
    translate(dragPos.x, dragPos.y);
    
    let currentSize = map(progress, 0, 1, shapeSize, shapeSize * 1.2);
    
    drawMorphingShape(progress, currentSize);
    
    textSize(14);
    fill(80);
    let percent = Math.round(progress * 100);
    text(percent + "%", 0, currentSize / 2 + 25);
    
    pop();
  }
}

function drawMorphingShape(progress, size) {
  if (transitionShapes.length === 0) {
    drawShape(leftShape, size);
    return;
  }
  
  drawMorphShape(leftShape, rightShape, progress, size);
}

function drawMorphShape(shape1, shape2, t, size) {
  // 简单的形状插值
  push();
  
  // 混合颜色
  let color1 = getShapeColor(shape1);
  let color2 = getShapeColor(shape2);
  let r = lerp(color1[0], color2[0], t);
  let g = lerp(color1[1], color2[1], t);
  let b = lerp(color1[2], color2[2], t);
  
  stroke(r, g, b);
  strokeWeight(3);
  noFill();
  
  // 根据不同的形状组合实现不同的插值方式
  if (shape1 === "triangle" && shape2 === "diamond") {
    drawTriangleToDiamond(t, size);
  } else if (shape1 === "diamond" && shape2 === "square") {
    drawDiamondToSquare(t, size);
  } else if (shape1 === "triangle" && shape2 === "pentagon") {
    drawPolygonMorph(3, 5, t, size);
  } else if (shape1 === "pentagon" && shape2 === "circle") {
    drawPolygonToCircle(5, t, size);
  } else if (shape1 === "square" && shape2 === "hexagon") {
    drawPolygonMorph(4, 6, t, size);
  } else if (shape1 === "hexagon" && shape2 === "circle") {
    drawPolygonToCircle(6, t, size);
  } else if (shape1 === "circle" && shape2 === "pentagon") {
    drawCircleToPolygon(t, 5, size);
  } else if (shape1 === "pentagon" && shape2 === "star") {
    drawPentagonToStar(t, size);
  } else if (shape1 === "heart" && shape2 === "circle") {
    drawHeartToCircle(t, size);
  } else {
    // 默认插值
    let t1 = 1 - t;
    let t2 = t;
    
    // 绘制第一个形状（半透明）
    push();
    stroke(r, g, b, 255 * t1);
    drawShape(shape1, size * (1 - t * 0.1));
    pop();
    
    // 绘制第二个形状（半透明）
    push();
    stroke(r, g, b, 255 * t2);
    drawShape(shape2, size * (0.9 + t * 0.1));
    pop();
  }
  
  pop();
}

function getShapeColor(shapeName) {
  switch (shapeName) {
    case "triangle": return [255, 99, 71];
    case "square": return [30, 144, 255];
    case "circle": return [255, 215, 0];
    case "pentagon": return [143, 188, 143];
    case "hexagon": return [218, 112, 214];
    case "star": return [255, 69, 0];
    case "heart": return [255, 0, 0];
    case "diamond": return [100, 149, 237];
    default: return [0, 0, 0];
  }
}

function drawTriangleToDiamond(t, size) {
  beginShape();
  let y1 = lerp(-size/2, -size/2, t);
  let y2 = lerp(size/2, 0, t);
  let y3 = lerp(size/2, size/2, t);
  let y4 = lerp(size/2, 0, t);
  
  vertex(0, y1);
  vertex(size/2, y2);
  vertex(0, y3);
  vertex(-size/2, y4);
  endShape(CLOSE);
}

function drawDiamondToSquare(t, size) {
  beginShape();
  let x1 = lerp(0, -size/2, t);
  let y1 = lerp(-size/2, -size/2, t);
  let x2 = lerp(size/2, size/2, t);
  let y2 = lerp(0, -size/2, t);
  let x3 = lerp(0, size/2, t);
  let y3 = lerp(size/2, size/2, t);
  let x4 = lerp(-size/2, -size/2, t);
  let y4 = lerp(0, size/2, t);
  
  vertex(x1, y1);
  vertex(x2, y2);
  vertex(x3, y3);
  vertex(x4, y4);
  endShape(CLOSE);
}

function drawPolygonMorph(sides1, sides2, t, size) {
  let sides = lerp(sides1, sides2, t);
  beginShape();
  for (let i = 0; i < Math.max(sides1, sides2); i++) {
    let angle = TWO_PI / sides * i - HALF_PI;
    let x = cos(angle) * size/2;
    let y = sin(angle) * size/2;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawPolygonToCircle(sides, t, size) {
  beginShape();
  for (let i = 0; i < sides * 2; i++) {
    let angle = TWO_PI / (sides * 2) * i - HALF_PI;
    let r = lerp(size/2, size/2, t);
    if (i % 2 === 1) {
      r = lerp(size/2 * 0.8, size/2, t);
    }
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawCircleToPolygon(t, sides, size) {
  beginShape();
  for (let i = 0; i < sides * 2; i++) {
    let angle = TWO_PI / (sides * 2) * i - HALF_PI;
    let r = lerp(size/2, size/2, t);
    if (i % 2 === 1) {
      r = lerp(size/2, size/2 * 0.8, t);
    }
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawPentagonToStar(t, size) {
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI / 5 * i - HALF_PI;
    let outerR = lerp(size/2, size/2, t);
    let innerR = lerp(size/2, size/4, t);
    
    let x1 = cos(angle) * outerR;
    let y1 = sin(angle) * outerR;
    vertex(x1, y1);
    
    angle += TWO_PI / 5 / 2;
    let x2 = cos(angle) * innerR;
    let y2 = sin(angle) * innerR;
    vertex(x2, y2);
  }
  endShape(CLOSE);
}

function drawHeartToCircle(t, size) {
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.1) {
    let r = size/2;
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    
    // 心形到圆形的插值
    if (t < 1) {
      let heartX = x;
      let heartY = y * 0.75 + abs(x) * 0.5;
      x = lerp(heartX, x, t);
      y = lerp(heartY, y, t);
    }
    
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawInstructions() {
  if (!isDragging && progress === 0) {
    push();
    textSize(14);
    fill(120);
    noStroke();
    textAlign(CENTER);
    text("← 向右拖动图形使其变形 →", width / 2, height - 50);
    pop();
  }
}

function drawShape(shapeName, size) {
  switch (shapeName) {
    case "triangle":
      drawTriangle(size);
      break;
    case "square":
      drawSquare(size);
      break;
    case "circle":
      drawCircle(size);
      break;
    case "pentagon":
      drawPentagon(size);
      break;
    case "hexagon":
      drawHexagon(size);
      break;
    case "star":
      drawStar(size);
      break;
    case "heart":
      drawHeart(size);
      break;
    case "diamond":
      drawDiamond(size);
      break;
  }
}

function drawTriangle(size) {
  stroke(255, 99, 71);
  strokeWeight(3);
  noFill();
  triangle(0, -size/2, -size/2, size/2, size/2, size/2);
}

function drawSquare(size) {
  stroke(30, 144, 255);
  strokeWeight(3);
  noFill();
  square(-size/2, -size/2, size);
}

function drawCircle(size) {
  stroke(255, 215, 0);
  strokeWeight(3);
  noFill();
  ellipse(0, 0, size, size);
}

function drawPentagon(size) {
  stroke(143, 188, 143);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI / 5 * i - HALF_PI;
    let x = cos(angle) * size/2;
    let y = sin(angle) * size/2;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawHexagon(size) {
  stroke(218, 112, 214);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i - HALF_PI;
    let x = cos(angle) * size/2;
    let y = sin(angle) * size/2;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawStar(size) {
  stroke(255, 69, 0);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI / 5 * i - HALF_PI;
    let x = cos(angle) * size/2;
    let y = sin(angle) * size/2;
    vertex(x, y);
    angle += TWO_PI / 5 / 2;
    x = cos(angle) * size/4;
    y = sin(angle) * size/4;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawHeart(size) {
  stroke(255, 0, 0);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(0, -size/3);
  bezierVertex(-size/2, -size, -size, 0, 0, size/2);
  bezierVertex(size, 0, size/2, -size, 0, -size/3);
  endShape(CLOSE);
}

function drawDiamond(size) {
  stroke(100, 149, 237);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(0, -size/2);
  vertex(size/2, 0);
  vertex(0, size/2);
  vertex(-size/2, 0);
  endShape(CLOSE);
}

function mousePressed() {
  if (state === "select") {
    // 检查是否点击了左侧选择框
    let leftX = width / 2 - 150;
    let y = height / 2 + 20;
    let boxWidth = 150;
    let boxHeight = 40;
    
    if (mouseX > leftX - boxWidth/2 && mouseX < leftX + boxWidth/2 && 
        mouseY > y - boxHeight/2 && mouseY < y + boxHeight/2) {
      showLeftDropdown = !showLeftDropdown;
      showRightDropdown = false;
    }
    
    // 检查是否点击了右侧选择框
    let rightX = width / 2 + 150;
    if (mouseX > rightX - boxWidth/2 && mouseX < rightX + boxWidth/2 && 
        mouseY > y - boxHeight/2 && mouseY < y + boxHeight/2) {
      showRightDropdown = !showRightDropdown;
      showLeftDropdown = false;
    }
    
    // 检查是否点击了左侧下拉菜单
    if (showLeftDropdown) {
      for (let i = 0; i < shapes.length; i++) {
        let itemY = y + 40 + i * 30;
        if (mouseX > leftX - boxWidth/2 && mouseX < leftX + boxWidth/2 && 
            mouseY > itemY - 12.5 && mouseY < itemY + 12.5) {
          leftShape = shapes[i].name;
          showLeftDropdown = false;
        }
      }
    }
    
    // 检查是否点击了右侧下拉菜单
    if (showRightDropdown) {
      for (let i = 0; i < shapes.length; i++) {
        let itemY = y + 40 + i * 30;
        if (mouseX > rightX - boxWidth/2 && mouseX < rightX + boxWidth/2 && 
            mouseY > itemY - 12.5 && mouseY < itemY + 12.5) {
          rightShape = shapes[i].name;
          showRightDropdown = false;
        }
      }
    }
    
    // 检查是否点击了开始按钮
    let buttonX = width / 2;
    let buttonY = y + 100;
    let buttonWidth = 200;
    let buttonHeight = 50;
    
    if (mouseX > buttonX - buttonWidth/2 && mouseX < buttonX + buttonWidth/2 && 
        mouseY > buttonY - buttonHeight/2 && mouseY < buttonY + buttonHeight/2) {
      startGame();
    }
  } else if (state === "game") {
    let d = dist(mouseX, mouseY, leftPos.x, leftPos.y);
    if (d < shapeSize) {
      isDragging = true;
      dragPos = leftPos.copy();
      progress = 0;
    }
  }
}

function mouseReleased() {
  if (isDragging) {
    isDragging = false;
    
    if (progress >= 0.9) {
      // 最终停留在右边图形上
      dragPos = rightPos.copy();
      progress = 1;
    } else if (progress < 0.3) {
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

function startGame() {
  state = "loading";
  
  // 生成过渡图形
  setTimeout(() => {
    transitionShapes = generateTransitionShapes(leftShape, rightShape);
    state = "game";
  }, 2000);
}

function generateTransitionShapes(left, right) {
  const transitions = {
    'triangle square': ['triangle', 'diamond', 'square'],
    'triangle circle': ['triangle', 'pentagon', 'circle'],
    'triangle pentagon': ['triangle', 'triangle', 'pentagon'],
    'triangle hexagon': ['triangle', 'pentagon', 'hexagon'],
    'triangle star': ['triangle', 'pentagon', 'star'],
    'triangle heart': ['triangle', 'diamond', 'heart'],
    'triangle diamond': ['triangle', 'triangle', 'diamond'],
    'square triangle': ['square', 'diamond', 'triangle'],
    'square circle': ['square', 'hexagon', 'circle'],
    'square pentagon': ['square', 'hexagon', 'pentagon'],
    'square hexagon': ['square', 'square', 'hexagon'],
    'square star': ['square', 'hexagon', 'star'],
    'square heart': ['square', 'diamond', 'heart'],
    'square diamond': ['square', 'square', 'diamond'],
    'circle triangle': ['circle', 'pentagon', 'triangle'],
    'circle square': ['circle', 'hexagon', 'square'],
    'circle pentagon': ['circle', 'circle', 'pentagon'],
    'circle hexagon': ['circle', 'pentagon', 'hexagon'],
    'circle star': ['circle', 'pentagon', 'star'],
    'circle heart': ['circle', 'circle', 'heart'],
    'circle diamond': ['circle', 'hexagon', 'diamond'],
    'pentagon triangle': ['pentagon', 'pentagon', 'triangle'],
    'pentagon square': ['pentagon', 'hexagon', 'square'],
    'pentagon circle': ['pentagon', 'pentagon', 'circle'],
    'pentagon hexagon': ['pentagon', 'pentagon', 'hexagon'],
    'pentagon star': ['pentagon', 'pentagon', 'star'],
    'pentagon heart': ['pentagon', 'pentagon', 'heart'],
    'pentagon diamond': ['pentagon', 'hexagon', 'diamond'],
    'hexagon triangle': ['hexagon', 'pentagon', 'triangle'],
    'hexagon square': ['hexagon', 'hexagon', 'square'],
    'hexagon circle': ['hexagon', 'hexagon', 'circle'],
    'hexagon pentagon': ['hexagon', 'hexagon', 'pentagon'],
    'hexagon star': ['hexagon', 'hexagon', 'star'],
    'hexagon heart': ['hexagon', 'hexagon', 'heart'],
    'hexagon diamond': ['hexagon', 'hexagon', 'diamond'],
    'star triangle': ['star', 'pentagon', 'triangle'],
    'star square': ['star', 'hexagon', 'square'],
    'star circle': ['star', 'pentagon', 'circle'],
    'star pentagon': ['star', 'pentagon', 'pentagon'],
    'star hexagon': ['star', 'hexagon', 'hexagon'],
    'star heart': ['star', 'pentagon', 'heart'],
    'star diamond': ['star', 'hexagon', 'diamond'],
    'heart triangle': ['heart', 'diamond', 'triangle'],
    'heart square': ['heart', 'diamond', 'square'],
    'heart circle': ['heart', 'heart', 'circle'],
    'heart pentagon': ['heart', 'diamond', 'pentagon'],
    'heart hexagon': ['heart', 'diamond', 'hexagon'],
    'heart star': ['heart', 'diamond', 'star'],
    'heart diamond': ['heart', 'diamond', 'diamond'],
    'diamond triangle': ['diamond', 'triangle', 'triangle'],
    'diamond square': ['diamond', 'square', 'square'],
    'diamond circle': ['diamond', 'hexagon', 'circle'],
    'diamond pentagon': ['diamond', 'hexagon', 'pentagon'],
    'diamond hexagon': ['diamond', 'hexagon', 'hexagon'],
    'diamond star': ['diamond', 'hexagon', 'star'],
    'diamond heart': ['diamond', 'diamond', 'heart']
  };
  
  const key = left + ' ' + right;
  if (transitions[key]) {
    return transitions[key];
  }
  
  return [left, right, right];
}