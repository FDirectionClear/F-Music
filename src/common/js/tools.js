import axios from 'axios'
import { isArray } from 'util';

export const noop = ''  // 统一的无操作指令

export function parse(data /*data ?: object*/){
	if(typeof data !== 'object')  return
	let res = ""
	for(var key in data){
		let value = data[key] !== undefined ? data[key] : noop
		res += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
	}
	return res.substring(0,res.length-1)
}

export function getStaticSource(url) {
	// 专门用来请求获取静态资源，以此来做localStorage缓存
	return axios.get(url)
}

// 将字符串转换为首字母大写的形式
export function capitalize(str) {
	// 如果str是undefined返回空字符串
	if(typeof str === 'undefined') {
		return ''
	}
	// 如果str的第一个不是小写字母就返回str
	if(str.search(/^[a-z]/) === -1) {
		return str
	}
	return str.slice(0,1).toUpperCase() + str.slice(1)
}

// 从某个范围内取随机整数
export function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

// 经典shuffle洗牌函数， 思路参考来自网络
// 返回一个洗好的新的数组。我为他增加了一些参数验证。
export function shuffle (arr) {
	if(!Array.isArray(arr)) {
		console.warn("请确认shuffle函数的参数是否是一个数组")
		return false
	}
	const _arr = [...arr]
	for(let i = 0, len = _arr.length; i < len; i++) {
		const random = getRandomInt(0, i)
		let temp = _arr[i]
		 _arr[i] = _arr[random]
		_arr[random] = temp
	}
	return _arr
}

/**
 * Generator状态机
 * @param {Number, String} start 状态开始位置索引，不包含当前索引
 * @param  {...any} modes 需要轮询的模式
 */
export function StatusChange(start = 0, ...modes /*start : Number | String, modes ?: any */) {
	if(
		// 如果start不能解析为数字
		typeof start !== 'number' &&
		isNaN(start)
	) {
		console.warn(
			`带入changeMode中的第一个参数start:${start}不能解析为数字,` +
			`或者没有带入需要轮询的模式。请确认你带入的参数是否符合预期。`
		)
		return false
	}
	var modeLen = modes.length, i = 0
	let gen = function* () {
		while(true) {
			yield modes[i]
			i < modeLen - 1 ? i ++ : i = 0
		}
	}
	let g = gen()
	for(let i = 0; i < start + 1; i++) {
		var {value} = g.next()
	}
	return {
		g,   // 返回遍历器，在外部g.next()将从start + 1处开始
		value
	}
}
