/**
 * 6. 手写promisefy, 转换callback形式为promise形式
 */
type Payload = {
  url: string;
  data?: any;
  method: string;
  success?: (res: any) => void;
  fail?: (reason: any) => void;
};

function Ajax(payload: Payload) {
  setTimeout(() => {
    payload.success && payload.success({ code: 200, data: [] });
  }, 1000);
}
// 正常调用ajax获取接口数据
Ajax({
  url: "",
  method: "post",
  success(data) {
    console.log(data);
  },
});

// 提供一个辅助函数将接受Payload类型参数的函数转换成Promisefy形式
function promisefy(ajax) {
  return (payload) => {
    return new Promise((resolve, reject) => {
      payload.success = (data) => {
        resolve(data);
      };
      ajax(payload);
    });
  };
}

promisefy(Ajax)({ url: "", method: "post" }).then((data) => {
  console.log(data);
});
