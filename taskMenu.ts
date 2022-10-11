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
	taskWhiteIcon,
	processName,
	priority,
	interval,
	msg,
} from './config'

import { isStart, time, lastTime, start, end } from './modules/methods'

export let appTray: Tray

export const getMenu = () => {
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Configure',
			click() {
				openMainWindows()
			},
		},
		{
			label: 'Process => ' + processName.split('/').join(", "),
			enabled: false,
		},
		{
			label: 'Priority => ' + priority,
			enabled: false,
		},
		{
			label: 'Interval => ' + interval + 'ms',
			enabled: false,
		},
		{
			label: 'Times => ' + time,
			enabled: false,
		},
		{
      label: 'Last run time => ' + lastTime,
			enabled: false,
		},
		{
			label: 'status => ' + msg,
			enabled: false,
		},
		{
			label: 'Start',
			checked: isStart,
			type: 'radio',
			click() {
				start()
				appTray.setContextMenu(getMenu())
			},
		},
		{
			label: 'Close',
			checked: !isStart,
			type: 'radio',
			click() {
				end()
				appTray.setContextMenu(getMenu())
			},
		},
		{
			label: 'Quit',
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

	let icon = type === 'pink' ? taskIcon : taskWhiteIcon
	appTray = new Tray(icon)
	// console.log(appTray)
	// console.log(iconDir)
	//图标的上下文菜单

	//设置此托盘图标的悬停提示内容
	appTray.setToolTip('NyaNay Process Priority')

	//设置此图标的上下文菜单
	appTray.setContextMenu(getMenu())
}
