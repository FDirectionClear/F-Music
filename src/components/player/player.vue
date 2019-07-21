<template>
	<div class = "player" v-show = "playList.length">
		<transition name = "normal"
				@enter = "enter"
				@after-enter = "afterEnter"
				@leave = "leave"
				@after-leave = "afterLeave">
			<div class = "normal-player" v-show = "fullscreen">
			<div class="background">
          		<img width="100%" height="100%" :src = "currentSong.image">
        	</div>
			<div class="top">
				<div class="back">
					<i class="icon-back" @click = "shrink"></i>
				</div>
				<h1 class="title" v-html = "currentSong.name"></h1>
				<h2 class="subtitle" v-html = "currentSong.singer"></h2>
			</div>
			<div class="middle">
				<div class="middle-l">
					<div class="cd-wrapper" ref = "cdWrapper">
						<div class="cd">
							<img ref="normalCD"
								class = "image"
								:class = "cdRotate"
								:src = "currentSong.image" >
						</div>
					</div>
					<div class="playing-lyric-wrapper">
						<div class="playing-lyric"></div>
					</div>
				</div>
				<!-- <scroll class="middle-r">
					<div class="lyric-wrapper">
						<div>
							<p></p>
						</div>
						<div class="pure-music">
							<p></p>
						</div>
					</div>
				</scroll> -->
			</div>
			<div class="bottom">
				<div class="dot-wrapper">
					<span class="dot"></span>
					<span class="dot"></span>
				</div>
				<div class="progress-wrapper">
					<span class="time time-l">{{ currentTime | formatTime }}</span>
					<div class="progress-bar-wrapper">
            			<div class="progress-bar-wrapper">
              				<progress-bar
							  	:percentage = "percentage"
								@dragBar = "dragBar"
								@draggingBar = "draggingBar">
							</progress-bar>
            			</div>
					</div>
            		<span class="time time-r">{{ currentSong.duration | formatTime }}</span>
				</div>
				<div class="operators">
					<div class="icon i-left" >
              			<i :class= "`icon-${modeName}`" @click = "changeMode"></i>
            		</div>
					<div class="icon i-left">
						<i class="icon-prev" @click = "prevSong"></i>
					</div>
					<div class="icon i-center">
						<i class="needsclick icon-pause" :class = "playIcon" @click = "togglePlay"></i>
					</div>
					<div class="icon i-right">
						<i class="icon-next" @click = "nextSong"></i>
					</div>
					<div class="icon i-right">
						<i  class="icon icon-not-favorite"></i>
					</div>
          		</div>
			</div>
		</div>
		</transition>

		<!----------------------------------↓ mini-player ↓------------------------------------------------>
		<transition name = "normal">
			<div class = "mini-player" v-show = "!fullscreen" @click = "expand" ref = "mini">
			<div class="icon">
				<div class="imgWrapper">
					<img width="40" height="40" :src = "currentSong.image" ref = "miniCD">
				</div>
        	</div>
			<div class="text">
				<h2 class="name" v-html = "currentSong.name"></h2>
				<p class="desc" v-html = "currentSong.singer"></p>
			</div>
			<div class="control">
				<!-- <progress-circle :radius="radius" :percent="percent">
					<i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
				</progress-circle> -->
			</div>
			<div class="control">
				<i :class="miniPlayIcon" @click.stop = "togglePlay"></i>
			</div>
		</div>
		</transition>
		<audio :src = "currentSong.url"
					 ref = "audio"
					 @timeupdate = "timeupdate"
					 @ended="songEnded">
		</audio>
	</div>
</template>


<script>
import 	Scroll from 'base/better-scroll/scroll'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations  from 'create-keyframe-animation'
import { getSumOffset } from 'common/js/domOps'
import { prefixStyle } from 'common/js/domOps'
import ProgressBar from 'base/progress-bar/progress-bar'
import { StatusChange } from 'common/js/tools'
import { playMode } from 'common/js/config'
import { getLyric } from 'api/song'

const TRANSFORM = prefixStyle('transform')

export default {
	created () {
		console.log('player created!')
	},
	data () {
		return {
			currentTime: 0,
			percentage: 0,
		}
	},
	computed: {
		playIcon () {
        	return this.playing ? 'icon-pause' : 'icon-play'
		  },
		miniPlayIcon () {
        	return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
		},
		cdRotate () {
			return this.playing ? 'play' : 'play pause'
		},
		modeName () {
			const mode = this.mode
			for(let key in playMode) {
				if(mode === playMode[key])
				{
					console.log(key)
					return key
				}
			}
			return false
		},
		...mapGetters ([
			'playList',
			'fullscreen',
			'currentSong',
			'playing',
			'currentIndex',
			'mode'
		])
	},
	methods: {
		shrink () {
			this.setFullscreen(false)
		},
		expand () {
			this.setFullscreen(true)
		},
		// 因为大cd的位置是利用百分比计算的，当设备不同时，所需要的偏移量是不同的。
		// 所以我们需要通过js获取大cd动画中所需要的相对于小cd的偏移量。
		// 最理想的实现方式是通过CSS @keyframe,但是只在CSS @keyframe中定义动画过程又无法计算偏移量。
		// 若采用js的编程方式，可以通过设置transition属性控制动画行为。但是由于大cd出现还伴随一个先放大后缩小的过程，因此
		// 通过transition难以实现这个动画需求。
		// 我们需要可以通过js编程@keyframe的能力。create-keyframe-animation提供了我们这个能力。
		//  但是我们何时控制动画的开始时机和结束时机又成为了一个问题。动画的开始和结束与normal-player的展开和收缩
		// 时机相同。因此可以借助Vue提供我们的动画钩子。
		enter (el, done) {
			this._memoryPosAndScale(this._getPosAndScale())
			const {deltaX, deltaY, scale} = this
			let animation = {
				0: {
					transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`
				},
				60: {
					transform: `translate3d(0,0,0) scale(1.1)`
				},
				100: {
					transform: `translate3d(0,0,0) scale(1)`
				}
			}
			animations.registerAnimation({
				name: 'move',
				animation,
				presets: {
					duration: 400,
					easing: 'linear'
				}
			})
			animations.runAnimation(this.$refs.cdWrapper, 'move', done)
		},
		afterEnter (el) {
			animations.unregisterAnimation('move')
			this.$refs.normalCD.style.animation = ''
		},
		leave (el, done) {
			console.log('leave触发')
			const {deltaX, deltaY, scale}  = this
			this.$refs.cdWrapper.style.transition = `all .4s`
			this.$refs.cdWrapper.style[TRANSFORM] =
				`translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`
			this.$refs.cdWrapper.addEventListener('transitionend', ()=>{
				console.log('transitionend')
				done()
			})
		},
		afterLeave (el) {
			console.log("afterleave执行")
			this.$refs.cdWrapper.style.transition = ''
			this.$refs.cdWrapper.style[TRANSFORM] = ''
		},
		togglePlay () {
			this.setPlayingState(!this.playing)
		},
		prevSong () {
			let index = this.currentIndex
			if (index === 0) {
				index = this.playList.length - 1
			} else {
				index --
			}
			this.setCurrentIndex(index)
			if(!this.playing) {
				this.togglePlay()
			}
		},
		nextSong () {
			let index = this.currentIndex
			if (index === this.playList.length -1 ) {
				index = 0
			} else {
				index ++
			}
			this.setCurrentIndex(index)
			if(!this.playing) {
				this.togglePlay()
			}
		},
		timeupdate (e) {
			this.currentTime = e.target.currentTime
			this.percentage = this.currentTime / this.currentSong.duration
		},
		songEnded (e) {
			if(this.mode === playMode.loop) {
				// 如果是单曲循环就将播放时间重置为0，然后继续播放。
				this.$refs.audio.currentTime = 0
				this.$refs.audio.play()
			} else {
				this.nextSong()
			}
		},
		dragBar (per) {
			this._updateCurrTime(per)
			this.$refs.audio.currentTime = this.currentTime
			if(!this.playing) {
				this.togglePlay()
			}
		},
		draggingBar (per) {
			this._updateCurrTime(per)
		},
		changeMode() {
			const modes = []
			for(let key in playMode) {
				modes.push(playMode[key])
			}
			this.gen = this.gen || StatusChange(playMode.sequence, ...modes)
			let { g } = this.gen
			this.setPlayMode(g.next().value)
		},
		_getLyric () {
			const mid = this.currentSong.mid
			console.log(mid)
			getLyric (mid).then( (res)=> {
					console.log(`/////////////////////////////////////`)
					console.log(res)

			})
		},
		_updateCurrTime (per) {
			this.currentTime = per * this.currentSong.duration
		},
		_getPosAndScale () {
			// 目标是从大cd到小cd，即player expand的过程
			const targetWidth = 40,
					  width = 280,
					  scale = targetWidth / width
			const { left, top } = getSumOffset(this.$refs.miniCD, true)
			const {
				 left: Left,
				 top: Top
			} = getSumOffset(this.$refs.normalCD, true)
			const deltaX =
				- (window.innerWidth / 2 - (left + (targetWidth / 2)))
			const deltaY = ( top + 10 ) - ( Top + (width / 2) )
			console.log("top:" + top)
			console.log(deltaX, deltaY, scale)
			return { deltaX, deltaY, scale}
		},
		_memoryPosAndScale ({deltaX, deltaY, scale}) {
			this.deltaX = deltaX
			this.deltaY = deltaY
			this.scale = scale
		},
		...mapMutations({
			setFullscreen: 'SET_FULLSCREEN',
			setPlayingState: 'SET_PLAYING',
			setCurrentIndex: 'SET_CURRENTINDEX',
			// setPlayMode: 'SET_MODE'
		}),
		...mapActions([
			'setPlayMode'
		])
	},
	filters: {
		formatTime (time) { // 格式化时间 sec -> min : 0sec
			if(typeof time === undefined) {
				return
			}
			const min = (time / 60) | 0
			const sec = (time % 60) | 0
			return `${min}:${sec.toString().padStart(2, 0)}`
		}
	},
	watch: {
		currentSong (newVal, oldVal) {
			this.$nextTick(()=>{
				console.log(this.currentSong.getLyric())
				// 如果当前状态为paused,当切换下一首歌的时候，不再暂停，直接播放。
				if(newVal.id === oldVal.id) {
					// 当切换模式的时候，尽管已经在actions中保证当前歌曲不会变化，但是
					// 依旧还是改变了currentSong中的state.playList的地址，所以还是无法避免的会触发currentSong的
					// user Watcher, 因此我们需要为了保证暂停状态不会因为切换模式而取消，我们需要额外判断劫持
					// 播放操作
					return
				}
				this.$refs.audio.play()
			})
		},
		playing (newState) {
			this.$nextTick(()=>{
				const audio = this.$refs.audio
				newState ? audio.play() : audio.pause()
			})
		}
	},
	components: {
		ProgressBar
	}
}
</script>

<style lang="stylus" scoped>
  @import "~common/style/variable"
  @import "~common/style/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
	.pause
		animation-play-state: paused !important
</style>

<Tips>
所遇到的知识坑点：
	1. 如果设置了transtion组件提供的动画钩子，就要在动画执行完毕的时候执行执行done。
	这样才能保证Vue对类名进行移除和者对目标的display进行改变：
	比如：
		before中不调用done，就无法触发AfterBefore钩子，也就无法在enter动画执行完毕后
		自动移除xxx-enter、xxx-enter-active，xxx-enter-to.....，因为移除这些类名是AfterBefore钩子执行完毕后
		Vue帮忙做的。
		同样的如果在leave中不调用done，就无法触发AfterBefore，也就无法在leave动画执行完
		后自动移除xxx-active，xxx-enter-active，xxx-enter-to.....，最重要的是display: none也无法在leave动画执行完后得到设置，因为这些正是在AfterEnter执行后Vue帮我们做的。

	2. transition和animation不能再同一个元素上组合使用。一个元素也无法同时应用多个animation。
	如果想要得到transition和animation组合使用，或者一个元素同时应用多个animation的效果，可以
	在这个元素外层嵌套一个适当大小的div即可。然后让transition或animation一个作用于div一个作用
	于目标元素。多个animation也是，多给目标元素嵌套几个div, 让多个animation作用于不同的div上
	就可以实现组合animation的效果。

	3. padding-top的%单位是相对于父容器的宽度！！ 注意是宽度！！，这个是一个神奇的属性。
	padding-top撑起来的高度也算是height。
</Tips>
