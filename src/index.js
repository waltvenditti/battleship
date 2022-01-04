import { createPlayer } from './factory-functions';
import { genPlacementBoard, addButtonFunctionality, removePlacementBoard, genGameBoard, addShipsToPlayerBoard, replayButtonFunctionality } from './dom-functions';
import './style.css';

replayButtonFunctionality();
genPlacementBoard();
addButtonFunctionality();

