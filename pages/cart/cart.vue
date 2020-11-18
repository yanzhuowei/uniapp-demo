<template>
	<view class="cart-box">
		<view class="wrapper">
			<!-- 收货信息 -->
			<view class="shipment">
				<block v-if="address">
					<view class="dt">收货人: </view>
					<view class="dd meta">
						<text class="name">{{address.userName}}</text>
						<text class="phone">{{address.telNumber}}</text>
					</view>
					<view class="dt">收货地址:</view>
					<view class="dd">{{detailAddress}}</view>
				</block>
				<button @click="chooseAddress" v-else type="primary">收货地址</button>
			</view>
			<!-- 购物车 -->
			<view class="carts">
				<view class="item">
					<!-- 店铺名称 -->
					<view class="shopname">优购商城</view>
					<view class="goods" :key="index" v-for="(cart, index) in carts">
						<!-- 商品图片 -->
						<image class="pic" :src="cart.goods_small_logo"></image>
						<!-- 商品信息 -->
						<view class="meta">
							<p class="name">{{cart.goods_name}}</p>
							<p class="price"><text>￥</text>{{cart.goods_price}}<text>.00</text></p>
							<!-- 加减 -->
							<view class="amount">
								<text class="reduce" @click="changeNumber(-1, index)">-</text>
								<input type="number" :value="cart.goods_number" class="number">
								<text class="plus" @click="changeNumber(1, index)">+</text>
							</view>
						</view>
						<!-- 选框 -->
						<view class="checkbox" @click="toggle(index)">
							<icon type="success" size="20" :color="cart.checked ? '#ea4451' : '#ccc'"></icon>
						</view>
					</view>
				</view>
			</view>
			<!-- 其它 -->
			<view class="extra">
				<label class="checkall">
					<icon type="success" :color="carts.length == checkedCarts.length ? '#ea4451' : '#ccc'" size="20"></icon>
					全选
				</label>
				<view class="total">
					合计: <text>￥</text><label>{{amount}}</label><text>.00</text>
				</view>
				<view class="pay" @click="goPay">结算</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _ from 'lodash'
	export default {
		data() {
			return {
				address: null,
				carts: uni.getStorageSync('carts') || []
			}
		},
		onShow() {
			this.carts = uni.getStorageSync('carts') || [];
		},
		computed: {
			// 获取所有已选中的商品
			checkedCarts() {
				return this.carts.filter((val) => {
					return val.checked;
				})
			},

			amount() {
				let total = 0;
				this.checkedCarts.forEach((val) => {
					total += val.goods_number * val.goods_price;
				})
				return total;
			},

			// 完整地址
			detailAddress() {
				return this.address && (this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo)
			}
		},
		methods: {
			// 修改购物车商品数量
			changeNumber(step, index) {
				// console.log(step, index);

				// 如果进行减操作，最小为 1件 商品
				if (step == -1 && this.carts[index].goods_number <= 1) return;

				// 如果进行加操作，最多为 库存量
				if (step == 1 && this.carts[index].goods_number >= 10) return;

				this.carts[index].goods_number += step;
			},

			// 改变选中状态
			toggle(index) {
				// 改变商品的 checked 的值
				this.carts[index].checked = !this.carts[index].checked;
			},

			async goPay() {


				// 检测是否有选中的商品
				if (this.checkedCarts.length == 0) return uni.showToast({
				    title: '没有选中的商品',
					icon:'none',
				    duration: 2000
				});

				// 检测是否有收货地址
				if (!this.address) return uni.showToast({
				    title: '没有选择收货地址',
					icon:'none',
				    duration: 2000
				});

				// 有没有登录，如没有登录跳转到登录页面
				// if (!uni.getStorageSync('token')) {
				// 	return uni.navigateTo({
				// 		url: '/pages/auth/auth'
				// 	});
				// }

				// 创建订单

				// 创建订单
				// const {
				// 	message
				// } = await request({
				// 	url: '/api/public/v1/my/orders/create',
				// 	method: 'post',
				// 	header: {
				// 		Authorization: mpvue.getStorageSync('token')
				// 	},
				// 	data: {
				// 		order_price: this.amount,  // 订单价格
				// 		consignee_addr: this.detailAddress, // 订单地址
				// 		goods: this.checkedCarts  // 商品列表内部存放商品（ID，amount和goods_price）列表
				// 	}
				// })
				
				
				
				let array = []
				this.checkedCarts.map(item =>{
					let obj = {}
					obj.amount = item.goods_number
					obj.category = item.category
					obj.id = item.goods_id
					obj.name = item.goods_name
					array.push(obj)
				})
				
				wx.aldPayOrder({
				    price:this.amount,   
					details:array
				})
				
				
				
				console.log(this.checkedCarts)

				// 将完成订单创建的商品从购物车中移除
				this.carts = _.differenceWith(this.carts, this.checkedCarts);
				uni.setStorageSync('carts', this.carts);

				// 跳转到订单列表
				uni.navigateTo({
					url: '/pages/order/order'
				});
			},

			chooseAddress() {
				// 获取用户的收货地址
				uni.chooseAddress({
					success: (info) => {
						console.log(info);
						this.address = info;
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.cart-box {
		.shipment {
			height: 100rpx;
			line-height: 2;
			padding: 30rpx 30rpx 40rpx 30rpx;
			font-size: 27rpx;
			color: #333;
			background-color: #fff;
			background-size: contain;
			background-repeat: no-repeat;
			background-position: bottom;

			.dt {
				width: 140rpx;
				float: left;
				clear: both;
			}

			.dd {
				padding-left: 160rpx;
			}

			.meta {
				padding-right: 50rpx;
			}

			text.phone {
				float: right;
			}
		}

		.carts {
			background-color: #f4f4f4;
			padding-bottom: 110rpx;
			overflow: hidden;

			.item {
				margin-top: 20rpx;
			}

			.shopname {
				padding: 30rpx;
				font-size: 30rpx;
				color: #333;
				background-color: #fff;
				border-top: 1rpx solid #eee;
				border-bottom: 1rpx solid #eee;
			}

			.goods {
				display: flex;
				padding: 30rpx 20rpx 30rpx 0;
				margin-left: 100rpx;
				border-bottom: 1rpx solid #eee;
				background-color: #fff;

				position: relative;

				.checkbox {
					display: block;
					width: 101rpx;
					height: 100%;
					background-color: #fff;

					display: flex;
					justify-content: center;
					align-items: center;

					position: absolute;
					left: -100rpx;
					top: 0;
				}

				&:last-child {
					border-bottom: none;
				}

				.pic {
					width: 200rpx;
					height: 200rpx;
					margin-right: 30rpx;
				}

				.meta {
					flex: 1;
					font-size: 27rpx;
					color: #333;
					position: relative;
				}

				.name {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.price {
					position: absolute;
					bottom: 0;

					color: #ea4451;
					font-size: 33rpx;

					text {
						font-size: 22rpx;
					}
				}

				.amount {
					position: absolute;
					bottom: 0;
					right: 20rpx;

					height: 48rpx;
					text-align: center;
					border: 1rpx solid #ddd;
					border-radius: 8rpx;

					display: flex;
					align-items: center;

					text {
						display: block;
						width: 60rpx;
						line-height: 48rpx;
						font-size: 36rpx;
						color: #ddd;
						text-align: center;
					}

					input {
						width: 60rpx;
						height: 48rpx;
						min-height: 48rpx;
						font-size: 27rpx;
						border-left: 1rpx solid #ddd;
						border-right: 1rpx solid #ddd;
					}
				}
			}
		}

		.extra {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 9;

			width: 750rpx;
			height: 96rpx;
			text-align: center;
			line-height: 96rpx;
			font-size: 36rpx;
			border-top: 1rpx solid #eee;
			background-color: #fff;
			color: #333;

			display: flex;

			.checkall {
				width: 140rpx;
				line-height: 1;
				margin-left: 25rpx;
				display: flex;
				align-items: center;

				icon {
					margin-right: 20rpx;
				}
			}

			.total {
				display: flex;
				justify-content: center;
				flex: 1;

				label,
				text {
					color: #ea4451;
					vertical-align: bottom;
					position: relative;
					bottom: -2rpx;
				}

				text {
					position: relative;
					bottom: -3rpx;
					font-size: 24rpx;

					&:first-child {
						margin-left: 10rpx;
					}
				}
			}

			.pay {
				width: 200rpx;
				background-color: #ea4451;
				color: #fff;
			}
		}
	}
</style>
