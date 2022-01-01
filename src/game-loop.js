import { createPlayer } from './factory-functions';
import { coordsStorage } from './dom-functions';

export const arf = function() {
    // arf 
};

const createPlayerHuman = function() {
    const shipLength = [5, 4, 3, 2, 2];
    const coords = coordsStorage.getCoords();
    const orientations = coordsStorage.getOrientations();
    const player = createPlayer('human');
    for (let i = 0; i < coords.length; i++) {
        player.storeShip(shipLength[i], coords[i], orientations[i]);
    }
    return player;
};

const createPlayerComputer = function() {
    const computer = createPlayer('computer');
    computer.AIGenPlacements();
};

export const startGame = function() {
    let player = createPlayerHuman();
    let computer = createPlayerComputer();
};