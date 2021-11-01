class Player extends Grid {
  constructor(x, y, fov, res, map, canvas) {
    super(map, canvas);
    this.x = x; // Player's x position
    this.y = y; // Player's y position
    this.angle = 0; // Player's heading direction angle (radian)
    this.fov = fov; // Field of View (radian)
    this.res = res * this.width; // Resolution

    this.speed = 0;
    this.rotate = 0;

    this.castRays();
    this.init();
  }

  init() {
    document.addEventListener('keydown', e => {
      e.preventDefault();
      if (e.key == 'ArrowUp') this.speed = 1;
      if (e.key == 'ArrowDown') this.speed = -1;
      if (e.key == 'ArrowRight') this.rotate = radians(1);
      if (e.key == 'ArrowLeft') this.rotate = -radians(1);
    });

    document.addEventListener('keyup', e => {
      if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
        this.rotate = 0;
      }
      else if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
        this.speed = 0;
      }
    });
    
    this.canvas.fill('rgb(29, 236, 71)');
    this.canvas.text(this.width / 2, this.height / 2, 
                      'Move using arrow keys or joystick', 
                      '24px serif', 'center');
    this.update();
  }

  update() {
    if(this.speed || this.rotate){
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.angle += this.rotate;
      this.angle = this._normalize(this.angle);
      this.castRays();
    }
    requestAnimationFrame(this.update.bind(this));
  }

  castRays() {
    // Draw the background
    this.canvas.fill('lightblue');
    this.canvas.rect(0, 0, this.width, this.height/2);
    this.canvas.fill('brown')
    this.canvas.rect(0, this.height/2, this.width, this.height);
    
    const disPP = (this.res / 2) / Math.tan(this.fov / 2); // Distance from player to the projection plane

    const maxValueOfSliceHeight = disPP / this.cellSize;

    for(let i = -this.res / 2; i <= this.res / 2; i++) {

      const rawAng = Math.atan(i / disPP); // Ray's angle according to the player's angle
      const totalAng = this._normalize(this.angle + rawAng); // Ray's angle in the coordinate system
      const id = i + this.res / 2; // Ray's id among others
      
      const [mapX, mapY] = this.getCellCoord(this.x, this.y); // The cell's x-y coordinate which the player in
      let [col, row] = this.getCellRowColId(this.x, this.y); // The cell's column and row ids which the player in
      
      let stepX = 1; // Is ray's heading right or left
      let stepY = 1; // Is ray's heading up or down
      
      const deltaDistX = Math.abs(this.cellSize / Math.cos(totalAng)); // How long does the ray has to go to rach to the next column from the previous one
      const deltaDistY = Math.abs(this.cellSize / Math.sin(totalAng)); // How long does the ray has to go to rach to the next row from the previous one

      // "/" is represts the ray
      //
      // deltaDistX is equals 8 of "/" chars in the below diagram
      // deltaDistY is equals 5 of "/" chars in the below diagram
      // _________________________
      // |-----------|-----------|
      // |-----------|-----------|
      // |-----------|----------/|  ----------------------------------------------------- }
      // |-----------|---------/-|  ----------------------------------------------------- }
      // |-----------|--------/--|  ----------------------------------------------------- }
      // _________________________  ----------------------------------------------------- }
      // |-----------|------/----| - }  ------------------------------------------------- } This part of the ray is equals to the deltaDistX
      // |-----------|-----/-----| - }  ------------------------------------------------- }
      // |-----------|----/------| - } This part of the ray is equals to the deltaDistY - }
      // |-----------|---/-------| - }  ------------------------------------------------- }
      // |-----------|--/--------| - }  ------------------------------------------------- }
      // _________________________

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
        dX = mapX + this.cellSize - this.x;
      }
      // ---------Vertical----------
      if (totalAng > Math.PI) { // The ray is heading to up
        stepY = -1;
        dY = this.y - mapY;
      }
      else if (totalAng < Math.PI) { // The ray is heading to down
        dY = mapY + this.cellSize - this.y;
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

      this.drawSlice(id, sliceHeight, maxValueOfSliceHeight);
    }

    this.drawMinimap(this.x, this.y, 100, 0, this.width - 100);
  }

  drawSlice(id, sliceHeight, maxValue) {
    const singleWidth = this.width / this.res;
    const strokeHeight = fmap(sliceHeight, 0, maxValue, 0, this.height);
    const sliceLight = fmap(sliceHeight, 0, maxValue, 0, 255);

    this.canvas.stroke(false);
    this.canvas.fill(`rgb(${sliceLight}, ${sliceLight}, ${sliceLight})`);
    this.canvas.rect(singleWidth * id, 
                      (this.height - strokeHeight) / 2, 
                      singleWidth, strokeHeight);
  }

  drawMinimap(playerX, playerY, minimapSize, top = 0, left = 0) {
    this.canvas.stroke('green');
    const minimapCellSize = minimapSize / this.map.length;
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[0].length; j++) {
        if (this.map[i][j] === 0) this.canvas.fill('green');
        else this.canvas.fill('red');
        this.canvas.rect(j * minimapCellSize + left, 
                          i * minimapCellSize + top, 
                          minimapCellSize, 
                          minimapCellSize);
      }
    }
    this.canvas.fill('yellow');
    this.canvas.circle(playerX / this.width * minimapSize + left, 
                        playerY / this.width * minimapSize + top, 3);
  }

  _normalize(a) {
    if (a > Math.PI * 2) return a - Math.PI * 2;
    if (a < 0) return a + Math.PI * 2;
    return a;
  }
}