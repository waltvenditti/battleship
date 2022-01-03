import { createPlayer } from './factory-functions';
import { coordsStorage, genGameBoard, removePlacementBoard, addShipsToPlayerBoard } from './dom-functions';

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
    return computer;
};

export const playerStorage = (() => {
    const players = [];
    const storePlayer = (player) => {
      players.push(player);
    };
    const getPlayers = () => players;
    return {
      storePlayer,
      getPlayers
    };
  })();

export const startGame = function() {
    let player = createPlayerHuman();
    let computer = createPlayerComputer();
    playerStorage.storePlayer(player);
    playerStorage.storePlayer(computer);
    removePlacementBoard();
    genGameBoard();
    addShipsToPlayerBoard(player.getNumericalShipCoords());
    // remove placement board
    // gen two new boards, smaller, side by side
    // left one shows player's ship placements
    // right one is a blank one reflecting AI chosen ship locations
    // most of the below game logic will be in eventListeners
    // player turn, they click on a square on computer side
    // if miss, turn square grey and now is computer's turn
    // if hit:
        // turn square red
        // check if fleet sunk
            // if yes, game over
            // if no, give that player another turn
    // repeat until game over
};