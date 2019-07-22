<template>
	<div ref = "wrapper" id = "wrapper">
		<!---better-scroll插件只能滚动wrapper的第一个子元素-->
		<!--保证插入scroll组件slot中的内容被一个container包裹-->
		<slot></slot>
	</div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
	props:{
		probeType:{
			// 在滚动时的原生scroll事件派发情况
			// 0：不派发
			// 1：滑动固定时间派发
			// 2: 滑动实时派发（手指拖拽）
			// 3:　滚动实时派发
			type:Number,
			default:3
		},
		click:{
			// better-scroll会preventDefault原生click事件
			// 如需在点击的时候触发click事件，better-scroll
			// 将模拟一个click事件
			type:Boolean,
			default:false
		},
		data: {
			// data在scroll组件中抽象出来，因为当scroll的slot中的DOM尺寸受到异步数据影响时，不能
			//保证DOM中的异步数据能在scroll子组件初始化前得到，因此往往导致初次渲染时子组件的DOM高度
			// 没有撑开，导致无法滚动，需要父组件监视数据然后手动调用scroll的refresh方法。这样命令式
			// 的做法会带来代码冗余，因此我们scroll组件自己来监听slot中的异步数据的变化。
			type: Array,
			default: null
		},
		listenScroll: {
			type: Boolean,
			default: true
		}
	},
	data(){
		return {
			scroll: null
		}
	},
	mounted(){
		setTimeout(()=>{
			// console.log(this)
			// 不急着去init，给浏览器刷新DOM的时间
			this.init()
		},20)
	},
	methods:{
		init(){
			if(!this.$refs.wrapper){
				// 如果没有$refs.wrapper，better-scroll在初始化的时候却调用了他
				// 那么就回报错。
				console.warn(`better-scroll : this.$refs.wrapper不存在`)
				return
			}
			this.scroll = new BScroll(
				this.$refs.wrapper,
				{
					probeType: this.probeType,
					click: this.click
				}
			)
			if(this.listenScroll) {
				// 如果开启listenScroll，则向上派发事件'scroll'，将当前滚动的距离告
				// 知外部组件
				this.scroll.on('scroll', (pos) => {
					this.$emit('scroll', pos)
				})
        	}
		},
		refresh(){
			// 因为高度在第一次初始化的时候
			// 在有数据变更的时候刷新better-scroll的滚动板
			this.scroll && this.scroll.refresh()
		},
		enable() {
			this.scroll &&　this.scroll.enable()
		},
		disable() {
			this.scroll && this.scroll.disable()
		},
		scrollTo () {
        	this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      	},
		scrollToElement () {
			this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
		},
	},
	watch:{
		data(){
			// 当data发生变化时，说明异步数据已经返回。需要重新渲染。
			setTimeout(()=>{
				this.refresh()
			},20)
		}
	}
}
</script>
