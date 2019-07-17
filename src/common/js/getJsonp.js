import $ from 'jquery'

export default function getJsonp ({url , data, options}) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			type: 'get',
			data:data,
			dataType:'jsonp',
			jsonp:"jsonpCallback",
			success (response) {
				resolve(response)
			},
			error (e) {
				console.warn('jsonp请求失败')
				reject(e)
			}
		})
	})
}
