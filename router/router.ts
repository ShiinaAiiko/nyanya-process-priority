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
} from '../config'
import { saveAs, openFolder, backup } from '../modules/methods'
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

	ipcMain.on(
		'setMode',
		R(({ window, data }) => {
			setMode(data.data.mode)
			nativeTheme.themeSource = mode
		})
	)

	ipcMain.on(
		'openMainProgram',
		R(({ window, data }) => {
			openMainWindows()
		})
	)

	ipcMain.on(
		'openSso',
		R(({ window, data }) => {
			openMainWindows()
		})
	)

	ipcMain.on(
		'hideWindow',
		R(({ window, data }) => {
			window.hide()
		})
	)

	ipcMain.on(
		'getMode',
		R(({ window, data }) => {
			window.webContents.send(
				'nativeThemeChange',
				mode === 'system'
					? nativeTheme.shouldUseDarkColors
						? 'dark'
						: 'light'
					: mode,
				mode
			)
		})
	)

	ipcMain.on(
		'updateData',
		R(({ window, data }) => {
			console.log('updateData', data)
			windows.forEach((v) => {
				nyanyalog.info(v.id, window.id)
				if (v.id !== window.id) {
					v.webContents.send('updateData')
				}
			})
		})
	)

	ipcMain.on(
		'updateProfile',
		R(({ window, data }) => {
			windows.forEach((v) => {
				// nyanyalog.info(v.id, window.id)
				if (v.id !== window.id) {
					v.webContents.send('updateProfile')
				}
			})
		})
	)

	ipcMain.on(
		'updateSetting',
		R(({ window, data }) => {
			windows.forEach((v) => {
				// nyanyalog.info(v.id, window.id)
				if (v.id !== window.id) {
					v.webContents.send('updateSetting', {
						type: data.data.type,
					})
				}
			})
		})
	)

	ipcMain.on(
		'saveAs',
		R(({ window, data }) => {
			saveAs(data.data.fileName, data.data.file, {
				filters: [{ name: 'Files', extensions: [data.data.extensions] }],
			})
		})
	)

	ipcMain.on(
		'openFolder',
		R(({ window, data }) => {
			openFolder(data.data.lastFolderPath, {}).then((v) => {
				window.webContents.send('openFolder', {
					type: data.data.type,
					path: v,
				})
			})
		})
	)

	ipcMain.on(
		'backup',
		R(({ window, data }) => {
			backup(data.data.backupNow)
		})
	)
}
