const PADDING = "padding";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  #state = PADDING;
  #value = undefined;
  #handers = [];

  #changeState(state, value) {
    if (this.#state === PADDING) {
      this.#state = state;
      this.#value = value;
      this.#run();
    }
  }

  #isPromiseLike(data) {
    const t = typeof data;
    if (data && (t === "object" || t === "function")) {
      const then = data.then;
      return typeof then === "function";
    }
    return false;
  }

  #runMicroTask(func) {
    if (typeof process === "object" && typeof process.nextTick === "function") {
      // Node 环境
      process.nextTick(func);
    } else if (typeof MutationObserver === "function") {
      const ob = new MutationObserver(func);
      const textNode = document.createTextNode("1");
      ob.observe(textNode, {
        characterData: true,
      });
      textNode.data = "2";
    } else {
      setTimeout(func, 0);
    }
  }

  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== "function") {
        const settled = this.#state === FULFILLED ? resolve : reject;
        settled(this.#value);
      }
      try {
        const data = callback(this.#value);
        if (this.#isPromiseLike(data)) {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  #run() {
    if (this.#state === PADDING) return null;
    while (this.#handers.length) {
      const { onFulfilled, onRejected, resolve, reject } =
        this.#handers.shift();
      if (this.#state === FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject);
        // if (typeof onFulfilled === "function") {
        //   try {
        //     onFulfilled(this.#value);
        //   } catch (err) {
        //     reject(err);
        //   }
        // } else {
        //   resolve(this.#value);
        // }
      } else {
        this.#runOne(onRejected, resolve, reject);
        // if (typeof onRejected === "function") {
        //   try {
        //     onRejected(this.#value);
        //   } catch (err) {
        //     reject(err);
        //   }
        // } else {
        //   reject(this.#value);
        // }
      }
    }
  }

  /**
   *
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   * @returns
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handers.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }

  /**
   *
   * @param {(resolve, reject) => MyPromise} executor
   */
  constructor(executor) {
    const resolve = (value) => {
      this.#changeState(FULFILLED, value);
    };
    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
}

setTimeout(() => {
  console.log(1);
});

new Promise((resolve) => {
  resolve(2);
}).then((data) => {
  console.log(data);
});

console.log(3);
