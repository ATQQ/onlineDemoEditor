/**
 * 环境变量配置
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * 启动服务监听端口
     * @default 3000
     */
    SERVER_PORT: string
  }
}
