import * as React from 'react';
import './App.scss';

import {Provider} from 'react-redux';
import GridView from './GridView';
import store from './store/index';

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <GridView winGoal={2048} width={4} height={4}/>
      </Provider>
    );
  }
}

export default App;
