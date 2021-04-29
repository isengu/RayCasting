const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const radians = (a) => a * Math.PI / 180;

const grid = new Grid(map);
const player = new Player(320, 150, 0, radians(80), 500);

let s;
let a;

setInterval(function () {
  if(a || s) {
    player.update(s, radians(a));
  }
}, 40);

document.addEventListener('keydown', e => {
  // e.preventDefault();
  if (e.key == 'ArrowUp') s = 2;
  if (e.key == 'ArrowDown') s = -2;
  if (e.key == 'ArrowRight') a = 3;
  if (e.key == 'ArrowLeft') a = -3;
});

document.addEventListener('keyup', e => {
  if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
    a = 0;
  }
  else if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
    s = 0;
  }
});