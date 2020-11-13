<template>
	<view :style="{height:statusBarHeight+45+'px'}">
		<view class='top_nav_box'>
			<view :style="{height:statusBarHeight+'px'}" class='empty_box' :class="{'opa':opa}"></view>
			<view class="nav_box" :class="{'opa':opa}">
				<text class="iconfont" :class="{'icon-fanhui':left}"></text>
				<view class="text_box">
					<slot>默认的头部</slot>
				</view>
				<text></text>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			left: {
				type: Boolean,
				default: false
			},
			opa: {
				type: Number
			}
		},
		data() {
			return {
				statusBarHeight: 0
			};
		},
		created() {
			// 获取手机顶部距离
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight

		}
	}
</script>

<style lang="less">
	.top_nav_box {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		.text_box {
			font-size: 13px;
		}
		.empty_box {
			background: rgba(0, 0, 0, 0);

			&.opa {
				background: #eee;
			}
		}

		.nav_box {
			height: 45px;
			padding: 5px;
			background: rgba(0, 0, 0, 0);
			display: flex;
			align-items: center;
			box-sizing: border-box;
			justify-content: space-between;
			width: 100%;

			&.opa {
				background: #eee;
			}
		}

	}
</style>
