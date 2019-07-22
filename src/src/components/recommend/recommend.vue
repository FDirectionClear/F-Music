<template>
	<div class = "recommend">
		<scroll class = "scroll" ref = "scroll" :click = "true" :data = "hotList">
			<div class = "scroll-content">
				<FSlider  class = "f-slider" ref = "slider">
					<a class = "needsclick" v-for = "(item, index) in slider"
						:key = "index" :href = "item.linkUrl" @click = "picClick">
						<img :src="item.picUrl">
						<!--我已经设置了needsclick，虽然文档说可以现在可以不必needsclick，但是我依旧无法
						实现点击图片可以跳转或者点击链接实现跳转。点击事件总是被阻止，目前怀疑并不是better-scroll
						搞的鬼，很可能是fastclick-->
					</a>
				</FSlider>
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li class="item" v-for = "item in hotList"
							:key = "item.dissid">
							<div class="icon">
								<img width="60" height="60" lazyload :data-original = "item.imgurl">
							</div>
							<div class="text">
								<h2 class="name">{{ item.creator.name }}</h2>
								<p class="desc">{{ item.dissname }}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</scroll>
	</div>
</template>

<script>
import { getSliderMessage, getHotList } from 'api/recommend'
import FSlider from 'base/FSlider/FSlider'
import Scroll from 'base/better-scroll/scroll'
import { ERR_OK } from 'api/config'
import { Flazyload } from 'common/js/FLazyload'

export default {
	name:'recommend',
	directives:{},
	components: {
		FSlider,
		Scroll
	},
	data(){
		return {
			slider: [],
			hotList: []
		}
	},
	methods:{
		_getSliderMessage() {
			getSliderMessage().then((res) => {
				if(res.code === ERR_OK){
					this.slider = res.data.slider
				} else {
					throw new Error('轮播图数据请求退出码异常')
				}
			}).catch((e) => {
				console.warn(`getSliderMessage遇到未知错误：${e}`)
			})
		},
		_getHotList() {
			getHotList().then((res) => {
				if(res.code === ERR_OK){
					this.hotList = res.data.list
				}
				// console.log(res.data)
			}).catch((e) => {
				console.warn(`getHotList遇到未知错误：${e}`)
			})
		},
		picClick(e) {
			console.log("点击事件触发")
			console.log(e)
		}
	},
	created() {
		this._getSliderMessage()
		setTimeout(()=>{
			this._getHotList()
		})
		this._getHotList()
	},
	mounted() {
		console.log('recommend mounted')
		setTimeout(()=>{
			// 手动设置500s延迟来凸显lazyload
			Flazyload()
			this.$refs.scroll.scroll.on('scroll', () => {
				setTimeout(()=>{
					Flazyload()
				},500)
			})
		},500)
	},
	updated(){
		this.$refs.slider.refresh()
		this.$refs.scroll.refresh()
	}
}
</script>

<style lang="stylus" scoped>
@import "~common/style/variable"

.recommend
	position fixed
	// height 100% 这个地方不能100%,应该采用bottom为0的方式保证
	// recommend的底部正好是浏览器底部，否则recommend会超出浏览器
	width 100%
	top 88px
	bottom 0
	.scroll
		overflow hidden
		height 100%
		.f-slider
			height 30%
		.recommend-list
			.list-title
				height 65px
				line-height 65px
				text-align center
				font-size $font-size-medium
				color $color-theme
			.item
				display flex
				box-sizing border-box
				align-items center
				padding 0 20px 20px 20px
				.icon
					flex 0 0 60px
					width 60px
					padding-right 20px
				.text
					display flex
					flex-direction column
					line-height: 20px
					overflow hidden
					font-size $font-size-medium
					.name
						margin-bottom 10px
						color $color-text
					.desc
						color $color-text-d
</style>

