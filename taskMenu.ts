import {
	BrowserWindow,
	globalShortcut,
	Tray,
	app,
	Menu,
	MenuItem,
	nativeTheme,
	ipcMain,
	ipcRenderer,
	Notification,
} from 'electron'
import { windows, openMainWindows, createWindow } from './windows'
import {
	initConfig,
	logo,
	systemConfig,
	taskIcon,
	processName,
	priority,
	interval,
	msg,
	languages,
	setLanguages,
} from './config'

import {
	isStart,
	time,
	lastTime,
	start,
	end,
	filterPriorityText,
} from './modules/methods'
import { t } from './modules/languages'
import { exec } from 'child_process'

import { version } from './package.json'

export let appTray: Tray

export const getMenu = () => {
	const contextMenu = Menu.buildFromTemplate([
		{
			label: t('configure'),
			click() {
				openMainWindows()
			},
		},
		{
			label: t('processName') + ' => ' + processName.split('/').join(', '),
			enabled: false,
		},
		{
			label:
				t('priority') + ' => ' + filterPriorityText(priority) + '/' + priority,
			enabled: false,
		},
		{
			label: t('interval') + ' => ' + interval + 'ms',
			enabled: false,
		},
		{
			label: t('timers') + ' => ' + time,
			enabled: false,
		},
		{
			label: t('lastRunTime') + ' => ' + lastTime,
			enabled: false,
		},
		{
			label: t('status') + ' => ' + msg,
			enabled: false,
		},
		{
			label: t('start'),
			checked: isStart,
			type: 'radio',
			click() {
				start()
				appTray.setContextMenu(getMenu())
			},
		},
		{
			label: t('close'),
			checked: !isStart,
			type: 'radio',
			click() {
				end()
				appTray.setContextMenu(getMenu())
			},
		},
		{
			label: t('languages'),
			submenu: [
				{
					label: t('enUS'),
					checked: languages === 'en-US',
					type: 'radio',
					click() {
						setLanguages('en-US')
					},
				},
				{
					label: t('zhCN'),
					checked: languages === 'zh-CN',
					type: 'radio',
					click() {
						setLanguages('zh-CN')
					},
				},
				{
					label: t('zhTW'),
					checked: languages === 'zh-TW',
					type: 'radio',
					click() {
						setLanguages('zh-TW')
					},
				},
			],
		},
		{
			label: t('about'),
			submenu: [
				{
					label: t('version') + ': ' + version,
					enabled: false,
				},
				{
					label: t('github'),
					click() {
						exec('start https://github.com/ShiinaAiiko/nyanya-process-priority')
					},
				},
			],
		},
		{
			label: t('quit'),
			click() {
				//ipc.send('close-main-window');
				app.quit()
			},
		},
	])
	return contextMenu
}

//系统托盘右键菜单
export const createTaskMenu = async (type?: 'pink' | 'white') => {
	appTray && appTray.destroy()
	//系统托盘图标目录
	// console.log(1, iconDir)
	// console.log(
	// 	2,
	// 	'/home/shiina_aiiko/Development/@Aiiko/ShiinaAiikoDevWorkspace/@OpenSourceProject/meow-sticky-note/client/public/favicon.ico'
	// )

	if (!type) {
		type = (await systemConfig.get('taskMenuIconType')) || 'pink'
	}
	await systemConfig.set('taskMenuIconType', type)

	let icon = type === 'pink' ? taskIcon : taskIcon
	appTray = new Tray(icon)
	// console.log(appTray)
	// console.log(iconDir)
	//图标的上下文菜单

	//设置此托盘图标的悬停提示内容
	appTray.setToolTip('NyaNay Process Priority')

	//设置此图标的上下文菜单
	appTray.setContextMenu(getMenu())
}
