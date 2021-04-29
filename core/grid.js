class Grid {
  constructor(map) {
    this.map = map;
    this.cellSize = (width/2) / this.map.length;

    this.show();
  }

  show() {
    for(let i = 0; i < this.map.length; i++) {
      for(let j = 0; j < this.map[0].length; j++) {
        if(this.map[i][j] === 0) ctx.fillStyle = 'white';
        else ctx.fillStyle = 'gray';
        ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }

  getCell(x, y) {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
  }
  getCellPos(x, y) {
    return [Math.floor(x / this.cellSize) * this.cellSize, Math.floor(y / this.cellSize) * this.cellSize];
  }
}