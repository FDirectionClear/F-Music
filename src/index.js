import 'common/style/index'
import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import store from '@/store/index'

import fastclick from 'fastclick'

fastclick.attach(document.body)


new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

localStorage.setItem('name','方向明')

console.log(`localStorage:${localStorage.getItem('name')}`)

function openDB (myDB) {
	let request = window.indexedDB.open(myDB.name)
	request.onerrer = (e) => {
		console.log("open indexedDB error!")
	}
	request.onsuccess = (e) => {
		console.log('open indexedDB success!')
		myDB.db = e.target.result
	}

	request.onupgradeneeded = () => {
		console.log('upgradeneeded!')
		var store = request.result.createObjectStore('books', {
			keyPath: 'isbn'
		})

		var title = store.createIndex('by_title', 'title', {
			unique : true
		})

		var authorIndex = store.createIndex('by_author', 'author')

		store.put({
			title: '七龙珠',
			author: '鸟山明',
			isbn: 123456
		})

		store.put({
			title: '百变小樱魔术卡',
			author: '爱心屋',
			isbn: 234567
		})

		store.put({
			title: '请问要点兔子么',
			author: '芳文社',
			isbn: 345678
		})

		store.put({
			title: '川柳少女',
			author: '芳文社',
			isbn: 456789
		})
	}
}

function zsgc ({ db }) {
	var transaction = db.transaction('books', 'readwrite')
	var store = transaction.objectStore('books')

	// 查找数据的消耗性能是出了名的，查找数据是一个异步的过程，核心方法是store.get()。
	// 修改数据也是一个异步的过程，核心方法是store.put。当带入put的参数中的keyPath是一个已经
	// 存在的数据，那么put将会修改这个keyPath下对应的数据，如果keyPath之前并不存在，那就将这个
	// 数据添加进ObjectStore中

	// 为了方便演示，接下来我们要做的是先从ObjectStore中找到'川柳少女'这一条数据，然后修改他的
	// 作者为'Mad House'，也就是先经历一个获取，在经历一个修改的过程
	store.get(456789).onsuccess = function (e) {
		var book = e.target.result
		book.author = 'Mad House'
		console.log(`获取到原来的川柳少女信息：`)
		console.log(book)
		var req = store.put(book)
		req.onsuccess = function (e) {
			console.log('update <川柳少女> success !')
		}
	}
}

const myDB = {
	name: 'fangDB',
	version:'1.0.0',
	db: null
}

openDB(myDB)

setTimeout(()=>{
	zsgc(myDB)
},3000)


