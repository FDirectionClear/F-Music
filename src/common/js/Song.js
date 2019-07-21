import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'

export default class Song {
	constructor ({
		id, // 歌曲id
		mid, // 歌曲mid
		singer, // 歌手
		name, // 歌曲名称
		album, // 专辑名称
		duration, // song播放时间
		strMediaMid, // 歌曲的媒体id（url中的参数片段）
		image, // 歌曲图片
		url, // 歌曲真实请求路径
		lyric // 歌词
	}) {
		this.id = id
		this.mid = mid
		this.singer = singer
		this.name = name
		this.album = album
		this.duration = duration
		this.image = image
		this.strMediaMid = strMediaMid
		this.url = url
		this.filename = `C400${this.mid}.m4a`
	}

	getLyric () {
		getLyric(this.mid).then((res)=>{
			if(res.retcode === ERR_OK) {
				console.log(res)
				this.getLyric = res.lyric
				console.log(res.lyric)
			}
		})
	}
}
// 因为song的参数较多，所以创造一个工厂方法来边界的从生数据中筛选出
// 需要的数据然后传入构造函数， createSong单独存在并无意义。
export function createSong (musicData) {
	return new Song ({
		id : musicData.songid,
		mid: musicData.songmid,
		singer: formatSinger(musicData.singer),
		name: musicData.songname,
		album: musicData.albumname,
		duration: musicData.interval,
		image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
		strMediaMid: musicData.strMediaMid,
		url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.strMediaMid}.m4a?guid=4057747536&vkey=FE2C0FD23B373F40FB471E4895263D5B36175A0DCEEDD871F76545513C8B019F1D7DFBBA16A7408ED52531FE7FD8B95E230A06A324480C88&uin=0&fromtag=38`
	})
}


// 目前可用的模板
// http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003iHc0e2UIgMC.m4a?guid=4057747536&vkey=FE2C0FD23B373F40FB471E4895263D5B36175A0DCEEDD871F76545513C8B019F1D7DFBBA16A7408ED52531FE7FD8B95E230A06A324480C88&uin=0&fromtag=38

// 废弃的6号模板 7月20日
//http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003z4eeo3mteMn.m4a?guid=6068696641&vkey=CEE31FE9622352D6A6759516F1436579424FB0785DAB37EF6A8DBE6BA6E3436D07378B2DB737BAE577B72B56156C8B680ACD5D141473899C&uin=0&fromtag=38

// 废弃的5号模板 7月19日
//http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001Qu4I30eVFYb.m4a?guid=7602163028&vkey=21A1F70507672E4D68EADAFBF99E235E77F854F716424DDF02C16112B9BC89A7DC92A4D8BD7CAC682E9C4B2E5A699680E658F7233A4DF195&uin=0&fromtag=38


// 废弃的4号歌曲播放链接模板
// http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003iHc0e2UIgMC.m4a?guid=2305743866&vkey=731B8464FE7699CA3307A69A933F4FFAF62AFE99E526EAB3BEFEADFF9352C2F35A5A261BEFCC821EBD47931CFE55E7E5C1071175DD559833&uin=0&fromtag=38


// 废弃的3号歌曲播放链接模板
// http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400233704216.m4a?guid=2305743866&vkey=443074E46FCE8E6152F560450ABC36A49ADD697301BC11560C0AFAA2ECDF265A844FDA1503D7D666265B8AAAA89871AD558046DFB0A8732A&uin=0&fromtag=38

// 废弃的2号歌曲播放链接模板
// http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.songid}.m4a?guid=2305743866&vkey=443074E46FCE8E6152F560450ABC36A49ADD697301BC11560C0AFAA2ECDF265A844FDA1503D7D666265B8AAAA89871AD558046DFB0A8732A&uin=0&fromtag=38


// 废弃的1号歌曲播放链接模板
// http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400233704216.m4a?guid=2305743866&vkey=443074E46FCE8E6152F560450ABC36A49ADD697301BC11560C0AFAA2ECDF265A844FDA1503D7D666265B8AAAA89871AD558046DFB0A8732A&uin=0&fromtag=38


// 当歌手有多个人的时候，将名字格式化为一个字符串 name1/name2/name3/....
function formatSinger (singerList) {
	if(typeof singerList === 'undefined' || singerList === null){
		return ''
	} else if(!Array.isArray(singerList)){
		return singerList
	} else {
		let res = []
		singerList.forEach((item) => {
			res.push(item.name)
		})
		return res.join('/')
	}
}


