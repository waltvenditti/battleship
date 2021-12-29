import { shipFactory, getCoords } from './factory-functions.js';

let testShip;
let testShipFail;

// tests for shipFactory
beforeAll(() => {
    testShip = shipFactory(3);
    testShipFail = shipFactory(6);
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
    expect(getCoords(2, ['A',1],'horizontal')).toEqual([['A',2],['A',3]]);
})
test('eval the getCoords function vertically', () => {
    expect(getCoords(2, ['A',1],'vertical')).toEqual([['B',1],['C',1]]);
})
test('see if horizontal fail returns null', () => {
    expect(getCoords(2, ['A',9],'horizontal')).toEqual(null);
})
test('see if vertical fail returns null', () => {
    expect(getCoords(2, ['I',1],'vertical')).toEqual(null);
})