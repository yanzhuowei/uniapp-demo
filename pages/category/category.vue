<template>
	<view class="category-box">
		<!-- 分类 -->
		<view class="category">
			<!-- 顶级分类 -->
			<view class="sup">
				<scroll-view scroll-y>
					<view class="li" :class="{active: topIndex == currentIndex}" :key="topIndex" v-for="(top, topIndex) in topCategory" @click="getChild(topIndex)">{{top.cat_name}}</view>
				</scroll-view>
			</view>
			<!-- 子级分类 -->
			<view class="sub">
				<scroll-view scroll-y>
					<!-- 封面图 -->
					<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zryt1mcggj5o0b4296/f8fa3e30-2964-11eb-b680-7980c8a877b8.png" class="thumb"></image>
					<view class="children" :key="childIndex" v-for="(child, childIndex) in childCategory">
						<view class="title">{{child.cat_name}}</view>
						<!-- 品牌 -->
						<view class="brands">
							<navigator :url="'/pages/list/list?query=' + product.cat_name" :key="productIndex" v-for="(product, productIndex) in child.children">
								<image :src="product.cat_icon"></image>
								<text>{{product.cat_name}}</text>
							</navigator>
						</view>
					</view>

					
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 一级分类
				topCategory: [],
				// 当前一级分类的索引值
				currentIndex: 0

			}
		},
		created() {
			// 调用获取一级分类接口
			this.getTopCategory();
		},
		onShow() {
		},
		// 计算属性
		computed: {
			// 根据一级分类的索引值，计算出对应的二级分类
			childCategory() {
				return this.topCategory.length && this.topCategory[this.currentIndex].children;
			}
		},
		onShareAppMessage(res) {
			return {
				title: '购物小程序测试分类页',
				path: 'pages/category/category'
			}
		},
		onShareTimeline() {
			return {
				title: '购物小程序测试分类页',
				path: 'pages/category/category'
			}
		},
		methods: {
			// 获取二级分类
			getChild(index) {
				this.currentIndex = index;
			},
			getTopCategory() {
				uniCloud.callFunction({
					name: 'getCategory',
					success: (res) => {
						console.log(res)
						this.topCategory = res.result.data
					}
				})
			},
		}
	}
</script>

<style lang="less">
	.category-box {
		scroll-view {
			height: 100%;
		}

		.category {
			display: flex;
			width: 100%;
			position: absolute;
			top: 0rpx;
			bottom: 0;

			.sup {
				width: 196rpx;
				background-color: #f4f4f4;

				.li {
					height: 100rpx;
					text-align: center;
					line-height: 100rpx;
					font-size: 27rpx;
					color: #333;
					border-bottom: 1rpx solid #eee;

					&:last-child {
						border-bottom: none;
					}

					&.active {
						background-color: #FFF;
						color: #ea4451;
						position: relative;

						&::before {
							content: '';
							display: block;
							width: 8rpx;
							height: 60rpx;
							transform: translateY(-50%);
							background-color: #ea4451;

							position: absolute;
							left: 0;
							top: 50%;
						}
					}
				}
			}

			.sub {
				flex: 1;
				padding: 20rpx 18rpx;

				.thumb {
					width: 100%;
					height: 180rpx;
				}

				.children {
					text-align: center;
					color: #333;

					.title {
						display: inline-block;
						margin: 40rpx 0 20rpx;
						font-size: 30rpx;

						&::before {
							content: '/';
							margin-right: 20rpx;
							color: #666;
						}

						&::after {
							content: '/';
							margin-left: 20rpx;
							color: #666;
						}
					}
				}

				.brands {
					display: flex;
					flex-wrap: wrap;

					navigator {
						width: 33%;
						margin-bottom: 20rpx;
					}

					image {
						width: 120rpx;
						height: 120rpx;
					}

					text {
						display: block;
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>
