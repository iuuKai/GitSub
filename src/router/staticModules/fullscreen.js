const FullScreen = {
	path: '/fullscreen/:path?',
	name: 'FullScreen',
	component: () => import('@/views/FullScreen/index.vue'),
	children: []
}

export default FullScreen
