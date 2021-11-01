class Canvas {
  constructor(w = 400, h = 400) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas';
    this.canvas.width = w;
    this.canvas.height = h;
    document.body.appendChild(this.canvas);
    this.c = this.canvas.getContext('2d');

    this.noFill = false;
    this.noStroke = false;
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }

  fill(v) {
    if (v) {
      this.c.fillStyle = v;
      this.noFill = false;
    }
    else {
      this.noFill = true;
    }
  }
  stroke(v) {
    if (v) {
      this.c.strokeStyle = v;
      this.noStroke = false;
    }
    else {
      this.noStroke = true;
    }
  }
  lineWidth(v) {
    this.c.lineWidth = v;
  }

  line(x1, y1, x2, y2) {
    this.c.beginPath();
    this.c.moveTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.closePath();
    this.c.stroke();
  }
  rect(x, y, w, h) {
    if (!this.noFill) this.c.fillRect(x, y, w, h);
    if (!this.noStroke) this.c.strokeRect(x, y, w, h);
  }
  circle(x, y, r) {
    this.c.beginPath();
    this.c.arc(x, y, r, 0, Math.PI * 2, false);
    if (!this.noFill) this.c.fill();
    if (!this.noStroke) this.c.stroke();
    this.c.closePath();
  }
  triangle(x1, y1, x2, y2, x3, y3) {
    this.c.beginPath();
    this.c.moveTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.lineTo(x3, y3);
    this.c.lineTo(x1, y1);
    if (!this.noFill) this.c.fill();
    if (!this.noStroke) this.c.stroke();
  }
  text(x, y, text, font = '20px serif', align = 'start') {
    this.c.font = font;
    this.c.textAlign = align;
    if (!this.noFill) this.c.fillText(text, x, y);
    else this.c.strokeText(text, x, y);
  }
  background(c) {
    this.fill(c);
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  clear() {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}