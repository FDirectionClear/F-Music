<template>
	<div class = "singer-detail">
		<music-list :title = "singer.name" :bgImage = "singer.avatarPath" :songList = "songs"></music-list>
	</div>
</template>

<script>
import musicList from 'components/music-list/music-list'
import { getSingerDetail } from 'api/singer'
import { mapGetters } from 'vuex'
import { ERR_OK } from 'api/config'
import {createSong} from 'common/js/Song'


export default {
	created () {
		this.singerID = this.singer.id
		this._getSingerDetail(this.singerID)
	},
	data () {
		return {
			songs: [] // Array : Song
		}
	},
	methods:{
		// 歌单数据存储在this.songs中， 当前歌手数据存储在vuex中
		_getSingerDetail (singerID) {
			getSingerDetail(this.singerID).then((res) => {
				if(res.code === ERR_OK)
				{
					//  规范化歌曲列表数据结构
					// console.log(res.data.list)
					this.songs = this._normalizeSongs(res.data.list)
					// console.log(this.songs)
				}
			}).catch((err)=>{
				// 当页面直接刷新时，Vuex中singer数据为空，应该跳转到/singer
				console.warn(`${err},跳转到父路由/singer`)
				this.$router.push('/singer')
			})
		},
		_normalizeSongs (list) {
			let res = []
			list.forEach((item) => {
				let { musicData } = item
				if (musicData.songid && musicData.albummid) {
					res.push(createSong(musicData))
				}
			})
			return res
		}
	},
	computed: {
		...mapGetters([
			'singer'
		])
	},
	components: {
		musicList
	}
}
</script>
<style lang="stylus">
.singer-detail {
	position:fixed
	top:0
	bottom:0
	left:0
	right:0
	background: white
	z-index:1000
}
</style>

