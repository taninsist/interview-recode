function reInstanceof(instance, target) {
  let proto = instance.__proto__;
  // 还可以使用 Object.getPrototypeOf(instance) 获取实例的原型
  while (proto) {
    if (proto === target.prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
  return false;
}

console.log({} instanceof Object && reInstanceof({}, Object));
console.log([] instanceof Object && reInstanceof([], Object));

function Proson() {}

const p = new Proson();
console.log(p instanceof Proson === reInstanceof(p, Proson));
// console.log(reInstanceof(null, Proson));
