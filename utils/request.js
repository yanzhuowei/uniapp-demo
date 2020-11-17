
export default function (obj) {
  // console.log('我是一个模块');

  // 处理初始参数
  let url = obj.url || '';
  let data = obj.data || {};
  let method = obj.method || 'get';
  let header = obj.header || {};

  // 配置基础路径
  url = 'https://www.zhengzhicheng.cn' + url;

  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    //   resolve();
    // }, 2000)

    // 原本的异步代码，写在 Promise 构造函数内部
    // 即实现了 Promise 封装！！！

    // 开始请求，开启加载状态
    uni.showLoading({title: '正在加载...'})

    // 发送请求
    uni.request({
      url,
      method,
      data,
      header,
      success (info) {
        resolve(info.data);

        // 终止加载状态
        uni.hideLoading();
      }
    })
  })

}