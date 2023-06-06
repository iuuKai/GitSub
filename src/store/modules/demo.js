import { defineStore } from 'pinia'

export const useDemoStore = defineStore({
	id: 'demo',
	state: () => ({
		user: {
			name: '张三',
			age: 22
		}
	})
})
