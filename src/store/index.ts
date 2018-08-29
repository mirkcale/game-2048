import {createStore, StoreEnhancer} from 'redux';
import {StateWithHistory} from 'redux-undo';
import {createMatrix} from "../utils";
import reducer from './reducer';

import {IGridViewArray} from "../GridView";

export type TInitialState = typeof initialState;

const layout: StateWithHistory<IGridViewArray> = {
  _latestUnfiltered: createMatrix({width: 4, height: 4}),
  future: [],
  group: [],
  index: 0,
  limit: 9,
  past: [],
  present: createMatrix({width: 4, height: 4})
};

const initialState = {
  layout,
  score: 111
};

declare let window: Window & { __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer };

const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store