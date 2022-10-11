import {
	BrowserWindow,
	ipcMain,
	Tray,
	Notification,
	nativeTheme,
	globalShortcut,
	dialog,
	SaveDialogOptions,
	OpenDialogOptions,
} from 'electron'
import path from 'path'
import fs from 'fs'
import * as nyanyalog from 'nyanyajs-log'

import {
	logo,
	systemConfig,
	notes,
	processName,
	priority,
	interval,
	msg,
	updateMsg,
} from '../config'
interface SaveAsOptions extends SaveDialogOptions {
	path?: string
}
export const saveAs = async (
	fileName: string,
	data: string,
	options?: SaveAsOptions
) => {
	const lastOpenFolderPath =
		(await systemConfig.get('lastOpenFolderPath')) ||
		process.env.HOME ||
		process.env.USERPROFILE
	const savePath = await dialog.showSaveDialog({
		defaultPath: (options?.path || lastOpenFolderPath) + '/' + fileName,
		...options,
		properties: [
			'showHiddenFiles',
			'showOverwriteConfirmation',
			'createDirectory',
		],
	})
	if (!savePath.canceled && savePath?.filePath) {
		await systemConfig.set(
			'lastOpenFolderPath',
			path.dirname(savePath.filePath)
		)
		// nyanyalog.info(savePath.canceled, savePath.filePath)
		// nyanyalog.info(path.dirname(savePath.filePath))
		fs.writeFileSync(savePath?.filePath, data)
	}
}

interface OpenFolderOptions extends OpenDialogOptions {}
export const openFolder = async (path: string, options?: OpenFolderOptions) => {
	const lastOpenFolderPath =
		path || (process.env.HOME || process.env.USERPROFILE) + '/meow-sticky-note'
	const openPath = await dialog.showOpenDialog({
		defaultPath: lastOpenFolderPath,
		...options,
		properties: ['showHiddenFiles', 'openDirectory', 'createDirectory'],
	})
	if (!openPath.canceled && openPath?.filePaths) {
		return openPath?.filePaths?.[0]
	}
	return ''
}

export const backup = async (backupNow: boolean = false) => {
	nyanyalog.info('backup')
	clearBackup()
	const backupAutomatically = JSON.parse(
		(await systemConfig.get('backupAutomatically')) || 'false'
	)
	const automaticBackupFrequency = Number(
		(await systemConfig.get('automaticBackupFrequency')) || 604800
	)
	const storagePath = await systemConfig.get('backupStoragePath')
	let lastBackupTime = (await systemConfig.get('lastBackupTime')) || 0

	// lastBackupTime = 0

	nyanyalog.info(backupAutomatically, storagePath)
	if (backupAutomatically && storagePath) {
		nyanyalog.info('开始备份')
		const timestamp = Math.floor(new Date().getTime() / 1000)

		if (backupNow || timestamp > lastBackupTime + automaticBackupFrequency) {
			const noteList = await notes.getAll()

			nyanyalog.info(noteList.length)
			nyanyalog.info('该备份了')

			const backupPath =
				storagePath + '/backup_' + moment().format('YYYY-MM-DD_hh:mm:ss')
			mkdirsSync(backupPath)

			noteList.forEach((v) => {
				fs.writeFileSync(
					backupPath + '/' + v.value.id + '.note',
					JSON.stringify(v.value, null, 2)
				)
			})

			await systemConfig.set('lastBackupTime', timestamp)
		} else {
			nyanyalog.info('还没到时间')
		}
	}
}

const clearBackup = async () => {
	try {
		// keepBackups
		nyanyalog.info('-----clearBackup-----')
		let keepBackups = Number(
			(await systemConfig.get('keepBackups')) || 120 * 365 * 24 * 3600
		)

		const storagePath = await systemConfig.get('backupStoragePath')
		// nyanyalog.info('keepBackups', storagePath, keepBackups)
		const files = fs.readdirSync(storagePath)
		// nyanyalog.info(files)
		const timestamp = Math.floor(new Date().getTime() / 1000)

		files.forEach((v) => {
			if (v.indexOf('backup_') === 0) {
				const createTime = Math.floor(
					new Date(v.replace('backup_', '').replace('_', ' ')).getTime() / 1000
				)
				// nyanyalog.info(createTime)
				const filePath = storagePath + '/' + v
				// nyanyalog.info(filePath)

				if (timestamp - createTime >= keepBackups) {
					nyanyalog.info(filePath, ' => 该删除了')
					removeDir(filePath)
				} else {
					// nyanyalog.info(filePath, ' => 不需要删除')
				}
			}
		})
	} catch (error) {
		nyanyalog.error(error)
	}
}

const mkdirsSync = (dirname: string) => {
	if (fs.existsSync(dirname)) {
		return true
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname)
			return true
		}
	}
}

const removeDir = (dir: string) => {
	let files = fs.readdirSync(dir)
	for (var i = 0; i < files.length; i++) {
		let newPath = path.join(dir, files[i])
		let stat = fs.statSync(newPath)
		if (stat.isDirectory()) {
			//如果是文件夹就递归下去
			removeDir(newPath)
		} else {
			//删除文件
			fs.unlinkSync(newPath)
		}
	}
	fs.rmdirSync(dir) //如果文件夹是空的，就将自己删除掉
}

import { PowerShell } from 'node-powershell'
import moment from 'moment'
import { appTray, getMenu } from '../taskMenu'

let timer: NodeJS.Timer
export let isStart = false
export let time = 0
export let lastTime = ''

export const start = () => {
	console.log('start', processName, priority, interval)
	isStart = true
	timer && clearInterval(timer)
	updateMsg('activated')
	runTask()
	timer = setInterval(async () => {
		runTask()
	}, 10000)
}

export const end = () => {
	isStart = false
	updateMsg('closed')
	clearInterval(timer)
}

export const runTask = async () => {
	processName.split('/').forEach(async (v) => {
		if (path.extname(v) === '.exe') {
			// console.log(v.trim())
			try {
				await PowerShell.$`Get-WmiObject Win32_process -filter 'name="vmware-vmx.exe"' | foreach-object { $_.SetPriority(${priority}) }`
				// console.log(await PowerShell.$`Get-WmiObject Win32_process -filter 'name="vmware-vmx.exe"' | foreach-object { $_.SetPriority(${priority}) }`)
			} catch (error) {
				console.error(error)
			}
		}
	})

	time++
	lastTime = moment().format('YYYY-MM-DD h:mm:ss')
	appTray.setContextMenu(getMenu())
}
