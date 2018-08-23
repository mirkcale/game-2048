import * as React from "react";
import './gridview.less';

import {Modal} from 'antd';
import {
  createMatrix,
  getAvailableLocation,
  getNumberBackgroundColor,
  getNumberColor,
  getRandomNum,
  reRangArray,
  rotateArray
} from './utils';

interface IGridViewProps {
  width: number
  height: number
  winGoal: number
}

type IGridViewArray = number[][];

/*enum IDirections {
  left = 'LEFT',
  right = 'RIGHT',
  up = 'UP',
  down = 'DOWN',
}*/

interface IGridViewState {
  layout: IGridViewArray
  modalVisible: boolean
  score: number
  highScore: number
}

class GridView extends React.Component<IGridViewProps, IGridViewState> {
  public state: IGridViewState = {
    highScore: localStorage.getItem('highScore') ? ~~(localStorage.getItem('highScore') as string) : 0,
    layout: createMatrix(this.props),
    modalVisible: false,
    score: 0
  };

  constructor(props: IGridViewProps) {
    super(props);
  }

  /**
   * rotateArray(array,0).map(reRangArray) left
   * rotateArray(rotateArray(array,90).map(reRangArray),270) up
   * rotateArray(rotateArray(array,180).map(reRangArray),180) right
   * rotateArray(rotateArray(array,270).map(reRangArray),90) down
   */
  public reRang = (direction: string) => {
    const array = this.state.layout;
    switch (direction) {
      case 'LEFT':
        return rotateArray(array, 0).map(reRangArray);
      case 'UP':
        return rotateArray(rotateArray(array, 90).map(reRangArray), 270);
      case 'RIGHT':
        return rotateArray(rotateArray(array, 180).map(reRangArray), 180);
      case 'DOWN':
        return rotateArray(rotateArray(array, 270).map(reRangArray), 90);
      default:
        return rotateArray(array, 0).map(reRangArray)
    }
  };

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown, true)
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  public render() {
    // tslint:disable-next-line
    console.log(this.canReRang());
    return (
      <div>
        <div className="grid-container">
          {this.state.layout.map(items => {
            return items.map((item, index) => {
              return (
                <div
                  className="number-box"
                  key={index}
                  style={{backgroundColor: getNumberBackgroundColor(item), color: getNumberColor(item)}}
                >
                  {item}
                </div>
              )
            })
          })}
        </div>
        <Modal
          title="Basic Modal"
          visible={this.state.modalVisible}
          cancelText="知道了"
          okText="再来一局"
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <p>你已经输了</p>
        </Modal>
      </div>

    );
  }

  private canReRang = (): boolean => {
    let canMove = false;
    const layout = this.state.layout;
    for (let i = 0, length = layout.length; i < length; i++) {
      for (let j = 0; j < layout[i][j]; j++) {
        // const innerLength = layout[i].length;
        if (
          layout[i][j] !== 0
          && (layout[i][j] === layout[i][j + 1]
            || (layout[i][j] === layout[i][j - 1])
            || (i < length-1) && layout[i][j] === layout[i + 1][j]
            || ((i > 1) && layout[i][j] === layout[i - 1][j])
            )
          || layout[i][j] === 0
        ) {
          canMove = true;
          break
        }
        /*if (
          layout[i][j] !== 0
          && (i - 1 >= 0)
          && (i + 1 < length)
          && (j - 1 >= 0)
          && (j + 1 > innerLength)
          && (layout[i][j] === layout[i][j + 1]
            || layout[i][j] === layout[i][j - 1]
            || layout[i][j] === layout[i + 1][j]
            || layout[i][j] === layout[i - 1][j]
          ) || layout[i][j] === 0
        ) {
          canMove = true;
          break
        }*/
      }
      if (canMove) {
        break
      }
    }
    return canMove
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    // <- 37  ^| 38 -> 39 v| 40    w87 a65 s83 d68 
    const directionKeys = [87, 65, 68, 83, 37, 38, 39, 40];
    const keyCode: number = e.keyCode;
    directionKeys.map((code) => {
      if (keyCode === code) {
        // tslint:disable-next-line
        let layout: IGridViewArray = [];
        if (code === 37 || code === 65) {
          layout = this.reRang('LEFT')
        }
        if (code === 38 || code === 87) {
          layout = this.reRang('UP')
        }
        if (code === 39 || code === 68) {
          layout = this.reRang('RIGHT')
        }
        if (code === 40 || code === 83) {
          layout = this.reRang('DOWN')
        }
        const location = getAvailableLocation(layout);
        if (!location && !this.canReRang()) {
          this.setState({
            modalVisible: true
          });
          return
        }
        if (location) {
          const [x, y] = location;
          layout[x][y] = getRandomNum();
          this.setState({
            layout
          })
        }
      }
    })
  };

  private handleOk = () => {
    this.resetGame();
  };

  private handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  private resetGame = () => {
    this.setState({
      layout: createMatrix(this.props),
      modalVisible: false,
      score: 0
    })
  }
}

export default GridView;