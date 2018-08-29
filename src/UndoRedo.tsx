import {Button} from "antd";
import * as React from 'react';
import {connect} from 'react-redux';
import {ActionCreators as UndoActionCreators} from 'redux-undo';
import {TInitialState} from "./store";

interface IMapState {
  canUndo: boolean
  canRedo: boolean
}

interface IMapDispatch {
  onUndo: () => void
  onRedo: () => void
}

type IUndoRedoProps = IMapState & IMapDispatch

const UndoRedo = ({canUndo, canRedo, onUndo, onRedo}: IUndoRedoProps) => (
  <p>
    <Button onClick={onUndo} disabled={!canUndo}>
      Undo
    </Button>
    <Button onClick={onRedo} disabled={!canRedo}>
      Redo
    </Button>
  </p>
);

const mapStateToProps = (state: TInitialState) => ({
  canRedo: state.layout.future.length > 0,
  canUndo: state.layout.past.length > 0
});

const mapDispatchToProps = ({
  onRedo: UndoActionCreators.redo,
  onUndo: UndoActionCreators.undo
});

export default connect<IMapState, IMapDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo);