export const serverConfig = {
  port: +process.env.SERVER_PORT,
  hostname: process.env.SERVER_HOST
}

export const mongodbConfig = {
  host: process.env.MONGO_DB_HOST,
  port: +(process.env.MONGO_DB_PORT || '27017'),
  database: process.env.MONGO_DB_NAME
}

export const redisConfig = {
  host: process.env.REDIS_DB_HOST,
  port: +(process.env.REDIS_DB_PORT || '6379')
}

// 通过环境变量注入

export const qiniuConfig = {
  accessKey: process.env.QINIU_ACCESS_KEY,
  secretKey: process.env.QINIU_SECRET_KEY,
  bucketName: process.env.QINIU_BUCKET_NAME,
  bucketDomain: process.env.QINIU_BUCKET_DOMAIN,
  imageCoverStyle:
    process.env.QINIU_BUCKET_IMAGE_COVER_STYLE === 'false'
      ? ''
      : process.env.QINIU_BUCKET_IMAGE_COVER_STYLE,
  imagePreviewStyle:
    process.env.QINIU_BUCKET_IMAGE_PREVIEW_STYLE === 'false'
      ? ''
      : process.env.QINIU_BUCKET_IMAGE_PREVIEW_STYLE,
  bucketZone: process.env.QINIU_BUCKET_ZONE
}
