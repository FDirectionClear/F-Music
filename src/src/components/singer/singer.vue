<template>
	<div class = "singer" ref = "singer">
		<list-view :list-data = "map" @selectSinger = "selectSinger"></list-view>
		<transition name = "slide">
			<!--选择singer后以singer.id为路由参数跳转子路由至singer-detail-->
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
import {ERR_OK} from 'api/config'
import { getSingerList } from 'api/singer'
import Singer from 'common/js/Singer'
import ListView from 'components/list-view/listview'
import { mapMutations } from 'vuex'

const HOT_TITLE = "热门"  //规定热门标签
const HOT_COUNT = 10  // 因为原始数据中没有“热门”这一标签，所以只读取前10向作为“热门”

export default {
	data () {
		return {
			map:[]
		}
	},
	methods: {
		selectSinger (singer) {
			this.setSinger(singer)
			this.$router.push({
				path:`/singer/${singer.id}`
			})
		},
		_getSingerList () {
			getSingerList().then((res) => {
				if(res.code === ERR_OK) {
					this.map = this._normalizeSinger(res.data.list)
				}
			})
		},
		_normalizeSinger (list) { // return Array
			let map = new Map()
			let arr = []
			map.set(HOT_TITLE,[])
			if(list instanceof Array) {
				list.forEach(
				({
					Findex: Singer_index,
					Fsinger_mid: id,
					Fsinger_name: name
				}, index) => {
					let singer = new Singer({id, name})
					if(index < HOT_COUNT) {
						map.get(HOT_TITLE).push(singer)
					}
					if(Singer_index.match(/^[a-zA-Z]$/)){
						if(map.has(Singer_index)) {
							map.get(Singer_index).push(singer)
							return
						}
						map.set(Singer_index, [
							singer
						])
					}
				}, this)
			}
			arr = [...map]
			arr.sort((a, b) => {
				return a[0].charCodeAt(0) - b[0].charCodeAt(0)
			})
			arr.forEach((item, index) => {
				if(item[0] === HOT_TITLE) {
					// TIP： splice返回的是有删除项组成的数组，如果只删除了一项也是如此。
					// 所以需要取第0个索引值
					var hot = arr.splice(index, 1)[0]
					arr.unshift(hot)
				}
			})
			return arr
		},
		...mapMutations({
			setSinger: 'SET_SINGER'
		})
	},
	components: {
		ListView
	},
	created(){
		this._getSingerList()
		// console.log(this.map)
	},
}
</script>

<style scoped lang = "stylus">
	.singer{
		position:fixed
		/* border: 3px white solid */
		top: 88px
		bottom: 0
		width: 100%
	}
	.slide-enter-active, .slide-leave-active{
	    transition: all 0.3s
	}
	.slide-enter, .slide-leave-to{
		transform: translate3d(100%, 0, 0)
	}
</style>

