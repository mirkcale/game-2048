import {combineReducers} from "redux";
import undoable from 'redux-undo';
import {directions, IAction} from './actions'
import * as actionTypes from "./actionTypes";

import {IGridViewArray} from '../GridView';
import utils, {createMatrix, IAngle, reRangArray, rotateArray} from "../utils";

function doMoveReducer(state: IGridViewArray = createMatrix({width: 4, height: 4}), action: IAction) {
  if (action.type === actionTypes.MOVE) {
    const direction = action.payload.direction;
    let layout: IGridViewArray;
    switch (direction) {
      case directions.L:
        layout = rotateArray(action.payload.layout, IAngle.LEFT).map(reRangArray);
        break;
      case directions.U:
        layout = rotateArray(rotateArray(action.payload.layout, IAngle.UP).map(reRangArray), 270);
        break;
      case directions.R:
        layout = rotateArray(rotateArray(action.payload.layout, IAngle.RIGHT).map(reRangArray), 180);
        break;
      case directions.D:
        layout = rotateArray(rotateArray(action.payload.layout, IAngle.DOWN).map(reRangArray), 90);
        break;
      default:
        layout = rotateArray(action.payload.layout, 0).map(reRangArray)
    }
    const location = utils.getAvailableLocation(layout);
    if (!location && utils.canReRang(layout)) {
      return layout

    }
    if (location) {
      const [x, y] = location;
      layout[x][y] = utils.getRandomNum();
      return layout
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
  layout: undoable(doMoveReducer),
  score: setScore
})