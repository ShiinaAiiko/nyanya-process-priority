import {
	BrowserWindow,
	ipcMain,
	Tray,
	Notification,
	nativeTheme,
	globalShortcut,
	dialog,
} from 'electron'
import { APIParams } from '../typings/api'

import { windows, openMainWindows } from '../windows'
import { mode, setMode } from '../appearance'
import {
	logo,
	systemConfig,
	processName,
	priority,
	interval,
	updateProcessConfig,
	languages,
} from '../config'
import * as nyanyalog from 'nyanyajs-log'

export const R = (
	func: (options: {
		event: Electron.IpcMainEvent
		window: BrowserWindow
		data: APIParams
	}) => void
) => {
	return (event: Electron.IpcMainEvent, data: APIParams) => {
		const w = windows.get(data.route)
		w &&
			func({
				event,
				window: w,
				data,
			})
	}
}

export const initRouter = () => {
	ipcMain.on(
		'saveData',
		(
			event: Electron.IpcMainEvent,
			data: {
				processName: string
				priority: number
				interval: number
			}
		) => {
			updateProcessConfig(data)
		}
	)
	ipcMain.on('getData', (event: Electron.IpcMainEvent) => {
		windows.get('/').webContents.send('getData', {
			processName,
			priority,
			interval,
		})
	})

	ipcMain.on('getLanguages', (event: Electron.IpcMainEvent) => {
		windows.get('/').webContents.send('getLanguages', languages)
	})

	ipcMain.on(
		'showNotification',
		R(({ window, data }) => {
			const notification = new Notification({
				title: data.data.title || '',
				body: data.data.content || 'Nothing',
				icon: logo,
			})
			notification.show()
			if (data.data.timeout) {
				setTimeout(() => {
					notification.close()
				}, data.data.timeout || 5000)
			}
		})
	)

	ipcMain.on(
		'openDevTools',
		R(({ window }) => {
			console.log('opendevtools', window)
			window.webContents.openDevTools()
		})
	)
}
