import * as React from "react";
import './gridview.less';
import './utils';

interface IGridViewProps {
  width: number
  height: number
}

type IGridViewArray = number[][];

interface IGridViewState {
  layout: IGridViewArray
}

class GridView extends React.Component<IGridViewProps, IGridViewState> {

  public state: IGridViewState = {
    layout: new Array(this.props.height).fill(new Array(this.props.width).fill(0))
  };

  constructor(props: IGridViewProps) {
    super(props);
  }
  
  public render() {
    // tslint:disable-next-line
    return (
      <div className="grid-container">
        {this.state.layout.map(items => {
          return items.map((item, index) => {
            return <div className="number-box" key={index}>{item}</div>
          })
        })}
      </div>
    );
  }
}

export default GridView;