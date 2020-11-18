<template>
	<view class="search-box">
		<!-- 搜索 -->
		<view class="search" :class="{focused: focused}">
			<!-- 搜索框 -->
			<view class="input-wrap" @click="goSearch">
				<input type="text" @confirm="goList" v-model="keywords" @input="query" :placeholder="placeholder">
				<text class="cancle" @click.stop="cancleSearch">取消</text>
			</view>
			<!-- 搜索结果 -->
			<view class="content">
				<view class="title">搜索历史<text class="clear"></text></view>
				<view class="history">
					 <navigator url="/pages/list/list" :key="index" v-for="(item, index) in history">{{item}}</navigator>
				</view>
				<!-- 结果 -->
				<view v-if="list.length">
					<scroll-view scroll-y class="result" >
						 <navigator :url="'/pages/goods/goods?id=' + item.goods_id" :key="item.goods_id" v-for="item in list">{{item.goods_name}}</navigator>
					</scroll-view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				focused: false,
				placeholder: '',
				// 搜索关键字
				keywords: '',
				// 搜索建议
				list: [],
				// 标识请求的状态
				locked: false,
				// 搜索词
				history: uni.getStorageSync('history') || []
			};
		},
		created() {
			// 获取手机顶部距离
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight

		},
		methods: {
			goSearch(ev) {
				this.focused = true;
				this.placeholder = '请输入您要搜索的内容';

				// 触发父组件自定义事件
				this.$emit('search', {
					pageHeight: uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight
				})
				
				// 隐藏tabBar
				uni.hideTabBar();
				
				wx.aldstat.sendEvent('点击搜索')
				
				
			},
			cancleSearch() {
				this.focused = false;
				this.placeholder = '';
				// 将搜索操作恢复成初始状态
				this.keywords = '';
				this.list = [];

				// 触发父组件自定义事件
				this.$emit('search', {
					pageHeight: 'auto'
				})

				// 显示tabBar
				uni.showTabBar();
			},
			// 根据用户的输入，发送请求
			query() {

				// 当上一次请求完毕时，locked 值为 false
				if (this.locked) return;

				// 如果查询的字符为空时，阻止这次请求
				if (this.keywords == '') return this.list = [];

				// 当请求开如发送时，locked 值为 true
				this.locked = true;
				
				
				
				uniCloud.callFunction({
					name: 'Search',
					data: {
						name: this.keywords
					},
					success: (res) => {
						console.log(res)
						// 列新 list 数据
						this.list = res.result.data || [];
						
						console.log(this.list)
						
						// 直到请求完毕时，将 locked 值设为 false
						this.locked = false;
					}
				})

			
				
			},
			goList() {

				// 将用户输入的搜索词记录在本地（storage）

				// 为了保证数据能够永远记录下来，需要将存储中的数据
				// 取出
				this.history = uni.getStorageSync('history') || [];

				// 新增搜索词
				this.history.push(this.keywords);

				// 对数组去除重复
				this.history = [...new Set(this.history)];

				uni.setStorageSync('history', this.history);

				// 跳转至商品列表页面
				uni.navigateTo({
					url: '/pages/list/list'
				});
			}
		}
	}
</script>

<style lang="less">
	.search-box {
		width: 100%;
		height: 100%;
		position: relative;

		.search {
			display: flex;
			flex-direction: column;

			// 搜索框
			.input-wrap {
				display: flex;
				height: 100rpx;
				padding: 20rpx 30rpx;
				background-color: #ea4451;
				box-sizing: border-box;
				position: relative;

				&::before,
				&::after {
					height: 44rpx;
					line-height: 1;
					background-size: 32rpx;
					background-position: 6rpx center;
					background-repeat: no-repeat;

					position: absolute;
					top: 28rpx;
					z-index: 9;
				}

				&::before {
					content: '搜索';
					display: block;

					width: 100rpx;
					padding: 11rpx 0 10rpx 44rpx;
					box-sizing: border-box;
					color: #666;
					font-size: 24rpx;
					left: 325rpx;
				}

				&::after {
					display: none;
					content: '';
					width: 44rpx;
					left: 40rpx;
				}

				input {
					flex: 1;
					height: 60rpx;
					padding: 0 20rpx 0 64rpx;
					background-color: #fff;
					border-radius: 8rpx;
					font-size: 24rpx;
					color: #666;
				}

				text.cancle {
					display: none;
					width: 80rpx;
					text-align: right;
					line-height: 60rpx;
					font-size: 27rpx;
					color: #666;
				}
			}

			// 搜索结果
			.content {
				display: none;
				flex: 1;
				padding: 27rpx;
				background-color: #fff;
				position: relative;

				.title {
					font-size: 27rpx;
					line-height: 1;
					color: #333;
				}

				.clear {
					display: block;
					width: 27rpx;
					height: 27rpx;
					float: right;
					background-size: cover;
				}

				.history {
					padding-top: 30rpx;

					navigator {
						display: inline-block;
						line-height: 1;
						padding: 15rpx 20rpx 12rpx;
						background-color: #ddd;
						font-size: 24rpx;
						margin-right: 20rpx;
						margin-bottom: 15rpx;
						color: #333;
					}
				}

				.result {
					display: block;
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					background-color: #fff;

					navigator {
						line-height: 1.5;
						padding: 20rpx 30rpx;
						font-size: 24rpx;
						color: #666;
						border-bottom: 1px solid #eee;

						&:last-child {
							border-bottom: none;
						}
					}
				}
			}

			// 获得焦点状态
			&.focused {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 9;

				.input-wrap {
					background-color: #eee;

					&::before {
						display: none;
					}

					&::after {
						display: block;
					}
				}

				text.cancle {
					display: block;
				}

				.content {
					display: block;
				}
			}
		}
	}
</style>
