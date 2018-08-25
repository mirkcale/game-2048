type IGridViewArray = number[][];

enum IAngle {
  UP = 90,
  RIGHT = 180,
  LEFT = 0,
  DOWN = 270
}

/**
 * 返回随机数出现的坐标
 * @param array
 */
export function getAvailableLocation(array: IGridViewArray) {
  const arr: Array<[number, number]> = [];
  array.map((items, indexI) => {
    items.map((item, indexJ) => {
      if (item === 0) {
        arr.push([indexI, indexJ])
      }
    })
  });
  const length = arr.length;
  return length ? arr[Math.floor(Math.random() * length)] : null
}

/**
 * 获取不同数字的背景色
 * @param num
 */
export function getNumberBackgroundColor(num: number): string {
  switch (num) {
    case 2:
      return "#eee4da";
    case 4:
      return "#eee4da";
    case 8:
      return "#f26179";
    case 16:
      return "#f59563";
    case 32:
      return "#f67c5f";
    case 64:
      return "#f65e36";
    case 128:
      return "#edcf72";
    case 256:
      return "#edcc61";
    case 512:
      return "#9c0";
    case 1024:
      return "#3365a5";
    case 2048:
      return "#09c";
    case 4096:
      return "#aca6bc";
    case 8192:
      return "#93c";
  }
  return "black";
}

/**
 * 获取数字的文本颜色
 * @param num
 */
export function getNumberColor(num: number): string {
  return num <= 4 ? '#776e65' : '#fff';
}

/**
 * 旋转数组
 * 返回重新排列后的数组
 * @param angle
 * @param array
 */
export function rotateArray(array: IGridViewArray, angle: IAngle): IGridViewArray {
  return array.map((itemI, indexI) => {
    const outLength = array.length;
    return itemI.map((itemJ, indexJ) => {
      const innerLength = itemI.length;
      switch (angle) {
        case 0:
          return array[indexI][indexJ]; // 保持不变
        case 90:
          return array[indexJ][outLength - 1 - indexI];
        case 180:
          return array[innerLength - 1 - indexI][outLength - 1 - indexJ];
        case 270:
          return array[innerLength - 1 - indexJ][indexI];
        default:
          return array[indexI][indexJ]; // 保持不变
      }
    })
  });
}

/**
 * 向左压缩数组
 * @param array
 */
export function reRangArray(array: number[]) {
  const length = array.length;
  const arrTemp = [];
  for (let i = 0; i < length; i++) {
    if (array[i] !== 0 && array[i] === array[i + 1]) {
      arrTemp.push(array[i] + array[i + 1]);
      i += 1;
    } else {
      if (array[i]) {
        arrTemp.push(array[i])
      }
    }
  }
  for (let i = arrTemp.length; i < length; i++) {
    arrTemp.push(0)
  }
  return arrTemp;
}

interface IGridViewProps {
  width: number
  height: number
}

// 生成 n*m 的二维数组
export function createMatrix(boundary: IGridViewProps): IGridViewArray {
  const arr: IGridViewArray = [];
  for (let i = 0; i < boundary.width; i++) {
    arr.push([]);
    for (let j = 0; j < boundary.height; j++) {
      arr[i].push(0)
    }
  }
  return arr
}

export function getRandomNum(): number {
  return Math.random() * 100 > 89 ? 4 : 2
}

const utils = {
  createMatrix,
  getAvailableLocation,
  getNumberBackgroundColor,
  getNumberColor,
  getRandomNum,
  reRangArray,
  rotateArray,
};
export default utils;

export type utilsType = typeof utils; 