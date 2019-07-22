<template>
  	<div class="tab">
		<router-link tag="div" class="tab-item" to="/recommend">
      		<span class="tab-link">推荐</span>
   	 	</router-link>
    	<router-link tag="div" class="tab-item" to="/singer">
      		<span class="tab-link">歌手</span>
    	</router-link>
		<!-- <router-link tag="div" class="tab-item" to="/rank">
			<span class="tab-link">排行</span>
		</router-link>
		<router-link tag="div" class="tab-item" to="/search">
			<span class="tab-link">搜索</span>
		</router-link> -->
  </div>
</template>


<script>
export default {

}
</script>


<style lang="stylus" scoped>
@import '~common/style/variable'

.tab
	// border blue 1px solid
	display flex  // 导航采用flex布局
	height 44px
	line-height 44px  // 垂直居中
	font-size $font-size-medium
	.tab-item
		flex 1  // 1 : 1 : 1 : 1 均匀拉开
		text-align center
		.tab-link
			padding-bottom 5px
			color $color-text-l
		&.router-link-active  // 点击后切换成主题色
			.tab-link
				color $color-theme
				border-bottom 2px solid $color-theme
</style>


