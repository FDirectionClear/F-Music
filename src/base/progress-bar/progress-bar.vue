<template>
  	<div class="progress-bar">
    	<div class="bar-inner" ref = "barInner">
      		<div class="progress" ref = "progress"></div>
      		<div class="progress-btn-wrapper"
			  	ref = "progressBtn"
				@touchstart = "touchStart"
				@touchmove = "touchMove"
				@touchend = "touchEnd"
			>
        		<div class="progress-btn"></div>
      		</div>
    	</div>
  </div>
</template>

<script>
import { prefixStyle, getSumOffset } from 'common/js/domOps'

const TRANSFORM = prefixStyle('transform')

export default {
	props: {
		percentage: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			touch: {
				touching: false  // 进度条是否正在拖动中
			},
			currentPercentage: this.percentage
		}
	},
	methods: {
		touchStart (e) {
			this.touch.startX = e.touches[0].pageX
			this.touch.startPercentage = this.currentPercentage
		},
		touchMove(e) {
			this.touch.touching = true
			const deltaX = e.touches[0].pageX - this.touch.startX
			this.currentPercentage =
			this.currentPercentage > 0 // 如果当前百分比小于零则返回0，大于一则取1
			? Math.min(
				this.touch.startPercentage +
				deltaX / this.$refs.barInner.clientWidth,
				1
			)
			: 0
			this.$emit("draggingBar", this.currentPercentage)
		},
		touchEnd (e) {
			this.$emit('dragBar', this.currentPercentage)
			this.touch.touching = false
		},
		_offsetToPercent () {
			const barInner = this.$refs.barInner,
					  progress = this.$refs.progress,
					  progressBtn = this.$refs.progressBtn

			if(!(barInner && progress && progressBtn)) {
				console.log("barInner & progress 不存在")
				return
			}
			const maxWidth = barInner.clientWidth,
					  needOffet = this.currentPercentage * maxWidth
			progress.style.setProperty(`width`, `${needOffet}px`) // 放缩大进度条
			progressBtn.style[TRANSFORM] = `translate3d(${needOffet}px, 0, 0)` // 按钮跟着进度条动
		},
	},
	watch: {
		percentage () {
			if(this.touch.touching) { // 如果用户正在拖动进度条就放弃监听外界传来的进度
				return
			}
			this.currentPercentage = this.percentage
		},
		currentPercentage () {
			setTimeout(()=>{
				this._offsetToPercent()
			},20)
		}
	},
}
</script>

<style lang="stylus" scoped>
@import "~common/style/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
