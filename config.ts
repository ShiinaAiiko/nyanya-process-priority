import {
	BrowserWindow,
	nativeImage,
	Tray,
	ipcMain,
	nativeTheme,
} from 'electron'
import { NodeFsStorage, electronRouter } from '@nyanyajs/utils/dist/node'

import path from 'path'
import isDev from 'electron-is-dev'
import * as nyanyalog from 'nyanyajs-log'
import { start } from './modules/methods'

nyanyalog.config({
	format: {
		function: {
			fullFunctionChain: false,
		},
		prefixTemplate: '[{{Timer}}] [{{Type}}] [{{File}}]@{{Name}}',
	},
})

export let processName = ''
export let priority = 128
export let interval = 10000
export let msg = 'closed'

setTimeout(() => {
	console.log('processName', processName)
}, 1000)

export const initProcessConfig = async () => {
	const data = await systemConfig.get('processConfig')

	if (data?.processName) {
		processName = data.processName
		priority = data.priority
		interval = data.interval
	}
}

export const updateProcessConfig = async (data: {
	processName: string
	priority: number
	interval: number
}) => {
	processName = data.processName
	priority = data.priority
	interval = data.interval
	start()
	await systemConfig.set('processConfig', data)
}

export const updateMsg = async (data: string) => {
	msg = data
}

// 自动获取本机目录
export let userHome = process.env.HOME || process.env.USERPROFILE
const cacheRootDir = userHome + '/.cache'
const configRootDir = userHome + '/.config'
// 'mode' | 'language'

nyanyalog.info('isDev', isDev)
nyanyalog.info('__dirname', __dirname)
let staticPath = isDev ? '../public' : '../public'

export const taskIcon = path.join(path.join(__dirname, staticPath), 'logo.png')
// export const taskIcon = path.join(
// 	path.join(__dirname, staticPath),
// 	'logo-neko.png'
// )
// export const taskIcon2 = path.join(
// 	path.join(__dirname, staticPath),
// 	'logo-neko2.png'
// )

let labelPrefix = isDev ? 'dev_' : ''

export const systemConfig = new NodeFsStorage<any>({
	label: labelPrefix + 'systemConfig',
	cacheRootDir: configRootDir + '/nyanya-progress-priority/s',
	// encryption: {
	// 	enable: false,
	// 	key: 'nyanya-progress-priority',
	// },
})
export const notes = new NodeFsStorage<any>({
	label: labelPrefix + 'notes',
	cacheRootDir: cacheRootDir + '/nyanya-progress-priority/u',
})
export const global = new NodeFsStorage<any>({
	label: labelPrefix + 'global',
	cacheRootDir: cacheRootDir + '/nyanya-progress-priority/u',
})
export const initConfig = async () => {
	NodeFsStorage.baseRootDir = cacheRootDir + "'/nyanya-progress-priority/u'"

	await systemConfig.getAndSet('language', (v) => {
		return v ? v : 'en-US'
	})
	await systemConfig.getAndSet('mode', (v) => {
		return v ? v : 'system'
	})
	// const userConfig = new NodeFsStorage<string, any>({
	// 	baseLabel: 'userConfig',
	// 	cacheRootDir: configRootDir + '/nyanya-progress-priority/u',
	// 	encryption: {
	// 		enable: false,
	// 		key: 'nyanya-progress-priority',
	// 	},
	// })
	// console.log(userConfig)

	// userConfig.set('language', 'zh-CN')

	electronRouter(ipcMain)
}
