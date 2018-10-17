import {IGridViewArray} from '../GridView'
import * as actionsTypes from "./actionTypes";

export interface IAction {
  payload: any
  type: string
  error?: boolean
  meta?: string
}
export enum directions {
  L = 'LEFT',
  R = 'RIGHT',
  U = 'UP',
  D = 'DOWN',
}

export function doMove(direction: directions, layout: IGridViewArray): IAction {
  return {
    payload: {
      direction,
      layout
    },
    type: actionsTypes.MOVE
  }
}

export function resetLayout() {
  return {
    type: actionsTypes.RESET
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
