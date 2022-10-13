# nyanya-process-priority

For Windows to set process priority, 持久化设置进程优先级（譬如用于 VMware 虚拟机，使其后台也能保持高性能）

# 典型使用场景

## VMware 虚拟机

譬如需要 VMware 虚拟机作为高性能环境的喵星人，想持续使虚拟机处在高性能状态。
<br>

VMware 配置是可以在抓取到输入内容时为高优先级。
如果你在虚拟机环境外进行其他任务，虚拟机进入后台时，丢失了抓取状态，优先级则会变为正常。
如若你的虚拟机正在编译任务，因优先级降低，虚拟机的性能将会大幅降低。

而 Windows 任务管理员也只能临时设置优先级。
<br>

这就是本程序存在的主要目的。
持久化保持高优先级，使得虚拟机处在后台也能高强度工作。

# 使用方式

## 1、下载并安装 nyanya-process-priority

前往 [Releases](https://github.com/ShiinaAiiko/nyanya-process-priority/releases) 下载最新版安装即可。

## 2、打开应用并配置 nyanya-process-priority

安装完毕后。
利用管理员权限打开应用。（因设置高优先级需管理员权限）
此时即可以在任务栏见到程序图标。

配置方式：
=> 右键任务栏图标
=> 点击配置 (Configure)
=> 输入需要持久化的进程名
=> 输入优先级 (可以根据需要填写不同的数字，优先级对应的数字见输入框下方提示)
=> 输入执行间隔 (单位 ms，默认 10000ms，指执行设置行为的间隔)
=> 保存 (Save) （保存的同时会自动启动）
