const canvas = document.getElementById("canvas").getContext("2d");
const neighbourEl = document.getElementById("neighbours");
let cells = [];
const xCount = 64;
const yCount = 64;
const cellSize = 8;
canvas.canvas.width = xCount * cellSize;
canvas.canvas.height = yCount * cellSize;
canvas.strokeStyle = "#e1e1e1";
const markStyle = "yellow";
const aliveStyle = "cadetblue";

canvas.fillStyle = aliveStyle;

init();

async function init() {
  console.log("init");
  for (let x = 0; x < xCount; x++) {
    cells[x] = [];
    for (let y = 0; y < yCount; y++) {
      cells[x][y] = 0;
    }
  }
  [
    // Gosper glider gun
    [1, 5],
    [1, 6],
    [2, 5],
    [2, 6],
    [11, 5],
    [11, 6],
    [11, 7],
    [12, 4],
    [12, 8],
    [13, 3],
    [13, 9],
    [14, 3],
    [14, 9],
    [15, 6],
    [16, 4],
    [16, 8],
    [17, 5],
    [17, 6],
    [17, 7],
    [18, 6],
    [21, 3],
    [21, 4],
    [21, 5],
    [22, 3],
    [22, 4],
    [22, 5],
    [23, 2],
    [23, 6],
    [25, 1],
    [25, 2],
    [25, 6],
    [25, 7],
    [35, 3],
    [35, 4],
    [36, 3],
    [36, 4]
  ].forEach(function(point) {
    cells[point[0]][point[1]] = 1;
  });
  await draw();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function countNeighbours(x1, y1) {
  let count = 0;
  // count living neighbours
  for (let x = -1; x < 2; x++) {
    if (x + x1 < 0 || x + x1 > 63) continue;

    for (let y = -1; y < 2; y++) {
      if (y + y1 < 0 || y + y1 > 63) continue;

      if (x === 0 && y === 0) continue;

      count += cells[x + x1][y + y1];
    }
  }
  return count;
}

async function update() {
  // check which cells should be alive in next generation.
  let newCells = [];
  for (let x = 0; x < xCount; x++) {
    newCells[x] = [];
    for (let y = 0; y < yCount; y++) {
      newCells[x][y] = 0;

      const neighbours = await countNeighbours(x, y);

      // Hver levende celle med mer enn tre levende naboer dør, som ved overbefolkning.
      // Hver levende celle med mindre enn to levende naboer dør, som ved underbefolkning.
      // Hver døde celle med akkurat tre levende naboer blir levende, som ved reproduksjon.
      // Hver levende celle med to eller tre levende naboer, overlever til neste generasjon.

      let alive = 0;
      if (cells[x][y] > 0) {
        alive = neighbours === 2 || neighbours === 3 ? 1 : 0;
      } else {
        alive = neighbours === 3 ? 1 : 0;
      }

      newCells[x][y] = alive;
    }
  }
  cells = newCells;
  await draw();
}

async function drawCount(x, y, count) {
  if (count == 0) return;
  canvas.rect(x * cellSize, y * cellSize, cellSize, cellSize);
  canvas.fillStyle = markStyle;
  canvas.fill();
  neighbourEl.innerText = count;
  await sleep(100);
  await draw(false);
}

async function draw(doUpdate = true) {
  canvas.clearRect(0, 0, xCount * cellSize, yCount * cellSize);
  cells.forEach(function(row, x) {
    row.forEach(function(cell, y) {
      canvas.beginPath();
      canvas.rect(x * cellSize, y * cellSize, cellSize, cellSize);
      if (cell) {
        canvas.fillStyle = aliveStyle;
        canvas.fill();
      } else {
        canvas.stroke();
      }
    });
  });
  if (doUpdate) {
    setTimeout(function() {
      update();
    }, 50);
  }
  //window.requestAnimationFrame(update); // Fast for small grids!
}
