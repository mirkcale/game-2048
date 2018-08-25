import {createStore, StoreEnhancer} from 'redux'
import {createMatrix} from "../utils";
import reducer from './reducer'

const initialState = {
  layout: createMatrix({width: 4, height: 4}),
  score: 111
};

declare let window: Window & { __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer };

const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store