<template>
	<view class="goods-box">
		<view class="wrapper">
			<!-- 商品图片 -->
			<swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
				<swiper-item>
					<image :src="goods.goods_small_logo"></image>
				</swiper-item>
			</swiper>
			<!-- 基本信息 -->
			<view class="meta">
				<view class="price">￥{{goods.goods_price}}</view>
				<view class="name">{{goods.goods_name}}</view>
				<view class="shipment">快递: 免运费</view>
				<text class="collect">收藏</text>
			</view>
			<!-- 商品详情 -->
			<view class="detail">
				<rich-text>
					<view class="lazyimg">
						<view>商品详情 </view>
					</view>
				</rich-text>
			</view>
			<!-- 操作 -->
			<view class="action">
				<button open-type="contact">联系客服</button>
				<text class="cart" @click="goCart">购物车</text>
				<text class="add" @click="addCart">加入购物车</text>
				<text class="buy" @click="buy">立即购买</text>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入 setTimeout 的 Promise 的封装
	import sleep from '@/utils/sleep';
	export default {
		data() {
			return {
				goods: null,
				carts: uni.getStorageSync('carts') || []
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			let id = Number(option.id)
			this.getDetails(id)
		},
		methods: {
			buy() {
				// 提示信息
				uni.showToast({
					title: '测试请勿当真！'
				});
			},
			goCart() {

				// 切换tabBar页面
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			},
			async addCart() {

				// 1. 标准流程是获取商品的信息（商品id, 用户id, 商品数量）
				// 然后将这些信息发送到服务端记录在数据库中

				// 2. 本项目中采用了本地存储的方式，
				// 目的是练习 小程序 相关api 的使用

				// 购物车原来存在的商品
				this.carts = uni.getStorageSync('carts') || [];

				// 如果某商品已经存在于购物车当中，应该让购买数据加1

				// 定义变量标识购物车中是否存在某商品
				let flag = false;
				this.carts.forEach((val) => {
					if (val.goods_id == this.goods.goods_id) {
						val.goods_number += 1;
						// 在购物车找到了某商品，并且完成了加1操作
						flag = true;
					}
				})

				// 否则新增加一条记录
				if (!flag) {
					// 将新的商品加入购物车中
					this.carts.push({
						goods_id: this.goods.goods_id,
						goods_name: this.goods.goods_name,
						goods_price: this.goods.goods_price,
						goods_small_logo: this.goods.goods_small_logo,
						category:this.goods.category,
						goods_number: 1,
						// 辅助数据（选中购车中商品）
						checked: true
					})
				}

				// 重新存在本地
				uni.setStorageSync('carts', this.carts);

				// 提示信息
				uni.showToast({
					title: '加入成功!'
				});

				// 等一会儿
				await sleep(2000);

				// 跳转至购物（非常规做法）
				uni.switchTab({
					url: '/pages/cart/main'
				});
			},
			getDetails(id) {
				uniCloud.callFunction({
					name: 'getDetails',
					data: {
						id: id
					},
					success: (res) => {
						console.log(res)
						this.goods = res.result.data[0]
						
						
						wx.aldVisit({
						    category:this.goods.category,  
						    id:this.goods.goods_id,   
						    name:this.goods.goods_name.substr(0,4),   
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.goods-box {
		.wrapper {
			margin-bottom: 100rpx;
			background-color: #f4f4f4;
		}

		.pics {
			height: 720rpx;
		}

		.meta {
			height: 270rpx;
			line-height: 1;
			padding: 30rpx 180rpx 30rpx 20rpx;
			box-sizing: border-box;
			background-color: #fff;
			position: relative;

			.price {
				font-size: 36rpx;
				color: #ea4451;
				margin-bottom: 30rpx;
			}

			.name {
				color: #333;
				line-height: 1.4;
				font-size: 33rpx;
			}

			.shipment {
				font-size: 27rpx;
				color: #999;
				position: absolute;
				bottom: 30rpx;
			}

			.collect {
				width: 140rpx;
				height: 88rpx;
				text-align: center;
				padding-top: 50rpx;
				box-sizing: border-box;
				border-left: 1rpx solid #ddd;
				font-size: 22rpx;
				color: #999;

				position: absolute;
				right: 20rpx;
				top: 91rpx;
			}
		}

		.detail image {
			width: 100%;
			height: 480rpx;
			margin-top: 20rpx;
		}

		.action {
			width: 100%;
			height: 98rpx;
			background-color: #fff;

			position: fixed;
			left: 0;
			bottom: 0;

			display: flex;

			text {
				display: block;
			}

			.add,
			.buy {
				width: 210rpx;
				text-align: center;
				line-height: 98rpx;
				font-size: 27rpx;
				color: #fff;
			}

			.add {
				background-color: #f4b73f;
			}

			.buy {
				background-color: #ea4451;
			}

			button {
				padding: 0;
				border-radius: 0;
				background-color: #fff;

				&::after {
					border: none;
				}
			}

			button,
			.cart {
				flex: 1;
				line-height: 1;
				color: #989898;
				font-size: 24rpx;
				box-sizing: border-box;
				padding-top: 56rpx;
			}
		}
	}
</style>
