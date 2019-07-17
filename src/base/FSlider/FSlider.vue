<template>
    <div class="FSlider" ref = "FSlider">
        <div class = "container" ref = "container"
             @touchstart = "middleTouchstart"
             @touchmove = "middleTouchmove"
             @touchend = "middleTouchend"
             @transitionend = "transitionEnd"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
	name:'FSlider',
    props:{
        autoPlayduration:{
            type:Number,
            default:3000
        },
        autoPlay:{
            type:Boolean,
            default:true
        }
    },
    mounted(){
        this.container = this.$refs.container
        this.init()
		let _this = this

        window.addEventListener("resize",() => {
            let {
                container, // DOM
                width,
                height,
                currentOffsetLeft,
                intervalId,
                getOffset, // FUNCTION
                getWidth, // FUNCTION
                getHeigth, // FUNCTION
                setAutoPlay, // FUNCTION
                ClearTransition, // FUNCTION
                addTransition // FUNCTION
            } = _this

            let oldWidth = width,
                oldHeight = height

            clearTimeout(intervalId)

            _this.width = getWidth(container)
            _this.height = getHeigth(container)
            _this.widthDisparity = _this.width - oldWidth
            // 当宽度增加的情况下，这两个都是正值
            _this.heightDisparity = _this.height - oldHeight

            ClearTransition(container)

            container.style.setProperty(
                "left",
                `${currentOffsetLeft - _this.widthDisparity}px`
            )
            // console.log(
            //     "currentOffsetLeft" + currentOffsetLeft,
            //     "widthDisparity" + _this.widthDisparity
            // )
            // console.log(currentOffsetLeft - _this.widthDisparity)
            _this.currentOffsetLeft = getOffset(container)

            setInterval(() => {
                addTransition(container)
            },20)
            setAutoPlay()
        })
    },
    data(){
        return {
            // 当前轮播偏移量，或者说当前container的偏移量
            currentOffsetLeft : 0,
            // 初始化情况为0，说明有两张图片及以上。
            //为 1则说明没有图片或者就有一张图片，只需要静态展示即可。
            initCondition : 0,
            // 用来储存touch相关的数据,
            touch : {},
            // 用来存放计时器的id
            intervalId : "",
            // 轮播图片的个数
            count : 0 ,
            // 当前轮播的序号,初始化的时候默认为 1
            index : 1 ,
            // container的宽度
            width : 0 ,
            // 滚动是否是因为touch而发生的
            isTouched : false ,
        }
    },
    methods:{
        next(){
            // 如果初始化标志位为0，那么不进行轮播。
            if(this.initCondition !== 0)   return
            let target  // 目标滚动偏移量
            /**
             * 获取滚动的目标index，轮播总长度 ÷ 当前偏移量的绝对值 结果向x下取整,在 × 总个数，
             * 结果四舍五入，如果滚动方式是来自自动滚动，那么就无需判断直接增加index
             */
            this.index = this.isTouched
                ? Math.round(
                    (Math.abs(this.currentOffsetLeft) / (this.width * this.count))
                    * 1.2 * this.count
                  )
                : this.index + 1
            // 注意这里的target为正值，偏移是取相反数
            target = this.index * this.width
            // console.log("索引，数量，目标位置" + this.index,this.count,target)
            if(this.index === this.count - 1) {
                // 如果发现目标索引是最后一张的索引
                // console.log("进入瞬间拖拽")
                // 清除过渡，
                this.ClearTransition(this.container)
                // 瞬间拖拽到index=0的图片上
                this.container.style.setProperty(
                    'left',
                    `${0 + (this.touch.deltaX || 0)}px`
                )
                /**
                 * 再次修改dom属性，推至下一轮事件循环，防止浏览器还未完成重构上一步的dom，就再次
                 * 改变了transition,延时为20ms（一般浏览器重构都少于20ms）
                 */
                setTimeout(() => {
                    this.addTransition(this.container)
                    this.container.style.setProperty(
                        'left',
                        `${-this.width}px`
                    )
                },20)

                this.currentOffsetLeft = -this.width
                this.index = 1
                this.touch.deltaX = this.touch.deltaY = 0
            }
            else {
                // 滚动到目标位置
                this.container.style.setProperty(
                    'left',
                    `${-target}px`
                )
                this.currentOffsetLeft = -target
            }
            this.isTouched = false
        },
        previous(){
            if(this.initCondition !== 0)    return  // 如果初始化标志位为0，那么不进行轮播。
            let target  // 目标滚动偏移量数
            // 获取滚动的目标index，轮播总长度 / 当前偏移量的绝对值 结果向x下取整 在 * 总个数，结果四舍五入，如果滚动方式是来自自动滚动，那么就无需判断直接增加index
            this.index = this.isTouched
                ? Math.round(
                    (Math.abs(this.currentOffsetLeft) / (this.width * this.count))
                    * 0.8 * this.count
                  )
                : this.index - 1
            // 注意这里的target为正值，偏移是取相反数
            target = this.index * this.width
            // console.log("索引，数量，目标位置" + this.index,this.count,target)
            if(this.index === 0) {
                // 如果发现目标索引是最后一张的索引
                // console.log("进入瞬间拖拽")
                // 清除过渡，
                this.ClearTransition(this.container)
                // 瞬间拖拽到index=0的图片上
                this.container.style.setProperty(
                    'left',
                    `${-(this.count-1) * this.width + (this.touch.deltaX || 0)}px`
                )
                // 再次修改dom属性，推至下一轮事件循环，防止浏览器还未完成重构上一步的dom，就再次改变了transition,延时为20ms（一般浏览器重构都少于20ms）
                setTimeout(() => {
                    this.addTransition(this.container)
                    this.container.style.setProperty(
                        'left',
                        `${-(this.count-2) * this.width}px`
                    )
                },20)
                this.currentOffsetLeft = -(this.count-2) * this.width
                this.index = this.count - 2
                this.touch.deltaX = this.touch.deltaY = 0
            }
            else {
                // 滚动到目标位置
                this.container.style.setProperty(
                    'left',
                    `${-target}px`
                )
                this.currentOffsetLeft = -target
            }
            this.isTouched = false
        },
        transitionEnd(){
          // 每次过渡完成，更新当前偏移量
        //   console.log("transitionEnd执行完毕：" + this.currentOffsetLeft)
          this.currentOffsetLeft = this.getOffset(this.container)
        },
        getWidth(dom){
            return Number.parseFloat(
                window.getComputedStyle(dom).getPropertyValue("width")
            )
        },
        getHeigth(dom){
            return Number.parseFloat(
                window.getComputedStyle(dom).getPropertyValue("height")
            )
        },
        getOffset(dom){
            return dom.offsetLeft
        },
        ClearTransition(dom){
            if(!dom){
                throw new Error("clearTransition出错")
                return
            }
            dom.style.setProperty('transition','none')
        },
        addTransition(dom){
            dom.style.setProperty('transition','left .5s')
        },
        middleTouchstart(e){
            const touches = e.touches[0]
            this.touch.startX = touches.pageX
            this.touch.startY = touches.pageY
            this.touch.currentOffsetLeft =
                  this.currentOffsetLeft =
                  this.getOffset(this.container)
            // 这个地方巨坑，一度怀疑transition的过程中无法获取当前的偏移量值
            // 应该先清除计时器，以防止后续任务队列中的进一步过渡干扰
            clearInterval(this.intervalId)
            // 第二不不能直接清楚过渡，否则过渡效果会一瞬间消除，立刻到达终点。应该保留过渡。
            // 先获取当前的偏移量，然后设置left为当前这个偏移量。这个技巧是实现transition终止。
            this.container.style.setProperty(
                "left",
                `${this.getOffset(this.container)}px`
            )
            // 最后在清楚过渡，已达到拖动container不会产生延迟。如果希望使用延迟，这里可以覆盖一个transition-duration
            this.ClearTransition(this.container)
            // container.style.setProperty('transition','left .2s cubic-bezier(0.25, 0.46, 0.45, 0.94)')
        },
        middleTouchmove(e){
            const touches = e.touches[0]
            this.touch.deltaX = touches.pageX - this.touch.startX
            this.touch.deltaY = touches.pageY - this.touch.startY
            this.container.style.setProperty(
                "left",
                `${this.touch.currentOffsetLeft + this.touch.deltaX}px`
            )
            this.currentOffsetLeft = this.getOffset(this.container)
        },
        middleTouchend(e){
            this.isTouched = true
            this.addTransition(this.container)
            if(this.touch.deltaX > 0){
                this.previous()
            } else {
                this.next()
            }
            this.setAutoPlay()
        },
        setAutoPlay(duration = this.autoPlayduration){
            if(this.autoPlay){
                this.intervalId = setInterval(()=>{
                    this.next()
                },duration)
            }
        },
        init(){
			let container = this.container
			// 初始化可能是来自刷新，需要清除上一轮的计时器
			clearInterval(this.intervalId)
            if(container.children.length <= 1){
                // 只带入一张或者以下图片,什么都不需要做,什么都不需要做就是1
                this.initCondition = 1
                return
            } else {
				this.initCondition = 0
			}
            // 记录当屏幕尺寸下的宽度和高度
            let CloneFirstChild = container.firstElementChild.cloneNode(true)
			let CloneLastChild = container.lastElementChild.cloneNode(true)

            container.insertBefore(CloneLastChild,container.firstElementChild)
            container.appendChild(CloneFirstChild)
            // 获取轮播中图片的数量
            this.count = container.children.length
            // 获取每张图片的宽度和高度
            this.width = this.getWidth(container)
            this.height = this.getHeigth(container)
            // 将图片滚动到第一张的位置
            container.style.setProperty('left',`-${this.width}px`)
            // 初始滚动位置为第一张的位置
            this.currentOffsetLeft = -this.width
            // 为container添加transition
            this.addTransition(container)
			this.setAutoPlay()
		},
		refresh(){
			console.log("FSlider refresh !!")
			this.init()
		}
	},
	destoryed(){
		// 在FSlider组件销毁的任何时候都清除计时器以释放内存
		clearInterval(this.intervalId)
		console.log("slider destory!")
	}
}
</script>

<style scoped>
.FSlider {
    height:100%; /* 高度默认为100% */
    width:100%; /* 宽度默认100%  */
    background:rgba(0,0,0,0.1);
    overflow:hidden ;
}

.container{
    position: relative;
    height:100%; /* 高度默认为100% */
    width:100%; /* 宽度默认100% */
    font-size:0; /* 取消掉inline-block中间的空隙 */
    white-space: nowrap; /* 强制slot中带入的内容不得换行 */
}

.container > * {
    display: inline-block;
    height:100%;
    width:100%;
    vertical-align: top;
    font-size:16px;
}
.container > * > * { /* 如果带入slot的元素是一个复杂的dom树，比如a标签中还包含img */
    display: inline-block;
	height:100%;
	width:100%;
}
</style>

