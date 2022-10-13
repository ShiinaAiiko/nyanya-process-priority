import { languages } from '../config'

export const resources = {
	'zh-CN': {
		configure: '配置',
		processName: '进程名',
		priority: '优先级',
		interval: '运行间隔',
		timers: '运行次数',
		lastRunTime: '最后运行时间',
		status: '状态',
		start: '开始',
		close: '关闭',

		languages: '多语言',
		enUS: 'English - 英文',
		zhCN: '中文(简体) - 中文(简体)',
		zhTW: '中文(繁體) - 中文(繁体)',

		quit: '退出',

		closed: '已关闭',
		activated: '已启动',

		about: '关于',
		version: '版本',
		github: 'Github',
	},
	'zh-TW': {
		configure: '配置',
		processName: '進程名',
		priority: '優先級',
		interval: '運行間隔',
		timers: '運行次數',
		lastRunTime: '最後運行時間',
		status: '狀態',
		start: '開始',
		close: '關閉',

		languages: '多語言',
		enUS: 'English - 英文',
		zhCN: '中文(简体) - 中文(簡體)',
		zhTW: '中文(繁體) - 中文(繁體)',

		quit: '退出',

		closed: '已關閉',
		activated: '已啟動',

		about: '關於',
		version: '版本',
		github: 'Github',
	},
	'en-US': {
		configure: 'Configure',
		processName: 'Process name',
		priority: 'Priority',
		interval: 'Interval',
		timers: 'Times',
		lastRunTime: 'Last run time',
		status: 'Status',
		start: 'Start',
		close: 'Close',

		languages: 'Languages',
		enUS: 'English - English',
		zhCN: '中文(简体) - Chinese(Simplified)',
		zhTW: '中文(繁體) - Chinese(Traditional)',

		quit: 'Quit',

		closed: 'Closed',
		activated: 'Activated',

		about: 'About',
		version: 'Version',
		github: 'Github',
	},
}

export const t = (parameter: keyof typeof resources['en-US']): string => {
	return resources?.[languages]?.[parameter] || parameter
}
