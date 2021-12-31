

export const genPlacementBoard = function() {
    const board = document.querySelector('#board');

    for (let i = 0; i < 10; i++) {
        let divRow = document.createElement('div');
        divRow.classList.add('row');
        board.appendChild(divRow);
        for (let j = 0; j < 10; j++) {
            let divSquare = document.createElement('div');
            divSquare.classList.add('square');
            divRow.appendChild(divSquare);
        }
    }
}

export const pendingFunc = function() {
    // tbd
}