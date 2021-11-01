const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const player = new Player(320, 150, radians(80), 1, map, new Canvas(650, 325));

const joystick = new RubIt({
  container_id: 'container',
  type: 'dynamic',
  area_width: '300px',
  area_height: '300px',
  outer_rad: '150px',
  inner_rad: '90px',
  outer_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
  outer_border: 'none',
  inner_bg: 'radial-gradient(#56CCF2 0%, #2F80ED 100%)',
  inner_border: '1px solid #2F80ED'
});

joystick.on('move', function (data) {
  player.speed = fmap(data.y, 0, 1, 0, 1);
  player.rotate = fmap(data.x, -1, 1, radians(-1), radians(1));
});