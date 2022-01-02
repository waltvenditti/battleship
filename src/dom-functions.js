import { startGame } from "./game-loop";

// module to store coordinates for access by main loop
export const coordsStorage = (() => {
  const coords = [];
  const orientations = [];
  const storeCoords = (row, square) => {
    let properCoord = convIDtoCoord(row, square);
    coords.push(properCoord);
  };
  const storeOrientation = (orien) => {
    orientations.push(orien);
  };
  const getCoords = () => coords;
  const getOrientations = () => orientations;
  const clearCoords = () => {
    while (coords.length > 0) coords.pop();
  };
  return { storeCoords, getCoords, clearCoords, storeOrientation, getOrientations };
})();

export const genPlacementBoard = function () {
  const board = document.querySelector("#board");
  const divCoordRow = document.createElement("div");
  const divSquareBlank = document.createElement("div");

  divCoordRow.classList.add("row");
  divSquareBlank.classList.add("coord-square");

  divCoordRow.appendChild(divSquareBlank);
  board.appendChild(divCoordRow);

  for (let i = 0; i < 10; i++) {
    const coords = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let divRow = document.createElement("div");
    divRow.classList.add("row");
    board.appendChild(divRow);
    for (let j = 0; j < 10; j++) {
      if (j === 0) {
        let divCoord = document.createElement("div");
        let divCoordNum = document.createElement("div");
        divCoord.classList.add("coord-square");
        divCoordNum.classList.add("coord-square");
        divCoord.textContent = `${coords[i]}`;
        divCoordNum.textContent = `${i + 1}`;
        divRow.appendChild(divCoord);
        divCoordRow.appendChild(divCoordNum);
      }
      let divSquare = document.createElement("div");
      divSquare.classList.add("square");
      divSquare.setAttribute("id", `sq${i}${j}`);
      divSquare.addEventListener("mouseover", hoverOnPlacementSquare);
      divSquare.addEventListener("mouseout", hoverOffPlacementSquare);
      divSquare.addEventListener("click", clickPlacementSquare);
      divRow.appendChild(divSquare);
    }
  }
};

export const addButtonFunctionality = function () {
  const btnRotate = document.querySelector("#rotate-button");
  const btnReset = document.querySelector("#reset-button");

  btnRotate.addEventListener("click", () => {
    if (btnRotate.classList.contains("horizontal")) {
      btnRotate.classList.remove("horizontal");
      btnRotate.classList.add("vertical");
    } else {
      btnRotate.classList.remove("vertical");
      btnRotate.classList.add("horizontal");
    }
  });

  btnReset.addEventListener("click", () => {
    const board = document.querySelector("#board");
    const shipName = document.querySelector("#ship-name");
    while (board.lastChild) {
      board.removeChild(board.lastChild);
    }
    genPlacementBoard();
    shipName.textContent = "Carrier";
    coordsStorage.clearCoords();
  });
};

function getShipLength() {
  const shipName = document.querySelector("#ship-name");
  const name = shipName.textContent;
  if (name === "Carrier") return 5;
  if (name === "Battleship") return 4;
  if (name === "Destroyer") return 3;
  if (name === "Submarine") return 2;
  if (name === "Torpedo Boat") return 2;
  return 1;
}

function getOrientation() {
  const btnRotate = document.querySelector("#rotate-button");
  if (btnRotate.classList.contains("horizontal")) return "horizontal";
  if (btnRotate.classList.contains("vertical")) return "vertical";
}

function hoverOnPlacementSquare(inputID) {
  let squareID;
  if (typeof inputID === "object") squareID = this.id;
  else squareID = inputID;
  let rowNum = parseInt(squareID[2]);
  let sqNum = parseInt(squareID[3]);
  let len = getShipLength();
  if (len === 1) return;
  let btnRotate = document.querySelector("#rotate-button");

  if (btnRotate.classList.contains("horizontal")) {
    let color;
    if (checkIfValidPlacement(getShipLength(), rowNum, sqNum, getOrientation())) color = "darkseagreen";
    else color = "mistyrose";
    for (let i = sqNum; i < sqNum + len && i < 10; i++) {
      let square = document.querySelector(`#sq${rowNum}${i}`);
      square.style["background-color"] = color;
    }
  } else if (btnRotate.classList.contains("vertical")) {
    let color;
    if (checkIfValidPlacement(getShipLength(), rowNum, sqNum, getOrientation())) color = "darkseagreen";
    else color = "mistyrose";
    for (let i = rowNum; i < rowNum + len && i < 10; i++) {
      let square = document.querySelector(`#sq${i}${sqNum}`);
      square.style["background-color"] = color;
    }
  }
}

function hoverOffPlacementSquare() {
  let squareID = this.id;
  let rowNum = parseInt(squareID[2]);
  let sqNum = parseInt(squareID[3]);
  let len = getShipLength();
  let btnRotate = document.querySelector("#rotate-button");
  let orientation = getOrientation();
  if (orientation === 'horizontal') {
    for (let i = sqNum; i < sqNum + len; i++) {
      let square = document.querySelector(`#sq${rowNum}${i}`);
      if (square === null) return;
      if (square.classList.contains("ship-square")) {
        square.style["background-color"] = "dimgrey";
      } else {
        square.style["background-color"] = "darkolivegreen";
      }
    }
  } else if (orientation === 'vertical') {
    for (let i = rowNum; i < rowNum + len && i < 10; i++) {
      let square = document.querySelector(`#sq${i}${sqNum}`);
      if (square.classList.contains("ship-square")) {
        square.style["background-color"] = "dimgrey";
      } else {
        square.style["background-color"] = "darkolivegreen";
      }
    }
  }
}

function incrementShipName() {
  const shipName = document.querySelector("#ship-name");
  const name = shipName.textContent;
  if (name === "Carrier") return "Battleship";
  if (name === "Battleship") return "Destroyer";
  if (name === "Destroyer") return "Submarine";
  if (name === "Submarine") return "Torpedo Boat";
  if (name === "Torpedo Boat") return null;
}

function checkIfValidPlacement(len, row, square, orientation) {
  if (orientation === "horizontal") {
    if (square + len - 1 >= 10) return false;
    for (let i = square; i < square + len; i++) {
      let sq = document.querySelector(`#sq${row}${i}`);
      if (sq.classList.contains("ship-square")) {
        return false;
      }
    }
  }
  if (orientation === "vertical") {
    if (row + len - 1 >= 10) return false;
    for (let i = row; i < row + len; i++) {
      let sq = document.querySelector(`#sq${i}${square}`);
      if (sq.classList.contains("ship-square")) {
        return false;
      }
    }
  }
  return true;
}

function convIDtoCoord(row, square) {
  const firstCoord = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  return [firstCoord[row], square + 1];
}

function clickPlacementSquare() {
  const squareID = this.id;
  let rowNum = parseInt(squareID[2]);
  let sqNum = parseInt(squareID[3]);
  if (!checkIfValidPlacement(getShipLength(), rowNum, sqNum, getOrientation())) return;
  if (coordsStorage.getCoords().length === 5) {
    return;
  }

  const spanShipName = document.querySelector("#ship-name");
  spanShipName.textContent = incrementShipName();
  const squares = document.querySelectorAll(".square");
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].style["background-color"] === "darkseagreen") {
      squares[i].classList.remove("square");
      squares[i].classList.add("ship-square");
      squares[i].style["background-color"] = "dimgrey";
    }
  }
  const newSquares = document.querySelectorAll(".square");
  for (let i = 0; i < newSquares.length; i++) {
    newSquares[i].style["background-color"] = "darkolivegreen";
  }
  hoverOnPlacementSquare(this.id);
  coordsStorage.storeCoords(rowNum, sqNum);
  coordsStorage.storeOrientation(getOrientation());
  if (coordsStorage.getCoords().length === 5) {
    startGame();
  }
}
