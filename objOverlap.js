/**
 * 获取两个对象的交集
 * @param {object} obj1
 * @param {object} obj2
 * @returns {object | null} 返回的交集对象，如果两者都是空对象则返回 null
 */
function getOverlap(obj1, obj2) {
  // 如果两者都不是对象，直接返回空对象
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || !obj1 || !obj2) {
    return {};
  }

  // 检查是否都是空对象，如果是则返回 null
  if (Object.keys(obj1).length === 0 && Object.keys(obj2).length === 0) {
    return null;
  }

  const result = {};
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of keys) {
    if (key in obj1 && key in obj2) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      // 排除两者相等且都为 null 的情况
      if (val1 === val2 && val1 !== null && val1 !== undefined) {
        result[key] = val1;
      } else if (
        typeof val1 === "object" &&
        typeof val2 === "object" &&
        val1 &&
        val2
      ) {
        const nestedOverlap = getOverlap(val1, val2);
        if (Object.keys(nestedOverlap).length > 0) {
          result[key] = nestedOverlap;
        }
      }
    }
  }

  return result;
}

const obj1 = {
  a: 1,
  b: null,
  c: {
    c1: 123,
    c2: null,
  },
};

const obj2 = {
  a: 1,
  b: null,
  c: {
    c1: 123,
    c2: null,
  },
  d: undefined,
};
console.log(getOverlap(obj1, obj2));
console.log(getOverlap({}, {})); // 输出: null
