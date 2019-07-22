import getJsonp from 'common/js/getJsonp'
import { commonParams } from './config'

export	function getSingerList () {
	const data = Object.assign({},commonParams,{
		channel: 'singer',
		page: 'list',
		key: 'all_all_all',
		pagesize: 100,
		pagenum: 1,
		hostUin: 0,
		needNewCode: 0,
		platform: 'yqq'
	})
	const conf = {
		url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
		data
	}
	return getJsonp(conf)
}

export function getSingerDetail (singerID) {
	if(!singerID)
		return Promise.reject(`singerID为undefined,拉取歌手详细信息无效`)
	const data = Object.assign({},commonParams,{
		hostUin: 0,
		needNewCode: 0,
		platform: 'yqq',
		order: 'listen',
		begin: 0,
		num: 100, // num似乎是抓取数据的个数
		songstatus: 1,
		singermid: singerID
	})
	const conf = {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
		data
	}
	return getJsonp(conf)
}
