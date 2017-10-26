let boardID;
const url = 'https://nameless-temple-96802.herokuapp.com/api/';
const w = 10;
const h = 10;
const mines = 5;
const root = $('#board');

function gameOver() {
  root.empty();
  root.html('Game Over!');
  console.log('Game Over!');
}

function revealBox(x, y, count) {
  $(`[data-x=${x}][data-y=${y}]`).addClass('reveal').html(count);
}

function handleBoxClick(e) {
  const x = +e.target.dataset.x;
  const y = +e.target.dataset.y;
  fetch(`${url}reveal?x=${x}&y=${y}&board=${boardID}`)
    .then(res => res.json())
    .then((reveal) => {
      reveal.data.forEach((coord) => {
        if (coord.count === -1) {
          gameOver();
        }
        revealBox(coord.x, coord.y);
      });
    });
}

function createBoard(width, height, elem) {
  for (let i = 0; i < height; i += 1) {
    const row = $('<div/>').addClass('row');
    for (let j = 0; j < width; j += 1) {
      const box = $('<button/>')
                  .addClass('box')
                  .attr({ 'data-x': j, 'data-y': height - i - 1 })
                  .click(handleBoxClick);
      row.append(box);
    }
    elem.append(row);
  }
}

$(document).ready(() => {
  fetch(`${url}init?width=${w}&height=${h}&mines=${mines}`)
  .then(res => res.json())
  .then((newgame) => {
    if (newgame.success) {
      boardID = newgame.board;
      createBoard(w, h, root);
    } else throw new Error('New Game fetch not created');
  });
});

