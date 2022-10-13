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
import { appTray, getMenu } from './taskMenu'
import { t } from './modules/languages'
import { windows } from './windows'

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
export let msg = t('closed')
export let languages = 'en-US'

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

export const setLanguages = async (lang: string) => {
	languages = lang
	await systemConfig.set('language', languages)
	appTray.setContextMenu(getMenu())
	windows.get('/')?.webContents?.send('getLanguages', languages)
}

// 自动获取本机目录
export let userHome = process.env.HOME || process.env.USERPROFILE
const cacheRootDir = userHome + '/.cache'
const configRootDir = userHome + '/.config'
// 'mode' | 'language'

// console.log("userHome",process.)

nyanyalog.info('isDev', isDev)
nyanyalog.info('__dirname', __dirname)
let staticPath = isDev ? '../public' : '../public'

export const taskIcon = path.join(path.join(__dirname, staticPath), 'logo.png')

export const logo = path.join(path.join(__dirname, staticPath), 'logo.png')

let labelPrefix = isDev ? 'dev_' : ''

export const systemConfig = new NodeFsStorage<any>({
	label: labelPrefix + 'systemConfig',
	cacheRootDir: configRootDir + '/nyanya-progress-priority/s',
	// encryption: {
	// 	enable: false,
	// 	key: 'nyanya-progress-priority',
	// },
})
export const initConfig = async () => {
	NodeFsStorage.baseRootDir = cacheRootDir + "'/nyanya-progress-priority/u'"

	await systemConfig.getAndSet('language', (v): any => {
		languages = v ? v : languages
		return languages
	})
	await systemConfig.getAndSet('mode', (v) => {
		return v ? v : 'system'
	})

	electronRouter(ipcMain)
}
