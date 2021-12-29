

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

// create a gameboard factory
// a 10 x 10 board
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
