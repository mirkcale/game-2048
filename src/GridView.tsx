import * as React from "react";
import './gridview.less';

import {Modal} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import utils from './utils';

type IGridViewProps = IConnectGridView & IConnectDispatch & {
  width: number
  height: number
  winGoal: number
}

export type IGridViewArray = number[][];

export interface IGridViewState {
  layout: IGridViewArray
  modalVisible: boolean
  score: number
  highScore: number
}

import {doMove} from './store/actions';

class GridView extends React.Component<IGridViewProps, IGridViewState> {
  public state: IGridViewState = {
    highScore: localStorage.getItem('highScore') ? ~~(localStorage.getItem('highScore') as string) : 0,
    layout: utils.createMatrix(this.props),
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
        return utils.rotateArray(array, 0).map(utils.reRangArray);
      case 'UP':
        return utils.rotateArray(utils.rotateArray(array, 90).map(utils.reRangArray), 270);
      case 'RIGHT':
        return utils.rotateArray(utils.rotateArray(array, 180).map(utils.reRangArray), 180);
      case 'DOWN':
        return utils.rotateArray(utils.rotateArray(array, 270).map(utils.reRangArray), 90);
      default:
        return utils.rotateArray(array, 0).map(utils.reRangArray)
    }
  };

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown, true)
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  public render() {
    return (
      <div>
        <div>历史最高分：{this.state.highScore}</div>
        <div>当前分数：{this.state.score}</div>
        <div className="grid-container">
          {this.state.layout.map(items => {
            return items.map((item, index) => {
              return (
                <div
                  className="number-box"
                  key={index}
                  style={{backgroundColor: utils.getNumberBackgroundColor(item), color: utils.getNumberColor(item)}}
                >
                  {item}
                </div>
              )
            })
          })}
        </div>
        {/*tslint:disable-next-line*/}
        <button onClick={() => this.props.doMove('LEFT', this.state.layout)}>改变数字</button>
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

  private getHighScore = (layout: IGridViewArray): number => {
    let score: number = 0;
    layout.map((arr) => {
      arr.map(value => {
        score = score < value ? value : score
      })
    });
    return score
  };

  private canReRang = (): boolean => {
    let canMove = false;
    const layout = this.state.layout;
    for (let i = 0, length = layout.length; i < length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        if (layout[i][j] === layout[i][j + 1]) {
          canMove = true;
          break
        }
        if (i !== length - 1 && layout[i][j] === layout[i + 1][j]) {
          canMove = true;
          break;
        }
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
        const location = utils.getAvailableLocation(layout);
        if (!location && !this.canReRang()) {
          this.setState({
            modalVisible: true
          }, () => {
            this.setState({
              score: this.getHighScore(this.state.layout)
            })
          });
          return
        }
        if (location) {
          const [x, y] = location;
          layout[x][y] = utils.getRandomNum();
          this.setState({
            layout
          }, () => {
            this.setState({
              score: this.getHighScore(this.state.layout)
            })
          })
        }
      }
    })
  };

  private handleOk = () => {
    this.resetGame();
    this.setState({
      highScore: Math.max(this.state.score, this.state.highScore)
    });
    localStorage.setItem('highScore', Math.max(this.state.score, this.state.highScore) + '')
  };

  private handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
    this.setState({
      highScore: Math.max(this.state.score, this.state.highScore)
    });
    localStorage.setItem('highScore', Math.max(this.state.score, this.state.highScore) + '')
  };

  private resetGame = () => {
    this.setState({
      layout: utils.createMatrix(this.props),
      modalVisible: false,
      score: 0
    })
  }
}

interface IConnectDispatch {
  doMove: typeof doMove
}

interface IConnectGridView {
  layout: IGridViewArray
  score: number
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    doMove
  }, dispatch)
};

const mapStateToProps = (state: any) => {
  return {
    layout: state.layout,
    score: state.state
  }
};

export default connect<IConnectGridView, IConnectDispatch>(mapStateToProps, mapDispatchToProps)(GridView);