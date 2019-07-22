// 该文件用来存放各种接口的请求公用数据，防止代码冗余
export const commonParams = {
	g_tk: '618048824',
	loginUin: '947288309',
	format: 'json',
	inCharset: 'utf-8',
	outCharset: 'utf-8',
	notice: '0',
	platform: 'h5',
	needNewCode: 0
}

export const jsonpOptions = {
	param: 'jsonpCallback',
	prefix: 'jp'
}

export const ERR_OK = 0 // 返回数据成功的状态码
