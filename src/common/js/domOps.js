import { capitalize } from './tools'

// 为一个dom元素添加一个或者多个class
export function addClass (el, classes
	/*el:dom, classes?:string|Array*/) {
	if(Array.isArray(classes)){
		classes.forEach((cur) => {
			if(!hasClass(cur)){
				el.classList.add(cur)
			}
		})
		return
	}
	if(!hasClass(classes)){
		el.classList.add(classes)
	}
}

// 判断一个dom元素是否有某一个class
export function hasClass (el, target
	/*el:dom, target?:string*/) {
	return el.classList.contains(target)
}

// 通过proxy代理式创建DOM树
export const dom = new Proxy({}, {
	get (target, property) {
		return function (attrs = {}, ...children) {
			const el = document.createElement(property)
			for(let prop of Object.keys(attrs)) {
				el.setAttribute(prop, attrs[prop])
			}
			for(let child of children) {
				// children可能带入的是一个字符串也可能就是一个原生的DOM节点
				if(typeof child === 'string'){
					child = document.createTextNode(child)
				}
				el.appendChild(child)
			}
			return el
		}
	}
})

// 用来判断对象是否为元素节点
export function isDom (el) {
	//首先要对HTMLElement进行类型检查，因为即使在支持HTMLElement
    //的浏览器中，类型却是有差别的，在Chrome,Opera中HTMLElement的
	//类型为function
	var res = (typeof HTMLElement === 'object' ||
			  typeof HTMLElement === 'function')
	 			? (function () {
					 return el instanceof HTMLElement
				 })()
				: (function () {
					return el &&
						   typeof el === 'object' &&
						   el.nodeType === 1 &&
						   typeof el.nodeName === 'string'
				})()
	return res
}

// 获取或者设置dom的dataset属性，获取或设置取决于val是否存在
export function getDataset (el, key, val) {
	if(!isDom(el)) {
		// 如果目标并不是一个DOM，直接返回
		return false
	}
	let res = null
	if(key !== undefined && val){
		el.setAttribute(`data-${key}`, val)
	} else {
		// 如果key下对应的值是个可以转换为数值的字符串就转换成浮点数
		res = !isNaN(el.dataset[key]) ? parseFloat(el.dataset[key]) : res
	}
	return res
}



let vendor = (() => {  // vender : String
	const div = dom.div() // 创建div
	const transformNames = {
		'webkit': 'webkitTransform',
		'Moz': 'MozTransform',
		'O': 'OTransform',
		'ms': 'msTransform',
		'standard' :'transform'
	}

	for(let key in transformNames) {
		if(typeof div.style[transformNames[key]] !== 'undefined'){
			return key
		}
	}

	return false // 如果返回false说明浏览器压根就不支持transform
})()

// 自动添加适配当前浏览器的厂商前缀
export function prefixStyle (style) { // style : String
	if(vendor === false) {
		return false // 浏览器可能不支持CSS3
	}
	if(vendor === 'standard') {
		return style
	}
	return vendor + capitalize(style)
}

let _uid = 0

// 获取dom相对于窗口的总偏移量
export function getSumOffset (el, bol = true
	/*目标元素el ?: DOM, 是否接受el是null就返回left和top都是0的对象bol ?: true */) {
	if(
        (el === null && !bol) ||
        el === undefined ||
        (!isDom(el) && !bol)
    ) {
		console.log(
			// display为none，获取的offsetParent为null。无法计算偏移量
			`${el}不是一个dom元素节点或为null或未带入参数。请检查你的el是否真正的获取到了dom，或者el的display为none?`
		)
        return false
	}
	if(el === null) {
		return {
			left: 0,
			top: 0
		}
	} else {
		const parent = el.offsetParent
		let left = el.offsetLeft
		let top = el.offsetTop
		if(parent !== document.body && el !== document.body ){
			const rect = getSumOffset(parent, bol)   // 非严格模式下可以使用arguments.callee和函数本身的名称解耦
			left += rect.left
			top += rect.top
		}
		return {left, top}
	}
}
