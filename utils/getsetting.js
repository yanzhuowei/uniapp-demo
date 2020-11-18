
export default function () {

  return new Promise((resolve, reject) => {
    // 封装成 promise
    mpvue.getSetting({
      success (info) {
        resolve(info)
      }
    })
  })
}