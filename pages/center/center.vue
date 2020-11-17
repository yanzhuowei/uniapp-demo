<template>
	<view class="user-box">
		<view class="wrapper">
			<!-- 个人资料 -->
			<view class="profile">
				<view class="meta">
					<image src="/static/uploads/monkey.png" class="avatar" alt="">
						<text>登录/注册</text>
				</view>
			</view>
			<!-- 统计 -->
			<view class="count">
				<view class="cell">
					0 <text>收藏的店铺</text>
				</view>
				<view class="cell">
					0 <text>收藏的商品</text>
				</view>
				<view class="cell">
					0 <text>关注的商品</text>
				</view>
				<view class="cell">
					0 <text>我的足迹</text>
				</view>
			</view>
			<!-- 我的订单 -->
			<view class="orders">
				<view class="title">我的订单</view>
				<view class="sorts">
					<text class="iconfont icon-daifukuan">待付款</text>
					<text class="iconfont icon-icon3">待收货</text>
					<text class="iconfont icon-icon5">退款/退货</text>
					<text class="iconfont icon-icon_order">全部订单</text>
				</view>
			</view>
			<!-- 地址管理 -->
			<view class="address">
				收货地址管理
			</view>
			<!-- 其它 -->
			<view class="extra">
				<view class="item">联系客服</view>
				<view class="item">意见反馈</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="less">
	.user-box {
		.wrapper {
			position: absolute;
			top: 0;
			bottom: 0;

			width: 100%;
			background-color: #f4f4f4;
		}

		.profile {
			height: 390rpx;
			background-color: #ea4451;
			display: flex;
			justify-content: center;
			align-items: center;

			.meta {

				.avatar {
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					border: 2rpx solid #fff;
				}

				text {
					display: block;
					text-align: center;
					margin-top: 20rpx;
					font-size: 24rpx;
					color: #fff;
				}
			}
		}

		.count {
			display: flex;
			margin: 0 20rpx;
			height: 100rpx;
			text-align: center;
			background-color: #fff;

			position: relative;
			top: -24rpx;

			.cell {
				flex: 1;
				padding-top: 16rpx;
				font-size: 24rpx;
				color: #666;
			}

			text {
				display: block;
			}
		}

		.orders {
			margin: 0 20rpx;
			padding: 20rpx 0;
			background-color: #fff;

			.title {
				padding-left: 20rpx;
				font-size: 30rpx;
				color: #333;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #eee;
			}

			.sorts {
				padding-top: 30rpx;
				text-align: center;
				display: flex;
			}

			.iconfont {
				flex: 1;
				font-size: 27rpx;

				&::before {
					display: block;
					font-size: 48rpx;
					color: #ea4451;
				}
			}
		}

		.address {
			height: 88rpx;
			line-height: 88rpx;
			background-color: #fff;
			font-size: 30rpx;
			padding-left: 20rpx;
			margin: 20rpx;
			color: #333;
		}

		.extra {
			margin: 0 20rpx;
			background-color: #fff;

			.item {
				height: 88rpx;
				line-height: 88rpx;
				padding-left: 20rpx;
				border-bottom: 1rpx solid #eee;
				font-size: 30rpx;
				color: #333;
			}
		}
	}
</style>
