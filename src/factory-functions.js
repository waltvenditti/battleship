

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
    if ((firstCoord[1] + shipLength) > 10) return null;
    for (let i = 1; i < shipLength; i++) {
      coords.push([firstCoord[0], firstCoord[1]+i]);
    }
  } else { // orientation = 'vertical'
    const coordCharCode = firstCoord[0].charCodeAt();
    // 74 is J in below if statement
    if ((coordCharCode + shipLength) > 74) return null;
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

  return {placeShip, checkFleetSunk, checkHit, checkMisses};
}

// create a gameboard factory
// a 10 x 10 board
  // vertical coordinates are A - J
  // horizontal are 1 - 10
  // An array of objects:
    // each object lists:
      // ship type
      // owner
      // coordinates it occupies
// the following ships 
    // carrier len=5
    // battleship len=4
    // destroyer len=3
    // sub len=2
    // torpedo boat len=2
// "gameboards should be able to place ships at specific coordinates by calling the ship factory function"
    // select a coordinate
    // default 
// hit function: 
    // take coordinates
    // check array of ships (which contains ship coordinates)
    // if a hit, hit. if miss, miss
// function that reports if all of the players ships have been sunk
