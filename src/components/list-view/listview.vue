<template>
	<scroll :data = "listData"
			class="listview"
			ref = "scroll"
			@scroll = "onScroll"
			:listenScroll = "true"
	>
		<ul>
			<li v-for = "(group,index) in listData" class="list-group" ref = "listGroup" >
				<h2 class="list-group-title">{{ group[0] }}</h2>
				<ul>
					<li v-for = "item in group[1]"
						class = "list-group-item"
						@click = "selectSinger(item)"
					>
						<img class="avatar"
							 lazyload
							 :data-original = "item.avatarPath"
						>
						<span class="name">{{ item.name }}</span>
					</li>
				</ul>
			</li>
    	</ul>
		<div class="list-shortcut">
			<ul
				@touchstart.stop = "shortcutTouchstart"
				@touchmove.stop.prevent = "shortcutTouchmove"
			>
				<li  v-for = "(item, index) in shortcutList"
					class = "item"
					:class = "{'current':heightlight(index)}"
					:data-index = "index"
				>
					{{ item }}
				</li>
			</ul>
    	</div>
		<div class="list-fixed" ref="fixedTitle" v-show = "computedTitle">
      		<div class="fixed-title">{{ computedTitle }}</div>
    	</div>
	</scroll>
</template>

<script>
import Scroll from 'base/better-scroll/scroll'
import {getDataset} from 'common/js/domOps'
import { Flazyload } from 'common/js/FLazyload'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18
const BEYOND_BORDER_INDEX = -1

export default {
	created () {
		this.touch = {},
		this.heightMap = [] // 创建列表中每一类的高度范围映射
	},
	props: {
		listData: {
			type: Array,
			default: []
		}
	},
	data () {
		return {
			scrollIndex: 0, // 歌手页BScroll滚动时当前所属区域索引, 需要添加Watcher
			// scrollHeight: 0
		}
	},
	computed: {
		shortcutList () {
			const list = []
			this.listData.forEach((cur) => {
				list.push(
					cur[0].slice(0,1)
				)
			})
			return list
		},
		computedTitle () { // 计算固定标题栏当前应该显示的标题
			if(!this.listData.length){
				return ''
			}
			for(let i = 0,len = this.listData.length; i < len; i ++){
				if(i === this.scrollIndex) {
					return this.listData[i][0]
					break
				}
			}
		},
	},
	methods: {
		shortcutTouchstart (e) {
			// this.touch.index是用来记录手指点击到快速入口时的位置坐标。
			// 此时应该更新scrollIndex，但是不能直接让getDataset的返回值
			// 赋值给this.touch.index。因为在scrollmove计算的初始位置坐标
			// 时候,参考的应该是this.touch.index，而不应该是实时的scrollIndex。
			this.touch.index = getDataset(e.target, `index`)
			this.scrollIndex = this.touch.index
			this.touch.startY = e.touches[0].pageY
			this._scrollTo(this.scrollIndex) // 跳转到指定index的标题位置
		},
		shortcutTouchmove (e) {
			const deltaY = e.touches[0].pageY - this.touch.startY
			const deltaIndex = (deltaY / ANCHOR_HEIGHT) | 0
			const _currIndex = this.touch.index +  deltaIndex
			this._scrollTo(_currIndex)
		},
		onScroll ({y:pos}) { // 只用到了y轴方向的滚动
			// this.scrollHeight = pos
			if(pos > 0) {
				this.scrollIndex = -1 // 如果向下拉过头，则让索引定位到-1
				return
			}
			for(let i = this.heightMap.length - 1; i >= 0; i --) {
				if(this.heightMap[i] <= -pos) {
					this.scrollIndex = i
					break
				}
			}
			this._fixedTitleOffset(pos)
		},
		heightlight (index) {
			if(this.scrollIndex === index) {
				return true
			} else if(
				// 如果向下过度拉取，依旧高亮快捷入口的第一项
				this.scrollIndex === BEYOND_BORDER_INDEX &&
				index === 0
			) {
				return true
			}
			return false
		},
		selectSinger (singerIndex) {
			this.$emit('selectSinger',singerIndex)
		},
		_scrollTo (index) {
			const listGroup = this.$refs.listGroup
			this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0)
		},
		_computeListHeightMap () { // 计算列表中每一类的高度映射
			const heightMap = this.heightMap = []
			this.listData.reduce((accu,curr,index,arr) => {
				const l_height = this.$refs.listGroup[index].clientHeight
				heightMap.push(accu)
				return accu + l_height
			},0)
		},
		_fixedTitleOffset (pos) {  // pos ∈ (-infinity, 0]
			if(!this.heightMap){
				return
			}
			let diff = 0
			// 想了一个非常巧妙地算法：
			// 用some去最快速的判断出当前滚动位置fixedTitle的top是否需要发生变化。
			// 如果需要发生变化，则直接计算出所需偏移量diff。
			const bol = this.heightMap.some((cur) => {
				if((-pos + TITLE_HEIGHT >= cur) && (-pos <= cur)) {
					diff = cur - (-pos + TITLE_HEIGHT)
					return true
				}
				return false
			})
			// var curr
			// console.log(`-pos:${-pos}||bol:${bol}||diff:${diff}||curr:${curr}`)
			if(bol){
				this.$refs.fixedTitle.style.setProperty(`top`, `${diff}px`)
			} else {
				this.$refs.fixedTitle.style.setProperty(`top`, `0px`)
			}
		}
	},
	components: {
		Scroll
	},
	watch: {
		listData (newVal) {
			setTimeout(()=>{
				if(newVal &&　newVal.length){
					this._computeListHeightMap()
				} else {
					return
				}
			}, 20)
		}
	},
	mounted() {
		console.log('listview mounted!')
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
}
</script>
<style lang="stylus" scoped>
 @import "~common/style/variable"

 .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>



