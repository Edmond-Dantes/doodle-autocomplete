let model = null;
let classes = ["circle","square","triangle","star","other"];
let pg, statusMsg, uiDiv;
let bg = 0;

const MODEL_URL = './model.json';

// Drawing state
let isDrawing = false;
let minX, minY, maxX, maxY;
let drewAnything = false;

// UI controls
let padSlider, bboxToggle;
const fitMargin = 0.10; // shrink canonical shape a bit inside bbox

// Persistent shapes
let shapes = [];

class Shape {
  // type: 'circle' | 'square' | 'triangle' | 'star' | 'unknown'
  // cx, cy: centre in canvas coords; size: main side/diameter; strokeW: stroke weight
  constructor(type, cx, cy, size, strokeW = 8) {
    this.type = type;
    this.cx = cx;
    this.cy = cy;
    this.size = size;
    this.strokeW = strokeW;
  }
  draw() {
    push();
    translate(this.cx, this.cy);
    stroke(255);
    strokeWeight(this.strokeW);
    noFill();

    if (this.type === 'circle') {
      ellipse(0, 0, this.size, this.size);
    } else if (this.type === 'square') {
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);
    } else if (this.type === 'triangle') {
      const r = this.size * 0.58;
      triangle(-r, r, 0, -r, r, r);
    } else if (this.type === 'star') {
      drawStar(0, 0, this.size * 0.35, this.size * 0.7, 6);
    } else {
      noStroke(); fill(255);
      textAlign(CENTER, CENTER);
      text('unknown', 0, 0);
    }
    pop();
  }
}

function setup() {
  pixelDensity(1);
  createCanvas(560, 560);
  noSmooth();
  resetCanvas();

  // Offscreen 28×28 buffer (what the model “sees”)
  pg = createGraphics(28, 28);
  pg.pixelDensity(1);
  pg.noSmooth();
  pg.background(bg);

  // --- UI ---
  uiDiv = createDiv().addClass("ui-panel");

  let clearBtn = createButton("Clear (canvas + shapes)");
  clearBtn.mousePressed(() => { shapes = []; resetCanvas(); });
  clearBtn.parent(uiDiv);

  createSpan(" Padding: ").parent(uiDiv);
  padSlider = createSlider(0, 60, 12, 1);
  padSlider.parent(uiDiv);

  bboxToggle = createCheckbox(' Show bbox', true);
  bboxToggle.parent(uiDiv);

  statusMsg = createP("Loading model…");
  statusMsg.parent(uiDiv);

  // Load model
  tf.loadLayersModel(MODEL_URL)
    .then(m => { model = m; statusMsg.html("Model loaded ✓"); })
    .catch(err => { console.error("Failed to load model:", err); statusMsg.html("Failed to load model (see console)"); });
}

function resetCanvas() {
  background(bg);
  stroke(255);
  strokeWeight(6);
  noFill();

  isDrawing = false;
  drewAnything = false;
  minX = width; minY = height;
  maxX = 0;     maxY = 0;

  // redraw any persisted shapes (useful when clearing scribble only)
  renderAll();
}

function mousePressed() {
  if (!insideCanvas(mouseX, mouseY)) return;
  isDrawing = true;
  minX = maxX = mouseX;
  minY = maxY = mouseY;
  drewAnything = true;
}

function mouseDragged() {
  if (!isDrawing || !insideCanvas(mouseX, mouseY)) return;
  // draw live scribble over the current canvas; we’ll re-render cleanly on release
  line(pmouseX, pmouseY, mouseX, mouseY);

  // update bbox
  minX = Math.min(minX, mouseX, pmouseX);
  minY = Math.min(minY, mouseY, pmouseY);
  maxX = Math.max(maxX, mouseX, pmouseX);
  maxY = Math.max(maxY, mouseY, pmouseY);
}

function mouseReleased() {
  if (!isDrawing) return;
  isDrawing = false;
  predictFromDrawingAndPersist();
}

function predictFromDrawingAndPersist() {
  if (!model || !drewAnything) return;

  // compute padded bbox for cropping/downscale
  const pad = padSlider ? padSlider.value() : 12;
  let x0 = Math.floor(minX - pad);
  let y0 = Math.floor(minY - pad);
  let x1 = Math.ceil(maxX + pad);
  let y1 = Math.ceil(maxY + pad);
  x0 = constrain(x0, 0, width - 1);
  y0 = constrain(y0, 0, height - 1);
  x1 = constrain(x1, 0, width - 1);
  y1 = constrain(y1, 0, height - 1);
  let w = Math.max(1, x1 - x0);
  let h = Math.max(1, y1 - y0);

  if (bboxToggle && bboxToggle.checked()) {
    push(); noFill(); stroke(120); strokeWeight(1); rect(x0, y0, w, h); pop();
  }

  // crop & scale into 28×28 buffer
  const roi = get(x0, y0, w, h);
  pg.push(); pg.background(bg); pg.image(roi, 0, 0, 28, 28); pg.pop();

  // tensor → predict
  const input = tf.tidy(() => tf.browser.fromPixels(pg.elt, 1).toFloat().div(255).expandDims(0));
  const out = model.predict(input);

  out.array().then(arr => {
    const probs = arr[0];
    const idx = probs.indexOf(Math.max(...probs));
    const conf = probs[idx];
    const tau = 0.6;
    const label = conf < tau ? "unknown" : classes[idx];

    // turn bbox into a Shape instance (centre + fitted size)
    const cx = x0 + w / 2;
    const cy = y0 + h / 2;
    const side = Math.min(w, h);
    const size = side * (1 - fitMargin * 2);
    const strokeW = Math.max(4, Math.min(20, size * 0.07));

    shapes.push(new Shape(label, cx, cy, size, strokeW));

    // clear scribble + redraw all canonical shapes
    renderAll();
  }).finally(() => tf.dispose([input, out]));

  // reset bbox state for next drawing
  drewAnything = false;
  minX = width; minY = height;
  maxX = 0;     maxY = 0;
}

function renderAll() {
  background(bg);
  for (const s of shapes) s.draw();
}

function drawStar(x, y, r1, r2, npoints) {
  const angle = TWO_PI / npoints;
  const half = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    vertex(x + cos(a) * r2,        y + sin(a) * r2);
    vertex(x + cos(a + half) * r1, y + sin(a + half) * r1);
  }
  endShape(CLOSE);
}

function insideCanvas(x, y) {
  return x >= 0 && x < width && y >= 0 && y < height;
}
