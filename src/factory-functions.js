import { convIDtoCoord } from "./dom-functions";

export const convertLetterCoordsToID = function (coords) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  let firstCoord = coords[0];
  let firstCoordNum = letters.indexOf(firstCoord);
  return [firstCoordNum, coords[1] - 1];
};

export const shipFactory = (length) => {
  if (length < 2 || length > 5 || length === undefined) {
    return null;
  }

  const hitArray = [];
  const shipSize = length;
  let sunk = false;

  for (let i = 0; i < shipSize; i++) {
    hitArray.push(false);
  }

  const isSunk = function () {
    if (hitArray.indexOf(false) === -1) {
      sunk = true;
    }
  };
  const hit = function (location) {
    hitArray[location] = true;
    isSunk();
  };

  const getLength = function () {
    return shipSize;
  };
  const getHitStatus = function () {
    return hitArray;
  };
  const getSunkStatus = function () {
    return sunk;
  };

  return { getLength, getHitStatus, getSunkStatus, hit };
};

export function getCoords(shipLength, firstCoord, orientation) {
  // first coord is something like ['C',5]
  // valid coords are A-J, 1-10
  // orientation is either 'vertical' or 'horizontal'
  let coords = [firstCoord];

  if (orientation === "horizontal") {
    if (firstCoord[1] + shipLength - 1 > 10) return null;
    for (let i = 1; i < shipLength; i++) {
      coords.push([firstCoord[0], firstCoord[1] + i]);
    }
  } else {
    // orientation = 'vertical'
    const coordCharCode = firstCoord[0].charCodeAt();
    // 74 is J in below if statement
    if (coordCharCode + shipLength - 1 > 74) return null;
    for (let i = 1; i < shipLength; i++) {
      coords.push([String.fromCharCode(coordCharCode + i), firstCoord[1]]);
    }
  }
  return coords;
}

// helper
export function checkArrayEquality(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export const gameboardFactory = () => {
  const shipArray = [];
  const missArray = [];
  const hitArray = [];

  const placeShip = function (shipObj, firstCoord, orientation) {
    const shipCoords = getCoords(shipObj.getLength(), firstCoord, orientation);
    const boardShipObj = {
      ship: shipObj,
      coords: shipCoords,
    };
    shipArray.push(boardShipObj);
  };

  const checkFleetSunk = () => {
    if (shipArray.length === 0) return null;
    for (let i = 0; i < shipArray.length; i++) {
      if (shipArray[i].ship.getSunkStatus() === false) {
        return false;
      }
    }
    return true;
  };

  const logMiss = function (missCoord) {
    missArray.push(missCoord);
  };

  const logHit = function (hitCoord) {
    hitArray.push(hitCoord);
  }

  const checkHitInHits = function (hit) {
    for (let i = 0; i < hitArray.length; i++) {
      if (checkArrayEquality(hitArray[i], hit)) {
        return true;
      }
    }
    return false;
  }

  const checkMissInMisses = function (miss) {
    for (let i = 0; i < missArray.length; i++) {
      if (checkArrayEquality(missArray[i], miss)) {
        return true;
      }
    }
    return false;
  }

  const checkHit = function (hitCoords) {
    for (let i = 0; i < shipArray.length; i++) {
      for (let j = 0; j < shipArray[i].coords.length; j++) {
        if (checkArrayEquality(shipArray[i].coords[j], hitCoords)) {
          if (checkHitInHits(hitCoords)) {
            return null;
          }
          shipArray[i].ship.hit(j);
          logHit(hitCoords);
          return true;
        }
      }
    }
    if (checkMissInMisses(hitCoords)) {
      return null;
    } 
    logMiss(hitCoords);
    return false;
  };

  const checkMisses = function () {
    return missArray;
  };

  const checkHits = function () {
    return hitArray;
  };

  const getShips = function () {
    return shipArray;
  };

  return {
    placeShip,
    checkFleetSunk,
    checkHit,
    checkMisses,
    getShips,
    checkHits,
  };
};

export const createPlayer = function (name) {
  // type is either 'human' or 'computer'
  const playerName = name;
  const shotsMadeByPlayer = [];
  const playerBoard = gameboardFactory();

  const storeShip = function (len, coords, orientation) {
    // len: integer with value ranging from 2 to 5
    // coords: array with format ['A',1]
    // A-J and 1-10
    // orientation: string, either 'horizontal' or 'vertical'
    playerBoard.placeShip(shipFactory(len), coords, orientation);
  };

  const debugGetBoard = function () {
    return playerBoard;
  };

  const receiveHit = function (hitCoords) {
    let hitStatus = playerBoard.checkHit(hitCoords);
    return hitStatus;
  };

  const logPlayerAttack = function (attackCoords) {
    shotsMadeByPlayer.push(attackCoords);
  };

  const getName = function () {
    return playerName;
  };

  const getHitsMadeByThisPlayer = function () {
    return shotsMadeByPlayer;
  };

  const getFleetStatus = function () {
    return playerBoard.checkFleetSunk();
  };

  const getPlayerMisses = function () {
    return playerBoard.checkMisses();
  };

  const genRandomCoord = function () {
    const firstCoord = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    return [
      firstCoord[Math.floor(Math.random() * 10)],
      Math.floor(Math.random() * 10) + 1,
    ];
  };

  // checks that player has not already
  // made this move
  const checkLegalMove = function (moveCoords) {
    for (let i = 0; i < shotsMadeByPlayer.length; i++) {
      if (checkArrayEquality(shotsMadeByPlayer[i], moveCoords)) {
        return false;
      }
    }
    return true;
  };

  // generates a random coordinate for AI and
  // checks it using checkLegalMove
  const AIGenValidMove = function () {
    let randomMove = genRandomCoord();
    while (true) {
      if (checkLegalMove(randomMove)) {
        break;
      } else {
        randomMove = genRandomCoord();
      }
    }
    return randomMove;
  };

  const checkFollowupValidity = function (id) {
    const row = id[0];
    const square = id[1];
    const letterID = convIDtoCoord(row, square);
    console.log(`from checkFollowup: ${letterID}`);
    if (row > 9 || row < 0 || square > 9 || square < 0) {     
      return false;
    }
    for (let i = 0; i < shotsMadeByPlayer.length; i++) {
      if (checkArrayEquality(shotsMadeByPlayer[i], letterID)) {
        return false;
      }
    }
    return true; 
  }

  const AIGenFollowupAttacks = function (prevAtkCoords) {
    console.log(`attack at ${prevAtkCoords}`);
    const followups = [];
    const row = prevAtkCoords[0];
    const square = prevAtkCoords[1];
    const up = [row-1, square];
    const down = [row+1, square];
    const left = [row, square-1];
    const right = [row, square+1];
    if (checkFollowupValidity(up)) followups.push(up);
    if (checkFollowupValidity(down)) followups.push(down);
    if (checkFollowupValidity(left)) followups.push(left);
    if (checkFollowupValidity(right)) followups.push(right);
    console.log(followups);
    return followups;
  }

  const getIndex = function (board, coord) {
    for (let i = 0; i < board.length; i++) {
      if (checkArrayEquality(board[i], coord)) return i;
    }
    return -1;
  };

  // generates a blank board of numerical coords
  const AIGenPlaceBlankBoard = function () {
    const blankBoard = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        blankBoard.push([i, j]);
      }
    }
    return blankBoard;
  };

  const AIGenPlaceGetCurrBoard = function () {
    const board = AIGenPlaceBlankBoard();
    const ships = playerBoard.getShips();
    for (let i = 0; i < ships.length; i++) {
      let ship = ships[i];
      let coords = ship.coords;
      for (let j = 0; j < coords.length; j++) {
        let numCoord = convertLetterCoordsToID(coords[j]);
        let index = getIndex(board, numCoord);
        if (index !== -1) {
          board[index] = [null];
        }
      }
    }
    return board;
  };

  const AIGenPlaceRandomShip = function () {
    // generates a random coordinate pair plus
    // a randomly chosen orientation
    const orients = ["horizontal", "vertical"];
    const row = Math.floor(Math.random() * 10);
    const square = Math.floor(Math.random() * 10);
    const coinFlip = Math.floor(Math.random() * 2);
    return [row, square, orients[coinFlip]];
  };

  const AIGenPlaceFullShipCoords = function (len, row, square, orient) {
    const coordsArray = [];
    if (orient === "horizontal") {
      if (square + len - 1 > 9) return false;
      for (let i = 0; i < len; i++) {
        coordsArray.push([row, square + i]);
      }
    }
    if (orient === "vertical") {
      if (row + len - 1 > 9) return false;
      for (let i = 0; i < len; i++) {
        coordsArray.push([row + i, square]);
      }
    }
    return coordsArray;
  };

  const AIGenPlaceCheckCoordsAndBoard = function (board, coords) {
    for (let i = 0; i < coords.length; i++) {
      let coordInBoard = false;
      for (let j = 0; j < board.length; j++) {
        if (checkArrayEquality(coords[i], board[j])) {
          coordInBoard = true;
        }
      }
      if (coordInBoard === false) return false;
    }
    return true;
  };

  // this randomly  generates five ship positions,
  // checks they are valid in terms of board and other
  // ship locations, then stores them
  const AIGenPlacements = function () {
    const shipLengths = [5, 4, 3, 2, 2];
    for (let i = 0; i < 5; i++) {
      let len = shipLengths[i];
      let shipCoords;
      let orient;
      while (true) {
        let randomShip = AIGenPlaceRandomShip();
        let row = randomShip[0];
        let square = randomShip[1];
        orient = randomShip[2];
        shipCoords = AIGenPlaceFullShipCoords(len, row, square, orient);
        if (shipCoords !== false) break;
      }
      let currBoard = AIGenPlaceGetCurrBoard();
      if (AIGenPlaceCheckCoordsAndBoard(currBoard, shipCoords)) {
        let letterCoord = convIDtoCoord(shipCoords[0][0], shipCoords[0][1]);
        storeShip(len, letterCoord, orient);
      } else {
        i--;
      }
    }
  };

  // AI logic
  // special logic for if a hit is made, checks surrounding squares
  // hit made - gen's array of moves to do - does them one by one
  //

  const testAIGenPlacements = function () {
    const shipLengths = [5, 4, 3, 2, 2];
    // check ship count
    const shipCount = playerBoard.getShips().length;
    if (shipCount !== 5) return false;
    const ships = playerBoard.getShips();
    // check ship lengths
    for (let i = 0; i < shipCount; i++) {
      if (ships[i].ship.getLength() !== shipLengths[i]) {
        return false;
      }
    }
    // check total spots taken by all ships
    let coordCount = 0;
    for (let i = 0; i < shipCount; i++) {
      coordCount += ships[i].coords.length;
    }
    if (coordCount !== 16) return false;
    // get an array of all coords occupied by the ships
    const allCoords = [];
    for (let i = 0; i < shipCount; i++) {
      for (let j = 0; j < ships[i].coords.length; j++) {
        allCoords.push(ships[i].coords[j]);
      }
    }
    // check that there are no duplicates in the array
    for (let i = 0; i < allCoords.length; i++) {
      let occurrence = 0;
      for (let j = 0; j < allCoords.length; j++) {
        if (checkArrayEquality(allCoords[i], allCoords[j])) {
          occurrence++;
        }
      }
      if (occurrence !== 1) return false;
    }
    // check that all coords are valid board coords
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for (let i = 0; i < allCoords.length; i++) {
      let letter = allCoords[i][0];
      let number = allCoords[i][1];
      if (letters.indexOf(letter) === -1) return false;
      if (number < 1 || number > 10) return false;
    }
    return true;
  };

  const getNumericalShipCoords = function () {
    const ships = playerBoard.getShips();
    const coords = [];
    for (let i = 0; i < ships.length; i++) {
      let shipCoords = ships[i].coords;
      for (let j = 0; j < shipCoords.length; j++) {
        coords.push(convertLetterCoordsToID(shipCoords[j]));
      }
    }
    return coords;
  };

  return {
    getName,
    getHitsMadeByThisPlayer,
    storeShip,
    receiveHit,
    logPlayerAttack,
    getFleetStatus,
    getPlayerMisses,
    checkLegalMove,
    AIGenValidMove,
    debugGetBoard,
    AIGenPlacements,
    testAIGenPlacements,
    getNumericalShipCoords,
    AIGenFollowupAttacks,
  };
};
