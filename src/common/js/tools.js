import axios from 'axios'

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
