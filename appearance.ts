import { BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { systemConfig } from './config'

export let mode: 'system' | 'light' | 'dark' = 'light'
export const setMode = async (m: 'system' | 'light' | 'dark') => {
	mode = m
	await systemConfig.set('mode', m)
}
export const initAppearance = async () => {
	mode = await systemConfig.get('mode')

	nativeTheme.themeSource = await systemConfig.get('mode')
	const nativeThemeOnUpdated = () => {
		nativeTheme.once('updated', () => {
			BrowserWindow?.getAllWindows()?.forEach((v) => {
				v?.webContents.send(
					'nativeThemeChange',
					nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
					mode
				)
			})
			setTimeout(() => {
				nativeThemeOnUpdated()
			}, 100)
		})
	}
	nativeThemeOnUpdated()
}
