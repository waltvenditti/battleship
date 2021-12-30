

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
}
  const hit = function (location) {
      hitArray[location] = true;
      isSunk();
  };

  const getLength = function () {
      return shipSize;
  }
  const getHitStatus = function () {
      return hitArray;
  }
  const getSunkStatus = function () {
      return sunk;
  }

  return {getLength, getHitStatus, getSunkStatus, hit};
};


export function getCoords(shipLength, firstCoord, orientation) {
  // first coord is something like ['C',5]
  // valid coords are A-J, 1-10
  // orientation is either 'vertical' or 'horizontal' 
  let coords = [firstCoord];
  
  if (orientation === 'horizontal') {
    if ((firstCoord[1] + shipLength-1) > 10) return null;
    for (let i = 1; i < shipLength; i++) {
      coords.push([firstCoord[0], firstCoord[1]+i]);
    }
  } else { // orientation = 'vertical'
    const coordCharCode = firstCoord[0].charCodeAt();
    // 74 is J in below if statement
    if ((coordCharCode + shipLength-1) > 74) return null;
    for (let i = 1; i < shipLength; i++) {
      coords.push([String.fromCharCode(coordCharCode+i),firstCoord[1]]);
    }
  }
  return coords;
}

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

  const placeShip = function(shipObj, firstCoord, orientation) {
    const shipCoords = getCoords(shipObj.getLength(), firstCoord, orientation);
    const boardShipObj = {
      ship: shipObj,
      coords: shipCoords,
    }
    shipArray.push(boardShipObj);
  }

  const checkFleetSunk = () => {
    if (shipArray.length === 0) return null;
    for (let i = 0; i < shipArray.length; i++) {
      if (shipArray[i].ship.getSunkStatus() === false) {
        return false;
      }
    }
    return true;
  }

  const logMiss = function(missCoord) {
    missArray.push(missCoord);
  }

  const checkHit = function(hitCoords) {
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
  }

  const checkMisses = function() {
    return missArray;
  }

  const getShips = function() {
    return shipArray;
  }

  return {placeShip, checkFleetSunk, checkHit, checkMisses, getShips};
}


export const createPlayer = function(name, type) {
  // type is either 'human' or 'computer'
  const playerName = name;
  const shotsMadeByPlayer = [];
  const playerBoard = gameboardFactory();

  // temporary - players will place their own ships eventually
  // playerBoard.placeShip(shipFactory(5), ['A',1], 'horizontal');
  // playerBoard.placeShip(shipFactory(4), ['C',1], 'horizontal');
  // playerBoard.placeShip(shipFactory(3), ['E',5], 'vertical');
  playerBoard.placeShip(shipFactory(2), ['G',7], 'vertical');
  playerBoard.placeShip(shipFactory(2), ['I',10], 'vertical');

  const receiveHit = function(hitCoords) {
    playerBoard.checkHit(hitCoords);
  }
  
  const logPlayerAttack = function(attackCoords) {
    shotsMadeByPlayer.push(attackCoords);
  }

  const getBoard = function() {
    return playerBoard;
  }

  const getName = function() {
    return playerName;
  }

  const getHitsMadeByThisPlayer = function() {
    return shotsMadeByPlayer;
  }

  const getFleetStatus = function() {
    return playerBoard.checkFleetSunk();
  }

  const getPlayerMisses = function() {
    return playerBoard.checkMisses();
  }

  // AI logic 
    // generate random move
    // check if random move is in shotsMadeByPlayer
      // if true, gen new move
      // if false, attack other player
    // special logic for if a hit is made, checks surrounding squares
      // hit made - gen's array of moves to do - does them one by one
    // 
  
  return { getName, getHitsMadeByThisPlayer, receiveHit, logPlayerAttack, getBoard, getFleetStatus, getPlayerMisses};
}



// the following ships 
  // carrier len=5
  // battleship len=4
  // destroyer len=3
  // sub len=2
  // torpedo boat len=2
// if successful hit, hitting player gets another turn
