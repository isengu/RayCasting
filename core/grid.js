class Grid {
  constructor(map, canvas) {
    this.map = map;
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cellSize = this.width / this.map.length;
  }
  getCellRowColId(x, y) {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
  }
  getCellCoord(x, y) {
    return [Math.floor(x / this.cellSize) * this.cellSize, Math.floor(y / this.cellSize) * this.cellSize];
  }
}