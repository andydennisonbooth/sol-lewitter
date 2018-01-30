// index.js

document.addEventListener('DOMContentLoaded', () => {
  const controller = new CanvasController(document.getElementById('canvas'));
  const plaque = document.getElementById('plaque');
  plaque.addEventListener('keyup', event => {
    controller.update();
    parseDirections(plaque.value, controller);
  });
  parseDirections(plaque.value, controller);
});

const parseDirections = (directions, controller) => {
    cleanedDirections = directions.toLowerCase().replace(/[^\w, ]/g, '');
    cleanedDirections.split(',').forEach(fragment => {
      try {
        const [_, color, positionInfo] = fragment.match(/(\w+) lines from ([\w ]+)/);
        controller.positionalFunctions[positionInfo](color);
      } catch(e) {
        console.log(e);
      }
    });
}

class CanvasController {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.GRID_COUNT = 14;
    this.LINE_COUNT = 10;

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));

    this.positionalFunctions = {};
    this.positionalFunctions['the midpoints of four sides'] = this.midpoint.bind(this);
    this.positionalFunctions['four corners'] = this.corner.bind(this);
    this.positionalFunctions['the center'] = this.center.bind(this);

    this.update();
  }

  update() {
    this.clearCanvas();
    this.drawGrid();
  }

  xPoints() {
    const xs = [];
    for(let counter = 1; counter < this.GRID_COUNT; counter++) {
      xs.push(this.canvas.width * counter / this.GRID_COUNT)
    }
    return xs;
  }

  yPoints() {
    const ys = [];
    for(let counter = 1; counter < this.GRID_COUNT; counter++) {
      ys.push(this.canvas.height * counter / this.GRID_COUNT)
    }
    return ys;
  }

  clearCanvas() {
    this.context.strokeStyle = null;
    this.context.fillStyle = 'White';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid() {
    const ctx = this.context;
    ctx.strokeStyle = 'LightGray';
    ctx.lineWidth = 1;

    this.xPoints().forEach(xPoint => {
      xPoint = Math.floor(xPoint) + 0.5;
      ctx.beginPath();
      ctx.moveTo(xPoint, 0);
      ctx.lineTo(xPoint, this.canvas.height);
      ctx.stroke();
    });

    this.yPoints().forEach(yPoint => {
      yPoint = Math.floor(yPoint) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, yPoint);
      ctx.lineTo(this.canvas.width, yPoint);
      ctx.stroke();
    });
  }

  resizeCanvas() {
    this.canvas.width = window.innerHeight * 0.9;
    this.canvas.height = window.innerHeight * 0.9;
  }

  midpoint(color) {
    this.context.strokeStyle = color;
    [
      [this.canvas.width / 2, 0],
      [this.canvas.width / 2, this.canvas.height],
      [0, this.canvas.height / 2],
      [this.canvas.width, this.canvas.height / 2]
    ].forEach(midpoint => {
      for(let counter = 0; counter < this.LINE_COUNT; counter++) {
        this.context.beginPath();
        this.context.moveTo(...midpoint);
        this.context.lineTo(
          this.xPoints()[Math.floor(Math.random() * this.GRID_COUNT)],
          this.yPoints()[Math.floor(Math.random() * this.GRID_COUNT)]
        );
        this.context.stroke();
      }
    });
  }

  corner(color) {
    this.context.strokeStyle = color;
    [
      [0, 0],
      [0, this.canvas.height],
      [this.canvas.width, 0],
      [this.canvas.width, this.canvas.height]
    ].forEach(corner => {
      for(let counter = 0; counter < this.LINE_COUNT; counter++) {
        this.context.beginPath();
        this.context.moveTo(...corner);
        this.context.lineTo(
          this.xPoints()[Math.floor(Math.random() * this.GRID_COUNT)],
          this.yPoints()[Math.floor(Math.random() * this.GRID_COUNT)]
        );
        this.context.stroke();
      }
    });
  }

  center(color) {
    this.context.strokeStyle = color;
    for(let counter = 0; counter < this.LINE_COUNT; counter++) {
      this.context.beginPath();
      this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
      this.context.lineTo(
        this.xPoints()[Math.floor(Math.random() * this.GRID_COUNT)],
        this.yPoints()[Math.floor(Math.random() * this.GRID_COUNT)]
      );
      this.context.stroke();
    }
  }
}
