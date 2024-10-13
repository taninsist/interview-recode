/**
 * 求两个大数的和
 * @param {number | string} n1
 * @param {number | string} n2
 * @param {string}
 * @description 要求不使用 BigInt
 * @description 解法转为 字符串，逐个相加
 */
function largeNumSum(n1, n2) {
  // S = O(N) T = O(N)

  let n1s = String(n1).split("");
  let n2s = String(n2).split("");

  const sortArr = n1s.length < n2s.length ? n1s : n2s;
  const longArr = sortArr === n1s ? n2s : n1s;

  const len = longArr.length;

  const meredArr = [];
  for (let i = 0; i < len; i++) {
    let sort = sortArr.pop();
    let long = longArr.pop();
    sort = sort ? sort : 0;
    long = long ? long : 0;
    meredArr.unshift(Number(long) + Number(sort));
  }

  const mergeLen = meredArr.length;
  let carry = 0;
  let outcome = "";
  for (let i = 0; i < mergeLen; i++) {
    let cur = meredArr.pop() + carry;
    carry = Math.floor(cur / 10);
    outcome = (cur % 10) + outcome;
  }

  if (carry > 0) {
    outcome = carry + outcome;
  }

  return outcome;
}

console.log(largeNumSum(123567123123123, 123567) == 123567123123123 + 123567);
