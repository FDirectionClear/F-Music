<template>
	<div class = "music-list">
		<div class = "back">
			<i class = "icon-back" @click = "backToSinger"></i>
		</div>
		<h1 class = "title" v-html = "title"></h1>
		<div class = "bg-image" :style = "setBgImage" ref = "bgImage">
				<div class = "play-wrapper">
					<div class="play"  v-show = "songList.length > 0" ref = "playBtn">
						<i class="icon-play"></i>
						<span class = "text">随机播放全部</span>
					</div>
				</div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<scroll  class = "list"
					  ref = "list"
					  :data = "songList"
					  :probeType = "3"
					  @scroll = "scroll">
			<div class = "song-list-wrapper">
				<song-list :songList = "songList"
						      	  @selectSong = 'selectSong'>
				</song-list>
			</div>
		</scroll>
	</div>
</template>
<script>
import songList from 'base/song-list/song-list'
import scroll from 'base/better-scroll/scroll'
import { prefixStyle } from 'common/js/domOps'
import { mapActions } from 'vuex'

const TITLE_HEIGHT = 40
const BGIMAGE_INDEX = 35
const TRANSFORM = prefixStyle('transform')

export default {
	props:{
		bgImage: {
			type: String,
			default: ''
		},
		songList: {
			type: Array,
			default: []
		},
		title: {
			type: String,
			default: ""
		},
	},
	created () {
		// console.log('Transform prefixed')
		// console.log(TRANSFORM)
	},
	computed: {
		setBgImage () {
			return `background-image: url(${this.bgImage})`
		},
	},
	methods: {
		scroll ({ y: pos }) {
			const maxTranslate = TITLE_HEIGHT - this.padding // maxTranslate < 0
			const realTranslate = Math.max(pos,maxTranslate)
			const bgImage = this.$refs.bgImage

			if(pos <= 0) {
				if(pos < maxTranslate) {
					bgImage.style.paddingTop = `${TITLE_HEIGHT}px`
					bgImage.style.zIndex = BGIMAGE_INDEX
					this.$refs.playBtn.style.setProperty('display','none')
				} else {
					bgImage.style.paddingTop = `${this.padding}px`
					bgImage.style.zIndex = 0
					this.$refs.playBtn.style.setProperty('display','')
				}
			} else {
				const percentage = (this.padding + pos) / this.padding
				bgImage.style.zIndex = BGIMAGE_INDEX
				bgImage.style[TRANSFORM] = `scale(${percentage})`
			}
			// 如果下面代码只写进if，那么当滚动速度较快的时候，浏览器回流速度较慢，跟不上dom渲染。
			// 结果会出现滚动到最后的一瞬间layer层依旧显示一小部分，所以应该在if写。
			this.$refs.layer.style[TRANSFORM] = `translate3d(0,${realTranslate}px,0)`
		},
		backToSinger () {
			this.$router.back()
		},
		_setSongListTop () {
			const padding = this.padding = this.$refs.bgImage.clientHeight
			this.$refs.list.$el.style.top = `${padding}px`
		},
		selectSong (index) { // index 是在song-list中选择的歌曲在当前歌单songList中的索引
			this.selectPlay({
				songList : this.songList,
				index
			})
		},
		...mapActions ([
			'selectPlay'
		]),
	},
	components: {
		songList,
		scroll
	},
	mounted () {
		this._setSongListTop()
	}
}
</script>

<style lang="stylus" scoped>
@import "~common/style/variable"
@import "~common/style/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

