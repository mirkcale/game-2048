import * as React from 'react';
import './App.scss';

import GridView from './GridView';

class App extends React.Component {
  public render() {
    return (
      <GridView winGoal={2048} width={4} height={4}/>
    );
  }
}

export default App;
