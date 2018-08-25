import {IGridViewArray} from '../GridView'
import * as actionsTypes from "./actionTypes";

export interface IAction {
  payload: any
  type: string
  error?: boolean
  meta?: string
}

export function doMove(direction: string, layout: IGridViewArray): IAction {
  return {
    payload: {
      direction,
      layout
    },
    type: actionsTypes.MOVE
  }
}

export function setScore(score: number): IAction {
  return {
    payload: {
      score,
    },
    type: actionsTypes.SET_SCORE
  }
}
