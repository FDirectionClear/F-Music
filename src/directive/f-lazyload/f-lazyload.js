let viewHeight

export function flazyload (el, binding){
	// if(el.src)
	// 	return
	// viewHeight = typeof viewHeight === 'undefined'
	// 	? document.documentElement.clientHeight  // 缓存视口的高度
	// 	: viewHeight
	// if(!binding.expression)
	// 	return
	// let rect = el.getBoundingClientRect()
	// if(rect.bottom > 0 && rect.top < viewHeight){
	// 	el.src = binding.expression
	// }
	let parent = el.parentNode
	while(parent !== window){
		parent.addEventListener(scroll, (e)=>{
			this.insert()
		})
	}
}


// https://cn.vuejs.org/v2/guide/custom-directive.html
// https://www.jb51.net/article/112355.htm
