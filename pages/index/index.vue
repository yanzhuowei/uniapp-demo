<template>
	<view class="content">
		<navBar :opa="opa">小小课堂</navBar>
		<view class="swiper_box">
			<swiper class="swiper" :autoplay="true" :circular="true">
				<swiper-item v-for='item in bannerAry' :key='item._id'>
					<image :src="item.img" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<video id="myVideo" src="http://v29-dy.ixigua.com/ff3cce6e27a2edaea070408f85a5db80/5fae61f3/video/tos/cn/tos-cn-ve-15/8f500ae77f8d495f9bb195fa2f8e2f8a/?a=1128&br=4380&bt=1460&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=202011131737160101980662064B031D16&lr=aweme_search_suffix&mime_type=video_mp4&qs=0&rc=Mzg7eT"
		                    enable-danmu danmu-btn controls></video>
		
	</view>
</template>

<script>
	// 注意：你组件是写在components下并且文件下和组件名一样就可以省略掉引入注册这个步奏
	import navBar from '../../components/navBar/navBar.vue'
	export default {
		components:{
			navBar
		},
		data() {
			return {
				flag: true,
				opa: 0,
				bannerAry: []
			}
		},
		onPageScroll({
			scrollTop
		}) {
			this.flag = true;
			if (scrollTop > 5) {
				this.opa = 1;
			} else {
				this.opa = 0;
			}
		},
		created() {
			this.getBanner()
			console.log('9999')
		},
		onLoad() {
			console.log('监听页面加载')
		},
		onShow() {
			console.log('监听页面显示')
		},
		onReady(){
			console.log('监听页面初次渲染完成')
		},
		onHide(){
			console.log('监听页面隐藏')
		},
		onUnload(){
			console.log('监听页面卸载')
		},
		methods: {
			// 1、创建云函数，部署云函数
			// 2、在使用的地方进行调用
			getBanner() {
				uniCloud.callFunction({
					name: 'getBanner',
					success: (res) => {
						console.log(res)
						this.bannerAry = res.result.data
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #dfe7e7;
	}

	.content {}

	.swiper_box {
		height: 180px;
		width: 80%;
		margin: auto;
		overflow: hidden;
		border-radius: 10px;
		background-color: #eee;

		.swiper {
			height: 100%;

			image {
				width: 100%;
			}
		}
	}
</style>
