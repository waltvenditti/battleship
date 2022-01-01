import { createPlayer } from './factory-functions';
import { genPlacementBoard, addButtonFunctionality, coordsStorage, startGame } from './dom-functions';
import './style.css';

genPlacementBoard();
addButtonFunctionality();
const player = createPlayer('human');
const AI = createPlayer('computer');

