const PADDING = "padding";
const FULFULLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  /**
   * Promise 的返回值
   */
  #value = undefined;
  /**
   * Primise 的 状态
   */
  #state = PADDING;
  /**
   * then 的处理函数
   */
  #handers = [];

  /**
   * state change hander function
   * @param {*} state
   * @param {*} value
   */
  #stateChange(state, value) {
    if (this.#state === PADDING) {
      this.#state = state;
      this.#value = value;
    }
  }

  /**
   * 运行 所有的 then callback
   */
  #run() {
    if (this.#state === PADDING) return;
    while (this.#handers.length) {
      const { onfulfilled, onrejected, resolve, reject } =
        this.#handers.shift();
      if (this.#state === FULFULLED) {
        // 推向 fulfilled 状态
        if (typeof onfulfilled === "function") {
          try {
            const result = onfulfilled(this.#value);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        } else {
          resolve(this.#value);
        }
      } else {
        // 推向 rejected 状态
        if (typeof onrejected === "function") {
          try {
            const result = onrejected(this.#value);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        } else {
          resolve(this.#value);
        }
      }
    }

    /*
      1. 如果不是 一个 function ,则 state，value 穿透
      2. 如果报错 则 reject 状态，value 穿透

       */
  }

  then(onfulfilled, onrejected) {
    return new MyPromise((resolve, reject) => {
      this.#handers.push({
        onfulfilled,
        onrejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }

  constructor(executor) {
    const resolve = (value) => {
      this.#stateChange(FULFULLED, value);
    };
    const reject = (reason) => {
      this.#stateChange(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
}

new MyPromise((resolve, reject) => {
  console.log(123);
  resolve("resolve");
  // reject("reject");
  // throw "12332312";
})
  .then((data) => {
    console.log(data, "then1");
    // return "then 2";
    throw "err then";
  })
  .then(
    (data) => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    }
  );
// .then(
//   (data) => {
//     console.log(data, "then 2");
//   },
//   (err) => {
//     console.log(err, "err2");
//   }
// );

console.log("---------------");
const p1 = new Promise((resolve, reject) => {
  resolve(123);
  // throw "err";
})
  .then(null)
  .then((data) => {
    console.log(data);
  });

// const p2 = p1.then();
// p2.then((data) => {
//   console.log(data);
// });
