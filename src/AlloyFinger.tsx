/* AlloyFinger v0.1.0
  * By dntzhang
  * Reedited by nemoliao
  * Github: https://github.com/AlloyTeam/AlloyFinger
  */

import _ from 'lodash';
import React, {Component} from 'react';
import {directions} from './store/actions';
interface IPosition {
  x: number;
  y: number;
}

interface IPositionInital {
  x: NumOrNull;
  y: NumOrNull;
}

interface IAlloyFingerProps {
  onTouchStart?: (event: TouchEvent) => void;
  onMultipointStart?: (event: TouchEvent) => void;
  onLongTap?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onPinch?: (event: TouchEvent) => void;
  onRotate?: (event: TouchEvent) => void;
  onPressMove?: (event: TouchEvent) => void;
  onTouchCancel?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onMultipointEnd?: (event: TouchEvent) => void;
  onSwipe?: (event: TouchEvent) => void;
  onTap?: (event: TouchEvent) => void;
  onDoubleTap?: (event: TouchEvent) => void;
  onSingleTap?: (event: TouchEvent) => void;
}

type NumOrNull = null | number;

export default class AlloyFinger extends Component<IAlloyFingerProps> {
  public scale = 1;
  public preV: IPositionInital = {x: null, y: null};
  public pinchStartLen: NumOrNull = null;
  public isSingleTap = false;
  public isDoubleTap = false;
  public delta: NumOrNull = null;
  public last: NumOrNull = null;
  public now: NumOrNull = null;
  public end: NumOrNull = null;
  public multiTouch = false;
  public tapTimeout: number;
  public longTapTimeout: number;
  public singleTapTimeout: number;
  public swipeTimeout: number;
  public x1: NumOrNull = null;
  public x2: NumOrNull = null;
  public y1: NumOrNull = null;
  public y2: NumOrNull = null;
  public preTapPosition: IPositionInital = {x: null, y: null};

  // Disable taps after longTap
  public afterLongTap = false;
  public afterLongTapTimeout: number;

  constructor(props: any) {
    super(props);
  }

  public getLen(v: IPosition) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  public dot(v1: IPosition, v2: IPosition) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  public getAngle(v1: IPosition, v2: IPosition) {
    const mr = this.getLen(v1) * this.getLen(v2);
    if (mr === 0) {
      return 0;
    }
    let r = this.dot(v1, v2) / mr;
    if (r > 1) {
      r = 1;
    }
    return Math.acos(r);
  }

  public cross(v1: IPosition, v2: IPosition) {
    return v1.x * v2.y - v2.x * v1.y;
  }

  public getRotateAngle(v1: IPosition, v2: IPosition) {
    let angle = this.getAngle(v1, v2);
    if (this.cross(v1, v2) > 0) {
      angle *= -1;
    }

    return angle * 180 / Math.PI;
  }

  public render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      onTouchCancel: this._handleTouchCancel.bind(this),
      onTouchEnd: this._handleTouchEnd.bind(this),
      onTouchMove: this._handleTouchMove.bind(this),
      onTouchStart: this._handleTouchStart.bind(this)
    });
  }


  public _resetState() {
    this.setState({
      start: 0,
      swiping: false,
      x: null,
      y: null
    });
  }


  private _emitEvent(name: string, ...arg: any[]) {
    // tslint:disable:no-console
    console.log(name);
    if (this.props[name]) {
      this.props[name](...arg);
    }
  }

  private _handleTouchStart(evt: TouchEvent) {
    const emitEvent: any = _.cloneDeep(evt);
    this._emitEvent('onTouchStart', emitEvent);
    if (!evt.touches) {
      return;
    }
    this.now = Date.now();
    this.x1 = evt.touches[0].pageX;
    this.y1 = evt.touches[0].pageY;
    this.delta = this.now - (this.last || this.now);
    if (this.preTapPosition.x !== null && this.preTapPosition.y !== null) {
      this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
    }
    this.preTapPosition.x = this.x1;
    this.preTapPosition.y = this.y1;
    this.last = this.now;
    const preV = this.preV as IPosition;
    const len = evt.touches.length;

    if (len > 1) {
      this._cancelLongTap();
      this._cancelSingleTap();
      const v = {x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1};
      preV.x = v.x;
      preV.y = v.y;
      this.pinchStartLen = this.getLen(preV);
      this._emitEvent('onMultipointStart', emitEvent);
    } else {
      this.isSingleTap = true;
    }
    this.longTapTimeout = window.setTimeout(() => {
      this._emitEvent('onLongTap', emitEvent);
      this.afterLongTap = true;
      this.afterLongTapTimeout = window.setTimeout(() => {
        this.afterLongTap = false;
      }, 1000);
    }, 750);
  }

  private _handleTouchMove(evt: TouchEvent) {
    const emitEvent: any = _.cloneDeep(evt);
    this._emitEvent('onTouchMove', emitEvent);
    const preV = this.preV as IPosition;
    const len = evt.touches.length;
    const currentX = evt.touches[0].pageX;
    const currentY = evt.touches[0].pageY;
    this.isSingleTap = false;
    this.isDoubleTap = false;
    if (len > 1) {
      const v = {x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY};
      if (preV.x !== null) {
        if (this.pinchStartLen as number > 0) {
          emitEvent.center = {
            x: (evt.touches[1].pageX + currentX) / 2,
            y: (evt.touches[1].pageY + currentY) / 2
          };
          emitEvent.scale = emitEvent.zoom = this.getLen(v) / (this.pinchStartLen as number);
          this._emitEvent('onPinch', emitEvent);
        }
        emitEvent.angle = this.getRotateAngle(v, preV);
        this._emitEvent('onRotate', emitEvent);
      }
      preV.x = v.x;
      preV.y = v.y;
      this.multiTouch = true;
    } else {
      if (this.x2 !== null && this.y2 !== null) {
        emitEvent.deltaX = currentX - this.x2;
        emitEvent.deltaY = currentY - this.y2;
      } else {
        emitEvent.deltaX = 0;
        emitEvent.deltaY = 0;
      }
      this._emitEvent('onPressMove', emitEvent);
    }
    this._cancelLongTap();
    this.x2 = currentX;
    this.y2 = currentY;

    if (len > 1) {
      evt.preventDefault();
    }
  }

  private _handleTouchCancel(evt: TouchEvent) {
    const emitEvent: any = _.cloneDeep(evt);
    this._emitEvent('onTouchCancel', emitEvent);
    clearInterval(this.singleTapTimeout);
    clearInterval(this.tapTimeout);
    clearInterval(this.longTapTimeout);
    clearInterval(this.swipeTimeout);
  }

  private _handleTouchEnd(evt: TouchEvent) {
    const emitEvent: any = _.cloneDeep(evt);
    this._emitEvent('onTouchEnd', emitEvent);
    this.end = Date.now();
    this._cancelLongTap();

    if (this.multiTouch && evt.touches.length < 2) {
      this._emitEvent('onMultipointEnd', emitEvent);
    }

    emitEvent.origin = [this.x1, this.y1];
    if (!this.multiTouch) {
      if ((this.x2 && this.x1 && Math.abs(this.x1 - this.x2) > 30) ||
        (this.y2 && this.y1 && Math.abs(this.y1 - this.y2) > 30)) {
        emitEvent.direction = this._swipeDirection(this.x1 as number, this.x2 as number, this.y1 as number, this.y2 as number);
        emitEvent.distance = Math.abs(this.x1 as number - (this.x2 as number));
        this.swipeTimeout = window.setTimeout(() => {
          this._emitEvent('onSwipe', emitEvent);
        }, 0);
      } else {
        if (this.afterLongTap) {
          clearTimeout(this.afterLongTapTimeout);
          this.afterLongTap = false;
        } else {
          this.tapTimeout = window.setTimeout(() => {
            this._emitEvent('onTap', emitEvent);
            if (this.isDoubleTap) {
              this._emitEvent('onDoubleTap', emitEvent);
              clearTimeout(this.singleTapTimeout);
              this.isDoubleTap = false;
            } else if (this.isSingleTap) {
              this.singleTapTimeout = window.setTimeout(() => {
                this._emitEvent('onSingleTap', emitEvent);
              }, 250);
              this.isSingleTap = false;
            }
          }, 0);
        }
      }
    }

    this.preV.x = 0;
    this.preV.y = 0;
    this.scale = 1;
    this.pinchStartLen = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.multiTouch = false;
  }

  private _cancelLongTap() {
    clearTimeout(this.longTapTimeout);
  }

  private _cancelSingleTap() {
    clearTimeout(this.singleTapTimeout);
  }

  private _swipeDirection(x1: number, x2: number, y1: number, y2: number): directions | 'Nochange' {
    if (Math.abs(x1 - x2) > 80 || this.end as number - (this.now as number) < 250) {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? directions.L : directions.R) : (y1 - y2 > 0 ? directions.U : directions.D);
    } else {
      return 'Nochange';
    }
  }
}
