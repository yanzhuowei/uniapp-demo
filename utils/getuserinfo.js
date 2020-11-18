
export default function () {

  return new Promise((resolve, reject) => {
    // 封装成 promise
    mpvue.getUserInfo({
      success (info) {
        resolve(info)
      }
    })
  })
}