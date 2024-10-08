# 文档

- [Promise/A+ 规范](https://promisesaplus.com/)
- [官方示例](https://www.promisejs.org/implementing/)
- [中文文档](https://tsejx.github.io/javascript-guidebook/standard-built-in-objects/control-abstraction-objects/promise-standard/#%E8%A7%84%E8%8C%83%E6%9C%AF%E8%AF%AD)
- [测试用例](https://github.com/promises-aplus/promises-tests)

# 避坑

## 1. 抛出错误后，promise 状态会变为 rejected，reason 为抛出的错误

```js
let p = new Promise((resolve, reject) => {
  throw 123;
});
```

- p `state` 为 `rejected`
- p `reason` 为 `123`

==原理==：使用 `try catch` 捕获错误，然后调用 `reject` 方法

```js
try {
  executor(resolve, reject);
} catch (err) {
  reject(err);
}
```

## 2. 异步抛出错误，promise 是捕获不到的

```js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    throw 123;
  }, 0);
});
```

- p `state` 为 `pending`

## 3. then 方法的返回值

p1.then 方法返回的是一个新的 promise，记为 p2

- 回调不是函数：如果 onFulfilled 或 onRejected 不是一个方法，则 p2 的状态和值与 p1 相同 —— 称为 `穿透`

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123);
  // reject("err");
});
let p2 = p1.then();
p2.then(
  (value) => {
    console.log(value); // 123
  },
  (reason) => {
    console.log(reason);
  }
);
```

- 回调是函数：如果 onFulfilled 或 onRejected 返回一个值，则 p2 的状态为 `fulfilled`，值为返回的值

```js
let p1 = new Promise((resolve, reject) => {
  reject(123);
});
let p2 = p1.then(() => {
  return 456;
});
p2.then(
  (value) => {
    console.log(value); // 456
  },
  (reason) => {
    console.log(reason);
  }
);
```

- 如果 onFulfilled 或 onRejected 抛出一个错误，则 p2 的状态为 `rejected`，值为抛出的错误

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123);
});
let p2 = p1.then(() => {
  throw 456;
});
p2.then(
  (value) => {
    console.log(value);
  },
  (reason) => {
    console.log(reason); // 456
  }
);
```

- 如果 onFulfilled 或 onRejected 返回一个 promise，则 p2 的状态和值与返回的 promise 相同

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123);
});
let p2 = p1.then(() => {
  return new Promise((resolve, reject) => {
    resolve(456);
  });
});
p2.then(
  (value) => {
    console.log(value); // 456
  },
  (reason) => {
    console.log(reason);
  }
);
```

- 如果 onFulfilled 或 onRejected 返回一个 promise，且返回的 promise 为 p2 本身，则抛出错误

```js
let p1 = new Promise((resolve, reject) => {
  resolve(123);
});
let p2 = p1.then(() => {
  return p2;
});
p2.then(
  (value) => {
    console.log(value);
  },
  (reason) => {
    console.log(reason); // TypeError: Chaining cycle detected for promise #<Promise>
  }
);
```
