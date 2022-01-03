import { createPlayer } from './factory-functions';
import { genPlacementBoard, addButtonFunctionality, removePlacementBoard, genGameBoard, addShipsToPlayerBoard } from './dom-functions';
import './style.css';

genPlacementBoard();
addButtonFunctionality();

// these functions are temporary while I work on the game HTML. These will be put in  the game-loop when done
// removePlacementBoard();
// genGameBoard();

// addShipsToPlayerBoard();
