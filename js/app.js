;(function () {
	// const todos = [
	// 	{
	// 		id : 1,
	// 		title: '巴松hi姐',
	// 		completed: true
	// 	},{
	// 		id : 2,
	// 		title: '东京',
	// 		completed: true
	// 	},{
	// 		id : 3,
	// 		title: '捷达',
	// 		completed: false
	// 	}
	// ]
	Vue.directive('focus', {
		inserted: function (el) {
			el.focus()
		}
	}) 
	Vue.directive('todo-focus', {
		update (el, binding) {
			if (binding.value) {
				el.focus()
			}
		}
	})
	const app = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,
			filterText: 'all'
		},
		computed: {
			remaningCount () {
				return this.todos.filter(t => !t.completed).length
			},
			toggleAllStat: {
				get () {
					return this.todos.every(t => t.completed)
				},
				set () {
					const checked = !this.toggleAllStat
					this.todos.forEach(item => {
					item.completed = checked
				})
				}
			},

			filterTodos () {
				switch(this.filterText){
					case 'active':
						return this.todos.filter(t => !t.completed  )
						break
					case 'completed':
						return this.todos.filter(t => t.completed  )
						break
					default:
						return this.todos
						break
				}
			}
		},
		watch: {
			todos: {
				handler () {
				window.localStorage.setItem('todos', JSON.stringify(this.todos))
				},
				deep: true
			}
		},
		methods: {
			handleNewTodokeyDown (e) {
				// 注册事件 获取文本 数据交互 添加到 todo 清空文本框
				const target = e.target
				const value = target.value.trim()
				if (!value.length) {
					return
				}
				const todos = this.todos
				todos.push({
					id: todos.length ? todos[todos.length -1].id + 1 : 1,
					title: value,
					completed: false
				})
				target.value = ''
			},
			handleToggleAllChange (e) {
				const checked = e.target.checked
				
				this.todos.forEach(item => {
					item.completed = checked
				})
			},

			handleRemoveTodoClick (item, index, e) {
				this.todos.splice(index, 1)
			},

			handleGetEditingDdlclick (item) {
				this.currentEditing = item
			},

			handleSaveEditKeydown (item, index, e) {
				const target = e.target
				const value = target.value.trim()
				if ( !value.length) {
					this.todos.splice(index, 1)
				}else{
					item.title = value
					this.currentEditing = null
				}
			},

			handleCancelEditEsc () {
				this.currentEditing = null
			},

			handleClearAllDoneClick () {
				for (let i = 0 ; i<this.todos.length; i++) {
					if (this.todos[i].completed) {
						this.todos.splice(i, 1)
						i--
					}
				}
			},

			getRemaningCount () {
				return this.todos.filter(t => !t.completed).length
			}
		}
	}).$mount('#app')
	window.onhashchange = function () {
		app.filterText = window.location.hash.substr(2)
	}
	window.onhashchange()
})()