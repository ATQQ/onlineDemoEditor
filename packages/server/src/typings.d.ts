import 'flash-wolves'

declare module 'flash-wolves' {
  interface RouteMeta {
    // 需要鉴权
    requiresAuth?: boolean
  }
}

/**
 * 环境变量配置
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // MongoDB数据库相关
    /**
     * 主机地址（域名||ip）
     * @default 'localhost'
     */
    MONGO_DB_HOST: string
    /**
     * 端口号
     * @default 27017
     */
    MONGO_DB_PORT: string
    /**
     * 数据库名
     * @default 'online-editor'
     */
    MONGO_DB_NAME: string
    // Redis 数据库相关
    /**
     * 主机地址（域名||IP）
     * @default ‘127.0.0.1’
     */
    REDIS_DB_HOST: string
    /**
     * 端口号
     * @default 6379
     */
    REDIS_DB_PORT: string

    // 服务相关
    /**
     * 启动服务监听端口
     * @default 6654
     */
    SERVER_PORT: string
    /**
     * 服务主机地址
     * @default 'localhost'
     */
    SERVER_HOST: string

    // 七牛云相关
    /**
     * AccessKey
     */
    QINIU_ACCESS_KEY: string
    /**
     * SecretKey
     */
    QINIU_SECRET_KEY: string
    /**
     * OSS存储空间名
     */
    QINIU_BUCKET_NAME: string
    /**
     * OSS存储空间绑定的域名
     */
    QINIU_BUCKET_DOMAIN: string
    /**
     * 七牛云图片封面压缩样式
     */
    QINIU_BUCKET_IMAGE_COVER_STYLE: string
    /**
     * 七牛云图片预览压缩样式
     */
    QINIU_BUCKET_IMAGE_PREVIEW_STYLE: string
    /**
     * 七牛云存储空间所选区域
     * @default 'huanan'
     */
    QINIU_BUCKET_ZONE: string
  }
}
