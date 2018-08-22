/**
 * 随机生成 2或者 4
 */

export function addNumberItem() {
  return Math.random() * 100 > 88 ? 4 : 2;
}

type IGridViewArray = number[][];

interface IBoundary {
  width: number
  height: number
}

/**
 * 返回随机数出现的坐标
 * @param boundary
 * @param array
 */
export function getAvailableLocation(boundary: IBoundary, array: IGridViewArray): [number, number] {
  // tslint:disable:no-bitwise
  const x: number = ~~(Math.random() * boundary.width);
  const y: number = ~~(Math.random() * boundary.height);
  return array[x][y] === 0 ? [x, y] : getAvailableLocation(boundary, array)
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
      return "#a6bc";
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
 * 返回重新排列后的数组
 * @param direction
 * @param array
 */
export function reRang(array: IGridViewArray, direction: string) {
  // tslint:disable
  return array.map((itemI, indexI) => {
    let outLength = array.length;
    return itemI.map((itemJ, indexJ) => {
      let innerLength = itemI.length;
      // console.log('横 %d,纵 %d', indexI, indexJ);
      switch (direction) {
        case 'up':
          return array[indexJ][outLength - 1 - indexI];
        case 'right':
          return array[innerLength - 1 - indexJ][indexI];
        case 'bottom':
          return array[innerLength - 1 - indexJ][outLength - 1 - indexI];
        case 'left':
          return array[indexJ][indexI];
        default:
          return array[indexJ][indexI];
      }
    })
  });
}

export function reRangArray(array: number[]) {
  const length = array.length;
  let arrTemp = [];
  for (let i = 0; i < length; i++) {
    if (array[i] === array[i + 1]) {
      arrTemp.push(array[i] + array[i + 1]);
      i += 1;
    } else {
      arrTemp.push(array[i])
    }
  }
  for (let i = arrTemp.length; i < length; i++) {
    arrTemp.push(0)
  }
  return arrTemp;
}