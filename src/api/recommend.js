import { getJson } from 'common/js/getJson'
import { commonParams } from './config'


// 获取推荐页的轮播图的数据
export function getSliderMessage(){
	// 防止代码冗余，将请求公共参数的commonParams引入进来，让特有的覆盖公共参数
	const data = Object.assign({},commonParams,{
		_: '1560068856152'
	})
	const conf = {
		url:"/api/getSliderMessage",
		data
	}
	return getJson(conf)
}

// 获取推荐页热门歌单推荐部分数据
export function getHotList(){
	const data = Object.assign({},commonParams,{
		platform: 'yqq',
		hostUin: 0,
		sin: 0,
		ein: 29,
		sortId: 5,
		needNewCode: 0,
		categoryId: 10000000,
		rnd: Math.random(),
		format: 'json'
	})
	const conf = {
		url : '/api/getHotList',
		data
	}
	return getJson(conf)
}



