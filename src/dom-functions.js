import { doc } from "prettier";
import { startGame, playerStorage } from "./game-loop";

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
  return {
    storeCoords,
    getCoords,
    clearCoords,
    storeOrientation,
    getOrientations,
  };
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
    if (checkIfValidPlacement(getShipLength(), rowNum, sqNum, getOrientation()))
      color = "darkseagreen";
    else color = "mistyrose";
    for (let i = sqNum; i < sqNum + len && i < 10; i++) {
      let square = document.querySelector(`#sq${rowNum}${i}`);
      square.style["background-color"] = color;
    }
  } else if (btnRotate.classList.contains("vertical")) {
    let color;
    if (checkIfValidPlacement(getShipLength(), rowNum, sqNum, getOrientation()))
      color = "darkseagreen";
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
  if (orientation === "horizontal") {
    for (let i = sqNum; i < sqNum + len; i++) {
      let square = document.querySelector(`#sq${rowNum}${i}`);
      if (square === null) return;
      if (square.classList.contains("ship-square")) {
        square.style["background-color"] = "dimgrey";
      } else {
        square.style["background-color"] = "darkolivegreen";
      }
    }
  } else if (orientation === "vertical") {
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

export function convIDtoCoord(row, square) {
  const firstCoord = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  return [firstCoord[row], square + 1];
}

function clickPlacementSquare() {
  const squareID = this.id;
  let rowNum = parseInt(squareID[2]);
  let sqNum = parseInt(squareID[3]);
  if (!checkIfValidPlacement(getShipLength(), rowNum, sqNum, getOrientation()))
    return;
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

const attackComputer = function() {
  // game loop is here 
  let row = parseInt(this.id[2], 10);
  let square = parseInt(this.id[3], 10);
  let coord = convIDtoCoord(row, square);
  // convert attackCoord to letter-number form
  const computer = playerStorage.getPlayers()[1];
  computer.receiveHit(coord);
  let debugBoard = computer.debugGetBoard();
  let misses = debugBoard.checkMisses();
  console.log(misses);
  // get the ships too and print them
  
  // get square ID
  // check if AI has a ship at that coord
    // if yes: 
      // turn square red
      // check if game over
      // player gets another turn
    // if no: 
      // turn square gray
  // computer attacks one of players squares
    // if hit:
      // turn square red
      // check if game over
      // computer attacks again
    // if miss:
      // turn square gray
}

export const removePlacementBoard = function () {
  const divMain = document.querySelector("#main");
  const divPlacement = document.querySelector("#placement-board");
  divMain.removeChild(divPlacement);
};

export const addShipsToPlayerBoard = function (coordsArray) {
  // coordsArray contains numerical coordinates for
  // all spots occupied by player ships
  for (let i = 0; i < coordsArray.length; i++) {
    let row = coordsArray[i][0];
    let square = coordsArray[i][1];
    let boardSquare = document.querySelector(`#pl${row}${square}`);
    boardSquare.classList.remove("square");
    boardSquare.classList.add("ship-square");
  }
};

const genShipBoards = function () {
  const divPlayer = document.querySelector("#player");
  const divPlayerCoordRow = document.createElement("div");
  const divPlayerSquareBlank = document.createElement("div");

  const divComputer = document.querySelector("#computer");
  const divCompCoordRow = document.createElement("div");
  const divCompSquareBlank = document.createElement("div");

  divPlayerCoordRow.classList.add("row");
  divPlayerSquareBlank.classList.add("coord-square");
  divCompCoordRow.classList.add("row");
  divCompSquareBlank.classList.add("coord-square");

  divPlayerCoordRow.appendChild(divPlayerSquareBlank);
  divCompCoordRow.appendChild(divCompSquareBlank);

  // player board
  divPlayer.appendChild(divPlayerCoordRow);
  for (let i = 0; i < 10; i++) {
    const coords = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let divRow = document.createElement("div");
    divRow.classList.add("row");
    divPlayer.appendChild(divRow);
    for (let j = 0; j < 10; j++) {
      if (j === 0) {
        let divCoord = document.createElement("div");
        let divCoordNum = document.createElement("div");
        divCoord.classList.add("coord-square");
        divCoordNum.classList.add("coord-square");
        divCoord.textContent = `${coords[i]}`;
        divCoordNum.textContent = `${i + 1}`;
        divRow.appendChild(divCoord);
        divPlayerCoordRow.appendChild(divCoordNum);
      }
      let divSquare = document.createElement("div");
      divSquare.classList.add("square");
      divSquare.setAttribute("id", `pl${i}${j}`);
      divRow.appendChild(divSquare);
    }
  }

  // computer board
  divComputer.appendChild(divCompCoordRow);
  for (let i = 0; i < 10; i++) {
    const coords = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let divRow = document.createElement("div");
    divRow.classList.add("row");
    divComputer.appendChild(divRow);
    for (let j = 0; j < 10; j++) {
      if (j === 0) {
        let divCoord = document.createElement("div");
        let divCoordNum = document.createElement("div");
        divCoord.classList.add("coord-square");
        divCoordNum.classList.add("coord-square");
        divCoord.textContent = `${coords[i]}`;
        divCoordNum.textContent = `${i + 1}`;
        divRow.appendChild(divCoord);
        divCompCoordRow.appendChild(divCoordNum);
      }
      let divSquare = document.createElement("div");
      divSquare.classList.add("square");
      divSquare.setAttribute("id", `co${i}${j}`);
      divSquare.addEventListener("mouseover", () => {
        if (divSquare.classList.contains("square")) {
          divSquare.classList.remove("square");
          divSquare.classList.add("hover-square");
        }
      });
      divSquare.addEventListener("mouseout", () => {
        if (divSquare.classList.contains("hover-square")) {
          divSquare.classList.remove("hover-square");
          divSquare.classList.add("square");
        }
      });
      divSquare.addEventListener("click", attackComputer);
      divRow.appendChild(divSquare);
    }
  }
};

export const genGameBoard = function () {
  const divMain = document.querySelector("#main");
  const divGameBoard = document.createElement("div");
  const divPlayer = document.createElement("div");
  const divComputer = document.createElement("div");
  const h3PlayerTitle = document.createElement("h3");
  const h3ComputerTitle = document.createElement("h3");

  divGameBoard.setAttribute("id", "game-div");
  divPlayer.setAttribute("id", "player");
  divComputer.setAttribute("id", "computer");
  divPlayer.classList.add("player-div");
  divComputer.classList.add("player-div");

  h3PlayerTitle.textContent = "Player";
  h3ComputerTitle.textContent = "Computer";

  divMain.appendChild(divGameBoard);
  divGameBoard.appendChild(divPlayer);
  divPlayer.appendChild(h3PlayerTitle);
  divGameBoard.appendChild(divComputer);
  divComputer.appendChild(h3ComputerTitle);

  genShipBoards();
};
