/**
 * 并发异步请求
 * @param {Task[]} tasks 所有的异步任务
 * @param {number} concurrent 最大运行可运行任务
 * @description 要求
 * 1. 尽量多的同时多个任务
 * 2. 按 原来的索引返回任务结果
 * 3. 错误请求，不会中断其他请求
 */
async function concurrentRequeset(tasks, concurrent) {
  const outcome = new Array(tasks.length).fill(0);
  let index = 0;
  const inProcess = [];

  async function run() {
    if (index === tasks.length) {
      return Promise.resolve();
    }

    let curIndex = index;
    const task = tasks[index++];

    const p = task()
      .then((data) => {
        outcome[curIndex] = data;
        inProcess.splice(inProcess.indexOf(p), 1);
      })
      .catch((err) => {
        outcome[curIndex] = err;
        inProcess.splice(inProcess.indexOf(p), 1);
      });

    inProcess.push(p);

    console.log(inProcess.length, index);

    if (inProcess.length >= concurrent) {
      await Promise.race(inProcess);
    }

    await run();
  }

  await run();

  await Promise.all(inProcess);

  return outcome;
}

const tasks = generatesTask(20);

concurrentRequeset(tasks, 5)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

function generatesTask(count) {
  const tasks = [];
  for (let i = 1; i <= count; i++) {
    const cur = function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.8) {
            resolve({ id: i });
          } else {
            reject({ err: `user id is ${i}` });
          }
        }, getRandom(1000, 5000));
      });
    };
    tasks.push(cur);
  }
  return tasks;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// console.log([1, 2, 3, 4].splice(0, 1));
