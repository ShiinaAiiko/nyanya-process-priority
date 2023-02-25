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
// import * as nyanyalog from 'nyanyajs-log'

import {
	logo,
	systemConfig,
	processName,
	priority,
	interval,
	msg,
	updateMsg,
} from '../config'

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
import { t } from './languages'

let timer: NodeJS.Timer
export let isStart = false
export let time = 0
export let lastTime = ''

export const start = () => {
	console.log('start', processName, priority, interval)
	isStart = true
	timer && clearInterval(timer)
	updateMsg(t('activated'))
	runTask()
	timer = setInterval(async () => {
		updateMsg(t('activated'))
		runTask()
	}, 10000)
}

export const end = () => {
	isStart = false
	updateMsg(t('closed'))
	clearInterval(timer)
}

export const runTask = async () => {
	console.log(2121)
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
	lastTime = moment().format('YYYY-MM-DD HH:mm:ss')
	appTray.setContextMenu(getMenu())
}

export const filterPriorityText = (priority: number) => {
	switch (priority) {
		case 256:
			return 'Realtime'
		case 128:
			return 'High'
		case 32:
			return 'AboveNormal'
		case 16384:
			return 'Normal'
		case 16384:
			return 'BelowNormal'
		case 64:
			return 'Low'

		default:
			break
	}
}
