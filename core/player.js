class Player {
  constructor(x, y, angle, fov, res) {
    this.x = x; // Player's x position
    this.y = y; // Player's y position
    this.angle = angle; // Player's heading direction angle (radian)
    this.fov = fov; // Field of View (radian)
    this.res = res; // Resolution
  }

  update(s, a) {
    if(s){
      this.x += Math.cos(this.angle) * s;
      this.y += Math.sin(this.angle) * s;
    }
    if(a) {
      this.angle += a;
      this.angle = this._normalize(this.angle);
    }
    this.castRays();
  }

  castRays() {
    const time = new Date();

    grid.show();
    ctx.fillStyle = 'black';
    ctx.fillRect(width / 2, 0, width / 2, height);
    
    const disPP = (this.res / 2) / Math.tan(this.fov / 2); // Distance from player to the projection plane

    for(let i = -this.res / 2; i <= this.res / 2; i++) {

      const rawAng = Math.atan(i / disPP); // Ray's angle according to the player's angle
      const totalAng = this._normalize(this.angle + rawAng); // Ray's angle in the coordinate system
      const id = i + this.res / 2; // Ray's id among others
      
      const [mapX, mapY] = grid.getCellPos(this.x, this.y); // The cell's x-y coordinate which the player in
      let [col, row] = grid.getCell(this.x, this.y); // The cell's column and row ids which the player in
      
      let stepX = 1; // Is ray's heading to right or left
      let stepY = 1; // Is ray's heading to up or down
      
      const deltaDistX = Math.abs(grid.cellSize / Math.cos(totalAng)); // How long does the ray has to go to rach to the next column from the previous one
      const deltaDistY = Math.abs(grid.cellSize / Math.sin(totalAng)); // How long does the ray has to go to rach to the next row from the previous one

      // "/" is represts the ray
      //
      // deltaDistX is equals 8 of "/" chars in the below diagram
      // deltaDistY is equals 5 of "/" chars in the below diagram
      // -------------------------
      // |-----------|-----------|
      // |-----------|-----------|
      // |-----------|----------/|  ----------------------------------------------------- }
      // |-----------|---------/-|  ----------------------------------------------------- }
      // |-----------|--------/--|  ----------------------------------------------------- }
      // -------------------------  ----------------------------------------------------- }
      // |-----------|------/----| - }  ------------------------------------------------- } This part of the ray is equals to the deltaDistX
      // |-----------|-----/-----| - }  ------------------------------------------------- }
      // |-----------|----/------| - } This part of the ray is equals to the deltaDistY - }
      // |-----------|---/-------| - }  ------------------------------------------------- }
      // |-----------|--/--------| - }  ------------------------------------------------- }
      // -------------------------

      let dX, dY; // Used for calculating the sideDistX and sideDistY
      let sideDistX, sideDistY; // Initially ray's distance to the cell's walls which player is in, afterwards adds deltaSideX-Y until hit a wall to get the distance to the wall
      
      // "/" is represents the ray
      // "@" is reqresents the player (ray's start point)
      //
      // sideDistX is initially equals 2 of "/" chars in the below diagram
      // sideDistY is initially equals 3 of "/" chars in the below diagram
      //
      // dX is equals to "_" chars long in the below diagram
      // dY is equals to "}" chars long in the below diagram
      // -------------------------
      // |-----------|/----------|  -- }
      // |----------/|-----------|  -- } dY
      // |---------/-|-----------|  -- }
      // |--------@__|-----------|
      // |-----------|-----------|
      // -------------------------
      //          ___ } dX
      

      // --------Horizontal---------
      if (totalAng < 3 * Math.PI / 2 && totalAng > Math.PI / 2) { // The ray is heading to left
        stepX = -1;
        dX = this.x - mapX;
      }
      else if (totalAng < Math.PI / 2 || totalAng > 3 * Math.PI / 2) { // The ray is heading to right
        dX = mapX + grid.cellSize - this.x;
      }
      // ---------Vertical----------
      if (totalAng > Math.PI) { // The ray is heading to up
        stepY = -1;
        dY = this.y - mapY;
      }
      else if (totalAng < Math.PI) { // The ray is heading to down
        dY = mapY + grid.cellSize - this.y;
      }

      sideDistX = Math.abs(dX / Math.cos(totalAng));
      sideDistY = Math.abs(dY / Math.sin(totalAng));


      // Adds deltaSideX-Y to sideDistX-Y until hit a wall to get the distance to the wall
      let hit = 1;
      let side = 0;
      while (hit) {
        if (sideDistX < sideDistY) {
          // next x
          sideDistX += deltaDistX;
          col += stepX;
          side = 0;
        }
        else {
          // next y
          sideDistY += deltaDistY;
          row += stepY;
          side = 1;
        }

        if (map[row][col]) {
          if (side) sideDistY -= deltaDistY;
          else sideDistX -= deltaDistX;
          hit = 0;
        }
      }
      
      const rawDistToWall = Math.min(sideDistY, sideDistX);
      const distToWall = rawDistToWall * Math.cos(rawAng); // Removing fish-eye effect
      // const sliceHeight = height / distToWall; // The slice height that will be drawn on screen
      const sliceHeight = 1 / distToWall * disPP; // The slice height that will be drawn on screen

      // 2D
      // ctx.strokeStyle = 'red';
      // ctx.beginPath();
      // ctx.moveTo(this.x, this.y);
      // ctx.lineTo(this.x + x, this.y + y);
      // ctx.stroke();

      // 3D
      const singleWidth = ((width / 2) / this.res);
      const strokeHeight = this._map(sliceHeight, 0, 10, 0, 255);
      const bright = this._map(sliceHeight, 0, 10, 0, 1);

      ctx.fillStyle = `rgba(255, 255, 255, ${bright})`;
      ctx.fillRect(width / 2 + singleWidth * id, (height - strokeHeight) / 2, singleWidth, strokeHeight);
    }

    const right = this._normalize(this.angle + this.fov/2);
    const left = this._normalize(this.angle - this.fov/2);
    const [xr, yr] = [10 * Math.cos(right), 10 * Math.sin(right)];
    const [xf, yf] = [10 * Math.cos(left), 10 * Math.sin(left)];
    const [xd, yd] = [10 * Math.cos(this.angle), 10 * Math.sin(this.angle)];
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + xr, this.y + yr);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + xf, this.y + yf);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + xd, this.y + yd);
    ctx.stroke();

    document.getElementById('fps').innerHTML = `${Math.floor(1000 / (new Date() - time))}fps`;
    return;
  }

  _normalize(a) {
    if (a > Math.PI * 2) return a - Math.PI * 2;
    if (a < 0) return a + Math.PI * 2;
    return a;
  }

  _map(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  };
}