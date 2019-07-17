import { noop, parse } from 'common/js/tools'
// 自动 TreeShaking
// import jsonp from 'jsonp'


// 用于get或者post请求Json数据，也可以使用axios改写
export function getJson({url,type="GET",data={}, async = true }
	/*url域名，type请求类型，data请求数据 :?Object , async ?: bool 是否异步*/){
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest()
		type.toUpperCase() === "GET" ? get() : post()
		xhr.responseType = "json"
		xhr.onreadystatechange = handler
		xhr.send(data)
		// post 逻辑分割
		function post(){
			xhr.open('POST',url,async)
			xhr.setRequestHeader(
				"Content-type",
				"application/x-www-form-urlencoded"
			)
			data = parse(data)
		}
		// get 逻辑分割
		function get(){
			url += (url.indexOf('?') < 0 ? "?" : "&") + parse(data)
			xhr.open('GET',url,async)
			data = null
		}
		// success 回调
		function handler(){
			if(this.readyState !== 4){
				return
			}
			if(this.status === 200){
				resolve(this.response)
			} else {
				reject(new Error(this.statusText))
			}
		}
	})
}

