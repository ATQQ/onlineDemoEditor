#!/usr/bin/env zx

// user config
const originName = 'code'

// not care
const compressPkgName = `${originName}.tar.gz`
const user = 'root'
const origin = 'sugarat.top'
const fullOrigin = `${originName}.${origin}`
const baseServerDir = '/www/wwwroot'
const destDir = ''

await $`pnpm build`
await $`echo ---------------------部署客户端------------------------------`
await $`echo ==🔧 压缩dist ==`
await $`cd packages/client && tar -zvcf ${compressPkgName} dist`

await $`echo ==🚀 上传到服务器 ==`
await $`scp packages/client/${compressPkgName} ${user}@${origin}:./`
await $`rm -rf packages/client/${compressPkgName}`

await $`echo ==✅ 部署代码 ==`
await $`ssh -p22 ${user}@${origin} "tar -xf ${compressPkgName} -C ${baseServerDir}/${fullOrigin}/${destDir}"`
