import {
	BrowserWindow,
	BrowserWindowConstructorOptions,
	globalShortcut,
	Tray,
	app,
	Menu,
	screen,
	MenuItem,
} from 'electron'
import path from 'path'

import isDev from 'electron-is-dev'

import { Route } from './typings/api'
import {
	taskIcon,
	systemConfig,
} from './config'

export const windows = new Map<Route, BrowserWindow>()

export interface BrowserWindowOPtions extends BrowserWindowConstructorOptions {
	visible: boolean
}

export const createWindow = async (
	route: Route,
	options: BrowserWindowOPtions
) => {
	let x = await systemConfig.get(route + 'x')
	let y = await systemConfig.get(route + 'y')
	console.log('systemConfig', await systemConfig.get(route + 'x'))
	console.log('systemConfig', await systemConfig.get(route + 'y'))

	const window = new BrowserWindow({
		...options,
		webPreferences: {
			...options.webPreferences,
			devTools: true,
		},
		icon: taskIcon,
	})

	if (process.platform === 'darwin') {
		app.dock.setIcon(taskIcon)
	}

	if (!x) {
		window.center()
	} else {
		window.setPosition(x, y)
	}
	if (options.visible) {
		window.show()
	} else {
		window.hide()
	}
	const queryStr = '?route=' + route + '&time=' + new Date().getTime()
	let dev = isDev
	// dev = false
	// window.loadURL('http://localhost:16111' + route + queryStr)
	// window.loadURL(
	// 	dev
	// 		? 'http://localhost:16111' + route + queryStr
	// 		: `file://${path.join(__dirname, '../build/index.html')}` + queryStr,
	// 	{ extraHeaders: 'pragma: no-cache' }
	// )
	// console.log(`file://${path.join(__dirname, '../../../build/index.html')}`)

	window.loadURL(`file://${path.join(__dirname, '../public/index.html')}`, {
		extraHeaders: 'pragma: no-cache',
	})
	window.webContents.openDevTools()
	setTimeout(() => {
		if (options?.webPreferences?.devTools) {
			window.webContents.openDevTools()
		} else {
			window.webContents.closeDevTools()
		}
	})
	window.on('show', () => {
		console.log('show')
	})
	window.on('closed', () => {
		console.log('closed')
		windows.delete(route)
	})
	window.on('move', async (e: any) => {
		const [x, y] = window.getPosition()
		await systemConfig.set(route + 'x', x)
		await systemConfig.set(route + 'y', y)
	})
	window.setMenu(null)
	windows.set(route, window)
	return window
}
const menu = new Menu()
menu.append(
	new MenuItem({
		label: 'Electron',
		submenu: [
			{
				role: 'help',
				accelerator:
					process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
				click: () => {
					console.log('Electron rocks!')
				},
			},
		],
	})
)

export const openMainWindows = async () => {
	let window = windows.get('/')
	if (window) {
		window.show()
		// window.focus()
		window.webContents.send('show')
		return window
	}
	return await createWindow('/', {
		title: 'Meow Sticky Note',
		width: 450,
		height: 450,
		// x: 0,
		// y: 0,
		skipTaskbar: false,
		hasShadow: true,
		alwaysOnTop: false,
		fullscreen: false, 
		// center: true,
		// 可以隐藏窗口
    frame: true,
    useContentSize: false,
    resizable:false,
		// backgroundColor: 'rgba(0,0,0,0.3)',

		webPreferences: {
			devTools: false,
			nodeIntegration: true,
			contextIsolation: false,
		},
		visible: true,
	})
}
