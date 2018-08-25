import {combineReducers} from "redux";
import {IAction} from './actions'
import * as actionTypes from "./actionTypes";

import {IGridViewArray} from '../GridView';
import {createMatrix, reRangArray, rotateArray} from "../utils";

function doMoveReducer(state: IGridViewArray = createMatrix({width: 4, height: 4}), action: IAction) {
  if (action.type === actionTypes.MOVE) {
    const direction = action.payload.direction;
    switch (direction) {
      case 'LEFT':
        return rotateArray(action.payload.layout, 0).map(reRangArray);
      case 'UP':
        return rotateArray(rotateArray(action.payload.layout, 90).map(reRangArray), 270);
      case 'RIGHT':
        return rotateArray(rotateArray(action.payload.layout, 180).map(reRangArray), 180);
      case 'DOWN':
        return rotateArray(rotateArray(action.payload.layout, 270).map(reRangArray), 90);
      default:
        return rotateArray(action.payload.layout, 0).map(reRangArray)
    }
  }

  if (action.type === actionTypes.RESET) {
    return createMatrix({width: 4, height: 4})
  }

  return state
}

function setScore(state: number, action: IAction) {
  if (action.type === actionTypes.SET_SCORE) {
    return action.payload.score as number
  }
  return 0
}

export default combineReducers({
  layout: doMoveReducer,
  score: setScore
})