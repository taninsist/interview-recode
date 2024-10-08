/**
 * 用setTimeout实现setInterval，并提供api可以使定时器停下
 */

function ISetTimeOut(e, t) {
  let timer = null;
  const fn = () => {
    timer = setTimeout(() => {
      e();
      fn();
    }, t);
  };
  fn();
  return () => {
    clearTimeout(timer);
  };
}

const close = ISetTimeOut(() => {
  console.log(11);
}, 1000);

setTimeout(() => {
  close();
  console.log("clear ISetTimeOut");
}, 5000);
