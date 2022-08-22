#!/usr/bin/env zx

// user config
const originName = 'code'
const serverName = 'code-editor'

// not care
const compressPkgName = `${originName}.server.tar.gz`
const user = 'root'
const origin = 'sugarat.top'
const fullOrigin = `${originName}.${origin}`
const baseServerDir = '/www/wwwroot'
const destDir = 'server'
const compressFile = ''

await $`echo ==🔧 压缩==`
await $`cd packages/server && tar -zvcf ${compressPkgName} dist package.json .env`

await $`echo ==🚀 上传到服务器 ==`
await $`cd packages/server && scp ${compressPkgName} ${user}@${origin}:./`
await $`cd packages/server && rm -rf ${compressPkgName}`

await $`echo ==✅ 部署代码 ==`
if (destDir) {
  await $`ssh -p22 ${user}@${origin} "mkdir -p ${baseServerDir}/${fullOrigin}/${destDir}"`
}
await $`ssh -p22 ${user}@${origin} "tar -xf ${compressPkgName} -C ${baseServerDir}/${fullOrigin}/${destDir}"`

await $`echo ==🌩 安装依赖 ==`
await $`ssh -p22 ${user}@${origin} "cd ${baseServerDir}/${fullOrigin}/${destDir} && pnpm install"`

await $`echo ==🏆︎ 重启服务 ==`
await $`ssh -p22 ${user}@${origin} "pm2 delete ${serverName} && cd ${baseServerDir}/${fullOrigin}/${destDir} && pm2 start npm --name ${serverName} -- run start"`
