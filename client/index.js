window.onload = () => {
  const boardEl = document.querySelector('.board');
  const alertEl = document.querySelector('.alert');
  const restartButtonEl = document.querySelector('.restart-button');
  
  fetchBoard(boardEl);
  
  document.body.addEventListener('keydown', event => {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      postMove({ move: event.keyCode }, boardEl, alertEl);
    }
  });

  restartButtonEl.addEventListener('click', event => {
    restartGame(boardEl, alertEl);
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

function postMove(data, boardEl, alertEl) {
  fetch('postMove', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) alertEl.innerHTML = data.error;
    if (!data.error) alertEl.innerHTML = '';

    fetchBoard(boardEl);
  })
  .catch(err => console.error(err));
};

function restartGame(boardEl, alertEl) {
  fetch('restart', {
    method: 'PUT'
  })
  .then(res => {
    fetchBoard(boardEl);
    alertEl.innerHTML = '';
  })
  .catch(err => console.error(err));
};
