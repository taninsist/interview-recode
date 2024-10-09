/**
 * 手写 bind
 * Function.prototype.bind
 */
Function.prototype.myBind = function (context, ...args1) {
  const fn = this;
  return function (...args2) {
    // 判断是否是通过 new 关键字调用
    if (this instanceof fn) {
      return new fn(...args1, ...args2);
    } else {
      return fn.apply(context, [...args1, ...args2]);
    }
  };
};

const obj = {
  n: 40,
};

function test(a, b, c, d) {
  console.log(this.n, a, b, c, d);
}

const newTest = test.myBind(obj, 20);
newTest(1, 2, 3, 4, 6);
