import * as React from "react";
import './gridview.less';

import {Modal} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {directions} from './store/actions';

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
import {StateWithHistory} from "redux-undo";

import {doMove, resetLayout} from './store/actions';
import UndoRedo from "./UndoRedo";

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
          {this.props.layout.present.map(items => {
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
        <UndoRedo/>
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

  public componentWillReceiveProps(nextProps: IGridViewProps) {
    const location = utils.getAvailableLocation(nextProps.layout.present);
    this.setState({
      score: this.getHighScore(nextProps.layout.present)
    });
    if (!location && !this.canReRang(nextProps.layout.present)) {
      this.setState({
        modalVisible: true
      })
    }
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

  private canReRang = (layout: IGridViewArray): boolean => {
    let canMove = false;
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
        if (code === 37 || code === 65) {
          this.props.doMove(directions.L, this.props.layout.present);
        }
        if (code === 38 || code === 87) {
          this.props.doMove(directions.U, this.props.layout.present);
        }
        if (code === 39 || code === 68) {
          this.props.doMove(directions.R, this.props.layout.present);
        }
        if (code === 40 || code === 83) {
          this.props.doMove(directions.D, this.props.layout.present);
        }
      }
    })
  };

  private handleOk = () => {
    this.props.resetLayout();
    this.setState({
      highScore: Math.max(this.state.score, this.state.highScore),
      modalVisible: false
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

}

interface IConnectDispatch {
  doMove: typeof doMove
  resetLayout: typeof resetLayout
}

interface IConnectGridView {
  layout: StateWithHistory<IGridViewArray>
  score: number
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    doMove,
    resetLayout
  }, dispatch)
};

const mapStateToProps = (state: any) => {
  return {
    layout: state.layout,
    score: state.state
  }
};

export default connect<IConnectGridView, IConnectDispatch>(mapStateToProps, mapDispatchToProps)(GridView);