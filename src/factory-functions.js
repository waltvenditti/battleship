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

  const genRandomNum = function () {
    // generates a random number 0 - 9
    return Math.floor(Math.random() * 10);
  };

  const genRandomCoord = function () {
    const firstCoord = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    return [firstCoord[genRandomNum()], genRandomNum() + 1];
  };

  const checkLegalMove = function (moveCoords) {
    for (let i = 0; i < shotsMadeByPlayer.length; i++) {
      if (checkArrayEquality(shotsMadeByPlayer[i], moveCoords)) {
        return false;
      }
    }
    return true;
  };

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

  const convertLetterCoordsToID = function(coords) {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let firstCoord = coords[0];
    let firstCoordNum = letters.indexOf(firstCoord);
    return [firstCoordNum, coords[1]];
  }

  const checkValidPlacement = function() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        board.push([i,j]);
      }
    }
    // storeShip(5, ["C",6], 'vertical');
    const ships = playerBoard.getShips();
    for (let i = 0; i < ships.length; i++) {
      let ship = ships[i];
      let coords = ship.coords;
      const newCoords = [];
      for (let j = 0; j < coords.length; j++) {
        let numCoord = convertLetterCoordsToID(coords[j]);
        newCoords.push(numCoord)
      }
    }
  }

  const AIGenPlacements = function() {
    const shipLengths = [5, 4, 3, 2, 2];
    const oris = ['horizontal', 'vertical'];
    for (let i = 0; i < 5; i++) {
      while (true) {
        let row = genRandomNum();
        let square = genRandomNum();
        let len = shipLengths[i];
        let ori = oris[Math.floor(Math.random()*2)];
        break;
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