window.onload = () => {
  const boardEl = document.querySelector('.board');
  
  fetchBoard(boardEl);
  
  document.body.addEventListener('keydown', event => {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      postMove({ move: event.keyCode }, boardEl);
    }
  });
};

function renderBoard(board, boardEl) {
  emptyElement(boardEl);
  
  board.forEach(row => {
    let rowEl = document.createElement('tr');
    rowEl.classList.add('row');

    row.forEach(square => {
      let squareEl = document.createElement('td');
      squareEl.classList.add('square');

      squareEl.innerHTML = square;

      rowEl.appendChild(squareEl);
    })

    boardEl.appendChild(rowEl);
  });
};

function emptyElement(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
};

function fetchBoard(boardEl) {
  fetch('getBoard')
  .then(res => res.json())
  .then(data => {
    renderBoard(data, boardEl);
  })
  .catch(err => console.error(err));
};

function postMove(data, boardEl) {
  fetch('postMove', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => fetchBoard(boardEl))
  .catch(err => console.error(err));
};
