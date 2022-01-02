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

  const checkHit = function (hitCoords) {
    for (let i = 0; i < shipArray.length; i++) {
      for (let j = 0; j < shipArray[i].coords.length; j++) {
        if (checkArrayEquality(shipArray[i].coords[j], hitCoords)) {
          shipArray[i].ship.hit(j);
          return true;
        }
      }
    }
    logMiss(hitCoords);
    return false;
  };

  const checkMisses = function () {
    return missArray;
  };

  const getShips = function () {
    return shipArray;
  };

  return { placeShip, checkFleetSunk, checkHit, checkMisses, getShips };
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

  const debugGetBoard = function() {
    return playerBoard;
  }

  const receiveHit = function (hitCoords) {
    playerBoard.checkHit(hitCoords);
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
    return [firstCoord[Math.floor(Math.random() * 10)], Math.floor(Math.random() * 10) + 1];
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
  const genValidMove = function () {
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

  // makes coordinates numerical so they can be used
  // by checkValidPlacement
  const convertLetterCoordsToID = function(coords) {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let firstCoord = coords[0];
    let firstCoordNum = letters.indexOf(firstCoord);
    return [firstCoordNum, coords[1]];
  }

  // generates a blank board of numerical coords
  const genNumCoordBoard = function() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        board.push([i,j]);
      }
    }
    return board;
  }

  // used by checkValidPlacement to find locations 
  // in AI's game board where ships are present
  const getIndex = function(board, coord) {
    for (let i = 0; i < board.length; i++) {
      if (checkArrayEquality(board[i], coord)) return i;
    }
    return -1;
  }

  // works
  // generates blank board
  // gets coordinates for all ships currently 
  // stored by AI
  // marks the board where ships are currently placed
  const checkValidPlacement = function() {
    const board = genNumCoordBoard();
    storeShip(5, ["C",6], 'vertical');
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
  }

  const AIGenPlaceRandomShip = function() {
    // generates a random coordinate pair plus 
    // a randomly chosen orientation
    const orients = ['horizontal', 'vertical'];
    const row = Math.floor(Math.random()*10);
    const square = Math.floor(Math.random()*10);
    const coinFlip = Math.floor(Math.random()*2);
    return [row, square, orients[coinFlip]];
  }

  const AIGenPlaceFullShipCoords = function(len, row, square, orient) {
    const coordsArray = [];
    if (orient === 'horizontal') {
      if (square+len-1 > 9) return false;
      for (let i = 0; i < len; i++) {
        coordsArray.push([row, square+i]);
      }
    }
    if (orient === 'vertical') {
      if (row+len-1 > 9) return false;
      for (let i = 0; i < len; i++) {
        coordsArray.push([row+i,square]);
      }
    }
    return coordsArray;
}

  const AIGenPlacements = function() {
    const shipLengths = [5, 4, 3, 2, 2];
    for (let i = 0; i < 5; i++) {
      let len = shipLengths[i];
      let shipCoords;
      let j = 0;
      while (true) {
        let randomShip = AIGenPlaceRandomShip();
        let row = randomShip[0];
        let square = randomShip[1];
        let orient = randomShip[2];
        shipCoords = AIGenPlaceFullShipCoords(len, row,square, orient);
        console.log(shipCoords);
        if (shipCoords !== false) break;
        if (j > 1000) break;
        j++;
      }
    }
    checkValidPlacement();
  }
  // AI logic
  // special logic for if a hit is made, checks surrounding squares
  // hit made - gen's array of moves to do - does them one by one
  //

  return {
    getName,
    getHitsMadeByThisPlayer,
    storeShip,
    receiveHit,
    logPlayerAttack,
    getFleetStatus,
    getPlayerMisses,
    checkLegalMove,
    genValidMove,
    debugGetBoard,
    AIGenPlacements
  };
};