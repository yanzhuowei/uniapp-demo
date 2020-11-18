
export default function () {

  return new Promise((resolve, reject) => {
    // 封装成 promise
    mpvue.login({
      success (info) {
        resolve(info)
      }
    })
  })
}