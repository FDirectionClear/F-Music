let viewHeight

export function Flazyload () { // 暂时支持img
	// console.log('Flazyload执行')
	// 缓存viewHeigth
	viewHeight = typeof viewHeight === 'undefined'
		? document.documentElement.clientHeight  // 获取视口的高度
		: viewHeight
	let imgs = document.querySelectorAll('img[lazyload][data-original]') // img具有lazyload特性和data-original
	imgs.forEach((imgItem) => {
		if(!imgItem.dataset.original)
			// 防止original的值可能来自异步，当值还没来的时候就不做处理
			return
		let rect = imgItem.getBoundingClientRect()
		if(rect.bottom > 0 && rect.top < viewHeight){
			imgItem.src = imgItem.dataset.original
			imgItem.removeAttribute('lazyload')
			imgItem.removeAttribute('data-original')
		}
	})
}
