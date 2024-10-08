/**
 * 深拷贝 Alpha 版
 * @param {*} obj 
 * @returns 
 */
function deepClone(obj) {
  const newData = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      newData[key] = deepClone(obj[key]);
    } else {
      newData[key] = obj[key];
    }
  }
  return newData;
}
const obj1 = {
  a: 1,
  b: [],
  c: {},
};
const obj2 = deepClone(obj1);
console.log(
  obj1 === obj2,
  obj1.a === obj2.a,
  obj1.b === obj2.b,
  obj1.c === obj2.c
);
