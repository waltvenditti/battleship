import { convIDtoCoord } from './dom-functions.js';
import { shipFactory, getCoords, gameboardFactory, checkArrayEquality, createPlayer } from './factory-functions.js';

let testShip;
let testShipFail;
let testBoard;
let testPlayer;
let testPlayerRandom;
let testComputer;

// tests for shipFactory
beforeAll(() => {
    testShip = shipFactory(3);
    testShipFail = shipFactory(6);
    testBoard = gameboardFactory();
    testPlayer = createPlayer('human');
    testPlayerRandom = createPlayer('human');
    testComputer = createPlayer('computer');
    testPlayer.storeShip(2, ['G',7], 'vertical');
    testPlayer.storeShip(2, ['I',10], 'vertical');
});

test('confirm ship not made if wrong size submitted', () => {
    expect(testShipFail).toBe(null);
});

test('confirm test ship\'s length is 3', () => {
    expect(testShip.getLength()).toBe(3);
});

test('confirm initial hit status is three falses', () => {
    expect(testShip.getHitStatus()).toEqual([false,false,false]);
});

test('confirm initial sunk status is false', () => {
    expect(testShip.getSunkStatus()).toBe(false);
});

describe('testing hit function', () => {
    beforeAll(() => {
        testShip.hit(0);
    });

    test('confirm hit on position 0', () => {
        expect(testShip.getHitStatus()).toEqual([true,false,false]);
    });

    test('confirm not sunk despite one hit', () => {
        expect(testShip.getSunkStatus()).toBe(false);
    });
});

describe('see if ship sinks after two more hits', () => {
    beforeAll(() => {
        testShip.hit(1);
        testShip.hit(2);
    });

    test('confirm entire ship hit', () => {
        expect(testShip.getHitStatus()).toEqual([true,true,true]);
    });

    test('confirm sunk status is true', () => {
        expect(testShip.getSunkStatus()).toBe(true);
    });
});


// tests for getCoords
test('eval the getCoords function horizontally', () => {
    expect(getCoords(2, ['A',1],'horizontal')).toEqual([['A',1],['A',2]]);
});
test('eval the getCoords function vertically', () => {
    expect(getCoords(2, ['A',1],'vertical')).toEqual([['A',1],['B',1]]);
});
test('see if horizontal fail returns null', () => {
    expect(getCoords(3, ['A',9],'horizontal')).toEqual(null);
});
test('see if vertical fail returns null', () => {
    expect(getCoords(3, ['I',1],'vertical')).toEqual(null);
});


// test checkArrayEquality
test('if checkArrayEquality returns true for identical arrays', () => {
    expect(checkArrayEquality(['A',1], ['A',1])).toBe(true);
});
test('if checkArrayEquality returns false for different arrays', () => {
    expect(checkArrayEquality(['A',1], ['A',2])).toBe(false);
});


// tests for gameboard
test('evaluate if checkFleetSunk returns null at init', () => {
    expect(testBoard.checkFleetSunk()).toBe(null);
});

describe('will place ships on gameboard', () => {
    beforeAll(() => {
        testBoard.placeShip(shipFactory(3), ['A',1], 'horizontal');
        testBoard.placeShip(shipFactory(2), ['D',1], 'horizontal');
    });

    test('see if checkFleetSunk returns false', () => {
        expect(testBoard.checkFleetSunk()).toBe(false);
    });
    test('if sinking one ship means checkFleetSunk returns false', () => {
        testBoard.checkHit(['A',1]);
        testBoard.checkHit(['A',2]);
        testBoard.checkHit(['A',3]);
        expect(testBoard.checkFleetSunk()).toBe(false);
    });
    test('if sinking both ships returns true from checkFleetSunk', () => {
        testBoard.checkHit(['D',1]);
        testBoard.checkHit(['D',2]);
        expect(testBoard.checkFleetSunk()).toBe(true);
    });
    test('if misses are logged properly', () => {
        testBoard.checkHit(['E',5]);
        expect(testBoard.checkMisses()).toEqual([['E',5]]);
    });
});


// tests for createPlayer 
test('if name stored properly', () => {
    expect(testPlayer.getName()).toBe('human');
});
test('log a hit and see if stored', () => {
    testPlayer.logPlayerAttack(['J',1]);
    expect(testPlayer.getHitsMadeByThisPlayer()).toEqual([['J',1]]);
});
test('test if checkLegalMove rejects another J1', () => {
    expect(testPlayer.checkLegalMove(['J',1])).toBe(false);
});
test('test if checkLegalMove returns true for valid move', () => {
    expect(testPlayer.checkLegalMove(['C',9])).toBe(true);
});
test('if init fleet sunk status reported as false', () => {
    expect(testPlayer.getFleetStatus()).toBe(false);
});
test('if misses logged accurately in gameboard', () => {
    testPlayer.receiveHit(['A',1]);
    expect(testPlayer.getPlayerMisses()).toEqual([['A',1]]);
});
test('if fleet sinks properly', () => {
    testPlayer.receiveHit(['G',7]);
    testPlayer.receiveHit(['H',7]);
    testPlayer.receiveHit(['I',10]);
    testPlayer.receiveHit(['J',10]);
    expect(testPlayer.getFleetStatus()).toBe(true);
});
test('that true hits not stored in gameboard miss array', () => {
    expect(testPlayer.getPlayerMisses()).toEqual([['A',1]]);
});


// tests for random move generator functions 
test('tests if AI can distinguish valid from invalid moves', () => {
    const coord1 = ['A','B','C','D','E','F','G','H','I','J'];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 10; j++) {
            testPlayerRandom.logPlayerAttack([
                coord1[i],j+1
            ]);
        }
    }
    for (let i = 9; i < 10; i++) {
        for (let j = 0; j < 9; j++) {
            testPlayerRandom.logPlayerAttack([
                coord1[i],j+1
            ]);
        }
    }
    const randomMove = testPlayerRandom.genValidMove();
    expect(randomMove).toEqual(['J',10]);
});

// test the AI for generating ship placements for AI
test('test AI ship placement', () => {
    testComputer.AIGenPlacements();
    expect(testComputer.testAIGenPlacements()).toBe(true);
});