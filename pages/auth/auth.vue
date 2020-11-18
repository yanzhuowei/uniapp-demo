<template>
	<view>
		<button type="primary" @getuserinfo="getUserInfo" open-type="getUserInfo">微信登录</button>
	</view>
</template>

<script>
	import login from '@/utils/login';
	import getUserInfo from '@/utils/getuserinfo';
	import request from '@/utils/request';
	import getSetting from '@/utils/getsetting';

	export default {
		// 将用户信息发送给服务端，由服务端
		// 对用户信息进行验证，如果通过响应
		// 一个 token ，前端获取这个 token 
		// 将其记录在本地，以后再发请求时
		// 将这个 token 一并发送给服务端即可。

		methods: {
			getUserInfo(ev) {
				// 当出现授权窗口后，用户的操作（允许/拒绝）
				// 都会触发该回调
				// console.log(ev);

				// 解构出用户信息
				const {
					encryptedData,
					iv,
					rawData,
					signature
				} = ev.target;

				// 发送请求，换取 token
				this.auth(encryptedData, iv, rawData, signature);
			},

			async auth(encryptedData, iv, rawData, signature) {

				// 1. 获取登录凭证
				const {
					code
				} = await login();
				// console.log(code);

				// 2. 发送请求
				const info = await request({
					url: '/api/public/v1/users/wxlogin',
					method: 'post',
					data: {
						code,
						encryptedData,
						iv,
						rawData,
						signature
					}
				})

				// 记录 token
				if (info.meta.status == 200) {
					uni.setStorageSync('token', info.message.token);
				}

				// 返回上一步操作
				uni.navigateBack({
					delta: 1
				});

				// console.log(info);

				// 获取请求所需要的一些参数
				// 1. 获取 code 即登录凭证
				// uni.login({
				//   success: function (res) {
				//     console.log(res);
				//   }
				// })

				// 3. 发送请求
				// request({
				//   url: '/api/public/v1/users/wxlogin',
				//   data: {
				//     code,
				//     iv,
				//     ...
				//   },

				//   success: function (token) {
				//     uni.setStorageSync('token', token);
				//   }
				// })
			}
		},

		async onLoad() {

			// 如果用户已经授权了，主动的调用接口获取用户信息
			const {
				authSetting
			} = await getSetting();

			if (authSetting['scope.userInfo']) {
				// 用户的信息
				const {
					encryptedData,
					iv,
					rawData,
					signature
				} = await getUserInfo();

				// 调用登录接口
				this.auth(encryptedData, iv, rawData, signature);
			}


			// var _this = this;

			// 2. 获取用户信息，getUserInfo 如果用户在未授权的情况下
			// 无法获取用户的信息！！！

			// 必须由用户主动点击，打开授权窗口！！
			// wx.getUserInfo({
			//   success: function (info) {
			//     // console.log(info);

			//     const {encryptedData, iv, rawData, signature} = info;
			//     _this.auth(encryptedData, iv, rawData, signature);
			//   }
			// })
		}
	}
</script>

<style>
  button {
    width: 600rpx;
    margin: 200rpx auto 0; 
  }
</style>
