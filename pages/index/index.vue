<template>
	<view class="content">
		<navBar :opa="opa">测试小程序请勿当真</navBar>
		<view :style="{height: pageHeight, overflow: 'hidden'}">
			<search @search="disableScroll"></search>
			<!-- 焦点图 -->
			<swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
				<swiper-item v-for="item in bannerAry" :key="item._id">
					<navigator :url="'/pages/goods/goods?id='+item.id">
						<image :src="item.img" />
					</navigator>
				</swiper-item>
			</swiper>
			<!-- 导航条 -->
			<view class="navs">
				<navigator url="/pages/category/category" open-type="switchTab">
					<image src="/static/uploads/icon_index_nav_1@2x.png" @click="nav1" />
				</navigator>
				<navigator url="/pages/category/category" open-type="switchTab">
					<image src="/static/uploads/icon_index_nav_2@2x.png" @click="nav2" />
				</navigator>
				<navigator url="/pages/category/category" open-type="switchTab">
					<image src="/static/uploads/icon_index_nav_3@2x.png" @click="nav3" />
				</navigator>
				<navigator url="/pages/category/category" open-type="switchTab">
					<image src="/static/uploads/icon_index_nav_4@2x.png" @click="nav4" />
				</navigator>
			</view>
			<!-- 楼层 -->
			<view class="floors">
				<view class="floor" v-for="(floor, index) in floorList" :key="floor._id">
					<view class="title">
						<image :src="floor.image_src" />
					</view>
					<view class="items">
						<navigator :url="'/pages/goods/goods?id='+product.id" v-for="(product, key) in floor.product_list" :key="product._id">
							<image :src="product.image_src" />
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 注意：你组件是写在components下并且文件下和组件名一样就可以省略掉引入注册这个步奏
	import navBar from '../../components/navBar/navBar.vue'
	export default {
		components: {
			navBar
		},
		data() {
			return {
				pageHeight: null,
				flag: true,
				opa: 0,
				bannerAry: [],
				floorList: []
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
			this.getFloorList()
			console.log('9999')
		},
		onLoad() {
			console.log('监听页面加载')
		},
		onShow() {
			console.log('监听页面显示')
		},
		onReady() {
			console.log('监听页面初次渲染完成')
		},
		onHide() {
			console.log('监听页面隐藏')
		},
		onUnload() {
			console.log('监听页面卸载')
		},
		onShareAppMessage(res) {
			return {
				title: '购物小程序测试主页',
				path: 'pages/index/index'
			}
		},
		onShareTimeline() {
			return {
				title: '购物小程序测试主页',
				path: 'pages/index/index'
			}
		},
		methods: {
			disableScroll(ev) {
				this.pageHeight = ev.pageHeight + 'px';
			},
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
			},
			getFloorList() {
				uniCloud.callFunction({
					name: 'getFloorList',
					success: (res) => {
						console.log(res)
						this.floorList = res.result.data
					}
				})
			},
			nav1(){
				wx.aldstat.sendEvent('点击导航','母婴用品')
			},
			nav2(){
				wx.aldstat.sendEvent('点击导航',{
					'nav':'超市够'
				})
			},
			nav3(){
				wx.aldstat.sendEvent('点击导航',{
					'nav':'秒杀拍'
				})
			},
			nav4(){
				wx.aldstat.sendEvent('点击导航',{
					'nav':'分类'
				})
			}

		}
	}
</script>

<style lang="less">
	page {
		background-color: #dfe7e7;
	}

	.content {
		image {
			width: 100%;
			height: 100%;
		}
	}

	.banner {
		width: 100%;
		height: 340rpx;

		image {
			width: 100%;
			height: 340rpx;
		}
	}

	.navs {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 44rpx;

		image {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floors {

		.title {
			width: 750rpx;
			height: 60rpx;
			padding-top: 20rpx;
			background-color: #f4f4f4;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.items {
			padding: 20rpx 16rpx;
			overflow: hidden;

			navigator {
				width: 232rpx;
				height: 188rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
				float: left;
			}

			navigator:nth-child(2n+1) {
				margin-right: 0;
			}

			navigator:first-child {
				height: 386rpx;
				margin-right: 10rpx;
			}
		}
	}
</style>
