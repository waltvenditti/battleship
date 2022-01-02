import { createPlayer } from './factory-functions';
import { genPlacementBoard, addButtonFunctionality, removePlacementBoard, genGameBoard } from './dom-functions';
import './style.css';

genPlacementBoard();
addButtonFunctionality();
removePlacementBoard();
genGameBoard();

