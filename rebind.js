/**
 * 手写 bind
 * Function.prototype.bind
 */
Function.prototype.reBind = function (context, ...arg) {
  const fn = this;
  return () => {
    fn.apply(context, [...arg]);
  };
};

const obj = {
  n: 40,
};

function test(b) {
  console.log(this.n + b);
}

const newTest = test.reBind(obj, 20);
newTest();
